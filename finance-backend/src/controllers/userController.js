import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

// ─── GET ALL USERS (admin only) ──────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Get all users error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  GET SINGLE USER (admin only) 
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get user error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, status, name } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "User not found" });

    if (id === req.user.id && status === "inactive") {
      return res
        .status(400)
        .json({ message: "You cannot deactivate your own account" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(status && { status }),
        ...(name && { name }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (id === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "User not found" });

    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  GET OWN PROFILE (any logged in user) 
export const getMyProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── CHANGE PASSWORD (any logged in user) ─────────────────
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Basic validation
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ message: 'New password must be different from current password' });
  }

  try {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};