/**
 * Events Routes
 * host + /api/events
 */
const { Router } = require("express");
const { check } = require("express-validator");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events.controller");
const { isDate } = require("../helpers/isDate");
const router = Router();

const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");

// router.get("/", validateJWT, getEvents);
// router.post("/", validateJWT, createEvent);
// router.put("/:id", validateJWT, updateEvent);
// router.delete("/:id", validateJWT, deleteEvent);

//All routes have to validate the JWT
router.use(validateJWT);

router.get("/", getEvents);

//If we place this line here, getEvents would be the only public route and the rest would not
//router.use(validateJWT);

router.post(
  "/",
  [
    check("title", "A title is required").notEmpty(),
    check("start", "A start date is required").custom(isDate),
    check("end", "A end date is required").custom(isDate),
    validateFields,
  ],
  createEvent
);

router.put(
  "/:id",
  [check("id", "Invalid id").isMongoId(), validateFields],
  updateEvent
);

router.delete("/:id", deleteEvent);

module.exports = router;
