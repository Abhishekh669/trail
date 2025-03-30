import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
interface SideBarHeaderProps{
    isSidebarOpen : boolean,
    setIsSidebarOpen : (value : boolean) => void,
    
}

function SideBarHeader({
    isSidebarOpen,
    setIsSidebarOpen
} : SideBarHeaderProps) {
  return (
   <div className="p-4 border-b flex items-center justify-between">
             <h1
               className={cn(
                 "font-bold text-xl",
                 !isSidebarOpen && "hidden md:hidden"
               )}
             >
               Ride App
             </h1>
             <Button
               variant="ghost"
               size="icon"
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             >
               {isSidebarOpen ? (
                 <X className="h-5 w-5" />
               ) : (
                 <Menu className="h-5 w-5" />
               )}
             </Button>
           </div>
  )
}

export default SideBarHeader
