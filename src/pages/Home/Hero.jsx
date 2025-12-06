const Hero = () => {
  return (
    <div className="hero py-16">
      <div className="hero-content flex-col lg:flex-row">
        
        <div className="flex-1">
          <h1 className="text-4xl font-bold leading-tight">
            Learn Life Skills That Matter  
            <span className="text-primary"> Every Day</span>
          </h1>
          <p className="py-6 text-lg">
            Discover practical lessons about productivity, mindset, habits, 
            relationships, money, and the realities of digital life.
          </p>
          <button className="btn btn-primary btn-lg">
            Explore Lessons
          </button>
        </div>

        <div className="flex-1">
          <img
            src="https://i.ibb.co/LSH16hB/learning-illustration.png"
            alt="learning illustration"
            className="rounded-lg shadow-xl w-full"
          />
        </div>

      </div>
    </div>
  );
};

export default Hero;
