import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createUser } from "../../../store/apps/user";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { FlexBox } from "@/components/flexbox";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import GroupSenior from "@/icons/GroupSenior";
import { Paragraph } from "@/components/typography";

// MUI-styled wrapper for the switch label and control
const SwitchWrapper = styled(Box)({
  width: "100%",
  marginTop: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export default function AddNewSportsPageView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required!"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        isActive,
      };

      try {
        const res = await dispatch(createUser(payload)).unwrap();
        if (res?.status === 201) {
          toast.success("Created successfully!");
          navigate("/user-list-2");
        } else {
          throw new Error("Failed to create.");
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Something went wrong");
      }
    },
  });

  return (
    <Box className="pt-2 pb-4">
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FlexBox alignItems="center">
              <IconWrapper>
                <GroupSenior
                  sx={{
                    color: "primary.main",
                  }}
                />
              </IconWrapper>

              <Paragraph fontSize={20} fontWeight="bold">
                Add New Sport
              </Paragraph>
            </FlexBox>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    variant="outlined"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.name &&
                      Boolean(formik.errors.name)
                    }
                    helperText={
                      formik.touched.name && formik.errors.name
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <SwitchWrapper>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Is Active
                    </Typography>
                    <Switch
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      color="primary"
                    />
                  </SwitchWrapper>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
