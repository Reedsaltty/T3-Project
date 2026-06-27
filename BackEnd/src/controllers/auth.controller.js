import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.config.js";
import { jwtConfig } from "../config/jwt.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: { username, email, passwordHash: hashPass },
    });

    // Bug fix: assign 'user' role (roleId: 1) to every new registrant
    await prisma.userRole.create({
      data: { userId: newUser.userId, roleId: 1 },
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.userId,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Include roles in token payload (spec 9.1)
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.userId },
      include: { role: true },
    });
    const roles = userRoles.map((ur) => ur.role.roleName);

    const accessToken = generateAccessToken({ ...user, roles });
    const refreshToken = generateRefreshToken(user);

    // Bug fix: add secure cookie flags
    const cookieOptions = { httpOnly: true, secure: false, sameSite: "lax", path: "/" };
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        roles,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtConfig.refreshSecret);
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token. Please log in again." });
    }

    const newAccessToken = generateAccessToken(decoded);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({ message: "Access token refreshed successfully" });
  } catch (error) {
    console.error("Refresh Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};