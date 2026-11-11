import { useEffect } from "react";
import { applyPageSeo } from "../lib/seo";

/** Keep <title>, description, canonical, and JSON-LD in sync with the route. */
export function usePageSeo(seo) {
  const {
    title,
    description,
    path,
    image,
    type,
    noindex,
    jsonLd,
    jsonLdId,
  } = seo || {};

  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    applyPageSeo({
      title,
      description,
      path,
      image,
      type,
      noindex,
      jsonLd: jsonLdKey ? JSON.parse(jsonLdKey) : null,
      jsonLdId,
    });
  }, [title, description, path, image, type, noindex, jsonLdKey, jsonLdId]);
}

export default usePageSeo;
