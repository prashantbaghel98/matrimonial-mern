const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key (move to .env in production)
const JWT_SECRET = "secretkey";

// Register User
const userCreate = async (req, res) => {
    try {
        const { name, username, email, mobile, password } = req.body;

        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this username/email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            username,
            email,
            mobile,
            password: hashPassword
        });

        user.password = undefined; // Don't send password back
        res.status(201).json({ success: true, message: "User registered successfully", data: user });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating user", error: error.message });
    }
};

// Login User
const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({ username });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

        // Send cookie
        res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        user.password = undefined;
        res.status(200).json({ success: true, message: "Login successful", data: user, token });

    } catch (error) {
        res.status(500).json({ success: false, message: "Login error", error: error.message });
    }
};

// Logout
const userLogout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successful" });
};

// Protected Route Example
const getProfile = async (req, res) => {
    const user = await userModel.findById(req.userId).select("-password");
    res.status(200).json({ success: true, data: user });
};

module.exports = { userCreate, userLogin, userLogout, getProfile };