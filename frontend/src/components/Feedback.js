import React, { useState } from "react";

function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("");
  const [improvements, setImprovements] = useState("");
  const [features, setFeatures] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 via-white to-white">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Feedback Form
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Experience Rating */}
            <label className="block text-gray-700 font-semibold">
              How would you rate your experience with our website?
            </label>
            <select
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="">Select Rating</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>

            {/* Website Usability Feedback */}
            <label className="block text-gray-700 font-semibold">
              How easy was it to navigate the website?
            </label>
            <select
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              required
            >
              <option value="">Select an option</option>
              <option value="Very easy">Very easy</option>
              <option value="Somewhat easy">Somewhat easy</option>
              <option value="Difficult">Difficult</option>
              <option value="Very difficult">Very difficult</option>
            </select>

            {/* Features Feedback */}
            <label className="block text-gray-700 font-semibold">
              Are there any features you’d like to see added?
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              placeholder="Mention any features you'd like..."
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            />

            {/* General Feedback */}
            <label className="block text-gray-700 font-semibold">
              Any additional comments or suggestions?
            </label>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              rows="4"
              placeholder="Write your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </form>
        ) : (
          <p className="text-center text-green-600 font-semibold text-lg">
            Thank you for your valuable feedback!
          </p>
        )}
      </div>
    </div>
  );
}

export default Feedback;


