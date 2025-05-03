import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaCheck, FaArrowLeft } from 'react-icons/fa';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import useNetworkStatus from '../hooks/useNetworkStatus';

function CreateEvent() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isOnline } = useNetworkStatus();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventData, setEventData] = useState({
    title: '',
    organizer: user?.email || '',
    date: moment().format('YYYY-MM-DD'),
    startTime: '10:00',
    endTime: '12:00',
    venue: '',
    description: '',
    category: 'Workshop'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  // Calendar functions
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const currentMonth = moment(selectedDate).format('MMMM YYYY');
  const daysInMonth = moment(selectedDate).daysInMonth();
  const firstDayOfMonth = moment(selectedDate).startOf('month').day() || 7; // Convert Sunday (0) to 7 for easier calculation
  
  // Generate calendar days for display
  const generateCalendarDays = () => {
    const days = [];
    let dayCounter = 1;
    
    // Handle the first week with potential empty days
    const firstWeek = [];
    for (let i = 1; i < 8; i++) {
      if (i < firstDayOfMonth) {
        // This is for the previous month
        const prevMonthDay = moment(selectedDate).subtract(1, 'month').daysInMonth() - (firstDayOfMonth - i - 1);
        firstWeek.push({
          day: prevMonthDay,
          currentMonth: false,
          date: moment(selectedDate).subtract(1, 'month').date(prevMonthDay)
        });
      } else {
        // This is for the current month
        firstWeek.push({
          day: dayCounter,
          currentMonth: true,
          date: moment(selectedDate).date(dayCounter)
        });
        dayCounter++;
      }
    }
    days.push(firstWeek);
    
    // Handle the remaining weeks
    while (dayCounter <= daysInMonth) {
      const week = [];
      for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
        week.push({
          day: dayCounter,
          currentMonth: true,
          date: moment(selectedDate).date(dayCounter)
        });
        dayCounter++;
      }
      
      // Fill the last week with next month days if needed
      while (week.length < 7) {
        const nextMonthDay = week.length + 1;
        week.push({
          day: nextMonthDay,
          currentMonth: false,
          date: moment(selectedDate).add(1, 'month').date(nextMonthDay)
        });
      }
      
      days.push(week);
    }
    
    return days;
  };
  
  const calendarWeeks = generateCalendarDays();
  
  const isSelectedDay = (date) => {
    return moment(date).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD');
  };
  
  const isToday = (date) => {
    return moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
  };
  
  const handleDayClick = (date) => {
    setSelectedDate(date.toDate());
    setEventData({
      ...eventData,
      date: moment(date).format('YYYY-MM-DD')
    });
  };
  
  const goToPreviousMonth = () => {
    setSelectedDate(moment(selectedDate).subtract(1, 'month').toDate());
  };
  
  const goToNextMonth = () => {
    setSelectedDate(moment(selectedDate).add(1, 'month').toDate());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Make sure user is authenticated
    if (!isAuthenticated) {
      setError('You must be logged in to create events.');
      setIsSubmitting(false);
      return;
    }

    // Format the date and times properly
    const formattedData = {
      ...eventData,
      startTime: moment(`${eventData.date} ${eventData.startTime}`).toISOString(),
      endTime: moment(`${eventData.date} ${eventData.endTime}`).toISOString(),
    };
    
    try {
      // Check if we're offline
      if (!isOnline) {
        // Store event locally for later synchronization
        const localEvents = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
        localEvents.push({
          ...formattedData,
          id: `local-${Date.now()}`,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('pendingEvents', JSON.stringify(localEvents));
        
        alert('You are currently offline. Event has been saved locally and will be synchronized when you are back online.');
        navigate('/events?refresh=1');
        return;
      }
      
      const response = await api.post('/events', formattedData);
      
      if (response.data.success) {
        setConfirmation('Event created successfully!');
        setTimeout(() => {
          navigate('/events?refresh=1&created=1');
        }, 1200);
      } else {
        throw new Error(response.data.message || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      
      // Special handling for 401 Unauthorized errors
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log in again to create events.');
      } else if (!navigator.onLine) {
        // If we're offline, save the event locally
        const localEvents = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
        localEvents.push({
          ...formattedData,
          id: `local-${Date.now()}`,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('pendingEvents', JSON.stringify(localEvents));
        
        alert('You are currently offline. Event has been saved locally and will be synchronized when you are back online.');
        navigate('/events?refresh=1');
        return;
      } else {
        setError(err.message || 'An error occurred while creating the event');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/events')}
            className="mr-4 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-full p-2 shadow hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all flex items-center"
          >
            <FaArrowLeft className="text-white text-lg" />
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">Schedule a New Event</h1>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">Fill in the details below to add a new event to the college calendar. Make your event stand out and keep everyone informed!</p>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {confirmation && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
            <p className="text-green-700">{confirmation}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={goToPreviousMonth}
                className="text-indigo-600 hover:text-indigo-800 text-lg"
              >
                &lt;
              </button>
              <h2 className="text-xl font-bold text-center">{currentMonth}</h2>
              <button 
                onClick={goToNextMonth}
                className="text-indigo-600 hover:text-indigo-800 text-lg"
              >
                &gt;
              </button>
            </div>
            
            <div className="mb-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center text-sm font-bold text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              
              {calendarWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
                  {week.map((dayObj, dayIndex) => (
                    <div 
                      key={`${weekIndex}-${dayIndex}`}
                      onClick={() => handleDayClick(dayObj.date)}
                      className={`
                        h-10 flex items-center justify-center rounded-lg cursor-pointer
                        ${dayObj.currentMonth ? '' : 'text-gray-400'}
                        ${isSelectedDay(dayObj.date) ? 'bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white font-bold shadow' :
                          isToday(dayObj.date) ? 'border-2 border-[#1a365d] text-[#1a365d] font-semibold' :
                          dayObj.currentMonth ? 'hover:bg-indigo-100' : 'hover:bg-gray-100'}
                      `}
                    >
                      {dayObj.day}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCalendarAlt className="text-[#1a365d] mr-2 text-xl" />
                <p className="font-medium text-gray-700">
                  Selected Date: <span className="font-bold">{moment(selectedDate).format('dddd, MMMM D, YYYY')}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Event Form Section */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Add New Event</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Event Title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizing Club
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={eventData.organizer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Organizing Club"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={eventData.startTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    value={eventData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Event Venue"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Category
                </label>
                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Conference">Conference</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Social">Social</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Description
                </label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Event Description"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white font-bold rounded-full flex items-center shadow-lg transition-all duration-200
                    ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:opacity-90 focus:opacity-90 active:opacity-80'}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2 text-white text-lg" />
                      Save Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;