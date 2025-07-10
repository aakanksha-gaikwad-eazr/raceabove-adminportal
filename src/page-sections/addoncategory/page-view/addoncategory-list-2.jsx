import { useEffect, useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import styled from "@mui/material/styles/styled"; // CUSTOM COMPONENTS

import { H6 } from "@/components/typography";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table"; // CUSTOM PAGE SECTION COMPONENTS

import SearchArea from "../SearchArea";
import UserDetails from "../UserDetails"; // CUSTOM DEFINED HOOK

import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM UTILS METHOD

import { isDark } from "@/utils/constants"; // CUSTOM DUMMY DATA

import { USER_LIST } from "@/__fakeData__/users"; // STYLED COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../../store/apps/user";
// import SearchFilter from "page-sections/challenge/SearchFilter";
import SearchFilter from "../../challenge/SearchFilter";
// import SearchFilter from "page-sections/challenge/SearchFilter";
import StatusFilter from "../../challenge/StatusFilter";
import { getAddOnsCategory } from "@/store/apps/addonscategory";
import HeadingAreaCoupon from "../HeadingArea";
import { Button, Chip, Switch } from "@mui/material";
import DeleteIcon from "@/icons/Delete";
import EditIcon from "@/icons/Edit";
import DeleteModal from "@/components/delete-modal/DeleteModal";
import { deleteAddOnsCategory } from "@/store/apps/addonscategory";
import toast from "react-hot-toast";
import { updateAddOnsCategory } from "@/store/apps/addonscategory";
import { useNavigate } from "react-router-dom";

const HeadTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 600,
  paddingBlock: 14,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  borderBottom: `1px solid ${theme.palette.grey[isDark(theme) ? 700 : 100]}`,
  "&:first-of-type": {
    paddingLeft: 24,
  },
  "&:last-of-type": {
    paddingRight: 24,
  },
}));
const BodyTableCell = styled(HeadTableCell)({
  fontSize: 12,
  fontWeight: 400,
  backgroundColor: "transparent",
});
const BodyTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  cursor: "pointer",
  ...(active && {
    backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  }),
}));
const headCells = [
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "Description",
  },

  {
    id: "updatedBy",
    numeric: true,
    disablePadding: false,
    label: "Updated By",
  },
    {
    id: "approvalStatus",
    numeric: true,
    disablePadding: false,
    label: "Approval Status",
  },
    {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
  
];

export default function Addoncategory2PageView() {
  // const [users] = useState([...USER_LIST]);
  const [searchFilter, setSearchFilter] = useState("");

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    handleChangePage,
    handleRequestSort,
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: "name",
    defaultRowsPerPage: 10,
  });

  const dispatch = useDispatch();

  const { addOnsCategory } = useSelector((state) => state.addonscategory);
  console.log("addOnsCategory", addOnsCategory);
  const [addoncategories, setAddoncategories] = useState([]);
  const [selectedAddonCategory, setSelectedAddonCategory] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addonCategoryToDelete, setAddonCategoryToDelete] = useState(null);
  const navigate = useNavigate()

  const filteredAddonCategories = stableSort(
    addOnsCategory,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.name?.toLowerCase().includes(searchFilter?.toLowerCase());
    else return true;
  });

  // useEffect(() => {
  //   dispatch(getSingleAddOnCategory(id));
  // }, []);

  useEffect(() => {
    if (selectedAddonCategory) {
      const updatedAddonCatgory = addOnsCategory.find(
        (addOnsCategory) => addOnsCategory.id === selectedAddonCategory.id
      );
      if (updatedAddonCatgory) setSelectedAddonCategory(updatedAddonCatgory);
    } else {
      setSelectedAddonCategory(addOnsCategory[0]);
    }
  }, [addOnsCategory]);

  const handleDeleteClick = (addoncatgory) => {
    setAddonCategoryToDelete(addoncatgory);
    setDeleteModalOpen(true);
  };
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setAddonCategoryToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (addonCategoryToDelete) {
      await dispatch(deleteAddOnsCategory(addonCategoryToDelete.id));
      setDeleteModalOpen(false);
      setAddonCategoryToDelete(null);
      dispatch(getAddOnsCategory()); // Refresh list
      toast.success("succesfully deleted Product Category");
    }
  };

  const handleToggleActive = async (event, addonCategoryId, currentStatus) => {
    console.log("clicked");
    event.stopPropagation();
    try {
      const updateData = {
        isActive: !currentStatus,
      };
      await dispatch(
        updateAddOnsCategory({ id: addonCategoryId, data: updateData })
      );
      toast.success(
        `Coupon ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      dispatch(getAddOnsCategory());
    } catch (error) {
      toast.error("Failed to update AddOnsCategory status");
      console.error("Error updating AddOnsCategory:", error);
    }
  };
    const handleEditClick = (addonCategoryId) => {
    // console.log("Edit clicked for:", addonCategoryId);
    navigate(`/edit-addoncategory/${addonCategoryId}`);
  };

  return (
    <div className="pt-2 pb-4">
      <HeadingAreaCoupon />

      <Grid container>
        <Grid
          size={{
            xs: 12,
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              boxShadow: "2px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* SEARCH BOX AREA */}
            <Box px={3}>
              <SearchArea
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                gridRoute="/addoncategory-grid"
                listRoute="/addoncategory-list-2"
              />
            </Box>

            {/* TABLE HEAD & BODY ROWS */}
            <TableContainer>
              <Scrollbar autoHide={false}>
                <Table>
                  {/* TABLE HEADER */}
                  <TableHead>
                    <TableRow>
                      {headCells.map((headCell) => (
                        <HeadTableCell
                          key={headCell.id}
                          padding={headCell.disablePadding ? "none" : "normal"}
                          sortDirection={
                            orderBy === headCell.id ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            onClick={(e) => handleRequestSort(e, headCell.id)}
                            direction={orderBy === headCell.id ? order : "asc"}
                          >
                            {headCell.label}
                          </TableSortLabel>
                        </HeadTableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  {/* TABLE BODY AND DATA */}
                  <TableBody>
                    {filteredAddonCategories
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((addoncatgory) => (
                        <BodyTableRow
                          key={addoncatgory.id}
                          active={
                            selectedAddonCategory?.id === addoncatgory.id
                              ? 1
                              : 0
                          }
                          onClick={() => setSelectedAddonCategory(addoncatgory)}
                        >
                          <BodyTableCell alignItems="center">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              {/* <Avatar
                                src={addoncatgory.profilePhoto}
                                sx={{
                                  borderRadius: "20%",
                                  backgroundColor: "grey.100",
                                }}
                              /> */}

                              <H6 fontSize={12} color="text.primary">
                                {addoncatgory.name ?? "N/A"}
                              </H6>
                            </Stack>
                          </BodyTableCell>
                          <BodyTableCell>
                            {addoncatgory.description
                              ? addoncatgory.description.length > 25
                                ? `${addoncatgory.description.substring(0, 25)}...`
                                : addoncatgory.description
                              : "N/A"}
                          </BodyTableCell>
                      
                          <BodyTableCell>
                            {addoncatgory.updatedBy ?? "N/A"}
                            {addoncatgory.updatedByRole && (
                              <span className="text-gray-500 text-sm ml-2">
                                ({addoncatgory.updatedByRole})
                              </span>
                            )}
                          </BodyTableCell>
        
                              <BodyTableCell alignItems="center">
                            <Chip
                              label={
                                addoncatgory.approvalStatus
                                  ? addoncatgory.approvalStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                    addoncatgory.approvalStatus.slice(1)
                                  : "N/A"
                              }
                              color={
                                addoncatgory.approvalStatus === "pending"
                                  ? "primary"
                                  : "warning.main"
                              }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>
                              <BodyTableCell alignItems="center">
                            <Button>Review</Button>
                             
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

                    {filteredAddonCategories.length === 0 && (
                      <TableDataNotFound />
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* TABLE PAGINATION SECTION */}
            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={filteredAddonCategories.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>
      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={deleteModalOpen}
        handleClose={handleDeleteCancel}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon '${addonCategoryToDelete?.name ?? ""}'?`}
        handleConfirm={handleDeleteConfirm}
        actions={[
          {
            label: "Cancel",
            props: { onClick: handleDeleteCancel, color: "inherit" },
          },
          {
            label: "Delete",
            props: {
              onClick: handleDeleteConfirm,
              color: "error",
              variant: "contained",
            },
          },
        ]}
      />
    </div>
  );
}
