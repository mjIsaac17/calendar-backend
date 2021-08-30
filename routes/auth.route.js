/**
 * User Routes / Auth
 * host + /api/auth
 */
const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const {
  createUser,
  userLogin,
  renewToken,
} = require("../controllers/auth.controller");

const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");

router.post(
  "/new",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Email is not valid").isEmail(),
    check("password", "Password must be at least of 6 characters").isLength({
      min: 6,
    }),
    validateFields,
  ],
  createUser
);

router.post(
  "/",
  [
    check("email", "Email is not valid").isEmail(),
    check("password", "Password is required").notEmpty(),
    validateFields,
  ],
  userLogin
);

router.get("/renew", validateJWT, renewToken);

module.exports = router;
