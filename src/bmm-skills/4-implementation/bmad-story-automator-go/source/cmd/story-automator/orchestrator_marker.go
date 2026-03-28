package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

func orchestratorMarker(args []string) int {
	if len(args) == 0 {
		fmt.Fprintln(os.Stderr, "Usage: orchestrator-helper marker <create|remove|check|heartbeat> [args]")
		return 1
	}
	action := args[0]
	args = args[1:]

	projectRoot := getProjectRoot()
	markerFile := filepath.Join(projectRoot, ".claude", ".story-automator-active")

	switch action {
	case "create":
		epic := ""
		story := ""
		remaining := "0"
		stateFile := ""
		projectSlug := ""
		pid := "0"
		heartbeat := ""

		for i := 0; i < len(args); i++ {
			switch args[i] {
			case "--epic":
				if i+1 < len(args) {
					epic = args[i+1]
					i++
				}
			case "--story":
				if i+1 < len(args) {
					story = args[i+1]
					i++
				}
			case "--remaining":
				if i+1 < len(args) {
					remaining = args[i+1]
					i++
				}
			case "--state-file":
				if i+1 < len(args) {
					stateFile = args[i+1]
					i++
				}
			case "--project-slug":
				if i+1 < len(args) {
					projectSlug = args[i+1]
					i++
				}
			case "--pid":
				if i+1 < len(args) {
					pid = args[i+1]
					i++
				}
			case "--heartbeat":
				if i+1 < len(args) {
					heartbeat = args[i+1]
					i++
				}
			}
		}

		_ = ensureDir(filepath.Dir(markerFile))

		if heartbeat == "" {
			heartbeat = nowUTC().Format("2006-01-02T15:04:05Z")
		}

		payload := fmt.Sprintf("{\n  \"epic\": %q,\n  \"currentStory\": %q,\n  \"storiesRemaining\": %s,\n  \"stateFile\": %q,\n  \"createdAt\": %q,\n  \"heartbeat\": %q,\n  \"pid\": %s,\n  \"projectSlug\": %q\n}\n",
			epic, story, remaining, stateFile, nowUTC().Format("2006-01-02T15:04:05Z"), heartbeat, pid, projectSlug)
		_ = os.WriteFile(markerFile, []byte(payload), 0o644)
		fmt.Printf("Marker created: %s\n", markerFile)
		return 0

	case "remove":
		_ = os.Remove(markerFile)
		fmt.Println("Marker removed")
		return 0

	case "check":
		if fileExists(markerFile) {
			fmt.Printf("{\"exists\":true,\"file\":%q}\n", markerFile)
			content, _ := readFile(markerFile)
			fmt.Print(content)
			if !strings.HasSuffix(content, "\n") {
				fmt.Println("")
			}
		} else {
			fmt.Println("{\"exists\":false}")
		}
		return 0

	case "heartbeat":
		if !fileExists(markerFile) {
			fmt.Println("No marker file to update")
			return 1
		}
		content, err := readFile(markerFile)
		if err != nil {
			fmt.Println("No marker file to update")
			return 1
		}
		newHeartbeat := nowUTC().Format("2006-01-02T15:04:05Z")
		updated := regexp.MustCompile(`"heartbeat":.*$`).ReplaceAllString(content, fmt.Sprintf("\"heartbeat\": \"%s\"", newHeartbeat))
		_ = os.WriteFile(markerFile, []byte(updated), 0o644)
		fmt.Printf("Heartbeat updated: %s\n", newHeartbeat)
		return 0

	default:
		fmt.Fprintln(os.Stderr, "Usage: orchestrator-helper marker <create|remove|check|heartbeat> [args]")
		return 1
	}
}
