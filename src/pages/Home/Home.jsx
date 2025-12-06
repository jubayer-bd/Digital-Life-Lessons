import Categories from "./Categories";
import FeaturedLessons from "./FeaturedLessons";
import Hero from "./Hero";
import WhyChooseUs from "./WhyChooseUs";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <Hero />
      <FeaturedLessons />
      <Categories />
      <WhyChooseUs />
    </div>
  );
};

export default Home;
