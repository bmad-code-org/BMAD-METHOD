package main

import (
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

type complexityRule struct {
	Label   string `json:"label"`
	Pattern string `json:"pattern"`
	Score   int    `json:"score"`
}

type structuralRules struct {
	ACCountMedium         int `json:"ac_count_medium"`
	ACCountHigh           int `json:"ac_count_high"`
	ACCountMediumScore    int `json:"ac_count_medium_score"`
	ACCountHighScore      int `json:"ac_count_high_score"`
	DependencyScore       int `json:"dependency_score"`
	LargeStoryWordThreshold int `json:"large_story_word_threshold"`
	LargeStoryScore       int `json:"large_story_score"`
}

type complexityRules struct {
	Thresholds struct {
		LowMax    int `json:"low_max"`
		MediumMax int `json:"medium_max"`
	} `json:"thresholds"`
	StructuralRules structuralRules `json:"structural_rules"`
	Rules           []complexityRule `json:"rules"`
}

func cmdParseEpic(args []string) int {
	epicFile := ""
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--file":
			if i+1 < len(args) {
				epicFile = args[i+1]
				i++
			}
		}
	}

	if epicFile == "" || !fileExists(epicFile) {
		writeJSON(map[string]any{"ok": false, "error": "epic_file_not_found"})
		return 1
	}

	content, err := readFile(epicFile)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "epic_file_not_found"})
		return 1
	}

	lines := trimLines(content)
	epicTitle := ""
	for _, line := range lines {
		if strings.HasPrefix(line, "# ") {
			epicTitle = strings.TrimSpace(strings.TrimPrefix(line, "# "))
			break
		}
	}

	storyRe := regexp.MustCompile(`^###\s+Story\s+(\d+)\.(\d+):\s*(.*)$`)
	epicRe := regexp.MustCompile(`^##\s+Epic\s+(\d+):\s*(.*)$`)

	currentEpicTitle := ""
	stories := make([]map[string]string, 0)

	for _, line := range lines {
		if m := epicRe.FindStringSubmatch(line); m != nil {
			currentEpicTitle = strings.TrimSpace(m[2])
			continue
		}
		if m := storyRe.FindStringSubmatch(line); m != nil {
			epicNum := m[1]
			storyNum := m[2]
			storyTitle := strings.TrimSpace(m[3])
			storyID := fmt.Sprintf("%s.%s", epicNum, storyNum)
			stories = append(stories, map[string]string{
				"epicNum":   epicNum,
				"epicTitle": currentEpicTitle,
				"storyNum":  storyNum,
				"storyId":   storyID,
				"title":     storyTitle,
			})
		}
	}

	writeJSON(map[string]any{
		"ok":        true,
		"epicTitle": epicTitle,
		"stories":   stories,
		"count":     len(stories),
		"file":      epicFile,
	})
	return 0
}

func cmdParseStory(args []string) int {
	epicFile := ""
	storyID := ""
	rulesFile := ""

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--epic":
			if i+1 < len(args) {
				epicFile = args[i+1]
				i++
			}
		case "--story":
			if i+1 < len(args) {
				storyID = args[i+1]
				i++
			}
		case "--rules":
			if i+1 < len(args) {
				rulesFile = args[i+1]
				i++
			}
		}
	}

	if epicFile == "" || storyID == "" || !fileExists(epicFile) {
		writeJSON(map[string]any{"ok": false, "error": "missing_epic_or_story"})
		return 1
	}
	if rulesFile == "" || !fileExists(rulesFile) {
		writeJSON(map[string]any{"ok": false, "error": "rules_file_not_found"})
		return 1
	}

	content, err := readFile(epicFile)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "missing_epic_or_story"})
		return 1
	}
	lines := trimLines(content)

	headPattern := regexp.MustCompile(`^###\s+Story\s+` + regexp.QuoteMeta(storyID) + `:\s*(.*)$`)
	headLine := ""
	title := ""
	startIndex := -1
	for idx, line := range lines {
		if m := headPattern.FindStringSubmatch(line); m != nil {
			headLine = line
			title = strings.TrimSpace(m[1])
			startIndex = idx
			break
		}
	}

	if headLine == "" {
		writeJSON(map[string]any{"ok": false, "error": "story_not_found"})
		return 1
	}

	descriptionLines := []string{}
	acLines := []string{}
	dependencies := ""

	inStory := false
	inAC := false
	for i := startIndex + 1; i < len(lines); i++ {
		line := lines[i]
		if strings.HasPrefix(line, "### Story ") || strings.HasPrefix(line, "## Epic ") {
			break
		}
		if !inStory {
			inStory = true
		}

		if strings.Contains(line, "Acceptance Criteria") {
			inAC = true
			continue
		}

		if !inAC {
			trimmed := strings.TrimSpace(line)
			if trimmed != "" {
				descriptionLines = append(descriptionLines, trimmed)
			}
		} else {
			trimmed := strings.TrimSpace(line)
			if trimmed != "" {
				acLines = append(acLines, trimmed)
			}
		}

		if dependencies == "" {
			if strings.Contains(line, "Dependencies:") || strings.Contains(line, "**Dependencies**:") {
				dep := line
				dep = strings.ReplaceAll(dep, "**Dependencies**:", "")
				dep = strings.ReplaceAll(dep, "Dependencies:", "")
				dependencies = strings.TrimSpace(dep)
			}
		}
	}

	description := strings.Join(descriptionLines, " ")
	description = strings.Join(strings.Fields(description), " ")

	rulesRaw, err := os.ReadFile(rulesFile)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "rules_file_not_found"})
		return 1
	}

	var rules complexityRules
	if err := json.Unmarshal(rulesRaw, &rules); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "rules_file_not_found"})
		return 1
	}

	contentForScore := strings.TrimSpace(strings.Join([]string{title, description, strings.Join(acLines, " ")}, " "))
	score := 0
	reasons := []string{}
	for _, rule := range rules.Rules {
		pattern := rule.Pattern
		re, err := regexp.Compile("(?i)" + pattern)
		if err != nil {
			continue
		}
		if re.MatchString(contentForScore) {
			score += rule.Score
			reasons = append(reasons, rule.Label)
		}
	}

	// Structural analysis pass
	sr := rules.StructuralRules
	structuralReasons := []string{}

	// AC count scoring (high replaces medium, not additive)
	if sr.ACCountHigh > 0 && len(acLines) > sr.ACCountHigh {
		score += sr.ACCountHighScore
		structuralReasons = append(structuralReasons, fmt.Sprintf("High AC count (%d)", len(acLines)))
	} else if sr.ACCountMedium > 0 && len(acLines) > sr.ACCountMedium {
		score += sr.ACCountMediumScore
		structuralReasons = append(structuralReasons, fmt.Sprintf("Elevated AC count (%d)", len(acLines)))
	}

	// Dependency scoring
	if sr.DependencyScore > 0 && dependencies != "" && strings.ToLower(dependencies) != "none" {
		score += sr.DependencyScore
		structuralReasons = append(structuralReasons, "Has explicit dependencies")
	}

	// Large story scoring (word count)
	if sr.LargeStoryWordThreshold > 0 {
		wordCount := len(strings.Fields(contentForScore))
		if wordCount > sr.LargeStoryWordThreshold {
			score += sr.LargeStoryScore
			structuralReasons = append(structuralReasons, fmt.Sprintf("Large story (%d words)", wordCount))
		}
	}

	reasons = append(reasons, structuralReasons...)

	level := "High"
	if score <= rules.Thresholds.LowMax {
		level = "Low"
	} else if score <= rules.Thresholds.MediumMax {
		level = "Medium"
	}

	writeJSON(map[string]any{
		"ok":                 true,
		"storyId":            storyID,
		"title":              title,
		"description":        description,
		"acceptanceCriteria": acLines,
		"dependencies":       dependencies,
		"complexity": map[string]any{
			"score":   score,
			"level":   level,
			"reasons": reasons,
		},
	})
	return 0
}

func cmdParseStoryRange(args []string) int {
	input := ""
	total := 0
	idsCSV := ""

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--input":
			if i+1 < len(args) {
				input = args[i+1]
				i++
			}
		case "--total":
			if i+1 < len(args) {
				if v, err := strconv.Atoi(args[i+1]); err == nil {
					total = v
				}
				i++
			}
		case "--ids":
			if i+1 < len(args) {
				idsCSV = args[i+1]
				i++
			}
		}
	}

	if input == "" || total <= 0 {
		writeJSON(map[string]any{"ok": false, "error": "missing_input_or_total"})
		return 1
	}

	idsArr := []string{}
	if idsCSV != "" {
		for _, part := range strings.Split(idsCSV, ",") {
			idsArr = append(idsArr, strings.TrimSpace(part))
		}
	}

	selected := map[int]bool{}
	addSelected := func(n int) {
		if !selected[n] {
			selected[n] = true
		}
	}

	normalized := strings.ToLower(strings.ReplaceAll(input, " ", ""))
	if normalized == "all" {
		for i := 1; i <= total; i++ {
			addSelected(i)
		}
	} else {
		parts := strings.Split(normalized, ",")
		for _, part := range parts {
			part = strings.ReplaceAll(part, " ", "")
			if part == "" {
				continue
			}
			if strings.Contains(part, "-") {
				bounds := strings.SplitN(part, "-", 2)
				start, err1 := strconv.Atoi(bounds[0])
				end, err2 := strconv.Atoi(bounds[1])
				if err1 != nil || err2 != nil {
					continue
				}
				if start <= end {
					for i := start; i <= end; i++ {
						addSelected(i)
					}
				} else {
					for i := end; i <= start; i++ {
						addSelected(i)
					}
				}
			} else {
				n, err := strconv.Atoi(part)
				if err == nil {
					addSelected(n)
				}
			}
		}
	}

	indices := []int{}
	for n := range selected {
		if n >= 1 && n <= total {
			indices = append(indices, n)
		}
	}

	sort.Ints(indices)

	storyIDs := []string{}
	if idsCSV != "" && len(idsArr) > 0 {
		for _, idx := range indices {
			if idx-1 >= 0 && idx-1 < len(idsArr) {
				storyIDs = append(storyIDs, idsArr[idx-1])
			}
		}
	}

	writeJSON(map[string]any{"ok": true, "indices": indices, "storyIds": storyIDs, "count": len(indices)})
	return 0
}

func cmdEpicComplete(args []string) int {
	epicFile := ""
	rangeCSV := ""
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--epic":
			if i+1 < len(args) {
				epicFile = args[i+1]
				i++
			}
		case "--range":
			if i+1 < len(args) {
				rangeCSV = args[i+1]
				i++
			}
		}
	}

	if epicFile == "" || !fileExists(epicFile) {
		writeJSON(map[string]any{"ok": false, "error": "epic_file_not_found"})
		return 1
	}

	content, err := readFile(epicFile)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "epic_file_not_found"})
		return 1
	}

	storyRe := regexp.MustCompile(`^###\s+Story\s+(\d+)\.(\d+):`)
	lines := trimLines(content)

	storyIDs := []string{}
	for _, line := range lines {
		if m := storyRe.FindStringSubmatch(line); m != nil {
			storyIDs = append(storyIDs, fmt.Sprintf("%s.%s", m[1], m[2]))
		}
	}

	if len(storyIDs) == 0 {
		writeJSON(map[string]any{"ok": false, "error": "no_stories_found"})
		return 1
	}

	maxEpicNum := 0
	maxStoryNum := 0
	for _, sid := range storyIDs {
		parts := strings.SplitN(sid, ".", 2)
		if len(parts) != 2 {
			continue
		}
		epicNum, _ := strconv.Atoi(parts[0])
		storyNum, _ := strconv.Atoi(parts[1])
		if epicNum > maxEpicNum || (epicNum == maxEpicNum && storyNum > maxStoryNum) {
			maxEpicNum = epicNum
			maxStoryNum = storyNum
		}
	}

	maxEpicID := fmt.Sprintf("%d.%d", maxEpicNum, maxStoryNum)

	maxRangeEpic := 0
	maxRangeStory := 0
	for _, sid := range strings.Split(rangeCSV, ",") {
		sid = strings.TrimSpace(sid)
		if sid == "" {
			continue
		}
		parts := strings.SplitN(sid, ".", 2)
		if len(parts) != 2 {
			continue
		}
		epicNum, _ := strconv.Atoi(parts[0])
		storyNum, _ := strconv.Atoi(parts[1])
		if epicNum > maxRangeEpic || (epicNum == maxRangeEpic && storyNum > maxRangeStory) {
			maxRangeEpic = epicNum
			maxRangeStory = storyNum
		}
	}

	maxRangeID := fmt.Sprintf("%d.%d", maxRangeEpic, maxRangeStory)
	epicComplete := maxRangeID == maxEpicID

	writeJSON(map[string]any{"ok": true, "epicComplete": epicComplete, "maxEpicStory": maxEpicID})
	return 0
}
