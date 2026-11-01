const React = require("react");
const { Button, Text } = require("react-email");
const { colors, fontJakarta, fontManrope, fontMono, styles } = require("./styles");
const h = React.createElement;

function EmailWordmark({ align = "center" }) {
  return h("div", { style: { textAlign: align } },
    h("div", {
      style: {
        fontFamily: fontJakarta,
        fontSize: "22px",
        fontWeight: "800",
        letterSpacing: "-0.03em",
        color: colors.ink,
        lineHeight: "1.1",
      },
    }, "Medha Revision"),
    h("div", {
      style: {
        marginTop: "6px",
        fontFamily: fontJakarta,
        fontSize: "12px",
        fontWeight: "500",
        color: "#6B6B6B",
      },
    },
      "By ",
      h("span", {
        style: {
          fontFamily: fontManrope,
          fontWeight: "300",
          letterSpacing: "-0.025em",
          color: "#14140f",
        },
      }, "campus"),
      h("span", {
        style: {
          fontFamily: fontManrope,
          fontWeight: "400",
          letterSpacing: "-0.025em",
          color: "#14140f",
        },
      }, "kart"),
      h("span", {
        style: {
          display: "inline-block",
          width: "6px",
          height: "6px",
          margin: "0 0 1px 5px",
          borderRadius: "50%",
          backgroundColor: colors.sage,
          verticalAlign: "middle",
        },
      })
    )
  );
}

function EmailKicker({ children }) {
  return h(Text, { style: styles.kicker }, children);
}

function EmailTitle({ children }) {
  return h("h1", { style: styles.title }, children);
}

function EmailLead({ children }) {
  return h(Text, { style: styles.lead }, children);
}

function EmailButton({ href, children, variant = "ink" }) {
  return h("div", { style: { textAlign: "center", margin: "28px 0 8px 0" } },
    h(Button, {
      href,
      style: variant === "lime" ? styles.buttonLime : styles.button,
    }, children)
  );
}

function EmailCode({ value, caption }) {
  return h("div", {
    style: {
      margin: "8px 0 24px 0",
      padding: "22px 16px",
      backgroundColor: colors.ink,
      borderRadius: "20px",
      textAlign: "center",
    },
  },
    h("div", {
      style: {
        fontFamily: fontMono,
        fontSize: "34px",
        fontWeight: "700",
        letterSpacing: "0.28em",
        color: colors.lime,
        lineHeight: "1",
      },
    }, value),
    caption
      ? h(Text, {
        style: {
          margin: "12px 0 0 0",
          fontFamily: fontJakarta,
          fontSize: "12px",
          color: "#C8C8C8",
        },
      }, caption)
      : null
  );
}

function EmailChip({ children, fill = false }) {
  return h("span", {
    style: {
      display: "inline-block",
      margin: "0 6px 8px 0",
      padding: "6px 12px",
      borderRadius: "999px",
      border: fill ? "0" : `1px solid ${colors.line}`,
      backgroundColor: fill ? colors.ink : colors.white,
      color: fill ? colors.white : colors.ink,
      fontFamily: fontJakarta,
      fontSize: "12px",
      fontWeight: "600",
    },
  }, children);
}

function EmailPanel({ children, accent = colors.lime }) {
  return h("div", {
    style: {
      margin: "8px 0 24px 0",
      padding: "20px 22px",
      backgroundColor: colors.ice,
      borderRadius: "18px",
      borderLeft: `4px solid ${accent}`,
    },
  }, children);
}

module.exports = {
  EmailWordmark,
  EmailKicker,
  EmailTitle,
  EmailLead,
  EmailButton,
  EmailCode,
  EmailChip,
  EmailPanel,
};
