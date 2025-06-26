"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Car, User, Mail, Lock, Phone, MapPin, Upload, UserCheck } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import {  useNavigate } from "react-router-dom"
import authService from "@/config/authservice"
import { toast } from "sonner"

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState("")
  const {register,handleSubmit}=useForm()
  const navigate=useNavigate()

  const registeruser=async(data)=>{
    try{
      
      const response =await authService.createAccount(data)
      
      if(response)
      {
        navigate('/signin')
        toast.success("User Created Successfully")
      }
      else
      {
        toast.error( "Registration failed")
      }
    }
    catch(e)
    {
      toast.error(e.message || "Registration failed")
    }
   
  
  }

  return (
    <form onSubmit={handleSubmit(registeruser)}>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Drive IQ</h1>
          </div>
          <div>
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>Join Drive IQ and start your journey with us</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Upload */}
          {/* <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview || "/placeholder.svg"}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-blue-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-3 w-3 text-white" />
              </label>
              <input id="avatar" type="file" accept="image/*"  {...register("avatar")}onChange={handleAvatarChange} className="hidden" />
            </div>
            <Label htmlFor="avatar" className="text-sm text-gray-600">
              Upload your avatar
            </Label>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="fullname" type="text" placeholder="Enter your full name" className="pl-10" required {...register('fullname')}/>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="username" type="text" placeholder="Choose a username" className="pl-10" required {...register("username")} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="Enter your email" className="pl-10" required {...register("email")} />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="phone" type="tel" placeholder="Enter your phone number" className="pl-10" required {...register("phoneno")}/>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="password" type="password" placeholder="Create a strong password" className="pl-10" required {...register("password")}/>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                placeholder="Enter your full address"
                className="pl-10 min-h-[80px] resize-none"
                required
                {...register("address")}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label>I want to join as a:</Label>
            <RadioGroup value={selectedRole} onValueChange={setSelectedRole} {...register("role")}className="flex space-x-6 ">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buyer" id="buyer" />
                <Label htmlFor="buyer" className="font-normal">
                  Buyer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seller" id="seller" />
                <Label htmlFor="seller" className="font-normal">
                  Seller
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Create Account</Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onclick={
            ()=>{
              navigate("/signin")
            }
          }>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
    </form>
  )
}
