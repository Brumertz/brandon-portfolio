// True on touch-only devices (no hover capability). Evaluated once at module
// load; the `typeof window` guard keeps it safe wherever the module is first
// imported. Shared by About, Tech and Works, which previously each re-declared it.
export const IS_TOUCH =
  typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
