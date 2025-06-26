"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import testdriveservice from "@/config/testdriveservice"
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Phone,
  Plus,
  X,
  Star,
  ArrowLeft,
  Navigation,
  MessageCircle,
  ChevronRight,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "accepted":
      return "bg-green-50 text-green-700 border-green-200"
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200"
    case "rejected":
      return "bg-orange-50 text-orange-700 border-orange-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
  ))
}

export default function TestDrive() {
  const [selectedDrive, setSelectedDrive] = useState(null)
  const [testDrives, setTestDrives] = useState([])
  const navigate=useNavigate()

  async function fetchTestDrives() {
    try {
      const drives = await testdriveservice.mytestdriverequest()

      if (drives && Array.isArray(drives.data)) {
        setTestDrives(drives.data)
      } else {
        setTestDrives([])
      }
    } catch (error) {
      toast.error("Failed to fetch test drives", error.message)
    }
  }

  useEffect(() => {
    fetchTestDrives()
  }, [])

  const sortedTestDrives = [...testDrives].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const upcomingDrives = sortedTestDrives.filter((drive) => drive.status === "pending")
  const completedDrives = sortedTestDrives.filter((drive) => drive.status === "completed")
  const cancelledDrives = sortedTestDrives.filter((drive) => drive.status === "cancelled")
  const acceptedDrives = sortedTestDrives.filter((drive) => drive.status === "accepted")
  const rejectedDrives = sortedTestDrives.filter((drive) => drive.status === "rejected")

  const handleViewDetails = (driveId) => {
    setSelectedDrive(driveId)
  }

  if (selectedDrive) {
    const drive = testDrives.find((d) => d._id === selectedDrive)
    if (drive) {
      return <TestDriveDetail drive={drive} onBack={() => setSelectedDrive(null)} />
    }
  }

  const canceltest = async (id) => {
    const response = await testdriveservice.canceltestdrive(id)

    if (response) {
      toast.success("Cancel Successfully")
      fetchTestDrives()
    } else {
      toast.error("Failed To Cancel Test Drive")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Test Drives</h1>
          <p className="text-gray-600">Manage your vehicle test drive appointments</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Pending ({upcomingDrives.length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Accepted ({acceptedDrives.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Completed ({completedDrives.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Cancelled ({cancelledDrives.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Rejected ({rejectedDrives.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Drives */}
          <TabsContent value="upcoming" className="space-y-2">
            {upcomingDrives.length > 0 ? (
              <div className="space-y-2">
                {upcomingDrives.map((drive) => (
                  <Card key={drive._id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Car className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {drive.car ? `${drive.car.maker} ${drive.car.model}` : "Vehicle"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {drive.car ? `${drive.car.year} • ${drive.car.variant || "Standard"}` : ""}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(drive.status)} ml-auto`}>{drive.status}</Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(drive.requestedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{drive.requestedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{drive.seller?.address || "Location TBD"}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => {
                                canceltest(drive._id)
                              }}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleViewDetails(drive._id)}
                            >
                              View Details
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Car className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No pending test drives</h3>
                  <p className="text-gray-600 mb-4">Ready to find your perfect vehicle?</p>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={()=>{navigate("/")}}>
                    <Plus className="h-4 w-4 mr-2"  />
                    Book Test Drive
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Accepted Drives */}
          <TabsContent value="accepted" className="space-y-2">
            {acceptedDrives.length > 0 ? (
              <div className="space-y-2">
                {acceptedDrives.map((drive) => (
                  <Card key={drive._id} className="border border-green-200 bg-green-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Car className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {drive.car ? `${drive.car.maker} ${drive.car.model}` : "Vehicle"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {drive.car ? `${drive.car.year} • ${drive.car.variant || "Standard"}` : ""}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(drive.status)} ml-auto`}>{drive.status}</Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(drive.requestedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{drive.requestedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{drive.seller?.address || "Location TBD"}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={()=>{toast.info("Currently Unavilable")}}>
                              <Navigation className="h-3 w-3 mr-1" />
                              Get Directions
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(drive._id)}>
                              View Details
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Car className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No accepted test drives</h3>
                  <p className="text-gray-600">Accepted appointments will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Drives */}
          <TabsContent value="completed" className="space-y-2">
            {completedDrives.length > 0 ? (
              <div className="space-y-2">
                {completedDrives.map((drive) => (
                  <Card key={drive._id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Car className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {drive.car ? `${drive.car.maker} ${drive.car.model}` : "Vehicle"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {drive.car ? `${drive.car.year} • ${drive.car.variant || "Standard"}` : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                              {drive.rating && (
                                <div className="flex items-center gap-1">{renderStars(drive.rating)}</div>
                              )}
                              <Badge className={`${getStatusColor(drive.status)}`}>{drive.status}</Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(drive.requestedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{drive.requestedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{drive.seller?.address || "Location"}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              Book Again
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(drive._id)}>
                              View Details
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                            {!drive.rating && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Star className="h-3 w-3 mr-1" />
                                Rate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Car className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No completed test drives</h3>
                  <p className="text-gray-600">Completed test drives will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cancelled Drives */}
          <TabsContent value="cancelled" className="space-y-2">
            {cancelledDrives.length > 0 ? (
              <div className="space-y-2">
                {cancelledDrives.map((drive) => (
                  <Card key={drive._id} className="border border-gray-200 opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Car className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-700">
                                {drive.car ? `${drive.car.maker} ${drive.car.model}` : "Vehicle"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {drive.car ? `${drive.car.year} • ${drive.car.variant || "Standard"}` : ""}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(drive.status)} ml-auto`}>{drive.status}</Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(drive.requestedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{drive.requestedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{drive.seller?.address || "Location"}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              onClick={()=>{navigate("/")}}
                            >
                              Book Again
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(drive._id)}>
                              View Details
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Car className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No cancelled test drives</h3>
                  <p className="text-gray-600">Cancelled appointments will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Rejected Drives */}
          <TabsContent value="rejected" className="space-y-2">
            {rejectedDrives.length > 0 ? (
              <div className="space-y-2">
                {rejectedDrives.map((drive) => (
                  <Card key={drive._id} className="border border-orange-200 bg-orange-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <Car className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {drive.car ? `${drive.car.maker} ${drive.car.model}` : "Vehicle"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {drive.car ? `${drive.car.year} • ${drive.car.variant || "Standard"}` : ""}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(drive.status)} ml-auto`}>{drive.status}</Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(drive.requestedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{drive.requestedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{drive.seller?.address || "Location"}</span>
                            </div>
                          </div>

                          {/* Rejection Reason */}
                          {drive.rejectionReason && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                              <p className="text-sm font-medium text-orange-800 mb-1">Rejection Reason:</p>
                              <p className="text-sm text-orange-700">{drive.rejectionReason}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              onClick={()=>{navigate("/")}}
                            >
                              Book Again
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(drive._id)}>
                              View Details
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Car className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No rejected test drives</h3>
                  <p className="text-gray-600">Rejected appointments will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Minimalistic Test Drive Detail Component
function TestDriveDetail({ drive, onBack }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200"
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      case "rejected":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const canceltest = (id) => {
    testdriveservice.canceltestdrive(id)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Test Drives
        </Button>

        <div className="space-y-6">
          {/* Vehicle Image and Header */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden rounded-t-lg">
                <img
                  src={
                    drive.car && Array.isArray(drive.car.images) && drive.car.images.length > 0
                      ? drive.car.images[0]
                      : "/placeholder.svg?height=300&width=500"
                  }
                  alt={drive.car ? `${drive.car.maker} ${drive.car.model}` : "Vehicle"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusColor(drive.status)} font-medium`}>{drive.status}</Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-2xl font-bold mb-1">
                    {drive.car ? `${drive.car.maker} ${drive.car.model}` : "Vehicle Details"}
                  </h1>
                  <p className="text-sm opacity-90">
                    {drive.car ? `${drive.car.year} • ${drive.car.variant || "Standard"}` : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Vehicle Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Make</p>
                  <p className="font-medium">{drive.car?.maker || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Model</p>
                  <p className="font-medium">{drive.car?.model || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Year</p>
                  <p className="font-medium">{drive.car?.year || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Variant</p>
                  <p className="font-medium">{drive.car?.variant || "Standard"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {new Date(drive.requestedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">{drive.requestedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{drive.seller?.address || "Location TBD"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Information */}
          {drive.seller && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{drive.seller.fullname || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{drive.seller.phoneno || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rejection Reason */}
          {drive.status === "rejected" && drive.rejectionReason && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <X className="h-5 w-5 text-orange-600" />
                  Rejection Reason
                </h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800">{drive.rejectionReason}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rating */}
          {drive.rating && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Your Rating</h3>
                <div className="flex items-center gap-2">
                  {renderStars(drive.rating)}
                  <span className="font-medium text-gray-700">{drive.rating}/5</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                {drive.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => canceltest(drive._id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Request
                    </Button>
                  </>
                )}
                {drive.status === "accepted" && (
                  <>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  </>
                )}
                {drive.status === "completed" && (
                  <>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Book Again
                    </Button>
                    {!drive.rating && (
                      <Button variant="outline">
                        <Star className="h-4 w-4 mr-2" />
                        Rate Experience
                      </Button>
                    )}
                  </>
                )}
                {drive.status === "cancelled" && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Book Again
                  </Button>
                )}
                {drive.status === "rejected" && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Book Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
