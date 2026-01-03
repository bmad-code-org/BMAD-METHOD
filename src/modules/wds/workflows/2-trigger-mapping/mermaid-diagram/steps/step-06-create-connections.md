# Step 06: Create Connections

**Goal:** Connect all nodes in the proper flow: Goals → Platform → Groups → Forces

---

## Connection Pattern

```
Business Goals → Platform → Target Groups → Driving Forces
```

**Visual:**
```
BG0 ──┐
BG1 ──┼──→ PLATFORM ──┬──→ TG0 ──→ DF0
BG2 ──┘               ├──→ TG1 ──→ DF1
                      └──→ TG2 ──→ DF2
```

---

## Instructions

### 1. Business Goals to Platform

**Connect all BG nodes to PLATFORM:**

```
%% Business Goals to Platform
BG0 --> PLATFORM
BG1 --> PLATFORM
BG2 --> PLATFORM
```

**Rules:**
- Every BG node connects to PLATFORM
- Use simple arrow `-->`
- Add comment header

---

### 2. Platform to Target Groups

**Connect PLATFORM to all TG nodes:**

```
%% Platform to Target Groups
PLATFORM --> TG0
PLATFORM --> TG1
PLATFORM --> TG2
```

**Rules:**
- PLATFORM connects to every TG node
- Use simple arrow `-->`
- Add comment header

---

### 3. Target Groups to Driving Forces

**Connect each TG to its corresponding DF:**

```
%% Target Groups to Driving Forces
TG0 --> DF0
TG1 --> DF1
TG2 --> DF2
```

**Rules:**
- TG0 → DF0, TG1 → DF1, etc. (matching IDs)
- Use simple arrow `-->`
- Add comment header

---

### 4. Complete Example

```mermaid
%% Connections
BG0 --> PLATFORM
BG1 --> PLATFORM
BG2 --> PLATFORM
PLATFORM --> TG0
PLATFORM --> TG1
PLATFORM --> TG2
TG0 --> DF0
TG1 --> DF1
TG2 --> DF2
```

---

## Rules Checklist

- [ ] All BG nodes connect to PLATFORM
- [ ] PLATFORM connects to all TG nodes
- [ ] Each TG connects to matching DF (TG0→DF0, etc.)
- [ ] Use simple arrows `-->` (no fancy styling)
- [ ] Include section comments
- [ ] No broken connections
- [ ] Connections listed in logical order

---

## Connection Verification

**Count check:**
- BG connections = number of business goals
- Platform-to-TG connections = number of personas
- TG-to-DF connections = number of personas

**Example for 3 personas:**
- 3 BG → PLATFORM
- 3 PLATFORM → TG
- 3 TG → DF
- **Total: 9 connections**

---

## Output

Store:
- `connections`: All connection statements
- `connection_count`: For verification

---

## Next Step

→ **[Step 07: Apply Styling](step-07-apply-styling.md)**

Apply professional light gray styling with dark text.

