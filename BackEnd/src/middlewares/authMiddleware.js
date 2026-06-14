import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Token does not exist" });
    }
    
    jwt.verify(token, jwtConfig.accessSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Attach the decoded payload to the request
        next(); // Let the user through
    });
}