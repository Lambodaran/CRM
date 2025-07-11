import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Modal,
  CircularProgress,
  Alert,
  Paper,
  createTheme,
  ThemeProvider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  Tab,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/system";
import {
  Close,
  Add,
  Delete,
  Edit,
  Person,
  Today,
  Event,
  CheckCircle,
  ArrowDropDown,
  FilterList,
  Search,
  ViewWeek,
  ViewDay,
  ViewAgenda,
  CalendarViewMonth
} from "@mui/icons-material";
import { deepPurple, teal, orange, pink } from "@mui/material/colors";

const BASE_URL = "https://crm-bcgg.onrender.com";

// Modern theme with vibrant colors
const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[500],
    },
    secondary: {
      main: teal[500],
    },
    error: {
      main: pink[500],
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    body2: {
      fontSize: "0.875rem",
      color: "text.secondary",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        },
        contained: {
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

// Styled components
const GradientHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${teal[500]} 100%)`,
  color: "white",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const EventModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ModalContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  maxWidth: "600px",
  outline: "none",
  position: "relative",
  "&:focus": {
    outline: "none",
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  marginRight: theme.spacing(1),
  backgroundColor: orange[500],
}));

const EventTypeChip = styled(Chip)(({ theme, eventtype }) => ({
  marginRight: theme.spacing(1),
  backgroundColor:
    eventtype === "viewing"
      ? teal[100]
      : eventtype === "maintenance"
      ? orange[100]
      : deepPurple[100],
  color:
    eventtype === "viewing"
      ? teal[800]
      : eventtype === "maintenance"
      ? orange[800]
      : deepPurple[800],
  fontWeight: 500,
}));

const PropertyCalendar = () => {
  const [token, setToken] = useState("");
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startDate: "",
    endDate: "",
    targetUserId: "",
    eventType: "appointment",
    propertyId: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [view, setView] = useState("dayGridMonth");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [userFilter, setUserFilter] = useState("all");
  const calendarRef = useRef(null);

  // Get token and fetch data on component mount
  useEffect(() => {
    const storedToken = JSON.parse(sessionStorage.getItem("logindata"))?.token;
    if (!storedToken) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }
    setToken(storedToken);
    fetchData(storedToken);
  }, []);

  const fetchData = async (token) => {
    try {
      setLoading(true);
      await Promise.all([fetchEvents(token), fetchUsers(token)]);
    } catch (error) {
      // setError("Failed to fetch data. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/calender/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
      throw error;
    }
  };

  const fetchUsers = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      throw error;
    }
  };

  const handleDateClick = (arg) => {
    setNewEvent({
      title: "",
      startDate: arg.dateStr,
      endDate: arg.dateStr,
      targetUserId: "",
      eventType: "appointment",
      propertyId: "",
      description: "",
    });
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      startDate: info.event.startStr,
      endDate: info.event.endStr || info.event.startStr,
      targetUserId: info.event.extendedProps?.targetUserId || "",
      eventType: info.event.extendedProps?.eventType || "appointment",
      propertyId: info.event.extendedProps?.propertyId || "",
      description: info.event.extendedProps?.description || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedEvent && (!newEvent.title || !newEvent.startDate)) {
      alert("Please enter title and start date for new events.");
      return;
    }

    try {
      const url = selectedEvent
        ? `${BASE_URL}/api/calender/${selectedEvent.id}`
        : `${BASE_URL}/api/calender/`;

      const method = selectedEvent ? "PUT" : "POST";
      const eventData = selectedEvent || newEvent;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: eventData.title,
          startDate: eventData.startDate,
          endDate: eventData.endDate || eventData.startDate,
          targetUserId: eventData.targetUserId,
          eventType: eventData.eventType,
          propertyId: eventData.propertyId,
          description: eventData.description,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save event: ${response.status}`);
      }

      await fetchEvents(token);
      setModalOpen(false);
      setNewEvent({
        title: "",
        startDate: "",
        endDate: "",
        targetUserId: "",
        eventType: "appointment",
        propertyId: "",
        description: "",
      });
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save event. Please try again.");
    }
  };

  const handleDelete = () => {
    if (!selectedEvent) return;
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/calender/${selectedEvent.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.status}`);
      }

      await fetchEvents(token);
      setModalOpen(false);
      setSelectedEvent(null);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === "all" || 
      event.eventType === filter || 
      event.targetUserId === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewChange = (newView) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: theme.palette.background.default,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="h6" sx={{ ml: 2, color: "text.secondary" }}>
          Loading calendar...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: theme.palette.background.default,
          p: 2,
        }}
      >
        <Alert
          severity="error"
          sx={{ maxWidth: 500, width: "100%", borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setError(null)}>
              Dismiss
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          p: { xs: 1, sm: 3 },
        }}
      >
        <GradientHeader>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h2" sx={{ color: "white" }}>
                User Calendar
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Manage all property-related events and appointments
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              sx={{
                px: 4,
                py: 1.5,
                bgcolor: "white",
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.9)",
                },
              }}
              onClick={() => {
                setNewEvent({
                  title: "",
                  startDate: "",
                  endDate: "",
                  targetUserId: "",
                  eventType: "appointment",
                  propertyId: "",
                  description: "",
                });
                setSelectedEvent(null);
                setModalOpen(true);
              }}
            >
              New Event
            </Button>
          </Box>
        </GradientHeader>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search events..."
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ flex: 1, minWidth: 200 }}
                />
                <Select
                  size="small"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  displayEmpty
                  IconComponent={ArrowDropDown}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">All Events</MenuItem>
                  <MenuItem value="viewing">Viewings</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="appointment">Appointments</MenuItem>
                </Select>

                <Select
                  size="small"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  displayEmpty
                  IconComponent={ArrowDropDown}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">All Users</MenuItem>
                  {users.map(user => (
                    <MenuItem key={user._id} value={user._id}>{user.username}</MenuItem>
                  ))}
                </Select>

                <Box sx={{ display: "flex", ml: "auto", gap: 1 }}>
                  <Tooltip title="Month view">
                    <IconButton
                      color={view === 'dayGridMonth' ? 'primary' : 'default'}
                      onClick={() => handleViewChange('dayGridMonth')}
                    >
                      <CalendarViewMonth />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Week view">
                    <IconButton
                      color={view === 'timeGridWeek' ? 'primary' : 'default'}
                      onClick={() => handleViewChange('timeGridWeek')}
                    >
                      <ViewWeek />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Day view">
                    <IconButton
                      color={view === 'timeGridDay' ? 'primary' : 'default'}
                      onClick={() => handleViewChange('timeGridDay')}
                    >
                      <ViewDay />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="List view">
                    <IconButton
                      color={view === 'listWeek' ? 'primary' : 'default'}
                      onClick={() => handleViewChange('listWeek')}
                    >
                      <ViewAgenda />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, height: "100%" }}>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView={view}
                headerToolbar={false}
                dateClick={handleDateClick}
                events={filteredEvents.map((event) => ({
                  id: event._id || event.id,
                  title: event.title,
                  start: event.startDate,
                  end: event.endDate,
                  backgroundColor:
                    event.eventType === "viewing"
                      ? teal[500]
                      : event.eventType === "maintenance"
                      ? orange[500]
                      : deepPurple[500],
                  borderColor:
                    event.eventType === "viewing"
                      ? teal[500]
                      : event.eventType === "maintenance"
                      ? orange[500]
                      : deepPurple[500],
                  extendedProps: {
                    targetUserId: event.targetUserId,
                    eventType: event.eventType,
                    propertyId: event.propertyId,
                    description: event.description,
                  },
                }))}
                eventClick={handleEventClick}
                height="75vh"
                contentHeight="auto"
                aspectRatio={1.8}
              />
            </Paper>
          </Box>

          {!isMobile && (
            <Box sx={{ width: 300 }}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Upcoming Events
                </Typography>
                <Box sx={{ maxHeight: "calc(75vh - 56px)", overflowY: "auto" }}>
                  {filteredEvents
                    .filter((event) => new Date(event.startDate) >= new Date())
                    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                    .slice(0, 5)
                    .map((event) => (
                      <Box
                        key={event._id || event.id}
                        sx={{
                          mb: 2,
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor:
                            event.eventType === "viewing"
                              ? teal[50]
                              : event.eventType === "maintenance"
                              ? orange[50]
                              : deepPurple[50],
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor:
                              event.eventType === "viewing"
                                ? teal[100]
                                : event.eventType === "maintenance"
                                ? orange[100]
                                : deepPurple[100],
                          },
                        }}
                        onClick={() => {
                          setSelectedEvent({
                            id: event._id || event.id,
                            title: event.title,
                            startDate: event.startDate,
                            endDate: event.endDate || event.startDate,
                            targetUserId: event.targetUserId,
                            eventType: event.eventType,
                            propertyId: event.propertyId,
                            description: event.description,
                          });
                          setModalOpen(true);
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {event.title}
                          </Typography>
                          <Typography variant="caption">
                            {new Date(event.startDate).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {new Date(event.startDate).toLocaleDateString([], {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                        {event.targetUserId && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <UserAvatar>
                              {users.find((user) => user._id === event.targetUserId)
                                ?.username?.charAt(0) || "U"}
                            </UserAvatar>
                            <Typography variant="caption">
                              {
                                users.find((user) => user._id === event.targetUserId)
                                  ?.username || "Assigned"
                              }
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  {filteredEvents.filter((event) => new Date(event.startDate) >= new Date())
                    .length === 0 && (
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
                      No upcoming events
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Event Modal */}
        <EventModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedEvent(null);
          }}
        >
          <ModalContent>
            <IconButton
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "text.secondary",
              }}
              onClick={() => {
                setModalOpen(false);
                setSelectedEvent(null);
              }}
            >
              <Close />
            </IconButton>
            <Typography variant="h3" color="text.primary" sx={{ mb: 3 }}>
              {selectedEvent ? "Edit Event" : "New Event"}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Event Title"
                variant="outlined"
                fullWidth
                value={selectedEvent ? selectedEvent.title : newEvent.title}
                onChange={(e) =>
                  selectedEvent
                    ? setSelectedEvent({
                        ...selectedEvent,
                        title: e.target.value,
                      })
                    : setNewEvent({ ...newEvent, title: e.target.value })
                }
                helperText={
                  !selectedEvent && !newEvent.title ? "Title is required" : null
                }
                error={!selectedEvent && !newEvent.title}
              />

              

              {/* <Select
                value={
                  selectedEvent
                    ? selectedEvent.targetUserId
                    : newEvent.targetUserId
                }
                onChange={(e) =>
                  selectedEvent
                    ? setSelectedEvent({
                        ...selectedEvent,
                        targetUserId: e.target.value,
                      })
                    : setNewEvent({
                        ...newEvent,
                        targetUserId: e.target.value,
                      })
                }
                displayEmpty
                fullWidth
                variant="outlined"
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Assign to user</em>;
                  }
                  const user = users.find((user) => user._id === selected);
                  return (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <UserAvatar>
                        {user?.username?.charAt(0) || "U"}
                      </UserAvatar>
                      <Typography>{user?.username || "Unknown"}</Typography>
                    </Box>
                  );
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <UserAvatar sx={{ mr: 2 }}>
                        {user.username?.charAt(0) || "U"}
                      </UserAvatar>
                      <Box>
                        <Typography>{user.username}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select> */}

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Start Date"
                  type="datetime-local"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={
                    (selectedEvent
                      ? selectedEvent.startDate
                      : newEvent.startDate
                    )?.replace("Z", "") || ""
                  }
                  onChange={(e) =>
                    selectedEvent
                      ? setSelectedEvent({
                          ...selectedEvent,
                          startDate: e.target.value,
                        })
                      : setNewEvent({ ...newEvent, startDate: e.target.value })
                  }
                  helperText={
                    !selectedEvent && !newEvent.startDate
                      ? "Start date is required"
                      : null
                  }
                  error={!selectedEvent && !newEvent.startDate}
                />
                <TextField
                  label="End Date"
                  type="datetime-local"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={
                    (selectedEvent
                      ? selectedEvent.endDate
                      : newEvent.endDate
                    )?.replace("Z", "") || ""
                  }
                  onChange={(e) =>
                    selectedEvent
                      ? setSelectedEvent({
                          ...selectedEvent,
                          endDate: e.target.value,
                        })
                      : setNewEvent({ ...newEvent, endDate: e.target.value })
                  }
                />
              </Box>

              
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                gap: 2,
              }}
            >
              <Box>
                {selectedEvent && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedEvent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={selectedEvent ? <Edit /> : <Add />}
                  onClick={handleSubmit}
                  disabled={
                    !selectedEvent && (!newEvent.title || !newEvent.startDate)
                  }
                >
                  {selectedEvent ? "Update" : "Create"}
                </Button>
              </Box>
            </Box>
          </ModalContent>
        </EventModal>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the event{" "}
              <strong>"{selectedEvent?.title}"</strong>? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
              startIcon={<Delete />}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default PropertyCalendar;