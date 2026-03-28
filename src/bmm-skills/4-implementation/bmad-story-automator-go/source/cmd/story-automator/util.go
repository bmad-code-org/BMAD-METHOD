package main

import (
	"bytes"
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
	"strings"
	"time"
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
	cmd := exec.Command(name, args...)
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out
	err := cmd.Run()
	return out.String(), err
}

func runCmdExit(name string, args ...string) (string, int, error) {
	cmd := exec.Command(name, args...)
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out
	err := cmd.Run()
	if err == nil {
		return out.String(), 0, nil
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
	tmp := filepath.Join(dir, fmt.Sprintf(".%s.tmp", filepath.Base(path)))
	if err := os.WriteFile(tmp, data, 0o644); err != nil {
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
