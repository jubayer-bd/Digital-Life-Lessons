import Navbar from "../components/shared/Navbar";
import { Outlet } from "react-router-dom";

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
