const React = require("react");
const { Html, Head, Body, Container, Font, Preview } = require("react-email");
const { colors, fontJakarta } = require("./styles");
const { MedhaHeader } = require("./MedhaHeader");
const { MedhaFooter } = require("./MedhaFooter");
const h = React.createElement;

function MedhaLayout({ preview, showHeader = true, showFooter = true, children }) {
  return h(Html, null,
    h(Head, null,
      h(Font, {
        fontFamily: "Plus Jakarta Sans",
        fallbackFontFamily: "Arial",
        webFont: {
          url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
          format: "woff2",
        },
        fontWeight: 700,
        fontStyle: "normal",
      }),
      h(Font, {
        fontFamily: "Manrope",
        fallbackFontFamily: "Arial",
        webFont: {
          url: "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400&display=swap",
          format: "woff2",
        },
        fontWeight: 400,
        fontStyle: "normal",
      })
    ),
    preview ? h(Preview, null, preview) : null,
    h(Body, {
      style: {
        margin: "0",
        padding: "0",
        backgroundColor: colors.canvas,
        fontFamily: fontJakarta,
        color: colors.ink,
        WebkitTextSizeAdjust: "100%",
      },
    },
      h("div", { style: { backgroundColor: colors.canvas, padding: "36px 16px" } },
        h(Container, {
          style: {
            maxWidth: "560px",
            margin: "0 auto",
            backgroundColor: colors.paper,
            border: `1px solid ${colors.line}`,
            borderRadius: "24px",
            overflow: "hidden",
          },
        },
          showHeader ? h(MedhaHeader) : null,
          h("div", { style: { padding: "32px 36px 28px 36px" } }, children),
          showFooter ? h(MedhaFooter) : null
        )
      )
    )
  );
}

module.exports = { MedhaLayout };
