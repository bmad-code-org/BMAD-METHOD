package main

import (
	"encoding/json"
	"os"
	"strings"
)

type agentConfigPreset struct {
	Name      string         `json:"name"`
	CreatedAt string         `json:"createdAt"`
	Config    map[string]any `json:"config"`
}

type agentConfigPresetsFile struct {
	Version string              `json:"version"`
	Presets []agentConfigPreset `json:"presets"`
}

func cmdAgentConfig(args []string) int {
	if len(args) < 1 {
		writeJSON(map[string]any{"ok": false, "error": "missing_subcommand"})
		return 1
	}

	sub := args[0]
	subArgs := args[1:]

	switch sub {
	case "list":
		return agentConfigList(subArgs)
	case "save":
		return agentConfigSave(subArgs)
	case "load":
		return agentConfigLoad(subArgs)
	case "delete":
		return agentConfigDelete(subArgs)
	default:
		writeJSON(map[string]any{"ok": false, "error": "unknown_subcommand", "subcommand": sub})
		return 1
	}
}

func parseAgentConfigArgs(args []string) (file, name, configJSON string) {
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--file":
			if i+1 < len(args) {
				file = args[i+1]
				i++
			}
		case "--name":
			if i+1 < len(args) {
				name = args[i+1]
				i++
			}
		case "--config-json":
			if i+1 < len(args) {
				configJSON = args[i+1]
				i++
			}
		}
	}
	return
}

func loadPresetsFile(path string) (agentConfigPresetsFile, error) {
	data := agentConfigPresetsFile{Version: "1.0.0", Presets: []agentConfigPreset{}}
	if !fileExists(path) {
		return data, nil
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		return data, err
	}
	if err := json.Unmarshal(raw, &data); err != nil {
		return data, err
	}
	if data.Presets == nil {
		data.Presets = []agentConfigPreset{}
	}
	return data, nil
}

func savePresetsFile(path string, data agentConfigPresetsFile) error {
	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}
	b = append(b, '\n')
	return writeFileAtomic(path, b)
}

func agentConfigList(args []string) int {
	file, _, _ := parseAgentConfigArgs(args)
	if file == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_file"})
		return 1
	}

	data, err := loadPresetsFile(file)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "read_failed"})
		return 1
	}

	summaries := make([]map[string]string, 0, len(data.Presets))
	for _, p := range data.Presets {
		summaries = append(summaries, map[string]string{
			"name":      p.Name,
			"createdAt": p.CreatedAt,
		})
	}

	writeJSON(map[string]any{"ok": true, "presets": summaries, "count": len(summaries)})
	return 0
}

func agentConfigSave(args []string) int {
	file, name, configJSON := parseAgentConfigArgs(args)
	if file == "" || strings.TrimSpace(name) == "" || strings.TrimSpace(configJSON) == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_args"})
		return 1
	}

	var config map[string]any
	if err := json.Unmarshal([]byte(configJSON), &config); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "invalid_config_json"})
		return 1
	}

	data, err := loadPresetsFile(file)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "read_failed"})
		return 1
	}

	action := "created"
	found := false
	for i, p := range data.Presets {
		if strings.EqualFold(p.Name, name) {
			data.Presets[i].Config = config
			data.Presets[i].CreatedAt = nowUTC().Format("2006-01-02T15:04:05Z")
			found = true
			action = "updated"
			break
		}
	}
	if !found {
		data.Presets = append(data.Presets, agentConfigPreset{
			Name:      name,
			CreatedAt: nowUTC().Format("2006-01-02T15:04:05Z"),
			Config:    config,
		})
	}

	if err := savePresetsFile(file, data); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "write_failed"})
		return 1
	}

	writeJSON(map[string]any{"ok": true, "name": name, "action": action})
	return 0
}

func agentConfigLoad(args []string) int {
	file, name, _ := parseAgentConfigArgs(args)
	if file == "" || strings.TrimSpace(name) == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_args"})
		return 1
	}

	data, err := loadPresetsFile(file)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "read_failed"})
		return 1
	}

	for _, p := range data.Presets {
		if strings.EqualFold(p.Name, name) {
			writeJSON(map[string]any{"ok": true, "name": p.Name, "config": p.Config})
			return 0
		}
	}

	writeJSON(map[string]any{"ok": false, "error": "preset_not_found", "name": name})
	return 1
}

func agentConfigDelete(args []string) int {
	file, name, _ := parseAgentConfigArgs(args)
	if file == "" || strings.TrimSpace(name) == "" {
		writeJSON(map[string]any{"ok": false, "error": "missing_args"})
		return 1
	}

	data, err := loadPresetsFile(file)
	if err != nil {
		writeJSON(map[string]any{"ok": false, "error": "read_failed"})
		return 1
	}

	filtered := make([]agentConfigPreset, 0, len(data.Presets))
	found := false
	for _, p := range data.Presets {
		if strings.EqualFold(p.Name, name) {
			found = true
			continue
		}
		filtered = append(filtered, p)
	}

	if !found {
		writeJSON(map[string]any{"ok": false, "error": "preset_not_found", "name": name})
		return 1
	}

	data.Presets = filtered
	if err := savePresetsFile(file, data); err != nil {
		writeJSON(map[string]any{"ok": false, "error": "write_failed"})
		return 1
	}

	writeJSON(map[string]any{"ok": true, "name": name, "action": "deleted"})
	return 0
}
