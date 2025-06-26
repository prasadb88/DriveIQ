import React, { useState } from 'react'
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import logo from "../assets/logo.png"
import { Separator } from "@/components/ui/separator"
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { login as storelogin } from '@/Store/authSlice'
import authService from '@/config/authservice'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'




function Signin() {
    const {register,handleSubmit}=useForm()
    const navigate=useNavigate()
    const [error, seterror] = useState("")
    const disptach=useDispatch()

    const login=async (data)=>{
        seterror('')
       try {
         const user= await authService.login(data)
         if(user)
         {  toast.success("Logged in Sucessfully")
            disptach(storelogin({userData:user.data}))
            navigate("/")
         }
       } catch (error) {
         seterror(error.message)
         toast.error(error.message)
       }
    }



  return (
        <form onSubmit={handleSubmit(login)}>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className=" items-center justify-center space-x-2">
            <div className=" flex items-center justify-center mt-3.5">
              <img src={logo} className="h-50 w-60 text-white" />
            </div>
            {/* <h1 className="text-2xl font-bold text-gray-900 "></h1> */}
          </div>
          <div>
            <CardTitle className="text-xl ">Welcome back</CardTitle>
            <CardDescription>Sign in to your Drive IQ account to continue</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username-email">Username or Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              {error && <p className='text-red-500 text-center'>{error}</p>}
              <Input
                id="username-email"
                type="text"
                placeholder="Enter your username or email"
                className="pl-10"
                required
                {...register("email")}
                {...register("username")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="password" type="password" placeholder="Enter your password" className="pl-10" required 
              {
                ...register("password")
              }/>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">

            </div>
            <Button variant="link" className="px-0 text-sm">
              Forgot password?
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign In</Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">New to Drive IQ?</span>
            </div>
          </div>
          <Button variant="outline" type="button" onClick={()=>{
            navigate("/register")
            }} className="w-full">
            Create an account
          </Button>
        </CardFooter>
      </Card>
    </div>
    </form>
  )
}

export default Signin