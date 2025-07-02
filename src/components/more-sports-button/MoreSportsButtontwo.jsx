import { useEffect, useState } from "react"; // MUI

import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
// MUI ICON COMPONENT
import MoreVert from "@mui/icons-material/MoreVert";
// STYLED COMPONENT
import { StyledIconButton } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import DeleteEventModal from "@/components/delete-modal-event";
import { deleteEvents, getEvents } from "../../store/apps/events";
import EventsFormEdit from "../../page-sections/events/events-form-edit";
import { deleteSports, getSports, getSportsById } from "../../store/apps/sports";
import AddSportsForm from "../../page-sections/sports/AddSportsForm";
import { Modal } from "@mui/material";
import useSports from "@/page-sections/sports/useSports";
import EditSportFormModal from "@/page-sections/sports/EditSportFormModal";
const optionList = ["Edit", "Delete"];

// ==============================================================
export default function MoreSportsButton({
  sportsId,
  size = "large",
  Icon = MoreVert,
  options = optionList,
  renderOptions,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);


  const {
    filters,
    openModal,
    handleChangeFilter,
    handleCloseModal,
    handleOpenModal,
  } = useSports();

  const handleClose = () => setAnchorEl(null);

  const dispatch = useDispatch();

  const {sports} = useSelector(state=>state.sports)
  const {singleSports} = useSelector(state=>state.sports)

  useEffect(()=>{
    dispatch(getSportsById(sportsId))
  },[sportsId])

 

  const handleOtpions = (option, sportsId) => {
    if (option === "Edit") {
      // console.log("edit", sportsId);
      handleOpenModal();
      handleClose();
    } else if (option === "Delete") {
      // console.log("delete");
      setOpenDeleteModal(true);
      handleClose();
    }
  };

  const handleDelete = () => {
    dispatch(deleteSports(sportsId))
      .then((response) => {
        if (response?.payload?.status === 200) {
          dispatch(getSports());
          toast.success("Successfully deleted");
        } else {
          toast.error("Error while deleting");
        }
      })
      .catch((error) => console.error("Error deleting sports:", error))
      .finally(() => {
        setOpenDeleteModal(false);
        handleClose();
      });
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
                onClick={() => handleOtpions(option, sportsId)}
              >
                {option}
              </MenuItem>
            ))}
      </Menu>

      <EditSportFormModal
        open={openModal}
        handleClose={handleCloseModal}
        sportsId={sportsId}
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
