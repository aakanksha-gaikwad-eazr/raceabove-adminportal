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
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ApprovalModal from "@/components/approval-modal";
import { Paragraph } from "@/components/typography";
import { reviewTicketTemplate } from "@/store/apps/tickettemplate";
import { getTicketTemplate } from "@/store/apps/tickettemplate";
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
    width: "8%",
  },
  {
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "Description",
    width: "10%",
  },
  {
    id: "ticketType",
    numeric: true,
    disablePadding: false,
    label: "Ticket type",
    width: "13%",
  },
  // {
  //   id: "age",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Age",
  // },
  // {
  //   id: "price",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Price",
  // },
  // {
  //   id: "quantity",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Quantity",
  // },
  {
    id: "organizer",
    numeric: false,
    disablePadding: false,
    label: "Organizer",
    width: "14%",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
    width: "10%",
  },
  {
    id: "reviewedby",
    numeric: false,
    disablePadding: false,
    label: "Reviewed By",
    width: "15%",
  },

  {
    id: "approvalStatus",
    numeric: true,
    disablePadding: false,
    label: "Approval Status",
    width: "17%",
  },

  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
    width: "5%",
  },
];

export default function TicketTemplate2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedTicketTemplate, setSelectedTicketTemplate] =
    useState();
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [ticketTemplateToReview, setTicketTemplateToReview] =
    useState(null);

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

  const { allTicketTemplate } = useSelector(
    (state) => state.tickettemplate
  );

  const filteredTicketTemplates = stableSort(
    allTicketTemplate,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.description
        ?.toLowerCase()
        .includes(searchFilter?.toLowerCase());
    else return true;
  });

  useEffect(() => {
    dispatch(getTicketTemplate());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTicketTemplate) {
      const updatedTicketTemplate = allTicketTemplate.find(
        (tickettemplate) =>
          tickettemplate.id === selectedTicketTemplate.id
      );
      if (updatedTicketTemplate)
        setSelectedTicketTemplate(updatedTicketTemplate);
    } else {
      setSelectedTicketTemplate(allTicketTemplate[0]);
    }
  }, [allTicketTemplate]);

  const handleReviewClick = (tickettemplate) => {
    navigate(`/details-ticket-template/${tickettemplate.id}`);
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
          reviewTicketTemplate(reviewData)
        );
        console.log("result", result);
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
          const errorMessage =
            result.payload?.message ||
            result.error?.message ||
            "Failed to review Ticket Template";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error reviewing Ticket Template:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to review Ticket Template Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  const handleRowClick = (event, ticketTemplateId) => {
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
    navigate(`/details-ticket-template/${ticketTemplateId}`);
  };

  const isReviewed = (approvalStatus) => {
    return (
      approvalStatus === "approved" || approvalStatus === "rejected"
    );
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
                    {filteredTicketTemplates
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .filter(
                        (tickettemplate) =>
                          tickettemplate.deletedAt === null
                      )
                      .map((tickettemplate, ind) => (
                        <BodyTableRow
                          key={tickettemplate.id}
                          active={
                            selectedTicketTemplate?.id ===
                            tickettemplate.id
                              ? 1
                              : 0
                          }
                          onClick={(e) => {
                            setSelectedTicketTemplate(tickettemplate);
                            handleRowClick(e, tickettemplate.id);
                          }}
                        >
                          <BodyTableCell>
                            {page * rowsPerPage + ind + 1}
                          </BodyTableCell>
                          <BodyTableCell
                            align="left"
                            style={{ textTransform: "capitalize" }}
                          >
                            {limitWords(
                              tickettemplate.description,
                              15
                            )}
                          </BodyTableCell>
                          <BodyTableCell
                            align="center"
                            style={{ textTransform: "capitalize" }}
                          >
                            {limitWords(
                              tickettemplate?.ticketType?.title,
                              15
                            )}
                          </BodyTableCell>
                          {/* <BodyTableCell>
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
                          </BodyTableCell> */}
                          <BodyTableCell align="center">
                            <Paragraph>
                              {tickettemplate?.createdBy ?? "N/A"}
                            </Paragraph>
                          </BodyTableCell>

                          <BodyTableCell align="center">
                            <Paragraph>
                              {formatDate(tickettemplate?.createdAt)}
                            </Paragraph>
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            <Paragraph>
                              {tickettemplate?.reviewedBy ?? "N/A"}
                            </Paragraph>
                          </BodyTableCell>
                          <BodyTableCell align="center">
                            <Chip
                              label={
                                tickettemplate.approvalStatus
                                  ? tickettemplate.approvalStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                    tickettemplate.approvalStatus.slice(
                                      1
                                    )
                                  : "N/A"
                              }
                              color={
                                tickettemplate.approvalStatus ===
                                "approved"
                                  ? "success"
                                  : tickettemplate.approvalStatus ===
                                      "pending"
                                    ? "warning"
                                    : tickettemplate.approvalStatus ===
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
                              disabled={
                                tickettemplate.approvalStatus ===
                                  "approved" ||
                                tickettemplate.approvalStatus ===
                                  "rejected"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReviewClick(tickettemplate);
                              }}
                            >
                              {isReviewed(
                                tickettemplate.approvalStatus
                              )
                                ? "Re-review"
                                : "Review"}
                            </Button>
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

                    {filteredTicketTemplates.length === 0 && (
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
          approvalStatus:
            ticketTemplateToReview?.approvalStatus || "",
          reviewReason: ticketTemplateToReview?.reviewReason || "",
        }}
      />
    </div>
  );
}
