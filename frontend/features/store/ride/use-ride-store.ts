import { RideType } from "@/features/types/ride"
import {create} from "zustand"
import { useCaptainStore } from "../users/use-user-store";
import { useCaptainSocketIoStore } from "../socket/use-socket-store";


interface RideStoreType{
    setRide : (ride : RideType | null) => void;
    subscribeToRides : () => void,
  unsubscribeToRides : () => void,
    rides : RideType[] | [],
    ride : RideType | null,
    
}

export const useRideStore  = create<RideStoreType>((set, get)=>{
   return {
    ride : null,
    rides : [],
    setRide : (ride) =>{
        set({ride}) 
    },
    subscribeToRides : () =>{
        const user = useCaptainStore.getState().user;
        const {socket} = useCaptainSocketIoStore.getState();
        if(!user || !user._id)return;
        if(!socket)return;
        const rides = get().rides || [];
        socket.on("newRideRequest",(newRide)=>{
            console.log("this is rides",newRide)
          if(newRide && newRide._id){
            set(state => ({
              rides : [...state.rides, newRide]
            }))
          }

        })

      },
      unsubscribeToRides: () => {
        const { socket } = useCaptainSocketIoStore.getState();
        if (socket) {
          socket.off("newRideRequest");
        }
      }
    
   }
})