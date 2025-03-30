"use client"

import React, { useState, useEffect, use } from "react"
import {
  Car,
  CheckCircle,
  Clock,
  MapPin,
  PhoneCall,
  User,
  X,
  XCircle,
  AlertTriangle,
  CheckCheck,
  Shield,
  LocateFixed,
  Menu,
  Navigation,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DashboardSidebarContent } from "../dashboard/dashboard-sidebar-content"
import { useCaptainSocketIoStore, useUserSocketIoStore } from "@/features/store/socket/use-socket-store"
import { useUpdateStatus } from "@/features/hooks/tanstack/mutate-hook/captain/use-update-status"
import { useCaptainStore, useUserStore } from "@/features/store/users/use-user-store"
import { CaptainDataType } from "@/features/types/users"
import { useRideStore } from "@/features/store/ride/use-ride-store"

export interface RideRequest {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
    phone?: string
    profileImage?: string
  }
  pickup: {
    location: string
    lat: number
    lon: number
  }
  destination: {
    location: string
    lat: number
    lon: number
  }
  distance: number
  vehicleType: "driving" | "cycling" | "walking"
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled"
  createdAt: string
  price?: number
}

export type DriverStatus = "offline" | "available" | "on_ride"

const NOMINATIM_API = "https://nominatim.openstreetmap.org"

export default function DriverDashboard() {
  const {user} = useCaptainStore();
  const [driverStatus, setDriverStatus] = useState<DriverStatus>( "offline")
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([])
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<[number, number]>()
  const [driverLocation, setDriverLocation] = useState<string>("Loading location...")
  const {mutate : updateStatus, isPending : updatingStatus} = useUpdateStatus();
  const {
    socket, connectSocket, disconnectSocket
  } = useCaptainSocketIoStore();

  const {rides, ride, subscribeToRides} = useRideStore()
  console.log("this are the rides and ride : ",rides, ride)


 







  // Get driver's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setMarkerPosition([latitude, longitude])
          try {
            const response = await fetch(`${NOMINATIM_API}/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
              headers: {
                "Accept-Language": "en-US,en;q=0.9",
                "User-Agent": "RideApp/1.0",
              },
            })
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const data = await response.json()
            setDriverLocation(data.display_name || "Current location")
          } catch (error) {
            console.error("Error getting address:", error)
            setDriverLocation("Current location")
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setMarkerPosition([40.7128, -74.006])
          setDriverLocation("Location access denied")
        },
      )
    }
  }, []);

  // Simulate fetching ride requests
  // useEffect(() => {
  //   if (driverStatus === "available") {
  //     const mockRideRequests: RideRequest[] = [
  //       {
  //         _id: "ride1",
  //         userId: {
  //           _id: "user1",
  //           name: "John Doe",
  //           email: "john@example.com",
  //           phone: "+1234567890",
  //           profileImage: "/placeholder.svg?height=40&width=40",
  //         },
  //         pickup: {
  //           location: "123 Main St, New York, NY",
  //           lat: 40.7128,
  //           lon: -74.006,
  //         },
  //         destination: {
  //           location: "Times Square, New York, NY",
  //           lat: 40.758,
  //           lon: -73.9855,
  //         },
  //         distance: 3.2,
  //         vehicleType: "driving",
  //         status: "pending",
  //         createdAt: new Date().toISOString(),
  //         price: 15.5,
  //       },
  //       {
  //         _id: "ride2",
  //         userId: {
  //           _id: "user2",
  //           name: "Jane Smith",
  //           email: "jane@example.com",
  //           profileImage: "/placeholder.svg?height=40&width=40",
  //         },
  //         pickup: {
  //           location: "Brooklyn Bridge, New York, NY",
  //           lat: 40.7061,
  //           lon: -73.9969,
  //         },
  //         destination: {
  //           location: "Central Park, New York, NY",
  //           lat: 40.7812,
  //           lon: -73.9665,
  //         },
  //         distance: 5.7,
  //         vehicleType: "driving",
  //         status: "pending",
  //         createdAt: new Date(Date.now() - 300000).toISOString(),
  //         price: 22.75,
  //       },
  //     ]
  //     setRideRequests(mockRideRequests)
  //   } else {
  //     setRideRequests([])
  //   }
  // }, [driverStatus])

  const handleStatusChange = (isActive: boolean) => {
    console.log("this is triggering")
    if(updatingStatus)return;
    if (currentRide) {
      toast.error("You cannot go offline while on a ride")
      return
    }


    updateStatus(isActive ? "available" : "offline",{
      onSuccess : (res) =>{
        if(res.message && res.success){
          toast.success(isActive ? "You are now online" : "You are now offline")

        } else if(res.error) toast.error(res.error)
      },
      onError : (error) =>{
          toast.error(error.message || "something went wrong")
      }
    })

  }

 

  const handleAcceptRide = (ride: RideRequest) => {
    setIsLoading(true)
    setTimeout(() => {
      const updatedRide = { ...ride, status: "accepted" as const }
      setCurrentRide(updatedRide)
      setRideRequests((prev) => prev.filter((r) => r._id !== ride._id))
      setDriverStatus("on_ride")
      setIsLoading(false)
      toast.success("Ride accepted successfully")
    }, 1000)
  }

  const handleRejectRide = (rideId: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setRideRequests((prev) => prev.filter((ride) => ride._id !== rideId))
      setIsLoading(false)
      toast.success("Ride rejected")
    }, 1000)
  }

  const handleCompleteRide = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentRide(null)
      setDriverStatus("available")
      setIsLoading(false)
      toast.success("Ride completed successfully")
    }, 1000)
  }

  const handleCancelRide = () => {
    if (!currentRide) return
    setIsLoading(true)
    setTimeout(() => {
      setCurrentRide(null)
      setDriverStatus("available")
      setIsLoading(false)
      toast.success("Ride cancelled")
    }, 1000)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "driving": return <Car className="h-4 w-4" />
      case "cycling": return <Navigation className="h-4 w-4" />
      case "walking": return <User className="h-4 w-4" />
      default: return <Car className="h-4 w-4" />
    }
  }

  const handleLocationUpdate = async (position: [number, number]) => {
    setMarkerPosition(position)
    try {
      const response = await fetch(`${NOMINATIM_API}/reverse?format=json&lat=${position[0]}&lon=${position[1]}`, {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "RideApp/1.0",
        },
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setDriverLocation(data.display_name || "Selected location")
    } catch (error) {
      console.error("Error getting address:", error)
      setDriverLocation("Selected location")
    }
  }

  return (
    <main className="flex h-[100dvh] bg-gray-100 dark:bg-gray-900 relative">
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden absolute top-4 left-4 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="h-16 border-b px-4 flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <SheetTitle className="font-semibold text-lg">Driver Dashboard</SheetTitle>
              </div>
            </SheetHeader>
            <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
              <DashboardSidebarContent 
                driverStatus={user?.status || "offline"}
                handleStatusChange={handleStatusChange}
                isLoading={isLoading}
                currentRide={currentRide}
                rideRequests={rideRequests}
                driverLocation={driverLocation}
                handleAcceptRide={handleAcceptRide}
                handleRejectRide={handleRejectRide}
                handleCompleteRide={handleCompleteRide}
                handleCancelRide={handleCancelRide}
                formatTime={formatTime}
                getVehicleIcon={getVehicleIcon}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full bg-background dark:bg-gray-800 border-r dark:border-gray-700 flex-col z-10 w-80">
        <div className="h-16 border-b dark:border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="font-semibold text-lg dark:text-white">Driver Dashboard</h1>
          </div>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          <DashboardSidebarContent 
            driverStatus={user?.status || "offline"}
            handleStatusChange={handleStatusChange}
            isLoading={isLoading}
            currentRide={currentRide}
            rideRequests={rideRequests}
            driverLocation={driverLocation}
            handleAcceptRide={handleAcceptRide}
            handleRejectRide={handleRejectRide}
            handleCompleteRide={handleCompleteRide}
            handleCancelRide={handleCancelRide}
            formatTime={formatTime}
            getVehicleIcon={getVehicleIcon}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-0">
        {/* Map or other main content would go here */}
        
        <div className="absolute bottom-4 right-4 z-20">
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => {
              if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords
                  handleLocationUpdate([latitude, longitude])
                })
              }
            }}
          >
            <LocateFixed className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </main>
  )
}
