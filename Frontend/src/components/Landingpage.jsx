import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import {
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  Award,
  Search,
  MessageSquare,
  CreditCard,
} from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Smart Vehicle Search",
      description: "Find your perfect vehicle with our AI-powered search and matching system.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Transactions",
      description: "Protected payments and verified listings ensure safe buying and selling.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Direct Communication",
      description: "Connect directly with buyers and sellers through our secure messaging system.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Verified Profiles",
      description: "All users are verified to ensure trustworthy transactions and interactions.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Market Insights",
      description: "Get real-time market data and pricing insights to make informed decisions.",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Flexible Payments",
      description: "Multiple payment options including financing and trade-in evaluations.",
    },
  ]

  const navigate=useNavigate()

  const testimonials = [
    {
      name: "Prasad Bhot",
      role: "Car Buyer",
      content: "Found my dream car in just 2 days! The process was smooth and transparent.",
      rating: 5,
    },
    {
      name: "",
      role: "Car Seller",
      content: "Sold my vehicle 3x faster than other platforms. Great buyer verification system.",
      rating: 5,
    },
    {
      name: "",
      role: "First-time Buyer",
      content: "The market insights helped me negotiate the perfect price. Highly recommend!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 ">
        <div className="container mx-auto px-4 text-center my-20">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100 ">
            <Zap className="h-3 w-3 mr-1" />
            Smart Vehicle Marketplace
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Buy & Sell Vehicles with
            <span className="text-blue-600 block">Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with verified buyers and sellers in a secure marketplace powered by AI. Find your perfect vehicle or
            sell with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Button  onClick={()=>{navigate("/register")}} size="lg"   className="bg-blue-600 hover:bg-blue-700">
              Start Buying
              <ArrowRight className="ml-2 h-4 w-4" />   
            </Button>
            <Button size="lg" variant="outline"  onClick={()=>{navigate("/register")}} className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50">
              Start Selling
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
               Verified Users
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Successful Transactions
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              99.9% Secure Platform
            </div>
          </div>
        </div>
        </section>
  
      

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Drive IQ?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our intelligent platform makes buying and selling vehicles easier, safer, and more efficient than ever
              before.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Drive IQ Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and get verified as a buyer or seller with our secure verification process.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse or List</h3>
              <p className="text-gray-600">
                Search for your perfect vehicle or create a detailed listing to attract buyers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Transaction</h3>
              <p className="text-gray-600">
                Connect, negotiate, and complete your transaction with our secure payment system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied buyers and sellers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join Drive IQ today and experience the future of vehicle buying and selling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={()=>{navigate("/register")}}>
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      </div>
)}

      