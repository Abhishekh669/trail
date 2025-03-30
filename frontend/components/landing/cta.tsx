"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Download } from "lucide-react"

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20">
      <div ref={ref} className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />

          <div className="relative z-10 py-16 px-6 md:px-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your daily commute?</h2>
                <p className="text-white/80 text-lg mb-8 max-w-lg">
                  Join thousands of satisfied riders who have made RideX their go-to transportation solution. Download
                  the app today and experience the difference.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Download className="h-5 w-5" />
                    App Store
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20 gap-2">
                    <Download className="h-5 w-5" />
                    Google Play
                  </Button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Become a driver</h3>
                <p className="text-white/80 mb-6">
                  Earn on your own schedule. Sign up to drive with RideX and start making money.
                </p>

                <form className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2 bg-white text-primary hover:bg-white/90">
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

