"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Download the app",
    description: "Get our app from the App Store or Google Play Store and create your account in minutes.",
  },
  {
    number: "02",
    title: "Enter your destination",
    description: "Tell us where you're going. Add stops if needed and choose your preferred ride type.",
  },
  {
    number: "03",
    title: "Match with a driver",
    description: "We'll connect you with the nearest available driver who meets our quality standards.",
  },
  {
    number: "04",
    title: "Enjoy your ride",
    description: "Track your ride in real-time, pay seamlessly, and rate your experience when you arrive.",
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How RideX <span className="text-primary">works</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Getting from point A to point B has never been easier. Our simple four-step process gets you moving in
              minutes.
            </p>

            <div ref={ref} className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>No hidden fees or surge pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>24/7 customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Verified drivers and vehicles</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="RideX App Interface"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </div>

            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

