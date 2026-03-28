package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

type sprintStatus struct {
	Found  bool
	Story  string
	Status string
	Done   bool
	Reason string
}

func orchestratorSprintStatus(args []string) int {
	if len(args) == 0 {
		fmt.Fprintln(os.Stderr, "Usage: orchestrator-helper sprint-status <get|exists> [args]")
		return 1
	}

	action := args[0]
	args = args[1:]
	projectRoot := getProjectRoot()
	statusFile := sprintStatusFile(projectRoot)

	switch action {
	case "get":
		if len(args) == 0 {
			fmt.Fprintln(os.Stderr, "Usage: orchestrator-helper sprint-status get <story_key>")
			return 1
		}
		storyKey := args[0]
		status := sprintStatusGet(statusFile, storyKey)
		if !status.Found && status.Reason != "" {
			fmt.Printf("{\"found\":false,\"status\":%q,\"reason\":%q}\n", status.Status, status.Reason)
			return 0
		}
		if !status.Found {
			fmt.Printf("{\"found\":false,\"story\":%q,\"status\":%q}\n", storyKey, "not_found")
			return 0
		}
		fmt.Printf("{\"found\":true,\"story\":%q,\"status\":%q,\"done\":%t}\n", storyKey, status.Status, status.Done)
		return 0

	case "exists":
		if fileExists(statusFile) {
			fmt.Println("true")
		} else {
			fmt.Println("false")
		}
		return 0
	case "check-epic":
		if len(args) == 0 {
			fmt.Fprintln(os.Stderr, "Usage: orchestrator-helper sprint-status check-epic <epic>")
			return 1
		}
		epic := args[0]
		if !fileExists(statusFile) {
			writeJSON(map[string]any{"ok": false, "epic": epic, "allStoriesDone": false, "reason": "sprint-status.yaml not found", "count": 0})
			return 0
		}
		stories, done := sprintStatusEpic(statusFile, epic)
		if len(stories) == 0 {
			writeJSON(map[string]any{"ok": false, "epic": epic, "allStoriesDone": false, "reason": "no_stories_found", "count": 0})
			return 0
		}
		allDone := done == len(stories)
		writeJSON(map[string]any{"ok": true, "epic": epic, "allStoriesDone": allDone, "total": len(stories), "done": done, "count": len(stories), "stories": stories})
		return 0
	default:
		fmt.Fprintln(os.Stderr, "Usage: orchestrator-helper sprint-status <get|exists|check-epic> [args]")
		return 1
	}
}

func sprintStatusFile(projectRoot string) string {
	preferred := filepath.Join(projectRoot, "_bmad-output", "implementation-artifacts", "sprint-status.yaml")
	if fileExists(preferred) {
		return preferred
	}
	legacy := filepath.Join(projectRoot, "_bmad-output", "sprint-status.yaml")
	if fileExists(legacy) {
		return legacy
	}
	return preferred
}

func sprintStatusGet(statusFile, storyKey string) sprintStatus {
	if !fileExists(statusFile) {
		return sprintStatus{Found: false, Status: "unknown", Reason: "sprint-status.yaml not found"}
	}

	content, err := readFile(statusFile)
	if err != nil {
		return sprintStatus{Found: false, Status: "unknown", Reason: "sprint-status.yaml not found"}
	}

	re := regexp.MustCompile(`(?m)^\s*` + regexp.QuoteMeta(storyKey) + `:\s*(\S+)`)
	m := re.FindStringSubmatch(content)
	if m == nil {
		prefix := storyKey
		if strings.Contains(storyKey, ".") {
			prefix = strings.ReplaceAll(storyKey, ".", "-")
		} else if regexp.MustCompile(`^[0-9]+-[0-9]+-`).MatchString(storyKey) {
			parts := strings.SplitN(storyKey, "-", 3)
			prefix = parts[0] + "-" + parts[1]
		}
		if regexp.MustCompile(`^[0-9]+-[0-9]+$`).MatchString(prefix) {
			prefixRe := regexp.MustCompile(`(?m)^\s*(` + regexp.QuoteMeta(prefix) + `-[^\s:]+)\s*:\s*(\S+)`)
			pm := prefixRe.FindStringSubmatch(content)
			if pm != nil {
				status := strings.TrimSpace(pm[2])
				done := status == "done"
				return sprintStatus{Found: true, Story: pm[1], Status: status, Done: done}
			}
		}
		return sprintStatus{Found: false, Story: storyKey, Status: "not_found"}
	}

	status := strings.TrimSpace(m[1])
	done := status == "done"
	return sprintStatus{Found: true, Story: storyKey, Status: status, Done: done}
}

func sprintStatusEpic(statusFile, epic string) ([]string, int) {
	if !fileExists(statusFile) {
		return nil, 0
	}
	content, err := readFile(statusFile)
	if err != nil {
		return nil, 0
	}
	stories := []string{}
	seen := map[string]bool{}
	doneCount := 0
	for _, line := range trimLines(content) {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		if strings.HasPrefix(line, epic+".") || strings.HasPrefix(line, epic+"-") {
			parts := strings.SplitN(line, ":", 2)
			if len(parts) < 2 {
				continue
			}
			key := strings.TrimSpace(parts[0])
			status := strings.Fields(strings.TrimSpace(parts[1]))
			if !seen[key] {
				stories = append(stories, key)
				seen[key] = true
			}
			if len(status) > 0 && status[0] == "done" {
				doneCount++
			}
		}
	}
	return stories, doneCount
}
