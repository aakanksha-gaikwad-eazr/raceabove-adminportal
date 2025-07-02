import { useEffect, useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination"; // CUSTOM COMPONENTS

import { FlexBetween } from "@/components/flexbox";
import { Paragraph, Small } from "@/components/typography"; // CUSTOM PAGE SECTION COMPONENTS

import SearchArea from "../SearchArea";
import HeadingArea from "../HeadingArea"; // CUSTOM ICON COMPONENTS

import Chat from "@/icons/Chat";
import Email from "@/icons/Email";
import UserBigIcon from "@/icons/UserBigIcon";
import MoreHorizontal from "@/icons/MoreHorizontal"; // CUSTOM UTILS METHOD

import { paginate } from "@/utils/paginate"; // CUSTOM DUMMY DATA
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOrganizer,
  getOrganizers,
  getSingleOrganizers,
  updateOrganizer,
} from "../../../store/apps/organisers";
import Edit from "@/icons/Edit";
import Delete from "@/icons/Delete";
import EditModal from "@/components/edit-modal/EditModal";
import DeleteModal from "@/components/delete-modal";
import toast from "react-hot-toast";

// import { USER_LIST } from '@/__fakeData__/users';
export default function OrganizersGrid1PageView() {
  const [userPerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState(null);
  const [selectedOrganizerData, setSelectedOrganizerData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [users] = useState([...USER_LIST]);
  const [userFilter, setUserFilter] = useState({
    role: "",
    search: "",
  });

  const dispatch = useDispatch();
  const { organisers } = useSelector((state) => state.organisers);

  useEffect(() => {
    dispatch(getOrganizers());
  }, [dispatch]);

  const handleChangeFilter = (key, value) => {
    setUserFilter((state) => ({ ...state, [key]: value }));
  }; // handle change for tab list

  const handleEditClick = async (id) => {
    setSelectedOrganizerId(id);
    try {
      const response = await dispatch(getSingleOrganizers(id));
      if (response.payload) {
        setSelectedOrganizerData(response.payload);
        setEditModalOpen(true);
      } else {
        toast.error("Failed to fetch single organizer data");
        
      }
    } catch (error) {
      console.log("error", error);
      toast.error("An error occurred while fetching organizer data");
    }
  };
  const handleEditCancel = () => {
    setEditModalOpen(false);
    setSelectedOrganizerId(null);
  };

  const handleEditConfirm = async (formData) => {
    if (selectedOrganizerId) {
      try {
        const updatedFields = {};

        // Loop through formData and keep only changed fields
        for (const key in formData) {
          const oldValue = selectedOrganizerData?.[key];
          const newValue = formData[key];

          // If it's a File (for file upload), consider it changed
          if (key === "companyLogo" && newValue instanceof File) {
            updatedFields["companyLogoFile"] = newValue;
          } else if (key !== "companyLogo" && oldValue !== newValue) {
            updatedFields[key] = newValue;
          }
          // Handle boolean string to real boolean
          else if (
            (key === "isActive" && String(oldValue) !== String(newValue)) ||
            (oldValue !== newValue && newValue !== undefined)
          ) {
            updatedFields[key] = newValue;
          }
        }

        // If nothing has changed
        if (Object.keys(updatedFields).length === 0) {
          toast.error("No changes to update.");
          return;
        }

        let dataToSend = updatedFields;

        // Handle file upload (companyLogo)
        const containsFile = updatedFields.companyLogoFile instanceof File;
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
          updateOrganizer({
            editId: selectedOrganizerId,
            changedData: dataToSend,
          })
        );
        console.log("???se here update Organizer", response);

        if (response.payload?.status === 200) {
          toast.success("Organizer updated successfully");
          dispatch(getOrganizers());
          setEditModalOpen(false);
          setSelectedOrganizerId(null);
          setSelectedOrganizerData(null);
        } else {
          toast.error("Failed to update Organizers");
        }
      } catch (error) {
        console.log("error", error);
        toast.error("An error occurred while updating Organizers");
      }
    }
  };

  const editFields = [
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "commission", label: "Commission" },
    { name: "phoneNumber", label: "Phone Number" },
    { name: "companyName", label: "Company Name" },
    { name: "companyLogo", label: "Company Logo", props: { type: "image" } },
  ];

  const handleDeleteClick = (organizer) => {
    setSelectedOrganizerId(organizer);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedOrganizerId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedOrganizerId) {
      const response = await dispatch(deleteOrganizer(selectedOrganizerId));
      dispatch(getOrganizers());
      setDeleteModalOpen(false);
      setSelectedOrganizerId(null);
    }
  };

  const changeTab = (_, newValue) => {
    handleChangeFilter("role", newValue);
  };

  const filteredUsers = organisers.filter((item) => {
    if (userFilter.role) return item.role.toLowerCase() === userFilter.role;
    else if (userFilter.search)
      return item.name.toLowerCase().includes(userFilter.search.toLowerCase());
    else return true;
  });

  const iconStyle = {
    color: "grey.500",
    fontSize: 18,
  };

  return (
    <div className="pt-2 pb-4">
      <Card
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <HeadingArea value={userFilter.role} changeTab={changeTab} />

        {/* <SearchArea value={userFilter.search} onChange={e => handleChangeFilter('search', e.target.value)} gridRoute="/dashboard/sports-grid" listRoute="/dashboard/user-list" /> */}

        <Grid container spacing={3}>
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            <>
              {paginate(page, userPerPage, filteredUsers).map((item) => (
                <Grid
                  size={{
                    lg: 3,
                    md: 4,
                    sm: 6,
                    xs: 12,
                  }}
                  key={item.id}
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
                      {/* <Checkbox size="small" />

                  {/* edit button */}
                      <IconButton onClick={() => handleEditClick(item.id)}>
                        <Edit sx={iconStyle} />
                      </IconButton>

                      {/* delete button */}
                      <IconButton onClick={() => handleDeleteClick(item.id)}>
                        <Delete sx={iconStyle} />
                      </IconButton>

                      {/* 
                  <IconButton>
                    <MoreHorizontal sx={iconStyle} />
                  </IconButton>  */}
                    </FlexBetween>

                    <Stack
                      direction="row"
                      alignItems="center"
                      py={2}
                      spacing={2}
                    >
                      <Avatar
                        src={item?.companyLogo}
                        sx={{
                          borderRadius: "20%",
                        }}
                      />

                      <div>
                        <Paragraph
                          fontWeight={500}
                          sx={{
                            maxWidth: 150,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                            title={item.name}
                        >
                          {item.name ?? "no name"}
                        </Paragraph>
                        <Small
                          color="grey.500"
                          sx={{
                            maxWidth: 150,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                            title={item.companyName}

                        >
                          {item.companyName ?? "no company name"}
                        </Small>
                      </div>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Email sx={iconStyle} />
                      <Small color="grey.500">{item.email ?? "no email"}</Small>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      mt={1}
                      spacing={1}
                    >
                      <UserBigIcon sx={iconStyle} />
                      <Small color="grey.500">
                        Status:{" "}
                        {item?.isActive
                          ? "Active"
                          : ("Not Active" ?? "no status")}
                      </Small>
                    </Stack>
                  </Box>
                </Grid>
              ))}

              <Grid size={12}>
                <Stack alignItems="center" py={2}>
                  <Pagination
                    shape="rounded"
                    count={Math.ceil(filteredUsers.length / userPerPage)}
                    onChange={(_, newPage) => setPage(newPage)}
                  />
                </Stack>
              </Grid>
            </>
          ) : (
            <Grid size={12}>
              <Paragraph
                fontSize={16}
                fontWeight={500}
                textAlign="center"
                color="text.secondary"
                sx={{ width: "100%", py: 5 }}
              >
                No Organizers have been added yet!
              </Paragraph>
            </Grid>
          )}
        </Grid>
      </Card>

      <DeleteModal
        open={deleteModalOpen}
        handleClose={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
        message={`Are you sure you want to delete ${selectedOrganizerId?.name}?`}
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
        initialData={selectedOrganizerData}
        editId={selectedOrganizerId}
        fields={editFields}
        title="Edit Organizer"
      />
    </div>
  );
}
