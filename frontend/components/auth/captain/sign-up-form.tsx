"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { EyeIcon, EyeOffIcon, MapPinIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { captainRegisterFormSchema } from "@/features/types/auth/schema"
import { captainRegister } from "@/features/actions/auth/auth"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
type CaptainFormValues = z.infer<typeof captainRegisterFormSchema>

export function CaptainRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const router = useRouter()

  const form = useForm<CaptainFormValues>({
    resolver: zodResolver(captainRegisterFormSchema),
    defaultValues: {
      fullName: {
        firstName: "",
        lastName: "",
      },
      email: "",
      password: "",
      confirmPassword: "",
      vehicle: {
        color: "",
        plate: "",
        capacity: 4,
        vehicleType: "car",
      },
      location: {
        ltd: undefined,
        lng: undefined,
      },
    },
  })

  async function onSubmit(values: CaptainFormValues) {
    setIsLoading(true)
    try {
      const res = await captainRegister(values)
      if(res.success){
        toast.success(res.message)
        router.push("/auth/captain/login")
      }else if(res.error){
        toast.error(res.error.message)
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.error("Registration failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("location.ltd", position.coords.latitude)
          form.setValue("location.lng", position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Captain Registration</CardTitle>
        <CardDescription>Register as a captain to start accepting rides</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="vehicle">Vehicle Details</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                            <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("vehicle")}>
                    Next: Vehicle Details
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="vehicle" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicle.color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicle.plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Plate</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicle.capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passenger Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicle.vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={() => (
                    <FormItem>
                      <FormLabel>Current Location</FormLabel>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGetLocation}
                          className="flex items-center gap-2"
                        >
                          <MapPinIcon className="size-4" />
                          Get Current Location
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="text-sm">
                          <span className="font-medium">Latitude: </span>
                          {form.watch("location.ltd") || "Not set"}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Longitude: </span>
                          {form.watch("location.lng") || "Not set"}
                        </div>
                      </div>
                      <FormDescription>Your location will be used to match you with nearby riders.</FormDescription>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                    Back to Personal Info
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register as Captain"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link href="/auth/captain/login" className="text-primary hover:underline underline-offset-4">
          Already have an account? Login here
        </Link>
      </p>
      </CardFooter>
    </Card>
  )
}

