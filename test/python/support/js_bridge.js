'use strict';

/**
 * Generic Node runner used by test/python/support/js_bridge.py to black-box
 * call real JS production exports from pytest, without per-export glue code.
 *
 * Usage: node js_bridge.js <modulePath> <exportName> [jsonArgs] [mode]
 *
 *   - modulePath: path to the JS module to require, resolved against the
 *     current working directory (the repo root, when invoked via
 *     `npm run test:python` or `pytest` from the repo root).
 *   - exportName: interpretation depends on mode.
 *   - jsonArgs: a JSON-encoded array of arguments to pass to the call. When
 *     omitted, the call is made with no arguments.
 *   - mode: "call" (default) or "transform".
 *
 * mode "call" (default): exportName is either a bare export name (e.g.
 * "extractCsvRefs"), which calls `require(modulePath)[exportName](...args)`;
 * or a dotted "Class.method" name (e.g. "CustomModuleManager.parseSource"),
 * which calls `new require(modulePath)[Class]()[method](...args)`.
 *
 * mode "transform": exportName is a bare export name of a factory function
 * (e.g. "default") matching the rehype/unified plugin convention. jsonArgs
 * must decode to `[options, tree, file]` (file may be omitted/null).
 * `require(modulePath)[exportName](options)` produces a `(tree, file) =>
 * void` transformer; the transformer is called as `transformer(tree, file)`
 * and the (possibly mutated) `tree` argument is returned/printed — not the
 * transformer's own (conventionally undefined) return value.
 *
 * On success, prints `JSON.stringify(result)` to stdout. On error, writes
 * the error message to stderr and exits with a non-zero status.
 */

const path = require('node:path');

async function main() {
  const [modulePath, exportName, jsonArgs, mode = 'call'] = process.argv.slice(2);

  if (!modulePath || !exportName) {
    throw new Error('Usage: js_bridge.js <modulePath> <exportName> [jsonArgs] [mode]');
  }
  if (mode !== 'call' && mode !== 'transform') {
    throw new Error(`mode must be "call" or "transform", got "${mode}"`);
  }

  const args = jsonArgs ? JSON.parse(jsonArgs) : [];
  if (!Array.isArray(args)) {
    throw new TypeError('jsonArgs must decode to a JSON array');
  }
  const resolvedModulePath = path.resolve(process.cwd(), modulePath);
  const mod = require(resolvedModulePath);

  let result;
  if (mode === 'transform') {
    const factory = mod[exportName];
    if (typeof factory !== 'function') {
      throw new TypeError(`Export "${exportName}" not found in ${modulePath}`);
    }
    if (args.length < 2) {
      throw new TypeError('transform mode requires jsonArgs to decode to [options, tree, file?]');
    }
    const [options, tree, file] = args;
    const transformer = factory(options);
    if (typeof transformer !== 'function') {
      throw new TypeError(`Export "${exportName}" in ${modulePath} did not return a function`);
    }
    let transformerResult = transformer(tree, file);
    if (transformerResult && typeof transformerResult.then === 'function') {
      transformerResult = await transformerResult;
    }
    result = tree;
  } else {
    const nameParts = exportName.split('.');
    if (nameParts.length > 2) {
      throw new Error(`exportName must be a bare name or "Class.method", got "${exportName}"`);
    }

    if (nameParts.length === 2) {
      const [className, methodName] = nameParts;
      const Ctor = mod[className];
      if (typeof Ctor !== 'function') {
        throw new TypeError(`Export "${className}" not found in ${modulePath}`);
      }
      const instance = new Ctor();
      const method = instance[methodName];
      if (typeof method !== 'function') {
        throw new TypeError(`Method "${methodName}" not found on "${className}" in ${modulePath}`);
      }
      result = method.apply(instance, args);
    } else {
      const fn = mod[exportName];
      if (typeof fn !== 'function') {
        throw new TypeError(`Export "${exportName}" not found in ${modulePath}`);
      }
      result = fn(...args);
    }

    if (result && typeof result.then === 'function') {
      result = await result;
    }
  }

  process.stdout.write(result === undefined ? 'null' : JSON.stringify(result));
}

main().catch((error) => {
  process.stderr.write(error && error.message ? error.message : String(error));
  process.exit(1);
});
