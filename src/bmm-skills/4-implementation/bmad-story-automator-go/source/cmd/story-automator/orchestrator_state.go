package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

func orchestratorStateList(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ok": false, "error": "folder_not_found", "files": []any{}})
		return 1
	}
	folder := args[0]
	if !dirExists(folder) {
		writeJSON(map[string]any{"ok": false, "error": "folder_not_found", "files": []any{}})
		return 1
	}

	matches, _ := filepath.Glob(filepath.Join(folder, "orchestration-*.md"))
	files := []map[string]string{}
	for _, f := range matches {
		status := findFrontmatterValue(f, "status")
		updated := findFrontmatterValue(f, "lastUpdated")
		files = append(files, map[string]string{"path": f, "status": defaultString(status, "unknown"), "lastUpdated": defaultString(updated, "unknown")})
	}
	writeJSON(map[string]any{"ok": true, "files": files})
	return 0
}

func orchestratorStateLatest(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ok": false, "error": "folder_not_found"})
		return 1
	}
	folder := args[0]
	statusFilter := ""
	if len(args) > 1 {
		statusFilter = args[1]
	}
	if !dirExists(folder) {
		writeJSON(map[string]any{"ok": false, "error": "folder_not_found"})
		return 1
	}

	matches, _ := filepath.Glob(filepath.Join(folder, "orchestration-*.md"))
	latest := ""
	latestTime := ""
	for _, f := range matches {
		status := findFrontmatterValue(f, "status")
		if statusFilter != "" && status != statusFilter {
			continue
		}
		updated := findFrontmatterValue(f, "lastUpdated")
		if latestTime == "" || updated > latestTime {
			latest = f
			latestTime = updated
		}
	}

	if latest == "" {
		writeJSON(map[string]any{"ok": false, "error": "no_match"})
		return 0
	}

	writeJSON(map[string]any{"ok": true, "path": latest, "lastUpdated": latestTime})
	return 0
}

func orchestratorStateLatestIncomplete(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ok": false, "error": "folder_not_found"})
		return 1
	}
	folder := args[0]
	if !dirExists(folder) {
		writeJSON(map[string]any{"ok": false, "error": "folder_not_found"})
		return 1
	}

	matches, _ := filepath.Glob(filepath.Join(folder, "orchestration-*.md"))
	latest := ""
	latestTime := ""
	latestStatus := ""
	for _, f := range matches {
		status := findFrontmatterValue(f, "status")
		// Skip COMPLETE states - we want incomplete ones
		if status == "COMPLETE" {
			continue
		}
		updated := findFrontmatterValue(f, "lastUpdated")
		if latestTime == "" || updated > latestTime {
			latest = f
			latestTime = updated
			latestStatus = status
		}
	}

	if latest == "" {
		writeJSON(map[string]any{"ok": false, "error": "no_incomplete_state"})
		return 0
	}

	writeJSON(map[string]any{"ok": true, "path": latest, "lastUpdated": latestTime, "status": latestStatus})
	return 0
}

func orchestratorStateSummary(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ok": false, "error": "file_not_found"})
		return 1
	}
	file := args[0]
	if !fileExists(file) {
		writeJSON(map[string]any{"ok": false, "error": "file_not_found"})
		return 1
	}

	epic := findFrontmatterValue(file, "epic")
	epicName := findFrontmatterValue(file, "epicName")
	currentStory := findFrontmatterValue(file, "currentStory")
	currentStep := findFrontmatterValue(file, "currentStep")
	status := findFrontmatterValue(file, "status")
	lastUpdated := findFrontmatterValue(file, "lastUpdated")
	lastAction := extractLastAction(file)

	writeJSON(map[string]any{
		"ok":           true,
		"epic":         epic,
		"epicName":     epicName,
		"currentStory": currentStory,
		"currentStep":  currentStep,
		"status":       status,
		"lastUpdated":  lastUpdated,
		"lastAction":   lastAction,
	})
	return 0
}

func orchestratorStateUpdate(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ok": false, "error": "file_not_found"})
		return 1
	}
	file := args[0]
	args = args[1:]
	if !fileExists(file) {
		writeJSON(map[string]any{"ok": false, "error": "file_not_found"})
		return 1
	}

	updatedKeys := []string{}
	content, err := readFile(file)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "file_not_found"})
		return 1
	}
	lines := trimLines(content)

	for i := 0; i < len(args); i++ {
		if args[i] == "--set" && i+1 < len(args) {
			kv := args[i+1]
			i++
			parts := strings.SplitN(kv, "=", 2)
			if len(parts) != 2 {
				continue
			}
			key := parts[0]
			val := parts[1]
			for idx, line := range lines {
				if strings.HasPrefix(line, key+":") {
					lines[idx] = fmt.Sprintf("%s: %s", key, val)
				}
			}
			updatedKeys = append(updatedKeys, key)
		}
	}

	_ = os.WriteFile(file, []byte(strings.Join(lines, "\n")), 0o644)
	writeJSON(map[string]any{"ok": true, "updated": updatedKeys})
	return 0
}

func readStoryRangeFromState(stateFile string) []string {
	content, err := readFile(stateFile)
	if err != nil {
		return nil
	}
	blocks := []string{extractFrontmatter(content), content}
	for _, block := range blocks {
		if strings.TrimSpace(block) == "" {
			continue
		}
		lines := trimLines(block)
		storyRange := []string{}
		inRange := false
		for _, line := range lines {
			if strings.HasPrefix(strings.TrimSpace(line), "storyRange:") {
				inRange = true
				if strings.HasSuffix(strings.TrimSpace(line), "[]") {
					storyRange = []string{}
				}
				continue
			}
			if inRange && strings.HasPrefix(strings.TrimSpace(line), "-") {
				val := strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(line), "-"))
				val = strings.Trim(val, "\"")
				if val != "" {
					storyRange = append(storyRange, val)
				}
				continue
			}
			if inRange && regexp.MustCompile(`^\S+:`).MatchString(line) && !strings.HasPrefix(strings.TrimSpace(line), "-") {
				inRange = false
			}
		}
		if len(storyRange) > 0 {
			return storyRange
		}
	}
	return nil
}
