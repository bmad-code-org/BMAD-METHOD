# Visual escalation and diagramming

The outcome is a visual that explains an idea, process, number, or comparison faster than prose, in the form `{workflow.visuals}` describes: by default a self-contained SVG or interactive HTML page, with a generated image when an image tool is available and the picture is of a thing rather than data. Mermaid or an editable `.excalidraw` scene is for when the creator wants a diagram that lives inside markdown or that they will edit by hand. A text-only box is the last resort.

## What you cannot infer

- Read `{record_folder}/canon.md` (palette, type, visual axioms) and `{record_folder}/audience.md` first. Work presented as the creator or their organization follows `{workflow.style}` and `{design_system}`; fiction and invented worlds take their own look.
- Sketch two or three genuinely different visual metaphors, one straight and the rest surprising, as quick thumbnails the creator can see, and let them pick or combine before you polish.
- Match the visual to the idea's shape:
  - **Number, price, date, or metric** -> hero stat or proportional bar or scale with a short label.
  - **Process or mechanism** -> staged directional diagram or state flow showing cause and effect.
  - **Trade-off, before/after, or matrix** -> split panel, ERRC grid, or compact comparison.
  - **Chronology or evolution** -> timeline or value-curve progression.
  - **Story beat or tension shift** -> annotated curve or illustrated beat strip.
- Keep one central focus per visual, high contrast, about 8 words per element, a proper `viewBox` on SVG, and no invented figures.
- Save the file beside the piece it serves, else under `{output_folder}/creative/`, and open or present it in the host's preview when there is one.

## Hand back

The file path and how to preview it, why the chosen metaphor beats prose, and any visual rules worth locking in `canon.md`.
