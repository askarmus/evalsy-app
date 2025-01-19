import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Interview Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="bg-gray-50 text-gray-900 font-sans">
        {/* Navbar */}
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto flex items-center justify-between px-8 py-4">
            <a href="#" className="text-2xl font-bold text-blue-600">
              AIInterview
            </a>
            <div className="hidden md:flex space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Contact
              </a>

              <Link
                className="text-gray-700 hover:text-blue-600 transition"
                href="/login"
              >
                Login
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section with Image */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between py-20 px-8">
            <div className="text-center md:text-left md:w-1/2">
              <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                Revolutionize Your Hiring Process
              </h1>
              <p className="mb-8 text-lg">
                Simplify recruitment with AI-driven solutions that streamline CV
                parsing, job matching, and interviews.
              </p>
              <a
                href="#"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
              >
                Get Started
              </a>
            </div>
            <div className="md:w-1/2">
              <img
                src="/xx.png"
                alt="AI Interview"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <h2 className="text-4xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-8 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-4">
                  Automated CV Parsing
                </h3>
                <p className="text-gray-600">
                  Effortlessly extract relevant details from CVs to match job
                  roles.
                </p>
              </div>
              <div className="p-8 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-4">
                  Intelligent Job Matching
                </h3>
                <p className="text-gray-600">
                  Use AI to pair candidates with roles based on skills and
                  experience.
                </p>
              </div>
              <div className="p-8 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-4">
                  AI-Generated Questions
                </h3>
                <p className="text-gray-600">
                  Create tailored interview questions dynamically using AI.
                </p>
              </div>
              <div className="p-8 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-4">
                  Automated Invitations
                </h3>
                <p className="text-gray-600">
                  Send personalized interview invitations with secure links.
                </p>
              </div>
              <div className="p-8 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-4">Video Recording</h3>
                <p className="text-gray-600">
                  Record and securely store interview sessions for analysis.
                </p>
              </div>
              <div className="p-8 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold mb-4">
                  Automated Evaluation
                </h3>
                <p className="text-gray-600">
                  Score candidates based on responses, clarity, and insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
            <h2 className="text-4xl font-bold mb-12">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transition">
                <h3 className="text-2xl font-bold mb-4">Basic</h3>
                <p className="text-gray-600 mb-6">
                  Perfect for small teams starting out.
                </p>
                <p className="text-3xl font-bold text-blue-600 mb-6">
                  $29/month
                </p>
                <a
                  href="#"
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </a>
              </div>
              <div className="p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transition">
                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                <p className="text-gray-600 mb-6">
                  Ideal for growing teams and businesses.
                </p>
                <p className="text-3xl font-bold text-blue-600 mb-6">
                  $99/month
                </p>
                <a
                  href="#"
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </a>
              </div>
              <div className="p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transition">
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <p className="text-gray-600 mb-6">
                  Custom solutions for large organizations.
                </p>
                <p className="text-3xl font-bold text-blue-600 mb-6">
                  Contact Us
                </p>
                <a
                  href="#"
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-8 px-6">
            <p className="text-sm">
              &copy; 2025 AIInterview. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-400">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-400">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
