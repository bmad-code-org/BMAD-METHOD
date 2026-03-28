package main

import (
	"fmt"
	"os"
	"os/exec"
	"regexp"
	"strings"
)

func orchestratorParseOutput(args []string) int {
	if len(args) < 2 {
		fmt.Println("{\"status\":\"error\",\"reason\":\"output file not found or empty\"}")
		return 1
	}

	outputFile := args[0]
	stepType := args[1]

	if !fileExists(outputFile) {
		fmt.Println("{\"status\":\"error\",\"reason\":\"output file not found or empty\"}")
		return 1
	}

	content, err := readFile(outputFile)
	if err != nil {
		fmt.Println("{\"status\":\"error\",\"reason\":\"output file not found or empty\"}")
		return 1
	}

	lines := trimLines(content)
	if len(lines) > 150 {
		lines = lines[:150]
	}
	content = strings.Join(lines, "\n")

	prompt := buildParsePrompt(stepType, content)

	cmd := exec.Command("claude", "-p", "--model", "haiku", prompt)
	env := []string{}
	for _, e := range os.Environ() {
		if !strings.HasPrefix(e, "CLAUDECODE=") {
			env = append(env, e)
		}
	}
	cmd.Env = append(env, "STORY_AUTOMATOR_CHILD=true")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println("{\"status\":\"error\",\"reason\":\"sub-agent call failed\"}")
		return 1
	}

	result := string(out)
	jsonLine := extractJSONLine(result)
	if jsonLine != "" {
		fmt.Println(jsonLine)
	} else {
		fmt.Println(result)
	}
	return 0
}

func buildParsePrompt(stepType, content string) string {
	switch stepType {
	case "create":
		return "Analyze this create-story session output. Return JSON only:\n" +
			"{\"status\":\"SUCCESS|FAILURE|AMBIGUOUS\",\"story_created\":true/false,\"story_file\":\"path or null\",\"summary\":\"brief description\",\"next_action\":\"proceed|retry|escalate\"}\n\n" +
			"Session output:\n---\n" + content + "\n---"
	case "dev":
		return "Analyze this dev-story session output. Return JSON only:\n" +
			"{\"status\":\"SUCCESS|FAILURE|AMBIGUOUS\",\"tests_passed\":true/false,\"build_passed\":true/false,\"summary\":\"brief description\",\"next_action\":\"proceed|retry|escalate\"}\n\n" +
			"Session output:\n---\n" + content + "\n---"
	case "auto":
		return "Analyze this testarch-automate session output. Return JSON only:\n" +
			"{\"status\":\"SUCCESS|FAILURE|AMBIGUOUS\",\"tests_added\":N,\"coverage_improved\":true/false,\"summary\":\"brief description\",\"next_action\":\"proceed|retry|escalate\"}\n\n" +
			"Session output:\n---\n" + content + "\n---"
	case "review":
		return "Analyze this code-review session output. Return JSON only:\n" +
			"{\"status\":\"SUCCESS|FAILURE|AMBIGUOUS\",\"issues_found\":{\"critical\":N,\"high\":N,\"medium\":N,\"low\":N},\"all_fixed\":true/false,\"summary\":\"brief description\",\"next_action\":\"proceed|retry|escalate\"}\n\n" +
			"Session output:\n---\n" + content + "\n---"
	default:
		return "Analyze this session output. Return JSON only:\n" +
			"{\"status\":\"SUCCESS|FAILURE|AMBIGUOUS\",\"summary\":\"brief description\",\"next_action\":\"proceed|retry|escalate\"}\n\n" +
			"Session output:\n---\n" + content + "\n---"
	}
}

func extractJSONLine(result string) string {
	lines := trimLines(result)
	jsonRe := regexp.MustCompile(`\{.*\}`)
	for _, line := range lines {
		if jsonRe.MatchString(line) {
			return jsonRe.FindString(line)
		}
	}
	return ""
}
