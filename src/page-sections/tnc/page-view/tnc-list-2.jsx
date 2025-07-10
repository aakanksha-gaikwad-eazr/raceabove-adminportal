import { useEffect, useState } from "react"; // MUI
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
import styled from "@mui/material/styles/styled"; // CUSTOM COMPONENTS
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table"; // CUSTOM PAGE SECTION COMPONENTS
import { useNavigate } from "react-router-dom";
import SearchArea from "../SearchArea";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM UTILS METHOD
import { isDark } from "@/utils/constants"; // CUSTOM DUMMY DATA
import { useDispatch, useSelector } from "react-redux";
import HeadingAreaCoupon from "../HeadingAreaTnc";
import toast from "react-hot-toast";
import { Button, Chip } from "@mui/material";
import { getTnc } from "@/store/apps/tnc";
import ApprovalModal from "@/components/approval-modal";
import { Paragraph } from "@/components/typography";
import { reviewTnc } from "@/store/apps/tnc";

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

export default function Tnc2PageView() {
  // const [users] = useState([...USER_LIST]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedTnc, setSelectedTnc] = useState();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [tncToReview, setTncToReview] = useState(null);

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

  const { allTnc } = useSelector((state) => state.tnc);
  console.log("allTnc", allTnc);

  const filteredTnc = stableSort(allTnc, getComparator(order, orderBy)).filter(
    (item) => {
      if (searchFilter)
        return item?.content
          ?.toLowerCase()
          .includes(searchFilter?.toLowerCase());
      else return true;
    }
  );

  useEffect(() => {
    dispatch(getTnc());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTnc) {
      const updatedTnc = allTnc.find((tnc) => tnc.id === selectedTnc.id);
      if (updatedTnc) setSelectedTnc(updatedTnc);
    } else {
      setSelectedTnc(allTnc[0]);
    }
  }, [allTnc]);

  const handleReviewClick = (tnc) => {
    setTncToReview(tnc);
    setApprovalModalOpen(true);
  };

  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
    setTncToReview(null);
  };

   const handleApprovalSubmit = async (formData) => {
    console.log("formData1223",formData)
      if (tncToReview) {
        try {
          const reviewData = {
            id: tncToReview.id,
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
          const result = await dispatch(reviewTnc(reviewData));
          console.log("result", result)
          if (result?.payload?.status === 200) {
            dispatch(getTnc());
            
            // Show success toast based on approval status
            switch (reviewData?.data?.approvalStatus) {
              case "approved":
                toast.success("Terms and conditions approved successfully!");
                break;
              case "rejected":
                toast.success("Terms and conditions rejected successfully!");
                break;
              default:
                toast.success("Terms and conditions reviewed successfully!");
            }
            // Reset state
            setApprovalModalOpen(false);
            setTncToReview(null);
          } else {
            // Handle API error response
            const errorMessage = result.payload?.message || result.error?.message || "Failed to review Terms and Conditions";
            toast.error(errorMessage);
          }
          
        } catch (error) {
          console.error("Error reviewing Terms and condtions:", error);
          const errorMessage = error.response?.data?.message || error.message || "Failed to review Terms and Conditions. Please try again.";
          toast.error(errorMessage);
        }
      }
    };

  // Option 4: Multi-line with CSS line clamping
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
      }}
      title={content}
    >
      {content || "N/A"}
    </Box>
  );
  const ContentCell = ({ content, maxWidth = "200px" }) => (
    <Box
      sx={{
        maxWidth: maxWidth,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
      title={content} // Shows full content on hover
    >
      {content || "N/A"}
    </Box>
  );

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
                gridRoute="/tnc-grid"
                listRoute="/tnc-list-2"
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
                    {filteredTnc
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ).filter(tnc=>tnc.deletedAt === null)
                      .map((tnc) => (
                        <BodyTableRow
                          key={tnc.id}
                          active={selectedTnc?.id === tnc.id ? 1 : 0}
                          onClick={() => setSelectedTnc(tnc)}
                        >
                          {/* <BodyTableCell align="center">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                                                    {tnc.content ?? "N/A"}
                            </Stack>
                          </BodyTableCell> */}
                          <BodyTableCell align="left">
                            <Stack
                              direction="row"
                              alignItems="left"
                              spacing={1}
                            >
                              <MultiLineContentCell
                                content={tnc.content}
                                maxLines={4}
                              />
                            </Stack>
                          </BodyTableCell>
                          {/* <BodyTableCell align="center">
  <Stack direction="row" alignItems="center" spacing={1}>
    <ContentCell content={tnc.content} maxWidth="200px" />
  </Stack>
</BodyTableCell> */}

                          <BodyTableCell align="center">
                            <Chip
                              label={
                                tnc.approvalStatus
                                  ? tnc.approvalStatus.charAt(0).toUpperCase() +
                                    tnc.approvalStatus.slice(1)
                                  : "N/A"
                              }
                               color={
                                  tnc.approvalStatus === "approved"
                                    ? "success"
                                    : tnc.approvalStatus === "pending"
                                    ? "warning"
                                    : tnc.approvalStatus === "rejected"
                                    ? "error"
                                    : "default"
                                }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>

                          <BodyTableCell align="center">
                              <Paragraph>{tnc?.reviewedBy ?? "N/A"}</Paragraph>
                          </BodyTableCell>

                          <BodyTableCell align="center">
                         <Button
                                  size="small"
                                  variant="outlined"
                                  disabled={tnc.approvalStatus === "approved" || tnc.approvalStatus === "rejected"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReviewClick(tnc);
                                  }}
                                >
                                  Review
                                </Button>
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

                    {filteredTnc.length === 0 && <TableDataNotFound />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* TABLE PAGINATION SECTION */}
            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={filteredTnc.length}
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
        title="Review Terms and conditions"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: tncToReview?.approvalStatus || "",
          reviewReason: tncToReview?.reviewReason || ""
        }}
      />
    </div>
  );
}
