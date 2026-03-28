package main

import (
	"fmt"
	"os"
)

func cmdOrchestratorHelper(args []string) int {
	if len(args) == 0 {
		return orchestratorUsage()
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
		return orchestratorUsage()
	}
}

func orchestratorUsage() int {
	fmt.Fprintln(os.Stderr, "Usage: orchestrator-helper <action> [args]")
	fmt.Fprintln(os.Stderr, "")
	fmt.Fprintln(os.Stderr, "Actions:")
	fmt.Fprintln(os.Stderr, "  sprint-status get <story_key>")
	fmt.Fprintln(os.Stderr, "  sprint-status exists")
	fmt.Fprintln(os.Stderr, "  sprint-status check-epic <epic>")
	fmt.Fprintln(os.Stderr, "  parse-output <file> <step>")
	fmt.Fprintln(os.Stderr, "  marker create --epic E --story S --remaining N --state-file F")
	fmt.Fprintln(os.Stderr, "  marker remove")
	fmt.Fprintln(os.Stderr, "  marker check")
	fmt.Fprintln(os.Stderr, "  marker heartbeat")
	fmt.Fprintln(os.Stderr, "  state-list <folder>")
	fmt.Fprintln(os.Stderr, "  state-latest <folder> [status]")
	fmt.Fprintln(os.Stderr, "  state-latest-incomplete <folder>")
	fmt.Fprintln(os.Stderr, "  state-summary <file>")
	fmt.Fprintln(os.Stderr, "  state-update <file> --set k=v")
	fmt.Fprintln(os.Stderr, "  escalate <trigger> <context>")
	fmt.Fprintln(os.Stderr, "  commit-ready <story_id>")
	fmt.Fprintln(os.Stderr, "  normalize-key <input> [--to id|key|prefix|json]")
	fmt.Fprintln(os.Stderr, "  story-file-status <story>")
	fmt.Fprintln(os.Stderr, "  verify-code-review <story>")
	fmt.Fprintln(os.Stderr, "  check-epic-complete <epic> <story> [--state-file path]")
	fmt.Fprintln(os.Stderr, "  get-epic-stories <epic> [--state-file path]")
	fmt.Fprintln(os.Stderr, "  check-blocking <story_id>")
	fmt.Fprintln(os.Stderr, "  agents-build --state-file path --complexity-file path --output path --config-json '{}'")
	fmt.Fprintln(os.Stderr, "  agents-resolve --state-file path --story ID --task create|dev|auto|review [--agents-file path]")
	return 1
}
