import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Phone,
  CheckCircle,
  XCircle,
  Play,
  Square,
  Mail,
  BarChart3,
  Users,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import testdriveservice from "@/config/testdriveservice";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "accepted":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "in-progress":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "accepted":
      return <CheckCircle className="h-4 w-4" />;
    case "in-progress":
      return <Play className="h-4 w-4" />;
    case "completed":
      return <Square className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export default function SellerDashboard() {
  const [testDrives, setTestDrives] = useState([]);
  const [customerMap, setCustomerMap] = useState({});
   const [rejectDialog, setRejectDialog] = useState({ open: false, driveId: null })
  const [rejectionReason, setRejectionReason] = useState("")


  const pendingDrives = testDrives.filter((drive) => drive.status === "pending");
  const acceptedDrives = testDrives.filter((drive) => drive.status === "accepted");
  const inProgressDrives = testDrives.filter((drive) => drive.status === "in-progress");
  const completedDrives = testDrives.filter((drive) => drive.status === "completed");
  const rejectedDrives = testDrives.filter((drive) => drive.status === "rejected");

  const updateDriveStatus = (driveId, newStatus) => {
    setTestDrives((prev) =>
      prev.map((drive) => (drive._id === driveId ? { ...drive, status: newStatus } : drive))
    );
  };

  const handleAccept = async (driveId) => {
    try {
      const response = await testdriveservice.accepttestdrive({ id: driveId });
      if (response && response.statusCode === 200) {
        updateDriveStatus(driveId, "accepted");
        toast.success("Test drive request accepted!");
      } else {
        toast.error(response?.message || "Failed to accept test drive.");
      }
    } catch (error) {
      toast.error(error?.message || "Error accepting test drive.");
    }
  };

  const handleReject = async (driveId) => {
    setRejectDialog({ open: true, driveId });
    setRejectionReason("");
  };
  const handleRejectConfirm = async ({ driveid, message }) => {
    if (driveid && message.trim()) {
      try {
        const response = await testdriveservice.rejecttestdrive({ id: driveid, message });
        if (response && response.statusCode === 200) {
          setTestDrives((prev) =>
            prev.map((drive) =>
              drive._id === driveid
                ? { ...drive, status: "rejected", rejectionReason: message.trim() }
                : drive
            )
          );
          setRejectDialog({ open: false, driveId: null });
          setRejectionReason("");
          toast.success("Test drive request rejected");
        } else {
          toast.error(response?.message || "Failed to reject test drive.");
        }
      } catch (e) {
        toast.error(e?.message || "Error rejecting test drive.");
      }
    }
  }

  const handleStart = async (driveId) => {
    try{
      const response= await testdriveservice.starttestdrive({id:driveId})
    if (response && response.statusCode === 200) {
        updateDriveStatus(driveId, "in-progress");
        toast.success("Test drive request Started!");
      } else {
        toast.error(response?.message || "Failed to Start test drive.");
      }
    } catch (error) {
      toast.error(error?.message || "Error Start test drive.");
    }
  };

  const handleComplete = async (driveId) => {
      try{
      const response= await testdriveservice.completetestdrive({id:driveId})
    if (response && response.statusCode === 200) {
        updateDriveStatus(driveId, "completed");
        toast.success("Test drive Completed!");
      } else {
        toast.error(response?.message || "Failed to Completed test drive.");
      }
    } catch (error) {
      toast.error(error?.message || "Error Completed test drive.");
    }
  };

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const testDrivesResponse = await testdriveservice.getSellerTestDriveRequests();
        if (testDrivesResponse && testDrivesResponse.data) {
          const drives = Array.isArray(testDrivesResponse.data)
            ? testDrivesResponse.data
            : [];
          setTestDrives(drives);

            setCustomerMap({}); 
        } else {
          toast.error("Failed to Fetch Test Drives: No data received.");
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
        toast.error("Failed to Fetch Test Drives or Buyer Details.");
      }
    };
    fetchSellerData();
  }, []); 

  const totalDrives = testDrives.length;
  const todayDrives = testDrives.filter((drive) => {
    const today = new Date().toDateString();
    const driveDate = new Date(drive.requestedDate).toDateString();
    return today === driveDate && drive.status === "pending"||drive.status === "accepted";
  }).length;

  const firstTimeBuyers = testDrives.filter(
    (drive) => drive.customerType === "first-time-buyer"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your test drive requests and appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalDrives}</p>
                  <p className="text-gray-600 text-sm">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{todayDrives}</p>
                  <p className="text-gray-600 text-sm">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingDrives.length}</p>
                  <p className="text-gray-600 text-sm">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{firstTimeBuyers}</p>
                  <p className="text-gray-600 text-sm">First-Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 h-10">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm"
            >
              Pending ({pendingDrives.length})
            </TabsTrigger>
            <TabsTrigger
              value="accepted"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm"
            >
              Accepted ({acceptedDrives.length})
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm"
            >
              In Progress ({inProgressDrives.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm"
            >
              Completed ({completedDrives.length})
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm"
            >
              Rejected ({rejectedDrives.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-3">
            {pendingDrives.length > 0 ? (
              pendingDrives.map((drive) => {
                // Safely get buyer info from customerMap using drive._id as the key
                const driveBuyer = customerMap[drive._id];
                return (
                  <Card key={drive._id} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              {/* Safely display username */}
                              <h3 className="font-semibold text-gray-900">{drive.buyer?.fullname || "N/A"}</h3>
                              <p className="text-blue-600 font-medium text-sm">
                                {drive.car?.maker || "-"} {drive.car?.model || "-"}
                              </p>
                              <p className="text-gray-600 text-sm">{drive.car?.price || "-"}</p>
                            </div>
                            <Badge className={`${getStatusColor(drive.status)} text-xs flex items-center gap-1`}>
                              {getStatusIcon(drive.status)}
                              {drive.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>{formatDate(drive.requestedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span>{drive.requestedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-blue-500" />
                              {/* Safely display phone number */}
                              <span>{driveBuyer?.phoneno || "-"}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white h-8"
                              onClick={() => handleAccept(drive._id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50 h-8"
                              onClick={() => handleReject(drive._id)} // Use drive._id here
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 h-8"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8 text-center">
                  <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
                  <p className="text-gray-600 text-sm">All caught up! New requests will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Accepted Requests */}
          <TabsContent value="accepted" className="space-y-3">
            {acceptedDrives.length > 0 ? (
              acceptedDrives.map((drive) => {
                const buyerInfo = customerMap[drive._id]; // Use customerMap here
                return (
                  <Card key={drive._id} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{drive.buyer?.fullname || "N/A"}</h3>
                              <p className="text-blue-600 font-medium text-sm">
                                {drive.car?.maker || "-"} {drive.car?.model || "-"}
                              </p>
                              <p className="text-gray-600 text-sm">{drive.car?.price || "-"}</p>
                            </div>
                            <Badge className={`${getStatusColor(drive.status)} text-xs flex items-center gap-1`}>
                              {getStatusIcon(drive.status)}
                              {drive.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>{formatDate(drive.requestedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span>{drive.requestedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-blue-500" />
                              <span>{buyerInfo?.phoneno || "-"}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white h-8"
                              onClick={() => handleStart(drive._id)} // Use drive._id here
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Start Test Drive
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 h-8"
                              onClick={()=>{toast.info("Currently Unavailable")}}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8 text-center">
                  <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No accepted requests</h3>
                  <p className="text-gray-600 text-sm">Accepted requests will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* In Progress */}
          <TabsContent value="in-progress" className="space-y-3">
            {inProgressDrives.length > 0 ? (
              inProgressDrives.map((drive) => {
                return (
                  <Card
                    key={drive._id}
                    className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow border-l-4 border-l-purple-500"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{drive.buyer?.fullname || "N/A"}</h3>
                              <p className="text-blue-600 font-medium text-sm">
                                {drive.car?.maker || "-"} {drive.car?.model || "-"}
                              </p>
                              <p className="text-gray-600 text-sm">{drive.car?.price || "-"}</p>
                            </div>
                            <Badge className={`${getStatusColor(drive.status)} text-xs flex items-center gap-1`}>
                              {getStatusIcon(drive.status)}
                              {drive.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>{formatDate(drive.requestedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span>{drive.requestedTime}</span>
                            </div>
                            <div className="flex items-center gap-1 text-purple-600">
                              <Play className="h-4 w-4" />
                              <span className="font-medium">Test drive in progress</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white h-8"
                              onClick={() => handleComplete(drive._id)}
                            >
                              <Square className="h-4 w-4 mr-1" />
                              Complete Test Drive
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 h-8"
                              onClick={()=>{toast.info("Currently Unavailable")}}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8 text-center">
                  <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Play className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No in-progress requests</h3>
                  <p className="text-gray-600 text-sm">Ongoing test drives will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed */}
          <TabsContent value="completed" className="space-y-3">
            {completedDrives.length > 0 ? (
              completedDrives.map((drive) => {
                return (
                  <Card key={drive._id} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{drive.buyer?.fullname || "N/A"}</h3>
                              <p className="text-blue-600 font-medium text-sm">
                                {drive.car?.maker || "-"} {drive.car?.model || "-"}
                              </p>
                              <p className="text-gray-600 text-sm">{drive.car?.price || "-"}</p>
                            </div>
                            <Badge className={`${getStatusColor(drive.status)} text-xs flex items-center gap-1`}>
                              {getStatusIcon(drive.status)}
                              {drive.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>{formatDate(drive.requestedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span>{drive.requestedTime}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 h-8"
                              onClick={()=>{toast.info("Currently Unavailable")}}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Follow Up
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-200 text-gray-600 hover:bg-gray-50 h-8"
                              onClick={()=>{toast.info("Currently Unavailable")}}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8 text-center">
                  <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Square className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed requests</h3>
                  <p className="text-gray-600 text-sm">Successfully completed test drives will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Rejected */}
          <TabsContent value="rejected" className="space-y-3">
            {rejectedDrives.length > 0 ? (
              rejectedDrives.map((drive) => {
                return (
                  <Card
                    key={drive._id}
                    className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow opacity-75"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-700">{drive.buyer?.fullname|| "N/A"}</h3>
                              <p className="text-gray-500 font-medium text-sm">
                                {drive.car?.maker || "-"} {drive.car?.model || "-"}
                              </p>
                              <p className="text-gray-500 text-sm">{drive.car?.price || "-"}</p>
                            </div>
                            <Badge className={`${getStatusColor(drive.status)} text-xs flex items-center gap-1`}>
                              {getStatusIcon(drive.status)}
                              {drive.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(drive.requestedDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{drive.requestedTime}</span>
                            </div>
                          </div>
                          {drive.rejectionReason && (
                            <div className="bg-red-50 p-3 rounded-lg mb-3">
                              <p className="text-sm text-red-800">
                                <strong>Reason:</strong> {drive.rejectionReason}
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 h-8"
                              onClick={()=>{toast.info("Currently Unavailable")}}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8 text-center">
                  <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No rejected requests</h3>
                  <p className="text-gray-600 text-sm">Rejected test drives will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {/* Rejection Reason Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) =>
          setRejectDialog((prev) => ({ open, driveId: open ? prev.driveId : null }))
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Test Drive Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this test drive request. This will be shown to the customer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, driveId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleRejectConfirm({ driveid: rejectDialog.driveId, message: rejectionReason })} disabled={!rejectionReason.trim()}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}