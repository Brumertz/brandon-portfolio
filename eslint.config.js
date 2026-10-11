import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

/**
 * Flat config for ESLint 9. This file was missing, which left `npm run lint`
 * failing outright even though every plugin was already in devDependencies.
 *
 * Two flat-config gotchas are worked around deliberately:
 *   - ESLint 9.19 has no `extends` key inside a config object, so shared
 *     configs must be spread into the top-level array rather than nested;
 *   - `eslint-plugin-react-hooks@5.1` still ships `configs.recommended` in
 *     eslintrc format (`plugins` as an array of strings), which flat config
 *     rejects. The rules are therefore borrowed from each plugin's config and
 *     re-declared against a plugin object registered here, which also keeps
 *     the React rules scoped to `src/` instead of the Node scripts.
 */

const srcFiles = ["src/**/*.{js,jsx}"];
const allFiles = ["**/*.{js,jsx,mjs}"];

export default [
  {
    ignores: ["dist/**", "node_modules/**", "smoke-output/**", "lighthouse-output/**", "public/**"],
  },

  js.configs.recommended,
  {
    files: allFiles,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },

  {
    files: srcFiles,
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: { react: { version: "detect" } },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,
      // The codebase states prop types explicitly where it matters; the rule
      // duplicates what TypeScript would do and adds no signal here.
      "react/prop-types": "off",
      // react-three-fiber deliberately passes scene-graph props (`position`,
      // `intensity`, `args`, `castShadow`, `position-y`, …) that are not DOM
      // attributes, so this rule reports every legitimate r3f element.
      "react/no-unknown-property": "off",
      // Several modules export a component alongside the constants or context
      // helpers it uses; splitting them would add files without changing
      // behaviour. Worth a warning, not a build failure.
      "react-refresh/only-export-components": "warn",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
];
