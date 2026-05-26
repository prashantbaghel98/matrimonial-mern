
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ======================================================
// REGISTER USER
// ======================================================

const userCreate = async (req, res) => {

    try {

        const {
            name,
            username,
            email,
            mobile,
            password
        } = req.body;

        // ================= VALIDATION =================

        if (
            !name ||
            !username ||
            !email ||
            !mobile ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // ================= CHECK USER =================

        const existingUser = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Username or email already exists"
            });

        }

        // ================= HASH PASSWORD =================

        const hashPassword = await bcrypt.hash(password, 10);

        // ================= CREATE USER =================

        const user = await userModel.create({
            name,
            username,
            email,
            mobile,
            password: hashPassword,
            role: "user"
        });

        // ================= REMOVE PASSWORD =================

        const userData = user.toObject();
        delete userData.password;

        // ================= RESPONSE =================

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userData
        });

    } catch (error) {

        console.log("REGISTER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message
        });

    }

};


// ======================================================
// LOGIN USER
// ======================================================

const userLogin = async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        // ================= VALIDATION =================

        if (!username || !password) {

            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });

        }

        // ================= FIND USER =================

        const user = await userModel.findOne({ username });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // ================= CHECK PASSWORD =================

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });

        }

        // ================= JWT TOKEN =================

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );

        // ================= COOKIE =================

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        // ================= REMOVE PASSWORD =================

        const userData = user.toObject();
        delete userData.password;

        // ================= RESPONSE =================

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: userData
        });

    } catch (error) {

        console.log("LOGIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Login error",
            error: error.message
        });

    }

};


// ======================================================
// LOGOUT USER
// ======================================================

const userLogout = async (req, res) => {

    try {

        res.clearCookie("token");

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ======================================================
// GET LOGGED IN USER PROFILE
// ======================================================

const userProfile = async (req, res) => {

    try {

        const user = await userModel
            .findById(req.userId)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        console.log("GET PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// ======================================================
//  USER PROFILE UPDATE
// ======================================================


const userProfileUpdate = async (req, res) => {

   try {

      const {
         name,
         email,
         mobile,
         password
      } = req.body;

      const updateData = {
         name,
         email,
         mobile
      };

      if(password){

         const hashedPassword =
         await bcrypt.hash(password,10);

         updateData.password =
         hashedPassword;

      }

      const updatedUser =
      await userModel.findByIdAndUpdate(
         req.userId,
         updateData,
         { new:true }
      ).select("-password");

      res.status(200).json({
         success:true,
         data:updatedUser
      });

   } catch (error) {

      res.status(500).json({
         success:false,
         message:error.message
      });

   }

};

module.exports = {
    userCreate,
    userLogin,
    userLogout,
    userProfile,
    userProfileUpdate
};