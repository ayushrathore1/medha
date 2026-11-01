import React from "react";
import { Link } from "react-router-dom";
import LegalShell from "../components/Legal/LegalShell";

const Terms = () => {
  const sections = [
    {
      id: "agreement",
      title: "1. Agreement to these terms",
      body: (
        <>
          <p>
            These Terms of Service govern your access to Medha Revision, a study
            platform managed by CampusKart and open source contributors (“we”,
            “us”, or “our”). All rights in the service belong to{" "}
            <a href="https://www.shopcampuskart.in" target="_blank" rel="noreferrer">
              www.shopcampuskart.in
            </a>
            . By creating an account or using the service, you agree to these
            terms and to our <Link to="/privacy">Privacy Policy</Link>.
          </p>
          <p>
            If you do not agree, do not use the service. If you use Medha
            Revision for a college, coaching centre, or other organisation, you
            confirm that you are allowed to accept these terms on its behalf.
          </p>
        </>
      ),
    },
    {
      id: "service",
      title: "2. The service",
      body: (
        <>
          <p>
            Medha Revision helps students prepare for exams with syllabus maps,
            previous-year questions, notes, and related study tools. The
            catalogue, features, and availability can change as we improve the
            product.
          </p>
          <p>
            Medha Revision is an independent study aid. It is not an official
            website of Rajasthan Technical University or any college, and it
            does not replace university notices, circulars, or prescribed
            textbooks.
          </p>
        </>
      ),
    },
    {
      id: "accounts",
      title: "3. Accounts",
      body: (
        <>
          <p>
            You must provide accurate registration details and keep your
            password or OTP access confidential. You are responsible for
            activity on your account. Tell us at{" "}
            <a href="mailto:support@shopcampuskart.in">support@shopcampuskart.in</a> if you
            think someone else is using it.
          </p>
          <p>
            The service is intended for students who can form a binding
            contract under applicable law. If you are under 18, you may use
            Medha Revision only with a parent or guardian’s permission.
          </p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "4. Acceptable use",
      body: (
        <>
          <p>You agree not to:</p>
          <ul>
            <li>break the law, harass others, or post harmful or illegal content;</li>
            <li>upload malware, scrape the service abusively, or attempt to break security;</li>
            <li>copy, sell, or redistribute the platform or its non-public content without permission;</li>
            <li>impersonate another person or misrepresent your affiliation;</li>
            <li>use the service to cheat in an exam or to submit work that is not yours as if it were.</li>
          </ul>
          <p>
            We may suspend or close an account that violates these rules, or
            that puts other students or the service at risk.
          </p>
        </>
      ),
    },
    {
      id: "your-content",
      title: "5. Notes and other content you upload",
      body: (
        <>
          <p>
            You keep the rights you already have in notes, files, comments, or
            other material you upload. You grant CampusKart and its open source
            contributors a non-exclusive licence to host, display, and
            distribute that material so the service can work — for example, so
            other students can view a public note you shared.
          </p>
          <p>
            You confirm that you have the right to upload the material and that
            it does not infringe someone else’s copyright, privacy, or other
            rights. Student-uploaded notes are provided by students. Medha
            Revision does not claim ownership of that community content and
            does not guarantee that it is complete, current, or error-free.
          </p>
        </>
      ),
    },
    {
      id: "our-content",
      title: "6. Our content and syllabus data",
      body: (
        <>
          <p>
            The Medha Revision interface, trademarks, and original organisation
            of study material are owned by CampusKart, with all rights reserved
            to{" "}
            <a href="https://www.shopcampuskart.in" target="_blank" rel="noreferrer">
              www.shopcampuskart.in
            </a>
            . The product is maintained by CampusKart together with open source
            contributors.
            University syllabi, paper codes, and similar academic references
            remain the responsibility of the issuing university. We organise
            that information for study; we do not sell official degrees or
            exam admission.
          </p>
        </>
      ),
    },
    {
      id: "disclaimer",
      title: "7. No academic or results guarantee",
      body: (
        <>
          <p>
            Study tools, topic lists, and past-paper organisation are provided
            for learning. They are not a promise of marks, rank, or admission.
            Always confirm exam dates, syllabi, and official instructions with
            your university.
          </p>
          <p>
            The service is provided “as is” and “as available”. To the fullest
            extent allowed by law, we disclaim implied warranties of
            merchantability, fitness for a particular purpose, and
            non-infringement.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      title: "8. Limitation of liability",
      body: (
        <>
          <p>
            To the fullest extent allowed by law, CampusKart, its open source
            contributors, and www.shopcampuskart.in will not be liable for
            indirect, incidental, special, consequential, or punitive damages,
            or for lost marks, lost data, or lost opportunity arising from your
            use of the service.
          </p>
          <p>
            If we are found liable despite this section, our total liability for
            a claim will not exceed the amount you paid us for the service in
            the three months before the claim, or one thousand Indian rupees,
            whichever is greater.
          </p>
        </>
      ),
    },
    {
      id: "termination",
      title: "9. Suspension and termination",
      body: (
        <p>
          You may stop using the service at any time. We may suspend or end
          access if you breach these terms, if we must do so for legal or
          security reasons, or if we discontinue a feature or the product. We
          will try to give reasonable notice where it is practical to do so.
        </p>
      ),
    },
    {
      id: "changes",
      title: "10. Changes to the terms",
      body: (
        <p>
          We may update these terms as the product changes. The “Last updated”
          date at the top will change when we do. Continued use after an update
          means you accept the revised terms. If a change is material, we will
          try to notify you through the service or by email.
        </p>
      ),
    },
    {
      id: "law",
      title: "11. Governing law",
      body: (
        <p>
          These terms are governed by the laws of India. Courts in Jaipur,
          Rajasthan will have exclusive jurisdiction, except where applicable
          consumer law gives you the right to another forum.
        </p>
      ),
    },
    {
      id: "contact",
      title: "12. Contact",
      body: (
        <p>
          Questions about these terms:{" "}
          <a href="mailto:support@shopcampuskart.in">support@shopcampuskart.in</a>
          . Medha Revision is managed by CampusKart and open source
          contributors. All rights reserved:{" "}
          <a href="https://www.shopcampuskart.in" target="_blank" rel="noreferrer">
            www.shopcampuskart.in
          </a>
          .
        </p>
      ),
    },
  ];

  return (
    <LegalShell
      doc="terms"
      kicker="Legal"
      title="Terms of Service"
      updated="2 November 2026"
      lead="Please read these terms before you create an account or continue using Medha Revision. They explain what the product is, how you may use it, and what we are — and are not — responsible for."
      sections={sections}
    />
  );
};

export default Terms;
