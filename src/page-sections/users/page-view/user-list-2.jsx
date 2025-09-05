import { useEffect, useState } from "react";
// MUI
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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
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
import toast from "react-hot-toast";
// COMPONENTS
import DeleteEventModal from "@/components/delete-modal-event";
import HeadingArea from "../HeadingArea";
import { getUsers } from "@/store/apps/user";
import { deleteUser, updateUser } from "@/store/apps/user";
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
    width: "4%",
    minWidth: 180,
  },
  "&:last-of-type": {
    paddingRight: 24,
    width: "10%",
  },
  "&:nth-of-type(8)": {
    // Status column
    width: "10%",
  },
  "&:not(:first-of-type):not(:last-of-type):not(:nth-of-type(8))": {
    width: "10.7%",
  },
}));

const BodyTableCell = styled(HeadTableCell)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 400,
  backgroundColor: "transparent",
  paddingBlock: 12,
  verticalAlign: "middle",
}));

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
    label: "Name",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "location",
    numeric: true,
    disablePadding: false,
    label: "Location",
  },
  {
    id: "gender",
    numeric: true,
    disablePadding: false,
    label: "Gender",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  // {
  //   id: "actions",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Actions",
  // },
];

export default function UserList2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState();
  const [loadingStates, setLoadingStates] = useState({});
  const [selectTab, setSelectTab] = useState("all");

  // Modal states
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userId, setUserId] = useState(null);

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
  const { users } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Handle tab change
  const handleChangeTab = (_, newTab) => {
    setSelectTab(newTab);
  };

  // Filter users based on tab selection and search
  const filteredUsers = stableSort(
    users,
    getComparator(order, orderBy)
  ).filter((item) => {
    // First, filter out deleted items (deletedAt !== null) from all tabs
    if (item?.deletedAt !== null) {
      return false;
    }

    // Then filter by tab selection based on isActive status
    if (selectTab === "active" && !item?.isActive) {
      return false;
    }
    if (selectTab === "inactive" && item?.isActive) {
      return false;
    }

    // Filter by search term
    if (searchFilter) {
      return item?.name?.toLowerCase().includes(searchFilter?.toLowerCase());
    }

    return true;
  });

  useEffect(() => {
    if (selectedUsers) {
      const updatedUser = users.find(
        (user) => user.id === selectedUsers.id
      );
      if (updatedUser) setSelectedUsers(updatedUser);
    } else {
      const firstNonDeleted = users.find((user) => user.deletedAt === null);
      setSelectedUsers(firstNonDeleted || users[0]);
    }
  }, [users, selectedUsers]);

  // Handle status toggle
  const handleStatusToggle = async (userId, currentStatus) => {
    console.log("Toggle clicked:", userId, currentStatus);
    setLoadingStates((prev) => ({ ...prev, [userId]: true }));

    try {
      const updateData = {
        id: userId,
        data: {
          isActive: !currentStatus,
        },
      };

      const result = await dispatch(updateUser(updateData));
      // console.log("result", result);

      if (
        result.payload?.data?.status === 200 ||
        result.meta?.requestStatus === "fulfilled"
      ) {
        toast.success("Status updated successfully");

        // Force refresh the users list
        await dispatch(getUsers()).unwrap();

        // Update selected user if it's the one being toggled
        if (selectedUsers?.id === userId) {
          setSelectedUsers((prevSelected) => ({
            ...prevSelected,
            isActive: !currentStatus,
          }));
        }
      } else {
        toast.error("Status update failed");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update status");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Modal handlers
  const handleOpenDeleteModal = (user) => {
    if (user.deletedAt !== null) {
      toast.error("Item is already deleted");
      return;
    }
    setUserId(user.id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUserId(null);
  };

  const handleDelete = async () => {
    try {
      console.log("Deleting user with id:", userId);
      const result = await dispatch(deleteUser(userId));
      
      if (result.meta?.requestStatus === "fulfilled") {
        toast.success("User deleted successfully");
        await dispatch(getUsers());
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      handleCloseDeleteModal();
    }
  };

  // Handle edit action
  const handleEditUser = (e, user) => {
    e.stopPropagation();
    
    if (user.deletedAt !== null) {
      toast.error("Cannot edit deleted items");
      return;
    }

    // Navigate to edit page with user data
    navigate(`/edit-user/${user.id}`, { 
      state: { user } 
    });
  };

  // Handle delete action
  const handleDeleteUser = (e, user) => {
    e.stopPropagation();
    handleOpenDeleteModal(user);
  };

  const handleNavigationDetailspge = (event, user) => {
  // Check if the click originated from a button, icon button, switch, or other interactive elements
  const clickedElement = event.target;
  const isInteractiveElement = 
    clickedElement.closest('button') ||
    clickedElement.closest('[role="button"]') ||
    clickedElement.closest('.MuiChip-root') ||
    clickedElement.closest('.MuiIconButton-root') ||
    clickedElement.closest('.MuiButton-root') ||
    clickedElement.closest('.MuiSwitch-root') ||
    clickedElement.closest('.MuiSwitch-switchBase') ||
    clickedElement.closest('[role="switch"]') ||
    clickedElement.closest('input[type="checkbox"]');
  
  if (isInteractiveElement) {
    return;
  }
  
  navigate(`/user-details/${user?.id}`);
};

  return (
    <div className="pt-2 pb-4">
      <HeadingArea />
      <TabContext value={selectTab}>
        <TabList variant="scrollable" onChange={handleChangeTab} sx={{ mb: 2, px: 3 }}>
          <Tab label="All" value="all" />
          <Tab label="Active" value="active" />
          <Tab label="Inactive" value="inactive" />
        </TabList>

        <Grid container>
          <Grid size={{ xs: 12 }}>
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
                  gridRoute="/user-grid-2"
                  listRoute="/user-list-2"
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
                            sortDirection={orderBy === headCell.id ? order : false}
                          >
                            {headCell.id === "actions" || headCell.id === "status" ? (
                              headCell.label
                            ) : (
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
                      {filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((user) => {
                          const isDeleted = user.deletedAt !== null;

                          return (
                            <BodyTableRow
                              key={user.id}
                              // active={selectedUsers?.id === user.id ? 1 : 0}
                              onClick={() => handleNavigationDetailspge(event,user)}
                            >
                              <BodyTableCell align="left">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar
                                    src={user?.profilePhoto}
                                    sx={{
                                      borderRadius: "20%",
                                      backgroundColor: "grey.100",
                                      width: 32,
                                      height: 32,
                                      ...(isDeleted && { opacity: 0.5 }),
                                    }}
                                  />
                                  <Stack>
                                    <H6
                                      fontSize={13}
                                      color={isDeleted ? "text.disabled" : "text.primary"}
                                      fontWeight={500}
                                    >
                                      {user.name ?? "N/A"}
                                    </H6>
                                    {isDeleted && (
                                      <Chip
                                        label="Deleted"
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: 11 }}
                                      />
                                    )}
                                  </Stack>
                                </Stack>
                              </BodyTableCell>

                              <BodyTableCell align="center">
                                <span style={{ color: isDeleted ? 'rgba(0,0,0,0.4)' : 'inherit' }}>
                                  {user.email ?? "No Email"}
                                </span>
                              </BodyTableCell>
                              <BodyTableCell align="center">
                                <p style={{ color: isDeleted ? 'rgba(0,0,0,0.4)' : 'inherit' }}>
                                  {user.city ?? "No Location"}
                                </p>
                                <span style={{ color: isDeleted ? 'rgba(0,0,0,0.4)' : 'inherit' }}>
                                 {user?.state}
                                </span>
                              </BodyTableCell>

                              <BodyTableCell align="center">
                                <span style={{ color: isDeleted ? 'rgba(0,0,0,0.4)' : 'inherit' }}>
                                  {user.gender 
                                    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                                    : "N/A"}
                                </span>
                              </BodyTableCell>

                              {/* STATUS COLUMN */}
                              <BodyTableCell align="center">
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="center"
                                  spacing={1}
                                >
                                  {loadingStates[user.id] ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <Switch
                                      checked={user?.isActive || false}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleStatusToggle(user.id, user?.isActive);
                                      }}
                                      size="small"
                                      color="success"
                                      disabled={isDeleted}
                                    />
                                  )}
                                </Stack>
                              </BodyTableCell>

                              {/* ACTIONS COLUMN */}
                              {/* <BodyTableCell align="center">
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <Tooltip
                                    title={isDeleted ? "Cannot edit deleted items" : "Edit"}
                                  >
                                    <span>
                                      <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={(e) => handleEditUser(e, user)}
                                        disabled={isDeleted}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </Stack>
                              </BodyTableCell> */}
                            </BodyTableRow>
                          );
                        })}

                      {filteredUsers.length === 0 && <TableDataNotFound />}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              {/* TABLE PAGINATION SECTION */}
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={filteredUsers.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
        </Grid>
      </TabContext>

      {/* <DeleteEventModal
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        title="Delete Confirmation"
        message="Are you sure you want to delete this user?"
        actions={[
          {
            label: "Cancel",
            props: { onClick: handleCloseDeleteModal, variant: "outlined" },
          },
          { 
            label: "Delete", 
            props: { onClick: handleDelete, color: "error" } 
          },
        ]}
      /> */}
    </div>
  );
}