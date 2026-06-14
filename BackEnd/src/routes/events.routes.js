import express from "express";
const router  = express.Router();

router.get("/events", (req, res) => {
    res.send("Events route");
})
router.post("/events", (req, res) => {
    res.send("Events route");
})
router.get("/events/:id", (req, res) =>{
    res.send()
})
export default router;