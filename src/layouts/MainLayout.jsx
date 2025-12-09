import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
