package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func cmdValidateStoryCreation(args []string) int {
	action := ""
	if len(args) > 0 {
		action = args[0]
		args = args[1:]
	}

	projectRoot := os.Getenv("PROJECT_ROOT")
	if projectRoot == "" {
		projectRoot = getPWD()
	}
	artifactsDir := filepath.Join(projectRoot, "_bmad-output", "implementation-artifacts")

	storyIDToPrefix := func(id string) string {
		return strings.ReplaceAll(id, ".", "-")
	}

	countStoryFiles := func(id string) int {
		prefix := storyIDToPrefix(id)
		matches, _ := filepath.Glob(filepath.Join(artifactsDir, prefix+"-*.md"))
		return len(matches)
	}

	validate := func(id string, before, after int) {
		created := after - before
		prefix := storyIDToPrefix(id)
		valid := false
		action := "escalate"
		reason := ""
		switch {
		case created == 1:
			valid = true
			action = "proceed"
			reason = "Exactly 1 story file created as expected"
		case created == 0:
			valid = false
			action = "escalate"
			reason = "No story file created - session may have failed"
		case created < 0:
			valid = false
			action = "escalate"
			reason = fmt.Sprintf("Story files decreased (%d) - unexpected deletion", created)
		default:
			valid = false
			action = "escalate"
			reason = fmt.Sprintf("RUNAWAY CREATION: %d files created instead of 1", created)
		}

		fmt.Printf("{\"valid\":%t,\"created_count\":%d,\"expected\":1,\"before\":%d,\"after\":%d,\"prefix\":%q,\"action\":%q,\"reason\":%q}\n",
			valid, created, before, after, prefix, action, reason)
	}

	listStoryFiles := func(id string) {
		prefix := storyIDToPrefix(id)
		fmt.Printf("Story files matching %s-*.md:\n", prefix)
		matches, _ := filepath.Glob(filepath.Join(artifactsDir, prefix+"-*.md"))
		if len(matches) == 0 {
			fmt.Println("  (none found)")
			return
		}
		for _, m := range matches {
			info, _ := os.Stat(m)
			if info != nil {
				fmt.Printf("-rw-r--r-- 1 %s %d %s\n", info.Mode().String(), info.Size(), m)
			} else {
				fmt.Println(m)
			}
		}
	}

	switch action {
	case "count":
		if len(args) == 0 || args[0] == "" {
			fmt.Fprintln(os.Stderr, "Usage: validate-story-creation count <story_id>")
			return 1
		}
		storyID := args[0]
		for i := 1; i < len(args); i++ {
			if args[i] == "--artifacts-dir" && i+1 < len(args) {
				artifactsDir = args[i+1]
				i++
			}
		}
		fmt.Println(countStoryFiles(storyID))
		return 0

	case "check":
		if len(args) == 0 {
			fmt.Fprintln(os.Stderr, "Usage: validate-story-creation check <story_id> --before N --after N")
			return 1
		}
		storyID := args[0]
		before := -1
		after := -1
		for i := 1; i < len(args); i++ {
			switch args[i] {
			case "--before":
				if i+1 < len(args) {
					n, err := strconv.Atoi(args[i+1])
					if err != nil {
						fmt.Fprintf(os.Stderr, "Invalid --before value: %s\n", args[i+1])
						return 1
					}
					before = n
					i++
				}
			case "--after":
				if i+1 < len(args) {
					n, err := strconv.Atoi(args[i+1])
					if err != nil {
						fmt.Fprintf(os.Stderr, "Invalid --after value: %s\n", args[i+1])
						return 1
					}
					after = n
					i++
				}
			case "--artifacts-dir":
				if i+1 < len(args) {
					artifactsDir = args[i+1]
					i++
				}
			}
		}
		if storyID == "" || before < 0 || after < 0 {
			fmt.Fprintln(os.Stderr, "Usage: validate-story-creation check <story_id> --before N --after N")
			return 1
		}
		validate(storyID, before, after)
		return 0

	case "list":
		if len(args) == 0 || args[0] == "" {
			fmt.Fprintln(os.Stderr, "Usage: validate-story-creation list <story_id>")
			return 1
		}
		storyID := args[0]
		for i := 1; i < len(args); i++ {
			if args[i] == "--artifacts-dir" && i+1 < len(args) {
				artifactsDir = args[i+1]
				i++
			}
		}
		listStoryFiles(storyID)
		return 0

	case "prefix":
		if len(args) == 0 {
			return 1
		}
		fmt.Println(storyIDToPrefix(args[0]))
		return 0

	default:
		if action != "" && len(args) >= 2 {
			before, err1 := strconv.Atoi(args[0])
			after, err2 := strconv.Atoi(args[1])
			if err1 == nil && err2 == nil {
				validate(action, before, after)
				return 0
			}
		}
		fmt.Fprintln(os.Stderr, "Usage: validate-story-creation <action> [args]")
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, "Actions:")
		fmt.Fprintln(os.Stderr, "  count <story_id>              - Count current story files")
		fmt.Fprintln(os.Stderr, "  check <story_id> --before N --after N  - Validate creation")
		fmt.Fprintln(os.Stderr, "  list <story_id>               - List matching files")
		fmt.Fprintln(os.Stderr, "  prefix <story_id>             - Convert story ID to file prefix")
		return 1
	}
}
