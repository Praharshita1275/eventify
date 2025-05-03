import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPrint, FaArrowLeft, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import { usePermissions } from '../hooks/usePermissions';
import axios from 'axios';

function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

function Circular() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { isAuthenticated } = useAuth();
  const { canManageEvents } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [circular, setCircular] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCircularData = useCallback(async () => {
    if (!eventId) {
      setError('Invalid or missing event ID');
      setLoading(false);
      return;
    }
    
    // Validate ObjectId before making API call
    if (!eventId.toString().startsWith('mock_') && !isValidObjectId(eventId)) {
      setError('This event is not yet synced with the server. Please schedule the event online first.');
      setLoading(false);
      return;
    }
    
    try {
      // Check if this is a mock/local event (starts with 'mock_')
      if (eventId.toString().startsWith('mock_')) {
        // For mock events, get data from localStorage
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
        const mockEvent = localEvents.find(e => e._id === eventId);
        
        if (mockEvent) {
          // Create a mock circular using the event data
          const mockCircular = {
            _id: `circular_${eventId}`,
            event: mockEvent,
            title: `Circular: ${mockEvent.title}`,
            content: `
CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY

NAME: ${mockEvent.title}
DATE: ${new Date(mockEvent.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
TIME: ${mockEvent.startTime} - ${mockEvent.endTime}
VENUE: ${mockEvent.venue}
${mockEvent.description ? `DETAILS: ${mockEvent.description}` : ''}
${mockEvent.organizer ? `ORGANIZER: ${mockEvent.organizer}` : ''}

SIGN OF PRINCIPAL
STATUS: APPROVED
            `,
            generatedBy: localStorage.getItem('userId') || null,
            generatedAt: new Date().toISOString(),
            status: 'published'
          };
          
          setCircular(mockCircular);
          setEvent(mockEvent);
          setLoading(false);
          return;
        }
      }
      
      // First try to get the circular from API
      const circularResponse = await api.get(`/events/${eventId}/circular`);
      
      if (circularResponse.data.success) {
        setCircular(circularResponse.data.data);
        setEvent(circularResponse.data.data.event);
      } else {
        // If no circular exists, get the event data
        const eventResponse = await api.get(`/events/${eventId}`);
        
        if (eventResponse.data.success) {
          setEvent(eventResponse.data.data);
        } else {
          throw new Error('Event not found');
        }
      }
    } catch (error) {
      console.error('Error fetching circular data:', error);
      
      // If API call failed, try to get from localStorage as fallback
      if (eventId.toString().startsWith('mock_')) {
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
        const mockEvent = localEvents.find(e => e._id === eventId);
        
        if (mockEvent) {
          setEvent(mockEvent);
          setError('Using locally stored event data.');
        } else {
          setError('Circular not found for this event. Generate a circular first.');
        }
      } else if (error.response && error.response.status === 404) {
        setError('Circular not found for this event. Generate a circular first.');
      } else {
        setError('Error accessing circular. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchCircularData();
  }, [fetchCircularData]);

  const handleGenerateCircular = async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to generate circulars');
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if this is a mock/local event
      if (eventId.toString().startsWith('mock_')) {
        // For mock events, get data from localStorage
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
        const mockEvent = localEvents.find(e => e._id === eventId);
        
        if (mockEvent) {
          // Create a mock circular
          const mockCircular = {
            _id: `circular_${eventId}`,
            event: mockEvent,
            title: `Circular: ${mockEvent.title}`,
            content: `
CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY

NAME: ${mockEvent.title}
DATE: ${new Date(mockEvent.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
TIME: ${mockEvent.startTime} - ${mockEvent.endTime}
VENUE: ${mockEvent.venue}
${mockEvent.description ? `DETAILS: ${mockEvent.description}` : ''}
${mockEvent.organizer ? `ORGANIZER: ${mockEvent.organizer}` : ''}

SIGN OF PRINCIPAL
STATUS: APPROVED
            `,
            generatedBy: localStorage.getItem('userId') || null,
            generatedAt: new Date().toISOString(),
            status: 'published'
          };
          
          // Update the event in localStorage to mark circular as generated
          const updatedLocalEvents = localEvents.map(e => 
            e._id === eventId ? { ...e, circularGenerated: true } : e
          );
          localStorage.setItem('localEvents', JSON.stringify(updatedLocalEvents));
          
          setCircular(mockCircular);
          setEvent(mockEvent);
          setError(null);
          
          // Refresh the data
          fetchCircularData();
          return;
        }
      }
      
      // For real events, use the API
      const response = await api.post(`/events/${eventId}/circular`);
      
      if (response.data.success) {
        setCircular(response.data.circular);
        // Refresh the data
        fetchCircularData();
      } else {
        throw new Error('Failed to generate circular');
      }
    } catch (error) {
      console.error('Error generating circular:', error);
      setError('Failed to generate circular. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/events');
  };

  return (
    <div className="container mx-auto px-4 py-8 print:py-0">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a365d]"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={handleBack} 
            className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium"
          >
            Back to Events
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto print:max-w-none">
          {/* Circular content */}
          {circular ? (
            <div className="bg-white p-8 rounded-lg border border-gray-200 print:border-none print:shadow-none">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#1a365d] mb-2">{circular.title}</h2>
                <p className="text-gray-600">Generated on {new Date(circular.generatedAt).toLocaleDateString()}</p>
              </div>

              <div className="circular-print-area">
                <div
                  className="text-gray-800 mb-8 print:text-black"
                  dangerouslySetInnerHTML={{ __html: circular.content }}
                />
              </div>

              <div className="mt-20 pt-10 border-t-2 border-gray-200">
                <div className="flex justify-between">
                  <div className="w-1/3 text-center">
                    <div className="h-20"></div>
                    <div className="border-t border-gray-400 mx-4"></div>
                    <p className="text-gray-700 mt-1">HEAD OF DEPARTMENT</p>
                  </div>
                  
                  <div className="w-1/3 text-center">
                    <div className="h-20"></div>
                    <div className="border-t border-gray-400 mx-4"></div>
                    <p className="text-gray-700 mt-1">PRINCIPAL</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex justify-center gap-4 print:hidden">
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                >
                  <FaPrint className="text-white" />
                  Print Circular
                </button>
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-700 transition-all font-medium flex items-center gap-2"
                >
                  <FaArrowLeft className="text-white" />
                  Back to Events
                </button>
              </div>
            </div>
          ) : event ? (
            <div className="bg-white p-8 rounded-lg border border-gray-200 print:border-none print:shadow-none">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#1a365d] mb-2">{event.title}</h2>
                <p className="text-gray-600">Event Details</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-700 w-24">DATE:</span>
                  <span className="flex-1 border-b-2 border-gray-300 pb-1">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-700 w-24">TIME:</span>
                  <span className="flex-1 border-b-2 border-gray-300 pb-1">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-700 w-24">VENUE:</span>
                  <span className="flex-1 border-b-2 border-gray-300 pb-1">
                    {event.venue}
                  </span>
                </div>

                {event.description && (
                  <div className="flex items-start space-x-4 mt-6">
                    <span className="font-semibold text-gray-700 w-24">DETAILS:</span>
                    <div className="flex-1 border-2 border-gray-300 p-3 rounded-md">
                      <p className="text-gray-800">{event.description}</p>
                    </div>
                  </div>
                )}

                {event.organizer && (
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="font-semibold text-gray-700 w-24">ORGANIZER:</span>
                    <span className="flex-1 border-b-2 border-gray-300 pb-1">
                      {event.organizer}
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex justify-center gap-4 print:hidden">
                {isAuthenticated && (
                  <button
                    onClick={handleGenerateCircular}
                    className="px-6 py-3 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                  >
                    <FaFileAlt className="text-white" />
                    Generate Circular
                  </button>
                )}
                <button
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-700 transition-all font-medium flex items-center gap-2"
                >
                  <FaArrowLeft className="text-white" />
                  Back to Events
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-700 mb-4">No circular information available.</p>
              <button 
                onClick={handleBack} 
                className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
              >
                Back to Events
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Circular;
