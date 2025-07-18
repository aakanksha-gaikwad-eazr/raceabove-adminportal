import { useEffect, useState } from "react"; 
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
import styled from "@mui/material/styles/styled"; 
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table"; 
import DeleteIcon from "@/icons/Delete";
import EditIcon from "@/icons/Edit";
import DeleteModal from "@/components/delete-modal/DeleteModal";
import { useNavigate } from "react-router-dom";
import SearchArea from "../SearchArea";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable";
import { isDark } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import HeadingAreaFAQ from "../HeadingAreaFAQ";
import toast from "react-hot-toast";
import { Chip, Switch, Collapse, IconButton, Typography, Paper, Button, Skeleton } from "@mui/material";
import { getFaq } from "@/store/apps/faq";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Paragraph } from "@/components/typography";
import { reviewFaq } from "@/store/apps/faq";
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
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  ...(active && {
    backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  }),
}));

const ExpandableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[isDark(theme) ? 800 : 50],
}));

const AnswerContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
}));

const headCells = [
  {
    id: "expand",
    numeric: false,
    disablePadding: true,
    label: "",
  },
  {
    id: "question",
    numeric: false,
    disablePadding: false,
    label: "Question",
  },
  {
    id: "approvalStatus",
    numeric: false,
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
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
];

// MUI Skeleton Component for Table Row
const SkeletonTableRow = () => (
  <TableRow>
    <BodyTableCell align="center" sx={{ width: 70 }}>
      <Skeleton variant="circular" width={32} height={32} />
    </BodyTableCell>
    <BodyTableCell align="left">
      <Stack spacing={1}>
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="45%" height={20} />
      </Stack>
    </BodyTableCell>
    <BodyTableCell align="left">
      <Skeleton variant="rounded" width={80} height={28} />
    </BodyTableCell>
    <BodyTableCell align="left">
      <Skeleton variant="text" width={60} height={20} />
    </BodyTableCell>
    <BodyTableCell align="left">
      <Skeleton variant="rounded" width={70} height={36} />
    </BodyTableCell>
  </TableRow>
);

// MUI Skeleton Component for Search Area
const SkeletonSearchArea = () => (
  <Box px={2} py={2}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box flex={1}>
        <Skeleton variant="rounded" width="100%" height={40} />
      </Box>
    </Stack>
  </Box>
);

export default function Faq2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedFaq, setSelectedFaq] = useState();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [faqToReview, setFaqToReview] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    handleChangePage,
    handleRequestSort,
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: "question",
    defaultRowsPerPage: 5,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allFaq } = useSelector((state) => state.faq);
  
  const filteredFaq = stableSort(allFaq, getComparator(order, orderBy)).filter(
    (item) => {
      if (searchFilter)
        return item?.question
          ?.toLowerCase()
          .includes(searchFilter?.toLowerCase());
      else return true;
    }
  );

  useEffect(() => {
    const fetchFaq = async () => {
      setIsLoading(true);
      try {
        await dispatch(getFaq());
      } catch (error) {
        console.error("Error fetching FAQ:", error);
      } finally {
        // Add minimum loading time for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    fetchFaq();
  }, [dispatch]);

  useEffect(() => {
    if (selectedFaq) {
      const updatedFaq = allFaq.find((faq) => faq.id === selectedFaq.id);
      if (updatedFaq) setSelectedFaq(updatedFaq);
    } else {
      setSelectedFaq(allFaq[0]);
    }
  }, [allFaq]);

  const handleReviewClick = (faq) => {
    setFaqToReview(faq);
    setApprovalModalOpen(true);
  };

  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
    setFaqToReview(null);
  };

  const handleApprovalSubmit = async (formData) => {
    console.log("formData1223", formData);
    if (faqToReview) {
      try {
        const reviewData = {
          id: faqToReview.id,
          data: {
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
        const result = await dispatch(reviewFaq(reviewData));
        if (result.status === 200) {
          dispatch(getFaq());
          
          // Show success toast based on approval status
          switch (reviewData?.data?.approvalStatus) {
            case "approved":
              toast.success("FAQ approved successfully!");
              break;
            case "rejected":
              toast.success("FAQ rejected successfully!");
              break;
            default:
              toast.success("FAQ reviewed successfully!");
          }
          // Reset state
          setApprovalModalOpen(false);
          setFaqToReview(null);
        } else {
          // Handle API error response
          const errorMessage = result.payload?.message || result.error?.message || "Failed to review FAQ";
          toast.error(errorMessage);
        }
        
      } catch (error) {
        console.error("Error reviewing FAQ:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to review FAQ. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  const handleToggleExpand = (event, faqId) => {
    event.stopPropagation();
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(faqId)) {
      newExpandedRows.delete(faqId);
    } else {
      newExpandedRows.add(faqId);
    }
    setExpandedRows(newExpandedRows);
  };

  const QuestionCell = ({ content }) => (
    <Box
      sx={{
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "500px",
        lineHeight: 1.4,
        fontWeight: 500,
        color: "text.primary",
      }}
    >
      {content || "N/A"}
    </Box>
  );

  return (
    <div className="pt-2 pb-4">
      <HeadingAreaFAQ />

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
            {isLoading ? (
              <SkeletonSearchArea />
            ) : (
              <Box px={3}>
                <SearchArea
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  gridRoute="/faq-grid"
                  listRoute="/faq-list-2"
                />
              </Box>
            )}

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
                          align={headCell.id === "expand" ? "center" : "left"}
                          padding={headCell.disablePadding ? "none" : "normal"}
                          sortDirection={
                            orderBy === headCell.id ? order : false
                          }
                          sx={headCell.id === "expand" ? { width: 70 } : {}}
                        >
                          {headCell.id !== "expand" && (
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              onClick={(e) => handleRequestSort(e, headCell.id)}
                              direction={orderBy === headCell.id ? order : "asc"}
                            >
                              {headCell.label}
                            </TableSortLabel>
                          )}
                        </HeadTableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  {/* TABLE BODY AND DATA */}
                  <TableBody>
                    {isLoading ? (
                      // Show skeleton rows while loading
                      Array.from({ length: rowsPerPage }).map((_, index) => (
                        <SkeletonTableRow key={`skeleton-${index}`} />
                      ))
                    ) : (
                      filteredFaq
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .filter(faq => faq.deletedAt === null)
                        .map((faq) => (
                          <>
                            <BodyTableRow
                              key={faq.id}
                              active={selectedFaq?.id === faq.id ? 1 : 0}
                              onClick={() => setSelectedFaq(faq)}
                            >
                              <BodyTableCell align="center" sx={{ width: 70 }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleToggleExpand(e, faq.id)}
                                >
                                  {expandedRows.has(faq.id) ? 
                                    <KeyboardArrowUpIcon /> : 
                                    <KeyboardArrowDownIcon />
                                  }
                                </IconButton>
                              </BodyTableCell>

                              <BodyTableCell align="left">
                                <QuestionCell content={faq.question} />
                              </BodyTableCell>

                              <BodyTableCell align="left">
                                <Chip
                                  label={
                                    faq.approvalStatus
                                      ? faq.approvalStatus.charAt(0).toUpperCase() +
                                        faq.approvalStatus.slice(1)
                                      : "N/A"
                                  }
                                  color={
                                    faq.approvalStatus === "approved"
                                      ? "success"
                                      : faq.approvalStatus === "pending"
                                      ? "warning"
                                      : faq.approvalStatus === "rejected"
                                      ? "error"
                                      : "default"
                                  }
                                  variant="outlined"
                                  size="small"
                                />
                              </BodyTableCell>

                              <BodyTableCell align="left">
                                <Paragraph>{faq?.reviewedBy ?? "Not Reviewed yet"}</Paragraph>
                              </BodyTableCell>

                              <BodyTableCell align="left">
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    disabled={faq.approvalStatus === "approved" || faq.approvalStatus === "rejected"}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReviewClick(faq);
                                    }}
                                  >
                                    Review
                                  </Button>
                                </Stack>
                              </BodyTableCell>
                            </BodyTableRow>

                            {/* EXPANDABLE ANSWER ROW */}
                            <ExpandableRow>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={headCells.length}
                              >
                                <Collapse
                                  in={expandedRows.has(faq.id)}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <AnswerContainer elevation={0}>
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        color: "primary.main",
                                        fontWeight: 600,
                                        mb: 2,
                                      }}
                                    >
                                      Answer
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        lineHeight: 1.8,
                                        color: "text.secondary",
                                        whiteSpace: "pre-wrap",
                                      }}
                                    >
                                      {faq.answer || "No answer provided yet."}
                                    </Typography>
                                  </AnswerContainer>
                                </Collapse>
                              </TableCell>
                            </ExpandableRow>
                          </>
                        ))
                    )}

                    {!isLoading && filteredFaq.length === 0 && <TableDataNotFound />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* TABLE PAGINATION SECTION */}
            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={isLoading ? 0 : filteredFaq.length}
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
        title="Review FAQ"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: faqToReview?.approvalStatus || "",
          reviewReason: faqToReview?.reviewReason || ""
        }}
      />
    </div>
  );
}