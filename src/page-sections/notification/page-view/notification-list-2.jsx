import { useEffect, useState } from "react";
// MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import styled from "@mui/material/styles/styled";
// CUSTOM COMPONENTS
import { H6 } from "@/components/typography";
import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table";
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from "../SearchArea";
import useMuiTable, {
  getComparator,
  stableSort,
} from "@/hooks/useMuiTable";
// CUSTOM UTILS METHOD
import { isDark } from "@/utils/constants";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  getNotification
} from "@/store/apps/notification";
import toast from "react-hot-toast";
import HeadingArea from "../HeadingArea";
import { formatDate } from "@/utils/dateFormatter";
import { CardContent } from "@mui/material";

// STYLED COMPONENTS
const HeadTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 600,
  paddingBlock: 14,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  borderBottom: `1px solid ${theme.palette.grey[isDark(theme) ? 700 : 100]}`,
  "&:first-of-type": {
    paddingLeft: 24,
  },
  "&:last-of-type": {
    paddingRight: 24,
  },
}));

const BodyTableCell = styled(HeadTableCell)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 400,
  backgroundColor: "transparent",
  paddingBlock: 12,
  verticalAlign: "middle",
}));

const BodyTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  cursor: "pointer",
  ...(active && {
    backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  }),
}));

// NOTIFICATION TYPE ICONS
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import MailIcon from "@mui/icons-material/Mail";
import AlarmIcon from "@mui/icons-material/Alarm";
import CampaignIcon from "@mui/icons-material/Campaign";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AddNewNotificationPage from "@/pages/dashboard/notification/add-new-notification";
// import PromotionIcon from "@mui/icons-material/Promotion";

const getTypeIcon = (type) => {
  const iconMap = {
    like: <FavoriteIcon color="error" />,
    comment: <CommentIcon color="primary" />,
    mention: <AlternateEmailIcon color="info" />,
    new_follower: <PersonAddIcon color="success" />,
    new_activity: <DirectionsRunIcon color="warning" />,
    challenge_completed: <EmojiEventsIcon color="warning" />,
    challenge_reward: <CardGiftcardIcon color="secondary" />,
    challenge_invitation: <MailIcon color="info" />,
    challenge_reminder: <AlarmIcon color="error" />,
    event_announcement: <CampaignIcon color="primary" />,
    schedule_added: <EventAvailableIcon color="success" />,
    schedule_missed: <EventBusyIcon color="error" />,
    // marketing: <PromotionIcon color="secondary" />,
  };
  return iconMap[type] || <CampaignIcon color="primary" />;
};

const getTypeLabel = (type) => {
  const labelMap = {
    like: "Like",
    comment: "Comment",
    mention: "Mention",
    new_follower: "New Follower",
    new_activity: "New Activity",
    challenge_completed: "Challenge Completed",
    challenge_reward: "Challenge Reward",
    challenge_invitation: "Challenge Invitation",
    challenge_reminder: "Challenge Reminder",
    event_announcement: "Event Announcement",
    schedule_added: "Schedule Added",
    schedule_missed: "Schedule Missed",
    marketing: "Marketing",
  };
  return labelMap[type] || type;
};

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "Sr No",
    width: "8%",
  },
  {
    id: "title",
    numeric: true,
    disablePadding: false,
    label: "Title",
    width: "20%",
  },
  {
    id: "body",
    numeric: false,
    disablePadding: false,
    label: "Body",
    width: "10%",
  },
  {
    id: "type",
    numeric: true,
    disablePadding: false,
    label: "Type",
    width: "12%",
  },
  {
    id: "createdAt",
    numeric: true,
    disablePadding: false,
    label: "Date",
    width: "10%",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    width: "5%",
  },
 
];

export default function NotificationListPageView() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedNotification, setSelectedNotification] = useState();


  const {
    page,
    order,
    orderBy,
  } = useMuiTable({
    defaultOrderBy: "createdAt",
    defaultOrder: "desc",
    defaultRowsPerPage: 10,
  });

  const dispatch = useDispatch();
  const { notification } = useSelector(
    (state) => state.Notification || {}
  );

  useEffect(() => {
    dispatch(getNotification());
  }, [dispatch]);

  // Convert notification object to array
  const notificationArray = notification
    ? Object.values(notification)
    : [];

  // Filter notifications based on search
  const filteredNotification = stableSort(
    notificationArray,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (searchFilter) {
      return (
        item?.title
          ?.toLowerCase()
          .includes(searchFilter?.toLowerCase()) ||
        item?.body
          ?.toLowerCase()
          .includes(searchFilter?.toLowerCase())
      );
    }
    return true;
  });

  useEffect(() => {
    if (selectedNotification) {
      const updatedNotification = notificationArray?.find(
        (n) => n.id === selectedNotification.id
      );
      if (updatedNotification)
        setSelectedNotification(updatedNotification);
    } else {
      const firstNotification = notificationArray?.[0];
      if (firstNotification)
        setSelectedNotification(firstNotification);
    }
  }, [notificationArray, selectedNotification]);

  // const handleStatusToggle = async (
  //   notificationId,
  //   currentStatus
  // ) => {
  //   setLoadingStates((prev) => ({ ...prev, [notificationId]: true }));
  //   try {
  //     const updateData = {
  //       id: notificationId,
  //       data: {
  //         isActive: !currentStatus,
  //       },
  //     };

  //     const result = await dispatch(updateNotification(updateData));

  //     if (
  //       result.payload?.data?.status == 200 ||
  //       result.meta?.requestStatus === "fulfilled"
  //     ) {
  //       toast.success("Notification status updated successfully");
  //       await dispatch(getNotification());

  //       if (selectedNotification?.id === notificationId) {
  //         setSelectedNotification((prevSelected) => ({
  //           ...prevSelected,
  //           isActive: !currentStatus,
  //         }));
  //       }
  //     } else {
  //       toast.error("Status update failed");
  //     }
  //   } catch (error) {
  //     console.error("Error updating notification status:", error);
  //     toast.error("Failed to update status");
  //   } finally {
  //     setLoadingStates((prev) => ({
  //       ...prev,
  //       [notificationId]: false,
  //     }));
  //   }
  // };

  const handleOpenEditModal = (notification) => {
    setNotificationId(notification.id);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setNotificationId(null);
  };

  const handleOpenDeleteModal = (notification) => {
    setNotificationId(notification.id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setNotificationId(null);
  };

  const handleDelete = async () => {
    try {
      const result = await dispatch(
        // deleteNotification(notificationId)
      );
      if (result.meta?.requestStatus === "fulfilled") {
        await dispatch(getNotification());
        toast.success("Notification deleted successfully");
      } else {
        toast.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("An error occurred while deleting");
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleActionClick = (e, action, notification) => {
    e.stopPropagation();
    if (action === "edit") {
      handleOpenEditModal(notification);
    } else if (action === "delete") {
      handleOpenDeleteModal(notification);
    }
  };

  return (
    <div className="pt-2 pb-4">
   
          {/* <HeadingArea /> */}
          {/* <Grid container>
            <Grid size={{ xs: 12 }}>
              <Box>
                <SearchArea
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  gridRoute="/notifications-grid"
                  listRoute="/notifications-list"
                />
              </Box>

              <TableContainer
                sx={{
                  overflowX: { xs: "auto", md: "unset" },
                }}
              >
                <Scrollbar autoHide={false}>
                  <Table sx={{ tableLayout: "fixed", minWidth: 800 }}>
                    
                    <TableHead>
                      <TableRow>
                        {headCells.map((headCell) => (
                          <HeadTableCell
                            key={headCell.id}
                            align="left"
                            padding={
                              headCell.disablePadding
                                ? "none"
                                : "normal"
                            }
                            sortDirection={
                              orderBy === headCell.id ? order : false
                            }
                            width={headCell.width || "auto"}
                          >
                            {headCell.id === "actions" ||
                            headCell.id === "status" ? (
                              headCell.label
                            ) : (
                              <TableSortLabel
                                active={orderBy === headCell.id}
                                onClick={(e) =>
                                  handleRequestSort(e, headCell.id)
                                }
                                direction={
                                  orderBy === headCell.id
                                    ? order
                                    : "asc"
                                }
                              >
                                {headCell.label}
                              </TableSortLabel>
                            )}
                          </HeadTableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    
                    <TableBody>
                      {filteredNotification
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((notification, ind) => {
                          return (
                            <BodyTableRow
                              key={notification.id}
                              active={
                                selectedNotification?.id ===
                                notification.id
                                  ? 1
                                  : 0
                              }
                              onClick={() =>
                                setSelectedNotification(notification)
                              }
                            >
                              <BodyTableCell align="left">
                                {page * rowsPerPage + ind + 1}
                              </BodyTableCell>

                              <BodyTableCell align="left">
                                <H6
                                  fontSize={14}
                                  color={"text.primary"}
                                  fontWeight={500}
                                >
                                  {notification.title}
                                </H6>
                              </BodyTableCell>

                              <BodyTableCell align="left">
                                <Box sx={{ fontSize: 13 }}>
                                  {notification.body.length > 80
                                    ? `${notification.body.substring(0, 80)}...`
                                    : notification.body}
                                </Box>
                              </BodyTableCell>

                              <BodyTableCell align="center">
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                  gap={1}
                                >
                                  {getTypeIcon(notification.type)}
                                  <Chip
                                    label={getTypeLabel(
                                      notification.type
                                    )}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Stack>
                              </BodyTableCell>

                              <BodyTableCell align="left">
                                {formatDate(notification.createdAt)}
                              </BodyTableCell>

                              
                              <BodyTableCell align="center">
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="center"
                                  spacing={1}
                                >
                                  {loadingStates[notification.id] ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <Switch
                                      checked={
                                        notification?.isActive ||
                                        false
                                      }
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        // handleStatusToggle(
                                        //   notification.id,
                                        //   notification.isActive
                                        // );
                                      }}
                                      size="small"
                                      color="success"
                                    />
                                  )}
                                </Stack>
                              </BodyTableCell>

                              
                            </BodyTableRow>
                          );
                        })}

                      {filteredNotification.length === 0 && (
                        <TableDataNotFound />
                      )}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={filteredNotification.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid> */}
          <AddNewNotificationPage/>

      
    
    </div>
  );
}
