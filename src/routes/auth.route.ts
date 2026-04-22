import { Router } from "express";
import {register} from "../controllers/auth.controller";
import validate from "../middlewares/validate.middleware";
import { registerSchema } from "../validations/validation";


const router = Router()

// @route  POST /api/v1/auth/register
// @desc   Register a new user
// @access Public
router.route('/register').post(validate(registerSchema), register)

export default router