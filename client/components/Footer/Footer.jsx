import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Company Info */}
        <div>
          <img
            src="../../assests/clickjob.png"
            alt="ClickJob Logo"
            className="w-20 h-auto mb-4"
          />
          <p className="text-sm">ClickJob Pvt. Ltd.</p>
          <p className="text-sm">Ghorahi, Dang, Nepal</p>
          <p className="text-sm">+977-9810958122</p>
          <p className="text-sm">contact@clickjob@gmail.com</p>
        </div>

        {/* About */}
        <div>
          <h2 className="font-bold mb-3 text-red-500">About ClickJob</h2>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>
              <a
                href="/about"
                className="hover:text-red-500 cursor-pointer"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/services"
                className="hover:text-red-500 cursor-pointer"
              >
                Our Services
              </a>
            </li>
            <li>
              <a
                href="/blogs"
                className="hover:text-red-500 cursor-pointer"
              >
                Our Blogs
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-red-500 cursor-pointer"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Candidate */}
        <div>
          <h2 className="font-bold mb-3 text-red-500">For Candidates</h2>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>Create Your Profile</li>
            <li>Jobs</li>
          </ul>
        </div>

        {/* Employer */}
        <div>
          <h2 className="font-bold mb-3 text-red-500">For Employers</h2>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>Become an Employer</li>
            <li>Post a Job</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="font-bold mb-3 text-red-500">Helpful Resources</h2>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            <li>FAQs</li>
          </ul>
        </div>
      </div>

      {/* Social Media */}
      <div className="max-w-7xl mx-auto px-4 mt-10 border-t border-gray-700 pt-6 text-sm">
        <h2 className="font-bold mb-2 text-red-500">Follow Us</h2>
        <div className="flex space-x-6 items-center text-gray-300">
          <a
            href="https://www.facebook.com/clickjob"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 flex items-center space-x-2 cursor-pointer"
          >
            <FaFacebookF className="text-lg" />
            <span>Facebook</span>
          </a>
          <a
            href="https://www.twitter.com/clickjob"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 flex items-center space-x-2 cursor-pointer"
          >
            <FaTwitter className="text-lg" />
            <span>Twitter</span>
          </a>
          <a
            href="https://www.instagram.com/clickjob"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 flex items-center space-x-2 cursor-pointer"
          >
            <FaInstagram className="text-lg" />
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
