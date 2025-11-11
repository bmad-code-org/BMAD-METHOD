# Bundle Distribution Setup (For Maintainers)

**Audience:** BMAD maintainers setting up bundle auto-publishing

---

## One-Time Setup

Run these 3 commands to enable auto-publishing:

```bash
# 1. Create bmad-bundles repo
gh repo create bmad-code-org/bmad-bundles --public --description "BMAD Web Bundles"

# 2. Enable GitHub Pages
gh repo edit bmad-code-org/bmad-bundles --enable-pages --pages-branch main

# 3. Create deploy key
ssh-keygen -t ed25519 -C "github-actions" -f deploy-key -N ""
gh repo deploy-key add deploy-key.pub --repo bmad-code-org/bmad-bundles --title "CI" --allow-write
gh secret set BUNDLES_DEPLOY_KEY --repo bmad-code-org/BMAD-METHOD < deploy-key
rm deploy-key*
```

**Done.** Bundles auto-publish on every main merge.

---

## How It Works

**On main merge:**

- `.github/workflows/bundle-latest.yml` runs
- Publishes to: `https://bmad-code-org.github.io/bmad-bundles/`

**On release:**

- `npm run release:patch` runs `.github/workflows/manual-release.yaml`
- Attaches bundles to: `https://github.com/bmad-code-org/BMAD-METHOD/releases/latest`

---

## Testing

```bash
# Test latest channel
git push origin main
# Wait 2 min, then: curl https://bmad-code-org.github.io/bmad-bundles/

# Test stable channel
npm run release:patch
# Check: gh release view
```

---

## Troubleshooting

**"Permission denied (publickey)"**

```bash
gh secret list --repo bmad-code-org/BMAD-METHOD | grep BUNDLES
```

**GitHub Pages not updating**

```bash
gh repo edit bmad-code-org/bmad-bundles --enable-pages
```

---

## Distribution URLs

**Stable:** `https://github.com/bmad-code-org/BMAD-METHOD/releases/latest`
**Latest:** `https://bmad-code-org.github.io/bmad-bundles/`
