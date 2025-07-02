import { useEffect, useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination"; // CUSTOM COMPONENTS

import { H6, Paragraph } from "@/components/typography";
import FlexBetween from "@/components/flexbox/FlexBetween"; // CUSTOM PAGE SECTION COMPONENTS

import SearchArea from "../SearchArea";
import UserDetails from "../UserDetails"; // CUSTOM ICON COMPONENT

import MoreVertical from "@/icons/MoreVertical"; // CUSTOM UTILS METHOD

import { paginate } from "@/utils/paginate"; // CUSTOM DUMMY DATA

// import { USER_LIST } from "@/__fakeData__/users";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../../store/apps/user/index";

export default function CouponsGrid2PageView() {
  const [userPerPage] = useState(21);
  const [page, setPage] = useState(1);
  // const [users] = useState([...USER_LIST]);
  const [searchValue, setSearchValue] = useState("");
  
  console.log(searchValue, "search");

  //store
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  console.log("store", store);

  const { users } = useSelector((state) => state.user);
  console.log("users", users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const [selectedItem, setSelectedItem] = useState(
    users.length > 0 ? users[0] : null
  ); // handle select

  const handleSelectItem = (id) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      setSelectedItem(user);
    }
  };

  const activeItem = (id) => selectedItem?.id === id;

  const filteredUsers = users.filter((item) =>
    item?.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  console.log("selectedItem:::", selectedItem);
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
              px: 3,
              height: "100%",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <SearchArea
              // value={searchValue}
              // onChange={(e) => setSearchValue(e.target.value)}
              gridRoute="/sports-grid-2"
              listRoute="/user-list-2"
            />

            <Grid container spacing={3}>
              {paginate(page, userPerPage, filteredUsers).map(
                (item, index) => (
                  <Grid
                    size={{
                      lg: 4,
                      sm: 6,
                      xs: 12,
                    }}
                    key={index}
                  >
                    <Box
                      onClick={() => handleSelectItem(index)}
                      sx={{
                        padding: 2,
                        height: "100%",
                        borderRadius: 2,
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "all 0.4s",
                        backgroundColor: activeItem(item.id)
                          ? "primary.main"
                          : "transparent",
                      }}
                    >
                      <FlexBetween height="100%">
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                        >
                          <Avatar
                            src={item?.profilePhoto}
                            sx={{
                              borderRadius: "20%",
                            }}
                          />

                          <div>
                            <H6
                              fontSize={14}
                              color={
                                activeItem(item.id)
                                  ? "white"
                                  : "text.primary"
                              }
                            >
                              {item.name ?? "UserName"}
                            </H6>

                            <Paragraph
                              color={
                                activeItem(item.id)
                                  ? "white"
                                  : "text.secondary"
                              }
                            >
                              {item.exerciseLevel ?? "N/A"}
                            </Paragraph>
                          </div>
                        </Stack>

                        <IconButton
                          disableRipple
                          sx={{
                            padding: 0,
                          }}
                        >
                          <MoreVertical
                            fontSize="small"
                            sx={{
                              color: activeItem(item.id)
                                ? "white"
                                : "text.secondary",
                            }}
                          />
                        </IconButton>
                      </FlexBetween>
                    </Box>
                  </Grid>
                )
              )}

              <Grid size={12}>
                <Stack alignItems="center" marginY={2}>
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
          </Card>
        </Grid>

        {/* <Grid
          size={{
            lg: 3,
            md: 4,
            xs: 12,
          }}
        >
          <UserDetails data={selectedItem} />
        </Grid> */}
      </Grid>
    </div>
  );
}
