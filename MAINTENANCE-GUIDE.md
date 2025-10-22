# BMad Method - Maintenance & Troubleshooting Guide

**Version:** v6 Alpha
**Last Updated:** 2025-10-07

---

## 🔧 Maintenance Scripts

### Quick Health Check
```bash
bash /Users/hbl/Documents/BMAD-METHOD/bmad-doctor.sh
```

**Shows:**
- Installation status
- Installed modules
- Slash commands count
- Global aliases
- Environment variables
- Project workspaces

### Full Validation
```bash
bash /Users/hbl/Documents/BMAD-METHOD/validate-bmad-setup.sh
```

**Checks:**
- All 10 critical components
- Detailed error reporting
- Specific fix suggestions

### Update & Sync
```bash
bash /Users/hbl/Documents/BMAD-METHOD/bmad-update.sh
```

**Options:**
```bash
bmad-update.sh update         # Full update (git pull + npm install + commands)
bmad-update.sh commands-only  # Only sync slash commands
bmad-update.sh verify         # Verify installation
bmad-update.sh backup         # Create backup
bmad-update.sh restore        # Restore from backup
```

---

## 🩹 Common Issues & Fixes

### Issue 1: Slash Commands Not Showing

**Symptoms:**
- Type `/` in Claude Code
- No `/bmad:*` commands appear

**Fix:**
```bash
# Option 1: Use update script
bash /Users/hbl/Documents/BMAD-METHOD/bmad-update.sh commands-only

# Option 2: Manual copy
cp -r /Users/hbl/Documents/BMAD-METHOD/.claude/commands/bmad ~/.claude/commands/

# Option 3: Restart Claude Code
# Close and reopen Claude Code application
```

**Verify:**
```bash
ls ~/.claude/commands/bmad
# Should show: bmm/ core/
```

---

### Issue 2: BMad CLI Not Working

**Symptoms:**
```bash
bmad status
# Output: command not found: bmad
```

**Fix:**
```bash
# 1. Check if alias exists
grep "alias bmad=" ~/.zshrc

# 2. If missing, add it
echo 'alias bmad="node /Users/hbl/Documents/BMAD-METHOD/tools/cli/bmad-cli.js"' >> ~/.zshrc

# 3. Reload shell
source ~/.zshrc

# 4. Test
bmad status
```

---

### Issue 3: Module Installation Failed

**Symptoms:**
- CIS or BMB module not showing after installation
- Installer completed but module missing

**Fix:**
```bash
# 1. Check manifest
cat /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml

# 2. Re-run installer
cd /Users/hbl/Documents/BMAD-METHOD
npm run install:bmad
# Select missing modules

# 3. Verify
bash /Users/hbl/Documents/BMAD-METHOD/bmad-doctor.sh
```

---

### Issue 4: Project Workspace Not Detected

**Symptoms:**
- BMad commands don't work in project
- `.bmad/` folder exists but not recognized

**Fix:**
```bash
# 1. Verify workspace structure
cd /path/to/your/project
ls -la .bmad

# Should show:
# .bmad/
#   .bmadrc
#   analysis/
#   planning/
#   stories/
#   etc.

# 2. Check configuration
cat .bmad/.bmadrc

# 3. Re-create if broken
bmad-init $(pwd)
```

---

### Issue 5: Environment Variables Not Loading

**Symptoms:**
- `echo $BMAD_HOME` returns empty
- BMad functions not available

**Fix:**
```bash
# 1. Check if .bmadrc exists
ls -la ~/.bmadrc

# 2. Check if sourced in .zshrc
grep "source ~/.bmadrc" ~/.zshrc

# 3. If missing, add it
echo '[ -f ~/.bmadrc ] && source ~/.bmadrc' >> ~/.zshrc

# 4. Reload
source ~/.zshrc

# 5. Verify
echo $BMAD_HOME
# Should output: /Users/hbl/Documents/BMAD-METHOD/bmad
```

---

### Issue 6: Outdated BMad Version

**Symptoms:**
- Missing features mentioned in docs
- Old workflow behavior

**Fix:**
```bash
# 1. Check current version
cat /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml | grep version

# 2. Pull latest changes
cd /Users/hbl/Documents/BMAD-METHOD
git pull origin v6-alpha

# 3. Update everything
bash /Users/hbl/Documents/BMAD-METHOD/bmad-update.sh

# 4. Verify
bmad-doctor
```

---

### Issue 7: Slash Command Files Corrupted

**Symptoms:**
- Commands exist but don't work
- Error messages when activating agents

**Fix:**
```bash
# 1. Backup current commands
mv ~/.claude/commands/bmad ~/.claude/commands/bmad-backup-$(date +%Y%m%d)

# 2. Fresh copy
cp -r /Users/hbl/Documents/BMAD-METHOD/.claude/commands/bmad ~/.claude/commands/

# 3. Restart Claude Code

# 4. Test
# Type / and look for /bmad:* commands
```

---

## 🔄 Regular Maintenance Schedule

### Weekly
```bash
# Quick health check
bmad-doctor
```

### Monthly
```bash
# Update to latest version
cd /Users/hbl/Documents/BMAD-METHOD
bash bmad-update.sh
```

### Before Major Work
```bash
# Create backup
bash /Users/hbl/Documents/BMAD-METHOD/bmad-update.sh backup
```

### After Alpha Updates
```bash
# Full update process
cd /Users/hbl/Documents/BMAD-METHOD
git pull origin v6-alpha
npm install
bash bmad-update.sh commands-only
```

---

## 🔍 Diagnostic Commands

### Check Installation
```bash
ls -la /Users/hbl/Documents/BMAD-METHOD/bmad
```

### Count Modules
```bash
grep -A 10 "^modules:" /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml
```

### Count Slash Commands
```bash
find ~/.claude/commands/bmad -name "*.md" | wc -l
```

### List All BMad Projects
```bash
bmad-list
# Or manually:
find /Users/hbl/Documents -name ".bmadrc" -type f 2>/dev/null | while read rc; do dirname "$rc"; done
```

### Check Subagents
```bash
ls ~/.claude/agents/bmad-*
```

---

## 🚨 Emergency Recovery

### Complete Reinstallation

If everything is broken:

```bash
# 1. Backup important project workspaces
cp -r /Users/hbl/Documents/pages-health/.bmad ~/bmad-backup-pages-health

# 2. Remove broken installation
rm -rf /Users/hbl/Documents/BMAD-METHOD/bmad
rm -rf ~/.claude/commands/bmad
rm -rf ~/.claude/agents/bmad-*

# 3. Fresh install
cd /Users/hbl/Documents/BMAD-METHOD
npm install
npm run install:bmad

# 4. Restore project workspaces
cp -r ~/bmad-backup-pages-health /Users/hbl/Documents/pages-health/.bmad

# 5. Verify
bash bmad-doctor.sh
```

### Restore from Backup

If you used `bmad-update.sh`:

```bash
# Restore last backup
bash /Users/hbl/Documents/BMAD-METHOD/bmad-update.sh restore
```

---

## 📊 Health Check Interpretation

### ✅ Healthy System
```
✓ Central BMad installation
✓ 6+ modules installed
✓ 60+ slash commands
✓ Global aliases configured
✓ Environment variables
✓ 1+ project workspace(s)

✅ BMad is healthy!
```

### ⚠️ Warnings (Functional)
```
✓ Central BMad installation
✓ 4 modules installed
  ⚠ CIS module missing
  ⚠ BMB module missing
✓ 44 slash commands
✓ Global aliases configured
✓ Environment variables
✓ 1 project workspace(s)

⚠️ BMad functional with 2 warning(s)
```

**Action:** Install missing modules

### ❌ Critical Issues
```
✗ Central BMad missing
✗ Slash commands missing
✗ Aliases missing

❌ Found 3 critical issue(s)
```

**Action:** Run full validation for detailed diagnostics

---

## 🆘 Getting Help

### Before Asking for Help

Run these diagnostics:

```bash
# 1. Health check
bash /Users/hbl/Documents/BMAD-METHOD/bmad-doctor.sh

# 2. Full validation
bash /Users/hbl/Documents/BMAD-METHOD/validate-bmad-setup.sh

# 3. Check version
cat /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml

# 4. Check shell config
grep -A 5 "BMad" ~/.zshrc

# 5. Test CLI
node /Users/hbl/Documents/BMAD-METHOD/tools/cli/bmad-cli.js status
```

### Support Resources

1. **Documentation:**
   - `/Users/hbl/Documents/BMAD-METHOD/SETUP-INSTRUCTIONS.md`
   - `/Users/hbl/Documents/BMAD-METHOD/QUICK-REFERENCE.md`
   - `/Users/hbl/Documents/BMAD-METHOD/OPTIMIZATION-CHECKLIST.md`

2. **Community:**
   - Discord: https://discord.gg/gk8jAdXWmj
   - GitHub Issues: https://github.com/bmad-code-org/BMAD-METHOD/issues

3. **Alpha Release Notes:**
   - Check: `/Users/hbl/Documents/BMAD-METHOD/v6-open-items.md`

---

## 📝 Logging & Debugging

### Enable Verbose Logging

```bash
# Set debug mode
export BMAD_DEBUG=true

# Run command
bmad status

# Disable debug mode
unset BMAD_DEBUG
```

### Check npm Logs

```bash
# If installation fails
npm install --loglevel verbose
```

### Git Status

```bash
cd /Users/hbl/Documents/BMAD-METHOD
git status
git log --oneline -5
```

---

## ✅ Maintenance Checklist

Before starting work:
- [ ] Run `bmad-doctor`
- [ ] Check for updates (`git pull`)
- [ ] Verify slash commands working
- [ ] Test in a project: `cd project && claude-code .`

After updates:
- [ ] Run `bmad-update.sh`
- [ ] Verify installation: `bmad-doctor`
- [ ] Test slash commands in Claude Code
- [ ] Update project workspaces if needed

When troubleshooting:
- [ ] Run full validation
- [ ] Check all diagnostics
- [ ] Try manual fixes
- [ ] Create backup before major changes
- [ ] Document what worked

---

**BMad v6 Alpha** | Maintenance Guide
