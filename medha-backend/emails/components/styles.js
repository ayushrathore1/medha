const colors = {
  ink: "#111111",
  muted: "#5A5A5A",
  faint: "#8A8A8A",
  line: "#E8E8E8",
  ice: "#F4F4F4",
  paper: "#FFFFFF",
  canvas: "#F6F6F6",
  green: "#1BA34A",
  lime: "#C6D93B",
  orange: "#FF8A1A",
  red: "#E30613",
  sage: "#3F6B52",
  white: "#FFFFFF",
  black: "#111111",
};

const fontJakarta = "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif";
const fontManrope = "Manrope, 'Segoe UI', Arial, sans-serif";
const fontMono = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

const links = {
  website: "https://medha-revision.vercel.app/",
  login: "https://medha-revision.vercel.app/login",
  search: "https://medha-revision.vercel.app/search",
  subjects: "https://medha-revision.vercel.app/subjects",
  suggest: "https://medha-revision.vercel.app/suggest",
  unsubscribe: "https://medha-revision.vercel.app/unsubscribe",
  shop: "https://www.shopcampuskart.in",
  authMail: "auth@medharevision.shopcampuskart.in",
  supportMail: "support@shopcampuskart.in",
};

const clLinks = {
  website: "https://www.codelearnn.com",
  waitlist: "https://www.codelearnn.com",
  vibeCodingGuide: "https://www.codelearnn.com/learning-guides/vibe-coding",
  twitter: "https://twitter.com/codelearnnhq",
  linkedin: "https://linkedin.com/company/codelearnn",
  feedbackEmail: "weareteamclarity@gmail.com",
  unsubscribe: "https://www.codelearnn.com/unsubscribe",
};

const styles = {
  kicker: {
    margin: "0 0 10px 0",
    fontFamily: fontJakarta,
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: colors.muted,
  },
  title: {
    margin: "0 0 12px 0",
    fontFamily: fontJakarta,
    fontSize: "32px",
    fontWeight: "800",
    letterSpacing: "-0.04em",
    lineHeight: "1.1",
    color: colors.ink,
  },
  lead: {
    margin: "0 0 24px 0",
    fontFamily: fontJakarta,
    fontSize: "16px",
    lineHeight: "1.6",
    color: colors.muted,
  },
  body: {
    margin: "0 0 16px 0",
    fontFamily: fontJakarta,
    fontSize: "15px",
    lineHeight: "1.65",
    color: colors.muted,
  },
  note: {
    margin: "0",
    fontFamily: fontJakarta,
    fontSize: "13px",
    lineHeight: "1.55",
    color: colors.faint,
  },
  button: {
    backgroundColor: colors.ink,
    color: colors.white,
    padding: "14px 28px",
    borderRadius: "999px",
    fontFamily: fontJakarta,
    fontSize: "15px",
    fontWeight: "700",
    textDecoration: "none",
    display: "inline-block",
    border: "none",
  },
  buttonLime: {
    backgroundColor: colors.lime,
    color: colors.ink,
    padding: "14px 28px",
    borderRadius: "999px",
    fontFamily: fontJakarta,
    fontSize: "15px",
    fontWeight: "700",
    textDecoration: "none",
    display: "inline-block",
    border: "none",
  },
};

module.exports = {
  colors,
  fontJakarta,
  fontManrope,
  fontMono,
  links,
  clLinks,
  styles,
  fontFamily: fontJakarta,
  fontFamilyOutfit: fontJakarta,
  fontFamilySerif: fontJakarta,
  fontFamilyMono: fontMono,
  fontFamilySystem: fontJakarta,
  fontFamilyInter: fontJakarta,
};
