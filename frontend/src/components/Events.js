import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaPlus, FaInfoCircle, FaTimes, FaCalendarAlt, FaListUl, FaEdit, FaPaperPlane, FaTrash, FaMapMarkerAlt, FaCheck, FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import moment from 'moment';
import './Events.css';
import api from '../services/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEventForm } from '../hooks/useEventForm';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';

const localizer = momentLocalizer(moment);

// Custom toolbar component for the calendar
const CustomToolbar = ({ label, onNavigate, onView }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('PREV')}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-4 py-2 rounded-lg bg-[#1a365d] text-white hover:bg-[#2b6cb0] transition-colors font-medium"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
        >
          <FaChevronRight />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">{label}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView('month')}
          className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900 font-medium"
        >
          Month
        </button>
        <button
          onClick={() => onView('week')}
          className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900 font-medium"
        >
          Week
        </button>
        <button
          onClick={() => onView('day')}
          className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900 font-medium"
        >
          Day
        </button>
        <button
          onClick={() => onView('agenda')}
          className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900 font-medium"
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

// Mock data for when API calls fail
const MOCK_EVENTS = [
  {
    _id: '507f1f77bcf86cd799439013', // Valid MongoDB ObjectId
    title: "Technical Workshop on AI",
    description: "Learn about the latest advancements in Artificial Intelligence and Machine Learning.",
    date: moment().format('YYYY-MM-DD'),
    startTime: "10:00",
    endTime: "13:00",
    venue: "Seminar Hall 1",
    organizer: "CSE Department",
    circularGenerated: false,
    status: "approved"
  },
  {
    _id: '507f1f77bcf86cd799439014', // Valid MongoDB ObjectId
    title: "Cultural Fest - Shruthi",
    description: "Annual cultural festival with music, dance, and art performances.",
    date: moment().add(1, 'days').format('YYYY-MM-DD'),
    startTime: "09:00",
    endTime: "18:00",
    venue: "College Auditorium",
    organizer: "Student Council",
    circularGenerated: false,
    status: "pending"
  },
  {
    _id: '507f1f77bcf86cd799439015', // Valid MongoDB ObjectId
    title: "Industry Connect Program",
    description: "Connect with industry professionals and learn about career opportunities.",
    date: moment().add(2, 'days').format('YYYY-MM-DD'),
    startTime: "14:00",
    endTime: "17:00",
    venue: "Conference Hall",
    organizer: "Training & Placement Cell",
    circularGenerated: true,
    status: "head_approved"
  },
  {
    _id: '507f1f77bcf86cd799439016', // Valid MongoDB ObjectId
    title: "Blockchain Seminar",
    description: "Introduction to blockchain technology and its applications in various industries.",
    date: moment().add(3, 'days').format('YYYY-MM-DD'),
    startTime: "11:00",
    endTime: "14:00",
    venue: "Seminar Hall 2",
    organizer: "IT Department",
    circularGenerated: false,
    status: "approved"
  }
];

function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user, isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now()); // eslint-disable-line no-unused-vars
  const initialEventState = useMemo(() => ({
    title: '',
    description: '',
    date: moment().format('YYYY-MM-DD'),
    startTime: '10:00',
    endTime: '12:00',
    venue: '',
    organizer: '',
    image: null
  }), []);
  const { 
    formState: newEvent, 
    handleInputChange, 
    handleDateSelect: setEventDate,
    resetForm: resetEventForm,
    setField
  } = useEventForm(initialEventState);
  const permissions = usePermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(!!localStorage.getItem('token'));
  const [showAuthBanner, setShowAuthBanner] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmation, setConfirmation] = useState('');

  // Add debugging logs
  console.log('Auth State:', {
    isAuthenticated,
    user,
    userRole: user?.role || localStorage.getItem('userRole'),
    canCreateEvent: permissions.canCreateEvent(),
    permissions: {
      create: permissions.canCreateEvent(),
      edit: permissions.canEditEvent(),
      delete: permissions.canDeleteEvent()
    }
  });

  // Helper function to merge events from server and local storage
  const mergeEvents = (serverEvents, localEvents) => {
    // Start with all server events
    const merged = [...serverEvents];
    
    // Add local events that don't exist on the server
    localEvents.forEach(localEvent => {
      // Local events have mock IDs that start with 'mock_'
      if (localEvent._id && localEvent._id.startsWith('mock_')) {
        // This is definitely a local event, so add it
        merged.push(localEvent);
      } else {
        // Check if this event exists in server events
        const exists = serverEvents.some(serverEvent => 
          serverEvent._id === localEvent._id
        );
        
        // If it doesn't exist on the server, add the local version
        if (!exists) {
          merged.push(localEvent);
        }
        // If it exists, we already have the server version which takes precedence
      }
    });
    
    return merged;
  };

  // Memoize the event formatter to prevent unnecessary re-renders
  const formatEvents = useCallback((events) => {
    return events.map(event => {
      try {
        // Parse dates from ISO strings
        let startDate, endDate;
        
        // Handle startTime
        startDate = event.startTime ? new Date(event.startTime) : null;
        if (!startDate || isNaN(startDate.getTime())) {
          // Fallback to combining date and time if not a valid ISO string
          const dateStr = event.date?.split('T')[0] || event.date;
          startDate = new Date(`${dateStr}T${event.startTime}`);
        }
        
        // Handle endTime
        endDate = event.endTime ? new Date(event.endTime) : null;
        if (!endDate || isNaN(endDate.getTime())) {
          // Fallback to combining date and time if not a valid ISO string
          const dateStr = event.date?.split('T')[0] || event.date;
          endDate = new Date(`${dateStr}T${event.endTime}`);
        }

        // Validate the dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.error('Invalid date/time format for event:', event);
          return null;
        }

        return {
          ...event,
          start: startDate,
          end: endDate,
          title: event.title || 'Untitled Event',
          allDay: false
        };
      } catch (error) {
        console.error('Error formatting event:', error, event);
        return null;
      }
    }).filter(event => event !== null); // Filter out any invalid events
  }, []);

  // Optimize event loading with useCallback
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load local events first
      let localStorageEvents = [];
      try {
        const localEventsJSON = localStorage.getItem('localEvents');
        if (localEventsJSON) {
          localStorageEvents = JSON.parse(localEventsJSON);
        }
      } catch (localStorageError) {
        console.error('Error loading from localStorage:', localStorageError);
      }
      
      // Check online status and authentication
      const isOnline = navigator.onLine;
      const token = localStorage.getItem('token');
      const isAuthenticated = !!token;
      
      let serverEvents = [];
      
      // Only fetch from server if online (removed authentication check)
      if (isOnline) {
        try {
          const response = await api.get('/events');
          serverEvents = response.data.data || [];
          console.log('[DEBUG] Events loaded from backend:', serverEvents);
        } catch (error) {
          console.error('Error fetching events:', error);
          if (!localStorageEvents.length) {
            setError('Error loading events. Using sample data.');
            serverEvents = MOCK_EVENTS;
          }
        }
      }
      
      // Combine and format events
      const allEvents = mergeEvents(serverEvents, localStorageEvents);
      const formattedEvents = formatEvents(allEvents);
      // Filter out events whose date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filteredEvents = formattedEvents.filter(event => {
        // event.date may be a string or Date, so normalize
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      });
      console.log('[DEBUG] Events after formatting:', formattedEvents);
      setEvents(filteredEvents);
      
      // Update localStorage if needed
      if (serverEvents.length > 0 && localStorageEvents.length === 0) {
        localStorage.setItem('localEvents', JSON.stringify(serverEvents));
      }
    } catch (error) {
      console.error('Error in loadEvents:', error);
      setError('Error displaying events. Please try refreshing.');
    } finally {
      setIsLoading(false);
    }
  }, [formatEvents]);

  // Check if user has management permissions
  const canManageEvents = isAuthenticated && (
    permissions.canCreateEvent() || 
    permissions.canEditEvent() || 
    permissions.checkPermission('edit_own_event') || 
    permissions.canDeleteEvent() || 
    permissions.checkPermission('delete_own_event')
  );

  // Updated function to handle event deletion and update localStorage
  const handleDeleteEvent = async (eventId) => {
    // First check if user is authenticated
    if (!isAuthenticated) {
      alert('You must be logged in to delete events.');
      return;
    }
    
    try {
      // If it's a mock event (starts with 'mock_'), just remove it from localStorage
      if (eventId.toString().startsWith('mock_')) {
        // Filter out the event from state
        const updatedEvents = events.filter(event => event._id !== eventId);
        setEvents(updatedEvents);
        
        // Update localStorage
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
        const updatedLocalEvents = localEvents.filter(event => event._id !== eventId);
        localStorage.setItem('localEvents', JSON.stringify(updatedLocalEvents));
        
        return;
      }
      
      // Otherwise, try to delete from the API
      const response = await api.delete(`/events/${eventId}`);

      if (response.data.success) {
        loadEvents(); // Use loadEvents directly instead of fetchEvents
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  // Fix the useEffect dependency warning
  useEffect(() => {
    loadEvents(); // Use loadEvents directly instead of fetchEventsCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateCircular = async (eventId) => {
    // First check if user is authenticated
    if (!isAuthenticated) {
      alert('You must be logged in to generate circulars.');
      return;
    }
    
    try {
      // Check if this is a mock/local event (starts with 'mock_')
      if (eventId.toString().startsWith('mock_')) {
        // For mock events, just update the UI locally
        const updatedEvents = events.map(e => 
          e._id === eventId ? { ...e, circularGenerated: true } : e
        );
        setEvents(updatedEvents);
        
        if (selectedEvent && selectedEvent._id === eventId) {
          setSelectedEvent({...selectedEvent, circularGenerated: true});
        }
        
        // Update localStorage to persist the circular status
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
        const updatedLocalEvents = localEvents.map(e => 
          e._id === eventId ? { ...e, circularGenerated: true } : e
        );
        localStorage.setItem('localEvents', JSON.stringify(updatedLocalEvents));
        
        // Navigate to circular page directly
        navigate(`/circular/${eventId}`);
        return;
      }
      
      // For real events, use the API endpoint
      const response = await api.post(`/events/${eventId}/circular`);
      
      if (response.data && response.data.success) {
        // Update the local state to reflect circular status
        const updatedEvents = events.map(e => 
          e._id === eventId ? { ...e, circularGenerated: true } : e
        );
        setEvents(updatedEvents);
        
        if (selectedEvent && selectedEvent._id === eventId) {
          setSelectedEvent({...selectedEvent, circularGenerated: true});
        }
        
        // Navigate to circular page
        navigate(`/circular/${eventId}`);
      } else {
        throw new Error(response.data?.message || 'Failed to generate circular');
      }
    } catch (error) {
      console.error('Error generating circular:', error);
      if (error.response?.status === 400) {
        alert('A circular already exists for this event.');
      } else {
        alert('Error generating circular. Please try again.');
      }
    }
  };

  // Memoize event handlers
  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  }, []);

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setEventDate(date);
  }, [setEventDate]);

  // Optimize event submission
  const handleSubmitEvent = useCallback(async (formData) => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.venue) {
        alert('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Format date and time in ISO format
      const date = moment(formData.date).format('YYYY-MM-DD');
      const startDateTime = moment(`${date}T${formData.startTime}`).toISOString();
      const endDateTime = moment(`${date}T${formData.endTime}`).toISOString();
      
      // Format event data
      const eventData = {
        ...formData,
        date: date,
        startTime: startDateTime,
        endTime: endDateTime,
        organizer: formData.organizer || localStorage.getItem('userEmail') || 'Current User',
        status: 'approved',
        category: formData.category || 'Technical'
      };

      // Handle online/offline submission
      const isOnline = navigator.onLine;
      let serverSuccess = false;
      let createdEvent = null;
      
      if (isOnline) {
        try {
          const response = await api.post('/events', eventData);
          createdEvent = response.data;
          serverSuccess = true;
        } catch (error) {
          console.error('Error creating event:', error);
        }
      }
      
      // Update UI based on submission result
      if (serverSuccess && createdEvent) {
        const calendarEvent = formatEvents([createdEvent])[0];
        setEvents(prevEvents => [...prevEvents, calendarEvent]);
        setSelectedDate(new Date(eventData.date)); // Auto-navigate to event month
        alert('Event scheduled successfully!');
      } else {
        const mockId = 'mock_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const mockEvent = {
          _id: mockId,
          ...eventData,
          ...formatEvents([eventData])[0],
          circularGenerated: false
        };
        setEvents(prevEvents => [...prevEvents, mockEvent]);
        setSelectedDate(new Date(eventData.date)); // Auto-navigate to event month
        // Update localStorage
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
        localStorage.setItem('localEvents', JSON.stringify([...localEvents, mockEvent]));
        alert('Event saved locally. Will sync when online.');
      }
    } catch (error) {
      console.error('Error in handleSubmitEvent:', error);
      alert('Error creating event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formatEvents]);

  // Add debug output for events data when events change
  useEffect(() => {
    console.log('Current events list:', events);
  }, [events]);

  // Listen for auth-related events
  useEffect(() => {
    const handleNetworkError = (event) => {
      console.log('Network error event received');
      setError(true);
    };
    
    const handleSessionExpired = () => {
      setShowAuthBanner(true);
      setAuthMessage('Your session has expired. Please log in again to create or modify events.');
      // Update authentication state
      setIsAuthenticatedState(false);
    };
    
    window.addEventListener('api:networkError', handleNetworkError);
    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('api:networkError', handleNetworkError);
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
    };
  }, []);
  
  // Monitor authentication state changes
  useEffect(() => {
    const checkAuth = () => {
      const hasToken = !!localStorage.getItem('token');
      if (hasToken !== isAuthenticatedState) {
        setIsAuthenticatedState(hasToken);
        if (hasToken) {
          setShowAuthBanner(false);
        }
      }
    };
    
    // Check on interval to catch changes from other tabs/windows
    const authCheckInterval = setInterval(checkAuth, 5000);
    
    // Also check on window focus
    const handleFocus = () => checkAuth();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(authCheckInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticatedState]);

  // Add/update the online/offline event handlers
  useEffect(() => {
    loadEvents();
    
    // Set up event listeners for online/offline status
    const handleOnline = () => {
      console.log('Connection restored - reloading events');
      setError(null);
      loadEvents();
    };
    
    const handleOffline = () => {
      console.log('Device went offline');
      setError('You are currently offline. Showing cached events.');
    };
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set up periodic sync timer (every 5 minutes) when online
    const syncInterval = setInterval(() => {
      if (navigator.onLine) {
        console.log('Periodic sync check');
        loadEvents();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, [loadEvents]);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  useEffect(() => {
    // Check for ?refresh=1 in the URL
    const params = new URLSearchParams(location.search);
    if (params.get('refresh') === '1') {
      loadEvents();
      // Remove the query param for a clean URL
      params.delete('refresh');
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
    // Show confirmation if created param is present
    if (params.get('created') === '1') {
      setConfirmation('Event created successfully!');
      setTimeout(() => setConfirmation(''), 3000);
      params.delete('created');
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
  }, [location.search, loadEvents, navigate, location.pathname]);

  // Move EventDetailsModal inside Events so it has access to all needed variables
  const EventDetailsModal = () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : moment(date).format('MMMM D, YYYY h:mm A');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedEvent?.title}</h2>
              <button
                onClick={() => setShowEventDetails(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaCalendarAlt className="text-[#1a365d] mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="text-gray-800">
                    {formatDate(selectedEvent?.startTime || selectedEvent?.start)} - {formatDate(selectedEvent?.endTime || selectedEvent?.end)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#1a365d] mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-800">{selectedEvent?.venue}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedEvent?.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedEvent?.status === 'approved' ? 'bg-green-100 text-green-800' :
                  selectedEvent?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedEvent?.status?.charAt(0).toUpperCase() + selectedEvent?.status?.slice(1)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              {canManageEvents && (
                <>
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent?._id)}
                    className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                  >
                    <FaTrash className="text-white" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => handleGenerateCircular(selectedEvent?._id)}
                    className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                  >
                    <FaEdit className="text-white" />
                    <span>Generate Circular</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)' }}>
      <div className='mb-10 text-center'>
        <h1 className="text-5xl font-bold text-[#1a365d] mb-6 text-center w-full">Discover & Manage Events</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Explore upcoming events, manage your registrations, and stay connected with the CBIT community.</p>
      </div>
      {/* Add Schedule Event button */}
      {isAuthenticated && permissions.canCreateEvent() && (
        <div className="flex justify-center mb-8">
          <Link
            to="/events/create"
            className="px-6 py-3 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2 shadow-lg"
          >
            <FaPlus className="text-white" />
            <span>Schedule Event</span>
          </Link>
        </div>
      )}
      {/* Centered and enlarged toggle */}
      <div className="flex justify-center w-full mb-12">
        <div className="flex bg-gray-100 rounded-2xl p-2 shadow-md w-auto">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-6 py-2.5 rounded-lg transition-all font-semibold text-lg flex items-center gap-2
              ${viewMode === 'calendar'
                ? 'bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white shadow-lg'
                : 'text-gray-700 hover:bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] hover:text-white'}
            `}
          >
            <FaCalendarAlt className="text-xl" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-6 py-2.5 rounded-lg transition-all font-semibold text-lg flex items-center gap-2
              ${viewMode === 'list'
                ? 'bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white shadow-lg'
                : 'text-gray-700 hover:bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] hover:text-white'}
            `}
          >
            <FaListUl className="text-xl" />
            List
          </button>
        </div>
      </div>

      {/* Notification banners container */}
      <div className="max-w-4xl mx-auto w-full">
        {/* Authentication expired banner */}
        {showAuthBanner && (
          <div className="notification notification-warning mb-8 flex justify-center text-center">
            <FaInfoCircle className="text-amber-500 mt-0.5 mr-3" />
            <div>
              <p className="text-sm">
                {authMessage} <a href="/auth" className="underline font-medium">Sign in</a>
              </p>
            </div>
            <button 
              onClick={() => setShowAuthBanner(false)} 
              className="ml-auto text-amber-500 hover:text-amber-700"
            >
              <FaTimes />
            </button>
          </div>
        )}
        {/* Banner for unauthorized users */}
        {!isAuthenticated && (
          <div className="notification notification-info mb-8 flex justify-center text-center">
            <FaInfoCircle className="text-blue-500 mt-0.5 mr-3" />
            <div>
              <p className="text-sm">
                You are viewing events as a guest. <a href="/auth" className="underline font-medium">Sign in</a> as an authorized user to schedule, edit, or delete events.
              </p>
            </div>
          </div>
        )}
        {/* Offline Notification */}
        {!isOnline && (
          <div className="notification notification-error mb-8 flex justify-center text-center">
            <FaInfoCircle className="text-red-500 mt-0.5 mr-3" />
            <div>
              <p className="text-sm font-semibold">
                You are currently offline.
              </p>
              <p className="text-sm">
                Events can be viewed and created locally, but changes won't sync until you're back online.
              </p>
            </div>
          </div>
        )}
        {/* Error Notification */}
        {error && isOnline && (
          <div className="notification notification-warning mb-8 flex justify-center text-center">
            <div>
              <p className="text-sm">
                {events && events.length > 0 ? 
                  "Note: Currently displaying sample event data. Some features may be limited until connection to the server is restored." :
                  "Error: Unable to connect to the server. Please check your connection or try again later."}
              </p>
            </div>
          </div>
        )}
      </div>

      {confirmation && (
        <div className="flex justify-center w-full mb-6">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow max-w-md w-full text-center">
            <p className="text-green-700 font-medium">{confirmation}</p>
          </div>
        </div>
      )}

      {viewMode === 'calendar' ? (
        <div className="flex justify-center w-full">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 max-w-4xl w-full mx-auto">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor={(event) => new Date(event.start || event.startTime)}
              endAccessor={(event) => new Date(event.end || event.endTime)}
              date={selectedDate}
              onNavigate={(date) => setSelectedDate(date)}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
              onSelectEvent={handleEventClick}
              selectable={true}
              onSelectSlot={handleDateSelect}
              popup={true}
              eventPropGetter={(event) => ({
                style: {
                  background: event.status === 'pending' ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' : 
                              event.status === 'head_approved' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 
                              event.status === 'approved' ? 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)' : 
                              'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                  border: 'none',
                  color: 'white',
                  display: 'block',
                  padding: '4px 8px',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  width: '100%',
                  height: 'auto',
                  minHeight: '24px',
                  margin: '2px 0'
                }
              })}
              components={{
                toolbar: CustomToolbar
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-6xl mx-auto">
            {Array.isArray(events) && events.length > 0 ? (
              events.map((event) => (
                <div
                  key={`${event._id}-${refreshTimestamp}`}
                  className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 max-w-sm w-full mx-auto flex flex-col justify-between min-h-[260px]"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">{event.title}</h2>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="text-[#1a365d] mr-2" />
                        <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaInfoCircle className="text-[#1a365d] mr-2" />
                        <span className="text-sm">{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="text-[#1a365d] mr-2" />
                        <span className="text-sm line-clamp-1">{event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleEventClick(event)}
                        className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                      >
                        View Details
                      </button>
                      
                      {canManageEvents && (
                        <div className="flex space-x-2">
                          {(permissions.canEditEvent() || 
                            (permissions.checkPermission('edit_own_event') && 
                             event.organizer === user?.id)) && (
                            <Link
                              to={`/events/edit/${event._id}`}
                              className="p-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all rounded-lg"
                              title="Edit Event"
                            >
                              <FaEdit className="text-white" />
                            </Link>
                          )}
                          {(permissions.canDeleteEvent() || 
                            (permissions.checkPermission('delete_own_event') && 
                             event.organizer === user?.id)) && (
                            <button
                              onClick={() => handleDeleteEvent(event._id)}
                              className="p-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all rounded-lg"
                              title="Delete Event"
                            >
                              <FaTrash className="text-white" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <FaCalendarAlt className="text-4xl text-gray-400" />
                  <p className="text-xl text-gray-500 font-medium">No events found</p>
                  <p className="text-sm text-gray-400">There are no events scheduled at this time</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Render Event Details */}
      {showEventDetails && <EventDetailsModal />}
    </div>
  );
}

export default Events;