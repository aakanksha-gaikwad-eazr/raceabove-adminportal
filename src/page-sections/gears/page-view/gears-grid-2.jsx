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
import MoreVertical from "@/icons/MoreVertical"; // CUSTOM UTILS METHOD
import { paginate } from "@/utils/paginate"; // CUSTOM DUMMY DATA
import { useDispatch, useSelector } from "react-redux";
import SportsDetails from "../gearsDetails";
import MoreGearTypesButton from "@/components/more-geartypes-button/MoreGearTypesButtontwo";
import { getGears } from "../../../store/apps/gears";


export default function GearsGrid2PageView() {
  const [userPerPage] = useState(21);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  //store
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  console.log("store", store);

  const { gears } = useSelector((state) => state.gears);
  console.log("gears", gears);

  useEffect(() => {
    dispatch(getGears())
  }, [dispatch])

  const [selectedItem, setSelectedItem] = useState(
    gears.length > 0 ? gears[0] : null
  ); // handle select

  const handleSelectItem = (id) => {
    const gearsview = gears.find((user) => user.id === id);
    if (gearsview) {
      setSelectedItem(gearsview);
    }

  };

  const activeItem = (id) => selectedItem?.id === id;

  const filteredGears = gears.filter((item) => {
    if (searchValue)
      return item.name.toLowerCase().includes(searchValue.toLowerCase());
    else return true;
  });

  console.log("selectedItem:::",selectedItem)
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              gridRoute="/geartype-grid-2"

              listRoute="/geartype-list-2"
            />

            <Grid container spacing={3}>
              {paginate(page, userPerPage, filteredGears).map((item, index) => (
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
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          src={item?.photo}
                          sx={{
                            borderRadius: "20%",
                          }}
                        />

                        <div>
                          <H6
                            fontSize={14}
                            color={
                              activeItem(item.id) ? "white" : "text.primary"
                            }
                          >
                            {item?.brand ?? "Gears Name"}
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

                      <MoreGearTypesButton gearTypesId={item?.id}/>
                    </FlexBetween>
                  </Box>
                </Grid>
              ))}

              <Grid size={12}>
                <Stack alignItems="center" marginY={2}>
                  <Pagination
                    shape="rounded"
                    count={Math.ceil(filteredGears.length / userPerPage)}
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
