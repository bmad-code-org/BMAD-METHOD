# Figma Plugin Setup Guide

Reference for setting up the html.to.design plugin and MCP server connection.

---

## 1. Plugin Installation

Install the html.to.design plugin in Figma:

1. Open Figma (desktop app or web: figma.com)
2. Click on your profile icon (top-right corner)
3. Select "Community" from the menu
4. In the search bar, type "html.to.design"
5. Click on the "html.to.design" plugin result
6. Click "Install" or "Try it out" button
7. Plugin is now installed

---

## 2. Activate Plugin

Activate the plugin in your Figma file:

1. Open any Figma file (or create a new one for testing)
2. Right-click anywhere on the canvas
3. Select "Plugins" > "html.to.design"
   OR use the menu: Plugins > html.to.design
4. The plugin panel should appear on the right side of your screen
5. Keep the plugin panel open during the export process

---

## 3. Verify MCP Configuration

Confirm that the html.to.design MCP server is configured in the IDE:

1. Open your IDE Settings/Preferences
2. Navigate to the MCP Servers section
3. Look for "html.to.design" in the server list

**If configured:** MCP server is ready. Run a test export to verify connection.

**If not configured:** The html.to.design MCP server needs to be added to your IDE configuration. Refer to your IDE's MCP server documentation for configuration steps. The server should connect to the html.to.design plugin running in Figma.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Plugin not found in Community | Search "html to design" (without dots) |
| Plugin panel doesn't appear | Try closing and reopening Figma |
| MCP server not connecting | Verify Figma plugin is running and panel is open |
| Test export fails | Check both plugin and MCP server are active |
