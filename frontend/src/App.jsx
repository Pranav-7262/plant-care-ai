import "./App.css";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Chat from "./pages/Chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Plants from "./pages/Plants";
import PlantDetails from "./pages/PlantDetails";
import MyPlants from "./pages/MyPlants";
import FavouritePlants from "./components/FavouritePlants";
import Docs from "./pages/Docs";

import AuthPage from "./pages/AuthPage";
import AddPlant from "./pages/AddPlant";
import ViewPlant from "./components/ViewPlant";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Settings from "./components/Settings";
import PlantData from "./pages/PlantData";
import PlantDataDetails from "./components/PlantDataDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="chat" element={<Chat />} />
          <Route path="/explore" element={<Plants />} />
          <Route path="/plants/:id" element={<PlantDetails />} />
          <Route path="/plantsdata" element={<PlantData />} />
          <Route path="/plantsdata/:id" element={<PlantDataDetails />} />
          <Route path="add-plant" element={<AddPlant />} />
          <Route path="add-plant/:id" element={<AddPlant />} />
          <Route path="/view-plant/:id" element={<ViewPlant />} />
          <Route path="my-plants" element={<MyPlants />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/favourite-plants" element={<FavouritePlants />} />

          <Route
            path="*"
            element={
              <div className="bg-red-600 text-2xl text-white p-3">
                404 - Page Not Found
              </div>
            }
          />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={true}
        pauseOnHover
        draggable
        closeOnClick
        theme="dark"
        toastStyle={{
          backgroundColor: "#1f2937",
          color: "#f9fafb",
          borderRadius: "0.75rem",
          fontSize: "0.95rem",
          padding: "12px 16px",
        }}
        style={{ zIndex: 9999 }}
      />
    </Router>
  );
}

export default App;
