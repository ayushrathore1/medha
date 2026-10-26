import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Feature flag for Charcha
const CHARCHA_ENABLED = import.meta.env.VITE_ENABLE_CHARCHA === 'true';

// Animate footer link underline on hover
const linkVariants = {
  rest: { scale: 1, color: "var(--text-secondary)" },
  hover: {
    scale: 1.08,
    color: "var(--action-primary)",
    transition: { type: "spring", stiffness: 340 },
  },
};

const underlineVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1, transition: { type: "spring", stiffness: 210 } },
};

const Footer = () => (
  <footer className="w-full pt-16 pb-10 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--accent-secondary)]/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <img
              src="https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/6.svg?updatedAt=1767677218473"
              alt="MEDHA logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent tracking-tight">
              MEDHA
            </span>
          </div>
          <p className="text-[var(--text-secondary)] mb-4 max-w-md font-normal">
            Boost your learning with AI-powered notes, exam archives, and personalized study tools.
            <br />
            Organized. Efficient. Fun.
          </p>
          <div className="flex space-x-5 mt-2">
            {[
              {
                label: "Facebook",
                href: "#",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                ),
              },
              {
                label: "Twitter",
                href: "#",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                ),
              },
              // Charcha link only shown when feature flag is enabled
              ...(CHARCHA_ENABLED ? [{
                label: "Charcha",
                href: "/charcha",
                isInternal: true,
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                  </svg>
                ),
              }] : []),
            ].map(({ label, href, icon, isInternal }) => (
              isInternal ? (
                <Link key={label} to={href}>
                  <motion.span
                    whileHover={{ scale: 1.22, color: "var(--action-primary)" }}
                    transition={{ type: "spring", stiffness: 240 }}
                    className="text-[var(--text-secondary)] hover:text-[var(--action-primary)] transition-colors block"
                  >
                    {icon}
                  </motion.span>
                </Link>
              ) : (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.22, color: "var(--action-primary)" }}
                  transition={{ type: "spring", stiffness: 240 }}
                  className="text-[var(--text-secondary)] hover:text-[var(--action-primary)] transition-colors"
                  aria-label={label}
                >
                  {icon}
                </motion.a>
              )
            ))}
          </div>
        </div>

        {/* Quick Links & Support */}
        {[
          {
            section: "Quick Links",
            links: [
              { to: "/dashboard", label: "Dashboard" },
              { to: "/notes", label: "Notes Community" },
              { to: "/exams", label: "Exams" },
            ],
          },
          {
            section: "Support",
            links: [
              { to: "/feedback", label: "Feedback" },
              { to: "/profile", label: "Profile" },
              { href: "#", label: "Help Center" },
              // Contact link conditionally points to Charcha or is generic
              ...(CHARCHA_ENABLED ? [{ to: "/charcha", label: "Contact Us" }] : [{ href: "mailto:support@medha.app", label: "Contact Us" }]),
              { href: "#", label: "Privacy Policy" },
            ],
          },
        ].map(({ section, links }) => (
          <div key={section}>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">{section}</h3>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="inline-block w-full">
                      <motion.span
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                        variants={linkVariants}
                        className="relative font-medium text-[var(--text-secondary)] hover:text-[var(--action-primary)] px-0.5 py-0.5 transition-colors"
                      >
                        {link.label}
                        <motion.span
                          variants={underlineVariants}
                          className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] rounded-xl"
                          style={{ display: "block" }}
                        />
                      </motion.span>
                    </Link>
                  ) : (
                    <motion.a
                      href={link.href}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      variants={linkVariants}
                      className="relative font-medium text-[var(--text-secondary)] hover:text-[var(--action-primary)] px-0.5 py-0.5 transition-colors"
                    >
                      {link.label}
                      <motion.span
                        variants={underlineVariants}
                        className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] rounded-xl"
                        style={{ display: "block" }}
                      />
                    </motion.a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[var(--accent-secondary)]/20 mt-10 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[var(--text-secondary)] text-sm">
            © 2025 <span className="text-[var(--action-primary)] font-semibold">MEDHA</span>.
            All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map(
              (item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{
                    scale: 1.18,
                    color: "var(--action-primary)",
                    borderBottom: "2px solid var(--action-primary)",
                  }}
                  className="text-[var(--text-secondary)] hover:text-[var(--action-primary)] text-sm font-medium transition"
                >
                  {item}
                </motion.a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
