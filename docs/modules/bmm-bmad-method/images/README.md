# Workflow Diagram Maintenance

## Regenerating SVG from Excalidraw

When you edit `workflow-method-greenfield.excalidraw`, regenerate the SVG:

1. Open <https://excalidraw.com/>
2. Load the `.excalidraw` file
3. Click menu (☰) → Export image → SVG
4. **Set "Scale" to 1x** (default is 2x)
5. Click "Export"
6. Save as `workflow-method-greenfield.svg`
7. **Validate the changes** (see below)
8. Commit both files together

**Important:**

- Always use **1x scale** to maintain consistent dimensions
- Automated export tools (`excalidraw-to-svg`) are broken - use manual export only

## Visual Validation

After regenerating the SVG, validate that it renders correctly:

```bash
./tools/validate-svg-changes.sh path/to/workflow-method-greenfield.svg
```

This script:

- Checks for required dependencies (Playwright, ImageMagick)
- Installs Playwright locally if needed (no package.json pollution)
- Renders old vs new SVG using browser-accurate rendering
- Compares pixel-by-pixel and generates a diff image
- Outputs a prompt for AI visual analysis (paste into Gemini/Claude)

**Threshold**: <0.01% difference is acceptable (anti-aliasing variations)
