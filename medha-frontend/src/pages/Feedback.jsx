import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa6";
import FeedbackForm from "../components/Feedback/FeedbackForm";
import Footer from "../components/Common/Footer";
import Card from "../components/Common/Card";

// Example submit handler; wire this to your backend later!
const submitFeedback = async ({ name, email, message }) => {
  void name;
  void email;
  void message;
  await new Promise((resolve) => setTimeout(resolve, 700));
};

const Feedback = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header Section - with proper top padding to account for fixed navbar */}
      <header className="pt-20 bg-white/80 backdrop-blur-sm border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">
              Feedback & Suggestions
            </h1>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto mb-6">
              Help us make MEDHA better for everyone
            </p>
            <Link
              to="/messages"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md active:scale-95"
            >
              <FaEnvelope className="w-5 h-5" />
              <span>Send us a Message</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 md:py-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Information */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-blue-200">
                <h2 className="text-2xl font-bold text-blue-700 mb-4">
                  We Value Your Input
                </h2>
                <p className="text-blue-600 mb-6 leading-relaxed">
                  Your feedback helps us improve MEDHA and create a better learning experience for all students.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-700">Bug Reports</h3>
                      <p className="text-sm text-blue-600">Found something broken? Let us know!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-700">Feature Ideas</h3>
                      <p className="text-sm text-blue-600">Have suggestions for new features?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-700">General Feedback</h3>
                      <p className="text-sm text-blue-600">Share your overall experience with us</p>
                    </div>
                </div>
                  
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FaEnvelope className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-700">Direct Message</h3>
                      <Link 
                        to="/messages"
                        className="text-sm text-blue-600 hover:text-blue-800 underline block mt-1"
                      >
                        Chat with Admin
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Your email is optional but helps us respond to your feedback personally.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-blue-200">
                <FeedbackForm onSubmitFeedback={submitFeedback} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Feedback;
