import prisma from "../config/db.js";
import { validationResult } from "express-validator";
import { format } from "fast-csv";

//  CREATE RECORD (admin only)
export const createRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, type, category, date, notes } = req.body;

  try {
    const record = await prisma.financialRecord.create({
      data: {
        amount,
        type,
        category,
        date: new Date(date),
        notes,
        createdBy: req.user.id,
      },
    });

    return res.status(201).json({
      message: "Record created successfully",
      record,
    });
  } catch (error) {
    console.error("Create record error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  GET ALL RECORDS (admin + analyst)
export const getAllRecords = async (req, res) => {
  const {
    type,
    category,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    // Build dynamic filter
    const where = { isDeleted: false };

    if (type) where.type = type;
    if (category) where.category = { contains: category, mode: "insensitive" };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Search across category and notes fields
    if (search) {
      where.OR = [
        { category: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await prisma.financialRecord.count({ where });

    const records = await prisma.financialRecord.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take: parseInt(limit),
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      records,
    });
  } catch (error) {
    console.error("Get records error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  GET SINGLE RECORD (admin + analyst)
export const getRecordById = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await prisma.financialRecord.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ record });
  } catch (error) {
    console.error("Get record error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  UPDATE RECORD (admin only)
export const updateRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { amount, type, category, date, notes } = req.body;

  try {
    const existing = await prisma.financialRecord.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      return res.status(404).json({ message: "Record not found" });
    }

    const updated = await prisma.financialRecord.update({
      where: { id },
      data: {
        ...(amount && { amount }),
        ...(type && { type }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
        ...(notes !== undefined && { notes }),
      },
    });

    return res.status(200).json({
      message: "Record updated successfully",
      record: updated,
    });
  } catch (error) {
    console.error("Update record error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  SOFT DELETE RECORD (admin only)
export const deleteRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.financialRecord.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      return res.status(404).json({ message: "Record not found" });
    }

    await prisma.financialRecord.update({
      where: { id },
      data: { isDeleted: true },
    });

    return res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Delete record error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const exportRecordsCSV = async (req, res) => {
  const { type, category, startDate, endDate } = req.query;

  try {
    // Build filter same as getAllRecords
    const where = { isDeleted: false };

    if (type) where.type = type;
    if (category) where.category = { contains: category, mode: "insensitive" };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const records = await prisma.financialRecord.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=financial_records.csv",
    );

    
    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    
    records.forEach((record) => {
      csvStream.write({
        ID: record.id,
        Amount: record.amount,
        Type: record.type,
        Category: record.category,
        Date: new Date(record.date).toISOString().split("T")[0],
        Notes: record.notes || "",
        CreatedBy: record.user ? record.user.name : "N/A",
        CreatedAt: new Date(record.createdAt).toISOString().split("T")[0],
      });
    });

    csvStream.end();
  } catch (error) {
    console.error("Export CSV error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
