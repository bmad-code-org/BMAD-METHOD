package main

import (
	"bytes"
	"context"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"
)

const (
	defaultCommandTimeout = 10 * time.Minute
	commandTimeoutExit    = 124
)

func mustJSON(v any) string {
	b, err := json.Marshal(v)
	if err != nil {
		return "{}"
	}
	return string(b)
}

func writeJSON(v any) {
	fmt.Println(mustJSON(v))
}

func writeJSONTo(w io.Writer, v any) {
	fmt.Fprintln(w, mustJSON(v))
}

func readFile(path string) (string, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func fileExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && !info.IsDir()
}

func dirExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && info.IsDir()
}

func ensureDir(path string) error {
	return os.MkdirAll(path, 0o755)
}

func getPWD() string {
	wd, err := os.Getwd()
	if err != nil {
		return ""
	}
	return wd
}

func md5Hex8(input string) string {
	h := md5.Sum([]byte(input))
	return hex.EncodeToString(h[:])[:8]
}

func runCmd(name string, args ...string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), defaultCommandTimeout)
	defer cancel()

	cmd := exec.CommandContext(ctx, name, args...)
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out
	err := cmd.Run()
	if errors.Is(ctx.Err(), context.DeadlineExceeded) {
		return out.String(), ctx.Err()
	}
	return out.String(), err
}

func runCmdExit(name string, args ...string) (string, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), defaultCommandTimeout)
	defer cancel()

	cmd := exec.CommandContext(ctx, name, args...)
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out
	err := cmd.Run()
	if err == nil {
		return out.String(), 0, nil
	}
	if errors.Is(ctx.Err(), context.DeadlineExceeded) {
		return out.String(), commandTimeoutExit, ctx.Err()
	}
	var exitErr *exec.ExitError
	if errors.As(err, &exitErr) {
		return out.String(), exitErr.ExitCode(), err
	}
	return out.String(), 1, err
}

func execLookPath(bin string) (string, error) {
	return exec.LookPath(bin)
}

func writeFileAtomic(path string, data []byte) error {
	dir := filepath.Dir(path)
	tmpFile, err := os.CreateTemp(dir, fmt.Sprintf(".%s.*.tmp", filepath.Base(path)))
	if err != nil {
		return err
	}
	tmp := tmpFile.Name()
	defer os.Remove(tmp)
	if err := tmpFile.Chmod(0o644); err != nil {
		_ = tmpFile.Close()
		return err
	}
	if _, err := tmpFile.Write(data); err != nil {
		_ = tmpFile.Close()
		return err
	}
	if err := tmpFile.Sync(); err != nil {
		_ = tmpFile.Close()
		return err
	}
	if err := tmpFile.Close(); err != nil {
		return err
	}
	return os.Rename(tmp, path)
}

func filterInputBox(input string) string {
	lines := strings.Split(input, "\n")
	var out []string
	inBox := false
	startRe := regexp.MustCompile(`^\s*[╭┌]`)
	endRe := regexp.MustCompile(`^\s*[╰└]`)
	boxLineRe := regexp.MustCompile(`^\s*[│|]`)
	for _, line := range lines {
		if startRe.MatchString(line) {
			inBox = true
			continue
		}
		if endRe.MatchString(line) {
			inBox = false
			continue
		}
		if inBox && boxLineRe.MatchString(line) {
			continue
		}
		out = append(out, line)
	}
	return strings.Join(out, "\n")
}

func nowUTC() time.Time {
	return time.Now().UTC()
}

func trimLines(input string) []string {
	raw := strings.Split(input, "\n")
	lines := make([]string, 0, len(raw))
	for _, line := range raw {
		lines = append(lines, strings.TrimRight(line, "\r"))
	}
	return lines
}

func containsAnyPrefix(line string, prefixes []string) bool {
	for _, p := range prefixes {
		if strings.HasPrefix(line, p) {
			return true
		}
	}
	return false
}

func clampInt(val, min, max int) int {
	if val < min {
		return min
	}
	if val > max {
		return max
	}
	return val
}

func isHelpFlag(arg string) bool {
	return arg == "--help" || arg == "-h"
}

func unquoteScalar(val string) string {
	val = strings.TrimSpace(val)
	if len(val) < 2 {
		return val
	}
	if (val[0] == '"' && val[len(val)-1] == '"') || (val[0] == '\'' && val[len(val)-1] == '\'') {
		if unquoted, err := strconv.Unquote(val); err == nil {
			return unquoted
		}
		return val[1 : len(val)-1]
	}
	return val
}

func parseStringListLiteral(raw string) []string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}
	out := []string{}
	if err := json.Unmarshal([]byte(raw), &out); err == nil {
		return out
	}
	return nil
}
