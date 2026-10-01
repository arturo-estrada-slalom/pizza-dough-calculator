import { createTheme } from "@mui/material/styles";

// Single source of truth for application colors — see docs/COLOR_PALETTE.md.
export const theme = createTheme({
    palette: {
        background: {
            default: "#F5F0E8", // Page background
            paper: "#FFFCF5", // Card / Paper
        },
        primary: {
            main: "#B85C2A", // Primary (terracotta)
            dark: "#9E4D22", // Primary dark (hover state)
        },
        text: {
            primary: "#2C1F14", // High emphasis
            secondary: "#7A6455", // Low emphasis
        },
        divider: "rgba(74,55,40,0.10)", // Divider
    },
});

// Primary tint overlay (docs/COLOR_PALETTE.md "Primary tint"), used for the
// pizza icon/branding treatment behind the emoji.
export const pizzaIconBackground = "rgba(184, 92, 42, 0.12)";

// Medium emphasis text (docs/COLOR_PALETTE.md "Medium emphasis"), used for
// body text such as unit labels (e.g. "inches", "pizzas").
export const textMediumEmphasis = "#4A3728";

// Dark surface (docs/COLOR_PALETTE.md "Dark surface"), used for the Dough
// Ball hero card background.
export const doughBallCardBackground = "#2C1F14";

// Warm gold (docs/COLOR_PALETTE.md "Warm gold"), used for the dough-ball
// weight number on the Dough Ball card's dark surface.
export const doughBallWeightColor = "#F5C896";

// Inverted text (docs/COLOR_PALETTE.md "Inverted"), used for text on the
// Dough Ball card's dark surface.
export const textInverted = "#FFFCF5";

// Primary tint overlay (docs/COLOR_PALETTE.md "Primary tint"), used for chip
// fills (the Dough Ball pizza-count chip, the Ingredients "BASE" chip) and
// row highlights (the Bread Flour base-ingredient row).
export const primaryTint = "rgba(184, 92, 42, 0.12)";

// Strong divider (docs/COLOR_PALETTE.md "Strong divider"), used for the
// Ingredients table header border and total-dough row border.
export const strongDivider = "rgba(74,55,40,0.20)";
