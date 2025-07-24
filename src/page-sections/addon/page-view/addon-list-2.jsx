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
import UserDetails from "../AddonDetails"; // CUSTOM DEFINED HOOK

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
import { Chip, Switch } from "@mui/material";
import DeleteIcon from "@/icons/Delete";
import EditIcon from "@/icons/Edit";
import DeleteModal from "@/components/delete-modal/DeleteModal";
// import { deleteAddOnsCategory } from "@/store/apps/addonscategory";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAddOns } from "@/store/apps/addons";
import { reviewAddOns } from "@/store/apps/addons";
import ApprovalModal from "@/components/approval-modal";
import { Paragraph } from "@/components/typography";
import { Button } from "@mui/material";


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
    id: "approvalStatus",
    numeric: true,
    disablePadding: false,
    label: "Approval Status",
  },
  {
    id: "reviewedby",
    numeric: false,
    disablePadding: false,
    label: "Reviewed By",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];

export default function Addon2PageView() {
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

  const {allAddOns}  = useSelector((state) => state.addons);
  const [selectedAddon, setSelectedAddon] = useState();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [addonToReview, setAddonToReview] = useState(null);
  const navigate = useNavigate()

  const addOnsArray = Array.isArray(allAddOns) ? allAddOns : [];

  const filteredAddon = stableSort(
    addOnsArray,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.name?.toLowerCase().includes(searchFilter?.toLowerCase());
    else return true;
  });
    useEffect(() => {
    dispatch(getAddOns());
  }, [dispatch]);

  useEffect(() => {
    if (selectedAddon) {
      const updatedAddon = addOnsArray.find(
        (addOns) => addOns.id === selectedAddon.id
      );
      if (updatedAddon) setSelectedAddon(updatedAddon);
    } else {
      setSelectedAddon(allAddOns[0]);
    }
  }, [addOnsArray]);

  const handleReviewClick = (addOns) => {
    setAddonToReview(addOns);
    setApprovalModalOpen(true);
  };
  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
    setAddonToReview(null);
  };

     const handleApprovalSubmit = async (formData) => {
        if (addonToReview) {
          try {
            const reviewData = {
              id: addonToReview.id,
              data:{
                approvalStatus: String(formData.approvalStatus).toLowerCase().trim(),
                reviewReason: String(formData.reviewReason).trim(),
              }
             
            };
    
            // Additional validation to ensure values are correct
            if (!["approved", "rejected"].includes(reviewData?.data?.approvalStatus)) {
              toast.error("Invalid approval status");
              return;
            }
            if (!reviewData?.data?.reviewReason) {
              toast.error("Review reason is required");
              return;
            }
            const result = await dispatch(reviewAddOns(reviewData));
            console.log("result", result)
            if (result?.payload?.status === 200) {
              dispatch(getAddOns());
              
              // Show success toast based on approval status
              switch (reviewData?.data?.approvalStatus) {
                case "approved":
                  toast.success("Product are approved successfully!");
                  break;
                case "rejected":
                  toast.success("Product are rejected successfully!");
                  break;
                default:
                  toast.success("Product are reviewed successfully!");
              }
              // Reset state
              setApprovalModalOpen(false);
              setAddonToReview(null);
            } else {
              // Handle API error response
              const errorMessage = result.payload?.message || result.error?.message || "Failed to review Product";
              toast.error(errorMessage);
            }
            
          } catch (error) {
            console.error("Error reviewing Product:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to review Product. Please try again.";
            toast.error(errorMessage);
          }
        }
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
                gridRoute="/addon-grid"
                listRoute="/addon-list-2"
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
                    {filteredAddon
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ).filter(addon=>addon.deletedAt === null)
                      .map((addon) => (
                        <BodyTableRow
                          key={addon.id}
                          active={
                            selectedAddon?.id === addon.id
                              ? 1
                              : 0
                          }
                          onClick={() => setSelectedAddon(addon)}
                        >
                          <BodyTableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Avatar
                                src={addon.image}
                                sx={{
                                  borderRadius: "20%",
                                  backgroundColor: "grey.100",
                                }}
                              />

                              <H6 fontSize={12} color="text.primary">
                                {addon.name ?? "N/A"}
                              </H6>
                            </Stack>
                          </BodyTableCell>
                          <BodyTableCell>
                            {addon.description
                              ? addon.description.length > 25
                                ? `${addon.description.substring(0, 25)}...`
                                : addon.description
                              : "N/A"}
                          </BodyTableCell>
                          <BodyTableCell alignItems="center">
                            {/* {addon.approvalStatus ?? "N/A"} */}
                            <Chip
                              label={
                                addon.approvalStatus
                                  ? addon.approvalStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                    addon.approvalStatus.slice(1)
                                  : "N/A"
                              }
                              color={
                                  addon.approvalStatus === "approved"
                                    ? "success"
                                    : addon.approvalStatus === "pending"
                                    ? "warning"
                                    : addon.approvalStatus === "rejected"
                                    ? "error"
                                    : "default"
                                }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>
                           <BodyTableCell align="center">
                                                                             <Paragraph>{addon?.reviewedBy ?? "Not yet reviewed"}</Paragraph>
                                                                         </BodyTableCell>
                          <BodyTableCell>
                            <Button
                                  size="small"
                                  variant="outlined"
                                  disabled={addon.approvalStatus === "approved" || addon.approvalStatus === "rejected"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReviewClick(addon);
                                  }}
                                >
                                  Review
                                </Button>
                          </BodyTableCell>
                
                        </BodyTableRow>
                      ))}

                    {filteredAddon.length === 0 && (
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
              count={filteredAddon.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>

   {/* APPROVAL MODAL */}
      <ApprovalModal
        open={approvalModalOpen}
        handleClose={handleApprovalCancel}
        title="Review Products"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: addonToReview?.approvalStatus || "",
          reviewReason: addonToReview?.reviewReason || ""
        }}
      />
    </div>
  );
}
