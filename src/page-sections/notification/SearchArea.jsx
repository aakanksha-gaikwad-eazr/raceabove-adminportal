import { useLocation, useNavigate } from "react-router-dom"; // MUI

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import Search from "@mui/icons-material/Search"; // CUSTOM COMPONENTS
import FlexBetween from "@/components/flexbox/FlexBetween"; // CUSTOM ICON COMPONENTS

import { Button } from "@mui/material";
import CreateSportFormModal from "./CreateSportFormModal";
import { useState } from "react";
import Add from "@/icons/Add";

// ==========================================================================================
export default function SearchArea(props) {
  const { value = "", onChange } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const activeColor = (path) =>
    pathname === path ? "primary.main" : "grey.400";

  return (
    <>
      <FlexBetween gap={1} my={3}>
        {/* SEARCH BOX */}

        <TextField
          value={value}
          onChange={onChange}
          placeholder="Search..."
          slotProps={{
            input: {
              startAdornment: <Search />,
            },
          }}
          sx={{
            maxWidth: 400,
            width: "100%",
          }}
        />

        {/* NAVIGATION BUTTONS */}
        <Box flexShrink={0} className="actions">
          {/* <IconButton onClick={() => navigate(listRoute)}>
          <FormatBullets sx={{
          color: activeColor(listRoute)
        }} />
        </IconButton>  */}
          {/* <Button
            type="submit"
            variant="contained"
            startIcon={<Add />}
            onClick={handleModalOpen}
          >
            Create Sports
          </Button> */}
          {/* 
        <IconButton onClick={() => navigate(gridRoute)}>
          <Apps sx={{
          color: activeColor(gridRoute)
        }} />
        </IconButton> */}
        </Box>
      </FlexBetween>
      <CreateSportFormModal
        open={modalOpen}
        handleClose={handleModalClose}
      />
    </>
  );
}
