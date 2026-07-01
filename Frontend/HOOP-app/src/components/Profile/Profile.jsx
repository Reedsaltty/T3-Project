import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, User, Mail, MapPin, Users, Loader2, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

// API
import { getMyVenueApplications, submitVenueApplication } from "../../api/venue.api";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // Application Form State
  const [formData, setFormData] = useState({
    venueName: "",
    venueLocation: "",
    venueCapacity: "",
    contactEmail: user?.email || "",
    description: "",
  });

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const data = await getMyVenueApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to load venue applications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.venueName || !formData.venueLocation || !formData.venueCapacity || !formData.contactEmail) return;

    setIsSubmitting(true);
    try {
      await submitVenueApplication(formData);
      setShowApplicationForm(false);
      fetchApplications(); // Reload applications to show the new pending one
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // Check if user has an approved application
  const approvedApp = applications.find(app => app.status === "approved");
  const pendingApp = applications.find(app => app.status === "pending");
  const rejectedApp = applications.find(app => app.status === "rejected");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />
      
      <main className="flex-1 py-12 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          
          <div className="mb-10">
            <h1 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">My Profile</h1>
            <p className="text-gray-500 mt-2">Manage your account and venue applications.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: User Info */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <Card className="shadow-sm border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24"></div>
                <div className="px-6 pb-6 pt-0 relative">
                  <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 -mt-10 mb-4 uppercase">
                    {user?.username?.charAt(0) || "U"}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.username}</h2>
                  <div className="flex items-center text-gray-500 text-sm gap-2">
                    <Mail size={14} /> {user?.email}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Account Role</span>
                      <span className="font-semibold text-gray-900 capitalize">{user?.role || "User"}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Venue Application Status / Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <Card className="shadow-sm border-gray-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="text-emerald-600" /> 
                    Venue Management
                  </CardTitle>
                  <CardDescription>Partner with Hoop to list and manage your event spaces.</CardDescription>
                </CardHeader>
                <CardContent>
                  
                  {!showApplicationForm && (
                    <div className="flex flex-col gap-4">
                      
                      {approvedApp ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col gap-4">
                          <div className="flex items-center gap-3 text-emerald-700">
                            <CheckCircle2 size={24} />
                            <h3 className="font-bold text-lg">You are a Venue Owner!</h3>
                          </div>
                          <p className="text-sm text-emerald-600/80">Your venue application for "{approvedApp.venueName}" was approved. You can now manage your venues and respond to booking requests.</p>
                          <Button className="mt-2 w-fit bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md">
                            Go to Venue Owner Panel <ArrowRight size={16} />
                          </Button>
                        </div>
                      ) : pendingApp ? (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex flex-col gap-3">
                          <div className="flex items-center gap-3 text-amber-700">
                            <Clock size={24} />
                            <h3 className="font-bold text-lg">Application Pending Review</h3>
                          </div>
                          <p className="text-sm text-amber-600/80">We are currently reviewing your application for "{pendingApp.venueName}". This usually takes 1-2 business days. We will notify you via email once a decision is made.</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 flex flex-col items-center text-center gap-4">
                          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                            <Building2 size={32} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">Got a space? List it on Hoop!</h3>
                            <p className="text-sm text-gray-500 max-w-md mx-auto">Reach hundreds of event organizers looking for the perfect venue. Apply now to become a verified Venue Owner.</p>
                          </div>
                          <Button onClick={() => setShowApplicationForm(true)} className="mt-2 bg-blue-600 hover:bg-blue-500 text-white shadow-md px-8 h-11">
                            Apply to be a Venue Owner
                          </Button>
                          
                          {rejectedApp && (
                            <p className="text-xs text-red-500 mt-4 flex items-center justify-center gap-1">
                              <XCircle size={14} /> Your previous application was rejected: {rejectedApp.rejectionReason}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <AnimatePresence>
                    {showApplicationForm && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <form onSubmit={handleApply} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col gap-5">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-gray-900">Venue Application</h3>
                            <button type="button" onClick={() => setShowApplicationForm(false)} className="text-sm text-gray-500 hover:text-gray-900 font-medium">Cancel</button>
                          </div>

                          <div className="space-y-2">
                            <Label>Venue Name <span className="text-red-500">*</span></Label>
                            <Input required placeholder="e.g. Grand Horizon Hall" value={formData.venueName} onChange={e => setFormData(f => ({...f, venueName: e.target.value}))} />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Capacity (Guests) <span className="text-red-500">*</span></Label>
                              <div className="relative">
                                <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input required type="number" min="1" placeholder="e.g. 500" className="pl-9" value={formData.venueCapacity} onChange={e => setFormData(f => ({...f, venueCapacity: e.target.value}))} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Contact Email <span className="text-red-500">*</span></Label>
                              <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input required type="email" placeholder="e.g. contact@venue.com" className="pl-9" value={formData.contactEmail} onChange={e => setFormData(f => ({...f, contactEmail: e.target.value}))} />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Location / Address <span className="text-red-500">*</span></Label>
                            <div className="relative">
                              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <Input required placeholder="e.g. 123 Main St, City, Country" className="pl-9" value={formData.venueLocation} onChange={e => setFormData(f => ({...f, venueLocation: e.target.value}))} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input placeholder="Short description of your venue" value={formData.description} onChange={e => setFormData(f => ({...f, description: e.target.value}))} />
                          </div>

                          <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-bold mt-2 shadow-md">
                            {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" /> Submitting...</> : "Submit Application"}
                          </Button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
