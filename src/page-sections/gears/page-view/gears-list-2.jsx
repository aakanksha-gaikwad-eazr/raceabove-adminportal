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

import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM UTILS METHOD

import { isDark } from "@/utils/constants"; // CUSTOM DUMMY DATA

import { USER_LIST } from "@/__fakeData__/users"; // STYLED COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../../store/apps/user";
// import SearchFilter from "page-sections/challenge/SearchFilter";
import SearchFilter from "../../challenge/SearchFilter";
// import SearchFilter from "page-sections/challenge/SearchFilter";
import StatusFilter from "../../challenge/StatusFilter";
import SportsDetails from "../gearsDetails";

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
];



export default function GearsList2PageView() {
  // const [users] = useState([...USER_LIST]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState();

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
  // console.log("users", users)

  const filteredUsers = stableSort(users, getComparator(order, orderBy)).filter(
    (item) => {
      if (searchFilter)
        return item?.name?.toLowerCase().includes(searchFilter?.toLowerCase());
      else return true;
    }
  );

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      const updatedUser = users.find((user) => user.id === selectedUser.id);
      if (updatedUser) setSelectedUser(updatedUser);
    }
    else {
      setSelectedUser(users[0])
    }
  }, [users]);

  return (
    <div className="pt-2 pb-4">
 
      <Grid container>
        <Grid
          size={{
            lg: 9,
            md: 8,
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
                    {filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user) => (
                        <BodyTableRow
                          key={user.id}
                          active={selectedUser?.id === user.id ? 1 : 0}
                          onClick={() => setSelectedUser(user)}
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
                          <BodyTableCell>{user.gender ?? "N/A"}</BodyTableCell>
                          <BodyTableCell>
                            {user.exerciseLevel ?? "N/A"}
                          </BodyTableCell>
                          <BodyTableCell>{user.email ?? "N/A"}</BodyTableCell>
                          <BodyTableCell>
                            {user.phoneNumber ?? "N/A"}
                          </BodyTableCell>
                        </BodyTableRow>
                      ))}

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

        {/* USER DETAILS INFO */}
        <Grid
          size={{
            lg: 3,
            md: 4,
            xs: 12,
          }}
        >
          {selectedUser && <SportsDetails data={selectedUser} />}
        </Grid>
      </Grid>
    </div>
  );
}
