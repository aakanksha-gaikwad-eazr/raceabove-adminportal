import { useEffect, useState } from "react"; // MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Pagination from "@mui/material/Pagination"; // CUSTOM COMPONENTS
import { H6, Paragraph } from "@/components/typography";
import FlexBetween from "@/components/flexbox/FlexBetween"; // CUSTOM PAGE SECTION COMPONENTS
import SearchArea from "../SearchArea";
import { paginate } from "@/utils/paginate"; // CUSTOM DUMMY DATA
import { useDispatch, useSelector } from "react-redux";
import { getSports } from "../../../store/apps/sports";
import MoreSportsButton from "@/components/more-sports-button/MoreSportsButtontwo";
import HeadingArea from "../HeadingArea";

export default function sportsGrid2PageView() {
  const [userPerPage] = useState(21);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  //store
  const dispatch = useDispatch();
  const { sports } = useSelector((state) => state.sports);

  useEffect(() => {
    dispatch(getSports());
  }, [dispatch]);

  const [selectedItem, setSelectedItem] = useState(
    // sports.length > 0 ? sports[0] : null
    Array.isArray(sports) && sports.length > 0 ? sports[0] : null
  ); // handle select

  const handleSelectItem = (id) => {
    const user = sports.find((user) => user.id === id);
    if (user) {
      setSelectedItem(user);
    }
  };

  const activeItem = (id) => selectedItem?.id === id;

  const filteredUsers = Array.isArray(sports)
    ? sports.filter((item) =>
        searchValue
          ? item.name
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          : true
      )
    : [];

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
              p: 2,
              height: "100%",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <HeadingArea />
            <SearchArea
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              gridRoute="/sports-grid-2"
              listRoute="/sports-list-2"
            />
            <Grid container spacing={3}>
              {filteredUsers.length > 0 ? (
                paginate(page, userPerPage, filteredUsers).map(
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
                              src={item?.icon}
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
                                {item?.name
                                  ? item.name
                                      .charAt(0)
                                      .toUpperCase() +
                                    item.name.slice(1)
                                  : "SportsName"}
                              </H6>

                              {/* <Paragraph
                            color={
                              activeItem(item.id) ? "white" : "text.secondary"
                            }
                          >
                            {item.exerciseLevel ?? "N/A"}
                          </Paragraph> */}
                            </div>
                          </Stack>

                          {/* <IconButton
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
                      </IconButton> */}

                          <MoreSportsButton sportsId={item?.id} />
                        </FlexBetween>
                      </Box>
                    </Grid>
                  )
                )
              ) : (
                <Grid size={12}>
                  <Paragraph align="center" mt={2}>
                    No sports have been added yet!
                  </Paragraph>
                </Grid>
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

        {/* side drawer of the card */}
        {/* <Grid
          size={{
            lg: 3,
            md: 4,
            xs: 12,
          }}
        >
          <SportsDetails data={selectedItem} />
        </Grid> */}
      </Grid>
    </div>
  );
}
