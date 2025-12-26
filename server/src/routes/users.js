const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/role");

// Validation middleware
const userValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["admin", "sales_manager", "sales_rep", "support_agent"])
    .withMessage("Invalid role"),
];

// Protect all routes
router.use(auth);

// Routes with specific role requirements
router
  .route("/")
  .get(authorize("admin", "sales_manager", "support_agent"), getUsers)
  .post(authorize("admin"), userValidation, createUser);

router
  .route("/:id")
  .get(authorize("admin", "sales_manager", "support_agent"), getUser)
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);

module.exports = router;
