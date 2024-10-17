"use client";
import useAuth from "@/app/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import Image from "next/image";

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  avatar?: string; // Assuming you may have an avatar URL
};

const Profile = () => {
  const { handleGetOwnProfile, handleUpdateProfile } = useAuth();
  const selectUserProfile = createSelector(
    (state: { auth: { user: UserProfile | null } }) => state.auth.user,
    (user) => ({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    })
  );
  
  // Use the memoized selector
  const user = useSelector(selectUserProfile);

  useEffect(() => {
    handleGetOwnProfile();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateProfile(formData);
    setIsEditing(false);
  };

  const formFields: Array<{ name: keyof UserProfile; required: boolean; type: string }> = [
    { name: "name", required: true, type: "text" },
    { name: "email", required: true, type: "email" },
    { name: "phone", required: true, type: "tel" },
  ];

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">User Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg flex justify-center flex-col">
        {/* Avatar Section */}
        <div className="flex items-center mb-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500">
            <Image 
              src={user?.avatar || "/images/profile.jpg"} // Default avatar if none
              alt="User Avatar"
              layout="fill"
              className="object-cover"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-700">{user?.email}</p>
          </div>
        </div>
        
        {/* Profile Form or Details */}
        {isEditing ? (
          <form onSubmit={(e) => handleSubmit(e)}>
            {formFields.map((field) => (
              <div className="mb-4" key={field.name}>
                <label className="block text-gray-700 mb-2 font-medium">
                  {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  required={field.required}
                />
              </div>
            ))}
            <div className="flex justify-between">
              <button
                type="submit"
                className="w-1/2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-1/2 ml-2 text-gray-600 underline hover:text-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            {user &&
              Object.keys(user).map((key) => (
                <p className="text-gray-700 mb-2" key={key}>
                  <strong className="text-gray-900">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  <span className="text-gray-600">{user[key as keyof UserProfile]}</span>
                </p>
              ))}
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-4"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
