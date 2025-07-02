import { useState, useEffect } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button"; // CUSTOM COMPONENTS

import { FlexBetween } from "@/components/flexbox";
import { Paragraph, Small } from "@/components/typography"; // CUSTOM PAGE SECTION COMPONENTS

import SearchArea from "../SearchArea";
import HeadingArea from "../HeadingArea"; // CUSTOM ICON COMPONENTS

import Email from "@/icons/Email";
import Call from "@/icons/Call";
import Edit from "@/icons/Edit";
import Delete from "@/icons/Delete"; // CUSTOM UTILS METHOD

import { paginate } from "@/utils/paginate";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAdmin,
  deleteAdmin,
  updateAdmin,
  getSingleAdmin,
} from "../../../store/apps/admins";
import DeleteModal from "@/components/delete-modal/DeleteModal";
import EditModal from "@/components/edit-modal/EditModal";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

// import { USER_LIST } from '@/__fakeData__/users';

export default function AdminGrid1PageView() {
  const [userPerPage] = useState(8);
  const [page, setPage] = useState(1);
  // const [users] = useState([...USER_LIST]);
  const [userFilter, setUserFilter] = useState({
    role: "",
    search: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedAdminData, setSelectedAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const { admins, singleadmin } = useSelector(
    (state) => state.admins
  );

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        await dispatch(getAllAdmin());
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [dispatch]);

  const handleChangeFilter = (key, value) => {
    setUserFilter((state) => ({ ...state, [key]: value }));
  };

  const changeTab = (_, newValue) => {
    handleChangeFilter("role", newValue);
  };

  const handleEditClick = async (id) => {
    setSelectedAdminId(id);
    try {
      const response = await dispatch(getSingleAdmin(id));
      // console.log("response", response);
      if (response.payload) {
        setSelectedAdminData(response.payload);
        setEditModalOpen(true);
      } else {
        toast.error("Failed to fetch single admin data");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("An error occurred while fetching admin data");
    }
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
        console.log("??????data to send", dataToSend);
        const response = await dispatch(
          updateAdmin({
            editId: selectedAdminId,
            changedData: dataToSend,
          })
        );
        console.log("???se here update admin", response);

        if (response.payload?.status === 200) {
          toast.success("Admin updated successfully");
          dispatch(getAllAdmin());
          setEditModalOpen(false);
          setSelectedAdminId(null);
          setSelectedAdminData(null);
        } else {
          toast.error("Failed to update admin");
        }
      } catch (error) {
        console.log("error", error);
        toast.error("An error occurred while updating admin");
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
    if (selectedAdminId) {
      const response = await dispatch(deleteAdmin(selectedAdminId));
      dispatch(getAllAdmin());
      setDeleteModalOpen(false);
      setSelectedAdminId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedAdminId(null);
  };

  const filteredUsers = Array.isArray(admins)
    ? admins.filter((item) => {
        if (userFilter.role) {
          return (
            item.role?.toLowerCase() === userFilter.role.toLowerCase()
          );
        }
        if (userFilter.search) {
          return item.name
            ?.toLowerCase()
            .includes(userFilter.search.toLowerCase());
        }
        return true;
      })
    : [];

  // console.log("filteredUsers", filteredUsers);

  const iconStyle = {
    color: "grey.500",
    fontSize: 18,
  };

  // const editFields = [
  //   { name: "name", label: "Name" },
  //   { name: "email", label: "Email", props: { type: "email" } },
  //   { name: "phoneNumber", label: "Phone Number" },
  //   { name: "companyName", label: "Company Name" },
  //   { name: "companyLogo", label: "Company Logo", props: { type: "image" } },
  // ];

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

  return (
    <div className="pt-2 pb-4">
      <Card
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <HeadingArea
          value={userFilter.role}
          className="mb-5 mt-2"
          changeTab={changeTab}
        />

        {/* <SearchArea value={userFilter.search} onChange={e => handleChangeFilter('search', e.target.value)} gridRoute="/admin-grid-1" listRoute="/admin-grid-2" /> */}
        {loading ? (
          <Stack alignItems="center" justifyContent="center" py={10}>
            <CircularProgress color="black" />
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {Array.isArray(filteredUsers) &&
            filteredUsers.length > 0 ? (
              paginate(page, userPerPage, filteredUsers).map(
                (item) => (
                  <Grid
                    size={{
                      lg: 3,
                      md: 4,
                      sm: 6,
                      xs: 12,
                    }}
                    key={item?.id}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <FlexBetween mx={-1} mt={-1}>
                        {/* <Checkbox size="small" /> */}

                        {/* edit button */}
                        <IconButton
                          onClick={() => handleEditClick(item?.id)}
                        >
                          <Edit sx={iconStyle} />
                        </IconButton>

                        {/* delete button */}
                        <IconButton
                          onClick={() => handleDeleteClick(item?.id)}
                        >
                          <Delete sx={iconStyle} />
                        </IconButton>

                        {/* <IconButton>
                    <MoreHorizontal sx={iconStyle} />
                  </IconButton> */}
                      </FlexBetween>

                      <Stack
                        direction="row"
                        alignItems="center"
                        py={2}
                        spacing={2}
                      >
                        <Avatar
                          type="file"
                          src={item?.companyLogo}
                          sx={{
                            borderRadius: "20%",
                          }}
                        />

                        <div>
                          <Paragraph fontWeight={500}>
                            {item?.name
                              ? item?.name.charAt(0).toUpperCase() +
                                (item?.name ?? "N/A").slice(1)
                              : "N/A"}
                          </Paragraph>
                          <Small color="grey.500">
                            {item?.companyName
                              ? item?.companyName
                                  .charAt(0)
                                  .toLowerCase() +
                                (item?.companyName ?? "N/A").slice(1)
                              : "N/A"}
                          </Small>
                        </div>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <Email sx={iconStyle} />
                        <Small color="grey.500">
                          {item?.email ?? "N/A"}
                        </Small>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        mt={1}
                        spacing={1}
                      >
                        <Call sx={iconStyle} />
                        <Small color="grey.500">
                          {item.phoneNumber ?? "N/A"}
                        </Small>
                      </Stack>

                      {/* <Stack direction="row" alignItems="center" mt={1} spacing={1}>
                  <Chat sx={iconStyle} />
                  <Small color="grey.500">Posts: 12</Small>
                </Stack> */}
                    </Box>
                  </Grid>
                )
              )
            ) : (
              <Grid size={12}>
                <Paragraph
                  fontSize={16}
                  fontWeight={500}
                  textAlign="center"
                  color="text.secondary"
                  sx={{ width: "100%", my: 3 }}
                >
                  No admins have been added yet!
                </Paragraph>
              </Grid>
            )}

            <Grid size={12}>
              <Stack alignItems="center" py={2}>
                <Pagination
                  shape="rounded"
                  count={Math.ceil(
                    filteredUsers.length / userPerPage
                  )}
                  onChange={(_, newPage) => setPage(newPage)}
                />
              </Stack>
            </Grid>
          </Grid>
        )}
      </Card>

      {/* <DeleteModal
        open={deleteModalOpen}
        handleClose={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
        message={`Are you sure you want to delete ${selectedAdminId?.name}?`}
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
      /> */}

      {/* <EditModal
        open={editModalOpen}
        handleClose={handleEditCancel}
        handleConfirm={handleEditConfirm}
        editId={selectedAdminId}
        initialData={selectedAdminData}
        fields={editFields}
        title="Edit Admin"
      /> */}
    </div>
  );
}
