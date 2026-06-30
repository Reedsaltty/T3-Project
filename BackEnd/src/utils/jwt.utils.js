import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

export function generateAccessToken(user) {
    const payload = { userId: user.userId, username: user.username, email: user.email, roles: user.roles || [] };
    return jwt.sign(payload, jwtConfig.accessSecret, jwtConfig.accessOptions);
}

export function generateRefreshToken(user) {
    const payload = { userId: user.userId, username: user.username, email: user.email };
    return jwt.sign(payload, jwtConfig.refreshSecret, jwtConfig.refreshOptions);
}
