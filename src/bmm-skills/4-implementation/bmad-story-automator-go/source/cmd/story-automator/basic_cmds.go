package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func cmdDeriveProjectSlug(args []string) int {
	projectRoot := getPWD()
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--project-root":
			if i+1 < len(args) {
				projectRoot = args[i+1]
				i++
			}
		}
	}

	base := filepath.Base(projectRoot)
	lower := strings.ToLower(base)
	var b strings.Builder
	for _, r := range lower {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
		}
	}
	slug := b.String()
	if len(slug) > 8 {
		slug = slug[:8]
	}
	if slug == "" {
		slug = "project"
	}

	writeJSON(map[string]any{"ok": true, "slug": slug, "projectRoot": projectRoot})
	return 0
}

func cmdEnsureMarkerGitignore(args []string) int {
	gitignorePath := ""
	entry := ""

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--gitignore":
			if i+1 < len(args) {
				gitignorePath = args[i+1]
				i++
			}
		case "--entry":
			if i+1 < len(args) {
				entry = args[i+1]
				i++
			}
		}
	}

	if gitignorePath == "" || entry == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_args"})
		return 1
	}

	if !fileExists(gitignorePath) {
		if err := os.WriteFile(gitignorePath, []byte(""), 0o644); err != nil {
			writeJSON(map[string]any{"ok": false, "error": "touch_failed"})
			return 1
		}
	}

	content, err := readFile(gitignorePath)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "read_failed"})
		return 1
	}

	for _, line := range strings.Split(strings.ReplaceAll(content, "\r\n", "\n"), "\n") {
		trimmed := strings.TrimSpace(line)
		if trimmed == "" || strings.HasPrefix(trimmed, "#") {
			continue
		}
		if trimmed == entry {
			writeJSON(map[string]any{"ok": true, "changed": false, "path": gitignorePath})
			return 0
		}
	}

	f, err := os.OpenFile(gitignorePath, os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "append_failed"})
		return 1
	}
	defer f.Close()
	prefix := ""
	if content != "" && !strings.HasSuffix(content, "\n") {
		prefix = "\n"
	}
	if _, err := f.WriteString(prefix + entry + "\n"); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "append_failed"})
		return 1
	}

	writeJSON(map[string]any{"ok": true, "changed": true, "path": gitignorePath})
	return 0
}

func cmdEnsureStopHook(args []string) int {
	settingsPath := ""
	commandPath := ""
	timeout := 10

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--settings":
			if i+1 < len(args) {
				settingsPath = args[i+1]
				i++
			}
		case "--command":
			if i+1 < len(args) {
				commandPath = args[i+1]
				i++
			}
		case "--timeout":
			if i+1 < len(args) {
				if v, err := strconv.Atoi(args[i+1]); err == nil {
					timeout = v
				}
				i++
			}
		}
	}

	if settingsPath == "" || commandPath == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_required_args"})
		return 1
	}

	// Resolve command binary to absolute path using own executable.
	// The AI agent inconsistently resolves relative frontmatter paths
	// (../bin/story-automator) — sometimes relative, sometimes absolute,
	// sometimes project-relative. Self-resolving via os.Executable()
	// guarantees a consistent absolute path every time.
	cmdParts := strings.Fields(commandPath)
	if len(cmdParts) >= 1 {
		exe, err := os.Executable()
		if err == nil {
			resolved, err := filepath.EvalSymlinks(exe)
			if err == nil {
				exe = resolved
			}
			cmdParts[0] = exe
			commandPath = strings.Join(cmdParts, " ")
		}
	}

	if err := ensureDir(filepath.Dir(settingsPath)); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "mkdir_failed"})
		return 1
	}

	if !fileExists(settingsPath) {
		payload := map[string]any{
			"hooks": map[string]any{
				"Stop": []any{
					map[string]any{
						"hooks": []any{
							map[string]any{
								"type":    "command",
								"command": commandPath,
								"timeout": timeout,
							},
						},
					},
				},
			},
		}
		b, _ := json.MarshalIndent(payload, "", "  ")
		if err := os.WriteFile(settingsPath, b, 0o644); err != nil {
			writeJSON(map[string]any{"ok": false, "error": "write_failed"})
			return 1
		}
		writeJSON(map[string]any{"ok": true, "changed": true, "reason": "created", "path": settingsPath})
		return 0
	}

	raw, err := os.ReadFile(settingsPath)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "read_failed", "path": settingsPath})
		return 1
	}

	var root map[string]any
	if err := json.Unmarshal(raw, &root); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "invalid_json", "path": settingsPath})
		return 1
	}

	hooks, _ := root["hooks"].(map[string]any)
	if hooks == nil {
		hooks = map[string]any{}
		root["hooks"] = hooks
	}
	stopHooks, _ := hooks["Stop"].([]any)
	if stopHooks == nil {
		stopHooks = []any{}
	}

	exists := false
	needsUpdate := false
	for _, entry := range stopHooks {
		entryMap, ok := entry.(map[string]any)
		if !ok {
			continue
		}
		inner, _ := entryMap["hooks"].([]any)
		for _, h := range inner {
			m, ok := h.(map[string]any)
			if !ok {
				continue
			}
			if cmd, ok := m["command"].(string); ok {
				if cmd == commandPath {
					exists = true
				} else if strings.Contains(cmd, "story-automator") && strings.Contains(cmd, "stop-hook") {
					exists = true
					m["command"] = commandPath
					needsUpdate = true
				}
				if exists {
					switch current := m["timeout"].(type) {
					case float64:
						if int(current) != timeout {
							m["timeout"] = timeout
							needsUpdate = true
						}
					case int:
						if current != timeout {
							m["timeout"] = timeout
							needsUpdate = true
						}
					default:
						m["timeout"] = timeout
						needsUpdate = true
					}
					break
				}
			}
		}
		if exists {
			break
		}
	}

	if exists && !needsUpdate {
		writeJSON(map[string]any{"ok": true, "changed": false, "reason": "already_configured", "path": settingsPath})
		return 0
	}

	if exists && needsUpdate {
		b, _ := json.MarshalIndent(root, "", "  ")
		if err := writeFileAtomic(settingsPath, b); err != nil {
			writeJSON(map[string]any{"ok": false, "error": "write_failed", "path": settingsPath})
			return 1
		}
		writeJSON(map[string]any{"ok": true, "changed": false, "reason": "hook_normalized", "path": settingsPath})
		return 0
	}

	newEntry := map[string]any{
		"hooks": []any{
			map[string]any{
				"type":    "command",
				"command": commandPath,
				"timeout": timeout,
			},
		},
	}
	stopHooks = append(stopHooks, newEntry)
	hooks["Stop"] = stopHooks

	b, _ := json.MarshalIndent(root, "", "  ")
	if err := writeFileAtomic(settingsPath, b); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "write_failed", "path": settingsPath})
		return 1
	}

	writeJSON(map[string]any{"ok": true, "changed": true, "reason": "added", "path": settingsPath})
	return 0
}

func cmdStopHook(_ []string) int {
	_, _ = ioReadAll(os.Stdin)

	if strings.ToLower(os.Getenv("STORY_AUTOMATOR_CHILD")) == "true" {
		return 0
	}

	markerFile := filepath.Join(getPWD(), ".claude", ".story-automator-active")
	if !fileExists(markerFile) {
		return 0
	}

	content, err := os.ReadFile(markerFile)
	if err != nil {
		return 0
	}

	var marker map[string]any
	if err := json.Unmarshal(content, &marker); err != nil {
		return 0
	}

	storiesRemaining := 0
	if val, ok := marker["storiesRemaining"]; ok {
		switch v := val.(type) {
		case float64:
			storiesRemaining = int(v)
		case int:
			storiesRemaining = v
		case string:
			if n, err := strconv.Atoi(v); err == nil {
				storiesRemaining = n
			}
		}
	}

	if storiesRemaining == 0 {
		return 0
	}

	reason := fmt.Sprintf("Story Automator active (%d stories remaining). Read _bmad/bmm/4-implementation/bmad-story-automator-go/data/stop-hook-recovery.md", storiesRemaining)
	fmt.Printf("{\n  \"decision\": \"block\",\n  \"reason\": %q\n}\n", reason)
	return 0
}

func cmdCommitStory(args []string) int {
	repo := ""
	storyID := ""
	title := ""

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--repo":
			if i+1 < len(args) {
				repo = args[i+1]
				i++
			}
		case "--story":
			if i+1 < len(args) {
				storyID = args[i+1]
				i++
			}
		case "--title":
			if i+1 < len(args) {
				title = args[i+1]
				i++
			}
		}
	}

	if repo == "" || storyID == "" || title == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_args"})
		return 1
	}
	if !dirExists(repo) {
		writeJSON(map[string]any{"ok": false, "error": "repo_not_found"})
		return 1
	}

	statusOut, err := runCmd("git", "-C", repo, "status", "--porcelain")
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "git_status_failed"})
		return 1
	}

	lines := strings.Split(strings.TrimSpace(statusOut), "\n")
	changes := 0
	if len(lines) == 1 && strings.TrimSpace(lines[0]) == "" {
		changes = 0
	} else if strings.TrimSpace(statusOut) != "" {
		changes = len(lines)
	}

	if changes == 0 {
		writeJSON(map[string]any{"ok": false, "error": "no_changes"})
		return 0
	}

	_, err = runCmd("git", "-C", repo, "add", "-A")
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "git_add_failed"})
		return 1
	}

	msg := fmt.Sprintf("feat(story-%s): %s", storyID, title)
	_, err = runCmd("git", "-C", repo, "commit", "-m", msg)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "commit_failed"})
		return 1
	}

	sha, _ := runCmd("git", "-C", repo, "rev-parse", "HEAD")
	sha = strings.TrimSpace(sha)

	writeJSON(map[string]any{"ok": true, "commit": sha})
	return 0
}

func cmdListSessions(args []string) int {
	slug := ""
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--slug":
			if i+1 < len(args) {
				slug = args[i+1]
				i++
			}
		}
	}

	if slug == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_slug"})
		return 1
	}

	if _, err := execLookPath("tmux"); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "tmux_not_found", "sessions": []string{}, "count": 0})
		return 0
	}

	out, err := runCmd("tmux", "list-sessions", "-F", "#{session_name}")
	if err != nil {
		writeJSON(map[string]any{"ok": true, "sessions": []string{}, "count": 0})
		return 0
	}

	var sessions []string
	prefix := "sa-" + slug + "-"
	for _, line := range trimLines(out) {
		if strings.HasPrefix(line, prefix) {
			sessions = append(sessions, line)
		}
	}

	writeJSON(map[string]any{"ok": true, "sessions": sessions, "count": len(sessions)})
	return 0
}

func ioReadAll(r *os.File) ([]byte, error) {
	buf := make([]byte, 0, 4096)
	for {
		tmp := make([]byte, 4096)
		n, err := r.Read(tmp)
		if n > 0 {
			buf = append(buf, tmp[:n]...)
		}
		if err != nil {
			if err == io.EOF {
				return buf, nil
			}
			return buf, err
		}
	}
}
