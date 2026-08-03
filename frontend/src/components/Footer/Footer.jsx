import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid md:grid-cols-3 gap-10">

          {/* Logo */}

          <div>

            <div className="flex items-center gap-3">

              <FaBookOpen className="text-3xl text-blue-400" />

              <h2 className="text-2xl font-bold">
                Guru Siap Ngajar
              </h2>

            </div>

            <p className="text-gray-400 mt-5 leading-7">
              Learn English naturally through interactive
              lessons, practical expressions, and educational
              videos designed for teachers and students.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">

              <Link
                to="/"
                className="hover:text-blue-400 transition"
              >
                Home
              </Link>

              <Link
                to="/modules"
                className="hover:text-blue-400 transition"
              >
                Modules
              </Link>

              <Link
                to="/about"
                className="hover:text-blue-400 transition"
              >
                About
              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Contact
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <FaEnvelope />

                <span>
                  support@gurusiapngajar.com
                </span>

              </div>

              <div className="flex gap-5 text-2xl mt-5">

                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  <FaFacebook />
                </a>

                <a
                  href="#"
                  className="hover:text-pink-400 transition"
                >
                  <FaInstagram />
                </a>

                <a
                  href="#"
                  className="hover:text-gray-300 transition"
                >
                  <FaGithub />
                </a>

              </div>

            </div>

          </div>

        </div>

        <div className="border-t border-slate-700 mt-12 pt-6 text-center text-gray-400">

          © {new Date().getFullYear()} Guru Siap Ngajar.
          All rights reserved.

        </div>

      </div>

    </footer>
  );
}