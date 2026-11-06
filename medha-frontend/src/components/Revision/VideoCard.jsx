import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { AuthContext } from "../../AuthContext";
import { loginPath } from "./revisionUtils";
import { openCuratedResource, resourceThumbUrl } from "./openResource";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [busy, setBusy] = useState(false);
  const thumb = resourceThumbUrl(video);

  const watch = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(loginPath());
      return;
    }
    if (!video?.id || busy) return;
    setBusy(true);
    try {
      await openCuratedResource(video.id, { navigate });
    } catch {
      // keep card quiet; user can retry
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={watch}
      disabled={busy}
      className="flex w-full gap-3 border-b border-[var(--line)] py-4 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--wama-green)_6%,white)]"
    >
      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-[var(--navy)]">
        {thumb ? (
          <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" width={112} height={64} />
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] text-white">Play</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[14px] font-medium text-[var(--navy)]">{video.title}</h3>
        <p className="mt-1 text-[12px] text-[var(--muted)]">{video.channelTitle || "Lecture"}</p>
        <p className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--wama-green)]">
          {busy ? "Opening…" : "Watch"} <ExternalLink size={11} />
        </p>
      </div>
    </button>
  );
}
