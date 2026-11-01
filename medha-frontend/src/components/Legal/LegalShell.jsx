import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./LegalPage.css";

const Wordmark = () => (
  <Link to="/" className="legal-wordmark">
    <span className="legal-wordmark-name">Medha Revision</span>
    <span className="legal-wordmark-by">
      By{" "}
      <span className="legal-wordmark-ck">
        <span className="legal-wordmark-campus">campus</span>
        <span className="legal-wordmark-kart">kart</span>
        <span className="legal-wordmark-dot" aria-hidden="true" />
      </span>
    </span>
  </Link>
);

const LegalShell = ({
  doc,
  title,
  kicker,
  updated,
  lead,
  sections,
}) => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    const target = document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return undefined;
  }, [hash]);

  return (
    <div className="legal-page">
      <header className="legal-top">
        <Wordmark />
        <nav className="legal-tabs" aria-label="Legal documents">
          <Link to="/terms" className={doc === "terms" ? "is-active" : ""}>
            Terms of Service
          </Link>
          <Link to="/privacy" className={doc === "privacy" ? "is-active" : ""}>
            Privacy Policy
          </Link>
        </nav>
      </header>

      <div className="legal-wrap">
        <aside className="legal-toc" aria-label="On this page">
          <p>On this page</p>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </aside>

        <div className="legal-scroll">
          <article className="legal-doc">
            {kicker ? <p className="legal-kicker">{kicker}</p> : null}
            <h1>{title}</h1>
            <p className="legal-updated">Last updated {updated}</p>
            <p className="legal-lead">{lead}</p>
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>
                {section.body}
              </section>
            ))}
            <p className="legal-note">
              These pages describe how Medha Revision works today. They are not a
              substitute for legal advice. If something here conflicts with a
              signed agreement or applicable law, the law or that agreement
              controls.
            </p>
          </article>
          <footer className="legal-foot">
            © {new Date().getFullYear()}{" "}
            <a href="https://www.shopcampuskart.in" target="_blank" rel="noreferrer">
              www.shopcampuskart.in
            </a>
            . All rights reserved. Medha Revision is managed by CampusKart and open
            source contributors. Questions:{" "}
            <a href="mailto:support@shopcampuskart.in">support@shopcampuskart.in</a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LegalShell;
