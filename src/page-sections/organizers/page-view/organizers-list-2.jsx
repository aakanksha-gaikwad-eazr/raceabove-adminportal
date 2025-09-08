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
import styled from "@mui/material/styles/styled";
import toast from "react-hot-toast";
import { H6 } from "@/components/typography";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table";
import SearchArea from "../SearchArea";
import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable";
import { isDark } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizers } from "@/store/apps/organisers";
import HeadingArea from "../HeadingArea";
import Edit from "@/icons/Edit";
import Delete from "@/icons/Delete";
import { useNavigate } from "react-router-dom";
import { deleteOrganizer } from "@/store/apps/organisers";
import DeleteModal from "@/components/delete-modal";

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

const DisabledBodyTableRow = styled(BodyTableRow)(
  ({ theme, active, disabled }) => ({
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    backgroundColor: disabled
      ? theme.palette.action.disabledBackground
      : active
        ? theme.palette.grey[isDark(theme) ? 700 : 100]
        : "transparent",
    "&:hover": {
      backgroundColor: disabled
        ? theme.palette.action.disabledBackground
        : theme.palette.action.hover,
    },
  })
);

const DisabledBodyTableCell = styled(BodyTableCell)(({ disabled }) => ({
  color: disabled ? "rgba(0, 0, 0, 0.4)" : "inherit",
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
    label: "Commission",
  },
  {
    id: "company",
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
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Action",
  },
];

export default function OrganizersList2PageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedOrganiser, setSelectedOrganiser] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [organiserToEdit, setOrganiserToEdit] = useState(null);

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
  const navigate = useNavigate();

  const { allOrganisers } = useSelector((state) => state.organisers);
  console.log("organisers", allOrganisers);

  const filteredOrganiser = stableSort(
    allOrganisers || [],
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter)
      return item?.name?.toLowerCase().includes(searchFilter?.toLowerCase());
    else return true;
  });

  useEffect(() => {
    dispatch(getOrganizers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedOrganiser) {
      const updatedOrganisers = allOrganisers.find(
        (organiser) => organiser.id === selectedOrganiser.id
      );
      if (updatedOrganisers) setSelectedOrganiser(updatedOrganisers);
    } else {
      setSelectedOrganiser(allOrganisers[0]);
    }
  }, [allOrganisers]);

  const handleEditClick = (e, organiser) => {
    console.log("clciked", organiser);
    e.stopPropagation();
    setOrganiserToEdit(organiser);
    navigate(`/edit-organiser/${organiser.id}`);
  };

  const handleDeleteClick = (e, organiser) => {
    e.stopPropagation();
    setOrganiserToEdit(organiser);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log("organiserToEdit", organiserToEdit);
      const response = await dispatch(
        deleteOrganizer(organiserToEdit.id)
      ).unwrap();
      if (response?.status === 200) {
        dispatch(getOrganizers());
        setOpenDeleteModal(false);
        toast.success("Organiser deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting Organiser:", error);
      toast.error(error.message || "Something went wrong while deleting!");
    }
  };

  const handleEditClose = () => {
    setOpenEditModal(false);
    setOrganiserToEdit(null);
  };

  const handleDeleteClose = () => {
    setOpenDeleteModal(false);
    setOrganiserToEdit(null);
  };
  const handleNavigationtoDetailsPage = (organiser) => {
    navigate(`/organiser-details/${organiser?.id}`);
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
            {/* SEARCH BOX AREA */}
            <Box p={2}>
              <HeadingArea />
              <SearchArea
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                gridRoute="/organiser-grid-2"
                listRoute="/organiser-list-2"
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
                          padding={headCell.disablePadding ? "none" : "normal"}
                          sortDirection={
                            orderBy === headCell.id ? order : false
                          }
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
                    {filteredOrganiser
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((organiser) => {
                        const isDeleted = organiser.deletedAt !== null;

                        return (
                          <DisabledBodyTableRow
                            key={organiser.id}
                            active={
                              selectedOrganiser?.id === organiser.id ? 1 : 0
                            }
                            disabled={isDeleted}
                            onClick={() =>
                              !isDeleted &&
                              handleNavigationtoDetailsPage(organiser)
                            }
                          >
                            <DisabledBodyTableCell disabled={isDeleted}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <Avatar
                                  src={organiser?.companyLogo}
                                  sx={{
                                    borderRadius: "20%",
                                    backgroundColor: "grey.100",
                                    opacity: isDeleted ? 0.5 : 1,
                                  }}
                                />

                                <H6 fontSize={12} color="text.primary">
                                  {organiser.name ?? "N/A"}{" "}
                                  {isDeleted && "(Disabled)"}
                                </H6>
                              </Stack>
                            </DisabledBodyTableCell>
                            <DisabledBodyTableCell
                              align="center"
                              disabled={isDeleted}
                            >
                              {organiser?.commission ?? "N/A"}
                            </DisabledBodyTableCell>
                            <DisabledBodyTableCell disabled={isDeleted}>
                              {organiser?.companyName ?? "N/A"}
                            </DisabledBodyTableCell>
                            <DisabledBodyTableCell disabled={isDeleted}>
                              {organiser.email ?? "N/A"}
                            </DisabledBodyTableCell>
                            <DisabledBodyTableCell disabled={isDeleted}>
                              {organiser.phoneNumber ?? "N/A"}
                            </DisabledBodyTableCell>
                            <DisabledBodyTableCell
                              disabled={isDeleted}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Edit
                                sx={{
                                  marginRight: "15px",
                                  cursor: isDeleted ? "not-allowed" : "pointer",
                                  opacity: isDeleted ? 0.3 : 1,
                                  pointerEvents: isDeleted ? "none" : "auto",
                                }}
                                onClick={(e) =>
                                  !isDeleted && handleEditClick(e, organiser)
                                }
                              />
                              <Delete
                                sx={{
                                  cursor: isDeleted ? "not-allowed" : "pointer",
                                  opacity: isDeleted ? 0.3 : 1,
                                  pointerEvents: isDeleted ? "none" : "auto",
                                }}
                                onClick={(e) =>
                                  !isDeleted && handleDeleteClick(e, organiser)
                                }
                              />
                            </DisabledBodyTableCell>
                          </DisabledBodyTableRow>
                        );
                      })}

                    {filteredOrganiser.length === 0 && <TableDataNotFound />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* TABLE PAGINATION SECTION */}
            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={filteredOrganiser.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>

        {/* USER DETAILS INFO */}
        {/* <Grid
          size={{
            lg: 3,
            md: 4,
            xs: 12,
          }}
        >
          {selectedOrganiser && <UserDetails data={selectedOrganiser} setSelectedUser={setSelectedOrganiser} />}
        </Grid> */}

        {/* Delete Modal */}
        <DeleteModal
          open={openDeleteModal}
          handleClose={handleDeleteClose}
          title="Confirm Delete"
          message={`Are you sure you want to delete ${organiserToEdit?.name}?`}
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
      </Grid>
    </div>
  );
}
