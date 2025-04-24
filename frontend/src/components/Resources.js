import React, { useState } from 'react';

function Resources() {
  const [resources, setResources] = useState([
    { id: 1, name: "Projector", availability: "Available" },
    { id: 2, name: "Sound System", availability: "In Use" },
    { id: 3, name: "Conference Room", availability: "Available" },
  ]);
  const [resourceName, setResourceName] = useState('');
  const [availability, setAvailability] = useState('Available');

  // Handle adding a resource
  const handleAddResource = (e) => {
    e.preventDefault();
    if (resourceName) {
      const newResource = {
        id: Date.now(),
        name: resourceName,
        availability,
      };
      setResources([...resources, newResource]);
      setResourceName('');
      setAvailability('Available');
    } else {
      alert("Please enter a resource name.");
    }
  };

  // Handle deleting a resource
  const handleDeleteResource = (id) => {
    const updatedResources = resources.filter((resource) => resource.id !== id);
    setResources(updatedResources);
  };

  return (
    <section className="py-20 px-6 md:px-10 bg-gradient-to-b from-blue-100 via-white to-white">
      <h2 className="text-4xl font-bold text-primary text-center mb-10">Resource Management</h2>

      {/* Add Resource Form */}
      <form onSubmit={handleAddResource} className="mb-8 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h3 className="text-2xl font-semibold mb-4">Add New Resource</h3>
        <input 
          type="text" 
          placeholder="Resource Name" 
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
          value={resourceName}
          onChange={(e) => setResourceName(e.target.value)}
        />
        <select 
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="Available">Available</option>
          <option value="In Use">In Use</option>
        </select>
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add Resource
        </button>
      </form>

      {/* Resource List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-2">{resource.name}</h3>
            <p className={`text-lg font-semibold ${resource.availability === "Available" ? "text-green-500" : "text-red-500"}`}>
              {resource.availability}
            </p>
            <button 
              onClick={() => handleDeleteResource(resource.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Resources;