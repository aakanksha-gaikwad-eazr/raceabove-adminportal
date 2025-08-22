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
import UserDetails from "../AdminDetails"; // CUSTOM DEFINED HOOK

import useMuiTable, {
  getComparator,
  stableSort,
} from "@/hooks/useMuiTable"; // CUSTOM UTILS METHOD

import { isDark } from "@/utils/constants"; // CUSTOM DUMMY DATA

import { useDispatch, useSelector } from "react-redux";
import { getAllAdmin } from "@/store/apps/admins";
import HeadingArea from "../HeadingArea";
import EditModal from "@/components/edit-modal/EditModal";
import DeleteModal from "@/components/delete-modal";

import IconButton from "@mui/material/IconButton";
import Edit from "@/icons/Edit";
import Delete from "@/icons/Delete";
import { toast } from "react-hot-toast";

import {
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
} from "@/store/apps/admins";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";


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
  // {
  //   id: "position",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Commission",
  // },
  {
    id: "companyname",
    numeric: true,
    disablePadding: false,
    label: "Company Name",
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
    id: "Action",
    numeric: true,
    disablePadding: false,
    label: "Action",
  },
];

export default function AdminList2PageView() {
  const navigate = useNavigate();
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState();

  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedAdminData, setSelectedAdminData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

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

  const { admins } = useSelector((state) => state.admins);

  const iconStyle = {
    color: "grey.500",
    fontSize: 18,
  };

  const filteredAdmins = stableSort(
    admins,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.name
        ?.toLowerCase()
        .includes(searchFilter?.toLowerCase());
    else return true;
  });

  useEffect(() => {
    dispatch(getAllAdmin());
  }, [dispatch]);

  const handleEditClick = async (id) => {
    navigate(`/edit-employee/${id}`);
    setSelectedAdminId(id);

    // try {
    //   const response = await dispatch(getSingleAdmin(id));
    //   // console.log("response", response);
    //   if (response.payload) {
    //     setSelectedAdminData(response.payload);
    //     setEditModalOpen(true);
    //   } else {
    //     toast.error("Failed to fetch single admin data");
    //   }
    // } catch (error) {
    //   console.log("error", error);
    //   toast.error("An error occurred while fetching admin data");
    // }
  };

  const handleEditConfirm = async (formData) => {
    if (selectedAdminId) {
      try {
        const updatedFields = {};

        // Loop through formData and keep only changed fields
        for (const key in formData) {
          const oldValue = selectedAdminData?.[key];
          const newValue = formData[key];

          // If it's a File (for file upload), consider it changed
          if (key === "companyLogo" && newValue instanceof File) {
            updatedFields["companyLogoFile"] = newValue;
          } else if (key !== "companyLogo" && oldValue !== newValue) {
            updatedFields[key] = newValue;
          }
          // Handle boolean string to real boolean
          else if (
            (key === "isActive" &&
              String(oldValue) !== String(newValue)) ||
            (oldValue !== newValue && newValue !== undefined)
          ) {
            updatedFields[key] = newValue;
          }
        }

        // If nothing has changed
        if (Object.keys(updatedFields).length === 0) {
          toast.error("No changes to update.");
          setEditModalOpen(false);
          setSelectedAdminId(null);
          setSelectedAdminData(null);
          return;
        }

        let dataToSend = updatedFields;

        // Handle file upload (companyLogo)
        const containsFile =
          updatedFields.companyLogoFile instanceof File;
        if (containsFile) {
          const formDataToSend = new FormData();
          for (const key in updatedFields) {
            formDataToSend.append(key, updatedFields[key]);
          }

          // Handle boolean value inside FormData
          if (updatedFields.isActive !== undefined) {
            formDataToSend.set(
              "isActive",
              updatedFields.isActive === "true" ||
                updatedFields.isActive === true
            );
          }

          dataToSend = formDataToSend;
        }

        const response = await dispatch(
          updateAdmin({
            editId: selectedAdminId,
            changedData: dataToSend,
          })
        );

        if (response.payload?.status === 200) {
          toast.success("Employee updated successfully");
          dispatch(getAllAdmin());
          setEditModalOpen(false);
          setSelectedAdminId(null);
          setSelectedAdminData(null);
        } else {
          toast.error("Failed to update Employee");
        }
      } catch (error) {
        console.log("error", error);
        toast.error("An error occurred while updating Employee");
      }
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setSelectedAdminId(null);
    setSelectedAdminData(null);
  };

  const handleDeleteClick = (admin) => {
    setSelectedAdminId(admin);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    console.log("delete call");
    if (selectedAdminId) {
      await dispatch(deleteAdmin(selectedAdminId))
        .then((res) => {
          console.log(res, "res");
          if (res.payload.status == 200) {
            toast.success("Employee Deleted Succesfully");
          }
        })
        .catch((err) => {
          toast.message(err.message);
        });

      dispatch(getAllAdmin());
      setDeleteModalOpen(false);
      setSelectedAdminId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedAdminId(null);
  };

  const generateId = (name) =>
    `${name}_${Math.floor(Math.random() * 1000000)}`;

  const editFields = [
    { name: "name", label: "Name" },
    { name: "email", label: "Email", props: { type: "email" } },
    {
      name: "phoneNumber",
      label: "Phone Number",
      props: { type: "tel" },
    },
    { name: "companyName", label: "Company Name" },
    {
      name: "companyLogo",
      label: "Company Logo",
      props: { type: "image" },
    },
  ].map((field) => ({
    ...field,
    id: generateId(field.name),
  }));

  useEffect(() => {
    if (selectedAdmin) {
      const updatedUser = admins.find(
        (admins) => admins.id === selectedAdmin.id
      );
      if (updatedUser) setSelectedAdmin(updatedUser);
    } else {
      setSelectedAdmin(admins[0]);
    }
  }, [admins]);

  return (
    <div className="pt-2 pb-4">
           {/* SEARCH BOX AREA */}
            <Box px={3}>
              <HeadingArea />
             
            </Box>
      <Card sx={{ py: 2 }}>
        <Grid container>
          <Grid
            size={{
              xs: 12,
            }}
          >
        <SearchArea
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                gridRoute="/employee-grid-2"
                listRoute="/employee-list-2"
              />

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
                    {filteredAdmins
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((admin) => (
                        <BodyTableRow
                          key={admin.id}
                          active={
                            selectedAdmin?.id === admin.id ? 1 : 0
                          }
                          onClick={() => setSelectedAdmin(admin)}
                        >
                          <BodyTableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Avatar
                                src={admin?.companyLogo}
                                sx={{
                                  borderRadius: "20%",
                                  backgroundColor: "grey.100",
                                }}
                              />

                              <H6 fontSize={12} color="text.primary">
                                {admin.name ?? "N/A"}
                              </H6>
                            </Stack>
                          </BodyTableCell>
                          {/* <BodyTableCell>
                            {admin.commission ?? "N/A"}
                          </BodyTableCell> */}
                          <BodyTableCell>
                            {admin.companyName ?? "N/A"}
                          </BodyTableCell>
                          <BodyTableCell>
                            {admin.email ?? "N/A"}
                          </BodyTableCell>
                          <BodyTableCell>
                            {admin.phoneNumber ?? "N/A"}
                          </BodyTableCell>
                          <BodyTableCell>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() =>
                                handleEditClick(admin?.id)
                              }
                            >
                              <Edit  />
                            </IconButton>

                            {/* delete button */}
                            <IconButton
                            color="error"
                              size="small"
                              onClick={() =>
                                handleDeleteClick(admin?.id)
                              }
                            >
                              <DeleteIcon  />

                            </IconButton>
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

                    {filteredAdmins.length === 0 && (
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
              count={filteredAdmins.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Card>

      <DeleteModal
        open={deleteModalOpen}
        handleClose={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
        message={`Are you sure you want to delete ${selectedAdmin?.name || "N/A"}?`}
        actions={[
          {
            label: "Cancel",
            props: { onClick: handleDeleteCancel },
          },
          {
            label: "Delete",
            props: { onClick: handleDeleteConfirm, color: "error" },
          },
        ]}
      />

      <EditModal
        open={editModalOpen}
        handleClose={handleEditCancel}
        handleConfirm={handleEditConfirm}
        editId={selectedAdminId}
        initialData={selectedAdminData}
        fields={editFields}
        title="Edit Employee"
      />
    </div>
  );
}
