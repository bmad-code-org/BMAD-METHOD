package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

type agentTaskConfig struct {
	Primary  string `json:"primary"`
	Fallback any    `json:"fallback"`
}

type agentConfigResolved struct {
	DefaultPrimary      string
	DefaultFallback     string
	PerTask             map[string]agentTaskConfig
	ComplexityOverrides map[string]map[string]agentTaskConfig
}

type complexityStory struct {
	StoryID    string `json:"storyId"`
	Title      string `json:"title"`
	Complexity struct {
		Level string `json:"level"`
		Score int    `json:"score"`
	} `json:"complexity"`
}

type complexityFile struct {
	Stories []complexityStory `json:"stories"`
}

type agentsStory struct {
	StoryID    string                     `json:"storyId"`
	Title      string                     `json:"title"`
	Complexity string                     `json:"complexity"`
	Tasks      map[string]agentTaskConfig `json:"tasks"`
}

type agentsFile struct {
	Version   string        `json:"version"`
	StateFile string        `json:"stateFile"`
	Epic      string        `json:"epic"`
	EpicName  string        `json:"epicName"`
	CreatedAt string        `json:"createdAt"`
	Stories   []agentsStory `json:"stories"`
}

func orchestratorAgentsBuild(args []string) int {
	stateFile := ""
	complexityFilePath := ""
	outputPath := ""
	configJSON := ""

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--state-file":
			if i+1 < len(args) {
				stateFile = args[i+1]
				i++
			}
		case "--complexity-file":
			if i+1 < len(args) {
				complexityFilePath = args[i+1]
				i++
			}
		case "--output":
			if i+1 < len(args) {
				outputPath = args[i+1]
				i++
			}
		case "--config-json":
			if i+1 < len(args) {
				configJSON = args[i+1]
				i++
			}
		}
	}

	if stateFile == "" || complexityFilePath == "" || outputPath == "" || strings.TrimSpace(configJSON) == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_args"})
		return 1
	}
	if !fileExists(stateFile) || !fileExists(complexityFilePath) {
		writeJSON(map[string]any{"ok": false, "error": "file_not_found"})
		return 1
	}

	cfg, err := parseAgentConfigJSON(configJSON)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "invalid_config"})
		return 1
	}

	raw, err := readFile(complexityFilePath)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "complexity_read_failed"})
		return 1
	}
	var comp complexityFile
	if err := json.Unmarshal([]byte(raw), &comp); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "complexity_parse_failed"})
		return 1
	}

	epic := findFrontmatterValue(stateFile, "epic")
	epicName := findFrontmatterValue(stateFile, "epicName")

	tasks := []string{"create", "dev", "auto", "review"}
	stories := []agentsStory{}

	for _, story := range comp.Stories {
		level := strings.ToLower(strings.TrimSpace(story.Complexity.Level))
		if level == "" {
			level = "medium"
		}
		taskMap := map[string]agentTaskConfig{}
		for _, task := range tasks {
			primary, fallback := resolveAgentForTask(cfg, level, task)
			fallbackVal := any(fallback)
			if strings.ToLower(strings.TrimSpace(fallback)) == "false" {
				fallbackVal = false
			}
			taskMap[task] = agentTaskConfig{
				Primary:  primary,
				Fallback: fallbackVal,
			}
		}
		stories = append(stories, agentsStory{
			StoryID:    story.StoryID,
			Title:      story.Title,
			Complexity: level,
			Tasks:      taskMap,
		})
	}

	payload := agentsFile{
		Version:   "1.0.0",
		StateFile: stateFile,
		Epic:      epic,
		EpicName:  epicName,
		CreatedAt: nowUTC().Format("2006-01-02T15:04:05Z"),
		Stories:   stories,
	}

	jsonBytes, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "agents_json_failed"})
		return 1
	}

	header := fmt.Sprintf("---\nstateFile: %q\ncreatedAt: %q\n---\n\n# Agents Plan: %s\n\n", payload.StateFile, payload.CreatedAt, payload.EpicName)
	content := header + "```json\n" + string(jsonBytes) + "\n```\n"

	if err := ensureDir(filepath.Dir(outputPath)); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "output_dir_failed"})
		return 1
	}
	if err := os.WriteFile(outputPath, []byte(content), 0o644); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "agents_write_failed"})
		return 1
	}

	writeJSON(map[string]any{"ok": true, "path": outputPath, "stories": len(stories)})
	return 0
}

func orchestratorAgentsResolve(args []string) int {
	stateFile := ""
	agentsPath := ""
	storyID := ""
	task := ""

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--state-file":
			if i+1 < len(args) {
				stateFile = args[i+1]
				i++
			}
		case "--agents-file":
			if i+1 < len(args) {
				agentsPath = args[i+1]
				i++
			}
		case "--story":
			if i+1 < len(args) {
				storyID = args[i+1]
				i++
			}
		case "--task":
			if i+1 < len(args) {
				task = args[i+1]
				i++
			}
		}
	}

	if stateFile == "" || storyID == "" || task == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_args"})
		return 1
	}

	if agentsPath == "" {
		agentsPath = findFrontmatterValue(stateFile, "agentsFile")
	}
	if agentsPath == "" || !fileExists(agentsPath) {
		writeJSON(map[string]any{"ok": false, "error": "agents_file_not_found"})
		return 1
	}

	text, err := readFile(agentsPath)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "agents_read_failed"})
		return 1
	}
	jsonBlock := extractJSONBlock(text)
	if jsonBlock == "" {
		writeJSON(map[string]any{"ok": false, "error": "agents_json_missing"})
		return 1
	}

	var payload agentsFile
	if err := json.Unmarshal([]byte(jsonBlock), &payload); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "agents_json_invalid"})
		return 1
	}

	for _, story := range payload.Stories {
		if story.StoryID != storyID {
			continue
		}
		selection, ok := story.Tasks[task]
		if !ok {
			writeJSON(map[string]any{"ok": false, "error": "task_not_found"})
			return 1
		}
		fallback := normalizeFallbackValue(selection.Fallback)
		writeJSON(map[string]any{
			"ok":         true,
			"story":      storyID,
			"task":       task,
			"primary":    selection.Primary,
			"fallback":   fallback,
			"complexity": story.Complexity,
		})
		return 0
	}

	writeJSON(map[string]any{"ok": false, "error": "story_not_found"})
	return 1
}

func parseAgentConfigJSON(raw string) (agentConfigResolved, error) {
	cfg := agentConfigResolved{
		DefaultPrimary:      "claude",
		DefaultFallback:     "codex",
		PerTask:             map[string]agentTaskConfig{},
		ComplexityOverrides: map[string]map[string]agentTaskConfig{},
	}

	var data map[string]any
	if err := json.Unmarshal([]byte(raw), &data); err != nil {
		return cfg, err
	}

	if v, ok := data["defaultPrimary"].(string); ok && v != "" {
		cfg.DefaultPrimary = v
	} else if v, ok := data["primary"].(string); ok && v != "" {
		cfg.DefaultPrimary = v
	}
	if v, ok := data["defaultFallback"].(string); ok && v != "" {
		cfg.DefaultFallback = v
	} else if v, ok := data["fallback"].(string); ok && v != "" {
		cfg.DefaultFallback = v
	}

	cfg.PerTask = parseAgentTaskMap(data["perTask"])
	if rawOverrides, ok := data["complexityOverrides"].(map[string]any); ok {
		for level, rawMap := range rawOverrides {
			cfg.ComplexityOverrides[level] = parseAgentTaskMap(rawMap)
		}
	}

	// Accept complexity levels at root level (step-02a format)
	for _, level := range []string{"low", "medium", "high"} {
		if _, exists := cfg.ComplexityOverrides[level]; exists {
			continue // complexityOverrides takes precedence
		}
		if rawMap, ok := data[level]; ok {
			parsed := parseAgentTaskMap(rawMap)
			if len(parsed) > 0 {
				cfg.ComplexityOverrides[level] = parsed
			}
		}
	}

	return cfg, nil
}

func parseAgentTaskMap(raw any) map[string]agentTaskConfig {
	out := map[string]agentTaskConfig{}
	taskMap, ok := raw.(map[string]any)
	if !ok {
		return out
	}
	for task, val := range taskMap {
		entry, ok := val.(map[string]any)
		if !ok {
			continue
		}
		cfg := agentTaskConfig{}
		if v, ok := entry["primary"].(string); ok {
			cfg.Primary = v
		}
		if v, ok := entry["fallback"]; ok {
			cfg.Fallback = v
		}
		out[task] = cfg
	}
	return out
}

func resolveAgentForTask(cfg agentConfigResolved, complexity string, task string) (string, string) {
	primary := cfg.DefaultPrimary
	fallback := cfg.DefaultFallback

	if per, ok := cfg.PerTask[task]; ok {
		if per.Primary != "" {
			primary = per.Primary
		}
		if per.Fallback != nil {
			fallback = normalizeFallbackValue(per.Fallback)
		}
	}

	if byLevel, ok := cfg.ComplexityOverrides[complexity]; ok {
		if per, ok := byLevel[task]; ok {
			if per.Primary != "" {
				primary = per.Primary
			}
			if per.Fallback != nil {
				fallback = normalizeFallbackValue(per.Fallback)
			}
		}
	}

	if strings.TrimSpace(primary) == "" {
		primary = "claude"
	}
	if strings.TrimSpace(fallback) == "" {
		fallback = "codex"
	}
	return primary, fallback
}

func normalizeFallbackValue(raw any) string {
	switch v := raw.(type) {
	case string:
		lower := strings.ToLower(strings.TrimSpace(v))
		if lower == "false" || lower == "none" || lower == "null" {
			return "false"
		}
		return v
	case bool:
		if !v {
			return "false"
		}
		return "true"
	default:
		return ""
	}
}

func extractJSONBlock(text string) string {
	re := regexp.MustCompile("(?s)```json\\s*(\\{.*?\\})\\s*```")
	m := re.FindStringSubmatch(text)
	if m != nil {
		return m[1]
	}
	trimmed := strings.TrimSpace(text)
	if strings.HasPrefix(trimmed, "{") && strings.HasSuffix(trimmed, "}") {
		return trimmed
	}
	return ""
}
