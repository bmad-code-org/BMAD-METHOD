package main

import (
	"fmt"
	"io"
	"os"
)

func cmdOrchestratorHelper(args []string) int {
	if len(args) == 0 {
		return orchestratorUsage(os.Stderr, 1)
	}
	if isHelpFlag(args[0]) {
		return orchestratorUsage(os.Stdout, 0)
	}
	action := args[0]
	args = args[1:]

	switch action {
	case "sprint-status":
		return orchestratorSprintStatus(args)
	case "parse-output":
		return orchestratorParseOutput(args)
	case "marker":
		return orchestratorMarker(args)
	case "state-list":
		return orchestratorStateList(args)
	case "state-latest":
		return orchestratorStateLatest(args)
	case "state-latest-incomplete":
		return orchestratorStateLatestIncomplete(args)
	case "state-summary":
		return orchestratorStateSummary(args)
	case "state-update":
		return orchestratorStateUpdate(args)
	case "escalate":
		return orchestratorEscalate(args)
	case "commit-ready":
		return orchestratorCommitReady(args)
	case "normalize-key":
		return orchestratorNormalizeKey(args)
	case "story-file-status":
		return orchestratorStoryFileStatus(args)
	case "verify-code-review":
		return orchestratorVerifyCodeReview(args)
	case "check-epic-complete":
		return orchestratorCheckEpicComplete(args)
	case "get-epic-stories":
		return orchestratorGetEpicStories(args)
	case "check-blocking":
		return orchestratorCheckBlocking(args)
	case "agents-build":
		return orchestratorAgentsBuild(args)
	case "agents-resolve":
		return orchestratorAgentsResolve(args)
	default:
		return orchestratorUsage(os.Stderr, 1)
	}
}

func orchestratorUsage(w io.Writer, code int) int {
	fmt.Fprintln(w, "Usage: orchestrator-helper <action> [args]")
	fmt.Fprintln(w, "")
	fmt.Fprintln(w, "Actions:")
	fmt.Fprintln(w, "  sprint-status get <story_key>")
	fmt.Fprintln(w, "  sprint-status exists")
	fmt.Fprintln(w, "  sprint-status check-epic <epic>")
	fmt.Fprintln(w, "  parse-output <file> <step>")
	fmt.Fprintln(w, "  marker create --epic E --story S --remaining N --state-file F")
	fmt.Fprintln(w, "  marker remove")
	fmt.Fprintln(w, "  marker check")
	fmt.Fprintln(w, "  marker heartbeat")
	fmt.Fprintln(w, "  state-list <folder>")
	fmt.Fprintln(w, "  state-latest <folder> [status]")
	fmt.Fprintln(w, "  state-latest-incomplete <folder>")
	fmt.Fprintln(w, "  state-summary <file>")
	fmt.Fprintln(w, "  state-update <file> --set k=v")
	fmt.Fprintln(w, "  escalate <trigger> <context>")
	fmt.Fprintln(w, "  commit-ready <story_id>")
	fmt.Fprintln(w, "  normalize-key <input> [--to id|key|prefix|json]")
	fmt.Fprintln(w, "  story-file-status <story>")
	fmt.Fprintln(w, "  verify-code-review <story>")
	fmt.Fprintln(w, "  check-epic-complete <epic> <story> [--state-file path]")
	fmt.Fprintln(w, "  get-epic-stories <epic> [--state-file path]")
	fmt.Fprintln(w, "  check-blocking <story_id>")
	fmt.Fprintln(w, "  agents-build --state-file path --complexity-file path --output path --config-json '{}'")
	fmt.Fprintln(w, "  agents-resolve --state-file path --story ID --task create|dev|auto|review [--agents-file path]")
	return code
}
