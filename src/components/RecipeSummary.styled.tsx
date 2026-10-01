import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const SummaryCard = styled("section")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  padding: theme.spacing(3),
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

export const SummaryMetric = styled(Box)(({ theme }) => ({
  flex: "1 1 120px",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  paddingRight: theme.spacing(2),
  borderRight: `1px solid ${theme.palette.divider}`,
  "&:last-of-type": {
    borderRight: "none",
    paddingRight: 0,
  },
}));

export const SummaryValue = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  gap: theme.spacing(0.5),
  fontSize: "1.5rem",
  fontWeight: 700,
  fontFamily: '"Georgia", "Times New Roman", serif',
  color: theme.palette.text.primary,
  "& .unit": {
    fontSize: "1rem",
    fontWeight: 400,
    color: theme.palette.text.secondary,
  },
}));

export const SummaryLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
}));
