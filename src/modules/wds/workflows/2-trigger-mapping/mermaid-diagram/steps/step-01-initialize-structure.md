# Step 01: Initialize Diagram Structure

**Goal:** Set up the basic Mermaid diagram structure with configuration

---

## Instructions

### 1. Start with Mermaid Configuration

**Always begin with:**

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontFamily':'Inter, system-ui, sans-serif', 'fontSize':'14px'}}}%%
flowchart LR
```

**Rules:**
- Use `base` theme
- Set font to `Inter, system-ui, sans-serif`
- Set fontSize to `14px`
- Use `flowchart LR` (left-to-right direction)

---

### 2. Add Section Comments

**Structure the diagram with comments:**

```
    %% Business Goals (Left)
    
    %% Central Platform
    
    %% Target Groups (Right)
    
    %% Driving Forces (Far Right)
    
    %% Connections
    
    %% Styling
```

**Rules:**
- Use `%%` for comments
- Keep sections clearly labeled
- Maintain consistent spacing

---

### 3. Determine Node IDs

**Create node ID list based on data:**

- **Business Goals:** `BG0`, `BG1`, `BG2` (sequential)
- **Platform:** `PLATFORM` (always singular)
- **Target Groups:** `TG0`, `TG1`, `TG2` (sequential, matching persona count)
- **Driving Forces:** `DF0`, `DF1`, `DF2` (sequential, matching target groups)

**Example for 3 personas:**
```
BG0, BG1, BG2
PLATFORM
TG0, TG1, TG2
DF0, DF1, DF2
```

---

## Output

Store:
- `diagram_config`: The init configuration
- `node_ids`: List of all node IDs (BG*, PLATFORM, TG*, DF*)
- `diagram_structure`: Template with comments

---

## Next Step

→ **[Step 02: Format Business Goals](step-02-format-business-goals.md)**

Format the business goals nodes with proper padding and content.

