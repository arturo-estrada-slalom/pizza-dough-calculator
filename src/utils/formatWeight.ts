// Presentation-only rounding for displayed gram weights. Domain calculations
// retain full precision (docs/PROJECT.md); this trims to 2 decimal places
// and drops insignificant trailing zeros (e.g. 42.30 -> "42.3").
export function formatWeight(grams: number): string {
    return String(Number(grams.toFixed(2)));
}
