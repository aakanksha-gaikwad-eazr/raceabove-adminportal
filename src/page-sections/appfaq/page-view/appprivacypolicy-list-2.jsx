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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import styled from "@mui/material/styles/styled";
import { TabContext, TabList } from "@mui/lab";
// CUSTOM COMPONENTS
import { H6 } from "@/components/typography";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table";
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from "../SearchArea";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable";
// CUSTOM UTILS METHOD
import { isDark } from "@/utils/constants";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  getAppPrivacyPolicies,
  updateAppPrivacyPolicy,
  deleteAppPrivacyPolicy,
} from "@/store/apps/appprivacypolicy";
import toast from "react-hot-toast";
// COMPONENTS
import EditPrivacyPolicyFormModal from "./edit-appprivacypolicy"; // You'll need to create this
import DeleteEventModal from "@/components/delete-modal-event";
import HeadingArea from "../HeadingArea";
import { formatDate } from "@/utils/dateFormatter";
import { useNavigate } from "react-router-dom";

// STYLED COMPONENTS
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
    width: "10%",
  },
  "&:nth-of-type(5)": {
    // Status column
    width: "10%",
  },
}));

const BodyTableCell = styled(HeadTableCell)(({ theme, isDeleted }) => ({
  fontSize: 12,
  fontWeight: 400,
  backgroundColor: "transparent",
  paddingBlock: 12,
  verticalAlign: "middle",
  ...(isDeleted && {
    opacity: 0.5,
    color: theme.palette.text.disabled,
  }),
}));

const BodyTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "isDeleted",
})(({ theme, active, isDeleted }) => ({
  cursor: "pointer",
  ...(active && {
    backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  }),
  ...(isDeleted && {
    opacity: 0.7,
    backgroundColor: theme.palette.action.disabledBackground,
    "&:hover": {
      backgroundColor: theme.palette.action.disabledBackground,
    },
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
    id: "content",
    numeric: false,
    disablePadding: false,
    label: "Content",
    width: "30%",
  },
  {
    id: "createdAt",
    numeric: true,
    disablePadding: false,
    label: "Date",
    width: "15%",
  },
  {
    id: "updatedBy",
    numeric: false,
    disablePadding: false,
    label: "Updated By",
    width: "15%",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    width: "10%",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
    width: "10%",
  },
];

// MUI Skeleton Component for Table Row
const SkeletonTableRow = () => (
  <TableRow>
    {headCells.map((cell) => (
      <BodyTableCell key={cell.id} align="center">
        <Skeleton variant="text" width="80%" height={20} />
      </BodyTableCell>
    ))}
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

// Multi-line content cell component
const MultiLineContentCell = ({ content, maxLines = 2 }) => (
  <Box
    sx={{
      display: "-webkit-box",
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
      lineHeight: 1.4,
      textAlign: "left",
      px: 1,
    }}
  >
    {content || "N/A"}
  </Box>
);

export default function AppPrivacyPolicyList2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedPrivacyPolicy, setSelectedPrivacyPolicy] = useState();
  const [loadingStates, setLoadingStates] = useState({});
  const [selectTab, setSelectTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [privacyPolicyId, setPrivacyPolicyId] = useState(null);

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
  const { appprivacypolicies } = useSelector((state) => state.appprivacypolicy);

  useEffect(() => {
    const fetchPrivacyPolicies = async () => {
      setIsLoading(true);
      try {
        await dispatch(getAppPrivacyPolicies());
      } catch (error) {
        console.error("Error fetching Privacy Policies:", error);
        toast.error("Failed to load privacy policies");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    fetchPrivacyPolicies();
  }, [dispatch]);

  // Handle tab change
  const handleChangeTab = (_, newTab) => {
    setSelectTab(newTab);
    setPage(0); // Reset to first page when changing tabs
  };

  // Filter privacy policies based on tab selection and search
  const filteredPrivacyPolicies = stableSort(
    appprivacypolicies || [],
    getComparator(order, orderBy)
  ).filter((item) => {
    // First, filter out deleted items (deletedAt !== null) from all tabs
    if (item?.deletedAt !== null) {
      return false;
    }

    // Then filter by tab selection based on isActive status
    if (selectTab === "active" && !item?.isActive) {
      return false; // In "active" tab, show only isActive === true
    }
    if (selectTab === "inactive" && item?.isActive) {
      return false; // In "inactive" tab, show only isActive === false
    }
    // "all" tab shows all non-deleted items regardless of isActive status

    // Filter by search term
    if (searchFilter) {
      return item?.content?.toLowerCase().includes(searchFilter?.toLowerCase());
    }

    return true;
  });

  useEffect(() => {
    if (selectedPrivacyPolicy) {
      const updatedPrivacyPolicy = appprivacypolicies.find(
        (policy) => policy.id === selectedPrivacyPolicy.id
      );
      if (updatedPrivacyPolicy) setSelectedPrivacyPolicy(updatedPrivacyPolicy);
    } else {
      const firstNonDeleted = appprivacypolicies.find(
        (policy) => policy.deletedAt === null
      );
      setSelectedPrivacyPolicy(firstNonDeleted || appprivacypolicies[0]);
    }
  }, [appprivacypolicies]);

  // Handle status toggle
  const handleStatusToggle = async (policyId, currentStatus, isDeleted) => {
    // Prevent toggling for deleted items
    if (isDeleted) {
      toast.error("Cannot update status of deleted items");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [policyId]: true }));

    try {
      const updateData = {
        id: policyId,
        data: {
          isActive: !currentStatus,
        },
      };
      console.log("::updateData", updateData);

      const result = await dispatch(
        updateAppPrivacyPolicy(updateData)
      ).unwrap();
      console.log(":::::resilt", result);
      // Check for successful response
      if (result?.status === 200 || result?.success) {
        toast.success("Status updated successfully");

        // Force refresh the privacy policies list
        await dispatch(getAppPrivacyPolicies()).unwrap();

        // Update selected privacy policy if it's the one being toggled
        if (selectedPrivacyPolicy?.id === policyId) {
          setSelectedPrivacyPolicy((prevSelected) => ({
            ...prevSelected,
            isActive: !currentStatus,
          }));
        }
      } else {
        toast.error(result?.message || "Status update failed");
      }
    } catch (error) {
      console.error("Error updating privacy policy status:", error);
      toast.error(error?.message || "Failed to update status");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [policyId]: false }));
    }
  };

  // Modal handlers
  const handleOpenEditPage = (policy) => {
    // Prevent editing deleted items
    navigate(`/edit-appprivacy-policy/${policy.id}`);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setPrivacyPolicyId(null);
  };

  const handleOpenDeleteModal = (policy) => {
    // Prevent deleting already deleted items
    if (policy.deletedAt !== null) {
      toast.error("Item is already deleted");
      return;
    }
    setPrivacyPolicyId(policy.id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setPrivacyPolicyId(null);
  };

  const handleDelete = async () => {
    try {
      const result = await dispatch(deleteAppPrivacyPolicy(privacyPolicyId));
      if (
        result.payload?.data?.status === 200 ||
        result.meta?.requestStatus === "fulfilled"
      ) {
        toast.success("Privacy policy deleted successfully");

        // Refresh the privacy policies list
        await dispatch(getAppPrivacyPolicies()).unwrap();

        // If the deleted item was selected, clear selection or select another item
        if (selectedPrivacyPolicy?.id === privacyPolicyId) {
          const remainingPolicies = appprivacypolicies.filter(
            (policy) =>
              policy.id !== privacyPolicyId && policy.deletedAt === null
          );
          setSelectedPrivacyPolicy(remainingPolicies[0] || null);
        }
      } else {
        toast.error("Failed to delete privacy policy");
      }
    } catch (error) {
      console.error("Error deleting privacy policy:", error);
      toast.error("An error occurred while deleting the privacy policy");
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleActionClick = (e, action, policy) => {
    e.stopPropagation();
    if (action === "edit") {
      handleOpenEditPage(policy);
    } else if (action === "delete") {
      handleOpenDeleteModal(policy);
    }
  };

  // Handle row click to navigate to details page
  const handleRowClick = (event, policyId, isDeleted) => {
    // Don't navigate for deleted items
    if (isDeleted) return;

    // Check if the click originated from interactive elements
    const clickedElement = event.target;
    const isInteractiveElement =
      clickedElement.closest("button") ||
      clickedElement.closest('[role="button"]') ||
      clickedElement.closest(".MuiChip-root") ||
      clickedElement.closest(".MuiIconButton-root") ||
      clickedElement.closest(".MuiButton-root") ||
      clickedElement.closest(".MuiSwitch-root");

    if (isInteractiveElement) {
      return;
    }
    navigate(`/appprivacy-policy-details/${policyId}`);
  };

  return (
    <div className="pt-2 pb-4">
      <HeadingArea />
      <TabContext value={selectTab}>
        <TabList
          variant="scrollable"
          onChange={handleChangeTab}
          sx={{ mb: 2, px: 3 }}
        >
          <Tab label="All" value="all" />
          <Tab label="Active" value="active" />
          <Tab label="Inactive" value="inactive" />
        </TabList>

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
                    gridRoute="/privacy-policy-grid"
                    listRoute="/privacy-policy-list-2"
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
                            align="center"
                            padding={
                              headCell.disablePadding ? "none" : "normal"
                            }
                            sortDirection={
                              orderBy === headCell.id ? order : false
                            }
                            width={headCell.width}
                          >
                            {headCell.id === "actions" ||
                            headCell.id === "status" ? (
                              headCell.label
                            ) : (
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
                            )}
                          </HeadTableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    {/* TABLE BODY AND DATA */}
                    <TableBody>
                      {isLoading
                        ? Array.from({ length: rowsPerPage }).map(
                            (_, index) => (
                              <SkeletonTableRow key={`skeleton-${index}`} />
                            )
                          )
                        : filteredPrivacyPolicies
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((policy, ind) => {
                              const isDeleted = policy.deletedAt !== null;

                              return (
                                <BodyTableRow
                                  key={policy.id}
                                  active={
                                    selectedPrivacyPolicy?.id === policy.id
                                      ? 1
                                      : 0
                                  }
                                  isDeleted={isDeleted}
                                  onClick={(e) => {
                                    if (!isDeleted) {
                                      setSelectedPrivacyPolicy(policy);
                                      handleRowClick(e, policy.id, isDeleted);
                                    }
                                  }}
                                >
                                  <BodyTableCell align="center">
                                    {page * rowsPerPage + ind + 1}
                                  </BodyTableCell>

                                  <BodyTableCell
                                    align="left"
                                    isDeleted={isDeleted}
                                  >
                                    <Stack>
                                      <MultiLineContentCell
                                        content={policy.content}
                                        maxLines={2}
                                      />
                                      {isDeleted && (
                                        <Chip
                                          label="Deleted"
                                          size="small"
                                          color="error"
                                          variant="outlined"
                                          sx={{
                                            height: 20,
                                            fontSize: 11,
                                            mt: 1,
                                          }}
                                        />
                                      )}
                                    </Stack>
                                  </BodyTableCell>

                                  <BodyTableCell
                                    align="center"
                                    isDeleted={isDeleted}
                                  >
                                    {formatDate(policy.createdAt)}
                                  </BodyTableCell>

                                  <BodyTableCell
                                    align="center"
                                    isDeleted={isDeleted}
                                    style={{
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {policy.updatedBy ||
                                      policy.createdBy ||
                                      "N/A"}
                                  </BodyTableCell>

                                  {/* STATUS COLUMN */}
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
                                      {loadingStates[policy.id] ? (
                                        <CircularProgress size={20} />
                                      ) : (
                                        <Switch
                                          checked={policy?.isActive || false}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            handleStatusToggle(
                                              policy.id,
                                              policy.isActive,
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

                                  {/* ACTIONS COLUMN */}
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
                                                policy
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
                                                policy
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

                      {!isLoading && filteredPrivacyPolicies.length === 0 && (
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
                count={isLoading ? 0 : filteredPrivacyPolicies.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
        </Grid>
      </TabContext>

      <DeleteEventModal
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        title="Delete Confirmation"
        message="Are you sure you want to Delete this privacy policy?"
        actions={[
          {
            label: "Cancel",
            props: {
              onClick: handleCloseDeleteModal,
              variant: "outlined",
            },
          },
          {
            label: "Delete",
            props: { onClick: handleDelete, color: "error" },
          },
        ]}
      />
    </div>
  );
}
