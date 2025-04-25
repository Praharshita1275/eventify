import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaDownload, FaFile } from 'react-icons/fa';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../contexts/AuthContext';

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const permissions = usePermissions();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE',
      });
      fetchResources(); // Refresh the resources list
    } catch (error) {
      console.error('Error deleting resource:', error);
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Resources</h1>
        {permissions.canCreateResource() && (
          <Link
            to="/resources/create"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add New Resource
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-center mb-4">
                <FaFile className="text-blue-600 text-xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">{resource.title}</h2>
              </div>
              
              <p className="text-gray-600 mb-4">{resource.description}</p>

              <div className="flex justify-between items-center">
                <a
                  href={resource.fileUrl}
                  download
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FaDownload className="mr-2" />
                  Download
                </a>

                {(permissions.canEditResource() || (permissions.checkPermission('edit_own_resource') && resource.createdBy === user?.email)) && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/resources/edit/${resource._id}`}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteResource(resource._id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Added by: {resource.createdBy}
                <br />
                Date: {new Date(resource.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No resources available yet.</p>
        </div>
      )}
    </div>
  );
}

export default Resources;