import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RouteLoader from "../components/RouteLoader";

const MainLayout = () => {
  const navigation = useNavigation();
  return (
    <>
      <div className="bg-base-200">
        <Navbar />
        {navigation.state === "loading" && <RouteLoader />}
        <div className="min-h-screen ">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
