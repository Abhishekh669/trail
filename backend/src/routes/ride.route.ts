import { Router } from "express";
import { middlewareValidation } from "../middlewares/auth.middleware";
import { body } from "express-validator";
import { createRiderHandler, DeleteRideController } from "../controller/ride.controller";

const router = Router();

router.post(
  "/create",
  middlewareValidation,
  [
    body("userId")
      .isString()
      .isLength({ min: 24, max: 24 })
      .withMessage("Invalid user id "),
    body("pickup").isObject().withMessage("Pickup must be an object"),

    body("pickup.location")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Pickup location must be a valid string (min 3 chars)"),

    body("pickup.lat")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Pickup latitude must be a valid number between -90 and 90"),

    body("pickup.lon")
      .isFloat({ min: -180, max: 180 })
      .withMessage(
        "Pickup longitude must be a valid number between -180 and 180"
      ),

    // Validate destination object
    body("destination").isObject().withMessage("Destination must be an object"),

    body("destination.location")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Destination location must be a valid string (min 3 chars)"),

    body("destination.lat")
      .isFloat({ min: -90, max: 90 })
      .withMessage(
        "Destination latitude must be a valid number between -90 and 90"
      ),

    body("destination.lon")
      .isFloat({ min: -180, max: 180 })
      .withMessage(
        "Destination longitude must be a valid number between -180 and 180"
      ),
    body("distance").isFloat({min : 0}).withMessage("invalid distance"),
    body("vehicleType")
      .isString()
      .isIn(["driving" , "cycling", "walking"])
      .withMessage("Invalid vehicle type"),
  ],
  createRiderHandler
);


router.delete('/delete/:id', middlewareValidation, DeleteRideController)

export default router;
