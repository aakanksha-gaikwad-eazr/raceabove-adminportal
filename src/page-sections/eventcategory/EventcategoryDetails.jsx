import { useEffect, useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import useTheme from "@mui/material/styles/useTheme";
import DeleteOutline from "@mui/icons-material/DeleteOutline"; // CUSTOM COMPONENTS

import EditEventcategoryFormModal from "./page-view/EditeventcategoryFormModal";
import { TableMoreMenuItem } from "@/components/table";
import { H6, Paragraph } from "@/components/typography";
import FlexBetween from "@/components/flexbox/FlexBetween"; // CUSTOM ICON COMPONENTS

import Add from "@/icons/Add";
import Edit from "@/icons/Edit";
import MoreHorizontal from "@/icons/MoreHorizontal"; // CUSTOM UTILS METHOD

import { isDark } from "@/utils/constants"; // ==============================================================
import { useDispatch } from "react-redux";
import { deleteGearTypes, getGearTypes } from "../../store/apps/geartypes";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ==============================================================

export default function EventCategoryDetails({ data }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("geatypesDetails received user:", data);
  }, [data]);

  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCloseModal = () => setOpenModal(false);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteGearTypes(id));
      
      if (response?.payload?.status === 200) {
        dispatch(getGearTypes());
        setAnchorEl(null);
        toast.success("Gear type deleted successfully!");
      } else {
        toast.error("Failed to delete gear type.");
      }
    } catch (error) {
      console.error("❌ Error deleting gear type:", error);
      toast.error(error.message || "Something went wrong while deleting!");
    }
  };

  const handleAddGearType = () => {
    navigate("/add-gear-type");
  };

  const handleEditModal = () => {
    setOpenModal(true);
  };

  return (
    <Box
      sx={{
        padding: 3,
        height: "100%",
        borderTopRightRadius: "1rem",
        borderBottomRightRadius: "1rem",
        backgroundColor: isDark(theme) ? "grey.800" : "grey.100",
      }}
    >
      <Button
        fullWidth
        variant="contained"
        startIcon={<Add />}
        onClick={handleAddGearType}
      >
        Add Gear Type
      </Button>

      <EditEventCategoryFormModal 
        open={openModal} 
        handleClose={handleCloseModal}
        data={data}
      />

      {data ? (
        <>
          <FlexBetween mt={4}>
            <IconButton onClick={handleEditModal}>
              <Edit
                fontSize="small"
                sx={{
                  color: "text.secondary",
                }}
              />
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: isDark(theme) ? "grey.700" : "white",
              }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreHorizontal
                fontSize="small"
                sx={{
                  color: "text.secondary",
                }}
              />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              onClick={() => handleDelete(data?.id)}
              transformOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
            >
              <TableMoreMenuItem Icon={DeleteOutline} title="Delete" />
            </Menu>
          </FlexBetween>

          <Stack alignItems="center">
            <Avatar
              src={data?.icon}
              sx={{
                width: 120,
                height: 120,
                backgroundColor: "white",
              }}
            />
            <H6 fontSize={16} mt={2}>
              {data.name}
            </H6>
          </Stack>
        </>
      ) : (
        <Box
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="text.secondary"
        >
          No Data
        </Box>
      )}
    </Box>
  );
} // ===================================================================

// ==================================================================
function ListItem({ Icon, title }) {
  return (
    <Stack direction="row" spacing={1.5} pb={2} alignItems="center">
      <Icon
        sx={{
          color: "text.secondary",
          fontSize: 20,
        }}
      />
      <Paragraph color="grey.500">{title}</Paragraph>
    </Stack>
  );
}
