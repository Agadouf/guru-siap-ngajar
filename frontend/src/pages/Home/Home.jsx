import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaBookOpen,
  FaVideo,
  FaComments,
  FaChalkboardTeacher,
  FaArrowRight,
} from "react-icons/fa";

import StudentLayout from "../../components/Layout/StudentLayout/StudentLayout";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Container from "../../components/ui/Container";
import SectionTitle from "../../components/ui/SectionTitle";
import StatCard from "../../components/ui/StatCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

import { getModules } from "../../services/module.service";
import { getDashboardStats } from "../../services/dashboard.service";

export default function Home() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    modules: 0,
    lessons: 0,
    expressions: 0,
    videos: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [moduleData, statsData] = await Promise.all([
        getModules(),
        getDashboardStats(),
      ]);

      setModules(moduleData);
      setStats(statsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <StudentLayout>
        <LoadingSpinner />
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

        {/* HERO */}

        <motion.section
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl text-white py-24 shadow-xl"
        >

          <Container>

            <h1 className="text-6xl font-extrabold leading-tight">
              Learn English
              <br />
              Naturally
            </h1>

            <p className="text-xl mt-8 max-w-3xl text-blue-100 leading-8">
              Improve your English through structured modules,
              practical lessons,
              useful daily expressions,
              and educational videos.
            </p>

            <div className="mt-10 flex gap-4 flex-wrap">

              <Link to="/modules">
  <Button variant="custom" className="bg-white text-blue-700 hover:bg-gray-100">
    Start Learning
  </Button>
</Link>

              <Link to="/about">
  <Button
    variant="custom"
    className="border border-white text-white hover:bg-white hover:text-blue-700"
  >
    Learn More
  </Button>
</Link>

            </div>

          </Container>

        </motion.section>

        {/* STATS */}

        <Container className="py-20">

          <SectionTitle
            title="Platform Statistics"
            subtitle="Everything is updated automatically from the admin panel."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            <StatCard
              icon={<FaBookOpen />}
              title="Modules"
              value={stats.modules}
            />

            <StatCard
              icon={<FaChalkboardTeacher />}
              title="Lessons"
              value={stats.lessons}
            />

            <StatCard
              icon={<FaComments />}
              title="Expressions"
              value={stats.expressions}
            />

            <StatCard
              icon={<FaVideo />}
              title="Videos"
              value={stats.videos}
            />

          </div>

        </Container>

        {/* FEATURED MODULES */}

        <Container className="pb-20">

          <SectionTitle
            title="Featured Modules"
            subtitle="Start learning with our most popular English modules."
          />

          {modules.length === 0 ? (

            <EmptyState
              title="No Modules Yet"
              message="Modules will appear here after the administrator creates them."
            />

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {modules.slice(0, 6).map((module) => (

                <motion.div
                  key={module.id}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >

                  <Card className="h-full flex flex-col">

                    <div className="flex items-center gap-3 mb-4">

                      <div className="w-14 h-14 rounded-full bg-blue-100 flex justify-center items-center">

                        <FaBookOpen className="text-blue-600 text-2xl" />

                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">

                        {module.title}

                      </h3>

                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-7 flex-1">

                      {module.description}

                    </p>

                    <div className="mt-8">

                      <Link to={`/modules/${module.id}/lessons`}>

                        <Button className="w-full flex justify-center items-center gap-2">

                          Start Learning

                          <FaArrowRight />

                        </Button>

                      </Link>

                    </div>

                  </Card>

                </motion.div>

              ))}            </div>

          )}

        </Container>

        {/* WHY CHOOSE US */}

        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">

          <Container>

            <SectionTitle
              title="Why Choose Guru Siap Ngajar?"
              subtitle="Everything you need to improve your English in one platform."
            />

            <div className="grid md:grid-cols-3 gap-8 mt-12">

              <Card>

                <div className="text-blue-600 text-5xl mb-5">
                  <FaBookOpen />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Structured Learning
                </h3>

                <p className="text-gray-600 dark:text-gray-300">
                  Learn English step by step through carefully organized
                  modules and lessons that build your skills naturally.
                </p>

              </Card>

              <Card>

                <div className="text-green-600 text-5xl mb-5">
                  <FaVideo />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Interactive Videos
                </h3>

                <p className="text-gray-600 dark:text-gray-300">
                  Watch engaging educational videos that improve listening,
                  pronunciation, and speaking confidence.
                </p>

              </Card>

              <Card>

                <div className="text-yellow-500 text-5xl mb-5">
                  <FaComments />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Daily Expressions
                </h3>

                <p className="text-gray-600 dark:text-gray-300">
                  Practice real-life English expressions used in everyday
                  conversations and situations.
                </p>

              </Card>

            </div>

          </Container>

        </section>

        {/* CALL TO ACTION */}

        <Container className="py-24">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="
              bg-slate-900
              dark:bg-black
              rounded-3xl
              text-center
              text-white
              py-20
              px-10
              transition-colors
            "
          >

            <h2 className="text-5xl font-bold">
              Ready to Start Learning?
            </h2>

            <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
              Join hundreds of learners improving their English through
              structured lessons, useful expressions, and interactive videos.
            </p>

            <div className="mt-10">

              <Link to="/modules">

                <Button>
                  Browse All Modules
                </Button>

              </Link>

            </div>

          </motion.div>

        </Container>

      </div>

    </StudentLayout>
  );
}