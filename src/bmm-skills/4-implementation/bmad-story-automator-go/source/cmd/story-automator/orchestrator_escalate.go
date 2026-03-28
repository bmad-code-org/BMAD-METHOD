package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

func orchestratorEscalate(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"escalate": false, "reason": "Unknown trigger"})
		return 0
	}
	trigger := args[0]
	context := ""
	if len(args) > 1 {
		context = args[1]
	}

	switch trigger {
	case "review-loop":
		cycles := parseContextInt(context, "cycles")
		maxCycles := envInt("MAX_REVIEW_CYCLES", 5)
		if cycles >= maxCycles {
			writeJSON(map[string]any{"escalate": true, "reason": fmt.Sprintf("Review loop exceeded max cycles (%d/%d)", cycles, maxCycles)})
			return 0
		}
		writeJSON(map[string]any{"escalate": false})
		return 0

	case "session-crash":
		retries := parseContextInt(context, "retries")
		maxRetries := envInt("MAX_CRASH_RETRIES", 2)
		if retries >= maxRetries {
			writeJSON(map[string]any{"escalate": true, "reason": fmt.Sprintf("Session crashed after %d retries", retries)})
			return 0
		}
		writeJSON(map[string]any{"escalate": false, "action": "retry"})
		return 0

	case "story-validation":
		created := parseContextInt(context, "created")
		if created == 0 {
			writeJSON(map[string]any{"escalate": true, "reason": "No story file created"})
			return 0
		}
		if created > 1 {
			writeJSON(map[string]any{"escalate": true, "reason": fmt.Sprintf("Runaway creation: %d files", created)})
			return 0
		}
		writeJSON(map[string]any{"escalate": false})
		return 0
	default:
		writeJSON(map[string]any{"escalate": false, "reason": "Unknown trigger"})
		return 0
	}
}

func orchestratorCommitReady(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ready": false, "reason": "story_id required"})
		return 1
	}
	storyID := args[0]
	projectRoot := getProjectRoot()
	statusFile := sprintStatusFile(projectRoot)
	status := sprintStatusGet(statusFile, storyID)
	if status.Done {
		out, _ := runCmd("git", "-C", projectRoot, "status", "--porcelain")
		changes := 0
		if strings.TrimSpace(out) != "" {
			changes = len(strings.Split(strings.TrimSpace(out), "\n"))
		}
		if changes > 0 {
			writeJSON(map[string]any{"ready": true, "story": storyID, "status": "done", "uncommitted_changes": true})
			return 0
		}
		writeJSON(map[string]any{"ready": false, "reason": "No uncommitted changes", "story": storyID})
		return 0
	}

	writeJSON(map[string]any{"ready": false, "reason": "Story not done yet", "story": storyID, "current_status": status.Status})
	return 0
}

func parseContextInt(context, key string) int {
	re := regexp.MustCompile(key + `=([0-9]+)`)
	m := re.FindStringSubmatch(context)
	if m == nil {
		return 0
	}
	val, _ := strconv.Atoi(m[1])
	return val
}

func envInt(key string, def int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return def
}
