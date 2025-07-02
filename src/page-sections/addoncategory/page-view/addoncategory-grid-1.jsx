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
import HeadingAreaCoupon from "../HeadingAreaCoupon"; // CUSTOM ICON COMPONENTS
import { paginate } from "@/utils/paginate"; // CUSTOM DUMMY DATA
import { useDispatch, useSelector } from "react-redux";
import { getCoupons } from "../../../store/apps/coupons";
import { Description } from "@mui/icons-material";
import ExpiryIcon from "@/icons/Expiryicon";
import { getAddOnsCategory } from "@/store/apps/addonscategory";
import MoreAddoncategoryButtontwo from "@/components/more-addoncategory-button-two";

export default function AddoncategoryGrid1PageView() {
  const dispatch = useDispatch();
  const {addOnsCategory} = useSelector((state) => state.addonscategory);
  console.log("addOnsCategory", addOnsCategory)

  const [addoncategories, setAddoncategories] = useState([]);
  const [userPerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [userFilter, setUserFilter] = useState({
    search: "",
  });

  useEffect(() => {
    dispatch(getAddOnsCategory());
  }, []);
  useEffect(() => {
    setAddoncategories(addOnsCategory)
  }, [addOnsCategory]);

  const filteredUsers = addoncategories.filter((item) => {
    if (userFilter.search)
      return item.code.toLowerCase().includes(userFilter.search.toLowerCase());
    else return true;
  });

  useEffect(() => {
    const totalPages = Math.ceil(filteredUsers.length / userPerPage);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [filteredUsers.length, page, userPerPage]);

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
        <HeadingAreaCoupon value={userFilter.role} />

        {/* <SearchArea
          value={userFilter.search}
          onChange={(e) => handleChangeFilter("search", e.target.value)}
          gridRoute="/dashboard/sports-grid"
          listRoute="/dashboard/user-list"
        /> */}

        <Grid container spacing={3}>
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            paginate(page, userPerPage, filteredUsers).map((item, index) => (
              <Grid
                size={{
                  lg: 3,
                  md: 4,
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
                  }}
                >
                  <FlexBetween
                    sx={{ justifyContent: "flex-end" }}
                    mx={-1}
                    mt={-1}
                  >
                    <MoreAddoncategoryButtontwo addoncategoriesId={item?.id} />
                  </FlexBetween>

                  <Stack direction="row" alignItems="center" py={2} spacing={2}>


                    <div>
                      <Paragraph fontWeight={500}>{item.name ?? "N/A"}</Paragraph>
                    </div>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: '90px' }}> 
                    <Small color="grey.500"
                    //  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}
                     >
                      {item.description ?? "N/A"}</Small>
                  </Stack>

                </Box>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Paragraph
                fontSize={16}
                fontWeight={500}
                textAlign="center"
                color="text.secondary"
                sx={{ width: "100%", my: 3 }}
              >
                No Product Categories have been added yet!
              </Paragraph>
            </Grid>
          )}

          <Grid size={12}>
            <Stack alignItems="center" py={2}>
              <Pagination
                shape="rounded"
                count={Math.ceil(filteredUsers.length / userPerPage)}
                onChange={(_, newPage) => setPage(newPage)}
              />
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
