import { useState } from "react"; // MUI

import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
// MUI ICON COMPONENT
import MoreVert from "@mui/icons-material/MoreVert";
// STYLED COMPONENT
import { StyledIconButton } from "./styles";
import { useDispatch } from "react-redux";
import {
  deleteChallenges,
  getChallenges,
} from "../../store/apps/challenges";
import toast from "react-hot-toast";
import ProjectForm from "../../page-sections/challenge/project-form";
// import ProjectForm from 'page-sections/projects/project-form';
import useProjects from "../../page-sections/challenge/useChallenge";
import ProjectFormEdit from "../../page-sections/challenge/project-form-edit/ProjectFormEdit";
import DeleteModal from "@/components/delete-modal";
// import useProjects from 'page-sections/projects/useProjects';
const optionList = ["Edit", "Delete"];

// ==============================================================
export default function MoreButtontwo({
  projectId,
  size = "large",
  Icon = MoreVert,
  options = optionList,
  renderOptions,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openModal, setOpenModal] = useState(false); 



  const handleClose = () => setAnchorEl(null);
    const handleCloseModal = () => setOpenModal(false); 


  const dispatch = useDispatch();

  const handleOtpions = (option, projectId) => {
    if (option === "Edit") {
      console.log("edit", projectId);
      // handleOpenModal();
       setOpenModal(true); 
    } else if(option === "Delete"){
      console.log("delete");
      setOpenDeleteModal(true)
    }
  };

  const handleDelete = async() => {
    await dispatch(deleteChallenges(projectId))
      .then(async(response) => {
        if (response?.payload?.status === 200) {
          await dispatch(getChallenges());
          handleClose();
          toast.success("Successfully deleted");
        } else {
          toast.error("Error while deleting");
        }
      })
      .catch((error) => console.error("Error deleting challenge:", error))
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
                onClick={() => handleOtpions(option, projectId)}
              >
                {option}
              </MenuItem>
            ))}
      </Menu>

      <ProjectFormEdit open={openModal} handleClose={handleCloseModal} challengeId={projectId} />
      
      <DeleteModal open={openDeleteModal}   handleClose={() => setOpenDeleteModal(false)} title="Delete Confirmation" message="Are you sure you want to Delete ?"  actions={[
    { label: "Cancel", props: { onClick: handleClose, variant: "outlined" } },
    { label: "Delete", props: { onClick: handleDelete, color: "error" } },
  ]}>
        </DeleteModal>
    </div>
  );
}
