import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import {
  Car,
  Upload,
  X,
  Calendar,
  Gauge,
  Fuel,
  Palette,
  Settings,
  FileText,
  Camera,
  ArrowLeft,
  ReceiptIndianRupeeIcon,
} from "lucide-react"
import { useState } from "react"
import carservice from "@/config/carinfoservice"
import { useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import { useEffect } from "react"



export default function UpdateCar({id}) {
  const [selectedImages, setSelectedImages] = useState([])
  const [error, seterror] = useState("")
  const navigate=useNavigate()
  const [getcar, setgetcar] = useState({})
  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      maker: "",
      transmission: "",
      fuelType: "",
      bodyType: "",
      model: "",
      year: "",
      milage: "",
      price: "",
      color: "",
      description: "",
      images: []
    }
  })
   

 useEffect(() => {
  const getcar = async () => {
    const response = await carservice.getcar(id);
    if (!response || !response.data) {
      toast.error("Failed To Fetch The Car");
    } else {
      setgetcar(response.data);
      Object.entries(response.data).forEach(([key, value]) => {
        setValue(key, value ?? "");
      });
    }
  };
  getcar();
}, [id, setValue])



  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }))
    setSelectedImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (id) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id))
  }


  const addcar = async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value);
        }
      });

      const carId = getcar._id || id;
if (!carId) {
  seterror({ message: "Car ID is missing. Cannot update." });
  return;
}
formData.append("_id", carId);

      
      if (selectedImages.length === 0 && (!getcar.images || getcar.images.length === 0)) {
        seterror({ message: "At least 1 image is required" });
        return;
      }
      selectedImages.forEach((img) => {
        formData.append("images", img.file);
      });

      const car = await carservice.upatecar({ id: carId, formData });
      console.log(car);
    
      if (car) {
        navigate("/");
        toast.success("Car is Update")
      }
    } catch (e) {
      seterror(e);
      toast(e.message || "Failed to Update car");
    }
  }

  const carMakers = [
    "Maruti Suzuki",
    "Tata Motors",
    "Mahindra & Mahindra",
    "Force Motors",
    "Ashok Leyland",
    "Bajaj Auto",
    "Eicher Motors",
    "Hindustan Motors",
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Nissan",
    "Hyundai",
    "Kia",
    "Mazda",
    "Subaru",
    "Lexus",
    "Acura",
    "Infiniti",
    "MG Motor",
    "Renault",
    "Skoda",
    "Citroën",
    "Jeep",
    "Volvo",
    "Porsche",
    "Lamborghini",
    "Ferrari",
    "Bentley",
    "Rolls-Royce",
    "Maserati",
    "Mini",
    "Aston Martin",
    "BYD",
    "Isuzu",
    "Lotus",
  ]

 const fuelTypes = ["Gasoline", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"]
  const transmissionTypes = ["Manual", "Automatic", "CVT", "Semi-Automatic"]
  const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Pickup Truck", "Wagon", "Minivan"]

  return (
     <form onSubmit={handleSubmit(addcar)}>
        {error? (<p className="text-sm text-red-500">{error.message} </p>):(null)}
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="container mx-auto max-w-4xl mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="bg-white" type="button" onClick={()=>{
            navigate(`/cardetails/${getcar._id}`)
          }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back 
          </Button>
          <div className="flex items-center space-x-2">
            

          </div>
        </div>
      </div>
   
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Car className="h-6 w-6 text-blue-600" />
              Update Your Vehicle
            </CardTitle>
            <CardDescription className="text-lg">
              Fill in the details below to list your car on Drive IQ marketplace
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maker">Maker *</Label>
                  <Controller
          name="maker"
          control={control}
          rules={{ required: "Please select a car maker." }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              value={field.value}
            >
              <SelectTrigger id="maker-select">
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent>
                {carMakers.map((maker) => (
                  <SelectItem key={maker} value={maker}>
                    {maker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Camry, Civic, F-150"
                    required
                    {...register("model")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="year"
                      type="number"
                      placeholder="2020"
                      min="1990"
                      max="2024"
                      className="pl-10"
                      required
                      {...register("year")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Technical Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission *</Label>
                  <Controller
        name="transmission"
        control={control} 
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              {transmissionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type *</Label>
                  <Controller
        name="fuelType"
        control={control} 
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((fuel) => (
                <SelectItem key={fuel} value={fuel}>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4" />
                    {fuel}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyType">Body Type *</Label>
                  <Controller
        name="bodyType"
        control={control} 
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              {bodyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
                </div>
              </div>
            </div>

            <Separator />

            {/* Vehicle Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Gauge className="h-5 w-5 text-blue-600" />
                Vehicle Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage *</Label>
                  <div className="relative">
                    <Gauge className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="50,000"
                      className="pl-10"
                      required
                      {...register("milage")}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Miles driven</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative">
                    <ReceiptIndianRupeeIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="25,000"
                      className="pl-10"
                      required
                      {...register("price")}
                    />
                  </div>
                  <p className="text-xs text-gray-500">INR</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color *</Label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="color"
                      placeholder="e.g., Black, White, Red"
                      className="pl-10"
                      required
                      {...register("color")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Description
              </h3>
              <div className="space-y-2">
                <Label htmlFor="description">Vehicle Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your vehicle's condition, features, maintenance history, and any other relevant details..."
                  className="min-h-[120px] resize-none"
                  required
                  {...register("description")}
                />
                <p className="text-xs text-gray-500">
                  Provide detailed information to help buyers make informed decisions
                </p>
              </div>
            </div>

            <Separator />

            {/* Images Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600" />
                Vehicle Images
              </h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    {...register("images", {
                      onChange: handleImageUpload
  })}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">Upload Vehicle Images</p>
                    <p className="text-sm text-gray-500">Click to select multiple images or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Recommended: Include exterior, interior, and engine photos
                    </p>
                  </label>
                </div>

                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.preview}
                          alt="Vehicle"
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {getcar.images && getcar.images.length > 0 && selectedImages.length === 0 && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {getcar.images.map((imgUrl, idx) => (
      <div key={idx} className="relative group">
        <img
          src={imgUrl}
          alt="Vehicle"
          className="w-full h-24 object-cover rounded-lg border"
        />
      </div>
    ))}
  </div>
)}
              </div>
            </div>

            <Separator />

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 h-12">
                <Car className="h-4 w-4 mr-2" />
                Update My Vehicle
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              By listing your vehicle, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </form>
  )
}
