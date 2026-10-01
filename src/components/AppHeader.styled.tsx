import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { pizzaIconBackground } from "../theme";

export const HeaderRoot = styled("header")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    alignItems: "flex-start",
    textAlign: "left",
  },
}));

export const TitleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const IconBadge = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: pizzaIconBackground,
  fontSize: 22,
  flexShrink: 0,
  [theme.breakpoints.up("sm")]: {
    width: 48,
    height: 48,
    fontSize: 26,
  },
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: 700,
  fontFamily: '"Georgia", "Times New Roman", serif',
  lineHeight: 1.15,
  [theme.breakpoints.up("sm")]: {
    fontSize: "2.5rem",
  },
}));

export const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.95rem",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.05rem",
  },
}));
