import React, { useEffect, useState } from "react";
import { getAdminVenues, toggleVenueActive } from "../../api/admin.api";
import { getAllPendingApplications, approveVenueApplication, rejectVenueApplication } from "../../api/venue.api";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/Footer";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("venues");
  const [venues, setVenues] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "venues") {
        const data = await getAdminVenues();
        setVenues(data);
      } else {
        const data = await getAllPendingApplications();
        setApplications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleVenueActive(id);
      fetchData(); // refresh list
    } catch (err) {
      alert("Failed to toggle venue status.");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveVenueApplication(id);
      fetchData();
    } catch (err) {
      alert("Failed to approve application.");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await rejectVenueApplication(id, reason);
      fetchData();
    } catch (err) {
      alert("Failed to reject application.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      
      <main className="flex-1 py-12 container mx-auto px-6 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-2">
          <button 
            className={`font-semibold pb-2 ${activeTab === "venues" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("venues")}
          >
            Manage Venues
          </button>
          <button 
            className={`font-semibold pb-2 ${activeTab === "applications" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => setActiveTab("applications")}
          >
            Pending Applications
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div>
            {activeTab === "venues" && (
              <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="p-4 font-semibold">ID</th>
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Location</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venues.length === 0 ? (
                      <tr><td colSpan="5" className="p-4 text-center text-gray-500">No venues found.</td></tr>
                    ) : (
                      venues.map((v) => (
                        <tr key={v.venueId} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">{v.venueId}</td>
                          <td className="p-4 font-medium">{v.name}</td>
                          <td className="p-4 text-sm text-gray-600">{v.location}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {v.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleToggleActive(v.venueId)} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-lg font-medium transition-colors">
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "applications" && (
              <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="p-4 font-semibold">Venue Name</th>
                      <th className="p-4 font-semibold">Applicant</th>
                      <th className="p-4 font-semibold">Contact Email</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr><td colSpan="4" className="p-4 text-center text-gray-500">No pending applications.</td></tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app.applicationId} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium">{app.venueName}</td>
                          <td className="p-4 text-sm text-gray-600">{app.applicant?.username || `User #${app.userId}`}</td>
                          <td className="p-4 text-sm">{app.contactEmail}</td>
                          <td className="p-4 text-right flex justify-end gap-2">
                            <button onClick={() => handleApprove(app.applicationId)} className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg font-medium transition-colors">
                              Approve
                            </button>
                            <button onClick={() => handleReject(app.applicationId)} className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg font-medium transition-colors">
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
