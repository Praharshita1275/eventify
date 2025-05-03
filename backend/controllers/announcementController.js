const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const query = { isActive: true };
    if (category) {
      query.category = category;
    }
    const announcements = await Announcement.find(query)
      .sort('-date')
      .limit(limit)
      .populate('createdBy', 'username');

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private (Admin)
exports.createAnnouncement = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const announcement = await Announcement.create(req.body);

    res.status(201).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin)
exports.updateAnnouncement = async (req, res) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    await announcement.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};