import React, { useEffect, useState } from "react";
import { getMyVenues } from "../../api/venue.api";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/Footer";
import { MapPin, Users, Edit3, Trash2 } from "lucide-react";

export default function VenueOwnerPanel() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const data = await getMyVenues();
      setVenues(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      
      <main className="flex-1 py-12 container mx-auto px-6 max-w-6xl">
        <div className="mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-bold mb-2">Venue Owner Panel</h1>
                <p className="text-gray-500 text-lg">Manage your registered venues and monitor booking requests.</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition-colors">
                + Register New Venue
            </button>
        </div>
        
        {loading ? (
          <div className="text-center py-12">Loading venues...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-700 mb-2">No venues found</h3>
                <p className="text-gray-500">You haven't registered any venues yet, or they are pending approval.</p>
              </div>
            ) : (
              venues.map((v) => (
                <div key={v.venueId} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                    <span className="text-gray-400 font-medium">No Image</span>
                    <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {v.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{v.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MapPin size={16} className="text-blue-500" />
                        <span className="truncate">{v.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Users size={16} className="text-blue-500" />
                        <span>Capacity: {v.capacity} guests</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                        <span className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline">View Bookings</span>
                        <div className="flex gap-3 text-gray-400">
                            <Edit3 size={18} className="cursor-pointer hover:text-gray-700 transition-colors" />
                            <Trash2 size={18} className="cursor-pointer hover:text-red-500 transition-colors" />
                        </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
