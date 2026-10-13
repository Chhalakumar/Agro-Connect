import React from "react";
import LeafletMap from "../../components/map/LeafletMap";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { MdClose } from "react-icons/md";

const ShowMap = () => {
  const { latitude, longitude } = useParams();
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen">
      {/* Back/Close Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-[1000] bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 border border-gray-300"
      >
        <IoArrowBack className="text-xl" />
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Close Button (Top Right) */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 z-[1000] bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded-full shadow-lg transition-all duration-200"
        title="Close Map"
      >
        <MdClose className="text-2xl" />
      </button>

      {/* Location Info */}
      <div className="absolute top-20 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 border border-gray-300">
        <p className="text-sm text-gray-600 font-medium">Delivery Location:</p>
        <p className="text-sm text-gray-800">
          📍 {parseFloat(latitude).toFixed(4)}, {parseFloat(longitude).toFixed(4)}
        </p>
      </div>

      {/* Map Component */}
      <LeafletMap latitude={latitude} longitude={longitude} />
    </div>
  );
};

export default ShowMap;
