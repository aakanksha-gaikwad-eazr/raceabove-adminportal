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
import useCoupons from "../../page-sections/coupons/useCoupons";
import DeleteEventModal from "@/components/delete-modal-event";
import { deleteAddOnsCategory, getAddOnsCategory } from "../../store/apps/addonscategory";
import { useNavigate } from "react-router-dom";
const optionList = ["Edit", "Delete"];

// ==============================================================
export default function MoreAddoncategoryButtontwo({
  addoncategoriesId,
  size = "large",
  Icon = MoreVert,
  options = optionList,
  renderOptions,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAddonCategoriesId, setSelectedAddonCategoriesId] = useState(null);

  const {
    filters,
    openModal,
    handleChangeFilter,
    handleCloseModal,
    handleOpenModal,
  } = useCoupons();

  const handleClose = () => setAnchorEl(null);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleOtpions = (option, addoncategoriesId) => {
    if (option === "Edit") {
      // console.log("edit", couponId);
      navigate('/edit-addoncategory')
      handleClose();
    } else if (option === "Delete") {
      setSelectedAddonCategoriesId(addoncategoriesId);
      setOpenDeleteModal(true);
      handleClose();
    }
  };

  const handleDelete = async () => {
    if (!selectedAddonCategoriesId) return;
    await dispatch(deleteAddOnsCategory(selectedAddonCategoriesId))
      .then(async (response) => {
        if (response?.payload?.status === 200) {
          await dispatch(getAddOnsCategory());
          handleCloseModal();
          toast.success("Successfully deleted");
        } else {
          toast.error("Error while deleting");
        }
      })
      .catch((error) => console.error("Error deleting challenge:", error))
      .finally(() => {
        setOpenDeleteModal(false);
        setSelectedAddonCategoriesId(null);
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
                onClick={() => handleOtpions(option, addoncategoriesId)}
              >
                {option}
              </MenuItem>
            ))}
      </Menu>
      {/* <CouponsFormEdit
        open={openModal}
        handleClose={handleCloseModal}
        addoncategoriesId={addoncategoriesId} 
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
