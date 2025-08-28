import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import logo from "../../assests/clickjob.png";

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: wire to newsletter API if available
    alert("Thanks for subscribing!");
  };

  return (
    <footer className="w-full text-gray-100 bg-slate-950">
      {/* Top gradient divider */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-400" />

      <div className="container-px mx-auto max-w-7xl py-10">
        {/* Brand and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ClickJob Logo" className="h-10 w-auto" />
              <div>
                <div className="text-lg font-semibold">ClickJob</div>
                <div className="text-xs text-gray-300">Your trusted partner for jobs and internships</div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mt-4 max-w-2xl">
              Find your next opportunity or the right talent with ClickJob. We help candidates and employers connect faster with curated roles and a streamlined experience.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-4">
              {[
                { href: "https://www.facebook.com/clickjob", Icon: FaFacebookF },
                { href: "https://www.twitter.com/clickjob", Icon: FaTwitter },
                { href: "https://www.instagram.com/clickjob", Icon: FaInstagram },
                { href: "https://www.linkedin.com/company/clickjob", Icon: FaLinkedinIn },
                { href: "https://www.youtube.com/@clickjob", Icon: FaYoutube },
              ].map(({ href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center transition"
                >
                  <Icon className="h-4 w-4 text-gray-100" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="text-sm font-semibold mb-2">Subscribe to our newsletter</div>
            <p className="text-xs text-gray-300 mb-3">Get the latest roles, tips and insights straight to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 bg-slate-900/60 text-gray-100 placeholder:text-gray-400 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-semibold hover:brightness-95 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div>
            <div className="text-sm font-semibold mb-3 text-white">Company</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Press</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3 text-white">For Candidates</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/jobs" className="hover:text-white transition">Browse Jobs</Link></li>
              <li><Link to="/dashboard/candidate/profile" className="hover:text-white transition">Profile</Link></li>
              <li><Link to="/dashboard/candidate/applications" className="hover:text-white transition">My Applications</Link></li>
              <li><Link to="/dashboard/candidate/settings" className="hover:text-white transition">Settings</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3 text-white">For Employers</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/dashboard/recruiter/post-job" className="hover:text-white transition">Post a Job</Link></li>
              <li><Link to="/dashboard/recruiter/posted-jobs" className="hover:text-white transition">Manage Jobs</Link></li>
              <li><Link to="/dashboard/recruiter/applications" className="hover:text-white transition">Applications</Link></li>
              <li><Link to="/register/recruiter" className="hover:text-white transition">Become an Employer</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3 text-white">Resources</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Guides</a></li>
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3 text-white">Legal</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Security</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-px mx-auto max-w-7xl py-4 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} ClickJob. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-200 transition">Privacy</a>
            <a href="#" className="hover:text-gray-2 00 transition">Terms</a>
            <a href="#" className="hover:text-gray-200 transition">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
