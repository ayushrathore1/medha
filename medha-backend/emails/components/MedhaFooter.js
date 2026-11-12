const React = require("react");
const { Text, Link } = require("react-email");
const { colors, fontJakarta, links } = require("./styles");
const h = React.createElement;

function MedhaFooter() {
  const year = new Date().getFullYear();

  return h("div", {
    style: {
      padding: "22px 32px 28px 32px",
      borderTop: `1px solid ${colors.line}`,
      backgroundColor: colors.ice,
      textAlign: "center",
    },
  },
    h(Text, {
      style: {
        margin: "0 0 6px 0",
        fontFamily: fontJakarta,
        fontSize: "12px",
        color: colors.muted,
      },
    }, "Managed by CampusKart and open source contributors"),
    h(Text, {
      style: {
        margin: "0 0 10px 0",
        fontFamily: fontJakarta,
        fontSize: "12px",
        color: colors.faint,
      },
    },
      h(Link, { href: `mailto:${links.helloMail}`, style: { color: colors.ink, textDecoration: "none", fontWeight: "600" } }, links.helloMail),
      "  ·  ",
      h(Link, { href: links.shop, style: { color: colors.ink, textDecoration: "none", fontWeight: "600" } }, "www.shopcampuskart.in")
    ),
    h(Text, {
      style: {
        margin: "0",
        fontFamily: fontJakarta,
        fontSize: "11px",
        color: colors.faint,
      },
    }, `© ${year} CampusKart. All rights reserved.`)
  );
}

module.exports = { MedhaFooter };
