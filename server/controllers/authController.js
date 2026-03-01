import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../utils/jwt.js";
import asyncHandler from "express-async-handler";

// Signup Controller

const signup = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        res.status(409);
        throw new Error("User Already Exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword
    });

    res.status(201).json({
        message: "User registered successfully",
        userId: user._id, //stores the unique id of the object created in the NoSQL databases like MongoDB.
    });
});

// Login Controller

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All Fields are required");
    }

    //find user

    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error("Invalid Credentials");
    }

    // compare password

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid Credentials");
    }

    // generate token

    const token = generateToken(user._id);

    res.status(200).json({
        message: "Login successful",
        token,
        userId: user._id,
        email: user.email,
    });
});

const googleAuthCallback = asyncHandler(async (req, res) => {
    // req.user is populated by passport
    const token = generateToken(req.user._id);

    // Redirect to client with token
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/login?token=${token}&email=${req.user.email}`);
});

export { signup, login, googleAuthCallback };

