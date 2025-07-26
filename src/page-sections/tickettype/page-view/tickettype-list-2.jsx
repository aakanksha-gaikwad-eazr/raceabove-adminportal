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
import UserDetails from "../TickettypeDetails"; // CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM UTILS METHOD
import { isDark } from "@/utils/constants"; // CUSTOM DUMMY DATA
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../../store/apps/user";
import HeadingArea from "../HeadingArea";
import { getTicketType } from "@/store/apps/tickettype";
import { Button, Chip, Switch } from "@mui/material";
import DeleteIcon from "@/icons/Delete";
import EditIcon from "@/icons/Edit";
import DeleteModal from "@/components/delete-modal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ApprovalModal from "@/components/approval-modal";
import { Paragraph } from "@/components/typography";
import { reviewTicketTypes } from "@/store/apps/tickettype";
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
    label: "Id",
    width: "5%"
  },
  {
    id: "title",
    numeric: true,
    disablePadding: false,
    label: "Title",
    width: "12%"
  },
  {
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "Description",
    width: "18%"
  },
  {
    id: "approvalStatus",
    numeric: true,
    disablePadding: false,
    label: "Approval Status",
    width: "19%"
  },
  {
    id: "organizer",
    numeric: false,
    disablePadding: false,
    label: "Organizer",
    width: "17%"
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
    width: "12%"
  },
  {
    id: "reviewedby",
    numeric: false,
    disablePadding: false,
    label: "Reviewed By",
    width: "18%"
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
    width: "10%"
  },
];

export default function TicketType2PageView() {
  // const [users] = useState([...USER_LIST]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedTicketType, setSelectedTicketTypes] = useState();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [ticketTypeToReview, setTickettypeToReview] = useState(null);

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

  const { tickettypes } = useSelector((state) => state.tickettype);

  const filteredTicketTypes = stableSort(
    tickettypes,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.title?.toLowerCase().includes(searchFilter?.toLowerCase());
    else return true;
  });

  useEffect(() => {
    dispatch(getTicketType());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTicketType) {
      const updatedTicketType = tickettypes.find(
        (tickettypes) => tickettypes.id === selectedTicketType.id
      );
      if (updatedTicketType) setSelectedTicketTypes(updatedTicketType);
    } else {
      setSelectedTicketTypes(tickettypes[0]);
    }
  }, [tickettypes]);

  const handleReviewClick = (tickettype) => {
    navigate(`/details-ticket-type/${tickettype.id}`);
  };

  const handleApprovalCancel = () => {
    setApprovalModalOpen(false);
    setTickettypeToReview(null);
  };

  const handleApprovalSubmit = async (formData) => {
    console.log("formData1223", formData);
    if (ticketTypeToReview) {
      try {
        const reviewData = {
          id: ticketTypeToReview.id,
          data: {
            approvalStatus: String(formData.approvalStatus)
              .toLowerCase()
              .trim(),
            reviewReason: String(formData.reviewReason).trim(),
          },
        };

        // Additional validation to ensure values are correct
        if (
          !["approved", "rejected"].includes(reviewData?.data?.approvalStatus)
        ) {
          toast.error("Invalid approval status");
          return;
        }
        if (!reviewData?.data?.reviewReason) {
          toast.error("Review reason is required");
          return;
        }
        const result = await dispatch(reviewTicketTypes(reviewData));
        console.log("result", result);
        if (result?.payload?.status === 200) {
          dispatch(getTicketType());

          // Show success toast based on approval status
          switch (reviewData?.data?.approvalStatus) {
            case "approved":
              toast.success("Ticket Type approved successfully!");
              break;
            case "rejected":
              toast.success("Ticket Type rejected successfully!");
              break;
            default:
              toast.success("Ticket Type reviewed successfully!");
          }
          // Reset state
          setApprovalModalOpen(false);
          setTickettypeToReview(null);
        } else {
          // Handle API error response
          const errorMessage =
            result.payload?.message ||
            result.error?.message ||
            "Failed to review Ticket type";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error reviewing Ticket Type:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to review Ticket type. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  const handleRowClick = (event, ticketTypeId) => {
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
    navigate(`/details-ticket-type/${ticketTypeId}`);
  };

  const isReviewed = (approvalStatus) => {
    return approvalStatus === "approved" || approvalStatus === "rejected";
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
                gridRoute="/ticket-type-grid"
                listRoute="/ticket-type-list-2"
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
                          width={headCell.width}
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
                    {filteredTicketTypes
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .filter((tickettype) => tickettype.deletedAt === null)
                      .map((tickettype,ind) => (
                        <BodyTableRow
                          key={tickettype.id}
                          active={
                            selectedTicketType?.id === tickettype.id ? 1 : 0
                          }
                          onClick={(e) => {
                            setSelectedTicketTypes(tickettype);
                            handleRowClick(e, tickettype.id);
                          }}
                        >
                           <BodyTableCell align="left">
                             {page * rowsPerPage + ind + 1}
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            {/* <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            > */}
                              <H6
                                fontSize={12}
                                color="text.primary"
                                style={{ textTransform: "capitalize" }}
                              >
                                {limitWords(tickettype.title,15)}
                              </H6>
                            {/* </Stack> */}
                          </BodyTableCell>
                          <BodyTableCell align="center"
                            style={{ textTransform: "capitalize" }}
                          >
                            {limitWords(tickettype.description,20)}
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            <Chip
                              label={
                                tickettype.approvalStatus
                                  ? tickettype.approvalStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                    tickettype.approvalStatus.slice(1)
                                  : "N/A"
                              }
                              color={
                                tickettype.approvalStatus === "approved"
                                  ? "success"
                                  : tickettype.approvalStatus === "pending"
                                    ? "warning"
                                    : tickettype.approvalStatus === "rejected"
                                      ? "error"
                                      : "default"
                              }
                              variant="outlined"
                              size="small"
                            />
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            <Paragraph>
                              {tickettype?.createdBy}
                            </Paragraph>
                          </BodyTableCell>  
                          <BodyTableCell align="center">
                            <Paragraph>
                              {formatDate(tickettype?.createdAt)}
                            </Paragraph>
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            <Paragraph>
                              {tickettype?.reviewedBy ?? "N/A"}
                            </Paragraph>
                          </BodyTableCell>
                          <BodyTableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReviewClick(tickettype);
                              }}
                            >
                              {isReviewed(tickettype.approvalStatus)
                                ? "Re-review"
                                : "Review"}
                            </Button>
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

                    {filteredTicketTypes.length === 0 && <TableDataNotFound />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* TABLE PAGINATION SECTION */}
            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={filteredTicketTypes.length}
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
        title="Review Ticket Types"
        onSubmit={handleApprovalSubmit}
        initialData={{
          approvalStatus: ticketTypeToReview?.approvalStatus || "",
          reviewReason: ticketTypeToReview?.reviewReason || "",
        }}
      />
    </div>
  );
}
