import React, { useState, useEffect } from 'react';
import { FaStar, FaThumbsUp, FaComment, FaLightbulb } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

function Feedback() {
  const { user } = useAuth();
  const permissions = usePermissions();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [formData, setFormData] = useState({
    rating: 5,
    positives: '',
    improvements: '',
    suggestions: ''
  });
  const [submitMessage, setSubmitMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchEvents();
    if (permissions.canManageCircular()) {
      fetchAllFeedback();
    }
  }, [permissions]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFeedback = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      setFeedbackList(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      setSubmitMessage({ type: 'error', message: 'Please select an event' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          eventId: selectedEvent,
          userId: user?.email || 'anonymous'
        })
      });

      if (response.ok) {
        setSubmitMessage({ type: 'success', message: 'Thank you for your feedback!' });
        setFormData({
          rating: 5,
          positives: '',
          improvements: '',
          suggestions: ''
        });
        setSelectedEvent('');
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitMessage({ type: 'error', message: 'Failed to submit feedback. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Feedback</h1>
          <p className="text-lg text-gray-600">
            Help us improve our events by sharing your experience
          </p>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Choose an event...</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'rating', value: star } })}
                    className={`text-2xl focus:outline-none ${
                      formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            {/* Positives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaThumbsUp className="inline mr-2 text-green-500" />
                What did you like about the event?
              </label>
              <textarea
                name="positives"
                value={formData.positives}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Improvements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaComment className="inline mr-2 text-blue-500" />
                What could be improved?
              </label>
              <textarea
                name="improvements"
                value={formData.improvements}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Suggestions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLightbulb className="inline mr-2 text-yellow-500" />
                Any suggestions for future events?
              </label>
              <textarea
                name="suggestions"
                value={formData.suggestions}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  submitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>

            {/* Submit Message */}
            {submitMessage.message && (
              <div
                className={`p-4 rounded-md ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {submitMessage.message}
              </div>
            )}
          </form>
        </div>

        {/* Feedback List - Only visible to authorized users */}
        {permissions.canManageCircular() && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Feedback</h2>
            <div className="space-y-6">
              {feedbackList.map((feedback) => (
                <div
                  key={feedback._id}
                  className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {events.find(e => e._id === feedback.eventId)?.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        By {feedback.userId} on{' '}
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(feedback.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      <strong>Positives:</strong> {feedback.positives}
                    </p>
                    <p className="text-gray-600">
                      <strong>Improvements:</strong> {feedback.improvements}
                    </p>
                    {feedback.suggestions && (
                      <p className="text-gray-600">
                        <strong>Suggestions:</strong> {feedback.suggestions}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;


