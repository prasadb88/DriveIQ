import {  useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Heart,
  Share2,
  Eye,
  Gauge,
  Fuel,
  Settings,
  Palette,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Shield,
  Star,
  CheckCircle,
  DollarSign,
  Calculator,
  Edit,
  Trash2
} from "lucide-react"
import testdriveservice from "@/config/testdriveservice"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import carservice from "@/config/carinfoservice"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { car } from "@/Store/carSlice";



function TestDriveForm({ carId, onSuccess }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const testdriverequest = async (data) => {
    try {
      const testdriverequests = await testdriveservice.requesttestdrive({ carId,...data });
      if (testdriverequests) {
        toast.success("Test Drive Request Successfully Sent");
        if (onSuccess) onSuccess();
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(testdriverequest)} className="space-y-4 p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
      <div>
        <label className="block text-sm font-medium mb-2 text-blue-900">Preferred Date</label>
        <input
          type="date"
          required
          {...register("requestedDate")}
          className="w-full p-2 border border-blue-200 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-blue-900">Preferred Time</label>
        <select
          required
          {...register("requestedtime")}
          className="w-full p-2 border border-blue-200 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select time</option>
          <option value="09:00">9:00 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="14:00">2:00 PM</option>
          <option value="16:00">4:00 PM</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("INR", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount)
}


export default function CarDetailsClient({ id }) {
  const user = useSelector((state) => state.auth.user);
  const [showTestDriveForm, setShowTestDriveForm] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [getcar, setgetcar] = useState("")
  const navigate=useNavigate()
  const dispatch=useDispatch()

  useEffect(() => {
  const getcar = async () => {
    const response = await carservice.getcar(id);

    if (!response || !response.data) {
      toast.error("Failed To Fetch The Car");
    } else {
      setgetcar(response.data);
      dispatch(car({ car: response.data })); 
    }
  };
  getcar();
}, [id, dispatch])




const update=()=>{
  navigate(`/updatecar/${id}`)
}
const deletecar=async(id)=>{
  const response=await carservice.delecar(id)
  if(response)
  {
    toast.success("Car Deleted SucessFully")
    navigate("/")
  }
  else{
    toast.error("Problem In The Car Delete")
  }
}

  const carData = getcar


  if (!carData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">Car not found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carData.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carData.images.length) % carData.images.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {carData.year} {carData.maker} {carData.model}
                </h1>
               {String(user.data._id) === String(carData.seller?._id) ? (
  <div className="flex items-center gap-2 ml-auto">
    <Button
      variant="outline"
      size="sm"
      className="border-blue-300 text-blue-700 hover:bg-blue-50"
      onClick={() => {
        update()
      }}
    >
      <Edit className="h-4 w-4 mr-1" />
      Edit
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="border-red-300 text-red-700 hover:bg-red-50"
      onClick={() => {
        deletecar(carData._id);
      }}
    >
      <Trash2 className="h-4 w-4 mr-1" />
      Delete
    </Button>
  </div>
) : null}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">{carData.bodyType}</Badge>
                <Badge variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                  {carData.transmission}
                </Badge>
                <Badge variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                  {carData.fuelType}
                </Badge>
                {carData.isTestDriving && (
                  <Badge variant="destructive" className="animate-pulse bg-red-100 text-red-800">
                    Currently On Test Drive
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-blue-600" />
                  {carData.views} views
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`hover:bg-blue-50 ${isFavorited ? "text-red-500" : "text-blue-600"}`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-6">
              <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border border-blue-200 overflow-hidden shadow-lg">
                {carData.images && carData.images.length > 0 ? (
                  <>
                    <img
                      src={carData.images[currentImageIndex] || "/placeholder.svg"}
                      alt={`${carData.maker} ${carData.model}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Navigation Arrows */}
                    {carData.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-600/80 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600/80 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-blue-900/80 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {carData.images.length}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Car className="h-16 w-16 text-blue-400 mx-auto mb-2" />
                      <span className="text-blue-600">Car Image Placeholder</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {carData.images && carData.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {carData.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-14 rounded border-2 overflow-hidden transition-colors ${
                        index === currentImageIndex ? "border-blue-500" : "border-blue-200 hover:border-blue-300"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white shadow-lg">
                <div className="text-sm text-blue-100">Price</div>
                <div className="font-bold text-lg">{formatCurrency(carData.price)}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600">Mileage</div>
                <div className="font-bold text-lg text-blue-900">
                  {carData.milage !== undefined ? carData.milage.toLocaleString() : "N/A"} Kmpl
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600">Year</div>
                <div className="font-bold text-lg text-blue-900">{carData.year}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600">Color</div>
                <div className="font-bold text-lg text-blue-900">{carData.color}</div>
              </div>
            </div>

            {/* Detailed Specifications */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-blue-600">Mileage</div>
                    <div className="font-medium text-blue-900">{carData.milage !== undefined ? carData.milage.toLocaleString() : "N/A"} mi</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Fuel className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-blue-600">Fuel Type</div>
                    <div className="font-medium text-blue-900">{carData.fuelType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-blue-600">Transmission</div>
                    <div className="font-medium text-blue-900">{carData.transmission}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Palette className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-blue-600">Color</div>
                    <div className="font-medium text-blue-900">{carData.color}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Car className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-blue-600">Body Type</div>
                    <div className="font-medium text-blue-900">{carData.bodyType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-blue-600">Year</div>
                    <div className="font-medium text-blue-900">{carData.year}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {carData.features && carData.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Features & Equipment
                </h2>
                <div className="flex flex-wrap gap-2">
                  {carData.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100"
                    >
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-gray-900">Description</h2>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 leading-relaxed">{carData.description || "No description provided."}</p>
              </div>
            </div>

            <Separator className="my-6 bg-blue-200" />

            {/* Test Drive Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Book a Test Drive
              </h2>
              {carData.isTestDriving ? (
                <Alert className="border-amber-200 bg-amber-50">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    This car is currently out for a test drive. Please check back later or contact the seller.
                  </AlertDescription>
                </Alert>
              ) : showTestDriveForm ? (
                <TestDriveForm carId={id} onSuccess={() => setShowTestDriveForm(false)} />
              ) : (
                <Button
                  onClick={() => setShowTestDriveForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Request Test Drive
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Information */}
            <Card className="border-blue-200 bg-white shadow-lg">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Seller Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <User className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-blue-900">{carData.seller?.username || "Seller Name"}</div>
                        {carData.seller?.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-blue-600">Seller</div>
                      {carData.seller?.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-blue-600">
                            {carData.seller.rating} ({carData.seller.reviewCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">{carData.seller?.phoneno || "Phone Number"}</div>
                      <div className="text-sm text-blue-600">Phone</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">{carData.seller?.email || "Email Address"}</div>
                      <div className="text-sm text-blue-600">Email</div>
                    </div>
                  </div>
                  {carData.seller?.address && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-900">{carData.seller.address}</div>
                        <div className="text-sm text-blue-600">Address</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Buttons */}
                <div className="space-y-2 mt-6">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg" onClick={()=>{
                    toast.info("Currently Unavalible")
                  }}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Seller
                  </Button>
                  <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50" onClick={()=>{
                    toast.info("Currently Unavalible")}}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-blue-200 bg-white shadow-lg">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Quick Actions</h2>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={()=>{
                    toast.info("Currently Unavalible")}}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Get Financing
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={()=>{
                    toast.info("Currently Unavalible")}}
                  >
                    <Car className="h-4 w-4 mr-2" />
                    Vehicle History Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={()=>{
                    toast.info("Currently Unavalible")}}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Payment Calculator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
