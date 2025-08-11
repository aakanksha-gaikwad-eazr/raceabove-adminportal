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
import DeleteIcon from "@mui/icons-material/Delete";
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
import useMuiTable, {
  getComparator,
  stableSort,
} from "@/hooks/useMuiTable";
// CUSTOM UTILS METHOD
import { isDark } from "@/utils/constants";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import HeadingArea from "../HeadingArea";
import { getUsers } from "@/store/apps/user";
import { deleteUser, updateUser } from "@/store/apps/user";
import { useNavigate } from "react-router-dom";
import { getemployee } from "@/store/apps/employee";
import { Typography } from "@mui/material";
import { updateEmployee } from "@/store/apps/employee";

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

  ...(active && {
    backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  }),
}));

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "Sr No",
    width: "3%",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name",
    width: "5%",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email",
    width: "8%",
  },
  {
    id: "companyName",
    numeric: true,
    disablePadding: false,
    label: "Company Name",
    width: "65%",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    width: "6%",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
    width: "6%",
  },
];

export default function EmployeeList2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState([]);

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
  const { employee } = useSelector((state) => state.employee);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getemployee());
    dispatch(getUsers());
  }, [dispatch]);

  // Handle tab change
  const handleChangeTab = (_, newTab) => {
    setSelectTab(newTab);
  };

  // Filter users based on tab selection and search
  const filteredEmployee = stableSort(
    employee,
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
      return item?.name
        ?.toLowerCase()
        .includes(searchFilter?.toLowerCase());
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
      const firstNonDeleted = users.find(
        (user) => user.deletedAt === null
      );
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

      const result = await dispatch(updateEmployee(updateData));
      // console.log("result", result);

      if (
        result.payload?.data?.status === 200 ||
        result.meta?.requestStatus === "fulfilled"
      ) {
        toast.success("Status updated successfully");

        // Force refresh the users list
        await dispatch(getemployee()).unwrap();

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
  const handleEditEmployee = (e, employee) => {
    e.stopPropagation();

    if (employee.deletedAt !== null) {
      toast.error("Cannot edit deleted items");
      return;
    }

    // Navigate to edit page with employee data
    navigate(`/edit-employee/${employee.id}`, {
      state: { employee },
    });
  };

  // Handle delete action
  const handleDeleteUser = (e, user) => {
    e.stopPropagation();
    handleOpenDeleteModal(user);
  };
  const handleNavigationDetailspge = (user) => {
    navigate(`/user-details/${user?.id}`);
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
                            padding={
                              headCell.disablePadding
                                ? "none"
                                : "normal"
                            }
                            sortDirection={
                              orderBy === headCell.id ? order : false
                            }
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
                                  orderBy === headCell.id
                                    ? order
                                    : "asc"
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
                      {filteredEmployee
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((employee, ind) => {
                          const isDeleted =
                            employee.deletedAt !== null;

                          return (
                            <BodyTableRow
                              key={employee.id}
                              // active={selectedemployees?.id === employee.id ? 1 : 0}
                            >
                              <BodyTableCell align="center">
                                <Typography variant="caption">
                                  {page * rowsPerPage + ind + 1}
                                </Typography>
                              </BodyTableCell>
                              <BodyTableCell align="center">
                                <H6
                                  fontSize={13}
                                  color={
                                    isDeleted
                                      ? "text.disabled"
                                      : "text.primary"
                                  }
                                  style={{ cursor: "pointer" }}
                                  fontWeight={500}
                                  onClick={() =>
                                    handleNavigationDetailspge(
                                      employee
                                    )
                                  }
                                >
                                  {employee.name ?? "N/A"}
                                </H6>
                                {isDeleted && (
                                  <Chip
                                    label="Deleted"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    sx={{
                                      height: 20,
                                      fontSize: 11,
                                    }}
                                  />
                                )}
                              </BodyTableCell>

                              <BodyTableCell align="center">
                                <span
                                  style={{
                                    color: isDeleted
                                      ? "rgba(0,0,0,0.4)"
                                      : "inherit",
                                  }}
                                >
                                  {employee.email ?? "No Email"}
                                </span>
                              </BodyTableCell>

                              <BodyTableCell align="center">
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Avatar
                                    src={employee?.companyLogo}
                                    sx={{
                                      borderRadius: "20%",
                                      borderColor: "grey.200",
                                      objectFit: "fill",
                                      width: 40,
                                      height: 25,
                                      ...(isDeleted && {
                                        opacity: 0.5,
                                      }),
                                    }}
                                  />

                                  <span
                                    style={{
                                      color: isDeleted
                                        ? "rgba(0,0,0,0.4)"
                                        : "inherit",
                                      fontSize: "12px",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {employee?.companyName ?? "N/A"}
                                  </span>
                                </Stack>
                              </BodyTableCell>

                              <BodyTableCell align="center">
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="center"
                                  spacing={1}
                                >
                                  {loadingStates[employee.id] ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <Switch
                                      checked={
                                        employee?.isActive || false
                                      }
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleStatusToggle(
                                          employee.id,
                                          employee?.isActive
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
                              <BodyTableCell align="center">
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
                                          handleEditEmployee(
                                            e,
                                            employee
                                          )
                                        }
                                        disabled={isDeleted}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </Stack>
                              </BodyTableCell>
                            </BodyTableRow>
                          );
                        })}

                      {filteredEmployee.length === 0 && (
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
                count={filteredEmployee.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
        </Grid>
      </TabContext>

 
    </div>
  );
}
