import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import navigate
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
import MoreVert from "@mui/icons-material/MoreVert";
import { StyledIconButton } from "./styles";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import useCoupons from "../../page-sections/coupons/useCoupons";
import DeleteEventModal from "@/components/delete-modal-event";
import { deleteCoupons, getCoupons } from "../../store/apps/coupons";

const optionList = ["Edit", "Delete"];

export default function MoreTicketTemplateButtontwo({
  ticketTemplateId,
  size = "large",
  Icon = MoreVert,
  options = optionList,
  renderOptions,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const { handleCloseModal } = useCoupons();
  const handleClose = () => setAnchorEl(null);

  const handleOtpions = (option, ticketTemplateId) => {
    if (option === "Edit") {
      navigate(`/edit-ticket-template/${ticketTemplateId}`);
      handleClose();
    } else if (option === "Delete") {
      setOpenDeleteModal(true);
      handleClose();
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteCoupons(ticketTemplateId))
      .then(async (response) => {
        if (response?.payload?.status === 200) {
          await dispatch(getCoupons());
          handleCloseModal();
          toast.success("Successfully deleted");
        } else {
          toast.error("Error while deleting");
        }
      })
      .catch((error) =>
        console.error("Error deleting coupon:", error)
      )
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
                onClick={() => handleOtpions(option, ticketTemplateId)}
              >
                {option}
              </MenuItem>
            ))}
      </Menu>

      <DeleteEventModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        title="Delete Confirmation"
        message="Are you sure you want to Delete?"
        actions={[
          {
            label: "Cancel",
            props: { onClick: handleClose, variant: "outlined" },
          },
          {
            label: "Delete",
            props: { onClick: handleDelete, color: "error" },
          },
        ]}
      />
    </div>
  );
}
