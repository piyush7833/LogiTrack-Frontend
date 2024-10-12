"use client"
import React, { useState } from "react";

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  [key: string]: string; // Add index signature
};

const Profile = () => {
  // Sample user data
  const [user, setUser] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement> |  React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
  };
  const formFields = [
    { name: "name", required: true, type: "text" },
    { name: "email", required: true, type: "email" },
    { name: "phone", required: true, type: "tel" },
  ];
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {isEditing ? (
          <form onSubmit={(e) => handleSubmit(e)}>
            {formFields.map((field) => (
              <div className="mb-4" key={field.name}>
                <label className="block text-gray-700 mb-2">
                  {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e)=>handleChange(e)}
                    className="w-full p-2 border rounded"
                    required={field.required}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={(e)=>handleChange(e)}
                    className="w-full p-2 border rounded"
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mt-4 w-full text-gray-500 underline"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div>
            {Object.keys(user).map((key) => (
              <p className="text-gray-700 mb-2" key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {user[key]}
              </p>
            ))}
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
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