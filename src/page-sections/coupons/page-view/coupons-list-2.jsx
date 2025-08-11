import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
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
import { useNavigate } from "react-router-dom";
import SearchArea from "../SearchArea";
import useMuiTable, {
  getComparator,
  stableSort,
} from "@/hooks/useMuiTable";
import { isDark } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  getCoupons,
  reviewCoupons,
} from "../../../store/apps/coupons";
import HeadingAreaCoupon from "../HeadingAreaCoupon";
import toast from "react-hot-toast";
import { Button, Chip } from "@mui/material";
import ApprovalModal from "@/components/approval-modal";
import { limitWords } from "@/utils/wordLimiter";
import { formatDate } from "@/utils/dateFormatter";

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
    width: "20",
  },
  {
    id: "discountType",
    numeric: true,
    disablePadding: false,
    label: "Type",
    width: "10",
  },
  {
    id: "createdBy",
    numeric: true,
    disablePadding: false,
    label: "Organizer",
    width: "15%",
  },
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Date",
    width: "12%",
  },
  {
    id: "updatedBy",
    numeric: true,
    disablePadding: false,
    label: "Reviewed By",
    width: "14%",
  },
  {
    id: "approvalStatus",
    numeric: true,
    disablePadding: false,
    label: "Approval Status",
    width: "15%",
  },

  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
    width: "10%",
  },
];

export default function Coupons2PageView() {
  // const [users] = useState([...USER_LIST]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCoupons, setSelectedCoupons] = useState();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [couponToReview, setCouponToReview] = useState(null);

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
  const navigate = useNavigate();

  const { coupons } = useSelector((state) => state.coupons);
  console.log("coupons", coupons);

  const filteredCoupons = stableSort(
    coupons,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.title
        ?.toLowerCase()
        .includes(searchFilter?.toLowerCase());
    else return true;
  });

  useEffect(() => {
    dispatch(getCoupons());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCoupons) {
      const updatedCoupons = coupons.find(
        (coupon) => coupon.id === selectedCoupons.id
      );
      if (updatedCoupons) setSelectedCoupons(updatedCoupons);
    } else {
      setSelectedCoupons(coupons[0]);
    }
  }, [coupons]);

  const handleReviewClick = (coupons) => {
    navigate(`/coupon-details/${coupons.id}`);
  };
  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
    setCouponToReview(null);
  };
  const handleApprovalSubmit = async (formData) => {
    if (couponToReview) {
      try {
        const reviewData = {
          id: couponToReview.id,
          data: {
            approvalStatus: String(formData.approvalStatus)
              .toLowerCase()
              .trim(),
            reviewReason: String(formData.reviewReason).trim(),
          },
        };

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
        const result = await dispatch(reviewCoupons(reviewData));
        console.log("result", result);
        if (result?.payload?.status === 200) {
          dispatch(getCoupons());

          // Show success toast based on approval status
          switch (reviewData?.data?.approvalStatus) {
            case "approved":
              toast.success("Coupons are approved successfully!");
              break;
            case "rejected":
              toast.success("Coupons are rejected successfully!");
              break;
            default:
              toast.success("Coupons are reviewed successfully!");
          }
          // Reset state
          setApprovalModalOpen(false);
          setCouponToReview(null);
        } else {
          // Handle API error response
          const errorMessage =
            result.payload?.message ||
            result.error?.message ||
            "Failed to review Coupons";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error reviewing Coupons:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to review Coupons. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  const isReviewed = (approvalStatus) => {
    return (
      approvalStatus === "approved" || approvalStatus === "rejected"
    );
  };

  const handleRowClick = (event, couponId) => {
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
    navigate(`/coupon-details/${couponId}`);
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
                gridRoute="/coupons-grid"
                listRoute="/coupons-list-2"
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
                          align="center"
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
                    {filteredCoupons
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((coupons, ind) => (
                        <BodyTableRow
                          key={coupons.id}
                          active={
                            selectedCoupons?.id === coupons.id ? 1 : 0
                          }
                          onClick={(e) => {
                            setSelectedCoupons(coupons);
                            handleRowClick(e, coupons.id);
                          }}
                        >
                          <BodyTableCell align="left">
                            {page * rowsPerPage + ind + 1}
                          </BodyTableCell>

                          <BodyTableCell
                            align="left"
                            style={{ textTransform: "capitalize" }}
                          >
                            <H6 fontSize={13} color="text.primary">
                              {limitWords(coupons.title, 20)}
                            </H6>
                          </BodyTableCell>
                          <BodyTableCell
                            align="center"
                            textTransform="capitalize"
                          >
                            {coupons?.discountType}
                          </BodyTableCell>

                          <BodyTableCell align="center">
                            {coupons?.createdBy ?? "N/A"}
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            {formatDate(coupons?.createdAt)}
                          </BodyTableCell>
                          <BodyTableCell
                            align="center"
                            style={{
                              textTransform: "capitalize",
                            }}
                          >
                            {coupons.updatedBy ?? "N/A"}
                          </BodyTableCell>

                          <BodyTableCell align="center">
                            {/* {addoncatgory.approvalStatus ?? "N/A"} */}
                            <Chip
                              label={
                                coupons.approvalStatus
                                  ? coupons.approvalStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                    coupons.approvalStatus.slice(1)
                                  : "N/A"
                              }
                              color={
                                coupons.approvalStatus === "approved"
                                  ? "success"
                                  : coupons.approvalStatus ===
                                      "pending"
                                    ? "warning"
                                    : coupons.approvalStatus ===
                                        "rejected"
                                      ? "error"
                                      : "default"
                              }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>

                          <BodyTableCell align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReviewClick(coupons);
                              }}
                            >
                              {isReviewed(coupons.approvalStatus)
                                ? "Re-review"
                                : "Review"}
                            </Button>
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

                    {filteredCoupons.length === 0 && (
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
              count={filteredCoupons.length}
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
        title="Review Coupons"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: couponToReview?.approvalStatus || "",
          reviewReason: couponToReview?.reviewReason || "",
        }}
      />
    </div>
  );
}
