const User = require('../models/User');
const { sendToken } = require('../utils/token');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(name, email, password, role);
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'Missing required field(s)' });
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email already registered' });
    const user = new User({ name, email, password, role });
    await user.save();
    sendToken(res, user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid email or password' });
    sendToken(res, user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

exports.verify = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};