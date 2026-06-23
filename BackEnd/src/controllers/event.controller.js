import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";
import { reqParamId } from "../utils/reqBody.utils.js";

// CREATE an event
export const createEvent = async (req, res) => {
  try {
    const { eventTitle, eventType, eventDate, eventTime, budget } = req.body;
    const newEvent = await prisma.event.create({
      data: {
        eventTitle: toString(eventTitle),
        eventTypeId: parseInt(eventType),
        eventDate: new Date(eventDate),
        eventTime: new Date(eventTime),
        budget : parseInt(budget),
        userId: req.user.userId,
      },
    });
    res.status(201).json(newEvent);
  } catch (err) {
    handleServerError(res, err, "Internal server error !");
  }
};

// READ (Get all events for the user )
export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { userId: req.user.userId },
    });
    res.status(200).json(events);
  } catch (error) {
    handleServerError(res, err, "Error fetching event");
  }
};

// READ (Get the specific event by ID)
export const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        eventId: parseInt(reqParamId(req)),
        userId: req.user.userId, // Ensure the user owns this event
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (err) {
    handleServerError(res, err, "Error fetching event");
  }
};

// READ (Get the specific  event)
export const getEventsByTitle = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { userId: req.user.userId },
    });
    res.status(200).json(events);
  } catch (err) {
    handleServerError(res, err, "Error fetching event");
  }
};

// UPDATE an event
export const updateEvent = async (req, res) => {
  try {
    const { title, date, location } = req.body;
    const updated = await prisma.event.update({
      where: { eventId: parseInt(reqParamId(req)) },
      data: { title, date, location },
    });
    res.status(200).json(updated);
  } catch (err) {
    handleServerError(res, err, "Error updating event");
  }
};

// DELETE an event
export const deleteEvent = async (req, res) => {
  try {
    await prisma.event.delete({
      where: { eventId: parseInt(reqParamId(req)) },
    });
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error delete event");
  }
};



export const getBudget = async (req, res) => {
  try {
    const budget = await prisma.event.budget.findUnique({
      where:{
        eventId : parseInt(reqParamId(req))
      }
    })
    if(!budget){res.status(201).json({message : "Budget is not set" }); return }
    res.status(201).json(budget)

  }catch(err){
    handleServerError(res, err,"Fetching budget data incomplete")
  }
}