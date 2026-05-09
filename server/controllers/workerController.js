const Worker = require('../models/Worker');

// =============================================================
// @route   PATCH /api/workers/availability
// @access  Worker
// =============================================================
const toggleAvailability = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    worker.isAvailable = !worker.isAvailable;
    await worker.save();

    res.json({
      success: true,
      isAvailable: worker.isAvailable,
      message: `You are now ${worker.isAvailable ? 'available' : 'unavailable'}`,
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/workers/profile
// @access  Worker
// =============================================================
const getWorkerProfile = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id }).populate(
      'userId',
      'name email phone createdAt'
    );
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    res.json({ success: true, worker });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   PATCH /api/workers/profile
// @access  Worker
// =============================================================
const updateWorkerProfile = async (req, res, next) => {
  try {
    const { bio, experience, location } = req.body;
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    if (bio !== undefined) worker.bio = bio;
    if (experience !== undefined) worker.experience = experience;
    if (location) worker.location.coordinates = [location.lng, location.lat];

    await worker.save();
    res.json({ success: true, worker });
  } catch (err) {
    next(err);
  }
};

module.exports = { toggleAvailability, getWorkerProfile, updateWorkerProfile };
