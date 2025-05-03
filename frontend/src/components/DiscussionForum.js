import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaComment, FaEye, FaPlus, FaSearch } from 'react-icons/fa';

const DiscussionForum = () => {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: '',
  });

  // Sample data
  useEffect(() => {
    setCategories([
      { id: 1, name: 'General Discussion', description: 'General topics about events and community' },
      { id: 2, name: 'Event Planning', description: 'Discuss upcoming events and planning' },
      { id: 3, name: 'Feedback & Suggestions', description: 'Share your feedback and suggestions' },
      { id: 4, name: 'Technical Support', description: 'Get help with technical issues' },
    ]);

    setTopics([
      {
        id: 1,
        title: 'Ideas for next community event',
        content: 'Looking for creative ideas for our next community gathering.',
        category: 'Event Planning',
        author: 'John Doe',
        date: new Date(),
        replies: 5,
        views: 120,
      },
      {
        id: 2,
        title: 'Improving the registration process',
        content: 'The current registration process could be streamlined. Any suggestions?',
        category: 'Feedback & Suggestions',
        author: 'Jane Smith',
        date: new Date(),
        replies: 3,
        views: 85,
      },
      {
        id: 3,
        title: 'Welcome to our new forum!',
        content: 'Welcome everyone to our new discussion forum. Feel free to introduce yourself.',
        category: 'General Discussion',
        author: 'Admin',
        date: new Date(),
        replies: 12,
        views: 250,
      },
    ]);
  }, []);

  const handleNewTopicSubmit = (e) => {
    e.preventDefault();
    const topic = {
      ...newTopic,
      id: Date.now(),
      date: new Date(),
      author: 'Current User',
      replies: 0,
      views: 0,
    };
    setTopics([topic, ...topics]);
    setShowNewTopicModal(false);
    setNewTopic({ title: '', content: '', category: '' });
  };

  const filteredTopics = topics
    .filter(topic => 
      (selectedCategory ? topic.category === selectedCategory : true) &&
      (searchQuery ? 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        topic.content.toLowerCase().includes(searchQuery.toLowerCase())
        : true)
    );

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Discussion Forum</h1>
          <button
            className="px-4 py-2 bg-[linear-gradient(135deg,#1a365d_0%,#2b6cb0_100%)] text-white rounded-full font-bold shadow hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all flex items-center gap-2"
            onClick={() => setShowNewTopicModal(true)}
          >
            <FaPlus className="text-white text-lg" />
            New Topic
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2>
            <div className="space-y-2">
              <button
                className={`w-full text-left p-2 rounded-full font-medium transition-all duration-200 shadow-sm
                  ${selectedCategory === null ? 'bg-[linear-gradient(135deg,#1a365d_0%,#2b6cb0_100%)] text-white' : 'bg-white text-[#1a365d] hover:bg-indigo-50'}`}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`w-full text-left p-2 rounded-full font-medium transition-all duration-200 shadow-sm
                    ${selectedCategory === category.name ? 'bg-[linear-gradient(135deg,#1a365d_0%,#2b6cb0_100%)] text-white' : 'bg-white text-[#1a365d] hover:bg-indigo-50'}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Topics List */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="w-full p-2 pl-10 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-[#1a365d] text-lg" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {selectedCategory ? `${selectedCategory} Topics` : 'All Topics'}
              </h2>
              
              {filteredTopics.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No topics found. {searchQuery && 'Try a different search term.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTopics.map((topic) => (
                    <div key={topic.id} className="border-b pb-4 last:border-b-0">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">{topic.title}</h3>
                      <p className="text-gray-600 mb-2">{topic.content}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>By {topic.author}</span>
                          <span>{format(topic.date, 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center">
                            <FaComment className="text-[#1a365d] mr-1 text-lg" /> {topic.replies}
                          </span>
                          <span className="flex items-center">
                            <FaEye className="text-[#1a365d] mr-1 text-lg" /> {topic.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Topic Modal */}
        {showNewTopicModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Topic</h2>
              <form onSubmit={handleNewTopicSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newTopic.category}
                    onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={newTopic.content}
                    onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                    rows="4"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all"
                    onClick={() => setShowNewTopicModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[linear-gradient(135deg,#1a365d_0%,#2b6cb0_100%)] text-white rounded-full font-bold shadow hover:opacity-90 focus:opacity-90 active:opacity-80 transition-all"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionForum; 