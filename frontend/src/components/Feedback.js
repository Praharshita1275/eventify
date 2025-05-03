import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaStar, FaThumbsUp, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import api from '../services/api';

// Error Alert Component
const ErrorAlert = ({ message }) => (
  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-lg">
    <div className="flex">
      <FaExclamationTriangle className="text-amber-500 mt-0.5 mr-3 h-5 w-5" />
      <p className="text-sm text-amber-700">{message}</p>
    </div>
  </div>
);

function Feedback() {
  // eslint-disable-next-line no-unused-vars
  const { token, isAuthenticated, user } = useAuth();
  const permissions = usePermissions();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [activeSection, setActiveSection] = useState('event');
  const [formData, setFormData] = useState({
    rating: 5,
    attended: true,
    contentRating: 5,
    organizationRating: 5,
    venueRating: 5,
    positives: '',
    improvements: '',
    suggestions: '',
    wouldRecommend: true,
    speakerRating: 5,
    speakerFeedback: '',
    technicalIssues: '',
    bestPart: '',
    learningOutcome: '',
    eventCategory: '',
    participationType: 'in-person',
    engagementLevel: 'high',
    timeSlotPreference: 'current',
    communicationRating: 5,
    registrationProcess: 'easy',
    email: '',
    name: '',
    rollNumber: '',
    branch: '',
    yearOfStudy: '',
    problemsFaced: '',
    improvementSuggestions: ''
  });
  const [submitMessage, setSubmitMessage] = useState({ type: '', message: '' });
  // For debouncing form inputs to prevent frequent re-renders
  const formUpdateTimeoutRef = useRef(null);

  // Event categories
  const categories = [
    'Workshop',
    'Seminar',
    'Conference',
    'Training',
    'Networking',
    'Other'
  ];

  // Participation types
  const participationTypes = [
    'in-person',
    'virtual',
    'hybrid'
  ];

  // Engagement levels
  const engagementLevels = [
    'high',
    'moderate',
    'low'
  ];

  // Time slot preferences
  // eslint-disable-next-line no-unused-vars
  const timeSlotPreferences = [
    'current',
    'earlier',
    'later',
    'different-day'
  ];

  // Registration process options
  // eslint-disable-next-line no-unused-vars
  const registrationOptions = [
    'easy',
    'moderate',
    'difficult'
  ];

  // Year of study options
  const yearOfStudyOptions = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    'Masters',
    'PhD',
    'Other'
  ];

  // Branch options
  const branchOptions = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Biotechnology',
    'Other'
  ];

  // Use useCallback for fetchEvents to avoid dependency issues
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      // Try to get events from API
      let apiEvents = [];
      
      try {
        // Use api service or direct fetch
        const response = await fetch('/api/events', {
          headers: isAuthenticated && token ? { 
            Authorization: `Bearer ${token}`
          } : {}
        });
        const data = await response.json();
        
        if (data && data.success) {
          // Format events properly from the API response
          apiEvents = data.data.map(evt => ({
            ...evt,
            start: new Date(evt.date + 'T' + evt.startTime),
            end: new Date(evt.date + 'T' + evt.endTime)
          }));
          console.log(`Loaded ${apiEvents.length} events from API`);
        }
      } catch (apiError) {
        console.error('API error loading events:', apiError);
        // Continue with fallback
      }
      
      // If API didn't return events, check localStorage as fallback
      if (apiEvents.length === 0) {
        try {
          // Get local events from localStorage
          const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
          console.log(`Loaded ${localEvents.length} events from localStorage`);
          
          // Combine API and local events
          apiEvents = [...apiEvents, ...localEvents];
        } catch (localError) {
          console.error('Error loading local events:', localError);
        }
      }
      
      // Set events in state
      if (apiEvents.length > 0) {
        setEvents(apiEvents);
      } else {
        // If no events from API or localStorage, use mock data as last resort
        setEvents([
          {
            _id: '507f1f77bcf86cd799439011', // Valid MongoDB ObjectId
            title: "Technical Workshop on AI",
            date: "2025-05-15",
            venue: "Seminar Hall 1",
            organizer: "CSE Department"
          },
          {
            _id: '507f1f77bcf86cd799439012', // Valid MongoDB ObjectId
            title: "Cultural Fest - Shruthi",
            date: "2025-05-20",
            venue: "College Auditorium",
            organizer: "Student Council"
          }
        ]);
        console.log("Using mock events as fallback");
      }
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  // Use useCallback for fetchAllFeedback to avoid dependency issues
  const fetchAllFeedback = useCallback(async () => {
    try {
      // If no event is selected, fetch all feedback
      const endpoint = selectedEvent ? `/feedback/event/${selectedEvent}` : '/feedback';
      
      const response = await api.get(endpoint, {
        headers: isAuthenticated && token ? {
            Authorization: `Bearer ${token}`
        } : {}
        });
        
        if (response.data.success) {
          const apiFeedback = response.data.data;
        console.log(`Loaded ${apiFeedback.length} feedback items`);
        setFeedbackList(apiFeedback);
        }
      } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedbackList([]);
      }
  }, [token, isAuthenticated, selectedEvent]);

  useEffect(() => {
    // Add debugging console logs
    console.log("Initializing feedback component");
    
    fetchEvents();
    // Fetch feedback when selectedEvent changes
    if (selectedEvent && isAuthenticated) {
      fetchAllFeedback();
    }
  }, [fetchAllFeedback, fetchEvents, isAuthenticated, selectedEvent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear any existing timeout to debounce rapid changes
    if (formUpdateTimeoutRef.current) {
      clearTimeout(formUpdateTimeoutRef.current);
    }
    
    // Apply updates immediately to avoid UI lag
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage({ type: '', message: '' });

    const feedbackData = {
      rating: formData.rating,
      attended: formData.attended,
      contentRating: formData.contentRating,
      organizationRating: formData.organizationRating,
      venueRating: formData.venueRating,
      positives: formData.positives,
      improvements: formData.improvements,
      suggestions: formData.suggestions,
      wouldRecommend: formData.wouldRecommend,
      speakerRating: formData.speakerRating,
      speakerFeedback: formData.speakerFeedback,
      technicalIssues: formData.technicalIssues,
      bestPart: formData.bestPart,
      learningOutcome: formData.learningOutcome,
      eventCategory: formData.eventCategory,
      participationType: formData.participationType,
      engagementLevel: formData.engagementLevel,
      timeSlotPreference: formData.timeSlotPreference,
      communicationRating: formData.communicationRating,
      registrationProcess: formData.registrationProcess,
      rollNumber: formData.rollNumber,
      branch: formData.branch,
      yearOfStudy: formData.yearOfStudy,
      problemsFaced: formData.problemsFaced,
      improvementSuggestions: formData.improvementSuggestions
    };

    // Add email and name for non-authenticated users
    if (!isAuthenticated) {
      feedbackData.email = formData.email;
      feedbackData.name = formData.name;
    }
    
    try {
      const response = await api.post(`/feedback/event/${selectedEvent}`, feedbackData);

      if (response.data.success) {
        setSubmitMessage({
          type: 'success',
          message: !isAuthenticated 
            ? 'Thank you for your detailed feedback! Log in to view all feedback.'
            : 'Thank you for your detailed feedback!'
        });
        setFormData({
          rating: 5,
          attended: true,
          contentRating: 5,
          organizationRating: 5,
          venueRating: 5,
          positives: '',
          improvements: '',
          suggestions: '',
          wouldRecommend: true,
          speakerRating: 5,
          speakerFeedback: '',
          technicalIssues: '',
          bestPart: '',
          learningOutcome: '',
          eventCategory: '',
          participationType: 'in-person',
          engagementLevel: 'high',
          timeSlotPreference: 'current',
          communicationRating: 5,
          registrationProcess: 'easy',
          email: '',
          name: '',
          rollNumber: '',
          branch: '',
          yearOfStudy: '',
          problemsFaced: '',
          improvementSuggestions: ''
        });
        setSelectedEvent('');
        
        // Only fetch all feedback for logged-in users
        if (isAuthenticated) {
          fetchAllFeedback();
        }
        
        // Scroll to the top to show the success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      let errorMessage = 'Failed to submit feedback. Please try again.';
      
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data.message || errorMessage;
        
        // Special handling for duplicate feedback error
        if (error.response.data.message.includes('duplicate key error')) {
          errorMessage = 'You have already submitted feedback for this event.';
        }
      }
      
      setSubmitMessage({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEventSelect = async (eventId) => {
    console.log('Event selected:', eventId);
    setSelectedEvent(eventId);
    try {
      // If no event is selected (All Events), fetch all feedback
      const endpoint = eventId ? `/feedback/event/${eventId}` : '/feedback';
      
      const response = await api.get(endpoint, {
        headers: isAuthenticated && token ? {
          Authorization: `Bearer ${token}`
        } : {}
      });
      
      if (response.data.success) {
        setFeedbackList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching event feedback:', error);
      setFeedbackList([]);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleSectionChange = (section) => {
    if (activeSection === section) {
      // If clicking on the already active section, keep it open
      return;
    }
    setActiveSection(section);
  };

  // eslint-disable-next-line no-unused-vars
  const renderSection = (title, content, sectionKey) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {content}
      </div>
    </div>
  );

  const renderDropdown = (name, value, options, label) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1).replace(/-/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  );

  // eslint-disable-next-line no-unused-vars
  const renderRatingStars = (name, value, label) => (
    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <label className="block text-lg font-medium text-gray-800 mb-3">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleChange({ target: { name, value: star } })}
              className={`w-12 h-12 flex items-center justify-center text-2xl rounded-full focus:outline-none transition-all duration-200
                ${star <= value ? 'bg-[#1a365d] text-white' : 'bg-white text-[#1a365d] border-2 border-[#1a365d]'}`}
            >
              ★
          </button>
        ))}
        </div>
        <span className="text-lg font-medium bg-white px-3 py-1 rounded-md border border-yellow-300">
          Rating: {value}/5
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)' }}>
      <div className='mb-10 text-center'>
        <h1 className="text-5xl font-bold text-[#1a365d] mb-6 text-center w-full">Feedback</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Share your thoughts, suggestions, or concerns to help us improve the Eventify experience for everyone.</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Event Feedback</h1>

          {submitMessage.message && (
            <div
              className={`p-4 rounded-md mb-6 ${
                submitMessage.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {submitMessage.message}
            </div>
          )}

          {/* Show error for mock events using the new ErrorAlert component */}
          {selectedEvent && events.some(e => e._id === '507f1f77bcf86cd799439011' || e._id === '507f1f77bcf86cd799439012') && (
            <ErrorAlert message="Cannot submit feedback for mock events to the server. Your feedback will be stored locally instead." />
          )}

          {/* Show duplicate key error using the new ErrorAlert component */}
          {submitMessage.type === 'error' && submitMessage.message.includes('E11000') && (
            <ErrorAlert message="You have already submitted feedback for this event." />
          )}

          {/* Show any other error messages using the new ErrorAlert component */}
          {submitMessage.type === 'error' && !submitMessage.message.includes('E11000') && (
            <ErrorAlert message={submitMessage.message} />
          )}

          {/* Show feedback form to non-logged in users */}
          {!isAuthenticated && (
            <>
              {submitMessage.type === 'success' ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
                  <p className="text-gray-600 mb-4">
                    Your feedback has been successfully submitted. We appreciate your time and insights.
                  </p>
                  <p className="text-gray-600">
                    Log in to view all feedback from others.
                  </p>
                </div>
              ) : (
                <>
                  {/* Form guide message */}
                  <div className="bg-blue-50 rounded-xl shadow-md p-4 mb-6 border border-blue-200">
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">How to Submit Feedback:</h2>
                    <ol className="list-decimal pl-5 text-blue-700">
                      <li className="mb-1">Select an event you attended</li>
                      <li className="mb-1">Fill in your student information</li>
                      <li className="mb-1">Provide ratings and comments about your experience</li>
                      <li className="mb-1">Click the Submit Feedback button at the bottom</li>
                    </ol>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Selection Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Selection</h3>
                      <div className="space-y-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Event
                          </label>
                          <select
                            value={selectedEvent}
                            onChange={(e) => handleEventSelect(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                            required
                          >
                            <option value="">Choose an event...</option>
                            {Array.isArray(events) && events.length > 0 ? (
                              events.map((event) => (
                                <option 
                                  key={event._id} 
                                  value={event._id}
                                  disabled={!event._id} // Disable options without a valid ID
                                >
                                  {event.title} - {new Date(event.date).toLocaleDateString()} - {event.venue}
                                  {event._id.toString().startsWith('mock_') ? ' (Local)' : ''}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>No events available</option>
                            )}
                          </select>
                          {events.length === 0 && (
                            <p className="mt-2 text-sm text-red-600">
                              No events found. Please check back later.
                            </p>
                          )}
                        </div>
                        {renderDropdown('eventCategory', formData.eventCategory, categories, 'Event Category')}
                        {renderDropdown('participationType', formData.participationType, participationTypes, 'Participation Type')}
                      </div>
                    </div>
                    
                    {/* Student Information Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h3>
                      <div className="space-y-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Roll Number
                          </label>
                          <input
                            type="text"
                            name="rollNumber"
                            value={formData.rollNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                            required
                          />
                        </div>
                        
                        {renderDropdown('branch', formData.branch, branchOptions, 'Branch')}
                        {renderDropdown('yearOfStudy', formData.yearOfStudy, yearOfStudyOptions, 'Year of Study')}
                      </div>
                    </div>
                    
                    {/* Other form sections - only show if an event is selected */}
                    {selectedEvent && (
                      <>
                        {/* Attendance Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendance</h3>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="attended"
                              checked={formData.attended}
                              onChange={handleChange}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300"
                            />
                            <label className="text-sm font-medium text-gray-700">
                              I attended this event
                            </label>
                          </div>
                        </div>
                        
                        {/* Event Ratings Section - simplified and guaranteed to display */}
                        <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] rounded-xl shadow-lg p-6 mb-4 border-2 border-[#1a365d]">
                          <h3 className="text-xl font-bold text-[#1a365d] mb-4">Event Ratings</h3>
                          
                          {/* Overall Rating */}
                          <div className="mb-8">
                            <label className="block text-lg font-medium text-[#1a365d] mb-2">
                              Overall Rating
                            </label>
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'rating', value: star } })}
                                    className={`w-12 h-12 flex items-center justify-center text-2xl rounded-full focus:outline-none transition-all duration-200
                                      ${star <= formData.rating ? 'bg-[#1a365d] text-white' : 'bg-white text-[#1a365d] border-2 border-[#1a365d]'}`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                              <span className="text-lg font-medium bg-white px-3 py-1 rounded-md border border-[#1a365d] text-[#1a365d]">
                                Rating: {formData.rating}/5
                              </span>
                            </div>
                          </div>
                          
                          {/* Other Ratings */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Content Quality */}
                            <div className="p-4 bg-white rounded-lg border border-[#1a365d]/20 hover:border-[#1a365d]/40 transition-all duration-200">
                              <label className="block text-lg font-medium text-[#1a365d] mb-2">
                                Content Quality
                              </label>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'contentRating', value: star } })}
                                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-full focus:outline-none mr-1 transition-all duration-200
                                      ${star <= formData.contentRating ? 'bg-[#1a365d] text-white' : 'bg-white text-[#1a365d] border-2 border-[#1a365d]'}`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Organization */}
                            <div className="p-4 bg-white rounded-lg border border-[#1a365d]/20 hover:border-[#1a365d]/40 transition-all duration-200">
                              <label className="block text-lg font-medium text-[#1a365d] mb-2">
                                Event Organization
                              </label>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'organizationRating', value: star } })}
                                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-full focus:outline-none mr-1 transition-all duration-200
                                      ${star <= formData.organizationRating ? 'bg-[#1a365d] text-white' : 'bg-white text-[#1a365d] border-2 border-[#1a365d]'}`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Venue */}
                            <div className="p-4 bg-white rounded-lg border border-[#1a365d]/20 hover:border-[#1a365d]/40 transition-all duration-200">
                              <label className="block text-lg font-medium text-[#1a365d] mb-2">
                                Venue & Facilities
                              </label>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'venueRating', value: star } })}
                                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-full focus:outline-none mr-1 transition-all duration-200
                                      ${star <= formData.venueRating ? 'bg-[#1a365d] text-white' : 'bg-white text-[#1a365d] border-2 border-[#1a365d]'}`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Speaker */}
                            <div className="p-4 bg-white rounded-lg border border-[#1a365d]/20 hover:border-[#1a365d]/40 transition-all duration-200">
                              <label className="block text-lg font-medium text-[#1a365d] mb-2">
                                Speaker/Presenter
                              </label>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'speakerRating', value: star } })}
                                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-full focus:outline-none mr-1 transition-all duration-200
                                      ${star <= formData.speakerRating ? 'bg-[#1a365d] text-white' : 'bg-white text-[#1a365d] border-2 border-[#1a365d]'}`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Your Experience Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Experience</h3>
                          <div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                What was the best part of the event?
                              </label>
                              <textarea
                                name="bestPart"
                                value={formData.bestPart}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                                rows="3"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                What did you learn from this event?
                              </label>
                              <textarea
                                name="learningOutcome"
                                value={formData.learningOutcome}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                                rows="3"
                              />
                            </div>
                            {renderDropdown('engagementLevel', formData.engagementLevel, engagementLevels, 'How engaged were you during the event?')}
                          </div>
                        </div>
                        
                        {/* Detailed Feedback Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Feedback</h3>
                          <div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                What aspects of the event were well executed?
                              </label>
                              <textarea
                                name="positives"
                                value={formData.positives}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                                rows="3"
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                What aspects could be improved?
                              </label>
                              <textarea
                                name="improvements"
                                value={formData.improvements}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                                rows="3"
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Did you experience any technical issues?
                              </label>
                              <textarea
                                name="technicalIssues"
                                value={formData.technicalIssues}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                                rows="3"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Problems & Suggestions Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Problems & Suggestions</h3>
                          <div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                What problems did you face during this event?
                              </label>
                              <textarea
                                name="problemsFaced"
                                value={formData.problemsFaced}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                                rows="3"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Suggestions for improvement:
                              </label>
                              <textarea
                                name="improvementSuggestions"
                                value={formData.improvementSuggestions}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                                rows="3"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Submit Button - Always visible and prominent */}
                    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] rounded-xl shadow-lg p-6 mb-4 mt-8 text-center">
                      <h3 className="text-xl font-semibold text-[#1a365d] mb-4">Submit Your Feedback</h3>
                      <div className="flex justify-center space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEvent('');
                          }}
                          className="px-4 py-3 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-all min-w-[120px]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-8 py-4 bg-gradient-to-r from-[#1a365d] to-[#2b6cb0] text-white font-bold rounded-full shadow-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all text-lg min-w-[200px] flex items-center justify-center gap-2"
                        >
                          {submitting ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                              <span>Submitting...</span>
                            </>
                          ) : (
                            'Submit Feedback'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </>
          )}

          {/* Show all feedback only for logged-in users */}
          {isAuthenticated && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {permissions.canManageCircular() ? "All Feedback (Admin View)" : "All Feedback"}
              </h2>

              {/* Add Event Selection Section */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Event</h3>
                <select
                  value={selectedEvent}
                  onChange={(e) => handleEventSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                >
                  <option value="">All Events</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title} - {new Date(event.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              {feedbackList.length === 0 ? (
                <p className="text-gray-600">No feedback available yet.</p>
              ) : (
                <div className="space-y-6">
                  {feedbackList
                    .filter(feedback => !selectedEvent || feedback.event?._id === selectedEvent)
                    .map((feedback) => (
                    <div
                      key={feedback._id}
                      className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {events.find(e => e._id === feedback.event?._id)?.title || 'Unknown Event'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            By {feedback.user ? feedback.user.username : feedback.guestName} 
                            {feedback.guestEmail && <span> ({feedback.guestEmail})</span>} on{' '}
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </p>
                          {/* Student Information */}
                          {(feedback.rollNumber || feedback.branch || feedback.yearOfStudy) && (
                            <div className="mt-1 flex flex-wrap text-sm text-gray-500">
                              {feedback.rollNumber && <span className="mr-3">Roll No: {feedback.rollNumber}</span>}
                              {feedback.branch && <span className="mr-3">Branch: {feedback.branch}</span>}
                              {feedback.yearOfStudy && <span>Year: {feedback.yearOfStudy}</span>}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-[#1a365d] mr-2">Overall:</span>
                            {[...Array(feedback.rating)].map((_, i) => (
                              <FaStar key={i} className="text-[#1a365d] text-lg" />
                            ))}
                          </div>
                          {feedback.wouldRecommend && (
                            <div className="flex items-center text-[#1a365d]">
                              <FaThumbsUp className="text-[#1a365d] mr-1 text-lg" />
                              <span className="text-sm">Would recommend</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="font-medium">Content:</span>{' '}
                          {feedback.contentRating}/5
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Organization:</span>{' '}
                          {feedback.organizationRating}/5
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Venue:</span>{' '}
                          {feedback.venueRating}/5
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Speaker:</span>{' '}
                          {feedback.speakerRating}/5
                        </div>
                      </div>

                      <div className="space-y-3">
                        {feedback.bestPart && (
                          <p className="text-gray-600">
                            <strong>Best Part:</strong> {feedback.bestPart}
                          </p>
                        )}
                        {feedback.learningOutcome && (
                          <p className="text-gray-600">
                            <strong>Learning Outcome:</strong> {feedback.learningOutcome}
                          </p>
                        )}
                        <p className="text-gray-600">
                          <strong>Positives:</strong> {feedback.positives}
                        </p>
                        <p className="text-gray-600">
                          <strong>Improvements:</strong> {feedback.improvements}
                        </p>
                        {feedback.problemsFaced && (
                          <p className="text-gray-600">
                            <strong>Problems Faced:</strong> {feedback.problemsFaced}
                          </p>
                        )}
                        {feedback.improvementSuggestions && (
                          <p className="text-gray-600">
                            <strong>Improvement Suggestions:</strong> {feedback.improvementSuggestions}
                          </p>
                        )}
                        {feedback.technicalIssues && (
                          <p className="text-gray-600">
                            <strong>Technical Issues:</strong> {feedback.technicalIssues}
                          </p>
                        )}
                        {feedback.speakerFeedback && (
                          <p className="text-gray-600">
                            <strong>Speaker Feedback:</strong> {feedback.speakerFeedback}
                          </p>
                        )}
                        {feedback.suggestions && (
                          <p className="text-gray-600">
                            <strong>Suggestions:</strong> {feedback.suggestions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feedback;
