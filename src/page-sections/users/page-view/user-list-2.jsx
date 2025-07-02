import { useEffect, useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
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
import UserDetails from "../UserDetails"; // CUSTOM DEFINED HOOK

import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM UTILS METHOD

import { isDark } from "@/utils/constants"; // CUSTOM DUMMY DATA

import { USER_LIST } from "@/__fakeData__/users"; // STYLED COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../../../store/apps/user";
import SearchFilter from "../../../page-sections/challenge/SearchFilter";
import StatusFilter from "../../../page-sections/challenge/StatusFilter";
import { useNavigate } from "react-router-dom";
import Eye from "@/icons/Eye";
import Edit from "@/icons/Edit";
import Delete from "@/icons/Delete";
import Modal from "@/components/modal";
import DeleteModal from "@/components/delete-modal";
import AddContactForm from "../AddContactForm";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import HeadingArea from "../HeadingArea";

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
    label: "Name",
  },
  {
    id: "position",
    numeric: true,
    disablePadding: false,
    label: "Gender",
  },
  {
    id: "company",
    numeric: true,
    disablePadding: false,
    label: "Level",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Phone",
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Action",
  },
];

export default function UserList2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

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

  const filteredUsers = stableSort(
    users,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.name
        ?.toLowerCase()
        .includes(searchFilter?.toLowerCase());
    else return true;
  });

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      const updatedUser = users.find(
        (user) => user.id === selectedUser.id
      );
      if (updatedUser) setSelectedUser(updatedUser);
    } else {
      setSelectedUser(users[0]);
    }
  }, [users]);

  const handleClickhere = (user) => {
    if (user) {
      localStorage.setItem("selectedUserId", user.id);
      setSelectedUser(user);
      navigate(`/user-details`);
    }
  };

  const handleEditClick = (e, user) => {
    e.stopPropagation();
    setUserToEdit(user);
  navigate('/edit-user', { state: { user } });
  };

  const handleDeleteClick = (e, user) => {
    e.stopPropagation();
    setUserToEdit(user);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await dispatch(
        deleteUser(userToEdit.id)
      ).unwrap();
      if (response?.status === 200) {
        dispatch(getUsers());
        setOpenDeleteModal(false);
        toast.success("User deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error.message || "Something went wrong while deleting!"
      );
    }
  };

  const handleEditClose = () => {
    setOpenEditModal(false);
    setUserToEdit(null);
  };

  const handleDeleteClose = () => {
    setOpenDeleteModal(false);
    setUserToEdit(null);
  };

  console.log(filteredUsers, "filteredUsers");

  const chipObj = {
    beginner: {
      text: "Beginner",
      color: "#1E88E5", // Blue
      background: "#E3F2FD", // Light blue background
    },
    intermediate: {
      text: "Intermediate",
      color: "#F9A825", // Amber
      background: "#FFF8E1", // Light amber background
    },
    advanced: {
      text: "Advanced",
      color: "#D32F2F", // Red
      background: "#FFEBEE", // Light red background
    },
  };

  return (
    <div className="pt-2 pb-4">
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
            <Box p={2}>
              <HeadingArea />
              <SearchArea
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                gridRoute="/user-grid-2"
                listRoute="/user-l5ist-2"
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
                    {filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user) => (
                        <BodyTableRow
                          key={user.id}
                          active={
                            selectedUser?.id === user.id ? 1 : 0
                          }
                          onClick={() => handleClickhere(user)}
                        >
                          <BodyTableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Avatar
                                src={user.profilePhoto}
                                sx={{
                                  borderRadius: "20%",
                                  backgroundColor: "grey.100",
                                }}
                              />

                              <H6 fontSize={12} color="text.primary">
                                {user.name ?? "N/A"}
                              </H6>
                            </Stack>
                          </BodyTableCell>
                          <BodyTableCell
                            sx={{ textTransform: "capitalize" }}
                          >
                            {user.gender ?? "N/A"}
                          </BodyTableCell>
                          <BodyTableCell>
                            <Chip
                              label={user.exerciseLevel ?? "N/A"}
                              size="small"
                              sx={{
                                textTransform: "uppercase",
                                color:
                                  chipObj[user.exerciseLevel]
                                    ?.color || "#000",
                                backgroundColor:
                                  chipObj[user.exerciseLevel]
                                    ?.background || "#eee",
                                fontWeight: 500,
                              }}
                            />
                          </BodyTableCell>
                          <BodyTableCell>
                            {user.email ?? "N/A"}
                          </BodyTableCell>
                          <BodyTableCell>
                            {user.phoneNumber ?? "N/A"}
                          </BodyTableCell>
                          <BodyTableCell
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Edit
                              sx={{
                                marginRight: "15px",
                                cursor: "pointer",
                              }}
                              onClick={(e) =>
                                handleEditClick(e, user)
                              }
                            />
                            <Delete
                              sx={{ cursor: "pointer" }}
                              onClick={(e) =>
                                handleDeleteClick(e, user)
                              }
                            />
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

                    {filteredUsers.length === 0 && (
                      <TableDataNotFound />
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* TABLE PAGINATION SECTION */}

            {filteredUsers.length < 0 ? (
              <CircularProgress color="black" />
            ) : (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={filteredUsers.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Edit Modal */}
      <Modal open={openEditModal} handleClose={handleEditClose}>
        <AddContactForm
          handleCancel={handleEditClose}
          data={userToEdit}
        />
      </Modal>

      {/* Delete Modal */}
      <DeleteModal
        open={openDeleteModal}
        handleClose={handleDeleteClose}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${userToEdit?.name}?`}
        actions={[
          {
            label: "Cancel",
            props: {
              onClick: handleDeleteClose,
              variant: "outlined",
            },
          },
          {
            label: "Delete",
            props: {
              onClick: handleDeleteConfirm,
              variant: "contained",
              color: "error",
            },
          },
        ]}
      />
    </div>
  );
}
