import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createChallenges,
  getChallenges,
  getChallengesById,
} from "../../../store/apps/challenges";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import styled from "@mui/material/styles/styled";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Modal from "@/components/modal";
import Dropzone from "@/components/dropzone";
import { getSports } from "../../../store/apps/sports";
import { Box, Chip, ListItemText } from "@mui/material";
import toast from "react-hot-toast";
import { createEvents, getEvents } from "../../../store/apps/events";
import { getCoupons } from "../../../store/apps/coupons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import MapPicker from "@/components/Mappicker/Mappicker";

const StyledAppModal = styled(Modal)(({ theme }) => ({
  "& .add-btn": {
    border: `1px solid ${theme.palette.divider}`,
  },
  "& .label": {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
    display: "block",
  },
  "& .btn-group": {
    gap: "1rem",
    display: "flex",
    paddingTop: "1.5rem",
  },
}));

// ==============================================================
export default function EventsForm({ open, handleClose }) {
  const [date, setDate] = useState(new Date());

  const [openMap, setOpenMap] = useState(false);

  const handleConfirmLocation = (position) => {
    setFieldValue("location.coordinate.coordinates[1]", position.lat);
    setFieldValue("location.coordinate.coordinates[0]", position.lng);
    setOpenMap(false);
  };

  const dispatch = useDispatch();

  const initialValues = {
    title: "",
    description: "",
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
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.string().required("Date is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    price: Yup.number().required("Price is required"),
    coinsDiscountPercentage: Yup.number().required(
      "Coins Discount Percentage is required"
    ),
    participation: Yup.string().required("Participation is required"),
    obstacles: Yup.string().required("Obstacles is required"),
    enduranceLevel: Yup.string().required("Endurance Level is required"),
    bannerFile: Yup.mixed().required("Banner File is required"),
    location: Yup.object().shape({
      address: Yup.string().required("Location address is required"),
      coordinate: Yup.object().shape({
        type: Yup.string(),
        coordinates: Yup.array().of(Yup.string()),
      }),
    }),
    slots: Yup.array().of(
      Yup.object().shape({
        startTime: Yup.string().required("Start Time is required"),
        endTime: Yup.string().required("End Time is required"),
        capacity: Yup.number().required("Capacity is required"),
      })
    ),
    coupons: Yup.array().of(
      Yup.string().uuid("Each coupon must be a valid UUID")
    ),
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    touched,
  } = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: async (values) => {
      console.log("Submitting values:", values);
      const formData = new FormData();

      // // Handle location data first
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
        if (key === "location") {
          return;
        } else if (key === "slots") {
          value
            .filter((slot) => slot.startTime && slot.endTime && slot.capacity)
            .forEach((slot, i) => {
              formData.append(`slots[${i}][startTime]`, slot.startTime);
              formData.append(`slots[${i}][endTime]`, slot.endTime);
              formData.append(`slots[${i}][capacity]`, slot.capacity);
            });
        } else if (key === "coupons") {
          console.log("values>>>", values);
          value
            .filter((c) => !!c)
            .forEach((coupon, i) => formData.append(`coupons[${i}]`, coupon));
        } else if (key === "bannerFile") {
          if (value) {
            formData.append("bannerFile", value);
          }
        } else {
          formData.append(key, value);
        }
      });

      try {
        const res = await dispatch(createEvents(formData));
        console.log("res>>>", res);
        if (res?.payload?.status === 201) {
          toast.success("Event created successfully");
          handleClose();
          dispatch(getEvents());
        } else {
          toast.error("Failed to create event");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error occurred while creating event");
      }
    },
  });

  const { coupons } = useSelector((state) => state.coupons);
  // console.log(coupons, "coupons");

  useEffect(() => {
    dispatch(getCoupons());
  }, []);

  return (
    <StyledAppModal open={open} handleClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* title */}
          <div>
            <p className="label">Events Title</p>
            <TextField
              fullWidth
              name="title"
              size="small"
              placeholder="Events Title"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title}
              helperText={touched.title && errors.title}
              error={Boolean(touched.title && errors.title)}
            />
          </div>

          {/* Date */}
          <div>
            <p className="label">Date</p>
            <DatePicker
              // value={values.endDate}
              value={values.date ? new Date(values.date) : null}
              // onChange={(date) => setFieldValue("date", date)}
              onChange={(date) => {
                if (date) {
                  setFieldValue("date", date.toISOString().split("T")[0]);
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: touched.date && errors.date ? errors.date : "",
                  error: Boolean(touched.date && errors.date),
                },
              }}
            />
          </div>

          {/* Start Time */}
          <div>
            <p className="label">Start Time</p>
            <TextField
              name="startTime"
              size="small"
              fullWidth
              placeholder="00:00:00"
              value={values.startTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.startTime && errors.startTime)}
              helperText={touched.startTime && errors.startTime}
            />
          </div>

          {/* End Time */}
          <div>
            <p className="label">End Time</p>
            <TextField
              name="endTime"
              size="small"
              fullWidth
              placeholder="10:00:00"
              value={values.endTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.endTime && errors.endTime)}
              helperText={touched.endTime && errors.endTime}
            />
          </div>

          {/* price */}
          <div>
            <p className="label">Price</p>
            <TextField
              fullWidth
              size="small"
              placeholder="Price"
              name="price"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.price}
              helperText={touched.price && errors.price}
              error={Boolean(touched.price && errors.price)}
            />
          </div>

          {/* coinsDiscountPercentage */}
          <div>
            <p className="label">Coins Discount Percentage</p>
            <TextField
              fullWidth
              size="small"
              name="coinsDiscountPercentage"
              type="number"
              placeholder="Coins Discount (%)"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.coinsDiscountPercentage}
              helperText={
                touched.coinsDiscountPercentage &&
                errors.coinsDiscountPercentage
              }
              error={Boolean(
                touched.coinsDiscountPercentage &&
                  errors.coinsDiscountPercentage
              )}
            />
          </div>

          {/* Endurance Level */}
          <div>
            <p className="label">Endurance Level</p>
            <TextField
              fullWidth
              size="small"
              name="enduranceLevel"
              placeholder="Endurance Level"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.enduranceLevel}
              helperText={touched.enduranceLevel && errors.enduranceLevel}
              error={Boolean(touched.enduranceLevel && errors.enduranceLevel)}
            />
          </div>

          {/* Participation */}
          <div>
            <p className="label">Participation</p>
            <TextField
              fullWidth
              size="small"
              name="participation"
              placeholder="Participation"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.participation}
              helperText={touched.participation && errors.participation}
              error={Boolean(touched.participation && errors.participation)}
            />
          </div>

          {/* Reward Coins Interval */}
          <div>
            <p className="label">Reward Coins Interval</p>
            <TextField
              fullWidth
              size="small"
              name="rewardCoinsInterval"
              placeholder="Reward Coins Interval"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.rewardCoinsInterval}
              helperText={
                touched.rewardCoinsInterval && errors.rewardCoinsInterval
              }
              error={Boolean(
                touched.rewardCoinsInterval && errors.rewardCoinsInterval
              )}
            />
          </div>

          {/* obstacles */}
          <div>
            <p className="label">obstacles</p>
            <TextField
              fullWidth
              size="small"
              name="obstacles"
              placeholder="obstacles"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.obstacles}
              helperText={touched.obstacles && errors.obstacles}
              error={Boolean(touched.obstacles && errors.obstacles)}
            />
          </div>

          {/* Location Address */}
          <Box>
            <p className="label">Location Address</p>
            <TextField
              fullWidth
              size="small"
              name="location.address"
              placeholder="Event Location Address"
              value={values.location.address}
              onChange={(e) =>
                setFieldValue("location.address", e.target.value)
              }
              error={Boolean(
                touched.location?.address && errors.location?.address
              )}
              helperText={touched.location?.address && errors.location?.address}
            />
          </Box>

          {/* addresss */}
          {/* <Box> */}

          {/* <TextField
                fullWidth
                size="small"
                label="Latitude"
                placeholder="Enter Latitude"
                value={values.location.coordinate.coordinates[1]}
                onChange={(e) =>
                  setFieldValue(
                    "location.coordinate.coordinates[1]",
                    e.target.value
                  )
                }
              />
              <TextField
                fullWidth
                size="small"
                label="Longitude"
                placeholder="Enter Longitude"
                value={values.location.coordinate.coordinates[0]}
                onChange={(e) =>
                  setFieldValue(
                    "location.coordinate.coordinates[0]",
                    e.target.value
                  )
                }
              /> */}

          {/* </Box> */}

          <Box>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                size="small"
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
                fullWidth
                size="small"
                label="Longitude"
                value={values.location.coordinate.coordinates[0]}
                onChange={(e) =>
                  setFieldValue(
                    "location.coordinate.coordinates[0]",
                    e.target.value
                  )
                }
              />
              <Button onClick={() => setOpenMap(true)}>Pick on Map</Button>
            </Stack>

            {/* <MapPicker
              open={openMap}
              onClose={() => setOpenMap(false)}
              onConfirm={handleConfirmLocation}
            /> */}
          </Box>

          {/* Description */}
          <div>
            <p className="label">Description </p>
            {/* <TextField
              rows={2}
              fullWidth
              multiline
              size="small"
              name="description"
              placeholder="Description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              helperText={touched.description && errors.description}
              error={Boolean(touched.description && errors.description)}
            /> */}
            <ReactQuill
              theme="snow"
              value={values.description}
              onChange={(content) => setFieldValue("description", content)}
              onBlur={() => setFieldValue("description", values.description)}
            />
            {touched.description && errors.description && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.description}
              </p>
            )}
          </div>

          {/* FAQ */}
          <div>
            <p className="label">FAQ</p>
            {/* <TextField
              rows={2}
              fullWidth
              multiline
              size="small"
              name="description"
              placeholder="Description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.faq}
              helperText={touched.faq && errors.faq}
              error={Boolean(touched.faq && errors.faq)}
            /> */}
            <ReactQuill
              theme="snow"
              value={values.faq}
              onChange={(content) => setFieldValue("faq", content)}
              onBlur={() => setFieldValue("faq", values.faq)}
            />
            {touched.faq && errors.faq && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.faq}</p>
            )}
          </div>

          {/* Terms and condition */}
          <div>
            <p className="label">Terms and condition </p>
            {/* <TextField
              rows={2}
              fullWidth
              multiline
              size="small"
              name="tnc"
              placeholder="tnc"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.tnc}
              helperText={touched.tnc && errors.tnc}
              error={Boolean(touched.tnc && errors.tnc)}
            /> */}
            <ReactQuill
              theme="snow"
              value={values.tnc}
              onChange={(content) => setFieldValue("tnc", content)}
              onBlur={() => setFieldValue("tnc", values.tnc)}
            />
            {touched.tnc && errors.tnc && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.tnc}</p>
            )}
          </div>

          {/* Banner File */}
          <div>
            <p className="label">Banner File</p>
            <Dropzone
              onDrop={(files) => setFieldValue("bannerFile", files[0])}
            />
            {touched.bannerFile && errors.bannerFile && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.bannerFile}
              </p>
            )}
          </div>

          {/* Slots */}
          <Box>
            <p className="label">Slots</p>
            {values.slots.map((slot, index) => (
              <Stack key={index} direction="row" spacing={2} mb={2}>
                <TextField
                  fullWidth
                  size="small"
                  label={`Start Time (Slot ${index + 1})`}
                  placeholder="00:00:00"
                  value={slot.startTime}
                  onChange={(e) =>
                    setFieldValue(`slots[${index}].startTime`, e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  size="small"
                  label={`End Time (Slot ${index + 1})`}
                  placeholder="00:00:00"
                  value={slot.endTime}
                  onChange={(e) =>
                    setFieldValue(`slots[${index}].endTime`, e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Capacity"
                  placeholder="100"
                  value={slot.capacity}
                  onChange={(e) =>
                    setFieldValue(`slots[${index}].capacity`, e.target.value)
                  }
                />
              </Stack>
            ))}
          </Box>

          {/* Coupons */}
          <Box>
            <p className="label">Coupons</p>

            <Select
              multiple
              fullWidth
              size="small"
              name="coupons"
              value={values.coupons}
              onChange={(e) => {
                setFieldValue("coupons", e.target.value);
                console.log(e.target.value);
              }}
              renderValue={(selected) =>
                coupons
                  .filter((coupon) => selected.includes(coupon.id))
                  .map((coupon) => coupon.code)
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

            <Button
              variant="outlined"
              onClick={() => setFieldValue("coupons", [...values.coupons, ""])}
            >
              Add Coupon
            </Button>

            {touched.coupons &&
              errors.coupons &&
              typeof errors.coupons === "string" && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.coupons}
                </p>
              )}
          </Box>

          <div className="btn-group">
            <Button type="submit" variant="contained" fullWidth>
              Create
            </Button>

            <Button variant="outlined" fullWidth onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Stack>
      </form>
    </StyledAppModal>
  );
}
