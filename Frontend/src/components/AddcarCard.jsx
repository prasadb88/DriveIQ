import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Sparkles,
  Brain,
  Loader2,
  Bot,
} from "lucide-react";
import { useState, useCallback } from "react";
import carservice from "@/config/carinfoservice";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { processCarImageWithAI } from "@/config/aigenration"; 

export default function AddcarCard() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [aiImages, setAiImages] = useState([]); 
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [formError, setFormError] = useState("");
  const [activeTab, setActiveTab] = useState("ai-upload"); 
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm({
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
      images: [],
    },
  });

  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    if (selectedImages.length + files.length > 10) {
      toast.error("You can upload a maximum of 10 images.");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
  }, [selectedImages]);

  const handleAIImageUpload = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const file = files[0];
    const aiImg = {
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
      isProcessed: false,
    };
    setAiImages([aiImg]); 
    setIsProcessingAI(true);
    toast.info("Analyzing image with AI...");

    try {
      const result = await processCarImageWithAI(file);
      if (!result.success) {
        toast.error(`Failed to extract details from image: ${result.error || "Unknown error"}`);
        console.error(`AI processing failed:`, result.error);
        setAiImages([{ ...aiImg, isProcessed: true }]);
        return;
      }
      const carDetails = result.data;
      setValue("maker", carDetails.make ? carDetails.make.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : "");
      setValue("model", carDetails.model || "");
      setValue("year", parseInt(carDetails.year) || "");
      setValue("color", carDetails.color || "");
      setValue("bodyType", carDetails.bodyType || "");
      setValue("fuelType", carDetails.fuelType || "");
      setValue("transmission", carDetails.transmission || "");
      setValue("description", carDetails.description || "");
      const parsedMileage = parseInt(carDetails.mileage?.replace(/[^0-9]/g, "")) || "";
      setValue("milage", parsedMileage);
      let priceValue = carDetails.price;
      if (typeof priceValue === "string") {
        const numericMatch = priceValue.replace(/[^0-9.]/g, '');
        priceValue = parseFloat(numericMatch) || "";
      } else if (typeof priceValue === "number") {
        priceValue
      } else {
        priceValue = "";
      }
      setValue("price", priceValue);
      setAiImages([{ ...aiImg, isProcessed: true }]);
      setSelectedImages((prev) => {
        const exists = prev.some(existingImg => existingImg.id === aiImg.id);
        return exists ? prev : [aiImg, ...prev];
      });
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Car details extracted and image added successfully! Please review in the Manual Entry tab.");
      setActiveTab("manual-entry");
    } catch (error) {
      toast.error("An error occurred during AI processing. Please try again.");
      console.error("AI processing error:", error);
      if (aiImg.preview) URL.revokeObjectURL(aiImg.preview);
      setAiImages([]);
    } finally {
      setIsProcessingAI(false);
    }
  }, [setValue, setActiveTab, setSelectedImages]);


  const removeImage = useCallback((id) => {
    setSelectedImages((prev) => {
      const updatedImages = prev.filter((img) => img.id !== id);
      const removedImage = prev.find((img) => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return updatedImages;
    });
  }, []);

  const removeAIImage = useCallback((idToRemove) => {
    setAiImages((prev) => {
      const updatedImages = prev.filter((img) => img.id !== idToRemove);
      const removedImage = prev.find((img) => img.id === idToRemove);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return updatedImages;
    });
  
    setSelectedImages((prev) => {
      const updatedImages = prev.filter((img) => img.id !== idToRemove);
      return updatedImages;
    });
  }, [setSelectedImages]);

  const addcar = async (data) => {
    try {
      if (user?.data?.role !== "seller") {
        toast.error("You do not have permission to add a car. Please ensure your role is 'seller'.");
        return;
      }

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value);
        }
      });

      if (selectedImages.length === 0) {
        setFormError("At least 1 image is required for the listing.");
        toast.error("Please upload at least one image for your car listing.");
        return;
      }
      selectedImages.forEach((img) => {
        formData.append("images", img.file);
      });

      if (user?.data?._id) {
        formData.append("sellerId", user.data._id);
      } else {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      const carResponse = await carservice.addcar(formData);

      if (carResponse) {
        toast.success("Car listed successfully!");
        reset();
        selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
        aiImages.forEach(img => URL.revokeObjectURL(img.preview));
        setSelectedImages([]);
        setAiImages([]);
        navigate("/");
      } else {
        toast.error("Failed to add car. Please try again.");
      }
    } catch (e) {
      console.error("Error adding car:", e);
      setFormError(e.message || "An unexpected error occurred while adding the car.");
      toast.error(e.message || "Failed to add car.");
    }
  };

  const carMakers = [
    "Maruti Suzuki", "Tata Motors", "Mahindra & Mahindra", "Force Motors", "Ashok Leyland",
    "Bajaj Auto", "Eicher Motors", "Hindustan Motors", "Toyota", "Honda", "Ford",
    "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Nissan", "Hyundai",
    "Kia", "Mazda", "Subaru", "Lexus", "Acura", "Infiniti", "MG Motor", "Renault",
    "Skoda", "Citroën", "Jeep", "Volvo", "Porsche", "Lamborghini", "Ferrari",
    "Bentley", "Rolls-Royce", "Maserati", "Mini", "Aston Martin", "BYD", "Isuzu", "Lotus",
  ];
  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid", "CNG", "LPG"];
  const transmissionTypes = ["Manual", "Automatic", "CVT", "Semi-Automatic"];
  const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Pickup Truck", "Wagon", "Minivan", "Crossover"];

  return (
    <form onSubmit={handleSubmit(addcar)}>
      {formError && <p className="text-sm text-red-500 mb-4">{formError}</p>}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto max-w-4xl mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-white"
              onClick={() => navigate("/")}
              type="button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <Car className="h-6 w-6 text-blue-600" />
                List Your Vehicle
              </CardTitle>
              <CardDescription className="text-lg">
                Fill in the details below to list your car on Drive IQ marketplace
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full"> {/* Bind to activeTab state */}
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="ai-upload" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Image Upload
                  </TabsTrigger>
                  <TabsTrigger value="manual-entry" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Manual Entry
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ai-upload" className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                      <Bot className="h-5 w-5 text-blue-600" />
                      AI-Powered Car Detection
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Upload clear image ONE of your car and our AI will automatically extract the vehicle details
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAIImageUpload}
                      className="hidden"
                      id="ai-image-upload"
                      multiple={false}
                      disabled={isProcessingAI}
                    />
                    <label htmlFor="ai-image-upload" className="cursor-pointer">
                      {isProcessingAI ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                          <p className="text-lg font-medium text-gray-700 mb-2">Processing Image(s)...</p>
                          <p className="text-sm text-gray-500">Our AI is analyzing your car image(s)</p>
                        </div>
                      ) : (
                        <div>
                          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-700 mb-2">Upload Car Image(s) for AI Analysis  </p>
                          <p className="text-sm text-gray-500">Click to select Image of your car  <br></br>  AI Can Make Mistake Please Check The Info</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Best results with clear, well-lit photos showing the entire vehicle
                            --- YOU CAN UPLOAD MULTIPE PICTURE OF CAR LATER ---
                          </p>
                        </div>
                      )}
                    </label>
                  </div>

                  {aiImages.length > 0 && ( // Iterate over aiImages
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">Uploaded Image(s) for AI Analysis</p>
                        <Badge variant="secondary" className={`${isProcessingAI ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                          {isProcessingAI ? "Processing..." : "Processed"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {aiImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.preview || "/placeholder.svg"}
                              alt="AI Analysis"
                              className="w-full h-24 object-cover rounded-lg border shadow-md"
                            />
                            {!isProcessingAI && ( // Only allow removal if not processing
                              <button
                                onClick={() => removeAIImage(image.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                type="button"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-center text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
                    <p className="font-medium mb-1">💡 Pro Tip</p>
                    <p>
                      After AI processing, the tab will automatically switch to **"Manual Entry"** to review and edit the extracted details.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="manual-entry" className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Car className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maker">Maker <span className="text-red-500">*</span></Label>
                        <Controller
                          name="maker"
                          control={control}
                          rules={{ required: "Please select a car maker." }}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} onBlur={field.onBlur}>
                              <SelectTrigger id="maker-select" className={errors.maker ? "border-red-500" : ""}>
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
                        {errors.maker && <p className="text-red-500 text-xs mt-1">{errors.maker.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
                        <Input id="model" placeholder="e.g., Camry, Civic, F-150" {...register("model", { required: "Model is required." })} className={errors.model ? "border-red-500" : ""} />
                        {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="year"
                            type="number"
                            placeholder="2020"
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            className={errors.year ? "pl-10 border-red-500" : "pl-10"}
                            {...register("year", {
                                required: "Year is required.",
                                min: { value: 1900, message: "Year must be 1900 or later." },
                                max: { value: new Date().getFullYear() + 1, message: `Year cannot be in the future (max ${new Date().getFullYear() + 1}).` },
                                valueAsNumber: true,
                            })}
                          />
                        </div>
                        {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
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
                        <Label htmlFor="transmission">Transmission <span className="text-red-500">*</span></Label>
                        <Controller
                          name="transmission"
                          control={control}
                          rules={{ required: "Please select transmission type." }}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} onBlur={field.onBlur}>
                              <SelectTrigger className={errors.transmission ? "border-red-500" : ""}>
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
                        {errors.transmission && <p className="text-red-500 text-xs mt-1">{errors.transmission.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fuelType">Fuel Type <span className="text-red-500">*</span></Label>
                        <Controller
                          name="fuelType"
                          control={control}
                          rules={{ required: "Please select fuel type." }}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} onBlur={field.onBlur}>
                              <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
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
                        {errors.fuelType && <p className="text-red-500 text-xs mt-1">{errors.fuelType.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bodyType">Body Type <span className="text-red-500">*</span></Label>
                        <Controller
                          name="bodyType"
                          control={control}
                          rules={{ required: "Please select body type." }}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} onBlur={field.onBlur}>
                              <SelectTrigger className={errors.bodyType ? "border-red-500" : ""}>
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
                        {errors.bodyType && <p className="text-red-500 text-xs mt-1">{errors.bodyType.message}</p>}
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
                        <Label htmlFor="mileage">Mileage <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Gauge className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="mileage"
                            type="number"
                            placeholder="50,000"
                            className={errors.milage ? "pl-10 border-red-500" : "pl-10"}
                            {...register("milage", {
                                required: "Mileage is required.",
                                min: { value: 0, message: "Mileage cannot be negative." },
                                valueAsNumber: true,
                            })}
                          />
                        </div>
                        <p className="text-xs text-gray-500">KMs driven</p>
                        {errors.milage && <p className="text-red-500 text-xs mt-1">{errors.milage.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <ReceiptIndianRupeeIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="price"
                            type="number"
                            placeholder="250000"
                            className={errors.price ? "pl-10 border-red-500" : "pl-10"}
                            {...register("price", {
                                required: "Price is required.",
                                min: { value: 0, message: "Price cannot be negative." },
                                valueAsNumber: true,
                            })}
                          />
                        </div>
                        <p className="text-xs text-gray-500">in INR</p>
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Color <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Palette className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="color"
                            placeholder="e.g., Black, White, Red"
                            className={errors.color ? "pl-10 border-red-500" : "pl-10"}
                            {...register("color", { required: "Color is required." })}
                          />
                        </div>
                        {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>}
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
                      <Label htmlFor="description">Vehicle Description <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your vehicle's condition, features, maintenance history, and any other relevant details..."
                        className={errors.description ? "min-h-[120px] resize-none border-red-500" : "min-h-[120px] resize-none"}
                        {...register("description", { required: "Description is required." })}
                      />
                      <p className="text-xs text-gray-500">
                        Provide detailed information to help buyers make informed decisions
                      </p>
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
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
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-medium">Selected Images ({selectedImages.length})</p>
                            <Badge variant="secondary">{selectedImages.length}/10</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {selectedImages.map((image) => (
                              <div key={image.id} className="relative group">
                                <img
                                  src={image.preview || "/placeholder.svg"}
                                  alt="Vehicle"
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                                <button
                                  onClick={() => removeImage(image.id)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  type="button"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 h-12"
                      type="submit"
                      disabled={isProcessingAI}
                    >
                      <Car className="h-4 w-4 mr-2" />
                      List My Vehicle
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    By listing your vehicle, you agree to our Terms of Service and Privacy Policy
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}