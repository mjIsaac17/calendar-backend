const e = require("express");
const Event = require("../models/Event.model");

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("user", "name email");
    res.json({ events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Cannot get events, contact IT for support" });
  }
};

const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    event.user = req.uid;

    const eventSaved = await event.save();
    res.status(201).json({
      event: eventSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Contact IT for support" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    //Verify if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        msg: "There is no event for this id",
      });
    }

    //Verify if the user is the owner
    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        msg: "You cannot edit this event",
      });
    }

    const newEvent = {
      ...req.body,
      user: req.uid,
    };

    const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.json({
      event: eventUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Contact IT for support" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    //Verify if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        msg: "There is no event for this id",
      });
    }

    //Verify if the user is the owner
    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        msg: "You cannot delete this event",
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    res.json({
      event: deletedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "An error ocurred when deleting the event, contact IT for support",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
