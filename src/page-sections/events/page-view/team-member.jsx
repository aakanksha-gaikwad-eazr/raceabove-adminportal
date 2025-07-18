// Multi-step Events Form using Formik & MUI - Fixed Version
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
  FormControl,
  InputLabel,
  FormHelperText,
  IconButton,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import Dropzone from "@/components/dropzone";
import { useDispatch, useSelector } from "react-redux";
import MapPickerModal from "@/components/mapPickerModal/MapPickerModal.jsx";
import { useNavigate } from "react-router-dom";
import HeadingArea from "../HeadingArea";
import { FlexBox } from "@/components/flexbox";
import IconWrapper from "@/components/icon-wrapper/IconWrapper";
import GroupSenior from "@/icons/GroupSenior";
import { Paragraph } from "@/components/typography";
import { Add, Remove } from "@mui/icons-material";
import { getCoupons } from "@/store/apps/coupons";
import { getPrivacyPolicies } from "@/store/apps/privacypolicy";
import { getTicketTemplate } from "@/store/apps/tickettemplate";
import { getAddOns } from "@/store/apps/addons";
import { getFaq } from "@/store/apps/faq";
import { getTnc } from "@/store/apps/tnc";
import { createEvents, getEvents } from "@/store/apps/events"; // Added missing imports

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
    title: "Time Slots & Tickets",
    subtitle: "Add time slots with ticket templates",
  },
  {
    title: "Coupons",
    subtitle: "Attach any applicable discount coupons",
  },
  {
    title: "Addon Products",
    subtitle: "Add addon products with quantities",
  },
  {
    title: "FAQ & Legal",
    subtitle: "Add FAQ, Terms & Conditions, and Privacy Policy",
  },
];

const MUMBAI_COORDINATES = {
  latitude: 19.076,
  longitude: 72.8777,
};

const validationSchemas = [
  // Step 0: Basic Info
  Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .min(0, "Price must be positive")
      .required("Price is required"),
    coinsDiscountPercentage: Yup.number()
      .min(0, "Must be positive")
      .max(100, "Cannot exceed 100%")
      .required("Required"),
    maxTicketsPerUser: Yup.number()
      .min(1, "Must be at least 1")
      .required("Required"),
    bannerFile: Yup.mixed().required("Banner image is required"),
  }),
  // Step 1: Schedule
  Yup.object({
    date: Yup.string().required("Date is required"),
    startTime: Yup.string().required("Start time is required"),
    endTime: Yup.string().required("End time is required"),
  }),
  // Step 2: Location
  Yup.object({
    location: Yup.object({
      address: Yup.string().required("Address is required"),
      coordinate: Yup.object({
        coordinates: Yup.array()
          .of(Yup.string())
          .length(2, "Both latitude and longitude are required")
          .required("Coordinates are required"),
      }),
    }),
  }),
  // Step 3: Event Details
  Yup.object({
    participation: Yup.string().required("Participation info is required"),
    obstacles: Yup.string().required("Obstacles info is required"),
    enduranceLevel: Yup.string().required("Endurance level is required"),
  }),
  // Step 4: Time Slots
  Yup.object({
    slots: Yup.array()
      .of(
        Yup.object({
          startTime: Yup.string().required("Slot start time is required"),
          endTime: Yup.string().required("Slot end time is required"),
          eventTickets: Yup.array()
            .of(
              Yup.object({
                ticketTemplateId: Yup.string().required(
                  "Ticket template is required"
                ),
                isActive: Yup.boolean(),
              })
            )
            .min(1, "At least one ticket template is required"),
          isActive: Yup.boolean(),
        })
      )
      .min(1, "At least one time slot is required"),
  }),
  // Step 5: Coupons
  Yup.object({
    couponIds: Yup.array().of(Yup.string()),
  }),
  // Step 6: Addon Products
  Yup.object({
    addOns: Yup.array().of(
      Yup.object({
        productId: Yup.string().required("Product is required"),
        quantity: Yup.number()
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
        isActive: Yup.boolean(),
      })
    ),
  }),
  // Step 7: FAQ & Legal
  Yup.object({
    frequentlyAskedQuestionsIds: Yup.array().of(
      Yup.string().required("FAQ is required")
    ),
    termsAndConditionsId: Yup.string().required(
      "Terms & Conditions is required"
    ),
    privacyPolicyId: Yup.string().required("Privacy Policy is required"),
  }),
];

export default function TeamMemberPageView({ open, handleClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coupons } = useSelector((state) => state.coupons);
  const { allFaq } = useSelector((state) => state.faq);
  const { allTnc } = useSelector((state) => state.tnc);
  const { privacypolicies } = useSelector((state) => state.privacypolicy);
  const { allTicketTemplate } = useSelector((state) => state.tickettemplate);
  const { allAddons } = useSelector((state) => state.addons);
  const [activeStep, setActiveStep] = useState(0);
  const [openMap, setOpenMap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(getCoupons()),
          dispatch(getFaq()),
          dispatch(getTnc()),
          dispatch(getPrivacyPolicies()),
          dispatch(getTicketTemplate()),
          dispatch(getAddOns()),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Debug log to check ticket templates
  useEffect(() => {
  }, [allTicketTemplate, allAddons, coupons]);

  const handleMapSelect = ([lat, lng],address) => {
    formik.setFieldValue("location.coordinate.coordinates[0]", lat.toFixed(6));
    formik.setFieldValue("location.coordinate.coordinates[1]", lng.toFixed(6));
      formik.setFieldValue("location.address", address || "some place");

    setOpenMap(false);
  };

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      price: "",
      coinsDiscountPercentage: 0,
      maxTicketsPerUser: 1,
      participation: "",
      obstacles: "",
      enduranceLevel: "",
      couponIds: [],
      addOns: [],
      location: {
        address: "",
        coordinate: {
          type: "Point",
          coordinates: ["", ""],
        },
        isActive: true,
      },
      slots: [
        {
          startTime: "",
          endTime: "",
          eventTickets: [
            {
              ticketTemplateId: "",
              isActive: true,
            },
          ],
          isActive: true,
        },
      ],
      bannerFile: null,
      frequentlyAskedQuestionsIds: [],
      termsAndConditionsId: "",
      privacyPolicyId: "",
      isActive: true,
    },
    validationSchema: validationSchemas[activeStep],
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
        return;
      }

      // Create FormData according to API specification
      const formData = new FormData();

      // Basic fields
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("date", values.date);
      formData.append("startTime", values.startTime);
      formData.append("endTime", values.endTime);
      formData.append("price", values.price);
      formData.append(
        "coinsDiscountPercentage",
        values.coinsDiscountPercentage
      );
      formData.append("maxTicketsPerUser", values.maxTicketsPerUser);
      formData.append("participation", values.participation);
      formData.append("obstacles", values.obstacles);
      formData.append("enduranceLevel", values.enduranceLevel);
      formData.append("isActive", values.isActive);

      // Banner file
      if (values.bannerFile) {
        formData.append("bannerFile", values.bannerFile);
      }

      // Location
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
      formData.append("location[isActive]", values.location.isActive);

      // Slots with tickets
      values.slots.forEach((slot, slotIndex) => {
        formData.append(`slots[${slotIndex}][startTime]`, slot.startTime);
        formData.append(`slots[${slotIndex}][endTime]`, slot.endTime);
        formData.append(`slots[${slotIndex}][isActive]`, slot.isActive);

        slot.eventTickets.forEach((ticket, ticketIndex) => {
          formData.append(
            `slots[${slotIndex}][eventTickets][${ticketIndex}][ticketTemplateId]`,
            ticket.ticketTemplateId
          );
          formData.append(
            `slots[${slotIndex}][eventTickets][${ticketIndex}][isActive]`,
            ticket.isActive
          );
        });
      });

      // Coupons
      values.couponIds.forEach((couponId, index) => {
        formData.append(`couponIds[${index}]`, couponId);
      });

      // Add-ons
      values.addOns.forEach((addOn, index) => {
        formData.append(`addOns[${index}][productId]`, addOn.productId);
        formData.append(`addOns[${index}][quantity]`, addOn.quantity);
        formData.append(`addOns[${index}][isActive]`, addOn.isActive);
      });

      // FAQ
      values.frequentlyAskedQuestionsIds.forEach((faqId, index) => {
        formData.append(`frequentlyAskedQuestionsIds[${index}]`, faqId);
      });
      // PP
      if (values.privacyPolicyId) {
        formData.append("privacyPolicyId", values.privacyPolicyId);
      }

      //tnc
      if (values.termsAndConditionsId) {
        formData.append("termsAndConditionsId", values.termsAndConditionsId);
      }
      try {
        const res = await dispatch(createEvents(formData));
        if (res?.payload?.status === 201) {
          toast.success("Event created successfully");
          navigate("/events/version-4");
          await dispatch(getEvents());
        }else if(res?.payload?.status===400){
      // Handle API errors with specific messages
      const errorData = res?.payload;
      
      if (errorData?.message) {
        // If message is an array (validation errors)
        if (Array.isArray(errorData.message)) {
          errorData.message.forEach(msg => {
            toast.error(msg);
          });
        } else {
          // Single error message
          toast.error(errorData.message);
        }
      } else {
        toast.error("Failed to create event");
      }
    }
  } catch (err) {
    console.error("Form submission error:", err);
    
    // Handle any additional errors
    if (err?.message) {
      toast.error(err.message);
    } else {
      toast.error("Something went wrong");
    }
  }}
  });

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleNext = () => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        formik.handleSubmit();
      } else {
        // Show validation errors - flatten nested errors
        const showError = (obj, path = "") => {
          Object.keys(obj).forEach((key) => {
            const fullPath = path ? `${path}.${key}` : key;
            if (typeof obj[key] === "string") {
              toast.error(`${fullPath}: ${obj[key]}`);
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
              showError(obj[key], fullPath);
            }
          });
        };
        showError(errors);
      }
    });
  };

  const addSlot = () => {
    const newSlot = {
      startTime: "",
      endTime: "",
      eventTickets: [
        {
          ticketTemplateId: "",
          isActive: true,
        },
      ],
      isActive: true,
    };
    formik.setFieldValue("slots", [...formik.values.slots, newSlot]);
  };

  const removeSlot = (index) => {
    const newSlots = formik.values.slots.filter((_, i) => i !== index);
    formik.setFieldValue("slots", newSlots);
  };

  const addTicketToSlot = (slotIndex) => {
    const newTicket = {
      ticketTemplateId: "",
      isActive: true,
    };
    const updatedSlots = [...formik.values.slots];
    updatedSlots[slotIndex].eventTickets.push(newTicket);
    formik.setFieldValue("slots", updatedSlots);
  };

  const removeTicketFromSlot = (slotIndex, ticketIndex) => {
    const updatedSlots = [...formik.values.slots];
    updatedSlots[slotIndex].eventTickets = updatedSlots[
      slotIndex
    ].eventTickets.filter((_, i) => i !== ticketIndex);
    formik.setFieldValue("slots", updatedSlots);
  };

  const addAddon = () => {
    const newAddon = {
      productId: "",
      quantity: 1,
      isActive: true,
    };
    formik.setFieldValue("addOns", [...formik.values.addOns, newAddon]);
  };

  const removeAddon = (index) => {
    const newAddons = formik.values.addOns.filter((_, i) => i !== index);
    formik.setFieldValue("addOns", newAddons);
  };

  const renderStep = () => {
    const { values, handleChange, errors, touched, setFieldValue } = formik;

    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={3}>
            <TextField
              label="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              error={!!(errors.title && touched.title)}
              helperText={touched.title && errors.title}
              fullWidth
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Description
              </Typography>
              <ReactQuill
                value={values.description}
                onChange={(val) => setFieldValue("description", val)}
                placeholder="Write some description about the event here..."
              />
              {errors.description && touched.description && (
                <Typography color="error" variant="caption">
                  {errors.description}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Banner Image
              </Typography>
              <Dropzone
                onDrop={(files) => setFieldValue("bannerFile", files[0])}
              />
              {errors.bannerFile && touched.bannerFile && (
                <Typography color="error" variant="caption">
                  {errors.bannerFile}
                </Typography>
              )}
            </Box>

            <TextField
              name="price"
              label="Price"
              type="number"
              value={values.price}
              onChange={handleChange}
              error={!!(errors.price && touched.price)}
              helperText={touched.price && errors.price}
              fullWidth
            />

            <TextField
              name="coinsDiscountPercentage"
              label="Coins Discount Percentage"
              type="number"
              value={values.coinsDiscountPercentage}
              onChange={handleChange}
              error={
                !!(
                  errors.coinsDiscountPercentage &&
                  touched.coinsDiscountPercentage
                )
              }
              helperText={
                touched.coinsDiscountPercentage &&
                errors.coinsDiscountPercentage
              }
              fullWidth
            />

            <TextField
              name="maxTicketsPerUser"
              label="Max Tickets Per User"
              type="number"
              value={values.maxTicketsPerUser}
              onChange={handleChange}
              error={!!(errors.maxTicketsPerUser && touched.maxTicketsPerUser)}
              helperText={touched.maxTicketsPerUser && errors.maxTicketsPerUser}
              fullWidth
            />
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <DatePicker
              label="Event Date"
              value={values.date ? new Date(values.date) : null}
              onChange={(date) =>
                date && setFieldValue("date", date.toISOString().split("T")[0])
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!(errors.date && touched.date),
                  helperText: touched.date && errors.date,
                },
              }}
            />

            <FormControl
              fullWidth
              error={!!(errors.startTime && touched.startTime)}
            >
              <InputLabel>Start Time</InputLabel>
              <Select
                name="startTime"
                value={values.startTime}
                onChange={handleChange}
                label="Start Time"
              >
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
              {errors.startTime && touched.startTime && (
                <FormHelperText>{errors.startTime}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={!!(errors.endTime && touched.endTime)}
            >
              <InputLabel>End Time</InputLabel>
              <Select
                name="endTime"
                value={values.endTime}
                onChange={handleChange}
                label="End Time"
              >
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
              {errors.endTime && touched.endTime && (
                <FormHelperText>{errors.endTime}</FormHelperText>
              )}
            </FormControl>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <TextField
              label="Address"
              name="location.address"
              value={values.location.address}
              onChange={handleChange}
              error={!!(errors.location?.address && touched.location?.address)}
              helperText={touched.location?.address && errors.location?.address}
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Latitude"
                value={values.location.coordinate.coordinates[0]}
                onChange={(e) =>
                  setFieldValue(
                    "location.coordinate.coordinates[0]",
                    e.target.value
                  )
                }
                error={
                  !!(
                    errors.location?.coordinate?.coordinates &&
                    touched.location?.coordinate?.coordinates
                  )
                }
                style={{ width: "500px" }}
              />
              <TextField
                label="Longitude"
                value={values.location.coordinate.coordinates[1]}
                onChange={(e) =>
                  setFieldValue(
                    "location.coordinate.coordinates[1]",
                    e.target.value
                  )
                }
                error={
                  !!(
                    errors.location?.coordinate?.coordinates &&
                    touched.location?.coordinate?.coordinates
                  )
                }
                style={{ width: "500px" }}
              />
              <Tooltip title="Pick location on map">
                <Button variant="outlined" onClick={() => setOpenMap(true)}>
                  Pick on Map
                </Button>
              </Tooltip>
            </Stack>

            {errors.location?.coordinate?.coordinates &&
              touched.location?.coordinate?.coordinates && (
                <Typography color="error" variant="caption">
                  {errors.location.coordinate.coordinates}
                </Typography>
              )}

            <MapPickerModal
              open={openMap}
              onClose={() => setOpenMap(false)}
              onSelect={handleMapSelect}
              // initialLatLng={[
              //   Number(values.location.coordinate.coordinates[0]) || 0,
              //   Number(values.location.coordinate.coordinates[1]) || 0,
              // ]}
              initialLatLng={[
                Number(values.location.coordinate.coordinates[0]) ||
                  MUMBAI_COORDINATES.latitude,
                Number(values.location.coordinate.coordinates[1]) ||
                  MUMBAI_COORDINATES.longitude,
              ]}
            />
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3}>
            <TextField
              name="participation"
              label="Participation"
              multiline
              rows={3}
              value={values.participation}
              onChange={handleChange}
              error={!!(errors.participation && touched.participation)}
              helperText={touched.participation && errors.participation}
              fullWidth
            />

            <TextField
              name="obstacles"
              label="Obstacles"
              multiline
              rows={3}
              value={values.obstacles}
              onChange={handleChange}
              error={!!(errors.obstacles && touched.obstacles)}
              helperText={touched.obstacles && errors.obstacles}
              fullWidth
            />

            <TextField
              name="enduranceLevel"
              label="Endurance Level"
              value={values.enduranceLevel}
              onChange={handleChange}
              error={!!(errors.enduranceLevel && touched.enduranceLevel)}
              helperText={touched.enduranceLevel && errors.enduranceLevel}
              fullWidth
            />
          </Stack>
        );

      case 4:
        return (
          <Stack spacing={3}>
            <Typography variant="h6">Time Slots & Tickets</Typography>
            <Typography variant="body2" color="textSecondary">
              Event Time Range: {values.startTime || "--:--"} -{" "}
              {values.endTime || "--:--"}
            </Typography>

            {/* Debug info */}
            {process.env.NODE_ENV === "development" && (
              <Typography variant="caption" color="info.main">
                Available Ticket Templates:{" "}
                {(allTicketTemplate?.data || allTicketTemplate || []).length}
              </Typography>
            )}

            {values.slots.map((slot, slotIndex) => (
              <Box
                key={slotIndex}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="subtitle1">
                      Slot {slotIndex + 1}
                    </Typography>
                    {values.slots.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => removeSlot(slotIndex)}
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <FormControl
                      fullWidth
                      error={
                        !!(
                          errors.slots?.[slotIndex]?.startTime &&
                          touched.slots?.[slotIndex]?.startTime
                        )
                      }
                    >
                      {/* <InputLabel>Start Time</InputLabel> */}
                      <Select
                        value={slot.startTime}
                        onChange={(e) =>
                          setFieldValue(
                            `slots[${slotIndex}].startTime`,
                            e.target.value
                          )
                        }
                        label="Start Time"
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select Start Time</em>
                        </MenuItem>
                        {timeOptions
                          .filter(
                            (time) =>
                              !values.startTime ||
                              !values.endTime ||
                              (time >= values.startTime &&
                                time <= values.endTime)
                          )
                          .map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.slots?.[slotIndex]?.startTime &&
                        touched.slots?.[slotIndex]?.startTime && (
                          <FormHelperText>
                            {errors.slots[slotIndex].startTime}
                          </FormHelperText>
                        )}
                    </FormControl>

                    <FormControl
                      fullWidth
                      error={
                        !!(
                          errors.slots?.[slotIndex]?.endTime &&
                          touched.slots?.[slotIndex]?.endTime
                        )
                      }
                    >
                      {/* <InputLabel>End Time</InputLabel> */}
                      <Select
                        value={slot.endTime}
                        onChange={(e) =>
                          setFieldValue(
                            `slots[${slotIndex}].endTime`,
                            e.target.value
                          )
                        }
                        label="End Time"
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select End Time</em>
                        </MenuItem>
                        {timeOptions
                          .filter(
                            (time) =>
                              !values.startTime ||
                              !values.endTime ||
                              !slot.startTime ||
                              (time > slot.startTime && time <= values.endTime)
                          )
                          .map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.slots?.[slotIndex]?.endTime &&
                        touched.slots?.[slotIndex]?.endTime && (
                          <FormHelperText>
                            {errors.slots[slotIndex].endTime}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Stack>

                  <Divider />
                  <Typography variant="subtitle2">Ticket Templates</Typography>

                  {slot.eventTickets.map((ticket, ticketIndex) => (
                    <Stack
                      key={ticketIndex}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <FormControl
                        fullWidth
                        error={
                          !!(
                            errors.slots?.[slotIndex]?.eventTickets?.[
                              ticketIndex
                            ]?.ticketTemplateId &&
                            touched.slots?.[slotIndex]?.eventTickets?.[
                              ticketIndex
                            ]?.ticketTemplateId
                          )
                        }
                      >
                        <InputLabel>Ticket Template</InputLabel>
                        <Select
                          value={ticket.ticketTemplateId}
                          onChange={(e) =>
                            setFieldValue(
                              `slots[${slotIndex}].eventTickets[${ticketIndex}].ticketTemplateId`,
                              e.target.value
                            )
                          }
                          label="Ticket Template"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <MenuItem disabled>Loading...</MenuItem>
                          ) : (
                              allTicketTemplate?.data ||
                              allTicketTemplate ||
                              []
                            ).length === 0 ? (
                            <MenuItem disabled>
                              No ticket templates available
                            </MenuItem>
                          ) : (
                            (
                              allTicketTemplate?.data ||
                              allTicketTemplate ||
                              []
                            )?.map((template) => (
                              <MenuItem key={template.id} value={template.id}>
                                {template?.ticketType?.title}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {errors.slots?.[slotIndex]?.eventTickets?.[ticketIndex]
                          ?.ticketTemplateId &&
                          touched.slots?.[slotIndex]?.eventTickets?.[
                            ticketIndex
                          ]?.ticketTemplateId && (
                            <FormHelperText>
                              {
                                errors.slots[slotIndex].eventTickets[
                                  ticketIndex
                                ].ticketTemplateId
                              }
                            </FormHelperText>
                          )}
                      </FormControl>

                      {slot.eventTickets.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() =>
                            removeTicketFromSlot(slotIndex, ticketIndex)
                          }
                          size="small"
                        >
                          <Remove />
                        </IconButton>
                      )}
                    </Stack>
                  ))}

                </Stack>
              </Box>
            ))}

            <Button variant="outlined" onClick={addSlot} startIcon={<Add />}>
              Add Time Slot
            </Button>

            {errors.slots &&
              touched.slots &&
              typeof errors.slots === "string" && (
                <Typography color="error" variant="caption">
                  {errors.slots}
                </Typography>
              )}
          </Stack>
        );

      case 5:
        return (
          <Stack spacing={3}>
            <Typography variant="h6">Select Coupons</Typography>
            <FormControl fullWidth>
              <InputLabel>Coupons</InputLabel>
              <Select
                multiple
                value={values.couponIds}
                onChange={(e) => setFieldValue("couponIds", e.target.value)}
                renderValue={(selected) =>
                  selected
                    .map(
                      (id) => (coupons || [])?.find((c) => c.id === id)?.code
                    )
                    .filter(Boolean)
                    .join(", ")
                }
                label="Coupons"
                disabled={isLoading}
              >
                {isLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (coupons || []).length === 0 ? (
                  <MenuItem disabled>No coupons available</MenuItem>
                ) : (
                  (coupons || [])?.map((coupon) => (
                    <MenuItem key={coupon.id} value={coupon.id}>
                      <Checkbox
                        checked={values.couponIds.includes(coupon.id)}
                      />
                      <ListItemText
                        primary={`${coupon.code} - ${coupon.description}`}
                      />
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Stack>
        );

      case 6:
        return (
          <Stack spacing={3}>
            <Typography variant="h6">Addon Products</Typography>

            {values.addOns.map((addon, index) => (
              <Box
                key={index}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl
                    fullWidth
                    error={
                      !!(
                        errors.addOns?.[index]?.productId &&
                        touched.addOns?.[index]?.productId
                      )
                    }
                  >
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={addon.productId}
                      onChange={(e) =>
                        setFieldValue(
                          `addOns[${index}].productId`,
                          e.target.value
                        )
                      }
                      label="Product"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (allAddons || []).length === 0 ? (
                        <MenuItem disabled>No products available</MenuItem>
                      ) : (
                        (allAddons || [])?.map((addon) => (
                          <MenuItem key={addon.id} value={addon.id}>
                            {addon.name || addon.title}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {errors.addOns?.[index]?.productId &&
                      touched.addOns?.[index]?.productId && (
                        <FormHelperText>
                          {errors.addOns[index].productId}
                        </FormHelperText>
                      )}
                  </FormControl>

                  <TextField
                    label="Quantity"
                    type="number"
                    value={addon.quantity}
                    onChange={(e) =>
                      setFieldValue(
                        `addOns[${index}].quantity`,
                        parseInt(e.target.value)
                      )
                    }
                    error={
                      !!(
                        errors.addOns?.[index]?.quantity &&
                        touched.addOns?.[index]?.quantity
                      )
                    }
                    helperText={
                      touched.addOns?.[index]?.quantity &&
                      errors.addOns?.[index]?.quantity
                    }
                    inputProps={{ min: 1 }}
                  />

                  <IconButton color="error" onClick={() => removeAddon(index)}>
                    <Remove />
                  </IconButton>
                </Stack>
              </Box>
            ))}

            <Button variant="outlined" onClick={addAddon} startIcon={<Add />}>
              Add Addon Product
            </Button>
          </Stack>
        );

      case 7:
        return (
          <Stack spacing={3}>
            <Typography variant="h6">FAQ & Legal Documents</Typography>

            <FormControl fullWidth>
              <InputLabel>Frequently Asked Questions</InputLabel>
              <Select
                multiple
                value={values.frequentlyAskedQuestionsIds}
                onChange={(e) =>
                  setFieldValue("frequentlyAskedQuestionsIds", e.target.value)
                }
                renderValue={(selected) =>
                  selected
                    .map((id) => allFaq?.find((f) => f.id === id)?.question)
                    .join(", ")
                }
                label="Frequently Asked Questions"
              >
                {allFaq?.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    <Checkbox
                      checked={values.frequentlyAskedQuestionsIds.includes(
                        f.id
                      )}
                    />
                    <ListItemText primary={f.question} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              error={
                !!(errors.termsAndConditionsId && touched.termsAndConditionsId)
              }
            >
              <InputLabel>Terms & Conditions</InputLabel>
              <Select
                name="termsAndConditionsId"
                value={values.termsAndConditionsId}
                onChange={(e) =>
                  setFieldValue("termsAndConditionsId", e.target.value)
                }
                label="Terms & Conditions"
              >
                {allTnc?.map((tnc) => (
                  <MenuItem key={tnc.id} value={tnc.id}>
                    {tnc.content}
                  </MenuItem>
                ))}
              </Select>
              {errors.termsAndConditionsId && touched.termsAndConditionsId && (
                <FormHelperText>{errors.termsAndConditionsId}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={!!(errors.privacyPolicyId && touched.privacyPolicyId)}
            >
              <InputLabel>Privacy Policy</InputLabel>
              <Select
                name="privacyPolicyId"
                value={values.privacyPolicyId}
                onChange={(e) =>
                  setFieldValue("privacyPolicyId", e.target.value)
                }
                label="Privacy Policy"
              >
                {privacypolicies?.map((pp) => (
                  <MenuItem key={pp.id} value={pp.id}>
                    {pp.content}
                  </MenuItem>
                ))}
              </Select>
              {errors.privacyPolicyId && touched.privacyPolicyId && (
                <FormHelperText>{errors.privacyPolicyId}</FormHelperText>
              )}
            </FormControl>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pt-2 pb-4">
      <FlexBox alignItems="center">
        <IconWrapper>
          <GroupSenior sx={{ color: "primary.main" }} />
        </IconWrapper>
        <Paragraph fontSize={20} fontWeight="bold">
          Create Event
        </Paragraph>
      </FlexBox>

      <Box p={4}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((item, index) => (
            <Step key={index}>
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
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Create Event" : "Next"}
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
}
