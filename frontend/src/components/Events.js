import React, { useState } from "react";

const CalendarEventForm = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventClub, setEventClub] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventAdditionalInfo, setEventAdditionalInfo] = useState("");
  const [events, setEvents] = useState([]);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (
      eventTitle &&
      eventDescription &&
      eventClub &&
      eventDuration &&
      eventVenue
    ) {
      const newEvent = {
        id: Date.now(),
        title: eventTitle,
        description: eventDescription,
        date: selectedDate,
        club: eventClub,
        duration: eventDuration,
        venue: eventVenue,
        additionalInfo: eventAdditionalInfo,
        status: "pending", // initial status is red
      };
      setEvents((prev) => [...prev, newEvent]);

      // Simulate approval steps
      setTimeout(() => {
        setEvents((prevEvents) =>
          prevEvents.map((ev) =>
            ev.id === newEvent.id ? { ...ev, status: "headApproved" } : ev
          )
        );

        setTimeout(() => {
          setEvents((prevEvents) =>
            prevEvents.map((ev) =>
              ev.id === newEvent.id ? { ...ev, status: "principalApproved" } : ev
            )
          );
        }, 5000); // simulate principal approval
      }, 5000); // simulate head approval

      // Reset form
      setEventTitle("");
      setEventDescription("");
      setEventClub("");
      setEventDuration("");
      setEventVenue("");
      setEventAdditionalInfo("");
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const getStatusButton = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 bg-red-500 text-white rounded-xl text-xs">Pending</span>;
      case "headApproved":
        return <span className="px-3 py-1 bg-yellow-400 text-black rounded-xl text-xs">Waiting for Principal</span>;
      case "principalApproved":
        return <span className="px-3 py-1 bg-green-500 text-white rounded-xl text-xs">Circular Generated</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">📅 Schedule a New Event</h2>
        <form onSubmit={handleAddEvent} className="space-y-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Event Title"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Event Description"
            className="w-full px-4 py-2 border rounded-lg"
            rows="3"
            required
          />
          <input
            type="text"
            value={eventClub}
            onChange={(e) => setEventClub(e.target.value)}
            placeholder="Organizing Club"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            value={eventDuration}
            onChange={(e) => setEventDuration(e.target.value)}
            placeholder="Duration (e.g. 2 hours)"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            value={eventVenue}
            onChange={(e) => setEventVenue(e.target.value)}
            placeholder="Venue"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <textarea
            value={eventAdditionalInfo}
            onChange={(e) => setEventAdditionalInfo(e.target.value)}
            placeholder="Additional Info (Optional)"
            className="w-full px-4 py-2 border rounded-lg"
            rows="2"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Add Event
          </button>
        </form>

        {/* Display Events */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">🗓️ Upcoming Events</h3>
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="border p-4 rounded-lg bg-gray-50 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-bold">{event.title}</h4>
                  {getStatusButton(event.status)}
                </div>
                <p className="text-sm text-gray-600">📍 {event.venue} | 🕒 {event.duration}</p>
                <p className="text-sm text-gray-600">📝 {event.description}</p>
                <p className="text-sm text-gray-500 mt-1">🎓 {event.club} | 📆 {event.date}</p>
                {event.additionalInfo && <p className="text-sm text-gray-500">ℹ️ {event.additionalInfo}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarEventForm;
