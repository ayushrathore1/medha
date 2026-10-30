import React from "react";
import { ExternalLink } from "lucide-react";

export default function VideoCard({ video }) {
  const href = video.youtubeUrl || video.redirects?.watchDirect || (video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : null);
  const thumb = video.thumbnailUrl || (video.videoId ? `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg` : null);

  return (
    <a
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 border-b border-[#E5E5E5] py-4 no-underline"
    >
      <div className="relative h-16 w-28 shrink-0 overflow-hidden bg-[#1F1F1F]">
        {thumb ? (
          <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" width={112} height={64} />
        ) : (
          <div className="flex h-full items-center justify-center text-white text-[11px]">Play</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[14px] font-medium text-[#1F1F1F]">{video.title}</h3>
        <p className="mt-1 text-[12px] text-[#8A8A8A]">{video.channelTitle || "Lecture"}</p>
        <p className="mt-2 inline-flex items-center gap-1 text-[12px] text-[#1F1F1F]">
          Watch <ExternalLink size={11} />
        </p>
      </div>
    </a>
  );
}
