const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

// ✅ Signup (user by default)
const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: role ? role : "user",
    });

    res.status(201).json({
      success: true,
      message: "User registered Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Login (both admin + user)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 🍪 Save token in cookie
    res.cookie("token", token, {
      httpOnly: true, // JS access nahi kar sakta (secure)
      secure: true, // true in production (https)
      sameSite: "strict", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: req.token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { signup, login, getMe, logout };
