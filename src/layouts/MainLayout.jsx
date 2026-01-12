import { Outlet, useLocation, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RouteLoader from "../components/RouteLoader";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const MainLayout = () => {
  gsap.registerPlugin(ScrollTrigger);

  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade + slide in animation when route changes
      gsap.fromTo(
        ".page-transition",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
        }
      );
    }, mainRef);

    return () => ctx.revert();
  }, [location]);

  // Basic scroll trigger setup (optional parallax-ready)
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 " ref={mainRef}>
      <Navbar />
      <main className="flex-1 page-transition overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
