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
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table"; 
import { useNavigate } from "react-router-dom";
import SearchArea from "../SearchArea";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; 
import { isDark } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import HeadingAreaCoupon from "../HeadingAreaTnc";
import toast from "react-hot-toast";
import { Button, Chip } from "@mui/material";
import { getPrivacyPolicies } from "@/store/apps/privacypolicy";
import { Paragraph } from "@/components/typography";
import { reviewPrivacyPolicies } from "@/store/apps/privacypolicy";
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
    label: "Content",
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

export default function PrivacyPolicy2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedPrivacyPolicy, setSelectedPrivacyPolicy] = useState();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [ppToReview, setPPToReview] = useState(null);

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    handleChangePage,
    handleRequestSort,
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: "content",
    defaultRowsPerPage: 10,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {privacypolicies} = useSelector((state) => state.privacypolicy);

  const filteredPrivacyPolicy = stableSort(privacypolicies, getComparator(order, orderBy)).filter(
    (item) => {
      if (searchFilter)
        return item?.content
          ?.toLowerCase()
          .includes(searchFilter?.toLowerCase());
      else return true;
    }
  );

  useEffect(() => {
    dispatch(getPrivacyPolicies());
  }, [dispatch]);

  useEffect(() => {
    if (selectedPrivacyPolicy) {
      const updatedPrivacyPolicy = privacypolicies.find((pp) => pp.id === selectedPrivacyPolicy.id);
      if (updatedPrivacyPolicy) setSelectedPrivacyPolicy(updatedPrivacyPolicy);
    } else {
      setSelectedPrivacyPolicy(privacypolicies[0]);
    }
  }, [privacypolicies]);

  const handleReviewClick = (pp) => {
    setPPToReview(pp);
    setApprovalModalOpen(true);
  };

  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
    setPPToReview(null);
  };

     const handleApprovalSubmit = async (formData) => {
      console.log("formData1223",formData)
        if (ppToReview) {
          try {
            const reviewData = {
              id: ppToReview.id,
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
            const result = await dispatch(reviewPrivacyPolicies(reviewData));
            console.log("result", result)
            if (result?.payload?.status === 200) {
              dispatch(getPrivacyPolicies());
              
              // Show success toast based on approval status
              switch (reviewData?.data?.approvalStatus) {
                case "approved":
                  toast.success("Privacy Policies are approved successfully!");
                  break;
                case "rejected":
                  toast.success("Privacy Policies are rejected successfully!");
                  break;
                default:
                  toast.success("Privacy Policies are reviewed successfully!");
              }
              // Reset state
              setApprovalModalOpen(false);
              setPPToReview(null);
            } else {
              // Handle API error response
              const errorMessage = result.payload?.message || result.error?.message || "Failed to review Privacy Policies";
              toast.error(errorMessage);
            }
            
          } catch (error) {
            console.error("Error reviewing Privacy Policies:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to review Privacy Policies. Please try again.";
            toast.error(errorMessage);
          }
        }
      };


  const MultiLineContentCell = ({ content, maxLines = 4 }) => (
    <Box
      sx={{
        display: "-webkit-box",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "600px",
        lineHeight: 1.2,
        cursor: "pointer",
        textTransform:"capitalize"
      }}
      title={content}
    >
      {content || "N/A"}
    </Box>
  );

    // Handle row click to navigate to details page
  const handleRowClick = (event, ppId) => {
    // Check if the click originated from a button, icon button, or chip
    const clickedElement = event.target;
    const isInteractiveElement = 
      clickedElement.closest('button') || 
      clickedElement.closest('[role="button"]') ||
      clickedElement.closest('.MuiChip-root') ||
      clickedElement.closest('.MuiIconButton-root') ||
      clickedElement.closest('.MuiButton-root');
    
    if (isInteractiveElement) {
      return;
    }
        navigate(`/privacy-policy-details/${ppId}`);
  };
    const isReviewed = (approvalStatus) => {
    return approvalStatus === "approved" || approvalStatus === "rejected";
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
                gridRoute="/privacy-policy-grid"
                listRoute="/privacy-policy-list-2"
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
                    {filteredPrivacyPolicy
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ).filter(pp=>pp.deletedAt === null)
                      .map((pp) => (
                        <BodyTableRow
                          key={pp.id}
                          active={selectedPrivacyPolicy?.id === pp.id ? 1 : 0}
                         onClick={(e) => {
                                  setSelectedPrivacyPolicy(pp);
                                  handleRowClick(e, pp.id);
                                }}
                        >
                          <BodyTableCell align="left">
                            <Stack
                              direction="row"
                              alignItems="left"
                              spacing={1}
                            >
                              <MultiLineContentCell
                                content={pp.content}
                                maxLines={4}
                              />
                            </Stack>
                          </BodyTableCell>
                          {/* <BodyTableCell align="center">
  <Stack direction="row" alignItems="center" spacing={1}>
    <ContentCell content={pp.content} maxWidth="200px" />
  </Stack>
</BodyTableCell> */}

                          <BodyTableCell align="center">
                            <Chip
                              label={
                                pp.approvalStatus
                                  ? pp.approvalStatus.charAt(0).toUpperCase() +
                                    pp.approvalStatus.slice(1)
                                  : "N/A"
                              }
                               color={
                                  pp.approvalStatus === "approved"
                                    ? "success"
                                    : pp.approvalStatus === "pending"
                                    ? "warning"
                                    : pp.approvalStatus === "rejected"
                                    ? "error"
                                    : "default"
                                }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>

                           <BodyTableCell align="center">
                                                        <Paragraph>{pp?.reviewedBy ?? "Not Reviewed Yet"}</Paragraph>
                                                    </BodyTableCell>

                          <BodyTableCell align="center">
                            <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReviewClick(pp);
                                  }}
                                >
                                      {isReviewed(faq.approvalStatus) ? "Re-review" : "Review"}
                                </Button>
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

                    {filteredPrivacyPolicy.length === 0 && <TableDataNotFound />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* TABLE PAGINATION SECTION */}
            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={filteredPrivacyPolicy.length}
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
        title="Review Privacy Policy"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: ppToReview?.approvalStatus || "",
          reviewReason: ppToReview?.reviewReason || ""
        }}
      />
    </div>
  );
}
