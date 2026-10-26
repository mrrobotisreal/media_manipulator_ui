/**
 * Licence guard for Motion (design §4, ADR-0012, ticket MM45 decision 12):
 * GSAP and every GSAP plugin (Standard No-Charge licence excludes no-code
 * animation builders) and `@theatre/studio` (AGPL-3.0) must never be a
 * dependency. `licenseGuard.test.ts` runs `forbiddenDependencies` over the
 * real `package.json`, CI-style.
 */

/** Forbidden dependency names: `gsap`, any `gsap-*` / `*gsap*` package, `@gsap/*`, `@theatre/studio`. */
export const FORBIDDEN_DEPENDENCY_PATTERNS: readonly RegExp[] = [/gsap/i, /^@theatre\/studio$/i];

export interface PackageJsonLike {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/** Every forbidden dependency name in a package.json (all dependency sections), sorted. */
export function forbiddenDependencies(pkg: PackageJsonLike): string[] {
  const names = new Set<string>();
  for (const section of [pkg.dependencies, pkg.devDependencies, pkg.optionalDependencies, pkg.peerDependencies]) {
    for (const name of Object.keys(section ?? {})) if (FORBIDDEN_DEPENDENCY_PATTERNS.some((re) => re.test(name))) names.add(name);
  }
  return [...names].sort();
}
