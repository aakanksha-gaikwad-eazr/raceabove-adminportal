import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import styled from "@mui/material/styles/styled";
import { H6 } from "@/components/typography";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table";
import SearchArea from "../SearchArea";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable";
import { isDark } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { getAddOnsCategory } from "@/store/apps/addonscategory";
import HeadingArea from "../HeadingArea";
import { Chip } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { reviewAddOnsCategory } from "@/store/apps/addonscategory";
import ApprovalModal from "@/components/approval-modal";
import { Paragraph } from "@/components/typography";
import { Button } from "@mui/material";
import { formatDate } from "@/utils/dateFormatter";
import { limitWords } from "@/utils/wordLimiter";

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
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "Sr No",
    width: "10%",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Title",
    width: "17%",
  },
  {
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "Description",
    width: "20%",
  },

  {
    id: "createdBy",
    numeric: false,
    disablePadding: false,
    label: "Organizer",
    width: "14%",
  },
  {
    id: "reviewedby",
    numeric: false,
    disablePadding: false,
    label: "Reviewed By",
    width: "15%",
  },
  {
    id: "createdate",
    numeric: false,
    disablePadding: false,
    label: "Date",
    width: "5%",
  },
  {
    id: "approvalStatus",
    numeric: true,
    disablePadding: false,
    label: "Approval Status",
    width: "20%",
  },

  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
    width: "5%",
  },
];

export default function Addoncategory2PageView() {
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

  const { addOnsCategory } = useSelector(
    (state) => state.addonscategory
  );
  const [selectedAddonCategory, setSelectedAddonCategory] =
    useState();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [addonCategoryToReview, setAddonCategoryToReview] =
    useState(null);
  const navigate = useNavigate();

  const filteredAddonCategories = stableSort(
    addOnsCategory,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.name
        ?.toLowerCase()
        .includes(searchFilter?.toLowerCase());
    else return true;
  });

  useEffect(() => {
    dispatch(getAddOnsCategory());
  }, []);

  useEffect(() => {
    if (selectedAddonCategory) {
      const updatedAddonCatgory = addOnsCategory.find(
        (addOnsCategory) =>
          addOnsCategory.id === selectedAddonCategory.id
      );
      if (updatedAddonCatgory)
        setSelectedAddonCategory(updatedAddonCatgory);
    } else {
      setSelectedAddonCategory(addOnsCategory[0]);
    }
  }, [addOnsCategory]);

  const handleReviewClick = (addoncatgory) => {
    navigate(`/details-addoncategory/${addoncatgory.id}`);

    // setAddonCategoryToReview(addoncatgory);
    // setApprovalModalOpen(true);
  };
  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
    setAddonCategoryToReview(null);
  };

  const handleApprovalSubmit = async (formData) => {
    if (addonCategoryToReview) {
      try {
        const reviewData = {
          id: addonCategoryToReview.id,
          data: {
            approvalStatus: String(formData.approvalStatus)
              .toLowerCase()
              .trim(),
            reviewReason: String(formData.reviewReason).trim(),
          },
        };

        // Additional validation to ensure values are correct
        if (
          !["approved", "rejected"].includes(
            reviewData?.data?.approvalStatus
          )
        ) {
          toast.error("Invalid approval status");
          return;
        }
        if (!reviewData?.data?.reviewReason) {
          toast.error("Review reason is required");
          return;
        }
        const result = await dispatch(
          reviewAddOnsCategory(reviewData)
        );
        console.log("result", result);
        if (result?.payload?.status === 200) {
          dispatch(getAddOnsCategory());

          // Show success toast based on approval status
          switch (reviewData?.data?.approvalStatus) {
            case "approved":
              toast.success(
                "Product Categories are approved successfully!"
              );
              break;
            case "rejected":
              toast.success(
                "Product Categories are rejected successfully!"
              );
              break;
            default:
              toast.success(
                "Product Categories are reviewed successfully!"
              );
          }
          // Reset state
          setApprovalModalOpen(false);
          setAddonCategoryToReview(null);
        } else {
          // Handle API error response
          const errorMessage =
            result.payload?.message ||
            result.error?.message ||
            "Failed to review Product categories";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error reviewing Product Categories:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to review Product categories. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  const handleRowClick = (event, addonCategoryId) => {
    // Check if the click originated from a button, icon button, or chip
    const clickedElement = event.target;
    const isInteractiveElement =
      clickedElement.closest("button") ||
      clickedElement.closest('[role="button"]') ||
      clickedElement.closest(".MuiChip-root") ||
      clickedElement.closest(".MuiIconButton-root") ||
      clickedElement.closest(".MuiButton-root");

    if (isInteractiveElement) {
      return;
    }
    navigate(`/details-addoncategory/${addonCategoryId}`);
  };

  const isReviewed = (approvalStatus) => {
    return (
      approvalStatus === "approved" || approvalStatus === "rejected"
    );
  };
  console.log("filteredAddonCategories", filteredAddonCategories);

  return (
    <div className="pt-2 pb-4">
      <HeadingArea />

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
                          padding={
                            headCell.disablePadding
                              ? "none"
                              : "normal"
                          }
                          sortDirection={
                            orderBy === headCell.id ? order : false
                          }
                          width={headCell.width}
                        >
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            onClick={(e) =>
                              handleRequestSort(e, headCell.id)
                            }
                            direction={
                              orderBy === headCell.id ? order : "asc"
                            }
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
                      .filter(
                        (addoncatgory) =>
                          addoncatgory.deletedAt === null
                      )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((addoncatgory, ind) => (
                        <BodyTableRow
                          key={addoncatgory.id}
                          active={
                            selectedAddonCategory?.id ===
                            addoncatgory.id
                              ? 1
                              : 0
                          }
                          onClick={(e) => {
                            setSelectedAddonCategory(addoncatgory);
                            handleRowClick(e, addoncatgory.id);
                          }}
                        >
                          <BodyTableCell align="left">
                            {page * rowsPerPage + ind + 1}
                          </BodyTableCell>
                          <BodyTableCell align="left">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <H6 fontSize={13} color="text.primary">
                                {addoncatgory.name ?? "N/A"}
                              </H6>
                            </Stack>
                          </BodyTableCell>
                          <BodyTableCell align="left">
                            {limitWords(
                              addoncatgory?.description,
                              20
                            )}
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            {addoncatgory?.createdBy ?? "N/A"}
                          </BodyTableCell>

                          <BodyTableCell align="center">
                            <Paragraph>
                              {addoncatgory?.reviewedBy ??
                                "Not Reviewed yet"}
                            </Paragraph>
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            {formatDate(addoncatgory?.createdAt)}
                          </BodyTableCell>
                          <BodyTableCell
                            align="center"
                            style={{ textTransform: "capitalize" }}
                          >
                            {/* {addoncatgory.approvalStatus ?? "N/A"} */}
                            <Chip
                              label={addoncatgory?.approvalStatus}
                              color={
                                addoncatgory.approvalStatus ===
                                "approved"
                                  ? "success"
                                  : addoncatgory.approvalStatus ===
                                      "pending"
                                    ? "warning"
                                    : addoncatgory.approvalStatus ===
                                        "rejected"
                                      ? "error"
                                      : "default"
                              }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>

                          <BodyTableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReviewClick(addoncatgory);
                              }}
                            >
                              {isReviewed(addoncatgory.approvalStatus)
                                ? "Re-review"
                                : "Review"}
                            </Button>
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
      {/* APPROVAL MODAL */}
      <ApprovalModal
        open={approvalModalOpen}
        handleClose={handleApprovalCancel}
        title="Review Products and Category"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: addonCategoryToReview?.approvalStatus || "",
          reviewReason: addonCategoryToReview?.reviewReason || "",
        }}
      />
    </div>
  );
}
