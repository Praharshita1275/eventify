import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import './Events.css'; // Optional: Custom CSS for styling (create if needed)

function Events() {
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: "Tech Meetup", 
      description: "Join us for a day of networking and innovation.", 
      date: new Date(),
      club: "Tech Club",
      duration: "2 hours",
      venue: "Auditorium",
      additionalInfo: "Snacks will be provided."
    },
    { 
      id: 2, 
      title: "Hackathon 2025", 
      description: "Compete, collaborate, and create amazing projects.", 
      date: new Date(),
      club: "Coding Club",
      duration: "24 hours",
      venue: "Lab 301",
      additionalInfo: "Bring your own laptop."
    }
  ]);

  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventClub, setEventClub] = useState('');
  const [eventDuration, setEventDuration] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventAdditionalInfo, setEventAdditionalInfo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (eventTitle && eventDescription && eventClub && eventDuration && eventVenue) {
      const newEvent = {
        id: Date.now(),
        title: eventTitle,
        description: eventDescription,
        date: selectedDate,
        club: eventClub,
        duration: eventDuration,
        venue: eventVenue,
        additionalInfo: eventAdditionalInfo
      };
      setEvents([...events, newEvent]);
      setEventTitle('');
      setEventDescription('');
      setEventClub('');
      setEventDuration('');
      setEventVenue('');
      setEventAdditionalInfo('');
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const eventsForSelectedDate = events.filter(event => 
    new Date(event.date).toDateString() === new Date(selectedDate).toDateString()
  );

  return (
    <section className="py-20 px-10 bg-gradient-to-r from-gray-100 to-indigo-100 min-h-screen">
      <h2 className="text-4xl font-bold text-indigo-700 text-center mb-10">Upcoming Events</h2>

      <div className="mb-8 max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-2xl font-semibold mb-4">Schedule an Event</h3>
        <Calendar onChange={handleDateChange} value={selectedDate} className="mx-auto custom-calendar"/>
        <p className="mt-4 text-gray-600 text-center">
          Selected Date: <b>{selectedDate.toDateString()}</b>
        </p>
      </div>

      <form onSubmit={handleAddEvent} className="mb-8 bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
        <h3 className="text-2xl font-semibold mb-4">Add New Event</h3>
        {[
          { placeholder: "Event Title", value: eventTitle, setter: setEventTitle },
          { placeholder: "Organizing Club", value: eventClub, setter: setEventClub },
          { placeholder: "Event Duration (e.g. 2 hours)", value: eventDuration, setter: setEventDuration },
          { placeholder: "Venue", value: eventVenue, setter: setEventVenue }
        ].map(({ placeholder, value, setter }, index) => (
          <input 
            key={index}
            type="text"
            placeholder={placeholder}
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={value}
            onChange={(e) => setter(e.target.value)}
          />
        ))}

        <textarea 
          placeholder="Event Description" 
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows={2}
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        />

        <textarea 
          placeholder="Additional Information (optional)" 
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows={2}
          value={eventAdditionalInfo}
          onChange={(e) => setEventAdditionalInfo(e.target.value)}
        />

        <button 
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 w-full"
        >
          Add Event
        </button>
      </form>

      <h3 className="text-3xl font-semibold text-indigo-700 text-center mb-4">
        Events on {selectedDate.toDateString()}
      </h3>
      {eventsForSelectedDate.length === 0 ? (
        <p className="text-center text-gray-600">No events scheduled for this date.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsForSelectedDate.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-2xl font-semibold mb-2 text-indigo-700">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500 mt-2"><b>Club:</b> {event.club}</p>
              <p className="text-sm text-gray-500"><b>Duration:</b> {event.duration}</p>
              <p className="text-sm text-gray-500"><b>Venue:</b> {event.venue}</p>
              {event.additionalInfo && <p className="text-sm text-gray-500"><b>Info:</b> {event.additionalInfo}</p>}
              <p className="text-sm text-gray-400 mt-2"><b>Date:</b> {new Date(event.date).toDateString()}</p>
              
              <button 
                onClick={() => handleDeleteEvent(event.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 w-full"
              >
                Cancel Event
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Events;
