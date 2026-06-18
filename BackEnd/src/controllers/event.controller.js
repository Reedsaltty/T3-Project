import prisma from "../config/prisma.config.js";


// CREATE an event
export const crateEvent = async (req, res) => {
    try{
        const {eventTitle , eventType, eventDate, eventTime, budget } = req.body ;
        const newEvent = await prisma.event.create({
            data : {
                eventTitle : toString(eventTitle),
                eventTypeId: parseInt(eventType),
                eventDate: new Date(eventDate),
                eventTime: new Date(eventTime),
                budget,
                userId: req.user.userId 
            }
        })
        res.status(201).json(newEvent)
    } catch (err) {
        req.log.error(err);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


// READ (Get all events for the user )
export const getEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: { userId: req.user.userId }
        });
        res.status(200).json(events);
    } catch (error) {
        req.log.error(error);
        res.status(500).json({ message: "Error fetching events" });
    }
}; 

// READ (Get the specific  event)
export const getEventsByTitle = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: { userId: req.user.userId }
        });
        res.status(200).json(events);
    } catch (error) {
        req.log.error(error);
        res.status(500).json({ message: "Error fetching events" });
    }
};


// UPDATE an event
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, location } = req.body;
        const updated = await prisma.event.update({
            where: { eventId: parseInt(id) },
            data: { title, date, location }
        });
        res.status(200).json(updated);
    } catch (error) {
        req.log.error(error);
        res.status(500).json({ message: "Error updating event" });
    }
};

// DELETE an event
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.event.delete({
            where: { eventId: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        req.log.error(error);
        res.status(500).json({ message: "Error deleting event" });
    }
};
