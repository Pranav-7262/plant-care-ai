// src/pages/Settings.jsx
import { useNavigate } from "react-router-dom";
export default function Settings() {
  const navigate = useNavigate();
  const backToMyPlants = () => {
    navigate("/my-plants");
  };
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-green-700">⚙️ Settings</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your email"
              disabled
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <button className="px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50">
          Change Password
        </button>
      </div>
      <button
        onClick={backToMyPlants}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Back to My Plants
      </button>
    </div>
  );
}
