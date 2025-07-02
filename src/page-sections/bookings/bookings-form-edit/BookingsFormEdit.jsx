import { useEffect, useState } from "react"; // MUI ICON COMPONENT

import Add from "@mui/icons-material/Add"; // MUI
import { useFormik } from "formik";
import * as Yup from "yup"; // For validation
import { useDispatch, useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import styled from "@mui/material/styles/styled";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // CUSTOM COMPONENTS
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";

import Modal from "@/components/modal";
import Dropzone from "@/components/dropzone"; // STYLED COMPONENT
import { getSports } from "../../../store/apps/sports";
import { Box, Chip, ListItemText } from "@mui/material";
import toast from "react-hot-toast";
import {
  getEvents,
  getEventsById,
  updateEvents,
} from "../../../store/apps/events";
import { getCoupons } from "../../../store/apps/coupons";
import ReactQuill from "react-quill";

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
})); // ==============================================================

// ==============================================================
export default function BookingsFormEdit({ open, handleClose, eventsId }) {
  const [date, setDate] = useState(new Date());

  const dispatch = useDispatch();

  const { singleEvents } = useSelector((state) => state.events);
  const { sports } = useSelector((state) => state.sports);
  const { coupons } = useSelector((state) => state.coupons);
  // console.log(coupons, "coupons");

  useEffect(() => {
    dispatch(getCoupons());
  }, []);

  useEffect(() => {
    const storedEventId = localStorage.getItem("eventsId");
    // console.log("Stored Event ID:", storedEventId);
    // console.log("Props Event ID:", eventsId);

    // Use the event ID from props if available, otherwise use the stored one
    const effectiveEventId = eventsId || storedEventId;

    if (!effectiveEventId) {
      console.error("No event ID found in props or storage");
      return;
    }

    dispatch(getEventsById(effectiveEventId));
    dispatch(getSports());
  }, [dispatch, eventsId]);

  useEffect(() => {
    if (singleEvents && open) {
      console.log("Setting form values from singleEvents:", singleEvents);
      // Set form values from singleEvents
      setValues({
        title: singleEvents.title || "",
        description: singleEvents.description || "",
        date: singleEvents.date || "",
        startTime: singleEvents.startTime || "",
        endTime: singleEvents.endTime || "",
        price: singleEvents.price || "",
        coinsDiscountPercentage: singleEvents.coinsDiscountPercentage || 0,
        participation: singleEvents.participation || "",
        obstacles: singleEvents.obstacles || "",
        enduranceLevel: singleEvents.enduranceLevel || "",
        rewardCoinsInterval: singleEvents.rewardCoinsInterval || "",
        coupons: singleEvents.coupons || [],
        location: {
          address: singleEvents.location?.address || "",
          coordinate: {
            type: "Point",
            coordinates: singleEvents.location?.coordinate?.coordinates || [
              "",
              "",
            ],
          },
        },
        slots: singleEvents.slots || [
          { startTime: "", endTime: "", capacity: "" },
        ],
        banner: singleEvents.banner || null,
        badge: singleEvents.badge || null,
      });
    }
  }, [singleEvents, open]);

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
    slots: [{ startTime: "", endTime: "", capacity: "" }],
    banner: null,
    badge: null,
    tnc:"",
    faq:"",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.string().required("Date is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    price: Yup.string().required("Price is required"),
    coinsDiscountPercentage: Yup.number().nullable(),
    participation: Yup.string().required("Participation is required"),
    obstacles: Yup.string().required("Obstacles is required"),
    enduranceLevel: Yup.string().required("Endurance Level is required"),
    rewardCoinsInterval: Yup.number().nullable(),
    banner: Yup.mixed().nullable(),
    badge: Yup.mixed().nullable(),
    location: Yup.object().shape({
      address: Yup.string().required("Location address is required"),
      coordinate: Yup.object().shape({
        type: Yup.string().required("Coordinate type is required"),
        coordinates: Yup.array()
          .of(Yup.number())
          .nullable()
          .length(2, "Coordinates must have latitude and longitude"),
      }),
    }),
    slots: Yup.array().of(
      Yup.object().shape({
        startTime: Yup.string().nullable(),
        endTime: Yup.string().nullable(),
        capacity: Yup.string().nullable(),
      })
    ),
    coupons: Yup.array().of(Yup.string()).nullable(),
    
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setValues,
    touched,
  } = useFormik({
    initialValues,
    // validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("Form values:", values,"Form errors:", errors);
 
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "qualifyingSports") {
          value.forEach((sportId) => {
            formData.append("qualifyingSports[]", sportId);
          });
        } else if (key === "banner" || key === "badge") {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else if (key === "startTime" || key === "endTime") {
          formData.append(key, value);
        } else if (key === "date") {
          formData.append(key, value);
        } else if (key === "location") {
          formData.append("location[address]", value.address);
          formData.append("location[coordinate][type]", value.coordinate.type);

          if (value.coordinate && value.coordinate.coordinates) {
            formData.append(
              "location[coordinate][coordinates][0]",
              value.coordinate.coordinates[0]
            );
            formData.append(
              "location[coordinate][coordinates][1]",
              value.coordinate.coordinates[1]
            );
          }
        } else if (key === "slots") {
          value.forEach((slot, index) => {
            formData.append(`slots[${index}][startTime]`, slot.startTime || "");
            formData.append(`slots[${index}][endTime]`, slot.endTime || "");
            formData.append(`slots[${index}][capacity]`, slot.capacity || "");
          });
        } else if (key === "coupons") {
          value.forEach((coupon, index) => {
            formData.append(`coupons[${index}]`, coupon.id);
          });
        } else {
          formData.append(key, value || "");
        }
        return formData;
      });

      try {
        console.log("Submitting form data...");
        const response = await dispatch(
          updateEvents({
            editId: eventsId,
            changedData: formData,
          })
        );

        if (response?.payload?.data) {
          toast.success("Event updated successfully");
          dispatch(getEvents());
          handleClose();
        } else {
          console.error("Update failed:", response);
          toast.error(response?.payload?.message || "Failed to update event");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error(
          error?.message || "An error occurred while updating the event"
        );
      }
    },
  });

  return (
    <StyledAppModal open={open} handleClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <div>
            <p className="label">Event Title</p>
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
              value={values.date ? new Date(values.date) : null}
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
              value={values.location.address || ""}
              type="string"
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
          <Box>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                size="small"
                label="Latitude"
                placeholder="Enter Latitude"
                value={values.location.coordinate.coordinates[1]}
                onChange={(e) =>
                  setFieldValue(
                    "location.coordinate.coordinates[1]",
                    parseFloat(e.target.value)
                  )
                }
                error={Boolean(
                  touched.location?.coordinate?.coordinates &&
                    errors.location?.coordinate?.coordinates
                )}
                helperText={
                  touched.location?.coordinate?.coordinates &&
                  errors.location?.coordinate?.coordinates
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
                    parseFloat(e.target.value)
                  )
                }
                error={Boolean(
                  touched.location?.coordinate?.coordinates &&
                    errors.location?.coordinate?.coordinates
                )}
                helperText={
                  touched.location?.coordinate?.coordinates &&
                  errors.location?.coordinate?.coordinates
                }
              />
              <TextField
                fullWidth
                size="small"
                label="type"
                placeholder="Enter type"
                value={values?.location?.coordinate?.type}
                onChange={(e) =>
                  setFieldValue(
                    "location.coordinate.type",
                    parseFloat(e.target.value)
                  )
                }
                error={Boolean(
                  touched.location?.coordinate?.type &&
                    errors.location?.coordinate?.type
                )}
                helperText={
                  touched.location?.coordinate?.type &&
                  errors.location?.coordinate?.type
                }
              />
            </Stack>
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


          {/* Terms & Condition */}
          <div>
            <p className="label">Terms & Condition </p>
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
              value={values.tnc}
              onChange={(content) => setFieldValue("tnc", content)}
              onBlur={() => setFieldValue("tnc", values.tnc)}
            />
            {touched.tnc && errors.tnc && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.tnc}
              </p>
            )}
          </div>


          {/* FAQ */}
          <div>
            <p className="label">FAQ </p>

            <ReactQuill
              theme="snow"
              value={values.faq}
              onChange={(content) => setFieldValue("faq", content)}
              onBlur={() => setFieldValue("faq", values.faq)}
            />
            {touched.faq && errors.faq && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.faq}
              </p>
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
                  onBlur={handleBlur}
                  error={Boolean(
                    touched.slots?.[index]?.startTime &&
                      errors.slots?.[index]?.startTime
                  )}
                  helperText={
                    touched.slots?.[index]?.startTime &&
                    errors.slots?.[index]?.startTime
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

            {values.coupons.map((coupon) => (
              <Stack
                key={coupon?.id}
                direction="row"
                spacing={2}
                alignItems="center"
                mb={1}
              >
                <TextField
                  fullWidth
                  size="small"
                  label={`Coupon id`}
                  value={coupon?.id + 1}
                  onChange={(e) =>
                    setFieldValue(`Coupon ${coupon?.id + 1}`, e.target.value)
                  }
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    const updated = [...values.coupons];
                    updated.splice(coupon?.id, 1);
                    setFieldValue("coupons", updated);
                  }}
                  disabled={values.coupons.length === 1}
                >
                  Remove
                </Button>
              </Stack>
            ))}

            <Select
              multiple
              fullWidth
              size="small"
              name="coupons"
              value={values.coupons}
              onChange={(e) => setFieldValue("coupons", e.target.value)}
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
              Save Changes
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
