# Tmux Long Command Testing & Investigation

**Related:** See `tmux-long-command-debugging.md` for root cause analysis and solution.

---

## Investigation Process

### Step 1: Verify Command Syntax

First, confirm the command itself is valid:

```bash
# Build the command
cmd=$("$scripts" tmux-wrapper build-cmd retro 2 --agent "claude")

# Check for syntax issues
echo "$cmd" | od -c | head -20  # Look for unexpected characters

# Test parsing
bash -n -c "$cmd"  # Syntax check only
```

**Finding:** Command syntax was correct. Quotes and escapes were properly formed.

### Step 2: Test Progressive Lengths

Binary search to find the breaking point:

```bash
test_length() {
    local len=$1
    local sess="test-len-$len-$$"
    local prompt="bmad-retrospective 2 $(printf 'x%.0s' $(seq 1 $len))"

    tmux new-session -d -s "$sess"
    tmux send-keys -t "$sess" "claude --dangerously-skip-permissions \"$prompt\"" Enter
    sleep 5

    local capture=$(tmux capture-pane -t "$sess" -p)
    tmux kill-session -t "$sess" 2>/dev/null

    if echo "$capture" | grep -qiE "interrupt|Working|Running"; then
        echo "Length $len: SUCCESS"
    else
        echo "Length $len: FAILED"
    fi
}

# Test different lengths
test_length 200   # SUCCESS
test_length 500   # SUCCESS
test_length 800   # SUCCESS
test_length 1000  # SUCCESS
test_length 1200  # FAILED
```

**Finding:** Commands failed around 1000-1200 characters.

### Step 3: Test Terminal Width Hypothesis

```bash
# Default dimensions
sess="test-default-$$"
tmux new-session -d -s "$sess"
tmux display -t "$sess" -p 'cols:#{pane_width} rows:#{pane_height}'
# Output: cols:80 rows:24

# Send long command
tmux send-keys -t "$sess" "$long_cmd" Enter
sleep 10
# Result: FAILED - no activity

# Wide terminal
sess="test-wide-$$"
tmux new-session -d -s "$sess" -x 200 -y 50
tmux display -t "$sess" -p 'cols:#{pane_width} rows:#{pane_height}'
# Output: cols:200 rows:50

# Send same long command
tmux send-keys -t "$sess" "$long_cmd" Enter
sleep 10
# Result: SUCCESS - Claude running!
```

**Finding:** Wide terminal (200 cols) prevents the failure.

### Step 4: Understand the Mechanism

The shell's line editor (readline/zle) handles input differently when lines wrap:

1. **Normal input:** Characters arrive, shell builds command buffer
2. **Wrapped input:** Terminal sends characters that visually wrap
3. **Problem:** Some shell/terminal combinations mishandle the wrap points
4. **Result:** Command buffer corruption or premature execution

This is why the command "appears" in the terminal (tmux captured it) but doesn't execute properly (shell didn't parse it correctly).

---

## Testing Methodology

### Quick Smoke Test

```bash
#!/bin/bash
# smoke-test-tmux-command.sh

cmd="$1"
cmd_len=${#cmd}

echo "Testing command of length: $cmd_len"

# Test with default dimensions
sess="smoke-default-$$"
tmux new-session -d -s "$sess"
tmux send-keys -t "$sess" "$cmd" Enter
sleep 5
if tmux capture-pane -t "$sess" -p | grep -qiE "interrupt|Working|Running|Read"; then
    echo "Default (80x24): SUCCESS"
else
    echo "Default (80x24): FAILED"
fi
tmux kill-session -t "$sess" 2>/dev/null

# Test with wide dimensions
sess="smoke-wide-$$"
tmux new-session -d -s "$sess" -x 200 -y 50
tmux send-keys -t "$sess" "$cmd" Enter
sleep 5
if tmux capture-pane -t "$sess" -p | grep -qiE "interrupt|Working|Running|Read"; then
    echo "Wide (200x50): SUCCESS"
else
    echo "Wide (200x50): FAILED"
fi
tmux kill-session -t "$sess" 2>/dev/null
```

### Comprehensive Test

```bash
#!/bin/bash
# test-tmux-long-commands.sh

test_at_width() {
    local width=$1
    local cmd_len=$2
    local sess="test-w${width}-l${cmd_len}-$$"

    # Generate command of specific length
    local padding=$(printf 'x%.0s' $(seq 1 $cmd_len))
    local cmd="echo \"test $padding\""

    tmux new-session -d -s "$sess" -x "$width" -y 24
    tmux send-keys -t "$sess" "$cmd" Enter
    sleep 2

    local output=$(tmux capture-pane -t "$sess" -p)
    tmux kill-session -t "$sess" 2>/dev/null

    if echo "$output" | grep -q "test xxx"; then
        echo "Width $width, Length $cmd_len: PASS"
        return 0
    else
        echo "Width $width, Length $cmd_len: FAIL"
        return 1
    fi
}

# Test matrix
for width in 80 120 160 200; do
    for len in 500 1000 1500 2000; do
        test_at_width $width $len
    done
done
```

---

## References

- tmux manual: `man tmux` (see `new-session` options)
- Shell line editing: readline (bash) / zle (zsh)
- Related issue: Commands with many arguments or long strings failing in tmux
