/**
 * Progressive Enhancement — Jus IA Start Kit
 * Everything works without this file (MPA form submissions).
 * This adds: copy-to-clipboard, chip visual feedback, smooth interactions.
 */

// Copy to clipboard
function setupCopyButtons() {
  document.querySelectorAll('[id^="copy-btn"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textarea = document.getElementById("prompt-text");
      const text = textarea
        ? textarea.value
        : btn.dataset.promptText || "";

      try {
        await navigator.clipboard.writeText(text);
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          Copiado!
        `;
        btn.classList.add("bg-[var(--color-success)]");
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove("bg-[var(--color-success)]");
        }, 2000);
      } catch {
        // Fallback: select text in textarea
        if (textarea) {
          textarea.select();
          textarea.setSelectionRange(0, textarea.value.length);
        }
      }
    });
  });
}

// Chip visual feedback (check icon on selection)
function setupChipFeedback() {
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((input) => {
    if (input.closest(".peer")) {
      input.addEventListener("change", () => {
        // For radio buttons, remove check from siblings
        if (input.type === "radio" && input.name) {
          document.querySelectorAll(`input[name="${input.name}"]`).forEach((sibling) => {
            const span = sibling.nextElementSibling;
            if (span) {
              span.querySelectorAll(".check-icon").forEach((icon) => icon.remove());
            }
          });
        }
      });
    }
  });
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  setupCopyButtons();
  setupChipFeedback();
});
