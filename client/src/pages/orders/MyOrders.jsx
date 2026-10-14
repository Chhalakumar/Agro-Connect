import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/heading/Heading";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import EmptyStateText from "../../components/empty_state/EmptyStateText";
import useHttpClient from "../../hooks/api/useHttpClient";
import { GET_USER_ORDERS } from "../../constants/apiEndpoints";
import { useCookies } from "react-cookie";
import { notify } from "../../utils/helper/notification";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { sendAuthorizedRequest } = useHttpClient();
  const [cookies, setCookie, removeCookie] = useCookies(["user_access_token", "seller_access_token"]);

  // Clear seller token if exists when accessing user pages
  useEffect(() => {
    if (!cookies.user_access_token) {
      notify("Please login as user to view orders", "info");
      navigate("/account/user");
      return;
    }
    
    if (cookies.seller_access_token) {
      removeCookie("seller_access_token", { path: "/" });
      removeCookie("brandName", { path: "/" });
      notify("You have been logged out as seller", "info");
    }
  }, []);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    setIsLoading(true);
    try {
      const response = await sendAuthorizedRequest(
        "user",
        GET_USER_ORDERS,
        "GET",
        null,
        {},
        false
      );

      if (response && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Processing":
        return "📦";
      case "Shipped":
        return "🚚";
      case "Delivered":
        return "✅";
      case "Cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <Heading text="My Orders" textAlign="text-left" marginY="my-0" paddingX="px-0" />
      <p className="text-sm md:text-base font-medium leading-6 text-gray-600 mt-2 mb-6">
        Track and view all your orders
      </p>

      {isLoading ? (
        <TableSkeleton />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <EmptyStateText text="You haven't placed any orders yet. Start shopping to see your orders here!" />
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="md:w-32 h-32 flex-shrink-0">
                  <img
                    src={order.productId.image}
                    alt={order.productId.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Order Details */}
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.productId.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Category: <span className="capitalize">{order.productId.category}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Seller: <span className="font-medium">{order.sellerId.brandName}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Order Date:{" "}
                        <span className="font-medium">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </p>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6 text-right">
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status || "Pending"
                          )}`}
                        >
                          <span className="mr-1">{getStatusIcon(order.status || "Pending")}</span>
                          {order.status || "Pending"}
                        </span>
                        <p className="text-sm text-gray-600">
                          Quantity:{" "}
                          <span className="font-semibold">
                            {order.orderQty} {order.productId.measuringUnit}
                          </span>
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Delivery Location:</p>
                        <button
                          onClick={() =>
                            navigate(
                              `/map/${order.orderLocation.latitude}/${order.orderLocation.longitude}`
                            )
                          }
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline mt-1"
                        >
                          📍 {order.orderLocation.latitude.toFixed(4)},{" "}
                          {order.orderLocation.longitude.toFixed(4)}
                        </button>
                      </div>

                      {/* Contact Seller Button */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`tel:${order.sellerId.contact}`, "_self")}
                          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                        >
                          📞 Contact Seller
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/category/${order.productId.category}/details/${order.productId._id}`)
                          }
                          className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
                        >
                          View Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
