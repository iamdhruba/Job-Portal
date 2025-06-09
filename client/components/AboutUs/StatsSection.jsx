import React from "react";
import { FaBriefcase, FaBuilding, FaUsers, FaChalkboardTeacher } from "react-icons/fa";

const StatsSection = () => {
  const stats = [
    {
      icon: <FaBriefcase className="text-red-600 text-2xl" />,
      value: "105+",
      label: "Live Internship & Jobs",
    },
    {
      icon: <FaBuilding className="text-red-600 text-2xl" />,
      value: "435+",
      label: "Companies",
    },
    {
      icon: <FaUsers className="text-red-600 text-2xl" />,
      value: "11700+",
      label: "Candidates",
    },
    {
      icon: <FaChalkboardTeacher className="text-red-600 text-2xl" />,
      value: "20+",
      label: "Training Institutes",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-red-50 rounded-full p-4  mb-3">
              {stat.icon}
            </div>
            <h3 className="text-xl font-bold text-black">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
