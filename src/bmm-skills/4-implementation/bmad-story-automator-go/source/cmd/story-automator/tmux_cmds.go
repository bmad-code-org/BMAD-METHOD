package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type tmuxState struct {
	PollCount         int    `json:"pollCount"`
	HasEverBeenActive bool   `json:"hasEverBeenActive"`
	LastTodosDone     int    `json:"lastTodosDone"`
	LastTodosTotal    int    `json:"lastTodosTotal"`
	LastStatusTime    string `json:"lastStatuslineTime"`
}

type codexState struct {
	PollCount         int    `json:"pollCount"`
	HasEverBeenActive bool   `json:"hasEverBeenActive"`
	LastTodosDone     int    `json:"lastTodosDone"`
	LastTodosTotal    int    `json:"lastTodosTotal"`
	LastOutputHash    string `json:"lastOutputHash"`
	LastOutputAt      int64  `json:"lastOutputAt"`
}

type tmuxStatus struct {
	Status       string
	TodosDone    int
	TodosTotal   int
	ActiveTask   string
	WaitEstimate int
	SessionState string
}

func cmdTmuxWrapper(args []string) int {
	if len(args) == 0 {
		return tmuxWrapperUsage(os.Stderr, 1)
	}
	if isHelpFlag(args[0]) {
		return tmuxWrapperUsage(os.Stdout, 0)
	}
	action := args[0]
	args = args[1:]

	switch action {
	case "spawn":
		if len(args) > 0 && isHelpFlag(args[0]) {
			return tmuxWrapperUsage(os.Stdout, 0)
		}
		return tmuxWrapperSpawn(args)
	case "name":
		if len(args) < 3 {
			return tmuxWrapperUsage(os.Stderr, 1)
		}
		step := args[0]
		epic := args[1]
		storyID := args[2]
		cycle := ""
		if len(args) > 3 {
			cycle = args[3]
		}
		fmt.Println(generateSessionName(step, epic, storyID, cycle))
		return 0
	case "list":
		projectOnly := false
		if len(args) > 0 && args[0] == "--project-only" {
			projectOnly = true
		}
		list, _ := tmuxListSessions(projectOnly)
		fmt.Println(strings.Join(list, "\n"))
		return 0
	case "kill":
		if len(args) < 1 {
			return tmuxWrapperUsage(os.Stderr, 1)
		}
		tmuxKillSession(args[0])
		return 0
	case "kill-all":
		projectOnly := false
		if len(args) > 0 && args[0] == "--project-only" {
			projectOnly = true
		}
		list, _ := tmuxListSessions(projectOnly)
		for _, session := range list {
			tmuxKillSession(session)
		}
		fmt.Printf("Killed %d sessions\n", len(list))
		return 0
	case "exists":
		if len(args) < 1 {
			return tmuxWrapperUsage(os.Stderr, 1)
		}
		if tmuxHasSession(args[0]) {
			fmt.Println("true")
			return 0
		}
		fmt.Println("false")
		return 1
	case "build-cmd":
		if len(args) > 0 && isHelpFlag(args[0]) {
			return tmuxWrapperUsage(os.Stdout, 0)
		}
		return tmuxWrapperBuildCmd(args)
	case "project-slug":
		fmt.Println(getProjectSlug())
		return 0
	case "project-hash":
		fmt.Println(getProjectHash())
		return 0
	case "story-suffix":
		if len(args) < 1 {
			return tmuxWrapperUsage(os.Stderr, 1)
		}
		fmt.Println(strings.ReplaceAll(args[0], ".", "-"))
		return 0
	case "agent-type":
		fmt.Println(getAgentType())
		return 0
	case "agent-cli":
		fmt.Println(getAgentCLI(getAgentType()))
		return 0
	case "skill-prefix":
		fmt.Println(getSkillPrefix(getAgentType()))
		return 0
	default:
		return tmuxWrapperUsage(os.Stderr, 1)
	}
}

func tmuxWrapperUsage(w io.Writer, code int) int {
	fmt.Fprintln(w, "Usage: tmux-wrapper <action> [args...]")
	fmt.Fprintln(w, "")
	fmt.Fprintln(w, "Actions:")
	fmt.Fprintln(w, "  spawn <step> <epic> <story_id> [--command \"...\"] [--cycle N] [--agent TYPE]")
	fmt.Fprintln(w, "  name <step> <epic> <story_id> [--cycle N]")
	fmt.Fprintln(w, "  list [--project-only]")
	fmt.Fprintln(w, "  kill <session_name>")
	fmt.Fprintln(w, "  kill-all [--project-only]")
	fmt.Fprintln(w, "  exists <session_name>")
	fmt.Fprintln(w, "  build-cmd <step> <story_id> [--agent TYPE] [extra_instruction]")
	fmt.Fprintln(w, "  project-slug")
	fmt.Fprintln(w, "  project-hash")
	fmt.Fprintln(w, "  story-suffix <story_id>")
	fmt.Fprintln(w, "  agent-type")
	fmt.Fprintln(w, "  agent-cli")
	fmt.Fprintln(w, "  skill-prefix")
	return code
}

func tmuxWrapperSpawn(args []string) int {
	if len(args) < 3 {
		return tmuxWrapperUsage(os.Stderr, 1)
	}
	step := args[0]
	epic := args[1]
	storyID := args[2]
	args = args[3:]

	command := ""
	cycle := ""
	agentType := os.Getenv("AI_AGENT")
	if agentType == "" {
		agentType = "claude"
	}

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--command":
			if i+1 < len(args) {
				command = args[i+1]
				i++
			}
		case "--cycle":
			if i+1 < len(args) {
				cycle = args[i+1]
				i++
			}
		case "--agent":
			if i+1 < len(args) {
				agentType = args[i+1]
				i++
			}
		}
	}

	sessionName := generateSessionName(step, epic, storyID, cycle)
	projectHash := getProjectHash()

	stateFile := fmt.Sprintf("/tmp/.sa-%s-session-%s-state.json", projectHash, sessionName)
	_ = os.Remove(stateFile)

	err := tmuxNewSession(sessionName, getProjectRoot(), agentType)
	if err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
		return 1
	}

	if command != "" {
		if len(command) > 500 {
			scriptFile := fmt.Sprintf("/tmp/sa-cmd-%s.sh", sessionName)
			if err := os.WriteFile(scriptFile, []byte("#!/bin/bash\n"+command+"\n"), 0o755); err != nil {
				fmt.Fprintf(os.Stderr, "failed to write command script %s: %v\n", scriptFile, err)
				tmuxKillSession(sessionName)
				return 1
			}
			if err := tmuxSendKeys(sessionName, "bash "+scriptFile, true); err != nil {
				fmt.Fprintf(os.Stderr, "failed to send command to session %s: %v\n", sessionName, err)
				tmuxKillSession(sessionName)
				return 1
			}
		} else {
			_ = tmuxSendKeys(sessionName, command, true)
		}
	}

	fmt.Println(sessionName)
	return 0
}

func tmuxWrapperBuildCmd(args []string) int {
	if len(args) < 2 {
		return tmuxWrapperUsage(os.Stderr, 1)
	}
	step := args[0]
	storyID := args[1]
	args = args[2:]

	agent := ""
	extra := ""
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--agent":
			if i+1 < len(args) {
				agent = args[i+1]
				i++
			}
		default:
			if extra == "" {
				extra = args[i]
			} else {
				extra = extra + " " + args[i]
			}
		}
	}

	if agent == "" {
		agent = getAgentType()
	}

	if step == "retro" && agent != "codex" {
		epicNumber := storyID
		retroPrompt := "bmad-retrospective epic:" + epicNumber + "\n\n" +
			"Run the retrospective in #YOLO mode.\n" +
			"Assume the user will NOT provide any input to the retrospective directly.\n" +
			"For ALL prompts that expect user input, make reasonable autonomous decisions based on:\n" +
			"- Sprint status data\n" +
			"- Story files and their dev notes\n" +
			"- Previous retrospective if available\n" +
			"- Architecture and PRD documents\n\n" +
			"Key behaviors:\n" +
			"- When asked to confirm epic number: auto-confirm based on sprint-status\n" +
			"- When asked for observations: synthesize from story analysis\n" +
			"- When asked for decisions: make data-driven choices\n" +
			"- When presented menus: select the most appropriate option based on context\n" +
			"- Skip all \"WAIT for user\" instructions - continue autonomously\n\n" +
			"After the retrospective has run and created documents, you MUST:\n" +
			"1. Create a list of documentation that may need updates based on implementation learnings ie) PRD, Architecture, project-context, future: Epics, Stores\n" +
			"2. For each doc in the list, verify whether updates are actually needed by:\n" +
			"   - Reading the current doc content\n" +
			"   - Comparing against actual implementation code\n" +
			"   - Checking for discrepancies between doc and code\n" +
			"3. Update docs that have verified discrepancies\n" +
			"4. Discard proposed updates where code matches docs\n\n" +
			"Focus on these doc types:\n" +
			"- Architecture decisions that changed during implementation\n" +
			"- API documentation that diverged from specs\n" +
			"- README files with outdated instructions\n" +
			"- Configuration documentation\n\n" +
			"EVERYTHING SHOULD BE AUTOMATED. THIS IS NOT A SESSION WHERE YOU SHOULD BE EXPECTING USER INPUT."

		retroPrompt = strings.ReplaceAll(retroPrompt, "\"", "\\\"")
		retroPrompt = strings.ReplaceAll(retroPrompt, "\n", " ")
		fmt.Printf("unset CLAUDECODE && claude --dangerously-skip-permissions \"%s\"\n", retroPrompt)
		return 0
	}

	storyPrefix := strings.ReplaceAll(storyID, ".", "-")

	if os.Getenv("AI_COMMAND") != "" && os.Getenv("AI_AGENT") == "" {
		aiCLI := os.Getenv("AI_COMMAND")
		workflowCmd := ""
		switch step {
		case "create":
			workflowCmd = "bmad-create-story " + storyID + " #YOLO"
		case "dev":
			workflowCmd = "bmad-dev-story " + storyID + " #YOLO"
		case "auto":
			workflowCmd = "bmad-tea-testarch-automate " + storyID + " auto-apply all discovered gaps in tests"
		case "review":
			if extra != "" {
				workflowCmd = "bmad-story-automator-review " + storyID + " " + extra
			} else {
				workflowCmd = "bmad-story-automator-review " + storyID + " auto-fix all issues without prompting"
			}
		default:
			fmt.Fprintln(os.Stderr, "Unknown step type: "+step)
			return 1
		}
		fmt.Printf("unset CLAUDECODE && %s \"%s\"\n", aiCLI, workflowCmd)
		return 0
	}

	if agent != "codex" {
		aiCLI := getAgentCLI(agent)
		workflowCmd := ""
		switch step {
		case "create":
			workflowCmd = "bmad-create-story " + storyID + " #YOLO"
		case "dev":
			workflowCmd = "bmad-dev-story " + storyID + " #YOLO"
		case "auto":
			workflowCmd = "bmad-tea-testarch-automate " + storyID + " auto-apply all discovered gaps in tests"
		case "review":
			if extra != "" {
				workflowCmd = "bmad-story-automator-review " + storyID + " " + extra
			} else {
				workflowCmd = "bmad-story-automator-review " + storyID + " auto-fix all issues without prompting"
			}
		default:
			fmt.Fprintln(os.Stderr, "Unknown step type: "+step)
			return 1
		}
		fmt.Printf("unset CLAUDECODE && %s \"%s\"\n", aiCLI, workflowCmd)
		return 0
	}

	prompt := ""
	switch step {
	case "create":
		prompt = "Execute the BMAD create-story workflow for story " + storyID + ".\n\n" +
			"READ this skill first: _bmad/bmm/4-implementation/bmad-create-story/SKILL.md\n" +
			"Then follow its instructions, including:\n" +
			"- _bmad/bmm/4-implementation/bmad-create-story/workflow.md for the structured flow\n" +
			"- _bmad/bmm/4-implementation/bmad-create-story/template.md as the output template\n" +
			"- _bmad/bmm/4-implementation/bmad-create-story/checklist.md for validation\n\n" +
			"Create story file at: _bmad-output/implementation-artifacts/" + storyPrefix + "-*.md\n\n" +
			"Story ID: " + storyID + "\n\n" +
			"#YOLO - Do NOT wait for user input. Make autonomous decisions throughout."
	case "dev":
		prompt = "Execute the BMAD dev-story workflow for story " + storyID + ".\n\n" +
			"READ this skill first: _bmad/bmm/4-implementation/bmad-dev-story/SKILL.md\n" +
			"Then follow its instructions, including:\n" +
			"- _bmad/bmm/4-implementation/bmad-dev-story/workflow.md for the structured flow\n" +
			"- _bmad/bmm/4-implementation/bmad-dev-story/checklist.md for validation\n\n" +
			"Story file: _bmad-output/implementation-artifacts/" + storyPrefix + "-*.md\n" +
			"Implement all tasks marked [ ]. Run tests. Update checkboxes.\n\n" +
			"Story ID: " + storyID + "\n\n" +
			"#YOLO - Do NOT wait for user input. Make autonomous decisions throughout."
	case "auto":
		prompt = "Execute the BMAD testarch-automate workflow for story " + storyID + ".\n\n" +
			"READ this workflow file first: _bmad/tea/workflows/testarch/automate/workflow.md\n" +
			"Then follow its instructions, including:\n" +
			"- _bmad/tea/workflows/testarch/automate/instructions.md for detailed steps\n" +
			"- _bmad/tea/workflows/testarch/automate/checklist.md for validation\n\n" +
			"Story file: _bmad-output/implementation-artifacts/" + storyPrefix + "-*.md\n" +
			"Generate test automation for the implemented story.\n" +
			"Auto-apply all discovered gaps in tests. Do NOT wait for user input.\n\n" +
			"Story ID: " + storyID
	case "review":
		reviewExtra := extra
		if reviewExtra == "" {
			reviewExtra = "auto-fix all issues without prompting"
		}
		prompt = "Execute the story-automator review workflow for story " + storyID + ".\n\n" +
			"READ this skill first: _bmad/bmm/4-implementation/bmad-story-automator-review/SKILL.md\n" +
			"Then follow its instructions, including:\n" +
			"- _bmad/bmm/4-implementation/bmad-story-automator-review/workflow.yaml for config\n" +
			"- _bmad/bmm/4-implementation/bmad-story-automator-review/instructions.xml for detailed steps\n" +
			"- _bmad/bmm/4-implementation/bmad-story-automator-review/checklist.md for validation\n\n" +
			"Story file: _bmad-output/implementation-artifacts/" + storyPrefix + "-*.md\n" +
			"Review implementation, find issues, fix them automatically.\n" +
			reviewExtra + "\n\n" +
			"Story ID: " + storyID
	case "retro":
		epicNumber := storyID
		prompt = "Execute the BMAD retrospective workflow for epic " + epicNumber + ".\n\n" +
			"READ this skill first: _bmad/bmm/4-implementation/bmad-retrospective/SKILL.md\n" +
			"Then follow its instructions, including:\n" +
			"- _bmad/bmm/4-implementation/bmad-retrospective/workflow.md for the structured flow\n\n" +
			"Run the retrospective in #YOLO mode.\n" +
			"Assume the user will NOT provide any input.\n" +
			"For ALL prompts that expect user input, make reasonable autonomous decisions based on:\n" +
			"- Sprint status data\n" +
			"- Story files and their dev notes\n" +
			"- Previous retrospective if available\n" +
			"- Architecture and PRD documents\n\n" +
			"Key behaviors:\n" +
			"- When asked to confirm epic number: auto-confirm based on sprint-status\n" +
			"- When asked for observations: synthesize from story analysis\n" +
			"- When asked for decisions: make data-driven choices\n" +
			"- When presented menus: select the most appropriate option based on context\n" +
			"- Skip all WAIT for user instructions - continue autonomously\n\n" +
			"EVERYTHING SHOULD BE AUTOMATED. THIS IS NOT A SESSION WHERE YOU SHOULD BE EXPECTING USER INPUT."
	default:
		fmt.Fprintln(os.Stderr, "Unknown step type: "+step)
		return 1
	}

	prompt = strings.ReplaceAll(prompt, "\"", "\\\"")
	fmt.Printf("codex exec --full-auto \"%s\"\n", prompt)
	return 0
}

func cmdHeartbeatCheck(args []string) int {
	if len(args) == 0 {
		fmt.Println("error,0.0,,no_session")
		return 0
	}

	session := args[0]
	args = args[1:]

	agentType := "auto"
	for i := 0; i < len(args); i++ {
		if args[i] == "--agent" && i+1 < len(args) {
			agentType = args[i+1]
			i++
		}
	}

	status, cpu, pid, prompt := heartbeatCheck(session, agentType)
	fmt.Printf("%s,%.1f,%s,%s\n", status, cpu, pid, prompt)
	return 0
}

func heartbeatCheck(session, agentType string) (string, float64, string, string) {
	if session == "" {
		return "error", 0.0, "", "no_session"
	}
	if !tmuxHasSession(session) {
		return "error", 0.0, "", "session_not_found"
	}

	panePID, err := tmuxDisplay(session, "#{pane_pid}")
	if err != nil || strings.TrimSpace(panePID) == "" {
		return "error", 0.0, "", "no_pane_pid"
	}
	panePID = strings.TrimSpace(panePID)

	if agentType == "auto" {
		envAgent, _ := tmuxShowEnvironment(session, "AI_AGENT")
		if envAgent == "codex" {
			agentType = "codex"
		} else if envAgent == "claude" {
			agentType = "claude"
		} else {
			procTree, _ := runCmd("pstree", "-p", panePID)
			if procTree == "" {
				procTree, _ = runCmd("ps", "-o", "comm=", "--ppid", panePID)
			}
			if strings.Contains(strings.ToLower(procTree), "codex") {
				agentType = "codex"
			} else {
				agentType = "claude"
			}
		}
	}

	pattern := "claude"
	if agentType == "codex" {
		pattern = "codex"
	}

	agentPID := findAgentPID(panePID, pattern, 0)

	promptDetected := checkPromptVisible(session)
	if agentPID == "" {
		if promptDetected == "true" {
			return "completed", 0.0, "", promptDetected
		}
		return "dead", 0.0, "", promptDetected
	}

	cpu := 0.0
	cpuOut, _ := runCmd("ps", "-o", "%cpu=", "-p", agentPID)
	cpuOut = strings.TrimSpace(cpuOut)
	if cpuOut != "" {
		if v, err := strconv.ParseFloat(cpuOut, 64); err == nil {
			cpu = v
		}
	}

	status := "idle"
	if int(cpu) > 0 {
		status = "alive"
	} else if promptDetected == "true" {
		status = "completed"
	}

	return status, cpu, agentPID, promptDetected
}

func findAgentPID(parent string, pattern string, depth int) string {
	if depth > 4 {
		return ""
	}
	out, err := runCmd("pgrep", "-P", parent)
	if err != nil {
		return ""
	}
	for _, line := range trimLines(out) {
		child := strings.TrimSpace(line)
		if child == "" {
			continue
		}
		comm, _ := runCmd("ps", "-o", "comm=", "-p", child)
		if strings.Contains(strings.ToLower(comm), strings.ToLower(pattern)) {
			return child
		}
		if found := findAgentPID(child, pattern, depth+1); found != "" {
			return found
		}
	}
	return ""
}

func checkPromptVisible(session string) string {
	capture, _ := runCmd("tmux", "capture-pane", "-t", session, "-p")
	lines := trimLines(capture)
	if len(lines) > 3 {
		lines = lines[len(lines)-3:]
	}
	last := ""
	if len(lines) > 0 {
		last = strings.TrimRight(lines[len(lines)-1], " ")
	}
	codexPrompt := regexp.MustCompile(`❯\s*([0-9]+[smh]\s*)?[0-9]{1,2}:[0-9]{2}:[0-9]{2}\s*$`)
	if codexPrompt.MatchString(last) {
		return "true"
	}
	if regexp.MustCompile(`(❯|\$|#|%)\s*$`).MatchString(last) {
		return "true"
	}
	return "false"
}

func cmdCodexStatusCheck(args []string) int {
	if len(args) == 0 {
		fmt.Println("error,0,0,no_session,30,error")
		return 0
	}

	session := args[0]
	args = args[1:]

	full := false
	projectRoot := getPWD()
	pollCount := 1
	hasActive := false
	paneStatus := "alive"

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--full":
			full = true
		case "--project-root":
			if i+1 < len(args) {
				projectRoot = args[i+1]
				i++
			}
		case "--poll-count":
			if i+1 < len(args) {
				pollCount, _ = strconv.Atoi(args[i+1])
				i++
			}
		case "--has-active":
			if i+1 < len(args) {
				hasActive = args[i+1] == "true"
				i++
			}
		case "--pane-status":
			if i+1 < len(args) {
				paneStatus = args[i+1]
				i++
			}
		}
	}

	status, err := codexStatusCheck(session, full, projectRoot, pollCount, hasActive, paneStatus)
	if err != nil {
		fmt.Println("error,0,0,codex_error,30,error")
		return 0
	}

	fmt.Printf("%s,%d,%d,%s,%d,%s\n", status.Status, status.TodosDone, status.TodosTotal, status.ActiveTask, status.WaitEstimate, status.SessionState)
	return 0
}

func codexStatusCheck(session string, full bool, projectRoot string, pollCount int, hasActive bool, paneStatus string) (tmuxStatus, error) {
	if session == "" {
		return tmuxStatus{Status: "error", TodosDone: 0, TodosTotal: 0, ActiveTask: "no_session", WaitEstimate: 30, SessionState: "error"}, nil
	}
	if !tmuxHasSession(session) {
		return tmuxStatus{Status: "error", TodosDone: 0, TodosTotal: 0, ActiveTask: "session_not_found", WaitEstimate: 30, SessionState: "error"}, nil
	}

	projectHash := md5Hex8(projectRoot)
	stateFile := fmt.Sprintf("/tmp/.sa-%s-session-%s-state.json", projectHash, session)
	state := codexLoadState(stateFile)

	capture, _ := runCmd("tmux", "capture-pane", "-t", session, "-p", "-S", "-120")
	capture = filterInputBox(capture)

	lastHash := state.LastOutputHash
	lastAt := state.LastOutputAt

	hash := md5Hex8(capture)
	outputChanged := hash != "" && hash != lastHash

	now := time.Now().Unix()
	if outputChanged || lastAt == 0 {
		lastHash = hash
		lastAt = now
	}

	staleSeconds := 300
	if v := os.Getenv("CODEX_OUTPUT_STALE_SECONDS"); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			staleSeconds = n
		}
	}

	outputAge := int(now - lastAt)
	outputFresh := outputAge <= staleSeconds

	heartbeatStatus, heartbeatCPU, _, promptDetected := heartbeatCheck(session, "codex")

	codexCompleted := func() bool {
		lines := trimLines(capture)
		last := ""
		if len(lines) > 0 {
			last = strings.TrimSpace(lines[len(lines)-1])
		}
		if regexp.MustCompile(`❯\s*([0-9]+[smh]\s*)?[0-9]{1,2}:[0-9]{2}:[0-9]{2}\s*$`).MatchString(last) {
			return true
		}
		if regexp.MustCompile(`(?i)tokens used`).MatchString(capture) {
			return true
		}
		if strings.HasPrefix(paneStatus, "exited:") {
			return true
		}
		return false
	}

	if codexCompleted() || promptDetected == "true" {
		if full {
			outputFile := fmt.Sprintf("/tmp/sa-%s-output-%s.txt", projectHash, session)
			fullCapture, _ := runCmd("tmux", "capture-pane", "-t", session, "-p", "-S", "-300")
			fullCapture = strings.Join(trimLines(fullCapture), "\n")
			lines := trimLines(fullCapture)
			if len(lines) > 200 {
				lines = lines[:200]
			}
			_ = os.WriteFile(outputFile, []byte(strings.Join(lines, "\n")), 0o644)
			return tmuxStatus{Status: "idle", TodosDone: 1, TodosTotal: 1, ActiveTask: outputFile, WaitEstimate: 0, SessionState: "completed"}, nil
		}
		codexSaveState(stateFile, pollCount, true, 1, 1, lastHash, lastAt)
		return tmuxStatus{Status: "idle", TodosDone: 1, TodosTotal: 1, ActiveTask: "", WaitEstimate: 0, SessionState: "completed"}, nil
	}

	if heartbeatStatus == "alive" {
		activeTask := extractActiveTask(capture)
		if activeTask == "" {
			activeTask = fmt.Sprintf("Codex working (CPU: %.1f%%)", heartbeatCPU)
		}
		waitEst := 90
		codexSaveState(stateFile, pollCount, true, 0, 0, lastHash, lastAt)
		return tmuxStatus{Status: "active", TodosDone: 0, TodosTotal: 0, ActiveTask: activeTask, WaitEstimate: waitEst, SessionState: "in_progress"}, nil
	}

	if heartbeatStatus == "idle" || heartbeatStatus == "error" {
		if outputFresh {
			activeTask := fmt.Sprintf("Codex output active (last %ds)", outputAge)
			waitEst := 60
			codexSaveState(stateFile, pollCount, true, 0, 1, lastHash, lastAt)
			return tmuxStatus{Status: "active", TodosDone: 0, TodosTotal: 1, ActiveTask: activeTask, WaitEstimate: waitEst, SessionState: "in_progress"}, nil
		}

		sessionState := "stuck"
		if hasActive {
			sessionState = "stuck"
		} else if pollCount <= 6 {
			sessionState = "just_started"
		} else {
			sessionState = "stuck"
		}

		if full {
			outputFile := fmt.Sprintf("/tmp/sa-%s-output-%s.txt", projectHash, session)
			fullCapture, _ := runCmd("tmux", "capture-pane", "-t", session, "-p", "-S", "-300")
			fullCapture = strings.Join(trimLines(fullCapture), "\n")
			lines := trimLines(fullCapture)
			if len(lines) > 200 {
				lines = lines[:200]
			}
			_ = os.WriteFile(outputFile, []byte(strings.Join(lines, "\n")), 0o644)
			return tmuxStatus{Status: "idle", TodosDone: 0, TodosTotal: 1, ActiveTask: outputFile, WaitEstimate: 0, SessionState: sessionState}, nil
		}
		codexSaveState(stateFile, pollCount, hasActive, 0, 1, lastHash, lastAt)
		return tmuxStatus{Status: "idle", TodosDone: 0, TodosTotal: 1, ActiveTask: "", WaitEstimate: 0, SessionState: sessionState}, nil
	}

	if heartbeatStatus == "dead" || heartbeatStatus == "completed" {
		if full {
			outputFile := fmt.Sprintf("/tmp/sa-%s-output-%s.txt", projectHash, session)
			fullCapture, _ := runCmd("tmux", "capture-pane", "-t", session, "-p", "-S", "-300")
			fullCapture = strings.Join(trimLines(fullCapture), "\n")
			lines := trimLines(fullCapture)
			if len(lines) > 200 {
				lines = lines[:200]
			}
			_ = os.WriteFile(outputFile, []byte(strings.Join(lines, "\n")), 0o644)
			return tmuxStatus{Status: "idle", TodosDone: 1, TodosTotal: 1, ActiveTask: outputFile, WaitEstimate: 0, SessionState: "completed"}, nil
		}
		codexSaveState(stateFile, pollCount, true, 1, 1, lastHash, lastAt)
		return tmuxStatus{Status: "idle", TodosDone: 1, TodosTotal: 1, ActiveTask: "", WaitEstimate: 0, SessionState: "completed"}, nil
	}

	sessionState := "stuck"
	if hasActive {
		sessionState = "idle"
	} else if pollCount <= 6 {
		sessionState = "just_started"
	} else {
		sessionState = "stuck"
	}

	if full {
		outputFile := fmt.Sprintf("/tmp/sa-%s-output-%s.txt", projectHash, session)
		fullCapture, _ := runCmd("tmux", "capture-pane", "-t", session, "-p", "-S", "-300")
		fullCapture = strings.Join(trimLines(fullCapture), "\n")
		lines := trimLines(fullCapture)
		if len(lines) > 200 {
			lines = lines[:200]
		}
		_ = os.WriteFile(outputFile, []byte(strings.Join(lines, "\n")), 0o644)
		return tmuxStatus{Status: "idle", TodosDone: 0, TodosTotal: 0, ActiveTask: outputFile, WaitEstimate: 0, SessionState: sessionState}, nil
	}
	codexSaveState(stateFile, pollCount, hasActive, 0, 0, lastHash, lastAt)
	return tmuxStatus{Status: "idle", TodosDone: 0, TodosTotal: 0, ActiveTask: "", WaitEstimate: 0, SessionState: sessionState}, nil
}

func cmdTmuxStatusCheck(args []string) int {
	if len(args) == 0 {
		fmt.Println("error,0,0,no_session_name,30,error")
		return 1
	}
	session := args[0]
	args = args[1:]

	full := false
	projectRoot := getPWD()
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--full":
			full = true
		case "--project-root":
			if i+1 < len(args) {
				projectRoot = args[i+1]
				i++
			}
		}
	}

	status, err := tmuxStatusCheck(session, full, projectRoot)
	if err != nil {
		fmt.Printf("error,0,0,%s,30,error\n", err.Error())
		return 1
	}

	fmt.Printf("%s,%d,%d,%s,%d,%s\n", status.Status, status.TodosDone, status.TodosTotal, status.ActiveTask, status.WaitEstimate, status.SessionState)
	return 0
}

func tmuxStatusCheck(session string, full bool, projectRoot string) (tmuxStatus, error) {
	if session == "" {
		return tmuxStatus{Status: "error", TodosDone: 0, TodosTotal: 0, ActiveTask: "no_session_name", WaitEstimate: 30, SessionState: "error"}, errors.New("no_session_name")
	}

	projectHash := md5Hex8(projectRoot)
	stateFile := fmt.Sprintf("/tmp/.sa-%s-session-%s-state.json", projectHash, session)

	if !tmuxHasSession(session) {
		_ = os.Remove(stateFile)
		return tmuxStatus{Status: "not_found", TodosDone: 0, TodosTotal: 0, ActiveTask: "", WaitEstimate: 0, SessionState: "not_found"}, nil
	}

	paneStatus := tmuxPaneStatus(session)
	if strings.HasPrefix(paneStatus, "crashed:") {
		exitCode := strings.TrimPrefix(paneStatus, "crashed:")
		outputFile := fmt.Sprintf("/tmp/sa-%s-output-%s.txt", projectHash, session)
		capture, _ := runCmd("tmux", "capture-pane", "-t", session, "-p", "-S", "-200")
		lines := trimLines(capture)
		if len(lines) > 150 {
			lines = lines[:150]
		}
		_ = os.WriteFile(outputFile, []byte(strings.Join(lines, "\n")), 0o644)
		_ = os.Remove(stateFile)
		return tmuxStatus{Status: "crashed", TodosDone: 0, TodosTotal: 0, ActiveTask: outputFile, WaitEstimate: mustAtoi(exitCode), SessionState: "crashed"}, nil
	}

	state := loadTmuxState(stateFile)
	state.PollCount++

	capture, err := runCmd("tmux", "capture-pane", "-t", session, "-p", "-S", "-50")
	if err != nil || capture == "" {
		return tmuxStatus{Status: "error", TodosDone: 0, TodosTotal: 0, ActiveTask: "capture_failed", WaitEstimate: 30, SessionState: "error"}, errors.New("capture_failed")
	}
	capture = filterInputBox(capture)

	currentStatusTime := parseStatuslineTime(capture)

	agentType := detectCodexSession(session, capture)
	if agentType == "codex" {
		return codexStatusCheck(session, full, projectRoot, state.PollCount, state.HasEverBeenActive, paneStatus)
	}

	if regexp.MustCompile(`for [0-9]+m [0-9]+s`).MatchString(capture) {
		saveTmuxState(stateFile, state.PollCount, true, state.LastTodosDone, state.LastTodosTotal, currentStatusTime)
		if full {
			outputFile := fmt.Sprintf("/tmp/sa-%s-output-%s.txt", projectHash, session)
			fullCapture, _ := runCmd("tmux", "capture-pane", "-t", session, "-p", "-S", "-300")
			fullCapture = filterInputBox(fullCapture)
			lines := trimLines(fullCapture)
			if len(lines) > 200 {
				lines = lines[:200]
			}
			_ = os.WriteFile(outputFile, []byte(strings.Join(lines, "\n")), 0o644)
			return tmuxStatus{Status: "idle", TodosDone: state.LastTodosDone, TodosTotal: state.LastTodosTotal, ActiveTask: outputFile, WaitEstimate: 0, SessionState: "completed"}, nil
		}
		return tmuxStatus{Status: "idle", TodosDone: state.LastTodosDone, TodosTotal: state.LastTodosTotal, ActiveTask: "", WaitEstimate: 0, SessionState: "completed"}, nil
	}

	panePID, _ := tmuxDisplay(session, "#{pane_pid}")
	claudeRunning := false
	if strings.TrimSpace(panePID) != "" {
		_, err := runCmd("pgrep", "-P", strings.TrimSpace(panePID), "-f", "claude")
		if err == nil {
			claudeRunning = true
		}
	}

	activityDetected := regexp.MustCompile(`(?i)ctrl\+c to interrupt|Musing|Thinking|Working|Running|Loading|Beaming|Galloping|Razzmatazzing|Creating|⏺|✻|·`).MatchString(capture)

	if activityDetected || claudeRunning {
		activeTask := extractActiveTask(capture)
		if activeTask == "" {
			activeTask = "Claude working"
		}

		todosDone := countRune(capture, '☒')
		todosPending := countRune(capture, '☐')
		todosTotal := todosDone + todosPending

		if todosTotal > 0 {
			firstTodoLine := findFirstTodoLine(capture)
			if firstTodoLine <= 5 {
				expanded, _ := runCmd("tmux", "capture-pane", "-t", session, "-p", "-S", "-80")
				expanded = filterInputBox(expanded)
				todosDone = countRune(expanded, '☒')
				todosPending = countRune(expanded, '☐')
				todosTotal = todosDone + todosPending
			}
		}

		cleanTask := strings.NewReplacer(",", "", "\"", "").Replace(activeTask)
		cleanTask = strings.TrimSpace(strings.ReplaceAll(cleanTask, "\n", " "))
		waitEst := estimateWait(cleanTask, todosDone, todosTotal)

		saveTmuxState(stateFile, state.PollCount, true, todosDone, todosTotal, currentStatusTime)
		return tmuxStatus{Status: "active", TodosDone: todosDone, TodosTotal: todosTotal, ActiveTask: cleanTask, WaitEstimate: waitEst, SessionState: "in_progress"}, nil
	}

	sessionState := "stuck"
	if state.HasEverBeenActive {
		sessionState = "completed"
	} else if state.PollCount <= 10 {
		sessionState = "just_started"
	} else {
		if currentStatusTime != "" && state.LastStatusTime != "" {
			if currentStatusTime != state.LastStatusTime {
				sessionState = "just_started"
			} else {
				sessionState = "stuck"
			}
		} else if currentStatusTime != "" {
			sessionState = "just_started"
		} else {
			sessionState = "stuck"
		}
	}

	if full {
		outputFile := fmt.Sprintf("/tmp/sa-%s-output-%s.txt", projectHash, session)
		fullCapture, _ := runCmd("tmux", "capture-pane", "-t", session, "-p", "-S", "-300")
		filtered := filterInputBox(fullCapture)
		lines := trimLines(filtered)
		if len(lines) > 200 {
			lines = lines[:200]
		}
		content := strings.Join(lines, "\n")
		lineCount := len(lines)
		content = content + "\n\n---\n" + fmt.Sprintf("Captured: %d lines at %s", lineCount, nowUTC().Format("2006-01-02T15:04:05Z"))
		_ = os.WriteFile(outputFile, []byte(content), 0o644)

		if strings.HasPrefix(paneStatus, "exited:") {
			sessionState = "completed"
		}

		saveTmuxState(stateFile, state.PollCount, state.HasEverBeenActive, 0, 0, currentStatusTime)
		return tmuxStatus{Status: "idle", TodosDone: 0, TodosTotal: 0, ActiveTask: outputFile, WaitEstimate: 0, SessionState: sessionState}, nil
	}

	saveTmuxState(stateFile, state.PollCount, state.HasEverBeenActive, 0, 0, currentStatusTime)
	return tmuxStatus{Status: "idle", TodosDone: 0, TodosTotal: 0, ActiveTask: "", WaitEstimate: 0, SessionState: sessionState}, nil
}

func cmdMonitorSession(args []string) int {
	if len(args) == 0 {
		fmt.Fprintln(os.Stderr, "Usage: monitor-session <session_name> [options]")
		return 1
	}
	if isHelpFlag(args[0]) {
		fmt.Println("Usage: monitor-session <session_name> [options]")
		fmt.Println("Options: --max-polls N --initial-wait N --project-root PATH --timeout MIN --verbose --json --agent TYPE --workflow TYPE --story-key KEY")
		return 0
	}

	sessionName := ""
	maxPolls := 30
	initialWait := 5
	projectRoot := getProjectRoot()
	timeoutMinutes := 60
	verbose := false
	jsonOutput := false
	agentType := os.Getenv("AI_AGENT")
	if agentType == "" {
		agentType = "claude"
	}
	workflowType := "dev"
	storyKey := ""

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--max-polls":
			if i+1 < len(args) {
				maxPolls, _ = strconv.Atoi(args[i+1])
				i++
			}
		case "--initial-wait":
			if i+1 < len(args) {
				initialWait, _ = strconv.Atoi(args[i+1])
				i++
			}
		case "--project-root":
			if i+1 < len(args) {
				projectRoot = args[i+1]
				i++
			}
		case "--timeout":
			if i+1 < len(args) {
				timeoutMinutes, _ = strconv.Atoi(args[i+1])
				i++
			}
		case "--verbose":
			verbose = true
		case "--json":
			jsonOutput = true
		case "--agent":
			if i+1 < len(args) {
				agentType = args[i+1]
				i++
			}
		case "--workflow":
			if i+1 < len(args) {
				workflowType = args[i+1]
				i++
			}
		case "--story-key":
			if i+1 < len(args) {
				storyKey = args[i+1]
				i++
			}
		default:
			if sessionName == "" && !strings.HasPrefix(args[i], "-") {
				sessionName = args[i]
			}
		}
	}

	if sessionName == "" {
		sessionName = args[0]
	}

	if sessionName == "" {
		fmt.Fprintln(os.Stderr, "Usage: monitor-session <session_name> [options]")
		return 1
	}

	if agentType == "codex" {
		timeoutMinutes = timeoutMinutes * 3 / 2
		if verbose {
			logf(verbose, "Codex agent detected - applying 1.5x timeout (%dmin)", timeoutMinutes)
		}
	}

	projectHash := md5Hex8(projectRoot)
	timeoutSeconds := timeoutMinutes * 60
	startTime := time.Now()
	lastTodosDone := 0
	lastTodosTotal := 0

	logf(verbose, "Starting monitor for session: %s", sessionName)
	logf(verbose, "Max polls: %d, Timeout: %dm", maxPolls, timeoutMinutes)
	logf(verbose, "Initial wait: %ds", initialWait)
	time.Sleep(time.Duration(initialWait) * time.Second)

	for poll := 1; poll <= maxPolls; poll++ {
		if int(time.Since(startTime).Seconds()) >= timeoutSeconds {
			logf(verbose, "Timeout reached")
			finalStatus, _ := tmuxStatusCheck(sessionName, true, projectRoot)
			outputFile := finalStatus.ActiveTask
			return outputMonitorResult(jsonOutput, "timeout", lastTodosDone, lastTodosTotal, verifyOrCreateOutput(outputFile, sessionName, projectHash, verbose), fmt.Sprintf("exceeded_%dm", timeoutMinutes))
		}

		status, err := tmuxStatusCheck(sessionName, false, projectRoot)
		if err != nil {
			logf(verbose, "Status check error, retrying...")
			time.Sleep(10 * time.Second)
			continue
		}

		if status.TodosDone > 0 || status.TodosTotal > 0 {
			lastTodosDone = status.TodosDone
			lastTodosTotal = status.TodosTotal
		}

		logf(verbose, "Poll %d: state=%s, progress=%d/%d, task=%s", poll, status.SessionState, status.TodosDone, status.TodosTotal, status.ActiveTask)

		switch status.SessionState {
		case "completed":
			logf(verbose, "Session completed - verifying workflow completion")
			finalStatus, _ := tmuxStatusCheck(sessionName, true, projectRoot)
			outputFile := finalStatus.ActiveTask
			if workflowType == "review" && storyKey != "" {
				verify := verifyCodeReviewCompletion(projectRoot, storyKey)
				if verify.Verified {
					return outputMonitorResult(jsonOutput, "completed", lastTodosDone, lastTodosTotal, verifyOrCreateOutput(outputFile, sessionName, projectHash, verbose), "verified_complete")
				}
				return outputMonitorResult(jsonOutput, "incomplete", lastTodosDone, lastTodosTotal, verifyOrCreateOutput(outputFile, sessionName, projectHash, verbose), "workflow_not_verified")
			}
			return outputMonitorResult(jsonOutput, "completed", lastTodosDone, lastTodosTotal, verifyOrCreateOutput(outputFile, sessionName, projectHash, verbose), "normal_completion")

		case "idle":
			finalStatus, _ := tmuxStatusCheck(sessionName, true, projectRoot)
			outputFile := finalStatus.ActiveTask
			if workflowType == "review" && storyKey != "" {
				verify := verifyCodeReviewCompletion(projectRoot, storyKey)
				if verify.Verified {
					return outputMonitorResult(jsonOutput, "completed", lastTodosDone, lastTodosTotal, verifyOrCreateOutput(outputFile, sessionName, projectHash, verbose), "verified_complete")
				}
				return outputMonitorResult(jsonOutput, "incomplete", lastTodosDone, lastTodosTotal, verifyOrCreateOutput(outputFile, sessionName, projectHash, verbose), "session_idle_workflow_incomplete")
			}
			if lastTodosDone > 0 || lastTodosTotal > 0 {
				return outputMonitorResult(jsonOutput, "completed", lastTodosDone, lastTodosTotal, verifyOrCreateOutput(outputFile, sessionName, projectHash, verbose), "idle_after_activity")
			}
			return outputMonitorResult(jsonOutput, "stuck", 0, 0, verifyOrCreateOutput(outputFile, sessionName, projectHash, verbose), "idle_no_activity")

		case "crashed":
			return outputMonitorResult(jsonOutput, "crashed", lastTodosDone, lastTodosTotal, verifyOrCreateOutput(status.ActiveTask, sessionName, projectHash, verbose), fmt.Sprintf("exit_code_%d", status.WaitEstimate))

		case "not_found":
			return outputMonitorResult(jsonOutput, "not_found", lastTodosDone, lastTodosTotal, "", "session_gone")

		case "stuck":
			finalStatus, _ := tmuxStatusCheck(sessionName, true, projectRoot)
			outputFile := finalStatus.ActiveTask
			return outputMonitorResult(jsonOutput, "stuck", 0, 0, verifyOrCreateOutput(outputFile, sessionName, projectHash, verbose), "never_active")

		case "error":
			logf(verbose, "Status check error, retrying...")
			time.Sleep(10 * time.Second)
			continue

		case "in_progress", "just_started":
			waitTime := status.WaitEstimate
			maxWait := 120
			if agentType == "codex" {
				maxWait = 180
			}
			if waitTime > maxWait {
				waitTime = maxWait
			}
			logf(verbose, "Waiting %ds before next poll...", waitTime)
			time.Sleep(time.Duration(waitTime) * time.Second)

		default:
			logf(verbose, "Unknown session state: %s", status.SessionState)
			time.Sleep(30 * time.Second)
		}
	}

	finalStatus, _ := tmuxStatusCheck(sessionName, true, projectRoot)
	outputFile := finalStatus.ActiveTask
	return outputMonitorResult(jsonOutput, "timeout", lastTodosDone, lastTodosTotal, verifyOrCreateOutput(outputFile, sessionName, projectHash, verbose), "max_polls_exceeded")
}

func logf(enabled bool, format string, args ...any) {
	if !enabled {
		return
	}
	stamp := time.Now().Format("15:04:05")
	fmt.Fprintf(os.Stderr, "[%s] %s\n", stamp, fmt.Sprintf(format, args...))
}

func outputMonitorResult(jsonOutput bool, state string, done, total int, outputFile, reason string) int {
	if jsonOutput {
		fmt.Printf("{\"final_state\":%q,\"todos_done\":%d,\"todos_total\":%d,\"output_file\":%q,\"exit_reason\":%q,\"output_verified\":%t}\n", state, done, total, outputFile, reason, outputFile != "")
	} else {
		fmt.Printf("%s,%d,%d,%s,%s\n", state, done, total, outputFile, reason)
	}
	return 0
}

func verifyOrCreateOutput(outputFile, sessionName, projectHash string, verbose bool) string {
	if outputFile != "" && fileExists(outputFile) {
		info, _ := os.Stat(outputFile)
		if info != nil && info.Size() > 0 {
			return outputFile
		}
	}

	fallbackFile := fmt.Sprintf("/tmp/sa-%s-output-%s-fallback.txt", projectHash, sessionName)
	if tmuxHasSession(sessionName) {
		capture, _ := runCmd("tmux", "capture-pane", "-t", sessionName, "-p", "-S", "-300")
		lines := trimLines(capture)
		if len(lines) > 200 {
			lines = lines[:200]
		}
		_ = os.WriteFile(fallbackFile, []byte(strings.Join(lines, "\n")), 0o644)
		if fileExists(fallbackFile) {
			info, _ := os.Stat(fallbackFile)
			if info != nil && info.Size() > 0 {
				return fallbackFile
			}
		}
	}

	expected := fmt.Sprintf("/tmp/sa-%s-output-%s.txt", projectHash, sessionName)
	if fileExists(expected) {
		info, _ := os.Stat(expected)
		if info != nil && info.Size() > 0 {
			return expected
		}
	}

	return ""
}

func tmuxHasSession(session string) bool {
	_, err := runCmd("tmux", "has-session", "-t", session)
	return err == nil
}

func tmuxDisplay(session, format string) (string, error) {
	out, err := runCmd("tmux", "display-message", "-t", session, "-p", format)
	return strings.TrimSpace(out), err
}

func tmuxShowEnvironment(session, key string) (string, error) {
	out, err := runCmd("tmux", "show-environment", "-t", session, key)
	if err != nil {
		return "", err
	}
	parts := strings.SplitN(strings.TrimSpace(out), "=", 2)
	if len(parts) == 2 {
		return parts[1], nil
	}
	return "", nil
}

func tmuxNewSession(session, projectRoot, agentType string) error {
	_, err := runCmd("tmux", "new-session", "-d", "-s", session, "-x", "200", "-y", "50", "-c", projectRoot, "-e", "STORY_AUTOMATOR_CHILD=true", "-e", "AI_AGENT="+agentType, "-e", "CLAUDECODE=")
	return err
}

func tmuxSendKeys(session, command string, enter bool) error {
	args := []string{"send-keys", "-t", session, command}
	if enter {
		args = append(args, "Enter")
	}
	_, err := runCmd("tmux", args...)
	return err
}

func tmuxListSessions(projectOnly bool) ([]string, error) {
	out, err := runCmd("tmux", "list-sessions", "-F", "#{session_name}")
	if err != nil {
		return []string{}, err
	}
	lines := trimLines(out)
	if projectOnly {
		prefix := "sa-" + getProjectSlug() + "-"
		filtered := []string{}
		for _, line := range lines {
			if strings.HasPrefix(line, prefix) {
				filtered = append(filtered, line)
			}
		}
		return filtered, nil
	}

	filtered := []string{}
	for _, line := range lines {
		if strings.HasPrefix(line, "sa-") {
			filtered = append(filtered, line)
		}
	}
	return filtered, nil
}

func tmuxKillSession(session string) {
	_, _ = runCmd("tmux", "kill-session", "-t", session)
	projectHash := getProjectHash()
	_ = os.Remove(fmt.Sprintf("/tmp/.sa-%s-session-%s-state.json", projectHash, session))
	_ = os.Remove(fmt.Sprintf("/tmp/sa-%s-output-%s.txt", projectHash, session))
	_ = os.Remove(fmt.Sprintf("/tmp/sa-cmd-%s.sh", session))
}

func tmuxPaneStatus(session string) string {
	paneDead, _ := tmuxDisplay(session, "#{pane_dead}")
	exitStatus, _ := tmuxDisplay(session, "#{pane_dead_status}")
	if paneDead == "1" {
		if exitStatus != "" && exitStatus != "0" {
			return "crashed:" + exitStatus
		}
		return "exited:0"
	}
	return "alive"
}

func getProjectRoot() string {
	if v := os.Getenv("PROJECT_ROOT"); v != "" {
		return v
	}
	return getPWD()
}

func getProjectSlug() string {
	base := filepath.Base(getProjectRoot())
	lower := strings.ToLower(base)
	var b strings.Builder
	for _, r := range lower {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
		}
	}
	slug := b.String()
	if len(slug) > 8 {
		slug = slug[:8]
	}
	return slug
}

func getProjectHash() string {
	return md5Hex8(getProjectRoot())
}

func generateSessionName(step, epic, storyID, cycle string) string {
	projectSlug := getProjectSlug()
	stamp := time.Now().Format("060102-150405")
	storySuffix := strings.ReplaceAll(storyID, ".", "-")
	name := fmt.Sprintf("sa-%s-%s-e%s-s%s-%s", projectSlug, stamp, epic, storySuffix, step)
	if cycle != "" {
		name = name + "-r" + cycle
	}
	return name
}

func getAgentType() string {
	if v := os.Getenv("AI_AGENT"); v != "" {
		return v
	}
	return "claude"
}

func getAgentCLI(agent string) string {
	if agent == "codex" {
		return "codex exec"
	}
	return "claude --dangerously-skip-permissions"
}

func getSkillPrefix(agent string) string {
	if agent == "codex" {
		return "none"
	}
	return "bmad-"
}

func detectCodexSession(session, capture string) string {
	envAgent, _ := tmuxShowEnvironment(session, "AI_AGENT")
	if envAgent == "codex" {
		return "codex"
	}
	if regexp.MustCompile(`(?i)OpenAI Codex|codex exec|gpt-[0-9]+-codex|tokens used|codex-cli`).MatchString(capture) {
		return "codex"
	}
	return "claude"
}

func estimateWait(task string, done, total int) int {
	lower := strings.ToLower(task)
	if regexp.MustCompile(`loading|reading|searching|parsing`).MatchString(lower) {
		return 30
	}
	if regexp.MustCompile(`presenting|waiting|menu|select|choose`).MatchString(lower) {
		return 15
	}
	if regexp.MustCompile(`running tests|testing|building|compiling|installing`).MatchString(lower) {
		return 120
	}
	if regexp.MustCompile(`writing|editing|updating|creating|fixing`).MatchString(lower) {
		return 60
	}
	if total > 0 {
		progress := 100 * done / total
		switch {
		case progress < 25:
			return 90
		case progress < 50:
			return 75
		case progress < 75:
			return 60
		default:
			return 30
		}
	}
	return 60
}

func extractActiveTask(capture string) string {
	lines := trimLines(capture)
	pattern := regexp.MustCompile(`(?i)(·|✳|⠋|⠙|⠹|⠸|⠼|⠴|⠦|⠧|⠇|⠏|✶|✻|Galloping|Working|Running|Beaming|Razzmatazzing|Creating)`)
	var activeLine string
	for _, line := range lines {
		if pattern.MatchString(line) {
			activeLine = line
		}
	}
	if activeLine == "" {
		return ""
	}
	activeLine = strings.TrimSpace(activeLine)
	activeLine = regexp.MustCompile(`[·✳⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏✶✻]`).ReplaceAllString(activeLine, "")
	activeLine = regexp.MustCompile(`\(ctrl\+c.*`).ReplaceAllString(activeLine, "")
	activeLine = strings.TrimSpace(activeLine)
	if len(activeLine) > 80 {
		activeLine = activeLine[:80]
	}
	return activeLine
}

func countRune(s string, target rune) int {
	count := 0
	for _, r := range s {
		if r == target {
			count++
		}
	}
	return count
}

func findFirstTodoLine(capture string) int {
	lines := trimLines(capture)
	for idx, line := range lines {
		if strings.Contains(line, "☒") || strings.Contains(line, "☐") {
			return idx + 1
		}
	}
	return 999
}

func parseStatuslineTime(capture string) string {
	re := regexp.MustCompile(`\| [0-9]{2}:[0-9]{2}:[0-9]{2}`)
	lines := trimLines(capture)
	last := ""
	for _, line := range lines {
		if re.MatchString(line) {
			parts := re.FindAllString(line, -1)
			if len(parts) > 0 {
				last = strings.TrimSpace(strings.TrimPrefix(parts[len(parts)-1], "|"))
			}
		}
	}
	return last
}

func loadTmuxState(path string) tmuxState {
	if !fileExists(path) {
		return tmuxState{PollCount: 0, HasEverBeenActive: false, LastTodosDone: 0, LastTodosTotal: 0}
	}
	var state tmuxState
	if raw, err := os.ReadFile(path); err == nil {
		_ = json.Unmarshal(raw, &state)
	}
	return state
}

func saveTmuxState(path string, pollCount int, hasActive bool, done int, total int, statusTime string) {
	payload := map[string]any{
		"pollCount":          pollCount,
		"hasEverBeenActive":  hasActive,
		"lastTodosDone":      done,
		"lastTodosTotal":     total,
		"lastStatuslineTime": statusTime,
		"lastPollAt":         nowUTC().Format("2006-01-02T15:04:05Z"),
	}
	b, _ := json.Marshal(payload)
	_ = writeFileAtomic(path, b)
}

func codexLoadState(path string) codexState {
	if !fileExists(path) {
		return codexState{PollCount: 0, HasEverBeenActive: false, LastTodosDone: 0, LastTodosTotal: 0, LastOutputHash: "", LastOutputAt: 0}
	}
	var state codexState
	if raw, err := os.ReadFile(path); err == nil {
		_ = json.Unmarshal(raw, &state)
	}
	return state
}

func codexSaveState(path string, pollCount int, hasActive bool, done int, total int, hash string, outputAt int64) {
	payload := map[string]any{
		"pollCount":         pollCount,
		"hasEverBeenActive": hasActive,
		"lastTodosDone":     done,
		"lastTodosTotal":    total,
		"lastOutputHash":    hash,
		"lastOutputAt":      outputAt,
		"lastPollAt":        nowUTC().Format("2006-01-02T15:04:05Z"),
	}
	b, _ := json.Marshal(payload)
	_ = writeFileAtomic(path, b)
}

func mustAtoi(input string) int {
	v, _ := strconv.Atoi(input)
	return v
}
