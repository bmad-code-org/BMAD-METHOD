package main

import (
	"fmt"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

func orchestratorGetEpicStories(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ok": false, "error": "epic_number_required"})
		return 1
	}
	epic := args[0]
	args = args[1:]

	stateFile := ""
	for i := 0; i < len(args); i++ {
		if args[i] == "--state-file" && i+1 < len(args) {
			stateFile = args[i+1]
			i++
		}
	}

	if stateFile != "" && fileExists(stateFile) {
		storyRange := readStoryRangeFromState(stateFile)
		epicStories := filterEpicStories(storyRange, epic)
		if len(epicStories) > 0 {
			writeJSON(map[string]any{"ok": true, "epic": epic, "stories": epicStories, "count": len(epicStories), "source": "state_file"})
			return 0
		}
	}

	statusFile := sprintStatusFile(getProjectRoot())
	stories, _ := sprintStatusEpic(statusFile, epic)
	if len(stories) > 0 {
		writeJSON(map[string]any{"ok": true, "epic": epic, "stories": stories, "count": len(stories), "source": "sprint_status"})
		return 0
	}

	epicFile := findEpicFile(getProjectRoot(), epic)
	if epicFile != "" {
		content, _ := readFile(epicFile)
		re := regexp.MustCompile(`\b` + regexp.QuoteMeta(epic) + `\.[0-9]+`)
		ids := re.FindAllString(content, -1)
		ids = uniqueSortedStories(ids)
		if len(ids) > 0 {
			writeJSON(map[string]any{"ok": true, "epic": epic, "stories": ids, "count": len(ids), "source": "epic_file"})
			return 0
		}
	}

	writeJSON(map[string]any{"ok": false, "epic": epic, "error": "no_stories_found", "count": 0})
	return 0
}

func orchestratorCheckBlocking(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ok": false, "error": "story_id_required"})
		return 1
	}
	storyInput := args[0]
	projectRoot := getProjectRoot()

	norm, ok := normalizeStoryKey(projectRoot, storyInput)
	if !ok || norm.ID == "" {
		writeJSON(map[string]any{"ok": false, "error": "could_not_normalize_key", "input": storyInput})
		return 1
	}

	epicNumber := strings.SplitN(norm.ID, ".", 2)[0]
	epicFile := findEpicFile(projectRoot, epicNumber)
	if epicFile == "" {
		writeJSON(map[string]any{"ok": true, "blocking": true, "story": norm.ID, "epic": epicNumber, "dependents": []string{}, "reason": "epic_file_not_found", "source": "unknown"})
		return 0
	}

	dependents := findEpicDependents(epicFile, norm.ID, norm.Prefix)
	if len(dependents) > 0 {
		writeJSON(map[string]any{"ok": true, "blocking": true, "story": norm.ID, "epic": epicNumber, "dependents": dependents, "reason": "dependent_stories", "source": "epic_file"})
		return 0
	}

	writeJSON(map[string]any{"ok": true, "blocking": false, "story": norm.ID, "epic": epicNumber, "dependents": []string{}, "reason": "no_dependents_found", "source": "epic_file"})
	return 0
}

func orchestratorCheckEpicComplete(args []string) int {
	if len(args) < 2 {
		writeJSON(map[string]any{"ok": false, "error": "epic_number and story_id required"})
		return 1
	}
	epicNumber := args[0]
	storyID := args[1]
	args = args[2:]
	stateFile := ""
	for i := 0; i < len(args); i++ {
		if args[i] == "--state-file" && i+1 < len(args) {
			stateFile = args[i+1]
			i++
		}
	}

	storyEpic := strings.SplitN(storyID, ".", 2)[0]
	if storyEpic != epicNumber {
		writeJSON(map[string]any{"ok": true, "isLastStory": false, "epic": mustAtoi(epicNumber), "storyId": storyID, "reason": "story_not_in_epic"})
		return 0
	}

	if stateFile != "" && fileExists(stateFile) {
		storyRange := readStoryRangeFromState(stateFile)
		epicStories := filterEpicStories(storyRange, epicNumber)
		if len(epicStories) > 0 {
			last := epicStories[len(epicStories)-1]
			if storyID == last {
				writeJSON(map[string]any{"ok": true, "isLastStory": true, "epic": mustAtoi(epicNumber), "storyId": storyID, "lastInEpic": last, "epicStoryCount": len(epicStories), "source": "state_file"})
			} else {
				writeJSON(map[string]any{"ok": true, "isLastStory": false, "epic": mustAtoi(epicNumber), "storyId": storyID, "lastInEpic": last, "source": "state_file"})
			}
			return 0
		}
	}

	sprintFile := sprintStatusFile(getProjectRoot())
	if fileExists(sprintFile) {
		content, _ := readFile(sprintFile)
		re := regexp.MustCompile(`(?m)^\s*` + regexp.QuoteMeta(epicNumber) + `\.[0-9]+:`)
		matches := re.FindAllString(content, -1)
		stories := []string{}
		for _, line := range matches {
			id := strings.TrimSpace(strings.SplitN(line, ":", 2)[0])
			stories = append(stories, id)
		}
		stories = uniqueSortedStories(stories)
		if len(stories) > 0 {
			last := stories[len(stories)-1]
			if storyID == last {
				writeJSON(map[string]any{"ok": true, "isLastStory": true, "epic": mustAtoi(epicNumber), "storyId": storyID, "lastInEpic": last, "epicStoryCount": len(stories), "source": "sprint_status"})
			} else {
				writeJSON(map[string]any{"ok": true, "isLastStory": false, "epic": mustAtoi(epicNumber), "storyId": storyID, "lastInEpic": last, "source": "sprint_status"})
			}
			return 0
		}
	}

	epicFile := findEpicFile(getProjectRoot(), epicNumber)
	if epicFile != "" {
		content, _ := readFile(epicFile)
		re := regexp.MustCompile(regexp.QuoteMeta(epicNumber) + `\.[0-9]+`)
		ids := re.FindAllString(content, -1)
		ids = uniqueSortedStories(ids)
		if len(ids) > 0 {
			last := ids[len(ids)-1]
			if storyID == last {
				writeJSON(map[string]any{"ok": true, "isLastStory": true, "epic": mustAtoi(epicNumber), "storyId": storyID, "lastInEpic": last, "epicStoryCount": len(ids), "source": "epic_file"})
			} else {
				writeJSON(map[string]any{"ok": true, "isLastStory": false, "epic": mustAtoi(epicNumber), "storyId": storyID, "lastInEpic": last, "source": "epic_file"})
			}
			return 0
		}
	}

	writeJSON(map[string]any{"ok": true, "isLastStory": false, "epic": mustAtoi(epicNumber), "storyId": storyID, "reason": "could_not_determine", "source": "fallback"})
	return 0
}

func findEpicFile(projectRoot, epicNumber string) string {
	if projectRoot == "" || epicNumber == "" {
		return ""
	}
	paths := []string{
		filepath.Join(projectRoot, "_bmad-output", "implementation-artifacts", fmt.Sprintf("epic-%s-*.md", epicNumber)),
		filepath.Join(projectRoot, "docs", "epics", fmt.Sprintf("epic-%s-*.md", epicNumber)),
	}
	for _, pattern := range paths {
		matches, _ := filepath.Glob(pattern)
		if len(matches) > 0 {
			return matches[0]
		}
	}
	return ""
}

func findEpicDependents(epicFile, targetID, targetPrefix string) []string {
	content, err := readFile(epicFile)
	if err != nil {
		return nil
	}
	lines := trimLines(content)
	storyRe := regexp.MustCompile(`^###\s+Story\s+(\d+\.\d+):`)
	depRe := regexp.MustCompile(`(?i)Dependencies:|\*\*Dependencies\*\*:`)
	idRe := regexp.MustCompile(`\b` + regexp.QuoteMeta(targetID) + `\b`)
	prefixRe := regexp.MustCompile(`\b` + regexp.QuoteMeta(targetPrefix) + `\b`)
	currentStory := ""
	dependents := map[string]bool{}

	for _, line := range lines {
		if m := storyRe.FindStringSubmatch(line); m != nil {
			currentStory = m[1]
			continue
		}
		if currentStory != "" && depRe.MatchString(line) {
			if idRe.MatchString(line) || (targetPrefix != "" && prefixRe.MatchString(line)) {
				dependents[currentStory] = true
			}
		}
	}

	list := []string{}
	for id := range dependents {
		list = append(list, id)
	}
	return uniqueSortedStories(list)
}

func filterEpicStories(storyRange []string, epicNumber string) []string {
	stories := []string{}
	for _, sid := range storyRange {
		if strings.HasPrefix(sid, epicNumber+".") {
			stories = append(stories, sid)
		}
	}
	return uniqueSortedStories(stories)
}

func uniqueSortedStories(ids []string) []string {
	set := map[string]bool{}
	for _, id := range ids {
		set[id] = true
	}
	list := []string{}
	for id := range set {
		list = append(list, id)
	}
	sort.Slice(list, func(i, j int) bool {
		a := strings.SplitN(list[i], ".", 2)
		b := strings.SplitN(list[j], ".", 2)
		ai, _ := strconv.Atoi(a[1])
		bi, _ := strconv.Atoi(b[1])
		return ai < bi
	})
	return list
}
