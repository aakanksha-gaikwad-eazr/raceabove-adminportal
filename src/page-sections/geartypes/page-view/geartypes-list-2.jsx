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
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable";
// CUSTOM UTILS METHOD
import { isDark } from "@/utils/constants";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import { getGearTypes, updateGearTypes } from "@/store/apps/geartypes";
import toast from "react-hot-toast";
// COMPONENTS
import EditGearTypesFormModal from "../EditgeartypesFormModal";
import DeleteEventModal from "@/components/delete-modal-event";
import HeadingArea from "../HeadingArea";

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
    width: "15%",
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
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "position",
    numeric: true,
    disablePadding: false,
    label: "Created By",
  },
  {
    id: "company",
    numeric: true,
    disablePadding: false,
    label: "Created By Role",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Updated By",
  },
  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Updated By Role",
  },
  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Deleted By",
  },
  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Deleted By Role",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
];

export default function GearTypesList2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedGeartype, setSelectedGeartype] = useState();
  const [loadingStates, setLoadingStates] = useState({});
  const [selectTab, setSelectTab] = useState("all");

  // Modal states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [gearTypesId, setGearTypesId] = useState(null);

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
  const { gearTypes } = useSelector((state) => state.geartypes);
  console.log("gearTypes", gearTypes);

  useEffect(() => {
    dispatch(getGearTypes());
  }, [dispatch]);

  // Handle tab change
  const handleChangeTab = (_, newTab) => {
    setSelectTab(newTab);
    setPage(0); // Reset to first page when changing tabs
  };

  // Filter gear types based on tab selection and search
  const filteredGearTypes = stableSort(
    gearTypes,
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
      return item?.name?.toLowerCase().includes(searchFilter?.toLowerCase());
    }

    return true;
  });

  useEffect(() => {
    if (selectedGeartype) {
      const updatedGeartype = gearTypes.find(
        (geartype) => geartype.id === selectedGeartype.id
      );
      if (updatedGeartype) setSelectedGeartype(updatedGeartype);
    } else {
      // Only select non-deleted items by default
      const firstNonDeleted = gearTypes.find((gear) => gear.deletedAt === null);
      setSelectedGeartype(firstNonDeleted || gearTypes[0]);
    }
  }, [gearTypes]);

  // Fixed handleStatusToggle function
  const handleStatusToggle = async (gearTypeId, currentStatus, isDeleted) => {
    // Prevent toggling for deleted items
    if (isDeleted) {
      toast.error("Cannot update status of deleted items");
      return;
    }

    console.log("Toggle clicked:", gearTypeId, currentStatus);
    setLoadingStates((prev) => ({ ...prev, [gearTypeId]: true }));

    try {
      const updateData = {
        id: gearTypeId,
        data: {
          isActive: !currentStatus,
        },
      };

      console.log("Dispatching updateGearTypes with:", updateData);

      const result = await dispatch(updateGearTypes(updateData));
      console.log("result", result);

      if (
        result.payload?.data?.status == 200 ||
        result.meta?.requestStatus === "fulfilled"
      ) {
        console.log("Gear type status updated successfully");
        toast.success("Status updated successfully");

        // Force refresh the gear types list
        await dispatch(getGearTypes()).unwrap();

        // Update selected gear type if it's the one being toggled
        if (selectedGeartype?.id === gearTypeId) {
          setSelectedGeartype((prevSelected) => ({
            ...prevSelected,
            isActive: !currentStatus,
          }));
        }
      } else {
        toast.error("Status Update failed");
      }
    } catch (error) {
      console.error("Error updating gear type status:", error);
      toast.error("Failed to update status");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [gearTypeId]: false }));
    }
  };

  // Modal handlers
  const handleOpenEditModal = (geartype) => {
    // Prevent editing deleted items
    if (geartype.deletedAt !== null) {
      toast.error("Cannot edit deleted items");
      return;
    }
    setGearTypesId(geartype.id);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setGearTypesId(null);
  };

  const handleOpenDeleteModal = (geartype) => {
    // Prevent deleting already deleted items
    if (geartype.deletedAt !== null) {
      toast.error("Item is already deleted");
      return;
    }
    setGearTypesId(geartype.id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setGearTypesId(null);
  };

  const handleDelete = () => {
    console.log("Deleting gear type with id:", gearTypesId);
    // dispatch(deleteGearType(gearTypesId));
    handleCloseDeleteModal();
  };

  const handleActionClick = (e, action, geartype) => {
    e.stopPropagation();
    if (action === "edit") {
      handleOpenEditModal(geartype);
    } else if (action === "delete") {
      handleOpenDeleteModal(geartype);
    }
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
                              headCell.disablePadding ? "none" : "normal"
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
                      {filteredGearTypes
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((geartype) => {
                          const isDeleted = geartype.deletedAt !== null;

                          return (
                            <BodyTableRow
                              key={geartype.id}
                              active={
                                selectedGeartype?.id === geartype.id ? 1 : 0
                              }
                              isDeleted={isDeleted}
                              onClick={() =>
                                !isDeleted && setSelectedGeartype(geartype)
                              }
                            >
                              <BodyTableCell align="left" isDeleted={isDeleted}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Avatar
                                    src={geartype?.icon}
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
                                      color={
                                        isDeleted
                                          ? "text.disabled"
                                          : "text.primary"
                                      }
                                      fontWeight={500}
                                    >
                                      {geartype.name ?? "N/A"}
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
                              <BodyTableCell align="left" isDeleted={isDeleted}>
                                {geartype.createdBy ?? "N/A"}
                              </BodyTableCell>
                              <BodyTableCell align="left" isDeleted={isDeleted}>
                                {geartype.createdByRole ?? "N/A"}
                              </BodyTableCell>
                              <BodyTableCell align="left" isDeleted={isDeleted}>
                                {geartype.updatedBy ?? "N/A"}
                              </BodyTableCell>
                              <BodyTableCell align="left" isDeleted={isDeleted}>
                                {geartype.updatedByRole ?? "N/A"}
                              </BodyTableCell>
                              <BodyTableCell align="left" isDeleted={isDeleted}>
                                {geartype.deletedBy ?? "N/A"}
                              </BodyTableCell>
                              <BodyTableCell align="left" isDeleted={isDeleted}>
                                {geartype.deletedByRole ?? "N/A"}
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
                                  {loadingStates[geartype.id] ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <>
                                      <Switch
                                        checked={geartype?.isActive || false}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          handleStatusToggle(
                                            geartype.id,
                                            geartype.isActive,
                                            isDeleted
                                          );
                                        }}
                                        size="small"
                                        color="success"
                                        disabled={isDeleted}
                                      />
                                      {!isDeleted && (
                                        <Chip
                                          label={
                                            geartype?.isActive
                                              ? "Active"
                                              : "Inactive"
                                          }
                                          size="small"
                                          color={
                                            geartype?.isActive
                                              ? "success"
                                              : "default"
                                          }
                                          variant="outlined"
                                        />
                                      )}
                                    </>
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
                                          handleActionClick(e, "edit", geartype)
                                        }
                                        disabled={isDeleted}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                  <Tooltip
                                    title={
                                      isDeleted ? "Already deleted" : "Delete"
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
                                            geartype
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

                      {filteredGearTypes.length === 0 && <TableDataNotFound />}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              {/* TABLE PAGINATION SECTION */}
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={filteredGearTypes.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
        </Grid>
      </TabContext>

      {/* MODALS */}
      <EditGearTypesFormModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        data={{ id: gearTypesId }}
      />

      <DeleteEventModal
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        title="Delete Confirmation"
        message="Are you sure you want to Delete this gear type?"
        actions={[
          {
            label: "Cancel",
            props: { onClick: handleCloseDeleteModal, variant: "outlined" },
          },
          { label: "Delete", props: { onClick: handleDelete, color: "error" } },
        ]}
      />
    </div>
  );
}