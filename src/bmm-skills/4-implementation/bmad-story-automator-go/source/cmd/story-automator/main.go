package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		usage()
		os.Exit(1)
	}

	cmd := os.Args[1]
	args := os.Args[2:]
	var code int

	switch cmd {
	case "derive-project-slug":
		code = cmdDeriveProjectSlug(args)
	case "ensure-marker-gitignore":
		code = cmdEnsureMarkerGitignore(args)
	case "ensure-stop-hook":
		code = cmdEnsureStopHook(args)
	case "stop-hook":
		code = cmdStopHook(args)
	case "build-state-doc":
		code = cmdBuildStateDoc(args)
	case "commit-story":
		code = cmdCommitStory(args)
	case "parse-epic":
		code = cmdParseEpic(args)
	case "parse-story":
		code = cmdParseStory(args)
	case "parse-story-range":
		code = cmdParseStoryRange(args)
	case "epic-complete":
		code = cmdEpicComplete(args)
	case "sprint-compare":
		code = cmdSprintCompare(args)
	case "state-metrics":
		code = cmdStateMetrics(args)
	case "validate-state":
		code = cmdValidateState(args)
	case "validate-story-creation":
		code = cmdValidateStoryCreation(args)
	case "list-sessions":
		code = cmdListSessions(args)
	case "tmux-wrapper":
		code = cmdTmuxWrapper(args)
	case "heartbeat-check":
		code = cmdHeartbeatCheck(args)
	case "codex-status-check":
		code = cmdCodexStatusCheck(args)
	case "tmux-status-check":
		code = cmdTmuxStatusCheck(args)
	case "monitor-session":
		code = cmdMonitorSession(args)
	case "orchestrator-helper":
		code = cmdOrchestratorHelper(args)
	case "agent-config":
		code = cmdAgentConfig(args)
	default:
		fmt.Fprintf(os.Stderr, "Unknown command: %s\n", cmd)
		usage()
		code = 1
	}

	os.Exit(code)
}

func usage() {
	fmt.Fprintln(os.Stderr, "story-automator <command> [args]")
	fmt.Fprintln(os.Stderr, "")
	fmt.Fprintln(os.Stderr, "Commands:")
	fmt.Fprintln(os.Stderr, "  derive-project-slug")
	fmt.Fprintln(os.Stderr, "  ensure-marker-gitignore")
	fmt.Fprintln(os.Stderr, "  ensure-stop-hook")
	fmt.Fprintln(os.Stderr, "  stop-hook")
	fmt.Fprintln(os.Stderr, "  build-state-doc")
	fmt.Fprintln(os.Stderr, "  commit-story")
	fmt.Fprintln(os.Stderr, "  parse-epic")
	fmt.Fprintln(os.Stderr, "  parse-story")
	fmt.Fprintln(os.Stderr, "  parse-story-range")
	fmt.Fprintln(os.Stderr, "  epic-complete")
	fmt.Fprintln(os.Stderr, "  sprint-compare")
	fmt.Fprintln(os.Stderr, "  state-metrics")
	fmt.Fprintln(os.Stderr, "  validate-state")
	fmt.Fprintln(os.Stderr, "  validate-story-creation")
	fmt.Fprintln(os.Stderr, "  list-sessions")
	fmt.Fprintln(os.Stderr, "  tmux-wrapper")
	fmt.Fprintln(os.Stderr, "  heartbeat-check")
	fmt.Fprintln(os.Stderr, "  codex-status-check")
	fmt.Fprintln(os.Stderr, "  tmux-status-check")
	fmt.Fprintln(os.Stderr, "  monitor-session")
	fmt.Fprintln(os.Stderr, "  orchestrator-helper")
	fmt.Fprintln(os.Stderr, "  agent-config")
}
