import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

export function authMiddleware(req, res, next) {
    const token = req.cookies.accessToken ;
    
    if (!token) {
        return res.status(401).json({ message: "Token does not exist" });
    }
    
    jwt.verify(token, jwtConfig.accessSecret, (err, user) => {
        if (err) {
            console.error("JWT Verify Error:", err.message);
            return res.status(403).json({ message: "Forbidden", error: err.message });
        }
        req.user = user; // Attach the decoded payload to the request
        next(); // Let the user through
    });
}