/**
 * Canonical schema for per-module `module-help.csv` files.
 *
 * Both the merger (`Installer.mergeModuleHelpCatalogs`) and the synthesizer
 * (`PluginResolver._buildSynthesizedHelpCsv`) emit this exact header. The
 * merger compares each per-module file's header against this string and
 * warns on drift, so any rename here must be matched in external module
 * authors' CSVs (or accepted as a positional fall-through with a warning).
 */
const MODULE_HELP_CSV_HEADER =
  'module,skill,display-name,menu-code,description,action,args,phase,preceded-by,followed-by,required,output-location,outputs';

module.exports = { MODULE_HELP_CSV_HEADER };
