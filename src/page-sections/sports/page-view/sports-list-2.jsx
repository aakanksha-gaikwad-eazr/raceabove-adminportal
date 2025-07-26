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
import { getSports, updateSports } from "@/store/apps/sports";
import toast from "react-hot-toast";
// COMPONENTS
import EditSportsFormModal from "../EditSportFormModal";
import DeleteEventModal from "@/components/delete-modal-event";
import HeadingArea from "../HeadingArea";
import { deleteSports } from "@/store/apps/sports";
import { limitWords } from "@/utils/wordLimiter";
import { formatDate } from "@/utils/dateFormatter";

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
    // minWidth: 180,
  },
  "&:last-of-type": {
    paddingRight: 24,
  },
}));

const BodyTableCell = styled(HeadTableCell)(({ theme, isDeleted }) => ({
  fontSize: 12,
  fontWeight: 400,
  backgroundColor: "transparent",
  paddingBlock: 12,
  verticalAlign: "middle",
  // ...(width && { width }),
  ...(isDeleted && {
    opacity: 0.6,
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
    label: "Id",
    width:"7%",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name",
    width:"10%"
  },
  {
    id: "updatedBy",
    numeric: true,
    disablePadding: false,
    label: "Updated By",
    width:"20%"
  },
  // {
  //   id: "updatedByRole",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Updated By Role",
  //   width:"20%"
  // },
  {
    id: "createdBy",
    numeric: true,
    disablePadding: false,
    label: "Organizer",
    width:"15%"
  },
  {
    id: "createdAt",
    numeric: true,
    disablePadding: false,
    label: "Date",
    width:"17%"
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    width:"10%"
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
    width:"5%"
  },
];

export default function SportsListPageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedSport, setSelectedSport] = useState();
  const [loadingStates, setLoadingStates] = useState({});
  const [selectTab, setSelectTab] = useState("active");

  // Modal states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [sportId, setSportId] = useState(null);

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
  const { sports } = useSelector((state) => state.sports);

  useEffect(() => {
    dispatch(getSports());
  }, [dispatch]);

  // Handle tab change
  const handleChangeTab = (_, newTab) => {
    setSelectTab(newTab);
    handleChangePage(null, 0); // Reset to first page when changing tabs - using the correct function
  };

  // Filter sports based on tab selection and search
  const filteredSports = stableSort(
    sports || [],
    getComparator(order, orderBy)
  ).filter((item) => {
    // Include deleted items but show them as disabled
    const isDeleted = item?.deletedAt !== null;
  
    // Filter by tab selection
    if (selectTab === "active" && (!item?.isActive || isDeleted)) {
      return false; 
    }
    if (selectTab === "inactive" && (item?.isActive || isDeleted)) {
      return false; 
    }
    if (selectTab === "deleted" && (!isDeleted)) {
      return false; 
    }
    
    // For "all" tab, show both active, inactive, and deleted items
    
    // Apply search filter
    if (searchFilter) {
      return item?.name?.toLowerCase().includes(searchFilter?.toLowerCase());
    }

    return true;
  });

  useEffect(() => {
    if (selectedSport) {
      const updatedSport = sports?.find(
        (sport) => sport.id === selectedSport.id
      );
      if (updatedSport) setSelectedSport(updatedSport);
    } else {
      // Select first available sport (including deleted ones for visibility)
      const firstSport = sports?.[0];
      if (firstSport) setSelectedSport(firstSport);
    }
  }, [sports, selectedSport]);

  const handleStatusToggle = async (sportId, currentStatus, isDeleted) => {
    if (isDeleted) {
      toast.error("Cannot update status of deleted items");
      return;
    }
      console.log("Toggle clicked - Sport ID:", sportId);
  console.log("Current isActive status:", currentStatus);
  console.log("New isActive status will be:", !currentStatus);
    setLoadingStates((prev) => ({ ...prev, [sportId]: true }));

    try {
      const updateData = {
        id: sportId,
        data: {
          isActive: !currentStatus,
        },
      };

      console.log("Dispatching update sportId with:", updateData);

      const result = await dispatch(updateSports(updateData));
      console.log("result", result);

      if (
        result.payload?.data?.status == 200 ||
        result.meta?.requestStatus === "fulfilled"
      ) {
        console.log("Sports status updated successfully");
        toast.success("Sports Status updated successfully");

        await dispatch(getSports());

        if (selectedSport?.id === sportId) {
          setSelectedSport((prevSelected) => ({
            ...prevSelected,
            isActive: !currentStatus,
          }));
        }
      } else {
        console.error("Update failed:", result);
        toast.error("Status Update failed");
      }
    } catch (error) {
      console.error("Error updating sport status:", error);
      toast.error("Failed to update status");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [sportId]: false }));
    }
  };

  const handleOpenEditModal = (sport) => {
    if (sport.deletedAt !== null) {
      toast.error("Cannot edit deleted items");
      return;
    }
    setSportId(sport.id);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSportId(null);
  };

  const handleOpenDeleteModal = (sport) => {
    if (sport.deletedAt !== null) {
      toast.error("Item is already deleted");
      return;
    }
    setSportId(sport.id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSportId(null);
  };

  const handleDelete = async () => {
  console.log("Deleting sport with id:", sportId);
  try {
    const result = await dispatch(deleteSports(sportId));
        if (result.meta?.requestStatus === 'fulfilled') {
      await dispatch(getSports());
      toast.success("Sport deleted successfully");
    } else {
      toast.error("Failed to delete sport");
    }
  } catch (error) {
    console.error("Error deleting sport:", error);
    toast.error("An error occurred while deleting");
  } finally {
    handleCloseDeleteModal();
  }
};

  const handleActionClick = (e, action, sport) => {
    e.stopPropagation();
    if (action === "edit") {
      handleOpenEditModal(sport);
    } else if (action === "delete") {
      handleOpenDeleteModal(sport);
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
          <Tab label="Deleted" value="deleted" />
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
                  gridRoute="/sports-grid-2"
                  listRoute="/sports-list-2"
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
                            width={headCell.width || 'auto'}
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
                      {filteredSports
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((sport,ind) => {
                          const isDeleted = sport.deletedAt !== null;

                          return (
                            <BodyTableRow
                              key={sport.id}
                              active={
                                selectedSport?.id === sport.id ? 1 : 0
                              }
                              isDeleted={isDeleted}
                              onClick={() => setSelectedSport(sport)}
                            >
                                <BodyTableCell align="left">
                                                                  {page * rowsPerPage + ind + 1}

                              </BodyTableCell>
                              <BodyTableCell align="center" isDeleted={isDeleted}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Avatar
                                    src={sport?.icon || sports?.iconFile}
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
                                       "text.primary"
                                      }
                                      fontWeight={500}
                                      style={{textTransform:"capitalize"}}
                                    >
                                      {limitWords(sport.name,15)}
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
                              <BodyTableCell align="center" style={{textTransform:"capitalize"}} >
                              <div>  {limitWords(sport.updatedBy,25)}</div>
                              <div>  {limitWords(sport.updatedByRole,25)}</div>
                              </BodyTableCell>
                              {/* <BodyTableCell align="center" style={{textTransform:"capitalize"}}>
                                {sport.updatedByRole ?? "N/A"}
                              </BodyTableCell> */}
                              <BodyTableCell align="center" style={{textTransform:"capitalize"}} >
                                {limitWords(sport.createdBy,25)}
                              </BodyTableCell>
                              <BodyTableCell align="center" style={{textTransform:"capitalize"}}>
                                {formatDate(sport.createdAt)}
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
                                  {loadingStates[sport.id] ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <>
                                      <Switch
                                        checked={sport?.isActive || false}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          handleStatusToggle(
                                            sport.id,
                                            sport.isActive,
                                            isDeleted
                                          );
                                        }}
                                        size="small"
                                        color="success"
                                      />
                                    </>
                                  )}
                                </Stack>
                              </BodyTableCell>

                              {/* ACTIONS COLUMN */}
                              <BodyTableCell
                                align="right"
                                // isDeleted={isDeleted}
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
                                          handleActionClick(e, "edit", sport)
                                        }
                                        // disabled={isDeleted}
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
                                            sport
                                          )
                                        }
                                        // disabled={isDeleted}
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

                      {filteredSports.length === 0 && <TableDataNotFound />}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              {/* TABLE PAGINATION SECTION */}
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={filteredSports.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>
        </Grid>
      </TabContext>

      {/* MODALS */}
      <EditSportsFormModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        sportId={{ id: sportId }}
      />

      <DeleteEventModal
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        title="Delete Confirmation"
        message="Are you sure you want to Delete this Sport?"
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