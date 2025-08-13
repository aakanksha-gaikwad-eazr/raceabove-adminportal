import { useEffect, useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import useTheme from "@mui/material/styles/useTheme";
import DeleteOutline from "@mui/icons-material/DeleteOutline"; // CUSTOM COMPONENTS

import Modal from "@/components/modal";
import AddContactForm from "./AddgearsForm";
import { TableMoreMenuItem } from "@/components/table";
import { H6, Paragraph } from "@/components/typography";
import FlexBetween from "@/components/flexbox/FlexBetween"; // CUSTOM ICON COMPONENTS

import Add from "@/icons/Add";
import Call from "@/icons/Call";
import City from "@/icons/City";
import Edit from "@/icons/Edit";
import Flag from "@/icons/Flag";
import User from "@/icons/User";
import Email from "@/icons/Email";
import Skype from "@/icons/social/Skype";
import ShareVs from "@/icons/ShareVs";
import Birthday from "@/icons/Birthday";
import Facebook from "@/icons/social/Facebook";
import Whatsapp from "@/icons/social/Whatsapp";
import Messenger from "@/icons/Messenger";
import MoreHorizontal from "@/icons/MoreHorizontal"; // CUSTOM UTILS METHOD

import { isDark } from "@/utils/constants"; // ==============================================================
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers } from "../../store/apps/user";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ==============================================================

export default function GearsDetails({ data }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("gear details received user:", data);
  }, [data]);

  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => setOpenModal(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleCloseMenu = () => setAnchorEl(null);

  // const handleDelete = (id)=> {
  //   console.log("delete click")

  //   dispatch(deleteUser(id))
  //   .then((resposne)=>{
  //     console.log("res delete user", resposne)
  //   })
  //   console.log("delete")
  // }

  const handleDelete = async (id) => {
    console.log("Delete clicked for user ID:", id);

    try {
      const response = await dispatch(deleteUser(id)).unwrap();
      console.log("res del", response);

      if (response?.status === 200) {
        dispatch(getUsers());
        setAnchorEl(null);
        toast.success("User deleted successfully!");
      }
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      toast.error(error.message || "Something went wrong while deleting!");

      // Check for 404 User Not Found
      if (error) {
        toast.error("User not found! It may have already been deleted.");
      } else {
        toast.error(error.message || "Something went wrong while deleting!");
      }
    }
  };

  const handleAddContact = () => {
    navigate("/add-user");
  };

  const handleEditModal = () => {
    setIsEdit(true);
    setOpenModal(true);
    localStorage.setItem("update", JSON.stringify({ updatekey: false }));
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
        onClick={() => handleAddContact()}
      >
        Add User
      </Button>

      <Modal open={openModal} handleClose={handleCloseModal}>
        <AddContactForm
          handleCancel={handleCloseModal}
          data={isEdit ? data : null}
        />
      </Modal>

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
              src={data?.profilePhoto}
              sx={{
                width: 120,
                height: 120,
                backgroundColor: "white",
              }}
            />
            <H6 fontSize={16} mt={2}>
              {data.name}
            </H6>
            <Paragraph color="text.secondary" mt={0.5}>
              {data.activitiesCount}
            </Paragraph>
          </Stack>

          <Box mt={4}>
            {/* <ListItem Icon={Birthday} title="June 3, 1996" /> */}
            <ListItem Icon={User} title={data?.gender} />
            <ListItem Icon={City} title={data.exerciseLevel} />
            <ListItem Icon={Email} title={data.email} />
            <ListItem Icon={Call} title={data.phoneNumber} />
            <ListItem Icon={ShareVs} title={data?.target} />
            <ListItem Icon={Flag} title={data?.height} />
          </Box>

          <Box mt={2}>
            <ListItem Icon={Messenger} title={data.reminder} />
            <ListItem Icon={Facebook} title={data.isActive} />
            <ListItem Icon={Skype} title={data.age} />
            <ListItem Icon={Whatsapp} title="+1 (345) 556-2248" />
          </Box>
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
