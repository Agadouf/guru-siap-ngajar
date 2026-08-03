import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaVideo,
  FaComments,
  FaGraduationCap,
  FaCheckCircle,
} from "react-icons/fa";

import StudentLayout from "../../components/Layout/StudentLayout/StudentLayout";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SectionTitle from "../../components/ui/SectionTitle";

export default function About() {
  const features = [
    {
      icon: <FaBookOpen />,
      title: "Structured Modules",
      description:
        "Learn English step by step through organized learning modules.",
    },
    {
      icon: <FaVideo />,
      title: "Interactive Videos",
      description:
        "Watch educational videos to improve listening and pronunciation.",
    },
    {
      icon: <FaComments />,
      title: "Daily Expressions",
      description:
        "Practice useful English expressions used in everyday life.",
    },
    {
      icon: <FaGraduationCap />,
      title: "Easy Learning",
      description:
        "Simple lessons designed especially for beginners.",
    },
  ];

  const reasons = [
    "Modern learning platform",
    "Interactive educational videos",
    "Daily English expressions",
    "Step-by-step lessons",
    "Easy navigation",
    "Responsive design",
  ];

  return (
    <StudentLayout>

      {/* HERO */}

      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 rounded-3xl">
        <Container>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <h1 className="text-5xl font-bold">
              About Guru Siap Ngajar
            </h1>

            <p className="mt-6 text-xl max-w-3xl text-blue-100">
              Guru Siap Ngajar is an interactive English learning platform
              designed to help children improve their English through
              structured modules, educational videos, and practical daily
              expressions.
            </p>

          </motion.div>

        </Container>
      </section>

      {/* MISSION */}

      <Container className="py-20">

        <SectionTitle
          title="Our Mission"
          subtitle="Making English learning enjoyable, practical, and accessible."
        />

        <Card>

          <p className="text-lg text-gray-600 leading-8">
            Our mission is to make learning English enjoyable and effective
            by combining structured lessons, interactive videos, and useful
            daily expressions. We aim to help students build confidence and
            improve their communication skills in real-life situations.
          </p>

        </Card>

      </Container>

      {/* FEATURES */}

      <Container className="pb-20">

        <SectionTitle
          title="What We Offer"
          subtitle="Everything students need in one platform."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item) => (

            <Card key={item.title}>

              <div className="text-5xl text-blue-600 mb-5">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {item.title}
              </h3>

              <p className="text-gray-600">
                {item.description}
              </p>

            </Card>

          ))}

        </div>

      </Container>

      {/* WHY CHOOSE US */}

      <Container className="pb-20">

        <SectionTitle
          title="Why Choose Us?"
          subtitle="Our platform is designed to make learning English simple and engaging."
        />

        <Card>

          <div className="grid md:grid-cols-2 gap-5">

            {reasons.map((reason) => (

              <div
                key={reason}
                className="flex items-center gap-3"
              >
                <FaCheckCircle className="text-green-600" />

                <span className="text-lg">
                  {reason}
                </span>

              </div>

            ))}

          </div>

        </Card>

      </Container>

      {/* CTA */}

      <Container className="pb-24">

        <div className="bg-slate-900 rounded-3xl text-center text-white py-20 px-10">

          <h2 className="text-5xl font-bold">
            Ready to Start Learning?
          </h2>

          <p className="mt-6 text-gray-300 text-lg">
            Explore our English learning modules and improve your skills
            through interactive lessons and videos.
          </p>

          <div className="mt-10">

            <Link to="/modules">
              <Button>
                Browse Modules
              </Button>
            </Link>

          </div>

        </div>

      </Container>

{/* CONTACT */}

<Container className="pb-24">

  <SectionTitle
    title="Contact Us"
    subtitle="Feel free to reach us through any of the following platforms."
  />

  <div className="grid md:grid-cols-3 gap-8">

    {/* WhatsApp */}

    <Card className="text-center">

      <div className="text-5xl mb-5">💬</div>

      <h3 className="text-2xl font-bold mb-3">
        WhatsApp
      </h3>

      <p className="text-gray-600 mb-6">
        Chat with us directly for support or inquiries.
      </p>

      <a
        href="https://wa.me/+249 999179949"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          Contact on WhatsApp
        </Button>
      </a>

    </Card>

    {/* Instagram */}

    <Card className="text-center">

      <div className="text-5xl mb-5">📷</div>

      <h3 className="text-2xl font-bold mb-3">
        Instagram
      </h3>

      <p className="text-gray-600 mb-6">
        Follow us for learning tips and updates.
      </p>

      <a
        href="https://instagram.com/Abdalrahim_agadouf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
          Follow Instagram
        </Button>
      </a>

    </Card>

    {/* Facebook */}

    <Card className="text-center">

      <div className="text-5xl mb-5">📘</div>

      <h3 className="text-2xl font-bold mb-3">
        Facebook
      </h3>

      <p className="text-gray-600 mb-6">
        Stay connected with our latest news.
      </p>

      <a
        href="https://facebook.com/Abdalrahim_agadouf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Visit Facebook
        </Button>
      </a>

    </Card>

  </div>

</Container>
  
    </StudentLayout>
  );
}