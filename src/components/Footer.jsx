import { Facebook, Linkedin, Github, Mail, MapPin } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        {/* Logo & Name */}
        <div className="space-y-4">
          <Link className="flex items-center gap-3">
            <figure className="bg-blue-600 p-2 rounded-lg ">
              <img src="/1.svg" alt="" />
            </figure>
            <h2 className="text-xl  font-bold text-blue-600">
              Digital Life Lessons
            </h2>
          </Link>
          <p className="text-sm text-gray-400">
            Learn, share, and grow through real digital life experiences.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 hover:text-blue-600">
              <Mail size={16} /> support@digitallifelessons.com
            </li>
            <li className="flex items-center gap-2 hover:text-blue-600">
              <MapPin size={16} />
              Dhaka, Bangladesh
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="hover:text-blue-600 transition">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a className="hover:text-blue-600 transition">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              <Facebook />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              <Linkedin />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              <Github />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Digital Life Lessons. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
