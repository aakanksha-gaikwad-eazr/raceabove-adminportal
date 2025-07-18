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
import UserDetails from "../TickettemplateDetails"; // CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM UTILS METHOD
import { isDark } from "@/utils/constants"; // CUSTOM DUMMY DATA
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../../store/apps/user";
import HeadingArea from "../HeadingArea";
import { Button, Chip, Switch } from "@mui/material";
import DeleteIcon from "@/icons/Delete";
import EditIcon from "@/icons/Edit";
import DeleteModal from "@/components/delete-modal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ApprovalModal from "@/components/approval-modal";
import { Paragraph } from "@/components/typography";
import { reviewTicketTemplate } from "@/store/apps/tickettemplate";
import { getTicketTemplate } from "@/store/apps/tickettemplate";


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
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "age",
    numeric: true,
    disablePadding: false,
    label: "Age",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Quantity",
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

export default function TicketTemplate2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedTicketTemplate, setSelectedTicketTemplate] = useState();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [ticketTemplateToReview, setTicketTemplateToReview] = useState(null);

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

  const {allTicketTemplate} = useSelector((state) => state.tickettemplate);

  const filteredTicketTemplates = stableSort(
    allTicketTemplate,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.description?.toLowerCase().includes(searchFilter?.toLowerCase());
    else return true;
  });

  useEffect(() => {
    dispatch(getTicketTemplate());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTicketTemplate) {
      const updatedTicketTemplate = allTicketTemplate.find(
        (tickettemplate) => tickettemplate.id === selectedTicketTemplate.id
      );
      if (updatedTicketTemplate) setSelectedTicketTemplate(updatedTicketTemplate);
    } else {
      setSelectedTicketTemplate(allTicketTemplate[0]);
    }
  }, [allTicketTemplate]);

  const handleReviewClick = (tickettemplate) => {
    setTicketTemplateToReview(tickettemplate);
    setApprovalModalOpen(true);
  };

  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
    setTicketTemplateToReview(null);
  };

      const handleApprovalSubmit = async (formData) => {
          if (ticketTemplateToReview) {
            try {
              const reviewData = {
                id: ticketTemplateToReview.id,
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
              const result = await dispatch(reviewTicketTemplate(reviewData));
              console.log("result", result)
              if (result?.payload?.status === 200) {
                dispatch(getTicketTemplate());
                
                // Show success toast based on approval status
                switch (reviewData?.data?.approvalStatus) {
                  case "approved":
                    toast.success("Ticket Template approved successfully!");
                    break;
                  case "rejected":
                    toast.success("Ticket Template rejected successfully!");
                    break;
                  default:
                    toast.success("Ticket Template reviewed successfully!");
                }
                // Reset state
                setApprovalModalOpen(false);
                setTicketTemplateToReview(null);
              } else {
                // Handle API error response
                const errorMessage = result.payload?.message || result.error?.message || "Failed to review Ticket Template";
                toast.error(errorMessage);
              }
              
            } catch (error) {
              console.error("Error reviewing Ticket Template:", error);
              const errorMessage = error.response?.data?.message || error.message || "Failed to review Ticket Template Please try again.";
              toast.error(errorMessage);
            }
          }
        };
  

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
                gridRoute="/ticket-template-grid"
                listRoute="/ticket-template-list-2"
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
                    {filteredTicketTemplates
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ).filter(tickettemplate=>tickettemplate.deletedAt === null)
                      .map((tickettemplate) => (
                        <BodyTableRow
                          key={tickettemplate.id}
                          active={
                            selectedTicketTemplate?.id === tickettemplate.id ? 1 : 0
                          }
                          onClick={() => setSelectedTicketTemplate(tickettemplate)}
                        >
                          <BodyTableCell>
                            {tickettemplate.description ?? "N/A"}
                          </BodyTableCell>
                       <BodyTableCell>
                            {tickettemplate.minAge && tickettemplate.maxAge 
                              ? `${tickettemplate.minAge} - ${tickettemplate.maxAge} years`
                              : tickettemplate.minAge 
                                ? `${tickettemplate.minAge}+ years`
                                : tickettemplate.maxAge 
                                  ? `Up to ${tickettemplate.maxAge} years`
                                  : "N/A"}
                          </BodyTableCell>
                          <BodyTableCell>
                            {tickettemplate.price ?? "N/A"}
                          </BodyTableCell>
                          <BodyTableCell>
                            {tickettemplate.quantity ?? "N/A"}
                          </BodyTableCell>
                          <BodyTableCell>
                            <Chip
                              label={
                                tickettemplate.approvalStatus
                                  ? tickettemplate.approvalStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                    tickettemplate.approvalStatus.slice(1)
                                  : "N/A"
                              }
                           color={
                                  tickettemplate.approvalStatus === "approved"
                                    ? "success"
                                    : tickettemplate.approvalStatus === "pending"
                                    ? "warning"
                                    : tickettemplate.approvalStatus === "rejected"
                                    ? "error"
                                    : "default"
                                }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>
                            <BodyTableCell align="center">
                                                                           <Paragraph>{tickettemplate?.reviewedBy ?? "N/A"}</Paragraph>
                                                                       </BodyTableCell>
                          <BodyTableCell>
                            <Button
                                                              size="small"
                                                              variant="outlined"
                                                              disabled={tickettemplate.approvalStatus === "approved" || tickettemplate.approvalStatus === "rejected"}
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleReviewClick(tickettemplate);
                                                              }}
                                                            >
                                                              Review
                                                            </Button>
                          </BodyTableCell>

                         
                        </BodyTableRow>
                      ))}

                    {filteredTicketTemplates.length === 0 && <TableDataNotFound />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* TABLE PAGINATION SECTION */}
            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={filteredTicketTemplates.length}
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
        title="Review Ticket Template"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: ticketTemplateToReview?.approvalStatus || "",
          reviewReason: ticketTemplateToReview?.reviewReason || ""
        }}
      />
    </div>
  );
}
