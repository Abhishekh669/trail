import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar } from "@radix-ui/react-avatar"
import { AlertTriangle, CheckCheck, CheckCircle, Clock, MapPin, PhoneCall, X, XCircle } from "lucide-react"
import { DriverStatus, RideRequest } from "../map/use-sidebar"

// Sidebar Content Component
export const DashboardSidebarContent = ({
    driverStatus,
    handleStatusChange,
    isLoading,
    currentRide,
    rideRequests,
    driverLocation,
    handleAcceptRide,
    handleRejectRide,
    handleCompleteRide,
    handleCancelRide,
    formatTime,
    getVehicleIcon
  }: {
    driverStatus: DriverStatus
    handleStatusChange: (isActive: boolean) => void
    isLoading: boolean
    currentRide: RideRequest | null
    rideRequests: RideRequest[]
    driverLocation: string
    handleAcceptRide: (ride: RideRequest) => void
    handleRejectRide: (rideId: string) => void
    handleCompleteRide: () => void
    handleCancelRide: () => void
    formatTime: (dateString: string) => string
    getVehicleIcon: (type: string) => React.JSX.Element
  }) => {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Driver" />
              <AvatarFallback className="dark:bg-gray-700 dark:text-white">DR</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium dark:text-white">Alex Driver</h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">4.9 ★</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground dark:text-gray-400">
              {driverStatus === "offline" ? "Offline" : driverStatus === "available" ? "Available" : "On Ride"}
            </span>
            <Switch
              checked={driverStatus !== "offline"}
              onCheckedChange={handleStatusChange}
              disabled={isLoading || driverStatus === "on_ride"}
            />
          </div>
        </div>
  
        <div className="mb-4">
          <p className="text-sm text-muted-foreground dark:text-gray-400">Current Location</p>
          <p className="text-sm font-medium truncate dark:text-white">{driverLocation}</p>
        </div>
  
        <Separator className="my-4 dark:bg-gray-700" />
  
        {driverStatus === "offline" && (
          <Card className="bg-muted/50 dark:bg-gray-700/50">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground dark:text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-lg mb-2 dark:text-white">You're offline</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
                Go online to start receiving ride requests
              </p>
              <Button onClick={() => handleStatusChange(true)} className="w-full">
                Go Online
              </Button>
            </CardContent>
          </Card>
        )}
  
        {driverStatus === "available" && rideRequests.length === 0 && (
          <Card className="bg-muted/50 dark:bg-gray-700/50">
            <CardContent className="pt-6 text-center">
              <Clock className="h-12 w-12 text-muted-foreground dark:text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-lg mb-2 dark:text-white">Waiting for requests</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                You'll be notified when new ride requests arrive
              </p>
            </CardContent>
          </Card>
        )}
  
        {driverStatus === "available" && rideRequests.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg dark:text-white">New Ride Requests</h3>
            {rideRequests &&  rideRequests.map((ride) => (
              <Card key={ride._id} className="overflow-hidden dark:bg-gray-800">
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={ride.userId.profileImage} alt={ride.userId.name} />
                        <AvatarFallback className="dark:bg-gray-700 dark:text-white">
                          {ride.userId.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base dark:text-white">{ride.userId.name}</CardTitle>
                        <CardDescription className="text-xs dark:text-gray-400">
                          {formatTime(ride.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 dark:border-gray-600">
                      {getVehicleIcon(ride.vehicleType)}
                      <span>${ride.price?.toFixed(2)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 my-1"></div>
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground dark:text-gray-400">Pickup</p>
                        <p className="truncate dark:text-white">{ride.pickup.location}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground dark:text-gray-400">Destination</p>
                        <p className="truncate dark:text-white">{ride.destination.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {ride.distance.toFixed(1)} km
                    </span>
                    <span className="text-muted-foreground dark:text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> ~{Math.round(ride.distance * 3)} min
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 dark:border-gray-600 dark:text-white"
                    onClick={() => handleRejectRide(ride._id)}
                    disabled={isLoading}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                  </Button>
                  <Button className="flex-1" onClick={() => handleAcceptRide(ride)} disabled={isLoading}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Accept
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
  
        {currentRide && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg dark:text-white">Current Ride</h3>
            <Card className="dark:bg-gray-800">
              <CardHeader className="p-4 pb-0 bg-primary/5 dark:bg-primary/10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentRide.userId.profileImage} alt={currentRide.userId.name} />
                      <AvatarFallback className="dark:bg-gray-700 dark:text-white">
                        {currentRide.userId.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base dark:text-white">{currentRide.userId.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-white">
                          ${currentRide.price?.toFixed(2)}
                        </Badge>
                        <Badge variant="outline" className="text-xs flex items-center gap-1 dark:border-gray-600">
                          {getVehicleIcon(currentRide.vehicleType)}
                          <span>{currentRide.distance.toFixed(1)} km</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="dark:text-white">
                    <PhoneCall className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 my-1"></div>
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground dark:text-gray-400">Pickup</p>
                      <p className="truncate dark:text-white">{currentRide.pickup.location}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground dark:text-gray-400">Destination</p>
                      <p className="truncate dark:text-white">{currentRide.destination.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 dark:border-gray-600 dark:text-white"
                  onClick={handleCancelRide}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button className="flex-1" onClick={handleCompleteRide} disabled={isLoading}>
                  <CheckCheck className="h-4 w-4 mr-2" /> Complete
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </>
    )
  }