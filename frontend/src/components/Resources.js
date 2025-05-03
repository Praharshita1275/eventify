import React, { useState, useEffect } from 'react';
import { 
  FaInfoCircle, FaCalendarAlt, 
  FaMapMarkerAlt, FaUsers, FaClock, FaCheck, FaBuilding, 
  FaSearch, FaTimes, FaUser
} from 'react-icons/fa';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../config/roles';
import moment from 'moment';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Resources() {
  // Fetch facilities from backend
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Selected items for modals
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showFacilityDetails, setShowFacilityDetails] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  
  // Booking validation state
  const [bookingErrors, setBookingErrors] = useState({
    hasTimeConflict: false,
    hasUserConflict: false,
    errorMessage: ''
  });
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    eventTitle: '',
    contactEmail: '',
    purpose: '',
    startDate: moment().format('YYYY-MM-DD'),
    startTime: '09:00',
    endDate: moment().format('YYYY-MM-DD'),
    endTime: '11:00',
    notes: ''
  });
  
  // Filters for facilities
  const [facilityFilter, setFacilityFilter] = useState({
    type: '',
    capacity: '',
    search: ''
  });
  
  const { user, isAuthenticated } = useAuth();
  const permissions = usePermissions();

  // eslint-disable-next-line no-unused-vars
  const canManageResources = isAuthenticated && (
    permissions.canCreateResource() || 
    permissions.canEditResource() || 
    permissions.checkPermission('edit_own_resource') || 
    permissions.canDeleteResource() || 
    permissions.checkPermission('delete_own_resource')
  );
  
  // Check if user has unbooking permissions (own bookings or admins)
  const canUnbookResource = (booking) => {
    if (!isAuthenticated) return false;
    
    // Allow users to cancel their own bookings
    if (booking.bookedBy === user?.email) return true;
    
    // Allow admins to cancel any booking
    if (user?.role === ROLES.ADMIN) return true;
    
    return false;
  };
  
  // Handle viewing facility details
  const handleFacilityClick = (facility) => {
    setSelectedFacility(facility);
    setShowFacilityDetails(true);
  };
  
  // Handle showing the booking form
  const handleBookFacility = () => {
    // Pre-fill the form with user's email if authenticated
    setBookingForm({
      ...bookingForm,
      contactEmail: user?.email || ''
    });
    setShowBookingForm(true);
  };
  
  // Handle changes to the booking form
  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...bookingForm,
      [name]: value
    };
    setBookingForm(newFormData);
    
    // Clear previous errors
    setBookingErrors({
      hasTimeConflict: false,
      hasUserConflict: false,
      errorMessage: ''
    });
    
    // Only validate if we have all date/time fields and a facility selected
    if (
      newFormData.startDate && 
      newFormData.startTime && 
      newFormData.endDate && 
      newFormData.endTime && 
      selectedFacility
    ) {
      // Check for time conflicts
      validateBookingTime(
        selectedFacility._id,
        `${newFormData.startDate}T${newFormData.startTime}:00`,
        `${newFormData.endDate}T${newFormData.endTime}:00`,
        user?.email || newFormData.contactEmail
      );
    }
  };
  
  // Validate booking time for conflicts
  const validateBookingTime = (facilityId, startTime, endTime, userEmail) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    // Basic validation: start must be before end
    if (startDate >= endDate) {
      setBookingErrors({
        hasTimeConflict: true,
        hasUserConflict: false,
        errorMessage: 'End time must be after start time'
      });
      return false;
    }
    
    // Check if the booking is in the past
    if (startDate < new Date()) {
      setBookingErrors({
        hasTimeConflict: true,
        hasUserConflict: false,
        errorMessage: 'Cannot book resources in the past'
      });
      return false;
    }
    
    // Check for facility conflicts
    const facilityConflicts = bookings.filter(booking => {
      if (booking.resourceId !== facilityId) return false;
      
      const bookingStartDate = new Date(booking.startDate);
      const bookingEndDate = new Date(booking.endDate);
      
      return (startDate < bookingEndDate && endDate > bookingStartDate);
    });
    
    if (facilityConflicts.length > 0) {
      setBookingErrors({
        hasTimeConflict: true,
        hasUserConflict: false,
        errorMessage: 'This time slot is already booked for this facility'
      });
      return false;
    }
    
    // Check for user double-booking conflicts
    const userConflicts = bookings.filter(booking => {
      if (booking.bookedBy !== userEmail) return false;
      
      const bookingStartDate = new Date(booking.startDate);
      const bookingEndDate = new Date(booking.endDate);
      
      return (startDate < bookingEndDate && endDate > bookingStartDate);
    });
    
    if (userConflicts.length > 0) {
      setBookingErrors({
        hasTimeConflict: false,
        hasUserConflict: true,
        errorMessage: 'You already have another booking during this time'
      });
      return false;
    }
    
    return true;
  };
  
  // Handle submitting a booking (create in backend)
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedFacility) return;
    const startDateTime = `${bookingForm.startDate}T${bookingForm.startTime}:00`;
    const endDateTime = `${bookingForm.endDate}T${bookingForm.endTime}:00`;
    const userEmail = user?.email || bookingForm.contactEmail;
    const isValid = validateBookingTime(
      selectedFacility._id,
      startDateTime,
      endDateTime,
      userEmail
    );
    if (!isValid) return;
    const newBooking = {
      resourceId: selectedFacility._id,
      eventTitle: bookingForm.eventTitle,
      bookedBy: userEmail,
      contactEmail: bookingForm.contactEmail,
      startDate: startDateTime,
      endDate: endDateTime,
      notes: bookingForm.notes,
      status: 'confirmed'
    };
    try {
      const response = await api.post('/bookings', newBooking);
      const data = await response.data;
      if (data.success) {
        setBookings([...bookings, data.data]);
        setShowBookingForm(false);
        setShowFacilityDetails(false);
        alert('Booking confirmed successfully! You can view your booking details in the "Your Bookings" section.');
      } else {
        alert('Failed to create booking: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    }
  };
  
  // Handle cancelling a booking (delete in backend)
  const confirmCancelBooking = async () => {
    if (!selectedBooking) return;
    try {
      const response = await api.delete(`/bookings/${selectedBooking._id || selectedBooking.id}`);
      const data = await response.data;
      if (data.success) {
        setBookings(bookings.filter(booking => (booking._id || booking.id) !== (selectedBooking._id || selectedBooking.id)));
        setShowCancellationModal(false);
        alert('Booking has been cancelled successfully.');
      } else {
        alert('Failed to cancel booking: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to cancel booking. Please try again.');
      console.error('Cancel booking error:', err);
    }
  };
  
  // Handle facility filtering
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFacilityFilter({
      ...facilityFilter,
      [name]: value
    });
  };
  
  // Apply filters to facilities
  const filteredFacilities = Array.isArray(facilities) ? facilities.filter(facility => {
    // Filter by type
    if (facilityFilter.type && facility.type !== facilityFilter.type) {
      return false;
    }
    
    // Filter by capacity
    if (facilityFilter.capacity) {
      const capacity = parseInt(facilityFilter.capacity);
      if (facility.capacity < capacity) {
        return false;
      }
    }
    
    // Filter by search term
    if (facilityFilter.search) {
      const searchTerm = facilityFilter.search.toLowerCase();
      return (
        facility.name.toLowerCase().includes(searchTerm) ||
        facility.location.toLowerCase().includes(searchTerm) ||
        facility.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  }) : [];
  
  // Get bookings for a specific facility
  const getFacilityBookings = (facilityId) => {
    return bookings.filter(booking => booking.resourceId === facilityId);
  };

  // Get all bookings for display
  const getAllBookings = () => {
    return bookings.map(booking => {
      const facility = facilities.find(f => f._id === booking.resourceId);
      return {
        ...booking,
        facilityName: facility ? facility.name : 'Unknown Facility',
        facilityLocation: facility ? facility.location : ''
      };
    });
  };
  
  // Get user's bookings
  const getUserBookings = () => {
    if (!isAuthenticated) return [];
    return getAllBookings().filter(booking => booking.bookedBy === user?.email);
  };

  // Fetch facilities and bookings from backend
  useEffect(() => {
    setLoading(true);
    // Only include non-empty filters in queryParams
    const queryParams = {};
    if (facilityFilter.type) queryParams.type = facilityFilter.type;
    if (facilityFilter.capacity) queryParams.capacity = parseInt(facilityFilter.capacity);
    if (facilityFilter.search) queryParams.search = facilityFilter.search;
    api.get('/resources', { params: queryParams })
      .then(({ data }) => {
        const facilitiesArray = Array.isArray(data.data) ? data.data : [];
        setFacilities(facilitiesArray);
        setLoading(false);
      })
      .catch(err => {
        setFacilities([]);
        setError(true);
        setLoading(false);
      });
    api.get('/bookings')
      .then(({ data }) => {
        const bookingsArray = Array.isArray(data.data) ? data.data : [];
        setBookings(bookingsArray);
      })
      .catch(() => setBookings([]));
  }, [facilityFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not authenticated, show login prompt instead of resources
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Restricted</h1>
            <div className="text-amber-500 text-6xl mb-4">
              <FaInfoCircle className="inline" />
            </div>
            <p className="text-gray-600 mb-4">
              The Resources page is only available to authorized users. Please log in to view and book campus facilities.
            </p>
            <Link 
              to="/login" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Log In to Access Resources
            </Link>
            <p className="text-gray-500 mt-4 text-sm">
              Don't have an account? Contact your administrator for access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancellationModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-5xl font-bold text-[#1a365d] mb-6 text-center w-full">CBIT Facilities</h1>
      </div>

      {/* Banner for unauthorized users */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <FaInfoCircle className="text-blue-500 mt-0.5 mr-3" />
            <div>
              <p className="text-sm text-blue-700">
                You are viewing facilities as a guest. Sign in as an authorized user to book facilities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* How To Guide - for all users */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">How to Book or Cancel a Resource</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-green-600 font-medium mb-2 flex items-center">
              <FaCalendarAlt className="mr-2" />
              Booking a Resource
            </div>
            <p className="text-sm text-gray-600">
              Browse available facilities below, select one that meets your needs, and click the "BOOK NOW" button to reserve it for your event.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-red-600 font-medium mb-2 flex items-center">
              <FaTimes className="mr-2" />
              Cancelling a Booking
            </div>
            <p className="text-sm text-gray-600">
              Find your booking in the "Your Bookings" table above and click the "Cancel" button to remove your reservation.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-blue-600 font-medium mb-2 flex items-center">
              <FaCheck className="mr-2" />
              Booking Status
            </div>
            <p className="text-sm text-gray-600">
              All bookings are confirmed immediately. You can view your confirmed bookings in the "Your Bookings" section above.
            </p>
          </div>
        </div>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                Note: Currently displaying sample data. Some features may be temporarily unavailable.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Action CTA for authenticated users with no bookings */}
      {getUserBookings().length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-5 mb-8 border-l-4 border-blue-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Your Booked Resources</h3>
              <p className="text-gray-600 mt-1">You don't have any active bookings. View available facilities below to make a reservation.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* User's Bookings Section */}
      <div className="mb-8" id="all-user-bookings-section">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Your Bookings</h2>
          {getUserBookings().length > 0 && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {getUserBookings().length} {getUserBookings().length === 1 ? 'Booking' : 'Bookings'}
            </div>
          )}
        </div>
        
        {getUserBookings().length > 0 ? (
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getUserBookings().map(booking => {
                  const facility = facilities.find(f => f._id === booking.resourceId);
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{facility?.name || 'Unknown Facility'}</div>
                        <div className="text-sm text-gray-500">{facility?.location || ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{booking.eventTitle}</div>
                        <div className="text-sm text-gray-500">{booking.purpose || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{moment(booking.startDate).format('MMM D, YYYY')}</div>
                        <div className="text-sm text-gray-500">
                          {moment(booking.startDate).format('h:mm A')} - {moment(booking.endDate).format('h:mm A')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'}`}>
                          Confirmed
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                        >
                          <FaTimes className="text-white" />
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">You haven't booked any facilities yet.</p>
            <p className="text-gray-500 mt-2">Browse the available facilities below to make your first booking.</p>
          </div>
        )}
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={facilityFilter.search}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search facilities..."
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facility Type
            </label>
            <select
              name="type"
              value={facilityFilter.type}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Event Hall">Event Hall</option>
              <option value="Seminar Hall">Seminar Hall</option>
              <option value="Conference Room">Conference Room</option>
              <option value="Classroom">Classroom</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Outdoor Venue">Outdoor Venue</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Capacity
            </label>
            <select
              name="capacity"
              value={facilityFilter.capacity}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Capacity</option>
              <option value="50">50+</option>
              <option value="100">100+</option>
              <option value="200">200+</option>
              <option value="500">500+</option>
            </select>
          </div>
          
          <div className="self-end">
            <button
              onClick={() => setFacilityFilter({ type: '', capacity: '', search: '' })}
              className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
            >
              <FaTimes className="text-white" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Current Bookings Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Current Bookings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getAllBookings().length > 0 ? (
            getAllBookings().map(booking => {
              const facility = facilities.find(f => f._id === booking.resourceId);
              const isUserBooking = isAuthenticated && booking.bookedBy === user?.email;
              
              return (
                <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className={`p-3 border-b ${isUserBooking ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className="font-semibold text-lg text-gray-800">{booking.eventTitle}</h3>
                    <p className={`${isUserBooking ? 'text-blue-700' : 'text-gray-700'} font-medium`}>
                      {facility?.name || booking.facilityName || 'Unknown Facility'}
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <FaCalendarAlt className="mr-2 text-blue-500" />
                          {moment(booking.startDate).format('MMM D, YYYY')}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <FaClock className="mr-2 text-blue-500" />
                          {moment(booking.startDate).format('h:mm A')} - {moment(booking.endDate).format('h:mm A')}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <FaUser className="mr-2 text-blue-500" />
                          {booking.bookedBy}
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'}`}>
                        Confirmed
                      </span>
                    </div>
                    
                    {/* Show cancel button only for user's own bookings or for admins */}
                    {(isUserBooking || (isAuthenticated && user?.role === ROLES.ADMIN)) && (
                      <div className="border-t border-gray-100 pt-3 mt-2">
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                        >
                          <FaTimes className="text-white" />
                          CANCEL BOOKING
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No bookings found.
            </div>
          )}
        </div>
      </div>
      
      {/* Facilities Grid Section */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Facilities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredFacilities.map(facility => {
          // Check if user has a booking for this facility
          const userBooking = isAuthenticated ? 
            getUserBookings().find(booking => booking.resourceId === facility._id)
            : null;
            
          return (
            <div
              key={facility._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-80"></div>
                <h3 className="text-xl font-bold text-white z-10 text-center px-4">{facility.name}</h3>
              </div>
              
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {facility.type}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {facility.location}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{facility.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaUsers className="mr-2 text-blue-500" />
                    <span>Capacity: {facility.capacity}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaCheck className="mr-2 text-green-500" />
                    <span>{facility.amenities.slice(0, 3).join(', ')}{facility.amenities.length > 3 ? '...' : ''}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => handleFacilityClick(facility)}
                    className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                  >
                    <FaInfoCircle className="text-white" />
                    View Details
                  </button>
                  
                  {/* Show either Book or Cancel button based on whether user has a booking */}
                  {userBooking ? (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          alert('Please login to cancel a booking');
                          return;
                        }
                        handleCancelBooking(userBooking);
                      }}
                      className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                    >
                      <FaTimes className="text-white" />
                      CANCEL BOOKING
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          alert('Please login to book a resource');
                          return;
                        }
                        setSelectedFacility(facility);
                        handleBookFacility();
                      }}
                      className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                    >
                      <FaCalendarAlt className="text-white" />
                      BOOK NOW
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredFacilities.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No facilities match your search criteria. Try adjusting your filters.
          </div>
        )}
      </div>

      {/* Facility Details Modal */}
      {showFacilityDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div className="relative">
              {/* Facility image header */}
              <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-lg overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h2 className="text-3xl font-bold text-white z-10 text-center px-4">
                  {selectedFacility.name}
                </h2>
              </div>
              
              {/* Define userBooking for this modal scope */}
              {(() => {
                const userBooking = isAuthenticated
                  ? getUserBookings().find(booking => booking.resourceId === selectedFacility._id)
                  : null;
                return (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Facility info */}
                      <div className="md:col-span-2">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <FaBuilding className="mr-1 text-[#1a365d]" />
                            {selectedFacility.type}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            <FaMapMarkerAlt className="mr-1 text-[#1a365d]" />
                            {selectedFacility.location}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <FaUsers className="mr-1 text-[#1a365d]" />
                            Capacity: {selectedFacility.capacity}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-6">{selectedFacility.description}</p>
                        
                        {/* Amenities */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {selectedFacility.amenities.map((amenity, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                              {amenity}
                            </span>
                          ))}
                        </div>
                        
                        {/* Book/Cancel Button */}
                        {(() => {
                          if (!isAuthenticated) {
                            return (
                              <button
                                onClick={() => alert('Please login to book a resource')}
                                className="px-5 py-2.5 bg-gray-400 text-white rounded-lg transition-colors font-medium flex items-center mt-4"
                              >
                                <FaCalendarAlt className="mr-2 text-[#1a365d]" />
                                Login to Book
                              </button>
                            );
                          }
                          
                          if (userBooking) {
                            return (
                              <button
                                onClick={() => handleCancelBooking(userBooking)}
                                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center mt-4"
                              >
                                <FaTimes className="mr-2 text-[#1a365d]" />
                                Cancel This Booking
                              </button>
                            );
                          } else {
                            return (
                              <button
                                onClick={handleBookFacility}
                                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center mt-4"
                              >
                                <FaCalendarAlt className="mr-2 text-[#1a365d]" />
                                Book This Facility
                              </button>
                            );
                          }
                        })()}
                      </div>
                      
                      {/* Bookings list */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Upcoming Bookings
                        </h3>
                        
                        {getFacilityBookings(selectedFacility._id).length > 0 ? (
                          <div className="space-y-3">
                            {getFacilityBookings(selectedFacility._id).map(booking => (
                              <div key={booking.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                <h4 className="font-medium text-gray-900">{booking.eventTitle}</h4>
                                <div className="text-sm text-gray-600 mt-1 flex items-center">
                                  <FaCalendarAlt className="mr-1 text-blue-500" />
                                  {moment(booking.startDate).format('MMM D, YYYY')}
                                </div>
                                <div className="text-sm text-gray-600 mt-1 flex items-center">
                                  <FaClock className="mr-1 text-blue-500" />
                                  {moment(booking.startDate).format('h:mm A')} - {moment(booking.endDate).format('h:mm A')}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className={`text-xs inline-flex items-center px-2 py-1 rounded-full 
                                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'}`}>
                                    <><FaCheck className="mr-1 text-[#1a365d]" /> Confirmed</>
                                  </div>
                                  
                                  {canUnbookResource(booking) && (
                                    <button 
                                      onClick={() => handleCancelBooking(booking)} 
                                      className="text-xs text-red-600 hover:text-red-800"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No upcoming bookings for this facility.</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      
      {/* Booking Form Modal */}
      {showBookingForm && selectedFacility && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto shadow-lg p-6 z-10">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-xl font-bold text-gray-900">Book a Resource</h3>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-white bg-blue-600 hover:bg-blue-700 rounded-full p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <p className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                You are booking: <strong>{selectedFacility.name}</strong> ({selectedFacility.location})
              </p>
              
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="eventTitle"
                    value={bookingForm.eventTitle}
                    onChange={handleBookingFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose of Booking
                  </label>
                  <select
                    name="purpose"
                    value={bookingForm.purpose}
                    onChange={handleBookingFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    required
                  >
                    <option value="">Select a purpose</option>
                    <option value="event">College Event</option>
                    <option value="class">Regular Class</option>
                    <option value="meeting">Faculty Meeting</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={bookingForm.contactEmail}
                    onChange={handleBookingFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="Enter contact email"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={bookingForm.startDate}
                      onChange={handleBookingFormChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base
                        ${bookingErrors.hasTimeConflict ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={bookingForm.startTime}
                      onChange={handleBookingFormChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base
                        ${bookingErrors.hasTimeConflict ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={bookingForm.endDate}
                      onChange={handleBookingFormChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base
                        ${bookingErrors.hasTimeConflict ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={bookingForm.endTime}
                      onChange={handleBookingFormChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base
                        ${bookingErrors.hasTimeConflict ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                </div>
                
                {/* Error Message Display */}
                {bookingErrors.errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {bookingErrors.errorMessage}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={bookingForm.notes}
                    onChange={handleBookingFormChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional details about the booking"
                  ></textarea>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                  <h4 className="font-medium">Booking Guidelines:</h4>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Bookings must be made at least 48 hours in advance</li>
                    <li>Cancellations should be made 24 hours before the scheduled time</li>
                    <li>The facility must be left in the same condition as found</li>
                    <li>Please respect the time slots and vacate the facility on time</li>
                  </ul>
                </div>
                
                <div className="flex justify-between gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg w-1/2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-3 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white font-medium rounded-lg w-1/2 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Cancellation Confirmation Modal */}
      {showCancellationModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4 text-red-600">
                <FaTimes className="text-2xl mr-2" />
                <h2 className="text-xl font-bold">Cancel Booking</h2>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to cancel your booking for <span className="font-medium">{selectedBooking.eventTitle}</span> at {facilities.find(f => f._id === selectedBooking.resourceId)?.name}?
              </p>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-800 mb-6">
                <p>This action cannot be undone. Cancellation may be subject to your institution's policies.</p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancellationModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancelBooking}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center font-bold text-lg"
                >
                  <FaTimes className="mr-2" />
                  CANCEL BOOKING
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resources;