import React from 'react'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {  User, LogIn, LogOut } from "lucide-react"
import { Button } from '../ui/button'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import authService from '@/config/authservice'
import { logout as storelogout } from '@/Store/authSlice'
import { toast } from 'sonner'



function Header() {
  //const authStatus = useSelector((state) => state.auth.status)
  const user = useSelector((state) => state.auth.user);
  
 
  if(!user)
  {
    console.log("user not fount");

  }
 
  const location = useLocation();
   const disptach=useDispatch()
  const navigate =useNavigate()


  const isActive = (path) => location.pathname === path;

  const login = () => {
    navigate('/signin');
  };
  const logout=async()=>{
    try {
      await authService.logout();
      toast.success("Logout Sucessfully")
    } catch (e) {
      console.log(e.message);
         toast.error(e.message)
      
    }
    disptach(storelogout()); 
    navigate(''); 
    }

   const navItems = [
    ...(user ? [{ name: "Home", path: "/" }] : []),
    ...(user?.data?.role === "seller" ? [{ name: "Seller Dashboard", path: "/seller-dashboard" }] : []),
    ...(user ? [{ name: "My Test Drives", path: "/my-test-drives" }] : []),
  ]



  return (
   <>
   <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-6" />
            <span className="font-bold text-3xl">DriveIQ</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xl font-medium transition-colors hover:text-primary ${
                isActive(item.path) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
         <div className="flex items-center gap-2">


          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 " />
                <span className=" font-medium text-xl">{user?.data?.username}</span>
              </div>
              <Button variant="outline" size="sm"  onClick={logout}>
                <LogOut className="h-4 w-4 mr-2 "  />
                Logout
              </Button>
            
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={login} className="hidden md:flex text-xl">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
    </>
  )
}

export default Header