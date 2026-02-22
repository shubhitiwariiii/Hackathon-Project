import { body, param, validationResult } from "express-validator";

// Shared handler — checks for validation errors and returns 400 if any
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// ─── Auth Validators ───────────────────────────────────────

const validateSignup = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .isLength({ max: 128 }).withMessage("Password must be at most 128 characters"),
    handleValidationErrors,
];

const validateLogin = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required"),
    handleValidationErrors,
];

// ─── Note Validators ──────────────────────────────────────

const validateCreateNote = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ max: 200 }).withMessage("Title must be at most 200 characters")
        .escape(),
    body("content")
        .notEmpty().withMessage("Content is required")
        .isLength({ max: 50000 }).withMessage("Content must be at most 50,000 characters"),
    body("category")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("Category must be at most 50 characters")
        .escape(),
    body("topic")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("Topic must be at most 50 characters")
        .escape(),
    body("difficulty")
        .optional()
        .isIn(["Easy", "Medium", "Hard"]).withMessage("Difficulty must be Easy, Medium, or Hard"),
    body("tags")
        .optional()
        .isArray({ max: 20 }).withMessage("Tags must be an array with at most 20 items"),
    body("tags.*")
        .optional()
        .trim()
        .isLength({ max: 30 }).withMessage("Each tag must be at most 30 characters")
        .escape(),
    body("isFavorite")
        .optional()
        .isBoolean().withMessage("isFavorite must be a boolean"),
    body("color")
        .optional()
        .trim()
        .escape(),
    handleValidationErrors,
];

const validateUpdateNote = [
    param("id")
        .isMongoId().withMessage("Invalid note ID"),
    body("title")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("Title must be at most 200 characters")
        .escape(),
    body("content")
        .optional()
        .isLength({ max: 50000 }).withMessage("Content must be at most 50,000 characters"),
    body("category")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("Category must be at most 50 characters")
        .escape(),
    body("topic")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("Topic must be at most 50 characters")
        .escape(),
    body("difficulty")
        .optional()
        .isIn(["Easy", "Medium", "Hard"]).withMessage("Difficulty must be Easy, Medium, or Hard"),
    body("tags")
        .optional()
        .isArray({ max: 20 }).withMessage("Tags must be an array with at most 20 items"),
    body("tags.*")
        .optional()
        .trim()
        .isLength({ max: 30 }).withMessage("Each tag must be at most 30 characters")
        .escape(),
    body("isFavorite")
        .optional()
        .isBoolean().withMessage("isFavorite must be a boolean"),
    body("color")
        .optional()
        .trim()
        .escape(),
    handleValidationErrors,
];

const validateNoteId = [
    param("id")
        .isMongoId().withMessage("Invalid note ID"),
    handleValidationErrors,
];

export {
    validateSignup,
    validateLogin,
    validateCreateNote,
    validateUpdateNote,
    validateNoteId,
};
