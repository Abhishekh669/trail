import { Router } from "express";
import { middlewareValidation } from "../middlewares/auth.middleware";
import { getAddressCoordinate } from "../services/maps.service";


const router = Router();

router.get('/get-coordinates', middlewareValidation, getAddressCoordinate )