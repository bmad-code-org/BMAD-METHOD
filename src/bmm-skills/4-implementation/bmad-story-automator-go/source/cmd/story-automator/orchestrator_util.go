package main

import (
	"os/exec"
	"strings"
)

func findFrontmatterValue(path, key string) string {
	content, err := readFile(path)
	if err != nil {
		return ""
	}
	front := extractFrontmatter(content)
	lines := trimLines(front)
	for _, line := range lines {
		if strings.HasPrefix(line, key+":") {
			return strings.Trim(strings.TrimSpace(strings.TrimPrefix(line, key+":")), "\"")
		}
	}
	return ""
}

func findFrontmatterValueCase(path, key string) string {
	content, err := readFile(path)
	if err != nil {
		return ""
	}
	front := extractFrontmatter(content)
	lines := trimLines(front)
	for _, line := range lines {
		if strings.HasPrefix(line, key+":") {
			return strings.Trim(strings.TrimSpace(strings.TrimPrefix(line, key+":")), "\"")
		}
	}
	return ""
}

func extractLastAction(path string) string {
	content, err := readFile(path)
	if err != nil {
		return ""
	}
	lines := trimLines(content)
	for i := 0; i < len(lines); i++ {
		if strings.HasPrefix(lines[i], "## Action Log") {
			if i+2 < len(lines) {
				line := lines[i+2]
				return strings.TrimLeft(strings.TrimSpace(line), "* ")
			}
			break
		}
	}
	return ""
}

func defaultString(val, def string) string {
	if val == "" {
		return def
	}
	return val
}

func execCommand(name string, args ...string) *exec.Cmd {
	return exec.Command(name, args...)
}
