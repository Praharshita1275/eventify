import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaPaperPlane, FaSpinner, FaFileAlt } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Circulars() {
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        // Try to get events with circulars from API
        let apiCirculars = [];
        try {
          const response = await api.get('/events', {
            params: { 
              status: 'approved',
              hasCircular: true
            }
          });
          
          if (response.data.success) {
            apiCirculars = response.data.data;
          }
        } catch (apiError) {
          console.error('API error:', apiError);
          // Continue with empty apiCirculars array
        }
        
        // Get local/mock events from localStorage
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
        const localCirculars = localEvents
          .filter(event => event.circularGenerated)
          .map(event => ({
            _id: event._id,
            title: event.title,
            date: event.date,
            startTime: event.startTime,
            endTime: event.endTime,
            venue: event.venue,
            organizer: event.organizer,
            status: 'approved'
          }));
        
        // Combine API circulars with local circulars
        const allCirculars = [...apiCirculars, ...localCirculars];
        
        if (allCirculars.length > 0) {
          setCirculars(allCirculars);
          setError(null);
        } else if (apiCirculars.length === 0 && localCirculars.length === 0) {
          // Only set "no circulars" message if both sources are empty
          setCirculars([]);
        }
      } catch (error) {
        console.error('Error fetching circulars:', error);
        
        // Fallback to local events if API fails
        try {
          const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
          const localCirculars = localEvents
            .filter(event => event.circularGenerated)
            .map(event => ({
              _id: event._id,
              title: event.title, 
              date: event.date,
              startTime: event.startTime,
              endTime: event.endTime,
              venue: event.venue,
              organizer: event.organizer,
              status: 'approved'
            }));
          
          if (localCirculars.length > 0) {
            setCirculars(localCirculars);
            setError('Using locally stored circulars. Some features may be limited.');
          } else {
            setError('Failed to load circulars. Please try again later.');
          }
        } catch (localError) {
          setError('Failed to load circulars. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCirculars();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-50">
        <FaSpinner className="animate-spin text-4xl text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-50">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg animate-fadeIn">
          <p className="text-amber-700 flex items-center gap-2"><FaPaperPlane className="text-amber-500" /> {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-white to-indigo-50">
      <div className='mb-10 text-center'>
        <h1 className="text-5xl font-bold text-[#1a365d] mb-6 tracking-tight">Circulars</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Browse all official circulars for college events and announcements. Stay informed and up to date.</p>
      </div>

      {circulars.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-xl mx-auto">
          <FaPaperPlane className="text-5xl text-indigo-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#1a365d] mb-2">No Circulars Available</h2>
          <p className="text-gray-500 mb-6">There are currently no approved events with circulars.</p>
          
          <Link to="/events" className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2">
            View Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circulars.map((circular) => (
            <div key={circular._id} className="bg-white rounded-2xl shadow-2xl overflow-hidden border-l-4 border-indigo-500">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-[#1a365d] line-clamp-2">{circular.title || circular.name}</h2>
                  <div className="bg-indigo-100 text-[#1a365d] text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <span className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></span>
                    Approved
                  </div>
                </div>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2 text-[#1a365d]" />
                    <span>{new Date(circular.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2 text-[#1a365d]" />
                    <span>
                      {circular.time || 
                       (circular.startTime && circular.endTime 
                         ? `${circular.startTime} - ${circular.endTime}` 
                         : 'N/A')}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-[#1a365d]" />
                    <span>{circular.venue || 'N/A'}</span>
                  </div>
                </div>
                
                <Link
                  to={`/circular/${circular._id}`}
                  className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
                >
                  <FaPaperPlane className="text-white" />
                  View Circular
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAuthenticated && (
        <div className="mt-8 bg-indigo-50 rounded-2xl p-6 border border-indigo-100 max-w-xl mx-auto shadow-lg">
          <h2 className="text-xl font-semibold text-[#1a365d] mb-4">Manage Event Circulars</h2>
          <p className="text-gray-600 mb-4">
            To create a new circular, first approve an event from the Events page, then use the "Generate Circular" button.
          </p>
          <Link 
            to="/events" 
            className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
          >
            Go to Events
          </Link>
        </div>
      )}
    </div>
  );
}

export default Circulars; 