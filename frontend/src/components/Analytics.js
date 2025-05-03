import React, { useState, useEffect } from 'react';
import { FaUsers, FaCalendarAlt, FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    eventAttendance: 0,
    resourceUtilization: 0,
  });

  // Sample data
  useEffect(() => {
    setStats({
      totalUsers: 1250,
      activeUsers: 876,
      totalEvents: 45,
      upcomingEvents: 12,
      eventAttendance: 78,
      resourceUtilization: 65,
    });
  }, [timeRange]);

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)' }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
              onClick={() => setTimeRange('week')}
            >
              <FaChartBar className="text-white" />
              Week
            </button>
            <button
              className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
              onClick={() => setTimeRange('month')}
            >
              <FaChartBar className="text-white" />
              Month
            </button>
            <button
              className="px-4 py-2 bg-[linear-gradient(135deg,_#1a365d_0%,_#2b6cb0_100%)] text-white rounded-lg hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all font-medium flex items-center gap-2"
              onClick={() => setTimeRange('year')}
            >
              <FaChartBar className="text-white" />
              Year
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUsers className="text-[#1a365d] text-xl" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-500 text-sm">
                <FaChartLine className="mr-1" />
                <span>+12% from last {timeRange}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Users</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.activeUsers}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaUsers className="text-[#1a365d] text-xl" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-500 text-sm">
                <FaChartLine className="mr-1" />
                <span>+8% from last {timeRange}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Events</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalEvents}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaCalendarAlt className="text-[#1a365d] text-xl" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-500 text-sm">
                <FaChartLine className="mr-1" />
                <span>+15% from last {timeRange}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Attendance</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <FaChartBar className="text-6xl text-blue-500 mx-auto mb-4" />
                <p className="text-gray-500">Event attendance visualization will be displayed here</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resource Utilization</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <FaChartPie className="text-6xl text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">Resource utilization visualization will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Community Meetup
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Apr 20, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    45/50
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Workshop: React Basics
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Apr 25, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    30/40
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tech Talk: AI & ML
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    May 5, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    60/60
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Full
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 