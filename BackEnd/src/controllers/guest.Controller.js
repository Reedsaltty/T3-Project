import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";
import { reqParamId } from "../utils/reqBody.utils.js";

export const getGuests = async (req, res) => {
  try {
    const guests = await prisma.attendee.findMany({
      where: {
        eventId: parseInt(reqParamId(req)),
      },
    });
    if (!guests) {
      res.status(201).json({ message: "There is no guest in the list " });
      return;
    }
    res.status(201).json(guests);
  } catch (err) {
    handleServerError(res, err, "Fetching guests incomplete");
  }
};

export const addGuest = async (req, res) => {
  try {
    const { name, email} = req.body
    const guest = await prisma.attendee.create({
        data: {
            name : toString(name),
            email : toString(email)
        }
    })
  } catch (err) {
    handleServerError(res, err, "Internal server error");
  }
};

export const getGuestById = async (req, res) => {
  try {
    const guest = await prisma.attendee.findUnique({
      where: { attendeeId: parseInt(reqParamId(req)) },
    });
    if (!guest) {
      res.status(201).json({ message: "The input guest is not in the list" });
      return;
    }
    res.status(201).json(guest);
  } catch (err) {
    handleServerError(res, err, "Fetching guest incomplete");
  }
};

export const updateGuestInfo = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateGuest = await prisma.attendee.update({
      where: {
        attendeeId: parseInt(reqParamId(req)),
      },
      data: {
        name: name?.toString(),
        email: email?.toString(),
      },
    });
    res.status(201).json(updateGuest);
  } catch (err) {
    handleServerError(res, err, "Fetching guest incomplete");
  }
};

export const deleteGuest = async (req, res) => {
  try {
    await prisma.attendee.delete({
      where: { attendeeId: parseInt(reqParamId(req)) },
    });
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error delete guest");
  }
};
