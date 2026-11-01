import React from "react";
import { Link } from "react-router-dom";
import LegalShell from "../components/Legal/LegalShell";

const Privacy = () => {
  const sections = [
    {
      id: "scope",
      title: "1. Scope",
      body: (
        <>
          <p>
            This Privacy Policy explains how CampusKart, which manages Medha
            Revision together with open source contributors, collects, uses,
            and shares information. All rights in the service belong to{" "}
            <a href="https://www.shopcampuskart.in" target="_blank" rel="noreferrer">
              www.shopcampuskart.in
            </a>
            . Read this with our <Link to="/terms">Terms of Service</Link>.
          </p>
          <p>
            We handle personal information in line with applicable Indian law,
            including the Digital Personal Data Protection Act, 2023, where it
            applies.
          </p>
        </>
      ),
    },
    {
      id: "collect",
      title: "2. Information we collect",
      body: (
        <>
          <p>We collect the information needed to run a study account:</p>
          <ul>
            <li>
              <strong>Account details</strong> you provide, such as name, email
              address, password or OTP verification, branch, and semester.
            </li>
            <li>
              <strong>Content you upload</strong>, including notes, files,
              titles, and other material you choose to share.
            </li>
            <li>
              <strong>Usage data</strong>, such as pages visited, search
              queries, device type, and approximate technical logs that help us
              keep the service reliable.
            </li>
            <li>
              <strong>Support messages</strong> you send to us, including the
              email address you use to write in.
            </li>
          </ul>
          <p>
            We do not need your university roll number, Aadhaar, or payment card
            details to create a standard account. Do not upload those unless a
            specific feature clearly asks for them.
          </p>
        </>
      ),
    },
    {
      id: "use",
      title: "3. How we use information",
      body: (
        <>
          <p>We use personal information to:</p>
          <ul>
            <li>create and secure your account, including email or OTP login;</li>
            <li>show syllabus, notes, and exam-prep tools relevant to you;</li>
            <li>store and display content you upload, including public notes;</li>
            <li>fix bugs, prevent abuse, and understand how the product is used;</li>
            <li>send service emails, such as verification or password help;</li>
            <li>respond to support requests and meet legal obligations.</li>
          </ul>
          <p>
            We do not sell your personal information. We do not use your notes
            to advertise unrelated third-party products.
          </p>
        </>
      ),
    },
    {
      id: "sharing",
      title: "4. When we share information",
      body: (
        <>
          <p>We share information only when it is needed to operate the service:</p>
          <ul>
            <li>
              <strong>With other students</strong>, if you publish a note or
              other content as public.
            </li>
            <li>
              <strong>With infrastructure providers</strong> that host the app,
              email, or files, under contracts that limit how they may use the
              data.
            </li>
            <li>
              <strong>When the law requires it</strong>, or to protect students,
              the service, or someone’s rights and safety.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies",
      title: "5. Cookies and local storage",
      body: (
        <>
          <p>
            Medha Revision uses cookies, local storage, and similar technologies
            to keep you signed in, remember preferences, and understand basic
            product usage. These are used to run the site, not to sell a
            browsing profile to advertisers.
          </p>
          <p>
            You can block cookies in your browser. If you do, some features —
            especially staying logged in — may not work.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      title: "6. How long we keep information",
      body: (
        <p>
          We keep account and content data while your account is active and for
          a reasonable period afterward if we need it for security, backups, or
          legal reasons. You can ask us to delete your account. Public notes
          you uploaded may need a separate request if they were copied or
          cited by other students before deletion.
        </p>
      ),
    },
    {
      id: "security",
      title: "7. Security",
      body: (
        <p>
          We use reasonable technical and organisational measures to protect
          accounts and uploads. No internet service is completely secure. You
          can help by choosing a strong password, not sharing OTPs, and logging
          out on shared devices.
        </p>
      ),
    },
    {
      id: "rights",
      title: "8. Your choices and rights",
      body: (
        <>
          <p>Subject to applicable law, you may ask us to:</p>
          <ul>
            <li>access the personal information we hold about you;</li>
            <li>correct inaccurate account details;</li>
            <li>delete your account or specific personal information;</li>
            <li>withdraw consent where processing is based on consent.</li>
          </ul>
          <p>
            Write to <a href="mailto:support@shopcampuskart.in">support@shopcampuskart.in</a>{" "}
            from your registered email. We may need to verify it is you before
            we act. Some records may be kept if the law requires it.
          </p>
        </>
      ),
    },
    {
      id: "children",
      title: "9. Children",
      body: (
        <p>
          Medha Revision is built for university students. We do not knowingly
          collect personal information from children under 13. If you believe a
          child has created an account, contact us and we will delete it.
        </p>
      ),
    },
    {
      id: "changes",
      title: "10. Changes to this policy",
      body: (
        <p>
          We may update this policy when our practices or the law change. The
          “Last updated” date will change when we publish a revision. For
          material changes, we will try to notify you in the product or by
          email.
        </p>
      ),
    },
    {
      id: "contact",
      title: "11. Contact",
      body: (
        <p>
          Privacy questions and data requests:{" "}
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
      doc="privacy"
      kicker="Legal"
      title="Privacy Policy"
      updated="2 November 2026"
      lead="This policy describes the information Medha Revision collects, why we collect it, and the choices you have. We keep this as plain as we can so you can decide whether to create an account."
      sections={sections}
    />
  );
};

export default Privacy;
