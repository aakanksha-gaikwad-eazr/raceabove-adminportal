import { useEffect, useState } from "react"; // MUI

import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import styled from "@mui/material/styles/styled"; // CUSTOM COMPONENTS

import Link from "@/components/link/Link";
import { H6 } from "@/components/typography";
import IconWrapper from "@/components/icon-wrapper";
import ProductCard from "@/components/product-cards/product-card-1";
import { FlexBetween, FlexBox, FlexRowAlign } from "@/components/flexbox";
import SearchArea from "@/page-sections/targets/SearchArea"; // CUSTOM ICON COMPONENTS

import Add from "@/icons/Add";
import TargetIcon from "@/icons/Target"; // CUSTOM DUMMY DATA

// import { PRODUCTS } from '@/__fakeData__/products'; // STYLED COMPONENT
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTarget,
  editTarget,
  getTargetById,
  getTargets,
} from "../../../store/apps/target";
import ProjectForm from "@/page-sections/challenge/project-form";
import TargetForm from "./target-form";
import TargetEditForm from "./targetEditForm";
import TargetDeleteForm from "./deleteTargetForm";
import DeleteModal from "@/components/delete-modal";
import toast from "react-hot-toast";

const HeadingWrapper = styled(FlexBetween)(({ theme }) => ({
  gap: 8,
  flexWrap: "wrap",
  [theme.breakpoints.down(453)]: {
    "& .MuiButton-root": {
      order: 2,
    },
    "& .MuiTabs-root": {
      order: 3,
      width: "100%",
      "& .MuiTabs-flexContainer": {
        justifyContent: "space-between",
      },
    },
  },
}));

export default function TargetsGridPageView() {
  const [pageSize] = useState(8);
  const [pageIndex, setPageIndex] = useState(1);
  const [selectTab, setSelectTab] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);

  const [open, setOpen] = useState(false);
  const [openEditTargetForm, setOpenEditTargetForm] = useState(false);
  const [openDeleteTargetForm, setOpenDeleteTargetForm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [editTargetId, setEditTargetId] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditTargetOpen = () => setOpenEditTargetForm(true);
  const handleEditTargetClose = () => setOpenEditTargetForm(false);

  const handleDeleteTargetOpen = () => setOpenDeleteTargetForm(true);
  const handleDeleteTargetClose = () => setOpenDeleteTargetForm(false);

  const dispatch = useDispatch();

  const { targets } = useSelector((state) => state.target);
  const { singleTargets } = useSelector((state) => state.target);

  useEffect(() => {
    dispatch(getTargets());
  }, [dispatch]);

  useEffect(() => {
    setProducts(targets);
  }, [targets]);

  const filteredProducts = products.filter((item) => {
    if (searchValue) {
      return item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
             item.description?.toLowerCase().includes(searchValue.toLowerCase());
    }
    return true;
  });

  const handleChangeTab = (_, newTab) => setSelectTab(newTab);

  const handleDeleteProduct = (id) => {
    dispatch(getTargetById(id));
    setOpenDeleteTargetForm(true);
    setDeleteTargetId(id);
  };

  const handleDeleteTarget = () => {
    dispatch(deleteTarget(deleteTargetId)).then((response) => {
      if (response.payload?.status === 200) {
        setOpenDeleteTargetForm(false);
        toast.success("succesfully deleted");
        dispatch(getTargets());
      } else {
        console.log("error::",)
        toast.error("error in deleting target");
      }
    });
  };

  const handleEditProduct = (id) => {
    setOpenEditTargetForm(true);
    setEditTargetId(id);
  };

  return (
    <div className="pt-2 pb-4">
      <TabContext value={selectTab}>
        <HeadingWrapper>
          <FlexBox gap={0.5} alignItems="center">
            <IconWrapper>
              <TargetIcon color="primary" />
            </IconWrapper>
            <H6 fontSize={16}>Targets</H6>
          </FlexBox>
          {/* <Button
            variant="contained"
            startIcon={<Add />}
            LinkComponent={Link}
            onClick={handleOpen}
          >
            Add Target
          </Button> */}
        </HeadingWrapper>

        <SearchArea
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onAddTarget={handleOpen}
        />

        <Grid container spacing={3}>
          {filteredProducts.map((item) => (
            <Grid
              size={{
                md: 4,
                sm: 6,
                xs: 12,
              }}
              key={item.id}
            >
              <ProductCard
                product={item}
                handleDelete={handleDeleteProduct}
                handleEdit={handleEditProduct}
              />
            </Grid>
          ))}
        </Grid>
      </TabContext>

      {/* edit Target modal */}
      <TargetEditForm
        open={openEditTargetForm}
        handleClose={handleEditTargetClose}
        editTargetId={editTargetId}
        setEditTargetId={setEditTargetId}
        singleTargets={singleTargets}
      />

      <DeleteModal
        open={openDeleteTargetForm}
        handleClose={handleDeleteTargetClose}
        title="Delete Confirmation"
        message="Are you sure you want to Delete Target?"
        actions={[
          {
            label: "Cancel",
            props: { onClick: handleDeleteTargetClose, variant: "outlined" },
          },
          {
            label: "Delete",
            props: { onClick: handleDeleteTarget, color: "error" },
          },
        ]}
      />
      <TargetForm open={open} handleClose={handleClose} />
    </div>
  );
}
