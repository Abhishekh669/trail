import { z } from "zod";




export const userLoginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })



export const userRegisterFormSchema =  z
.object({
  fullName: z.object({
    firstName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
    lastName: z.string().min(3, { message: "Last name must be at least 3 characters long" }).optional(),
  }),
  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters long" })
    .email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})





export const captainLoginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })


  export const captainRegisterFormSchema = z
  .object({
    fullName: z.object({
      firstName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
      lastName: z.string().min(3, { message: "Last name must be at least 3 characters long" }).optional(),
    }),
    email: z.string().email({ message: "Please enter a valid email" }).toLowerCase(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string(),
    vehicle: z.object({
      color: z.string().min(3, { message: "Color must be at least 3 characters long" }),
      plate: z.string().min(3, { message: "Plate must be at least 3 characters long" }),
      capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
      vehicleType: z.enum(["car", "motorcycle", "auto"], {
        message: "Please select a valid vehicle type",
      }),
    }),
    location: z.object({
      ltd: z.number().optional(),
      lng: z.number().optional(),
    }).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  
  
  
  