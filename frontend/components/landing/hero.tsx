"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Navigation } from "lucide-react"
import { motion, useInView, useAnimation } from "framer-motion"
import Image from "next/image"

export default function Hero() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut" },
              },
            }}
            className="flex flex-col space-y-6"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Reimagining urban mobility
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your ride, <span className="text-primary">your way</span>, anytime
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Experience seamless transportation with RideX. Book a ride in seconds, track your driver in real-time, and
              enjoy a safe journey to your destination.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background"
                />
              </div>
              <Button size="lg" className="flex-shrink-0 gap-2">
                Book Now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <Image src={`/placeholder.svg?height=32&width=32`} alt={`User ${i}`} width={32} height={32} />
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">4.9/5</span> from over 2,000+ reviews
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="RideX App"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </div>

            <motion.div
              className="absolute -top-6 -right-6 bg-primary/10 backdrop-blur-lg rounded-2xl p-4 shadow-lg"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Driver arriving</p>
                  <p className="text-xs text-muted-foreground">3 mins away</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-6 -left-6 bg-card/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Driver"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Michael, 4.9 ★</p>
                  <p className="text-xs text-muted-foreground">Tesla Model 3</p>
                </div>
              </div>
            </motion.div>

            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>

      <div className="absolute top-1/2 right-0 -z-10 transform -translate-y-1/2">
        <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10">
        <div className="w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  )
}

