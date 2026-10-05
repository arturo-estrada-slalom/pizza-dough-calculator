import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export const LanguageSelect = styled(Select)(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  "& .MuiSelect-select": {
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
}));

export const LanguageMenuItem = styled(MenuItem)({
  fontSize: "0.85rem",
});
