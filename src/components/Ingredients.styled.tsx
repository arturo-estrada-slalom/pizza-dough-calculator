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

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontSize: "0.7rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${strongDivider}`,
  whiteSpace: "nowrap",
}));

export const IngredientRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "isBase",
})<{ isBase?: boolean }>(({ isBase }) => ({
  backgroundColor: isBase ? primaryTint : "transparent",
}));

export const IngredientNameCell = styled(TableCell)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontWeight: 600,
  color: theme.palette.text.primary,
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
  },
}));
