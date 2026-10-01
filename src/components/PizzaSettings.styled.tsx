import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { textMediumEmphasis } from "../theme";

export const SettingsCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

export const SettingsTitle = styled(Typography)({
  fontFamily: '"Georgia", "Times New Roman", serif',
  fontWeight: 700,
  fontSize: "1.5rem",
});

export const Section = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

export const SectionLabel = styled(Typography)(({ theme }) => ({
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const DiameterHeader = styled(Box)({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 8,
});

export const DiameterValue = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  gap: theme.spacing(0.5),
  fontSize: "1.5rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  "& .unit": {
    fontSize: "1rem",
    fontWeight: 400,
    color: textMediumEmphasis,
  },
}));

export const DiameterSlider = styled(Slider)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export const DiameterRangeLabels = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(-1),
}));

export const ThicknessToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  width: "100%",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  "& .MuiToggleButtonGroup-grouped": {
    flex: 1,
    border: 0,
    borderRadius: 0,
    "&:not(:last-of-type)": {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  },
}));

export const ThicknessOption = styled(ToggleButton)(({ theme }) => ({
  textTransform: "uppercase",
  fontSize: "0.85rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: textMediumEmphasis,
  "&.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  "&.Mui-disabled": {
    color: theme.palette.text.secondary,
  },
}));

export const PizzaCountRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const PizzaCountButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  width: 40,
  height: 40,
  fontSize: "1.25rem",
  color: theme.palette.text.primary,
}));

export const PizzaCountValue = styled(Typography)(({ theme }) => ({
  minWidth: 32,
  textAlign: "center",
  fontWeight: 700,
  fontSize: "1.5rem",
  color: theme.palette.text.primary,
}));

export const PizzaCountUnit = styled(Typography)({
  color: textMediumEmphasis,
  fontSize: "0.95rem",
});
