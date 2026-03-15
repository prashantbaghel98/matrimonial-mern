const userModel = require('../models/userModel')

// Create User
const userCreate = async (req, res) => {
    try {
        let { name, username, email, mobile, password } = req.body;

        // Check if user exists
        const existingUser = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this username or email already exists"
            });
        }

        // Create new user
        const user = await userModel.create({
            name,
            username,
            email,
            mobile,
            password
        });
        // await user.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message
        });
    }
}


// Login User
const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login error",
            error: error.message
        });
    }
}

module.exports = {
    userCreate,
    userLogin
}