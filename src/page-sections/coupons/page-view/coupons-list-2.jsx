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
import DeleteIcon from "@/icons/Delete";
import EditIcon from "@/icons/Edit";
import DeleteModal from "@/components/delete-modal/DeleteModal";
import { useNavigate } from "react-router-dom";
import SearchArea from "../SearchArea";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM UTILS METHOD
import { isDark } from "@/utils/constants"; // CUSTOM DUMMY DATA
import { useDispatch, useSelector } from "react-redux";
import {
  getCoupons,
  reviewCoupons,
} from "../../../store/apps/coupons";
import HeadingAreaCoupon from "../HeadingAreaCoupon";
import toast from "react-hot-toast";
import { Button, Chip } from "@mui/material";
import ApprovalModal from "@/components/approval-modal";

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
    label: "Title",
  },
  {
    id: "position",
    numeric: true,
    disablePadding: false,
    label: "Code",
  },
  {
    id: "company",
    numeric: true,
    disablePadding: false,
    label: "Discount Type",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Discount Value",
  },
  {
    id: "timestamp",
    numeric: true,
    disablePadding: false,
    label: "TimeStamp",
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
      return item?.title?.toLowerCase().includes(searchFilter?.toLowerCase());
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
    setCouponToReview(coupons);
    setApprovalModalOpen(true);
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
              const result = await dispatch(reviewCoupons(reviewData));
              console.log("result", result)
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
                const errorMessage = result.payload?.message || result.error?.message || "Failed to review Coupons";
                toast.error(errorMessage);
              }
              
            } catch (error) {
              console.error("Error reviewing Coupons:", error);
              const errorMessage = error.response?.data?.message || error.message || "Failed to review Coupons. Please try again.";
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
                    {filteredCoupons
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((coupons) => (
                        <BodyTableRow
                          key={coupons.id}
                          active={selectedCoupons?.id === coupons.id ? 1 : 0}
                          onClick={() => setSelectedCoupons(coupons)}
                        >
                          <BodyTableCell align="center">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              {/* <Avatar
                                src={coupons.profilePhoto}
                                sx={{
                                  borderRadius: "20%",
                                  backgroundColor: "grey.100",
                                }}
                              /> */}

                              {/* <H6 fontSize={12} color="text.primary"> */}
                              {coupons.title ?? "N/A"}
                              {/* </H6> */}
                            </Stack>
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            <H6 fontSize={12} color="text.primary">
                              {coupons.code ?? "N/A"}
                            </H6>
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            <Chip
                              label={
                                coupons.discountType
                                  ? coupons.discountType
                                      .charAt(0)
                                      .toUpperCase() +
                                    coupons.discountType.slice(1)
                                  : "N/A"
                              }
                              color={
                                coupons.discountType === "percentage"
                                  ? "primary"
                                  : "primary"
                              }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            {coupons.discountType === "percentage"
                              ? `${Math.floor(coupons.discountValue)}%`
                              : `₹${Math.floor(coupons.discountValue)}`}
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            <div>
                              <div>
                                {" "}
                                Start:{" "}
                                {new Date(
                                  coupons.startTimeStamp
                                ).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div>
                                {" "}
                                End:{" "}
                                {new Date(coupons.endTimeStamp).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                            </div>
                          </BodyTableCell>
                          <BodyTableCell alignItems="center">
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
                                  : coupons.approvalStatus === "pending"
                                    ? "warning"
                                    : coupons.approvalStatus === "rejected"
                                      ? "error"
                                      : "default"
                              }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>
                   
                 
                        <BodyTableCell>
                            <Button
                                  size="small"
                                  variant="outlined"
                                  disabled={coupons.approvalStatus === "approved" || coupons.approvalStatus === "rejected"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReviewClick(coupons);
                                  }}
                                >
                                  Review
                                </Button>
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

                    {filteredCoupons.length === 0 && <TableDataNotFound />}
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
             reviewReason: couponToReview?.reviewReason || ""
           }}
         />
    </div>
  );
}
