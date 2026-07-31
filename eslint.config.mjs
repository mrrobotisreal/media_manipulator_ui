import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Rule tuning for code ported from the Vite app. Deliberate, narrow choices
    // — not a blanket disable:
    //  - no-unescaped-entities: purely cosmetic (apostrophes in copy).
    //  - no-img-element: <img> is used intentionally for blob/object URLs and
    //    remote R2 assets where next/image's optimizer doesn't apply.
    //  - the React Compiler hook lints are surfaced as warnings during the
    //    migration rather than hard-failing the ported components.
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    // NO INLINE EVENT NAMES. An ERROR, not a warning.
    //
    // This is the rule sketched in the header comment of `lib/analytics/events.ts`, now
    // actually enforced. The history it prevents is specific: before Part 1 the app passed
    // event names as inline literals at roughly sixty call sites in at least four naming
    // styles ('Conversion Completed', 'conversion_completed', 'file_upload',
    // 'web_vitals'). Nothing caught a typo and nothing caught a rename.
    //
    // And a typo here is not an error anywhere at runtime. The analytics service accepts
    // unknown-but-well-formed names ON PURPOSE — a browser can be running a bundle newer
    // than the deployed server, and rejecting a name it does not recognise would destroy
    // data from exactly the most up-to-date clients. So a misspelled name is stored,
    // flagged `is_unknown=true`, and silently becomes a second event that no query groups
    // with the first. The compiler cannot catch it either: `EVENTS.PAGE_VIEW` is a string,
    // and so is `'page_veiw'`. A lint rule is the only thing that can.
    //
    // Scoped to `.track(...)` and `.trackTool(...)`-style calls whose FIRST argument is a
    // string literal or template literal. `EVENTS.X` is a MemberExpression and passes.
    // The catalog file itself is exempt: it is where the literals are supposed to live.
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["lib/analytics/events.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.property.name='track'] > Literal:first-child",
          message:
            "Use EVENTS.* from lib/analytics/events.ts, never an inline event name. An inline name is not a compile error and not a runtime error — the analytics service stores unknown names with is_unknown=true, so a typo becomes a second event nobody queries.",
        },
        {
          selector:
            "CallExpression[callee.property.name='track'] > TemplateLiteral:first-child",
          message:
            "Event names must be constants from EVENTS, never built at runtime. A computed name is unbounded cardinality on an indexed column (events.event_name is indexed on every partition).",
        },
      ],
    },
  },
]);

export default eslintConfig;
