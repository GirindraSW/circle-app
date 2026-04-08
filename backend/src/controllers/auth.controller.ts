import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const generateToken = (payload: {
  user_id: string;
  username: string;
  name: string;
  email: string;
}) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);

// Register
export const register = async (req: Request, res: Response) => {
  const { username, name, email, password } = req.body || {};

  if (!JWT_SECRET) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "JWT_SECRET belum diset.",
    });
  }

  if (!username || !name || !email || !password) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Semua field wajib diisi.",
    });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        code: 409,
        status: "error",
        message: "Email atau username sudah digunakan.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        full_name: name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken({
      user_id: newUser.id,
      username: newUser.username,
      name: newUser.full_name,
      email: newUser.email,
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Registrasi berhasil. Akun berhasil dibuat.",
      data: {
        user_id: newUser.id,
        username: newUser.username,
        name: newUser.full_name,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Invalid register",
    });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body || {};

  if (!JWT_SECRET) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "JWT_SECRET belum diset.",
    });
  }

  if (!identifier || !password) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Identifier dan password wajib diisi.",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Invalid Login",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Invalid Login",
      });
    }

    const token = generateToken({
      user_id: user.id,
      username: user.username,
      name: user.full_name,
      email: user.email,
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successful.",
      data: {
        user_id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        avatar: user.photo_profile,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Invalid Login",
    });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        photo_profile: true,
        bio: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "User profile fetched.",
      data: {
        user_id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        avatar: user.photo_profile,
        bio: user.bio,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Failed to fetch profile",
    });
  }
};
