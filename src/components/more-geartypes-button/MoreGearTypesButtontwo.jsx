import { useState } from "react"; // MUI

import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
// MUI ICON COMPONENT
import MoreVert from "@mui/icons-material/MoreVert";
// STYLED COMPONENT
import { StyledIconButton } from "./styles";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import DeleteEventModal from "@/components/delete-modal-event";
import { deleteGearTypes, getGearTypes } from "../../store/apps/geartypes";
import EditGearTypesFormModal from "@/page-sections/geartypes/EditgeartypesFormModal";

const optionList = ["Edit", "Delete"];

// ==============================================================
export default function MoreGearTypesButton({
  gearTypesId,
  size = "large",
  Icon = MoreVert,
  options = optionList,
  renderOptions,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleClose = () => setAnchorEl(null);
  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleOpenEditModal = () => setOpenEditModal(true);

  const dispatch = useDispatch();

  const handleOtpions = (option, gearTypesId) => {
    if (option === "Edit") {
      handleOpenEditModal();
      handleClose();
    } else if (option === "Delete") {
      setOpenDeleteModal(true);
      handleClose();
    }
  };

  const handleDelete = () => {
    dispatch(deleteGearTypes(gearTypesId))
      .then((response) => {
        if (response?.payload?.status === 200) {
          dispatch(getGearTypes());
          handleClose();
          toast.success("Successfully deleted");
        } else {
          toast.error("Error while deleting");
        }
      })
      .catch((error) => console.error("Error deleting gear type:", error))
      .finally(() => setOpenDeleteModal(false));
  };

  return (
    <div>
      <StyledIconButton
        size={size}
        aria-label="more"
        aria-haspopup="true"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        {...props}
      >
        <Icon fontSize="small" />
      </StyledIconButton>

      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        TransitionComponent={Fade}
      >
        {renderOptions
          ? renderOptions(handleClose)
          : options.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleOtpions(option, gearTypesId)}
              >
                {option}
              </MenuItem>
            ))}
      </Menu>

      <EditGearTypesFormModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        data={{ id: gearTypesId }}
      />

      <DeleteEventModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        title="Delete Confirmation"
        message="Are you sure you want to Delete ?"
        actions={[
          {
            label: "Cancel",
            props: { onClick: handleClose, variant: "outlined" },
          },
          { label: "Delete", props: { onClick: handleDelete, color: "error" } },
        ]}
      ></DeleteEventModal>
    </div>
  );
}
