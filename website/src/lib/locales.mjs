/**
 * Shared i18n locale configuration.
 *
 * Single source of truth for locale definitions used by:
 *   - website/astro.config.mjs  (Starlight i18n)
 *   - tools/build-docs.mjs      (llms-full.txt locale exclusion)
 *   - website/src/pages/404.astro (client-side locale redirect)
 *
 * The root locale (English) uses Starlight's 'root' key convention
 * (no URL prefix). All other locales get a URL prefix matching their key.
 */

export const locales = {
  root: {
    label: 'English',
    lang: 'en',
  },
  'vi-vn': {
    label: 'Tiếng Việt',
    lang: 'vi-VN',
  },
  'zh-cn': {
    label: '简体中文',
    lang: 'zh-CN',
  },
  fr: {
    label: 'Français',
    lang: 'fr-FR',
  },
};

/**
 * Non-root locale keys (the URL prefixes for translated content).
 * @type {string[]}
 */
export const translatedLocales = Object.keys(locales).filter((k) => k !== 'root');
