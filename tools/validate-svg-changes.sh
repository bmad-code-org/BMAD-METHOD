#!/bin/bash
#
# Visual SVG Validation Script
#
# Compares old vs new SVG files using browser-accurate rendering (Playwright)
# and pixel-level comparison (ImageMagick), then generates a prompt for AI analysis.
#
# Usage: ./tools/validate-svg-changes.sh <path-to-svg>
#

set -e

SVG_FILE="${1:-src/bmm/docs/images/workflow-method-greenfield.svg}"
TMP_DIR="/tmp/svg-validation-$$"

echo "🎨 Visual SVG Validation"
echo ""

# Check if file exists
if [ ! -f "$SVG_FILE" ]; then
    echo "❌ Error: SVG file not found: $SVG_FILE"
    exit 1
fi

# Check for ImageMagick
if ! command -v magick &> /dev/null; then
    echo "❌ ImageMagick not found"
    echo ""
    echo "Install with:"
    echo "  brew install imagemagick"
    echo ""
    exit 1
fi

echo "✓ ImageMagick found"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

echo "✓ Node.js found ($(node -v))"

# Check for Playwright (local install)
if [ ! -d "node_modules/playwright" ]; then
    echo ""
    echo "📦 Playwright not found locally"
    echo "Installing Playwright (local to this project, no package.json changes)..."
    echo ""
    npm install --no-save playwright
    echo ""
    echo "✓ Playwright installed"
else
    echo "✓ Playwright found"
fi

echo ""
echo "🔄 Rendering SVGs to PNG..."
echo ""

# Create temp directory
mkdir -p "$TMP_DIR"

# Extract old SVG from git
git show HEAD:"$SVG_FILE" > "$TMP_DIR/old.svg" 2>/dev/null || {
    echo "❌ Could not extract old SVG from git HEAD"
    echo "   Make sure you have uncommitted changes to compare"
    exit 1
}

# Copy new SVG
cp "$SVG_FILE" "$TMP_DIR/new.svg"

# Create Node.js renderer script in project directory (so it can find node_modules)
cat > "tools/render-svg-temp.js" << 'EOJS'
const { chromium } = require('playwright');
const fs = require('fs');

async function renderSVG(svgPath, pngPath) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  const widthMatch = svgContent.match(/width="([^"]+)"/);
  const heightMatch = svgContent.match(/height="([^"]+)"/);
  const width = Math.ceil(parseFloat(widthMatch[1]));
  const height = Math.ceil(parseFloat(heightMatch[1]));
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; background: white; }
        svg { display: block; }
      </style>
    </head>
    <body>${svgContent}</body>
    </html>
  `;
  
  await page.setContent(html);
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  
  console.log(`✓ Rendered ${pngPath}`);
}

(async () => {
  await renderSVG(process.argv[2], process.argv[3]);
  await renderSVG(process.argv[4], process.argv[5]);
})();
EOJS

# Render both SVGs (run from project dir so node_modules is accessible)
node tools/render-svg-temp.js \
  "$TMP_DIR/old.svg" "$TMP_DIR/old.png" \
  "$TMP_DIR/new.svg" "$TMP_DIR/new.png"

# Clean up temp script
rm tools/render-svg-temp.js

echo ""
echo "🔍 Comparing pixels..."
echo ""

# Compare using ImageMagick
DIFF_OUTPUT=$(magick compare -metric AE "$TMP_DIR/old.png" "$TMP_DIR/new.png" "$TMP_DIR/diff.png" 2>&1 || true)
DIFF_PIXELS=$(echo "$DIFF_OUTPUT" | awk '{print $1}')

# Get image dimensions
DIMENSIONS=$(magick identify -format "%wx%h" "$TMP_DIR/old.png")
WIDTH=$(echo "$DIMENSIONS" | cut -d'x' -f1)
HEIGHT=$(echo "$DIMENSIONS" | cut -d'x' -f2)
TOTAL_PIXELS=$((WIDTH * HEIGHT))

# Calculate percentage
DIFF_PERCENT=$(echo "scale=4; $DIFF_PIXELS / $TOTAL_PIXELS * 100" | bc)

echo "📊 Results:"
echo "  Dimensions: ${WIDTH} × ${HEIGHT}"
echo "  Total pixels: $(printf "%'d" $TOTAL_PIXELS)"
echo "  Different pixels: $(printf "%'d" $DIFF_PIXELS)"
echo "  Difference: ${DIFF_PERCENT}%"
echo ""

if (( $(echo "$DIFF_PERCENT < 0.01" | bc -l) )); then
    echo "✅ ESSENTIALLY IDENTICAL (< 0.01% difference)"
    VERDICT="essentially identical"
elif (( $(echo "$DIFF_PERCENT < 0.1" | bc -l) )); then
    echo "⚠️  MINOR DIFFERENCES (< 0.1%)"
    VERDICT="minor differences detected"
else
    echo "❌ SIGNIFICANT DIFFERENCES (≥ 0.1%)"
    VERDICT="significant differences detected"
fi

echo ""
echo "📁 Output files:"
echo "  Old render: $TMP_DIR/old.png"
echo "  New render: $TMP_DIR/new.png"
echo "  Diff image: $TMP_DIR/diff.png"
echo ""

# Generate HTML comparison page
cat > "$TMP_DIR/comparison.html" << 'EOHTML'
<!DOCTYPE html>
<html>
<head>
    <title>SVG Comparison</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { margin-bottom: 10px; color: #333; }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 15px;
        }
        .stat {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
        }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .stat-value { font-size: 18px; font-weight: 600; color: #333; margin-top: 4px; }
        .container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .panel {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h2 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 18px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
        }
        .image-container {
            border: 1px solid #ddd;
            background: white;
            overflow: auto;
            max-height: 600px;
        }
        img {
            display: block;
            max-width: 100%;
            height: auto;
        }
        .verdict {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
        }
        .verdict.good { background: #d4edda; color: #155724; }
        .verdict.warning { background: #fff3cd; color: #856404; }
        .verdict.bad { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 SVG Visual Comparison</h1>
        <p><strong>File:</strong> FILENAME_PLACEHOLDER</p>
        <div class="stats">
            <div class="stat">
                <div class="stat-label">Dimensions</div>
                <div class="stat-value">DIMENSIONS_PLACEHOLDER</div>
            </div>
            <div class="stat">
                <div class="stat-label">Different Pixels</div>
                <div class="stat-value">DIFF_PIXELS_PLACEHOLDER</div>
            </div>
            <div class="stat">
                <div class="stat-label">Difference</div>
                <div class="stat-value">DIFF_PERCENT_PLACEHOLDER%</div>
            </div>
            <div class="stat">
                <div class="stat-label">Verdict</div>
                <div class="stat-value"><span class="verdict VERDICT_CLASS_PLACEHOLDER">VERDICT_PLACEHOLDER</span></div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="panel">
            <h2>📄 Old (HEAD)</h2>
            <div class="image-container">
                <img src="old.png" alt="Old SVG">
            </div>
        </div>
        
        <div class="panel">
            <h2>📝 New (Working)</h2>
            <div class="image-container">
                <img src="new.png" alt="New SVG">
            </div>
        </div>
        
        <div class="panel">
            <h2>🔍 Diff (Red = Changes)</h2>
            <div class="image-container">
                <img src="diff.png" alt="Diff">
            </div>
        </div>
    </div>
</body>
</html>
EOHTML

# Determine verdict class for styling
if (( $(echo "$DIFF_PERCENT < 0.01" | bc -l) )); then
    VERDICT_CLASS="good"
elif (( $(echo "$DIFF_PERCENT < 0.1" | bc -l) )); then
    VERDICT_CLASS="warning"
else
    VERDICT_CLASS="bad"
fi

# Replace placeholders in HTML
sed -i '' "s|FILENAME_PLACEHOLDER|$SVG_FILE|g" "$TMP_DIR/comparison.html"
sed -i '' "s|DIMENSIONS_PLACEHOLDER|${WIDTH} × ${HEIGHT}|g" "$TMP_DIR/comparison.html"
sed -i '' "s|DIFF_PIXELS_PLACEHOLDER|$(printf "%'d" $DIFF_PIXELS) / $(printf "%'d" $TOTAL_PIXELS)|g" "$TMP_DIR/comparison.html"
sed -i '' "s|DIFF_PERCENT_PLACEHOLDER|$DIFF_PERCENT|g" "$TMP_DIR/comparison.html"
sed -i '' "s|VERDICT_PLACEHOLDER|$VERDICT|g" "$TMP_DIR/comparison.html"
sed -i '' "s|VERDICT_CLASS_PLACEHOLDER|$VERDICT_CLASS|g" "$TMP_DIR/comparison.html"

echo "✓ Generated comparison page: $TMP_DIR/comparison.html"
echo ""
echo "🌐 Opening comparison in browser..."
open "$TMP_DIR/comparison.html"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🤖 AI VISUAL ANALYSIS PROMPT"
echo ""
echo "Copy and paste this into Gemini/Claude with the diff image attached:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat << PROMPT

I've made changes to an Excalidraw diagram SVG file. Please analyze the visual differences between the old and new versions.

**Automated Analysis:**
- Dimensions: ${WIDTH} × ${HEIGHT} pixels
- Different pixels: $(printf "%'d" $DIFF_PIXELS) out of $(printf "%'d" $TOTAL_PIXELS)
- Difference: ${DIFF_PERCENT}%
- Verdict: ${VERDICT}

**Attached Image:**
The attached image shows the pixel-level diff (red = differences).

**Questions:**
1. Are the differences purely anti-aliasing/rendering artifacts, or are there actual content changes?
2. If there are content changes, what specifically changed?
3. Do the changes align with the intent to remove zombie Excalidraw elements (elements marked as deleted but left in the JSON)?
4. Is this safe to commit?

**Context:**
- File: $SVG_FILE
- Changes: Removed 191 lines of zombie JSON from Excalidraw source
- Expected: Visual output should be identical (zombie elements were already marked as deleted)

PROMPT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📎 Attach this file to your AI prompt:"
echo "  $TMP_DIR/diff.png"
echo ""
echo "💡 To open the diff image:"
echo "  open $TMP_DIR/diff.png"
echo ""
