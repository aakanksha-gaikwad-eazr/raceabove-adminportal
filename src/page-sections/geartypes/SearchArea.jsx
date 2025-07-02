import { useLocation, useNavigate } from "react-router-dom"; // MUI

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import Search from "@mui/icons-material/Search"; // CUSTOM COMPONENTS
import FlexBetween from "@/components/flexbox/FlexBetween"; // CUSTOM ICON COMPONENTS
import { useState } from "react";
import CreateGearTypesFormModal from "./CreateGearTypesFormModal";
import Add from "@/icons/Add";
import { Button } from "@mui/material";

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
            maxWidth: "100%",
            width: "100%",
          }}
        />

        {/* NAVIGATION BUTTONS */}
        <Box flexShrink={0} className="actions">
        
          {/* <Button
            type="submit"
            variant="contained"
            startIcon={<Add />}
            onClick={handleModalOpen}
          >
            Create Gear Types
          </Button> */}
   
        </Box>
      </FlexBetween>
      <CreateGearTypesFormModal
        open={modalOpen}
        handleClose={handleModalClose}
      />
    </>
  );
}
