package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
)

func cmdBuildStateDoc(args []string) int {
	templatePath := ""
	outputFolder := ""
	configFile := ""
	configJSON := ""

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--template":
			if i+1 < len(args) {
				templatePath = args[i+1]
				i++
			}
		case "--output-folder":
			if i+1 < len(args) {
				outputFolder = args[i+1]
				i++
			}
		case "--config-file":
			if i+1 < len(args) {
				configFile = args[i+1]
				i++
			}
		case "--config-json":
			if i+1 < len(args) {
				configJSON = args[i+1]
				i++
			}
		}
	}

	if templatePath == "" || !fileExists(templatePath) || outputFolder == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_template_or_output"})
		return 1
	}

	if configFile != "" && fileExists(configFile) {
		if raw, err := readFile(configFile); err == nil {
			configJSON = raw
		}
	}

	if strings.TrimSpace(configJSON) == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_config"})
		return 1
	}

	if err := ensureDir(outputFolder); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "output_folder_failed"})
		return 1
	}

	var config map[string]any
	if err := json.Unmarshal([]byte(configJSON), &config); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "missing_config"})
		return 1
	}

	now := nowUTC().Format("2006-01-02T15:04:05Z")
	stamp := nowUTC().Format("20060102-150405")

	epicID, _ := config["epic"].(string)
	if epicID == "" {
		epicID = "epic"
	}
	safeEpic := regexp.MustCompile(`[^a-zA-Z0-9]+`).ReplaceAllString(epicID, "-")
	safeEpic = strings.Trim(safeEpic, "-")
	if safeEpic == "" {
		safeEpic = "epic"
	}

	outputName := fmt.Sprintf("orchestration-%s-%s.md", safeEpic, stamp)
	outputPath := filepath.Join(outputFolder, outputName)

	text, err := readFile(templatePath)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "missing_template_or_output"})
		return 1
	}

	getString := func(key, def string) string {
		if v, ok := config[key].(string); ok {
			return v
		}
		return def
	}

	getSlice := func(key string) []any {
		if v, ok := config[key].([]any); ok {
			return v
		}
		return []any{}
	}

	replacements := map[string]any{
		"epic":           getString("epic", ""),
		"epicName":       getString("epicName", ""),
		"storyRange":     config["storyRange"],
		"status":         getString("status", "READY"),
		"currentStory":   config["currentStory"],
		"currentStep":    config["currentStep"],
		"stepsCompleted": getSlice("stepsCompleted"),
		"lastUpdated":    now,
		"createdAt":      now,
		"aiCommand":      getString("aiCommand", ""),
		"agentsFile":     getString("agentsFile", ""),
		"complexityFile": getString("complexityFile", ""),
	}

	if overrides, ok := config["overrides"].(map[string]any); ok {
		skip := false
		if v, ok := overrides["skipAutomate"].(bool); ok {
			skip = v
		}
		maxParallel := 1
		switch v := overrides["maxParallel"].(type) {
		case float64:
			maxParallel = int(v)
		case int:
			maxParallel = v
		}
		repl := fmt.Sprintf("overrides:\n  skipAutomate: %t\n  maxParallel: %d\n", skip, maxParallel)
		re := regexp.MustCompile(`(?m)^overrides:\n(?:(?:\s{2}.*\n)*)`)
		text = re.ReplaceAllString(text, repl)
	}

	if custom, ok := config["customInstructions"]; ok {
		b, _ := json.Marshal(custom)
		re := regexp.MustCompile(`(?m)^customInstructions:.*$`)
		text = re.ReplaceAllString(text, "customInstructions: "+string(b))
	}

	if agent, ok := config["agentConfig"].(map[string]any); ok {
		getFallback := func(v any) (string, bool) {
			switch val := v.(type) {
			case string:
				return val, true
			case bool:
				if !val {
					return "false", true
				}
				return "true", true
			default:
				return "", false
			}
		}
		formatFallback := func(v any) string {
			if s, ok := v.(string); ok {
				lower := strings.ToLower(strings.TrimSpace(s))
				if lower == "false" || lower == "none" || lower == "null" {
					return "false"
				}
				return mustJSON(s)
			}
			if b, ok := v.(bool); ok {
				if !b {
					return "false"
				}
				return "true"
			}
			return "false"
		}
		parseTaskOverrides := func(raw any) map[string]map[string]any {
			out := map[string]map[string]any{}
			taskMap, ok := raw.(map[string]any)
			if !ok {
				return out
			}
			for task, val := range taskMap {
				entry, ok := val.(map[string]any)
				if !ok {
					continue
				}
				primary := ""
				if v, ok := entry["primary"].(string); ok {
					primary = v
				}
				fallbackVal, hasFallback := getFallback(entry["fallback"])
				if primary == "" && !hasFallback {
					continue
				}
				out[task] = map[string]any{
					"primary":  primary,
					"fallback": fallbackVal,
				}
			}
			return out
		}
		defaultPrimary := "claude"
		defaultFallback := "codex"
		if v, ok := agent["defaultPrimary"].(string); ok && v != "" {
			defaultPrimary = v
		} else if v, ok := agent["primary"].(string); ok && v != "" {
			defaultPrimary = v
		}
		if v, ok := agent["defaultFallback"].(string); ok && v != "" {
			defaultFallback = v
		} else if v, ok := agent["fallback"].(string); ok && v != "" {
			defaultFallback = v
		}
		perTask := parseTaskOverrides(agent["perTask"])
		complexityOverrides := map[string]map[string]map[string]any{}
		if raw, ok := agent["complexityOverrides"].(map[string]any); ok {
			for level, v := range raw {
				complexityOverrides[level] = parseTaskOverrides(v)
			}
		}

		lines := []string{
			"agentConfig:",
			fmt.Sprintf("  defaultPrimary: %s", mustJSON(defaultPrimary)),
			fmt.Sprintf("  defaultFallback: %s", mustJSON(defaultFallback)),
		}

		if len(perTask) > 0 {
			lines = append(lines, "  perTask:")
			keys := make([]string, 0, len(perTask))
			for k := range perTask {
				keys = append(keys, k)
			}
			sort.Strings(keys)
			for _, task := range keys {
				entry := perTask[task]
				lines = append(lines, fmt.Sprintf("    %s:", task))
				if p, ok := entry["primary"].(string); ok && p != "" {
					lines = append(lines, fmt.Sprintf("      primary: %s", mustJSON(p)))
				}
				if f, ok := entry["fallback"]; ok {
					lines = append(lines, fmt.Sprintf("      fallback: %s", formatFallback(f)))
				}
			}
		}

		if len(complexityOverrides) > 0 {
			lines = append(lines, "  complexityOverrides:")
			levels := make([]string, 0, len(complexityOverrides))
			for level := range complexityOverrides {
				levels = append(levels, level)
			}
			sort.Strings(levels)
			for _, level := range levels {
				taskMap := complexityOverrides[level]
				if len(taskMap) == 0 {
					continue
				}
				lines = append(lines, fmt.Sprintf("    %s:", level))
				taskKeys := make([]string, 0, len(taskMap))
				for k := range taskMap {
					taskKeys = append(taskKeys, k)
				}
				sort.Strings(taskKeys)
				for _, task := range taskKeys {
					entry := taskMap[task]
					lines = append(lines, fmt.Sprintf("      %s:", task))
					if p, ok := entry["primary"].(string); ok && p != "" {
						lines = append(lines, fmt.Sprintf("        primary: %s", mustJSON(p)))
					}
					if f, ok := entry["fallback"]; ok {
						lines = append(lines, fmt.Sprintf("        fallback: %s", formatFallback(f)))
					}
				}
			}
		}

		block := strings.Join(lines, "\n") + "\n"
		re := regexp.MustCompile(`(?m)^agentConfig:\n(?:(?:\s{2}.*\n)*)`)
		text = re.ReplaceAllString(text, block)
	}

	for key, value := range replacements {
		b, _ := json.Marshal(value)
		re := regexp.MustCompile(`(?m)^` + regexp.QuoteMeta(key) + `:.*$`)
		text = re.ReplaceAllString(text, fmt.Sprintf("%s: %s", key, string(b)))
	}

	storyRange := []string{}
	if sr, ok := config["storyRange"].([]any); ok {
		for _, v := range sr {
			if s, ok := v.(string); ok {
				storyRange = append(storyRange, s)
			}
		}
	}

	overridesSkip := false
	overridesMax := 1
	if overrides, ok := config["overrides"].(map[string]any); ok {
		if v, ok := overrides["skipAutomate"].(bool); ok {
			overridesSkip = v
		}
		switch v := overrides["maxParallel"].(type) {
		case float64:
			overridesMax = int(v)
		case int:
			overridesMax = v
		}
	}

	bodyReplacements := map[string]string{
		"{{epicName}}":               getString("epicName", ""),
		"{{epic}}":                   getString("epic", ""),
		"{{storyRange}}":             strings.Join(storyRange, ", "),
		"{{createdAt}}":              now,
		"{{overrides.skipAutomate}}": fmt.Sprintf("%t", overridesSkip),
		"{{overrides.maxParallel}}":  fmt.Sprintf("%d", overridesMax),
		"{{customInstructions}}":     getString("customInstructions", ""),
	}

	for k, v := range bodyReplacements {
		text = strings.ReplaceAll(text, k, v)
	}

	rows := []string{}
	for _, sid := range storyRange {
		rows = append(rows, fmt.Sprintf("| %s | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | pending |", sid))
	}
	progressRows := strings.Join(rows, "\n")
	text = strings.ReplaceAll(text, "<!-- Progress rows will be appended here -->", progressRows)

	if err := os.WriteFile(outputPath, []byte(text), 0o644); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "write_failed"})
		return 1
	}

	writeJSON(map[string]any{"ok": true, "path": outputPath, "createdAt": now})
	return 0
}

func cmdSprintCompare(args []string) int {
	stateFile := ""
	sprintFile := ""

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--state":
			if i+1 < len(args) {
				stateFile = args[i+1]
				i++
			}
		case "--sprint":
			if i+1 < len(args) {
				sprintFile = args[i+1]
				i++
			}
		}
	}

	if stateFile == "" || !fileExists(stateFile) {
		writeJSON(map[string]any{"ok": false, "error": "state_not_found"})
		return 1
	}
	if sprintFile == "" || !fileExists(sprintFile) {
		writeJSON(map[string]any{"ok": false, "error": "sprint_not_found"})
		return 1
	}

	text, err := readFile(stateFile)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "state_not_found"})
		return 1
	}

	front := extractFrontmatter(text)
	lines := trimLines(front)

	storyRange := []string{}
	currentStory := ""
	key := ""
	for _, line := range lines {
		if strings.HasPrefix(line, "currentStory:") {
			val := strings.TrimSpace(strings.TrimPrefix(line, "currentStory:"))
			val = strings.Trim(val, "\"")
			if val != "null" && val != "" {
				currentStory = val
			}
		}
		if strings.HasPrefix(line, "storyRange:") {
			key = "storyRange"
			if strings.HasSuffix(strings.TrimSpace(line), "[]") {
				storyRange = []string{}
			}
			continue
		}
		if key == "storyRange" && strings.HasPrefix(strings.TrimSpace(line), "-") {
			storyRange = append(storyRange, strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(line), "-")))
			continue
		}
		if regexp.MustCompile(`^\S+:`).MatchString(line) && !strings.HasPrefix(line, "storyRange:") {
			key = ""
		}
	}

	before := []string{}
	if currentStory != "" {
		idx := -1
		for i, sid := range storyRange {
			if sid == currentStory {
				idx = i
				break
			}
		}
		if idx >= 0 {
			before = append(before, storyRange[:idx]...)
		} else {
			before = append(before, storyRange...)
		}
	} else {
		before = append(before, storyRange...)
	}

	statusText, err := readFile(sprintFile)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "sprint_not_found"})
		return 1
	}

	incomplete := []string{}
	for _, sid := range before {
		re := regexp.MustCompile(`(?m)^\s*` + regexp.QuoteMeta(sid) + `:\s*(\S+)`)
		m := re.FindStringSubmatch(statusText)
		if m == nil || m[1] != "done" {
			incomplete = append(incomplete, sid)
		}
	}

	writeJSON(map[string]any{"ok": true, "incomplete": incomplete, "checked": before})
	return 0
}

func cmdStateMetrics(args []string) int {
	stateFile := ""
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--state":
			if i+1 < len(args) {
				stateFile = args[i+1]
				i++
			}
		}
	}

	if stateFile == "" || !fileExists(stateFile) {
		writeJSON(map[string]any{"ok": false, "error": "state_not_found"})
		return 1
	}

	text, err := readFile(stateFile)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "state_not_found"})
		return 1
	}

	lines := trimLines(text)
	inTable := false
	total := 0
	completed := 0
	for _, line := range lines {
		if strings.HasPrefix(line, "| Story ") {
			inTable = true
			continue
		}
		if inTable && regexp.MustCompile(`^\|[- ]*\|`).MatchString(line) {
			continue
		}
		if inTable && strings.HasPrefix(line, "|") {
			parts := strings.Split(line, "|")
			if len(parts) < 8 {
				continue
			}
			story := strings.TrimSpace(parts[1])
			status := strings.TrimSpace(parts[7])
			if story != "" {
				total++
				statusLower := strings.ToLower(status)
				if strings.Contains(statusLower, "done") || strings.Contains(statusLower, "complete") || strings.Contains(statusLower, "completed") {
					completed++
				}
			}
			continue
		}
		if inTable && !strings.HasPrefix(line, "|") {
			inTable = false
		}
	}

	reviewCycles := countMatches(text, `(?i)review cycle|code review cycle`)
	escalations := countMatches(text, `(?i)escalation|escalated`)

	fmt.Printf("{\"ok\":true,\"storiesCompleted\":%d,\"total\":%d,\"reviewCycles\":%d,\"escalations\":%d}\n", completed, total, reviewCycles, escalations)
	return 0
}

func cmdValidateState(args []string) int {
	stateFile := ""
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--state":
			if i+1 < len(args) {
				stateFile = args[i+1]
				i++
			}
		}
	}

	if stateFile == "" || !fileExists(stateFile) {
		writeJSON(map[string]any{"ok": false, "error": "state_not_found"})
		return 1
	}

	text, err := readFile(stateFile)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "state_not_found"})
		return 1
	}

	front := extractFrontmatter(text)
	lines := trimLines(front)

	fields := map[string]any{}
	currentKey := ""

	keyRe := regexp.MustCompile(`^\S[^:]*:`)
	for _, line := range lines {
		if strings.HasPrefix(strings.TrimSpace(line), "#") {
			continue
		}
		if keyRe.MatchString(line) {
			parts := strings.SplitN(line, ":", 2)
			key := strings.TrimSpace(parts[0])
			val := strings.TrimSpace(parts[1])
			if val == "" {
				fields[key] = []string{}
				currentKey = key
			} else {
				fields[key] = val
				currentKey = ""
			}
			continue
		}
		if currentKey != "" && strings.HasPrefix(strings.TrimSpace(line), "-") {
			items, _ := fields[currentKey].([]string)
			items = append(items, strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(line), "-")))
			fields[currentKey] = items
		}
	}

	issues := []string{}

	required := func(key string, check func(any) bool) {
		val, ok := fields[key]
		if !ok {
			issues = append(issues, "Missing or empty "+key)
			return
		}
		switch v := val.(type) {
		case string:
			if strings.TrimSpace(v) == "" {
				issues = append(issues, "Missing or empty "+key)
				return
			}
		case []string:
			if len(v) == 0 {
				issues = append(issues, "Missing or empty "+key)
				return
			}
		}
		if check != nil && !check(val) {
			issues = append(issues, "Invalid "+key)
		}
	}

	required("epic", func(_ any) bool { return true })
	required("epicName", func(_ any) bool { return true })
	required("storyRange", func(_ any) bool { return true })
	required("status", func(v any) bool {
		if s, ok := v.(string); ok {
			allowed := map[string]bool{"INITIALIZING": true, "READY": true, "IN_PROGRESS": true, "PAUSED": true, "COMPLETE": true, "ABORTED": true}
			return allowed[s]
		}
		return false
	})
	required("lastUpdated", func(v any) bool {
		if s, ok := v.(string); ok {
			return regexp.MustCompile(`\d{4}-\d{2}-\d{2}T`).MatchString(s)
		}
		return false
	})
	required("aiCommand", func(_ any) bool { return true })

	structure := "ok"
	if len(issues) > 0 {
		structure = "issues"
	}

	writeJSON(map[string]any{"ok": true, "structure": structure, "issues": issues})
	return 0
}

func extractFrontmatter(text string) string {
	if strings.HasPrefix(text, "---") {
		parts := strings.SplitN(text, "---", 3)
		if len(parts) >= 3 {
			return strings.TrimPrefix(parts[1], "\n")
		}
	}
	return ""
}

func countMatches(text, pattern string) int {
	re := regexp.MustCompile(pattern)
	return len(re.FindAllStringIndex(text, -1))
}
