import { HeroSlider } from "../../components/HeroSlider";
import MostSavedLessons from "../../components/MostSavedLessons";
import TopContributors from "../../components/TopContributors";
import WhyLearningMatters from "../../components/WhyLearningMatters";;
import FeaturedLessons from "./FeaturedLessons";
const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <HeroSlider />
      
      <FeaturedLessons />
      <WhyLearningMatters />
      <TopContributors />
      <MostSavedLessons />
    </div>
  );
};

export default Home;
