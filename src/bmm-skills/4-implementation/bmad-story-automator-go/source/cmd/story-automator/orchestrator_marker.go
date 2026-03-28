package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
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

		if heartbeat == "" {
			heartbeat = nowUTC().Format("2006-01-02T15:04:05Z")
		}

		if err := ensureDir(filepath.Dir(markerFile)); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to create marker directory %s: %v\n", filepath.Dir(markerFile), err)
			return 1
		}

		remainingNum, err := strconv.Atoi(remaining)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Invalid --remaining value %q\n", remaining)
			return 1
		}
		pidNum, err := strconv.Atoi(pid)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Invalid --pid value %q\n", pid)
			return 1
		}

		payloadObj := map[string]any{
			"epic":             epic,
			"currentStory":     story,
			"storiesRemaining": remainingNum,
			"stateFile":        stateFile,
			"createdAt":        nowUTC().Format("2006-01-02T15:04:05Z"),
			"heartbeat":        heartbeat,
			"pid":              pidNum,
			"projectSlug":      projectSlug,
		}
		payload, err := json.MarshalIndent(payloadObj, "", "  ")
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to serialize marker %s: %v\n", markerFile, err)
			return 1
		}
		if err := writeFileAtomic(markerFile, append(payload, '\n')); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to write marker %s: %v\n", markerFile, err)
			return 1
		}
		fmt.Printf("Marker created: %s\n", markerFile)
		return 0

	case "remove":
		if err := os.Remove(markerFile); err != nil && !os.IsNotExist(err) {
			fmt.Fprintf(os.Stderr, "Failed to remove marker %s: %v\n", markerFile, err)
			return 1
		}
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
		var marker map[string]any
		if err := json.Unmarshal([]byte(content), &marker); err != nil {
			fmt.Fprintf(os.Stderr, "Marker file is not valid JSON: %v\n", err)
			return 1
		}
		marker["heartbeat"] = newHeartbeat
		updated, err := json.MarshalIndent(marker, "", "  ")
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to serialize marker %s: %v\n", markerFile, err)
			return 1
		}
		if err := writeFileAtomic(markerFile, append(updated, '\n')); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to write marker %s: %v\n", markerFile, err)
			return 1
		}
		fmt.Printf("Heartbeat updated: %s\n", newHeartbeat)
		return 0

	default:
		fmt.Fprintln(os.Stderr, "Usage: orchestrator-helper marker <create|remove|check|heartbeat> [args]")
		return 1
	}
}
