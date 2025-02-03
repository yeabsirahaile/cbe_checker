import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "@mui/material";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const AdminDashboard = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    telebirr_phone_number: "",
    telebirr_name: "",
    cbe_receiver_name: "",
    cbe_account_number: "",
  });

  // Fetch admin details on component mount
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://api-payment.finishmatexpo.com/api/admin/details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdminDetails(response.data.admin);
        setFormData({
          telebirr_phone_number: response.data?.admin.telebirr_phone_number,
          telebirr_name: response.data?.admin.telebirr_name,
          cbe_receiver_name: response.data?.admin.cbe_receiver_name,
          cbe_account_number: response.data?.admin.cbe_account_number,
        });
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchAdminDetails();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://api-payment.finishmatexpo.com/api/admin/update",
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      setModalOpen(true);
    } catch (error) {
      console.error("Error updating admin details:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.setItem("token", ""); // Clear the token
    window.location.href = "/"; // Redirect to the homepage
  };

  if (!adminDetails) return <div>Loading...</div>;

  return (
    <div className="flex flex-col p-5 md:px-40 space-y-5 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-5">Admin Panel</h1>

      <div className="flex justify-between items-center space-x-10 mb-5">
        <button
          className="flex items-center space-x-2 text-lg font-medium focus:outline-none"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <FaToggleOn className="text-green-500 text-3xl" />
          ) : (
            <FaToggleOff className="text-gray-400 text-3xl" />
          )}
          <span>{isEditing ? "Editing Enabled" : "Editing Disabled"}</span>
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="flex md:flex-row flex-col justify-between space-x-10">
        {/* Telebirr Section */}
        <div className="flex-1 bg-white w-full p-5 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/a/a4/Telebirr.png"
              alt="Telebirr"
              className="w-14 h-8"
            />
            <span>Telebirr Details</span>
          </h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="telebirr_phone_number"
                value={formData.telebirr_phone_number}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="telebirr_name"
                value={formData.telebirr_name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </form>
        </div>

        {/* CBE Section */}
        <div className="flex-1 bg-white p-5 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/6/6c/CBE_SA.png"
              alt="CBE"
              className="w-8 h-8"
            />
            <span>CBE Details</span>
          </h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium">Receiver Name</label>
              <input
                type="text"
                name="cbe_receiver_name"
                value={formData.cbe_receiver_name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Account Number
              </label>
              <input
                type="text"
                name="cbe_account_number"
                value={formData.cbe_account_number}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <button
          className={`bg-green-500 text-white px-6 py-2 rounded-md transition duration-300 ${
            !isEditing ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
          onClick={handleSubmit}
          disabled={!isEditing}
        >
          Submit Changes
        </button>
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-5 rounded-md shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-2">Details Updated</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
