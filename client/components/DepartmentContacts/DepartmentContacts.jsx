import React from "react";
import { FiPhone, FiMail } from "react-icons/fi";

const departments = [
  {
    name: "Sales",
    phone: "+977 9802346002",
    email: "contact@clickjob.com",
  },
  {
    name: "Technical HR",
    phone: "+977 9802364008",
    email: "contact@clickjob.com",
  },
  {
    name: "Creative & Marketing HR",
    phone: "+977 9802364007",
    email: "contact@clickjob.com",
  },
];

const DepartmentContacts = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Contact our Various Department
        </h2>
        <p className="text-gray-500 mb-10">
          You can contact our various department.
        </p>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {departments.map((dept, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-left"
            >
              <h3 className="text-lg font-semibold text-black mb-4">
                {dept.name}
              </h3>
              <div className="flex items-center text-black mb-2">
                <FiPhone className="mr-2" />
                <span>{dept.phone}</span>
              </div>
              <div className="flex items-center text-black">
                <FiMail className="mr-2" />
                <span>{dept.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentContacts;
