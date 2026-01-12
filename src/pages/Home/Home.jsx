import { HeroSlider } from "../../components/HeroSlider";
import MostSavedLessons from "../../components/MostSavedLessons";
import TopContributors from "../../components/TopContributors";
import WhyLearningMatters from "../../components/WhyLearningMatters";
import FAQSection from "./FAQSection";
import FeaturedLessons from "./FeaturedLessons";
import HowItWorks from "./HowItWorks";
import InstructorCTA from "./InstructorCTA";
import LearningCategories from "./LearningCategories";
import NewsletterSection from "./NewsletterSection";
import PlatformFeatures from "./PlatformFeatures";
import PlatformStatistics from "./PlatformStatistics";
import StudentTestimonials from "./StudentTestimonials";
const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <HeroSlider />

      <FeaturedLessons />
      <WhyLearningMatters />
      <TopContributors />
      <MostSavedLessons />
      <PlatformFeatures />
      <LearningCategories />
      <HowItWorks />
      <PlatformStatistics />
      <StudentTestimonials />
      {/* <InstructorCTA/> */}
      <FAQSection/>
      <NewsletterSection/>
    </div>
  );
};

export default Home;
