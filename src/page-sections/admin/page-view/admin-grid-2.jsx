import { useEffect, useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination"; // CUSTOM COMPONENTS

import { H6, Paragraph, Small } from "@/components/typography";
import FlexBetween from "@/components/flexbox/FlexBetween"; // CUSTOM PAGE SECTION COMPONENTS

import SearchArea from "../SearchArea";
import UserDetails from "../AdminDetails"; // CUSTOM ICON COMPONENT

import MoreVertical from "@/icons/MoreVertical"; // CUSTOM UTILS METHOD

import { paginate } from "@/utils/paginate";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdmin } from "../../../store/apps/admins";

export default function AdminGrid2PageView() {
  const [userPerPage] = useState(21);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  //store
  const dispatch = useDispatch();
  const { admins } = useSelector((state) => state.admins);

  useEffect(() => {
    dispatch(getAllAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (admins?.length > 0 && !selectedItem) {
      setSelectedItem(admins[0]);
    }
  }, [admins, selectedItem]);

  const handleSelectItem = (admin) => {
    setSelectedItem(admin);
  };

  const activeItem = (id) => selectedItem?.id === id;

  const filteredAdmins = admins?.filter((item) => {
    if (searchValue) {
      return item.name?.toLowerCase().includes(searchValue.toLowerCase());
    }
    return true;
  }) || [];

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
              gridRoute="/admin-grid-2"
              listRoute="/admin-list-2"
            />

            <Grid container spacing={3}>
              {paginate(page, userPerPage, filteredAdmins).map((item, index) => (
                <Grid
                  size={{
                    lg: 4,
                    sm: 6,
                    xs: 12,
                  }}
                  key={index}
                >
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      cursor: "pointer",
                      backgroundColor: activeItem(item.id)
                        ? "primary.main"
                        : "background.paper",
                      color: activeItem(item.id) ? "white" : "text.primary",
                      "&:hover": {
                        backgroundColor: activeItem(item.id)
                          ? "primary.dark"
                          : "grey.100",
                      },
                    }}
                    onClick={() => handleSelectItem(item)}
                  >
                    <FlexBetween mx={-1} mt={-1}>
                      <IconButton>
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

                    <Stack direction="row" alignItems="center" py={2} spacing={2}>
                      <Avatar src={item?.companyLogo} sx={{ borderRadius: "20%" }} />
                      <div>
                        <Paragraph fontWeight={500}>{item.name}</Paragraph>
                        <Small color={activeItem(item.id) ? "white" : "grey.500"}>
                          {item.companyName}
                        </Small>
                      </div>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Small color={activeItem(item.id) ? "white" : "grey.500"}>
                        {item.email}
                      </Small>
                    </Stack>

                    <Stack direction="row" alignItems="center" mt={1} spacing={1}>
                      <Small color={activeItem(item.id) ? "white" : "grey.500"}>
                        Phone: {item.phoneNumber}
                      </Small>
                    </Stack>
                  </Box>
                </Grid>
              ))}

              <Grid size={12}>
                <Stack alignItems="center" marginY={2}>
                  <Pagination
                    shape="rounded"
                    count={Math.ceil(filteredAdmins.length / userPerPage)}
                    onChange={(_, newPage) => setPage(newPage)}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid
          size={{
            lg: 3,
            md: 4,
            xs: 12,
          }}
        >
          {selectedItem && <UserDetails data={selectedItem} />}
        </Grid>
      </Grid>
    </div>
  );
}
