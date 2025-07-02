import { useCallback, useState } from "react"; // MUI

import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
// MUI ICON COMPONENT
import MoreVert from "@mui/icons-material/MoreVert";
// STYLED COMPONENT
import { StyledIconButton } from "./styles";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import useEvents from "../../page-sections/events/useEvents";
import DeleteEventModal from "@/components/delete-modal-event";
import { deleteEvents, getEvents, getEventsById } from "../../store/apps/events";
import EventsFormEdit from "../../page-sections/events/events-form-edit";
import { useNavigate } from "react-router-dom";
const optionList = ["Edit", "Delete"];

// ==============================================================
export default function MoreEventButtontwo({
  eventsId,
  size = "large",
  Icon = MoreVert,
  options = optionList,
  renderOptions,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [update,setUpdate] = useState(false)

  const handleClose = () => setAnchorEl(null);

  const dispatch = useDispatch();
  const naviagte = useNavigate()


  const handleOtpions = (option, eventsId) => {
    
    if (option === "Edit") {
      console.log("edit", eventsId);
       localStorage.setItem("editEventId", eventsId);
      naviagte("/events/edit-event")

    } else if (option === "Delete") {
      console.log("delete");
      setOpenDeleteModal(true);
      handleClose();
    }
  }

  const handleDelete = () => {
    
    dispatch(deleteEvents(eventsId))
      .then((response) => {
        if (response?.payload?.status === 200) {
          dispatch(getEvents());
          toast.success("Successfully deleted");
        } else {
          toast.error("Error while deleting");
        }
      })
      .catch((error) => console.error("Error deleting event:", error))
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
                onClick={() => handleOtpions(option, eventsId)}
              >
                {option}
              </MenuItem>
            ))}
      </Menu>

      {/* <EventsFormEdit
        open={openModal}
        handleClose={handleCloseModal}
        eventsId={eventsId}
      /> */}

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
