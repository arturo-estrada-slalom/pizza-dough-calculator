import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { primaryTint, strongDivider } from "../theme";

export const IngredientsCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const IngredientsTitle = styled(Typography)({
  fontFamily: '"Georgia", "Times New Roman", serif',
  fontWeight: 700,
  fontSize: "1.5rem",
});

export const IngredientsSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.9rem",
  marginTop: theme.spacing(-1),
}));

export const IngredientsTableContainer = styled(Box)({
  overflowX: "auto",
});

// Headers are allowed to wrap below `sm` (e.g. "Baker's %" onto two lines)
// so a single long header word doesn't force the column wider than its
// data needs; nowrap is restored at `sm` and above to match the original
// desktop presentation.
export const HeaderCell = styled(TableCell)(({ theme }) => ({
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontSize: "0.7rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${strongDivider}`,
  padding: theme.spacing(1, 1),
  [theme.breakpoints.up("sm")]: {
    whiteSpace: "nowrap",
    padding: theme.spacing(1, 2),
  },
}));

// Narrows cell padding below the `sm` breakpoint so the Weight column has
// room for longer calculated values without wrapping the number and its
// unit onto separate lines.
export const DataCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1, 1),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(1, 2),
  },
}));

// Keeps a weight value and its "g" unit visually atomic on one line,
// regardless of how narrow the Weight column becomes.
export const WeightValue = styled("span")({
  whiteSpace: "nowrap",
});

export const IngredientRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "isBase",
})<{ isBase?: boolean }>(({ isBase }) => ({
  backgroundColor: isBase ? primaryTint : "transparent",
}));

// Stacks the ingredient name above the BASE chip below `sm` so the chip's
// width doesn't add to the name's wrapped-line width when computing the
// column's minimum content width; restores the original side-by-side row
// layout at `sm` and above.
export const IngredientNameCell = styled(TableCell)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(0.5),
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: theme.spacing(1, 1),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
  },
}));

export const BaseChip = styled(Chip)(({ theme }) => ({
  backgroundColor: primaryTint,
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: "0.65rem",
  height: 20,
}));

export const TotalRow = styled(TableRow)(({ theme }) => ({
  "& .MuiTableCell-root": {
    borderTop: `1px solid ${strongDivider}`,
    borderBottom: "none",
    fontWeight: 700,
    color: theme.palette.text.primary,
    padding: theme.spacing(1, 1),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(1, 2),
    },
  },
}));
