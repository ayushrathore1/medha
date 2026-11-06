import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { AuthContext } from "../../AuthContext";
import { loginPath } from "./revisionUtils";
import { openCuratedResource } from "./openResource";

export default function GfgCard({ article }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [busy, setBusy] = useState(false);

  const open = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(loginPath());
      return;
    }
    if (!article?.id || busy) return;
    setBusy(true);
    try {
      await openCuratedResource(article.id, { navigate });
    } catch {
      // retry quietly
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={open}
      disabled={busy}
      className="flex w-full items-center justify-between gap-3 border-b border-[var(--line)] py-4 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--wama-lime)_18%,white)]"
    >
      <div className="min-w-0">
        <p className="text-[12px] text-[var(--muted)]">GeeksforGeeks</p>
        <h3 className="mt-1 text-[14px] font-medium text-[var(--navy)]">{article.title}</h3>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[var(--wama-green)]">
        {busy ? "…" : <ExternalLink size={14} />}
      </span>
    </button>
  );
}
