
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { User, LogIn, LogOut, Settings, Key, Menu, X } from "lucide-react"
import { Button } from "../ui/button"
import authService from "@/config/authservice"
import { logout as storelogout, setUser as storeSetUser } from "@/Store/authSlice"
import { toast } from "sonner"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Header() {
  const user = useSelector((state) => state.auth.user)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(user?.data?.role || "")
  const [roleKey, setRoleKey] = useState("")
  const [keyError, setKeyError] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleRoleChange = async () => {
    if (roleKey !== "PrasadBhot") {
      setKeyError("Invalid authorization key")
      return
    }

    if (selectedRole) {
      try {
        const response = await authService.changerole(selectedRole)

        if (response) {
          const updatedUserResponse = await authService.getcurrentuser()

          if (
            updatedUserResponse &&
            updatedUserResponse.data &&
            updatedUserResponse.data.sucess === true &&
            updatedUserResponse.data.data
          ) {
            dispatch(storeSetUser({ data: updatedUserResponse.data.data }))
            setSelectedRole(updatedUserResponse.data.data.role)
            toast.success("Role Is Changed")
            setIsRoleDialogOpen(false)
            setRoleKey("")
            setKeyError("")
            setTimeout(() => {
              navigate("/addcar")
            }, 100)
          } else {
            toast.error(updatedUserResponse?.data?.message || "Failed to fetch updated user info. Please re-login.")
            dispatch(storelogout())
          }
        } else {
          toast.error(response?.message || "Failed to change role. Please try again.")
        }
      } catch (error) {
        console.error("Error during role change process:", error)
        toast.error("An unexpected error occurred.")
      }
    }
  }

  const handleDialogClose = () => {
    setIsRoleDialogOpen(false)
    setRoleKey("")
    setKeyError("")
    setSelectedRole(user?.data?.role || "")
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const login = () => {
    navigate("/signin")
    closeMobileMenu()
  }

  const logout = async () => {
    try {
      await authService.logout()
      toast.success("Logout Successfully")
    } catch (e) {
      console.error(e.message)
      toast.error(e.message)
    }
    dispatch(storelogout())
    navigate("")
    closeMobileMenu()
  }

  const navItems = [
    ...(user ? [{ name: "Home", path: "/" }] : []),
    ...(user?.data?.role === "seller" ? [{ name: "Seller Dashboard", path: "/seller-dashboard" }] : []),
    ...(user ? [{ name: "My Test Drives", path: "/my-test-drives" }] : []),
  ]

  const handleNavClick = (path) => {
    navigate(path)
    closeMobileMenu()
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-6 w-6" />
              <span className="font-bold text-2xl md:text-3xl">DriveIQ</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
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

          {/* Desktop User Controls */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium text-xl">{user?.data?.username}</span>
                  {user?.data?.role && (
                    <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
                      {user.data.role}
                    </span>
                  )}
                </div>

                {user.data.role === "buyer" ? (
                  <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Change Role</DialogTitle>
                        <DialogDescription>
                          Select a new role and provide the authorization key to proceed.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="role">Role</Label>
                          <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="seller">Seller</SelectItem>
                              <SelectItem value="buyer">Buyer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="key">Authorization Key</Label>
                          <div className="relative">
                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="key"
                              type="password"
                              placeholder="Enter authorization key"
                              value={roleKey}
                              onChange={(e) => {
                                setRoleKey(e.target.value)
                                setKeyError("")
                              }}
                              className="pl-10"
                            />
                          </div>
                          {keyError && <p className="text-sm text-destructive">{keyError}</p>}
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Demo Key:</strong> Contact The Owner
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={handleDialogClose}>
                          Cancel
                        </Button>
                        <Button onClick={handleRoleChange} disabled={!selectedRole || !roleKey}>
                          Change Role
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : null}
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={login} className="text-xl bg-transparent">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 p-2" sideOffset={5}>
                {/* User Info Section (Mobile) */}
                {user && (
                  <>
                    <div className="px-3 py-2 border-b mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium text-sm">{user?.data?.username}</span>
                      </div>
                      {user?.data?.role && (
                        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
                          {user.data.role}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {/* Navigation Items (Mobile) */}
                {navItems.map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`cursor-pointer py-3 px-3 ${
                      isActive(item.path) ? "bg-accent text-accent-foreground" : ""
                    }`}
                  >
                    <span className="font-medium">{item.name}</span>
                  </DropdownMenuItem>
                ))}

                {navItems.length > 0 && <DropdownMenuSeparator />}

                {/* User Actions (Mobile) */}
                {user ? (
                  <>
                    {user.data.role === "buyer" && (
                      <DropdownMenuItem
                        onClick={() => {
                          setIsRoleDialogOpen(true)
                          closeMobileMenu()
                        }}
                        className="cursor-pointer py-3 px-3"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        <span className="font-medium">Change Role</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer py-3 px-3 text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={login} className="cursor-pointer py-3 px-3">
                    <LogIn className="h-4 w-4 mr-2" />
                    <span className="font-medium">Login</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Role Change Dialog (shared between desktop and mobile) */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[425px] mx-4">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>Select a new role and provide the authorization key to proceed.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="key">Authorization Key</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="key"
                  type="password"
                  placeholder="Enter authorization key"
                  value={roleKey}
                  onChange={(e) => {
                    setRoleKey(e.target.value)
                    setKeyError("")
                  }}
                  className="pl-10"
                />
              </div>
              {keyError && <p className="text-sm text-destructive">{keyError}</p>}
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Key:</strong> Contact The Owner
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleDialogClose} className="w-full sm:w-auto bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleRoleChange} disabled={!selectedRole || !roleKey} className="w-full sm:w-auto">
              Change Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Header
