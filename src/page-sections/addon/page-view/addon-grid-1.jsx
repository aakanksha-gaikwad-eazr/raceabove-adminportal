import { useEffect, useState } from "react"; // MUI

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel"; // CUSTOM COMPONENTS
import { FlexBetween } from "@/components/flexbox";
import { Paragraph, Small } from "@/components/typography"; // CUSTOM PAGE SECTION COMPONENTS
import HeadingAreaCoupon from "../HeadingArea"; // CUSTOM ICON COMPONENTS
import { paginate } from "@/utils/paginate"; // CUSTOM DUMMY DATA
import { useDispatch, useSelector } from "react-redux";
import { getCoupons } from "../../../store/apps/coupons";
import { Description } from "@mui/icons-material";
import ExpiryIcon from "@/icons/Expiryicon";
import { getAddOnsCategory } from "@/store/apps/addonscategory";
import MoreAddoncategoryButtontwo from "@/components/more-addoncategory-button-two";
import SearchArea from "../SearchArea";
import { Chip } from "@mui/material";
import toast from "react-hot-toast";
import HeadingArea from "../HeadingArea";


export default function AddonGrid1PageView() {
  const dispatch = useDispatch();
  const {addOns}  = useSelector((state) => state.addons);
  console.log("addOns", addOns);

  const [addon, setAddon] = useState([]);
  const [addonPerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [addonFilter, setAddonFilter] = useState({
    search: "",
  });

    const addOnsArray = Array.isArray(addOns) ? addOns : [];

  useEffect(() => {
    dispatch(getAddOns());
  }, []);
  useEffect(() => {
    setAddon(addOnsArray);
  }, [addOnsArray]);

  const filteredAddon = addOnsArray.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const totalPages = Math.ceil(filteredAddon.length / addonPerPage);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [filteredAddon.length, page, addonPerPage]);

    const handleIsActiveToggle =async(event, addonId, currentStatus) => {
      console.log("clicked");
          event.stopPropagation();
          try {
            const updateData = {
              isActive: !currentStatus,
            };
            toast.success(
              `Product Status ${!currentStatus ? "activated" : "deactivated"} successfully`
            );
            dispatch(getAddOns());
          } catch (error) {
            toast.error("Failed to update Product status");
            console.error("Error updating Product:", error);
          }
    };

  const iconStyle = {
    color: "grey.500",
    fontSize: 18,
  };
  return (
    <Box className="pt-2 pb-4">
      <HeadingArea value={addonFilter.role} />
      <Card
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <SearchArea
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          gridRoute="/addoncategory-grid"
          listRoute="/addoncategory-list-2"
        />

        <Grid container spacing={3}>
          {Array.isArray(filteredAddon) &&
          filteredAddon.length > 0 ? (
            paginate(page, addonPerPage, filteredAddon).map(
              (item, index) => (
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
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "0.3s",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      backgroundColor: "background.paper",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      opacity: item.isActive ? 1 : 0.7,
                      "&:hover": {
                        boxShadow: 6,
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <FlexBetween
                      sx={{ justifyContent: "space-between" }}
                      mb={2}
                    >
                      {/* Status Chips */}
                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          label={item.approvalStatus}
                          color={
                            item.approvalStatus === "approved"
                              ? "success"
                              : item.approvalStatus === "pending"
                                ? "warning"
                                : "error"
                          }
                          variant="outlined"
                        />
                      </Stack>
                      <MoreAddoncategoryButtontwo
                        addoncategoriesId={item?.id}
                      />
                    </FlexBetween>

                    <Stack spacing={2} flex={1}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box>
                          <Paragraph fontWeight={700} fontSize={16} noWrap>
                            {item.name ?? "N/A"}
                          </Paragraph>
                        </Box>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ minHeight: "90px" }}
                    >
                      <Small
                        color="grey.500"
                        //  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}
                      >
                        {item.description ?? "N/A"}
                      </Small>
                    </Stack>

                    {/* IsActive Toggle Button */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      // sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
                    >
                      <Small color="text.secondary">
                        Status:
                      </Small>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={item.isActive}
                            color="primary"
                            size="small"
                            onChange={(e) =>handleIsActiveToggle(e,item.id,item.isActive)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        // label={
                        //   <Small color={item.isActive ? "success.main" : "text.secondary"}>
                        //     {item.isActive ? "Active" : "Inactive"}
                        //   </Small>
                        // }
                        labelPlacement="start"
                        sx={{ m: 0 }}
                      />
                    </Stack>
                  </Box>
                </Grid>
              )
            )
          ) : (
            <Grid size={12}>
              <Paragraph
                fontSize={16}
                fontWeight={500}
                textAlign="center"
                color="text.secondary"
                sx={{ width: "100%", my: 3 }}
              >
                No Product have been added yet!
              </Paragraph>
            </Grid>
          )}

          <Grid size={12}>
            <Stack alignItems="center" py={2}>
              <Pagination
                shape="rounded"
                count={Math.ceil(filteredAddon.length / addonPerPage)}
                onChange={(_, newPage) => setPage(newPage)}
              />
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}