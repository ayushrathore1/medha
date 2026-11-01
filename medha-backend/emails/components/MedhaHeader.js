const React = require("react");
const { colors } = require("./styles");
const { EmailWordmark } = require("./primitives");
const h = React.createElement;

function MedhaHeader() {
  return h("div", {
    style: {
      padding: "28px 32px 20px 32px",
      borderBottom: `1px solid ${colors.line}`,
    },
  },
    h("div", {
      style: {
        height: "4px",
        backgroundColor: colors.lime,
        borderRadius: "999px",
        margin: "0 0 22px 0",
      },
    }),
    h(EmailWordmark)
  );
}

module.exports = { MedhaHeader };
