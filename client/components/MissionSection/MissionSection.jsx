import React from "react";

const MissionSection = () => {
  return (
    <section className="px-6 py-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Illustration */}
        <div className="w-full flex justify-center">
          <img
            src="../../assests/mission.jpg"
            alt="Illustration"
            className="max-w-full h-auto"
          />
        </div>

        {/* Right Content */}
        <div className="text-left">
          <p className="text-red-600 font-semibold text-sm mb-2 uppercase tracking-wide">Our Mission</p>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            We're a highly skilled and<br /> professionals team.
          </h2>
          <p className="text-gray-600 mb-4">
            ClickJob is a vibrant platform dedicated to empowering and guiding
            interns on their journey towards professional success. We understand
            the pivotal role internships play in shaping careers, and we are
            committed to providing comprehensive resources and support to interns
            across diverse fields and industries.
          </p>
          <p className="text-gray-600 mb-6">
            We believe in connecting talent with opportunity, ensuring that every
            individual finds meaningful work, and every employer discovers
            exceptional talent. With a passion for excellence, we strive to make
            the job market accessible, transparent, and rewarding for all. Join us
            on this journey as we shape the future of employment.
          </p>

          {/* <div>
            <h3 className="text-xl font-semibold mb-2">Our Brands</h3>
            <img
              src="../../assests/mission.jpg"
              alt="Talentsathi Logo"
              className="w-40"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
