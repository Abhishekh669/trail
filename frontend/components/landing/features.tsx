"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { Clock, MapPin, Shield, Smartphone, Zap } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: <Zap className="h-10 w-10" />,
    title: "Lightning Fast Booking",
    description: "Book your ride in seconds with our streamlined interface. No waiting, no hassle.",
  },
  {
    icon: <MapPin className="h-10 w-10" />,
    title: "Real-time Tracking",
    description: "Track your driver's location in real-time and share your trip details with loved ones.",
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Safety First",
    description: "All drivers are verified and trips are monitored. Emergency assistance is just a tap away.",
  },
  {
    icon: <Clock className="h-10 w-10" />,
    title: "Schedule Rides",
    description: "Plan ahead by scheduling rides for later. Perfect for airport pickups or important meetings.",
  },
  {
    icon: <Smartphone className="h-10 w-10" />,
    title: "Seamless Payments",
    description: "Multiple payment options including credit cards, digital wallets, and cash.",
  },
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Designed for <span className="text-primary">convenience</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our platform is built with features that make your transportation experience seamless and enjoyable.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

