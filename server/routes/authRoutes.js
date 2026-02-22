import express from "express";
import { signup, login, googleAuthCallback } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import passport from "passport";
import { validateSignup, validateLogin } from "../middleware/validators.js";


const router = express.Router();

router.post("/signup", validateSignup, signup);

router.post("/login", validateLogin, login);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }),
    googleAuthCallback
);

// GitHub OAuth routes
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: "http://localhost:5173/login" }),
    googleAuthCallback
);

// protected route

router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        message: "Access Granted",
        user: req.user,
    });
});

export default router;