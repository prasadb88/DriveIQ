import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Car,
  Search,
  Grid3X3,
  List,
  Heart,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  ArrowUpDown,
  Camera,
  Shield,
  Star
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import carservice from "@/config/carinfoservice"
import { toast } from "sonner"
import { useSelector, useDispatch } from "react-redux";
import { allcar } from "@/Store/carSlice";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("INR", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatMileage = (mileage) => {
  return new Intl.NumberFormat("en-US").format(mileage)
}

const CarCard = ({ car, viewMode = "grid" }) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const navigate = useNavigate()

  if (viewMode === "list") {
    return (
      <div className="group">
        <Link to={`/cardetails/${car._id}`}>
          <Card className="border-blue-200/60 hover:border-blue-400 transition-all duration-300 hover:shadow-xl bg-white overflow-hidden group-hover:scale-[1.01] transform">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                {/* Enhanced Image Section */}
                <div className="relative w-full sm:w-80 h-48 sm:h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                  <img
                    src={car.images[0] || "/placeholder.svg"}
                    alt={`${car.maker} ${car.model}`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Image Count Badge */}
                  {car.images && car.images.length > 1 && (
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      {car.images.length} Photos
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {car.isFeatured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-lg backdrop-blur-sm text-xs">
                        ⭐ Featured
                      </Badge>
                    )}
                    {car.isVerified && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg backdrop-blur-sm text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Enhanced Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setIsFavorited(!isFavorited)
                    }}
                    className={`absolute top-3 right-3 p-2 sm:p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 min-h-[44px] min-w-[44px] ${
                      isFavorited
                        ? "bg-red-500/90 text-white shadow-lg shadow-red-500/25"
                        : "bg-white/90 text-gray-700 hover:bg-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                  </button>

                  {/* Corner Accent */}
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 sm:p-6 bg-gradient-to-r from-white to-blue-50/30">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {car.year} {car.maker} {car.model}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        {car.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{car.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {formatCurrency(car.price)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 font-medium">Best Price</div>
                    </div>
                  </div>

                  {/* Enhanced Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 transition-all duration-300 hover:shadow-md">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-xs text-blue-600 font-medium">Year</div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900">{car.year}</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 transition-all duration-300 hover:shadow-md">
                      <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-xs text-blue-600 font-medium">Mileage</div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900">{formatMileage(car.milage)}</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 transition-all duration-300 hover:shadow-md">
                      <Fuel className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-xs text-blue-600 font-medium">Fuel</div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900">{car.fuelType}</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 transition-all duration-300 hover:shadow-md">
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-xs text-blue-600 font-medium">Trans.</div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900">{car.transmission}</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 space-y-3 sm:space-y-0">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="font-medium">Posted {new Date(car.createdAt).toLocaleDateString()}</div>
                    </div>
                    <Button
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[44px]"
                      onClick={() => { navigate(`/cardetails/${car._id}`) }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    )
  }

  return (
    <Link to={`/cardetails/${car._id}`}>
      <Card className="border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg bg-white group">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={car.images[0] || "/placeholder.svg"}
              alt={`${car.maker} ${car.model}`}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`absolute top-3 right-3 p-2 rounded-full transition-colors min-h-[44px] min-w-[44px] ${
                isFavorited ? "bg-red-500 text-white" : "bg-white/90 text-gray-700 hover:bg-white"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
            </button>
            {car.isFeatured && <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 text-xs">Featured</Badge>}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  {car.year} {car.maker} <br />{car.model}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                </div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-blue-600 "><br />{formatCurrency(car.price)}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Gauge className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="text-gray-600">{formatMileage(car.milage)} mi</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Fuel className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="text-gray-600">{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="text-gray-600">{car.transmission}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Car className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="text-gray-600">{car.bodyType}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
              </div>
              <div>Posted {new Date(car.createdAt).toLocaleDateString()}</div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white min-h-[44px]" onClick={() => { navigate(`/cardetails/${car._id}`) }} >View Details</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function CarListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const dispatch = useDispatch();
  const allcars = useSelector((state) => state.carsdata.allcardata) || [];
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    const getcars = async () => {
      const response = await carservice.getallcars();
      if (!response) {
        toast.error("Failed to Fetch The Cars");
      } else {
        dispatch(allcar({ allcar: response.data }));
      }
    };
    getcars();
  }, [dispatch]);

  const filteredCars = allcars.filter((car) => {
    const matchesSearch =
      (car.maker && car.maker.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (car.model && car.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (car.bodyType && car.bodyType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (car.location && car.location.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "year-new":
        return b.year - a.year
      case "year-old":
        return a.year - b.year
      case "mileage-low":
        return a.mileage - b.mileage
      case "mileage-high":
        return b.mileage - a.mileage
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-4">
        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by make, model, location, or body type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-base sm:text-lg border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full min-h-[44px]" 
            />
          </div>

          {/* Sell Your Car Button */}
          <Button 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white min-h-[44px]" 
            onClick={() => {
              if (user?.data?.role === "seller") {
                navigate("/addcar")
              } else {
                toast.info("You Are Not A Seller Please Change The Role")
              }
            }}
          >
            <Car className="h-4 w-4 mr-2" />
            Sell Your Car
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {sortedCars.length} Cars Available
            {searchQuery && <span className="text-blue-600 ml-2">for "{searchQuery}"</span>}
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 border-blue-200 min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="year-new">Year: Newest First</SelectItem>
                  <SelectItem value="year-old">Year: Oldest First</SelectItem>
                  <SelectItem value="mileage-low">Mileage: Low to High</SelectItem>
                  <SelectItem value="mileage-high">Mileage: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-blue-200 rounded-lg p-1 w-full sm:w-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`flex-1 sm:flex-none min-h-[44px] ${
                  viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`flex-1 sm:flex-none min-h-[44px] ${
                  viewMode === "list" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Car Grid/List */}
        {sortedCars.length > 0 ? (
          <div
            className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
                : "space-y-4"
            }
          >
            {sortedCars.map((car) => (
              <CarCard key={car._id} car={car} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        )}

        {/* Pagination */}
        {sortedCars.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 min-h-[44px]">
              Previous
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white min-h-[44px]">1</Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 min-h-[44px]">
              2
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 min-h-[44px]">
              3
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 min-h-[44px]">
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
