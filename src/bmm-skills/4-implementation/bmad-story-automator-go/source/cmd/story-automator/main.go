package main

import (
	"fmt"
	"io"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		printUsage(os.Stderr)
		os.Exit(1)
	}
	if isHelpFlag(os.Args[1]) {
		printUsage(os.Stdout)
		return
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
		printUsage(os.Stderr)
		code = 1
	}

	os.Exit(code)
}

func printUsage(w io.Writer) {
	fmt.Fprintln(w, "story-automator <command> [args]")
	fmt.Fprintln(w, "")
	fmt.Fprintln(w, "Commands:")
	fmt.Fprintln(w, "  derive-project-slug")
	fmt.Fprintln(w, "  ensure-marker-gitignore")
	fmt.Fprintln(w, "  ensure-stop-hook")
	fmt.Fprintln(w, "  stop-hook")
	fmt.Fprintln(w, "  build-state-doc")
	fmt.Fprintln(w, "  commit-story")
	fmt.Fprintln(w, "  parse-epic")
	fmt.Fprintln(w, "  parse-story")
	fmt.Fprintln(w, "  parse-story-range")
	fmt.Fprintln(w, "  epic-complete")
	fmt.Fprintln(w, "  sprint-compare")
	fmt.Fprintln(w, "  state-metrics")
	fmt.Fprintln(w, "  validate-state")
	fmt.Fprintln(w, "  validate-story-creation")
	fmt.Fprintln(w, "  list-sessions")
	fmt.Fprintln(w, "  tmux-wrapper")
	fmt.Fprintln(w, "  heartbeat-check")
	fmt.Fprintln(w, "  codex-status-check")
	fmt.Fprintln(w, "  tmux-status-check")
	fmt.Fprintln(w, "  monitor-session")
	fmt.Fprintln(w, "  orchestrator-helper")
	fmt.Fprintln(w, "  agent-config")
}
