import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // MUI

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import styled from "@mui/material/styles/styled"; // CUSTOM COMPONENTS

import PopoverLayout from "./PopoverLayout";
import FlexBox from "@/components/flexbox/FlexBox";
import AvatarLoading from "@/components/avatar-loading";
import { H6, Paragraph, Small } from "@/components/typography"; // CUSTOM DEFINED HOOK

import useAuth from "@/hooks/useAuth"; // CUSTOM UTILS METHOD
import { useDispatch } from "react-redux";
import { getSingleOrganizers } from "@/store/apps/organisers";
import { getSingleAdmin } from "@/store/apps/admins";

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  marginLeft: 8,
  borderRadius: 30,

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));
const StyledSmall = styled(Paragraph)(({ theme }) => ({
  fontSize: 13,
  display: "block",
  cursor: "pointer",
  padding: "5px 1rem",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));
export default function ProfilePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [adminDetails, setAdminDetails] = useState([]);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const HandleSetData = () => {
    const adminData = JSON.parse(localStorage.getItem("raceabove"));
    if (adminData && adminData?.id) {
      setAdminId(adminData?.id);
    } else {
      console.warn("admin ID not found in localStorage");
    }
  };

  useEffect(() => {
    HandleSetData();
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!adminId) return;

    const response = dispatch(getSingleAdmin(adminId));
    response
      .then((res) => {
        setAdminDetails(res?.payload);
      })
      .catch((err) => console.log(err));
  }, [dispatch, adminId]);

  const handleMenuItem = (path) => () => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Fragment>
      <StyledButtonBase ref={anchorRef} onClick={() => setOpen(true)}>
        <AvatarLoading
          alt="user"
          percentage={60}
          src={adminDetails?.companyLogo}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </StyledButtonBase>

      <PopoverLayout
        hiddenViewButton
        maxWidth={230}
        minWidth={200}
        popoverOpen={open}
        anchorRef={anchorRef}
        popoverClose={() => setOpen(false)}
        title={
          <FlexBox alignItems="center" gap={1}>
            <Avatar
              src={adminDetails?.companyLogo}
              sx={{
                width: 35,
                height: 35,
              }}
            />

            <div>
              <H6 fontSize={14}>{adminDetails?.name || "N/A"}</H6>
              {/* <Small color="text.secondary" display="block">
                {adminDetails?.email}
              </Small> */}
              <Small color="text.secondary" display="block">
                {adminDetails?.companyName || "N/A"}
              </Small>
            </div>
          </FlexBox>
        }
      >
        <Box pt={1}>
          {/* <StyledSmall onClick={handleMenuItem("/profile")}>
            Set Status
          </StyledSmall>

          <StyledSmall onClick={handleMenuItem("/profile")}>
            Profile & Account
          </StyledSmall>

          <StyledSmall onClick={handleMenuItem("/account")}>
            Settings
          </StyledSmall>

          <StyledSmall onClick={handleMenuItem("/profile")}>
            Manage Team
          </StyledSmall> */}

          {/* <Divider
            sx={{
              my: 1,
            }}
          /> */}

          <StyledSmall onClick={logout}>Sign Out</StyledSmall>
        </Box>
      </PopoverLayout>
    </Fragment>
  );
}
