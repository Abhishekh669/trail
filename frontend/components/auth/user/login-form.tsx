"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import axios from "axios"
import { FRONTEND_URL } from "@/lib/data"
import toast from "react-hot-toast"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type FormValues = z.infer<typeof formSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setServerError("")

    try {
      const res = await axios.post(`${FRONTEND_URL}/api/auth/user/login`, values);
      console.log("this is the response from the backend : ",res)
      if(res.data.message === "Login successful" &&res.data.success ){
        toast.success("Login successful")
        router.push("/user/dashboard")
      }
      
    } catch (error) {
      let errorMessage = "Invalid email or password"
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        console.error("Unexpected Error:", error);
        errorMessage = error.message;
      }
      setServerError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
      <div className="flex flex-col gap-2 text-center">
        <div className="flex justify-center">
          <Icons.logo className="size-12 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-primary">Welcome back, Rider</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to sign in</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect="off"
                      disabled={isLoading}
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{serverError}</div>
          )}

          <Button type="submit" disabled={isLoading} className="mt-2 w-full h-11">
            {isLoading ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.login className="mr-2 size-4" />
            )}
            Sign In
          </Button>
        </form>
      </Form>

      

      

      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link href="/auth/user/register" className="text-primary hover:underline underline-offset-4">
          Don&apos;t have an account? Sign Up
        </Link>
      </p>
    </div>
  )
}

