import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  doughBallCardBackground,
  doughBallWeightColor,
  textInverted,
  primaryTint,
} from "../theme";

export const DoughBallCard = styled("section")(({ theme }) => ({
  backgroundColor: doughBallCardBackground,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

export const DoughBallHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
});

export const DoughBallLabel = styled(Typography)({
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: textInverted,
});

export const PizzaCountChip = styled(Box)(({ theme }) => ({
  backgroundColor: primaryTint,
  color: textInverted,
  borderRadius: 999,
  padding: theme.spacing(0.5, 1.5),
  fontSize: "0.85rem",
  fontWeight: 600,
  flexShrink: 0,
}));

export const DoughBallWeightRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  gap: theme.spacing(0.75),
  fontFamily: '"Georgia", "Times New Roman", serif',
  fontWeight: 700,
  "& .unit": {
    fontSize: "1.25rem",
    fontWeight: 400,
    color: textInverted,
  },
}));

export const DoughBallWeightNumber = styled("span")({
  fontSize: "3.5rem",
  color: doughBallWeightColor,
});

export const DoughBallContext = styled(Typography)({
  color: textInverted,
  fontSize: "0.95rem",
});
