import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.config.js";
import { jwtConfig } from "../config/jwt.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists in Supabase
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        // Save the new user to Supabase
        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                passwordHash: hashPass
            }
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: newUser.userId
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user in Supabase
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set secure HTTP-only cookies
        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const  resetPassWord = async (req, res) => {
    try {

    } catch (err) {
        console.error("Reset password Error:", err)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const refresh = async (req, res) => {
    try {
        // 1. Read the refreshToken from the cookie
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        // 2. Verify the refreshToken using the refresh secret
        let decoded;
        try {
            decoded = jwt.verify(token, jwtConfig.refreshSecret);
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired refresh token. Please log in again." });
        }

        // 3. Issue a brand new accessToken
        const newAccessToken = generateAccessToken(decoded);

        // 4. Set the new accessToken as a cookie
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,   // set to true in production (HTTPS)
            sameSite: 'lax',
            path: '/'
        });

        res.status(200).json({ message: "Access token refreshed successfully" });

    } catch (error) {
        console.error("Refresh Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}