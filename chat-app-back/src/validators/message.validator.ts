import { validateResult } from "@/middlewares/validate.middleware";
import { check } from "express-validator";

export const validateSendMessage = [
    check('text')
        .exists()
        .withMessage('Text is required')
        .isString()
        .withMessage('Text must be a string'),

    check('image')
        .optional()
        .isString()
        .withMessage('Image must be a string'),

    validateResult
];