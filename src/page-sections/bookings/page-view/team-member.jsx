// Multi-step Events Form using Formik & MUI
import { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  Stack,
  MenuItem,
  Checkbox,
  Select,
  TextField,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import Dropzone from "@/components/dropzone";
import { useDispatch, useSelector } from "react-redux";
import { createEvents, getEvents } from "../../../store/apps/events";
import { getCoupons } from "../../../store/apps/coupons";
import MapPickerModal from "@/components/mapPickerModal/MapPickerModal.jsx";
import { useNavigate } from "react-router-dom";
("./team-member-style.css");
const steps = [
  {
    title: "Basic Event Info",
    subtitle: "Provide the event name, price, and general settings",
  },
  {
    title: "Schedule",
    subtitle: "Set the event date and timings",
  },
  {
    title: "Location Info",
    subtitle: "Enter the address and choose the map location",
  },
  {
    title: "Event Details",
    subtitle: "Define participation, obstacles, and difficulty level",
  },
  {
    title: "Time Slots",
    subtitle: "Add one or more time slots for the event",
  },
  {
    title: "Coupons",
    subtitle: "Attach any applicable discount coupons",
  },
  {
    title: "FAQ & Terms",
    subtitle: "Add frequently asked questions and terms & conditions",
  },
];

const validationSchemas = [
  Yup.object({
    title: Yup.string().required("Required"),
    date: Yup.string().required("Required"),
    startTime: Yup.string().required("Required"),
    endTime: Yup.string().required("Required"),
    price: Yup.number().required("Required"),
    coinsDiscountPercentage: Yup.number().required("Required"),
    enduranceLevel: Yup.string().required("Required"),
    participation: Yup.string().required("Required"),
  }),
  Yup.object({
    location: Yup.object({
      address: Yup.string().required("Required"),
      coordinate: Yup.object({
        coordinates: Yup.array()
          .of(Yup.string())
          .min(2, "Coordinates required"),
      }),
    }),
  }),
  Yup.object({
    description: Yup.string().required("Required"),
    faq: Yup.string().required("Required"),
    tnc: Yup.string().required("Required"),
  }),
  Yup.object({
    bannerFile: Yup.mixed().required("Required"),
    slots: Yup.array().of(
      Yup.object({
        startTime: Yup.string().required("Required"),
        endTime: Yup.string().required("Required"),
        capacity: Yup.number().required("Required"),
      })
    ),
  }),
  Yup.object({
    coupons: Yup.array().of(Yup.string()),
  }),
];

export default function TeamMemberPageView({ open, handleClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coupons } = useSelector((state) => state.coupons);
  const [activeStep, setActiveStep] = useState(0);
  const [openMap, setOpenMap] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [state, setState] = useState({
    password: "",
    password2: "",
    showPassword: false,
    showPassword2: false,
  });

  useEffect(() => {
    dispatch(getCoupons());
  }, []);

  const handleMapSelect = ([lat, lng]) => {
    // setLatitude(lat.toFixed(6));
    // setLongitude(lng.toFixed(6));
    formik.setFieldValue("location.coordinate.coordinates[1]", lat.toFixed(6));
    formik.setFieldValue("location.coordinate.coordinates[0]", lng.toFixed(6));
    setOpenMap(false);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      faq: "",
      tnc: "",
      date: "",
      startTime: "",
      endTime: "",
      price: "",
      coinsDiscountPercentage: 0,
      participation: "",
      obstacles: "",
      enduranceLevel: "",
      rewardCoinsInterval: "",
      coupons: [],
      location: {
        address: "",
        coordinate: {
          type: "Point",
          coordinates: ["", ""],
        },
      },
      slots: [{ startTime: "", endTime: "", capacity: 0 }],
      bannerFile: null,
    },
    // validationSchema: validationSchemas[activeStep],
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
        return;
      }

      const formData = new FormData();
      formData.append("location[address]", values.location.address);
      formData.append(
        "location[coordinate][type]",
        values.location.coordinate.type
      );
      formData.append(
        "location[coordinate][coordinates][0]",
        values.location.coordinate.coordinates[0]
      );
      formData.append(
        "location[coordinate][coordinates][1]",
        values.location.coordinate.coordinates[1]
      );

      Object.entries(values).forEach(([key, value]) => {
        if (key === "location") return;
        if (key === "slots") {
          value.forEach((slot, i) => {
            formData.append(`slots[${i}][startTime]`, slot.startTime);
            formData.append(`slots[${i}][endTime]`, slot.endTime);
            formData.append(`slots[${i}][capacity]`, slot.capacity);
          });
        } else if (key === "coupons") {
          value.forEach((c, i) => formData.append(`coupons[${i}]`, c));
        } else if (key === "bannerFile") {
          if (value) formData.append("bannerFile", value);
        } else {
          formData.append(key, value);
        }
      });

      try {
        const res = await dispatch(createEvents(formData));
        console.log("formData", formData);
        if (res?.payload?.status === 201) {
          console.log("res", res);
          toast.success("Event created successfully");
          // handleClose();
          navigate("/events/version-3");
          await dispatch(getEvents());
        } else {
          toast.error("Failed to create event");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
    },
  });

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleNext = () => formik.handleSubmit();

  const handleConfirmLocation = (position) => {
    formik.setFieldValue("location.coordinate.coordinates[1]", position.lat);
    formik.setFieldValue("location.coordinate.coordinates[0]", position.lng);
    setOpenMap(false);
  };

  const renderStep = () => {
    const { values, handleChange, errors, touched, setFieldValue } = formik;

    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2}>
            {/* title */}
            <TextField
              label="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />

            {/* description */}
            {/* <Typography>Description</Typography> */}
            <ReactQuill
              className="custom-quill"
              value={values.description}
              onChange={(val) => setFieldValue("description", val)}
              placeholder="write some description about the event here..."
            />

            {/* banner */}
            <Dropzone
              onDrop={(files) => setFieldValue("bannerFile", files[0])}
            />

            {/* price */}
            <TextField
              name="price"
              label="Price"
              value={values.price}
              onChange={handleChange}
            />

            {/* coinsDiscountPercentage */}
            <TextField
              name="coinsDiscountPercentage"
              label="Coins Discount Percentage"
              value={values.coinsDiscountPercentage}
              onChange={handleChange}
            />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={2}>
            {/* date */}
            <DatePicker
              value={values.date ? new Date(values.date) : null}
              placeholder="MM/DD/YYYY"
              onChange={(date) =>
                date && setFieldValue("date", date.toISOString().split("T")[0])
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.date,
                  helperText: errors.date,
                },
              }}
            />

            {/* start Date */}
            <TextField
              name="startTime"
              label="Start Time"
              value={values.startTime}
              onChange={handleChange}
              placeholder="00:00:00"
            />

            {/* end time */}
            <TextField
              name="endTime"
              label="End Time"
              value={values.endTime}
              onChange={handleChange}
              placeholder="00:00:00"
            />
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={2}>
            {/* location */}
            <TextField
              label="Address"
              name="location.address"
              value={values.location.address}
              onChange={handleChange}
            />
            {/* location */}

            <Stack direction="row" spacing={2}>
              <TextField
                label="Latitude"
                value={values.location.coordinate.coordinates[1]}
                onChange={(e) =>
                  setFieldValue(
                    "location.coordinate.coordinates[1]",
                    e.target.value
                  )
                }
              />
              <TextField
                label="Longitude"
                value={values.location.coordinate.coordinates[0]}
                onChange={(e) =>
                  setFieldValue(
                    "location.coordinate.coordinates[0]",
                    e.target.value
                  )
                }
              />
              {/* <Button onClick={() => setOpenMap(true)}>Pick on Map</Button> */}
               <Tooltip title="Fetch latitude and longitude from map" arrow>
      <Button onClick={() => setOpenMap(true)}>Pick on Map</Button>
    </Tooltip>
            </Stack>

            <MapPickerModal
              open={openMap}
              onClose={() => setOpenMap(false)}
              onSelect={handleMapSelect}
              // initialLatLng={[latitude || 19.076, longitude || 72.8777]}
              initialLatLng={[
                Number(formik.values.location.coordinate.coordinates[1]) ||
                  19.076,
                Number(formik.values.location.coordinate.coordinates[0]) ||
                  72.8777,
              ]}
            />
          </Stack>
        );
      case 3:
        return (
          <Stack spacing={2}>
            {/* participation */}
            <TextField
              name="participation"
              label="Participation"
              value={values.participation}
              onChange={handleChange}
            />

            {/* enduranceLevel */}
            <TextField
              name="enduranceLevel"
              label="Endurance"
              value={values.enduranceLevel}
              onChange={handleChange}
            />

            {/* obstacles */}
            <TextField
              name="obstacles"
              label="Obstacles"
              value={values.obstacles}
              onChange={handleChange}
            />
          </Stack>
        );
      case 4:
        return (
          <Stack spacing={2}>
            {values.slots.map((slot, idx) => (
              <Stack direction="row" spacing={2} key={idx}>
                <TextField
                  label="Start Time"
                  value={slot.startTime}
                  onChange={(e) =>
                    setFieldValue(`slots[${idx}].startTime`, e.target.value)
                  }
                />
                <TextField
                  label="End Time"
                  value={slot.endTime}
                  onChange={(e) =>
                    setFieldValue(`slots[${idx}].endTime`, e.target.value)
                  }
                />
                <TextField
                  label="Capacity"
                  value={slot.capacity}
                  onChange={(e) =>
                    setFieldValue(`slots[${idx}].capacity`, e.target.value)
                  }
                />
              </Stack>
            ))}
          </Stack>
        );
      case 5:
        return (
          <Stack spacing={2}>
            <Select
              multiple
              fullWidth
              value={values.coupons}
              onChange={(e) => setFieldValue("coupons", e.target.value)}
              renderValue={(selected) =>
                selected
                  .map((id) => coupons.find((c) => c.id === id)?.code)
                  .join(", ")
              }
            >
              {coupons.map((coupon) => (
                <MenuItem key={coupon.id} value={coupon.id}>
                  <Checkbox checked={values.coupons.includes(coupon.id)} />
                  <ListItemText
                    primary={`${coupon.code} (${coupon.description})`}
                  />
                </MenuItem>
              ))}
            </Select>
          </Stack>
        );
      case 6:
        return (
          <Stack spacing={2}>
            <Typography>FAQ</Typography>
            <ReactQuill
              value={values.faq}
              onChange={(val) => setFieldValue("faq", val)}
            />
            <Typography>TnC</Typography>
            <ReactQuill
              value={values.tnc}
              onChange={(val) => setFieldValue("tnc", val)}
            />

            {/* <Select
              multiple
              fullWidth
              value={values.coupons}
              onChange={(e) => setFieldValue("coupons", e.target.value)}
              renderValue={(selected) =>
                selected
                  .map((id) => coupons.find((c) => c.id === id)?.code)
                  .join(", ")
              }
            >
              {coupons.map((coupon) => (
                <MenuItem key={coupon.id} value={coupon.id}>
                  <Checkbox checked={values.coupons.includes(coupon.id)} />
                  <ListItemText
                    primary={`${coupon.code} (${coupon.description})`}
                  />
                </MenuItem>
              ))}
            </Select> */}
          </Stack>
        );

        return (
          <Stack spacing={2}>
            <Select
              multiple
              fullWidth
              value={values.coupons}
              onChange={(e) => setFieldValue("coupons", e.target.value)}
              renderValue={(selected) =>
                selected
                  .map((id) => coupons.find((c) => c.id === id)?.code)
                  .join(", ")
              }
            >
              {coupons.map((coupon) => (
                <MenuItem key={coupon.id} value={coupon.id}>
                  <Checkbox checked={values.coupons.includes(coupon.id)} />
                  <ListItemText
                    primary={`${coupon.code} (${coupon.description})`}
                  />
                </MenuItem>
              ))}
            </Select>
          </Stack>
        );
        return (
          <Stack spacing={2}>
            <Select
              multiple
              fullWidth
              value={values.coupons}
              onChange={(e) => setFieldValue("coupons", e.target.value)}
              renderValue={(selected) =>
                selected
                  .map((id) => coupons.find((c) => c.id === id)?.code)
                  .join(", ")
              }
            >
              {coupons.map((coupon) => (
                <MenuItem key={coupon.id} value={coupon.id}>
                  <Checkbox checked={values.coupons.includes(coupon.id)} />
                  <ListItemText
                    primary={`${coupon.code} (${coupon.description})`}
                  />
                </MenuItem>
              ))}
            </Select>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-2 pb-4">
      <Box p={4}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((item) => (
            <Step key={item}>
              {/* <StepLabel>{item.label}</StepLabel> */}
              <StepLabel>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {item.subtitle}
                  </Typography>
                </Stack>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={formik.handleSubmit}>
          <Box mt={4}>{renderStep()}</Box>

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" type="submit">
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
}
