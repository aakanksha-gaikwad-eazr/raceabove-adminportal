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
import HeadingArea from "../HeadingArea";
import toast from "react-hot-toast";
import { Button, Chip, Typography, Skeleton, Switch, Tooltip, IconButton } from "@mui/material";
import ApprovalModal from "@/components/approval-modal";
import { Paragraph } from "@/components/typography";
import { getAppTnc } from "@/store/apps/apptnc";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const HeadTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 600,
  paddingBlock: 14,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  borderBottom: `1px solid ${theme.palette.grey[isDark(theme) ? 700 : 100]}`,
  textAlign: "center",
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
  textAlign: "center",
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

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "Sr No",
    width: "8%",
    align: "center",
  },
  {
    id: "content",
    numeric: false,
    disablePadding: false,
    label: "Content",
    width: "15%",
    align: "center",
  },

  {
    id: "admin",
    numeric: false,
    disablePadding: false,
    label: "Admin",
    width: "15%",
    align: "center",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
    width: "12%",
    align: "center",
  },

  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    width: "18%",
    align: "center",
  },

  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
    width: "10%",
    align: "center",
  },
];

// MUI Skeleton Component for Table Row
const SkeletonTableRow = () => (
  <TableRow>
    <BodyTableCell align="center">
      <Skeleton variant="text" width={32} height={32} />
    </BodyTableCell>
    <BodyTableCell align="center">
      <Skeleton variant="text" width="80%" height={20} />
    </BodyTableCell>
    <BodyTableCell align="center">
      <Skeleton variant="rounded" width={80} height={28} />
    </BodyTableCell>
    <BodyTableCell align="center">
      <Skeleton variant="text" width={100} height={20} />
    </BodyTableCell>
    <BodyTableCell align="center">
      <Skeleton variant="text" width={80} height={20} />
    </BodyTableCell>
    <BodyTableCell align="center">
      <Skeleton variant="text" width={80} height={20} />
    </BodyTableCell>
    <BodyTableCell align="center">
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

// Date formatter function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Format: Dec 25, 2024
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    return "Invalid Date";
  }
};

export default function AppTnc2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedTnc, setSelectedTnc] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  

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

  const { allAppTnc } = useSelector((state) => state.apptnc);
  // console.log("allAppTnc", allAppTnc);

  const filteredTnc = stableSort(
    allAppTnc,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.content?.toLowerCase().includes(searchFilter?.toLowerCase());
    else return true;
  });

  useEffect(() => {
    const fetchTnc = async () => {
      setIsLoading(true);
      try {
        await dispatch(getAppTnc());
      } catch (error) {
        console.error("Error fetching Terms and Conditions:", error);
      } finally {
        // Add minimum loading time for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    fetchTnc();
  }, [dispatch]);

  useEffect(() => {
    if (selectedTnc) {
      const updatedTnc = allAppTnc.find((tnc) => tnc.id === selectedTnc.id);
      if (updatedTnc) setSelectedTnc(updatedTnc);
    } else {
      setSelectedTnc(allAppTnc[0]);
    }
  }, [allAppTnc]);

  // Multi-line with CSS line clamping
  const MultiLineContentCell = ({ content, maxLines = 1 }) => (
    <Box
      sx={{
        display: "-webkit-box",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100%",
        lineHeight: 1.4,
        cursor: "pointer",
        textTransform: "capitalize",
        textAlign: "left",
        px: 1,
      }}
      // title={content}
    >
      {content || "N/A"}
    </Box>
  );


    const handleActionClick = (e, action, tnc) => {
    e.stopPropagation();
    if (action === "edit") {
      handleOpenEditPage(tnc);
    } else if (action === "delete") {
      handleOpenDeleteModal(tnc);
    }
  };

   const handleOpenEditPage = (tnc) => {
    navigate(`/edit-apptnc/${tnc.id}`);
  };


  const handleRowClick = (event, tncId) => {
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
    navigate(`/apptnc-details/${tncId}`);
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
              borderRadius: "10px",
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
                  gridRoute="/tnc-grid"
                  listRoute="/tnc-list-2"
                />
              </Box>
            )}

            {/* TABLE HEAD & BODY ROWS */}
            <TableContainer
              sx={{
                overflowX: { xs: "auto", md: "unset" },
              }}
            >
              <Scrollbar autoHide={false}>
                <Table sx={{ tableLayout: "fixed", minWidth: 800 }}>
                  {/* TABLE HEADER */}
                  <TableHead>
                    <TableRow>
                      {headCells.map((headCell) => (
                        <HeadTableCell
                          key={headCell.id}
                          align={headCell.align || "center"}
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
                    {isLoading
                      ? // Show skeleton rows while loading
                        Array.from({ length: rowsPerPage }).map((_, index) => (
                          <SkeletonTableRow key={`skeleton-${index}`} />
                        ))
                      : filteredTnc
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((tnc, ind) => {
                            const isDeleted = tnc.deletedAt !== null;
                            return (
                              <BodyTableRow
                                key={tnc.id}
                                active={selectedTnc?.id === tnc.id ? 1 : 0}
                                onClick={(e) => {
                                  setSelectedTnc(tnc);
                                  handleRowClick(e, tnc.id);
                                }}
                                sx={{
                                  opacity: tnc.deletedAt ? 0.6 : 1,
                                }}
                              >
                                <BodyTableCell align="center">
                                  <Typography variant="caption">
                                    {page * rowsPerPage + ind + 1}
                                  </Typography>
                                </BodyTableCell>

                                <BodyTableCell align="center">
                                  <MultiLineContentCell
                                    content={tnc.content}
                                    maxLines={1}
                                  />
                                </BodyTableCell>

                                <BodyTableCell align="center">
                                  <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 400 }}
                                  >
                                    {tnc?.createdBy || "N/A"}
                                  </Typography>
                                </BodyTableCell>

                                <BodyTableCell align="center">
                                  <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 400 }}
                                  >
                                    {formatDate(tnc?.createdAt)}
                                  </Typography>
                                </BodyTableCell>

                                <BodyTableCell
                                  align="center"
                                  isDeleted={isDeleted}
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    spacing={1}
                                  >
                                    {loadingStates[tnc.id] ? (
                                      <CircularProgress size={20} />
                                    ) : (
                                      <Switch
                                        checked={tnc?.isActive || false}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          handleStatusToggle(
                                            tnc.id,
                                            tnc.isActive,
                                            isDeleted
                                          );
                                        }}
                                        size="small"
                                        color="success"
                                        disabled={isDeleted}
                                      />
                                    )}
                                  </Stack>
                                </BodyTableCell>

                                       <BodyTableCell
                                    align="center"
                                    isDeleted={isDeleted}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      justifyContent="center"
                                    >
                                      <Tooltip
                                        title={
                                          isDeleted
                                            ? "Cannot edit deleted items"
                                            : "Edit"
                                        }
                                      >
                                        <span>
                                          <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={(e) =>
                                              handleActionClick(
                                                e,
                                                "edit",
                                                tnc
                                              )
                                            }
                                            disabled={isDeleted}
                                          >
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                        </span>
                                      </Tooltip>
                                      <Tooltip
                                        title={
                                          isDeleted
                                            ? "Already deleted"
                                            : "Delete"
                                        }
                                      >
                                        <span>
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) =>
                                              handleActionClick(
                                                e,
                                                "delete",
                                                tnc
                                              )
                                            }
                                            disabled={isDeleted}
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </IconButton>
                                        </span>
                                      </Tooltip>
                                    </Stack>
                                  </BodyTableCell>
                              </BodyTableRow>
                            );
                          })}

                    {!isLoading && filteredTnc.length === 0 && (
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
              count={isLoading ? 0 : filteredTnc.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
