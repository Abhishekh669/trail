"use client"

import { useRef, useState } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Executive",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "RideX has completely transformed my daily commute. The drivers are professional, the cars are clean, and the app is incredibly easy to use. I've deleted all other ride-sharing apps!",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Software Engineer",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "As someone who travels frequently for work, RideX has been a game-changer. The ability to schedule rides in advance gives me peace of mind, and the real-time tracking is spot on.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Healthcare Professional",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "Working late shifts at the hospital, safety is my top priority. RideX's safety features and verified drivers make me feel secure even when traveling at odd hours.",
    rating: 4,
  },
  {
    name: "Michael Thompson",
    role: "Business Consultant",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "The seamless payment system and detailed receipts make expense reporting a breeze. RideX has simplified my business travel significantly.",
    rating: 5,
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  return (
    <section id="testimonials" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What our <span className="text-primary">riders say</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. Here's what our community has to say about their RideX experience.
          </p>
        </div>

        <div ref={ref} className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-background shadow-lg">
                <Image
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonials[currentIndex].rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                  />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-center mb-6 italic">
                "{testimonials[currentIndex].content}"
              </blockquote>

              <div className="text-center">
                <p className="font-semibold text-lg">{testimonials[currentIndex].name}</p>
                <p className="text-muted-foreground">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center mt-10 gap-4">
            <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </Button>

            <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>

          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full mx-1 ${
                  currentIndex === index ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

