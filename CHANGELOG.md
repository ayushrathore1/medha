# Changelog

All notable changes to MEDHA Revision are recorded here.

## [Unreleased]

### Changed
- Public coming-soon home with Medha-color full-field fluid motion, signup CTA, and sign-in enabled.
- Signed-in users land on `/inside` with a separate coming-soon experience.
- New accounts receive a credentials email (login + password). OTP sign-in without a password gets an 8-character generated password; copy notes forgot-password can change it anytime.

### Fixed
- Frontend `package.json` declares Node `>=20.19.0` (and `.nvmrc` = 22) so Hostinger / Vite 7 builds do not run on Node 18.

### Added
- Shared landing/auth visual system: Medha Revision lockup, CampusKart byline, white editorial canvas, black pills, lime/green/orange accents.
- Auth pages (`/login`, `/register`) with the shared `AuthShell` animation.
- Legal pages for Terms and Privacy (`/terms`, `/privacy`).
- Brand loader used as the app Suspense fallback.
- Hostinger Mail API transport for all outbound mail (`auth@medharevision.shopcampuskart.in`).
- Email-based forgot/reset password flow (WhatsApp admin handoff removed).
- Redesigned transactional and campaign emails: welcome, OTP login, OTP verification, password reset, team invite, re-engagement, early access, and the Sem 4 notice.

### Changed
- Dashboard, Search, Subjects, Upload, Profile, and public profile now use the same inside-app chrome as the landing page.
- Password reset and OTP emails send from the Hostinger mailbox via Mail API instead of Gmail SMTP.
- Email subjects are plain Medha Revision copy (no emoji subject lines).

### Fixed
- Forgot-password lookup normalizes email before matching a user.

### Notes
- Sending still requires a Hostinger **Mail API** token (Agentic Mail → API access) and DNS for the **subdomain** `medharevision.shopcampuskart.in`. Parent-domain SPF/MX on `shopcampuskart.in` does not cover this From address.
