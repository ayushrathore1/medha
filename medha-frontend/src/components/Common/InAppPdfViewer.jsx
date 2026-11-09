import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Check, Share2, X } from "lucide-react";
import { PDFViewer } from "@/components/extend/pdf-viewer";

function toAbsoluteMedhaUrl(sharePath) {
  if (!sharePath) return window.location.href.split("#")[0];
  if (/^https?:\/\//i.test(sharePath)) return sharePath;
  const path = sharePath.startsWith("/") ? sharePath : `/${sharePath}`;
  return `${window.location.origin}${path}`;
}

/**
 * Desk-friendly full-screen shell around Extend UI PDFViewer.
 * ⋯ is replaced by Share when sharePath is set (exact Medha revision link).
 */
export default function InAppPdfViewer({
  isOpen,
  onClose,
  pdfUrl,
  title = "Document",
  fileName,
  showDownload = true,
  revokeOnClose,
  sharePath,
  shareTitle,
}) {
  const [shareState, setShareState] = useState("idle"); // idle | copied | error
  const onCloseRef = useRef(onClose);
  const revokeRef = useRef(revokeOnClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    revokeRef.current = revokeOnClose;
  }, [revokeOnClose]);

  const handleClose = useCallback(() => {
    // Revoke only on intentional close — never from effect deps/StrictMode remounts
    try {
      revokeRef.current?.();
    } catch {
      /* ignore */
    }
    onCloseRef.current?.();
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) setShareState("idle");
  }, [isOpen, sharePath]);

  const handleShare = useCallback(async () => {
    const url = toAbsoluteMedhaUrl(sharePath);
    const payload = {
      title: shareTitle || title || "Medha notes",
      text: shareTitle || title || "Open this PDF on Medha",
      url,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(payload);
        setShareState("copied");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareState("copied");
      } else {
        window.prompt("Copy this Medha link:", url);
        setShareState("copied");
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
      try {
        await navigator.clipboard?.writeText(url);
        setShareState("copied");
      } catch {
        setShareState("error");
      }
    }
    window.setTimeout(() => setShareState("idle"), 2000);
  }, [sharePath, shareTitle, title]);

  if (!isOpen || !pdfUrl) return null;

  const canShare = Boolean(sharePath);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[99999] flex flex-col bg-[#0f0f0f]/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-[#111] px-4 text-white">
        <p className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-tight">
          {title}
        </p>
        {canShare ? (
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 text-[12px] font-semibold text-white transition hover:bg-white/10"
            aria-label="Share PDF link"
          >
            {shareState === "copied" ? <Check size={14} /> : <Share2 size={14} />}
            {shareState === "copied" ? "Link copied" : shareState === "error" ? "Retry" : "Share"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
          aria-label="Close viewer"
        >
          <X size={18} />
        </button>
      </header>

      <div className="min-h-0 flex-1 bg-[#f4f4f1] p-2 sm:p-3">
        <PDFViewer
          key={pdfUrl}
          src={pdfUrl}
          fileName={fileName || `${String(title).replace(/[^\w.-]+/g, "_")}.pdf`}
          className="h-full min-h-[min(720px,calc(100dvh-4.5rem))] overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-sm"
          defaultZoom="fit-width"
          showDownload={showDownload}
          showUpload={false}
          showShare={canShare}
          onShare={canShare ? handleShare : undefined}
          showToolbar
          showRotateControls
        />
      </div>
    </div>,
    document.body
  );
}
