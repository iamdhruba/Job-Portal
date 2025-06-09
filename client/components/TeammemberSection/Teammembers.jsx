import React from "react";

const teamMembers = [
  {
    name: "Kunal Sah",
    role: "Founder & CEO",
    image: "../../assests/ceo.jpg",
    description: "Visionary leader with a passion for empowering interns and shaping the future of work.",
  },
  {
    name: "Aarav Shrestha",
    role: "CTO",
    image: "../../assests/teammember.jpg",
    description: "Tech enthusiast driving innovative solutions and ensuring platform scalability.",
  },
  {
    name: "Sneha Thapa",
    role: "Marketing Head",
    image: "../../assests/businesswoman.jpg",
    description: "Creative strategist focused on brand growth and community engagement.",
  },
];

const Teammembers = () => {
  return (
    <section className="py-16 bg-white text-center px-4 md:px-12">
      <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
      <p className="max-w-3xl mx-auto text-gray-600 text-lg">
        At ClickJob, our team is the heartbeat of our organization, united by a shared passion for empowering interns and shaping the future of work. Get to know the dedicated individuals who are committed to making a difference:
      </p>

      <div className="mt-12 grid gap-10 sm:grid-cols-1 md:grid-cols-3 justify-items-center">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center w-72 bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-gray-600 font-medium">{member.role}</p>
            <p className="text-gray-500 text-sm mt-2">{member.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Teammembers;
