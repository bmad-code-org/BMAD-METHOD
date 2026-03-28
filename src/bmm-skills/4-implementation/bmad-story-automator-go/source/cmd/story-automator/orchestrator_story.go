package main

import (
	"path/filepath"
	"regexp"
	"strings"
)

type reviewVerification struct {
	Verified bool
	Reason   string
	Status   string
	Note     string
}

func orchestratorNormalizeKey(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ok": false, "error": "input required"})
		return 1
	}
	input := args[0]
	format := "auto"
	if len(args) >= 3 && args[1] == "--to" {
		format = args[2]
	}

	result, ok := normalizeStoryKey(getProjectRoot(), input)
	if !ok {
		writeJSON(map[string]any{"ok": false, "error": "unrecognized format", "input": input})
		return 1
	}

	switch format {
	case "id":
		println(result.ID)
	case "prefix":
		println(result.Prefix)
	case "key":
		println(result.Key)
	default:
		writeJSON(map[string]any{"ok": true, "id": result.ID, "prefix": result.Prefix, "key": result.Key})
	}
	return 0
}

func orchestratorStoryFileStatus(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ok": false, "error": "story input required"})
		return 1
	}
	storyInput := args[0]
	projectRoot := getProjectRoot()

	norm, ok := normalizeStoryKey(projectRoot, storyInput)
	if !ok || norm.Prefix == "" {
		writeJSON(map[string]any{"ok": false, "error": "could not normalize story key", "input": storyInput})
		return 1
	}

	artifactsDir := filepath.Join(projectRoot, "_bmad-output", "implementation-artifacts")
	matches, _ := filepath.Glob(filepath.Join(artifactsDir, norm.Prefix+"-*.md"))
	if len(matches) == 0 {
		writeJSON(map[string]any{"ok": false, "error": "story file not found", "prefix": norm.Prefix})
		return 1
	}
	storyFile := matches[0]

	status := findFrontmatterValueCase(storyFile, "Status")
	title := findFrontmatterValueCase(storyFile, "Title")
	writeJSON(map[string]any{"ok": true, "story_key": norm.Key, "file": storyFile, "status": defaultString(status, "unknown"), "title": title})
	return 0
}

func orchestratorVerifyCodeReview(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"verified": false, "reason": "story_key_required"})
		return 1
	}

	storyInput := args[0]
	projectRoot := getProjectRoot()

	norm, ok := normalizeStoryKey(projectRoot, storyInput)
	if !ok || norm.ID == "" {
		writeJSON(map[string]any{"verified": false, "reason": "could_not_normalize_key", "input": storyInput})
		return 1
	}

	statusFile := sprintStatusFile(projectRoot)
	status := sprintStatusGet(statusFile, norm.ID)
	if status.Done {
		writeJSON(map[string]any{"verified": true, "story": norm.Key, "sprint_status": "done", "source": "sprint-status.yaml"})
		return 0
	}

	storyStatus, ok := storyFileStatus(projectRoot, storyInput)
	if ok && storyStatus == "done" {
		writeJSON(map[string]any{"verified": true, "story": norm.Key, "sprint_status": status.Status, "story_file_status": "done", "source": "story-file", "note": "sprint_status_not_updated"})
		return 0
	}

	writeJSON(map[string]any{"verified": false, "story": norm.Key, "sprint_status": status.Status, "story_file_status": defaultString(storyStatus, "unknown"), "reason": "workflow_not_complete"})
	return 1
}

func verifyCodeReviewCompletion(projectRoot, storyKey string) reviewVerification {
	statusFile := sprintStatusFile(projectRoot)
	status := sprintStatusGet(statusFile, storyKey)
	if status.Done {
		return reviewVerification{Verified: true, Status: "done"}
	}
	storyStatus, ok := storyFileStatus(projectRoot, storyKey)
	if ok && storyStatus == "done" {
		return reviewVerification{Verified: true, Status: status.Status, Note: "story_file_done_but_sprint_status_not_updated"}
	}
	return reviewVerification{Verified: false, Status: status.Status, Reason: "workflow_not_complete"}
}

func normalizeStoryKey(projectRoot, input string) (struct{ ID, Prefix, Key string }, bool) {
	result := struct{ ID, Prefix, Key string }{}
	if regexp.MustCompile(`^[0-9]+\.[0-9]+$`).MatchString(input) {
		result.ID = input
		result.Prefix = strings.ReplaceAll(input, ".", "-")
	} else if regexp.MustCompile(`^[0-9]+-[0-9]+$`).MatchString(input) {
		result.Prefix = input
		result.ID = strings.ReplaceAll(input, "-", ".")
	} else if regexp.MustCompile(`^[0-9]+-[0-9]+-`).MatchString(input) {
		result.Key = input
		parts := strings.SplitN(input, "-", 3)
		result.Prefix = parts[0] + "-" + parts[1]
		result.ID = strings.ReplaceAll(result.Prefix, "-", ".")
	} else {
		return result, false
	}

	if result.Key == "" {
		artifactsDir := filepath.Join(projectRoot, "_bmad-output", "implementation-artifacts")
		matches, _ := filepath.Glob(filepath.Join(artifactsDir, result.Prefix+"-*.md"))
		if len(matches) > 0 {
			result.Key = strings.TrimSuffix(filepath.Base(matches[0]), ".md")
		}
	}

	if result.Key == "" {
		statusFile := sprintStatusFile(projectRoot)
		if fileExists(statusFile) {
			content, _ := readFile(statusFile)
			re := regexp.MustCompile(`(?m)^\s*` + regexp.QuoteMeta(result.Prefix) + `-`) // full key
			lines := re.FindAllString(content, -1)
			if len(lines) > 0 {
				result.Key = strings.TrimSpace(strings.SplitN(lines[0], ":", 2)[0])
			}
		}
	}

	if result.Key == "" {
		result.Key = result.Prefix
	}

	return result, true
}

func storyFileStatus(projectRoot, storyInput string) (string, bool) {
	norm, ok := normalizeStoryKey(projectRoot, storyInput)
	if !ok {
		return "", false
	}
	artifactsDir := filepath.Join(projectRoot, "_bmad-output", "implementation-artifacts")
	matches, _ := filepath.Glob(filepath.Join(artifactsDir, norm.Prefix+"-*.md"))
	if len(matches) == 0 {
		return "", false
	}
	status := findFrontmatterValueCase(matches[0], "Status")
	return status, true
}
