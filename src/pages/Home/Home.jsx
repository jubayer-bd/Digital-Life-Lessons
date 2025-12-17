import { HeroSlider } from "../../components/HeroSlider";
import { AboutSection } from "./AboutSection";
import CallToAction from "./CallToAction";
import Categories from "./Categories";
import FeaturedLessons from "./FeaturedLessons";
import Hero from "./Hero";
import { InsightCard } from "./InsightCard";
import { NewsletterCTA } from "./NewsletterCTA";
import { PillarsSection } from "./PillarsSection";
import PopularCategories from "./PopularCategories";
import WhyChooseUs from "./WhyChooseUs";
import WhyDigitalLifeLessons from "./WhyDigitalLifeLessons";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* <Hero /> */}
      <HeroSlider />
      <FeaturedLessons />
      {/* <Categories />
      <WhyChooseUs />
    
      <WhyDigitalLifeLessons />
      <CallToAction />
      <PopularCategories /> */}
      {/* <InsightCard /> */}
      <AboutSection />
      <PillarsSection />
      {/* <FeaturedLesson /> */}
      <NewsletterCTA />
    </div>
  );
};

export default Home;
