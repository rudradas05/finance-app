import { body, query } from "express-validator";

export const createRecordValidator = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Date must be a valid date (YYYY-MM-DD)"),

  body("notes").optional().trim(),
];

export const updateRecordValidator = [
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),

  body("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),

  body("date")
    .optional()
    .isDate()
    .withMessage("Date must be a valid date (YYYY-MM-DD)"),

  body("notes").optional().trim(),
];
