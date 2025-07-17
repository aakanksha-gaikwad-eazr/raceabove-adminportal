import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Apps from "@/icons/Apps";
import FormatBullets from "@/icons/FormatBullets";
import FlexBetween from "@/components/flexbox/FlexBetween";

export default function SearchArea({
  value,
  onChange,
  gridRoute,
  listRoute,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeColor = (path) =>
    pathname === path ? "primary.main" : "grey.400";

  return (
    <FlexBetween gap={1} my={3}
>
      {/* SEARCH FIELD */}
      <TextField
        onChange={onChange}
        value={value}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: "grey.500", mr: 1 }} />
          ),
        }}
        placeholder="Search..."
        sx={{width: "40%" }}
      />
{/* 
<Box flexShrink={0} className="actions">
        <IconButton onClick={() => navigate(listRoute)}>
          <FormatBullets sx={{
          color: activeColor(listRoute)
        }} />
        </IconButton>

        <IconButton onClick={() => navigate(gridRoute)}>
          <Apps sx={{
          color: activeColor(gridRoute)
        }} />
        </IconButton>
      </Box> */}
    </FlexBetween>
  );
}
