import {create} from "zustand"
import {io, Socket} from 'socket.io-client'
import { useCaptainStore, useUserStore } from "../users/use-user-store"
import { BACKEND_URL } from "@/lib/data"
import toast from "react-hot-toast"
import { RideType } from "@/features/types/ride"

interface SocketState{
    connectSocket : () => void,
    socket : Socket  | null,
    disconnectSocket : () => void,


}


export const  useUserSocketIoStore = create<SocketState>((set, get)=>
    {
      return  {
          socket : null,
          connectSocket : () =>{
              const user = useUserStore.getState().user;
              if(!user || get().socket?.connected) return;
              const url = BACKEND_URL;
              console.log("this is backebnd use",url)
              const socket = io(url);
              socket.connect();
              set({socket : socket})
              const data = {userId : user._id, userType : 'user'}
              socket.emit('join', data)
          },
          disconnectSocket : () => {
            if(get().socket?.connected){
                get().socket?.disconnect();
                set({socket : null})
            }
          }
       }
    }
  
  
  )


  interface CaptainSocketState{
    connectSocket : () => void,
    socket : Socket  | null,
    disconnectSocket : () => void,
  
   
}

  
export const  useCaptainSocketIoStore = create<CaptainSocketState>((set, get)=>
    {
      return  {
          socket : null,
          connectSocket : () =>{
              const user = useCaptainStore.getState().user;
              if(!user || get().socket?.connected) return;
              if(user.status === "offline")return;
              const socket = io(BACKEND_URL);
              socket.connect();
              set({socket : socket})
              const data = {userId : user._id, userType : 'captain'}
              socket.emit('join',data)
          },
          disconnectSocket : () => {
            if(get().socket?.connected){
              get().socket?.disconnect();
              set({socket : null})
          }
          },
          
       }
    }
  
  
  )