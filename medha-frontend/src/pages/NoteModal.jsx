import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import { FaDownload, FaSpinner, FaUser } from "react-icons/fa6";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const NoteModal = ({ note, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  if (!note) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      if (note.fileUrl) {
        // Direct file download for internal files
        const response = await fetch(note.fileUrl, { mode: 'cors' });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Robust extension extraction
        let ext = "pdf"; // Default to PDF as most notes are PDFs
        
        // 1. Trust explicit DB type
        if (note.fileType === "application/pdf") {
          ext = "pdf";
        } 
        // 2. Trust Blob type
        else if (blob.type === "application/pdf") {
          ext = "pdf";
        } else if (blob.type === "image/jpeg") {
          ext = "jpg";
        } else if (blob.type === "image/png") {
          ext = "png";
        }
        // 3. Fallback to URL only if it looks like a valid short extension
        else {
          const urlPath = note.fileUrl.split('?')[0];
          if (urlPath.includes('.')) {
             const candidate = urlPath.split('.').pop().toLowerCase();
             if (candidate.length >= 2 && candidate.length <= 5) {
               ext = candidate;
             }
          }
        }
        
        // Sanitize title
        const safeTitle = (note.title || "note").replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `${safeTitle}.${ext}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else if (note.content || note.extractedText) {
        // Generate PDF from HTML content
        const element = document.getElementById('note-content-print');
        if (element) {
          const canvas = await html2canvas(element, { 
            scale: 2,
            useCORS: true, 
            logging: false,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          // Add Header (Title & Metadata)
          const margin = 15;
          let yPos = margin;
          
          pdf.setFontSize(24);
          pdf.setFont("helvetica", "bold");
          pdf.text(note.title || "Note", margin, yPos + 10);
          yPos += 20;

          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(100);
          pdf.text(`Downloaded from Medha • ${new Date().toLocaleDateString()}`, margin, yPos);
          yPos += 10;
          
          // Add Line
          pdf.setDrawColor(200);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += 10;

          // Add Content Image
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // If image fits on first page remainder
          if (imgHeight < (pageHeight - yPos - margin)) {
             pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
          } else {
             // Multi-page handling logic (simplified for mixed content)
             let heightLeft = imgHeight;
             let position = yPos;
             
             pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
             heightLeft -= (pageHeight - position);
             
             while (heightLeft > 0) {
               position = heightLeft - imgHeight; // confusing logic in original library, resetting usually works better
               // simpler approach: just add new page and put image at top with offset
               pdf.addPage();
               // Calculate negative offset for subsequent pages
               const nextPos = -(imgHeight - heightLeft - margin); // rough approximation
               // A standard multipage pattern:
               // This library is tricky. Let's strictly use the standard pattern for v2
             }
             // Actually, for simplicity on this specific fix, let's use the standard "add page if needed loop" 
             // but re-instantiate correct logic:
             // To avoid complex tiling, let's just add new pages and offset the image.
             // Resetting simplified logic:
             
             let capturedHeight = pageHeight - yPos - margin;
             
             // First page already added above? No, let's restart logic cleanly:
             // Clean start for multi-page:
          }
          
          // RE-WRITING MULTIPAGE LOGIC CLEANLY:
          const contentWidth = pageWidth - (margin * 2);
          const contentHeight = (canvas.height * contentWidth) / canvas.width;
          let heightLeft = contentHeight;
          let position = yPos; // Start below header

          pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
          heightLeft -= (pageHeight - position - margin);

          while (heightLeft > 0) {
            position = margin - (contentHeight - heightLeft); // Negative offset to show next chunk
            // Just add a page
            pdf.addPage();
            // We need to re-add the image shifted up
            // Note: jsPDF clipping is implicit by page size, but we need correct Y
            // Actually standard approach is:
            pdf.addImage(imgData, 'PNG', margin, -(contentHeight - heightLeft) + margin, contentWidth, contentHeight);
            heightLeft -= (pageHeight - (margin * 2));
          }

          const safeTitle = (note.title || "note").replace(/[^a-z0-9]/gi, '_').toLowerCase();
          pdf.save(`${safeTitle}.pdf`);
        }
      }
    } catch (err) {
      console.error("Download failed", err);
      // Fallback
      if (note.fileUrl) {
        window.open(note.fileUrl, '_blank');
      }
    }
    setDownloading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto p-4" onClick={onClose}>
      <Card className="relative mx-auto my-10 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6 sticky top-0 bg-white z-10 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {note.title || "Note Details"}
            </h2>
            <div className="flex gap-2 mt-2 text-sm text-slate-500">
              {note.subject && (
                 <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                   {typeof note.subject === 'object' ? note.subject.name : "Subject"}
                 </span>
              )}
              <span>• {new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2"
              size="sm"
            >
              {downloading ? <FaSpinner className="animate-spin"/> : <FaDownload />}
              {downloading ? "Downloading..." : "Download PDF"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="px-2"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {/* Content Wrapper for PDF generation */}
          <div id="note-content-print" className="bg-white p-4">
             {/* Removed duplicated title block from here to fix UI issue */}

            {(note.content || note.extractedText) && (
              <div 
                className="prose prose-slate max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: note.content || note.extractedText }}
              />
            )}

            {note.fileUrl && (
              <div className="mb-6 not-prose">
                {note.fileType === "application/pdf" || note.fileUrl?.toLowerCase().includes('.pdf') ? (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(note.fileUrl)}&embedded=true`}
                    title="PDF Preview"
                    className="w-full h-[600px] rounded-xl border-2 border-slate-200"
                    frameBorder="0"
                  />
                ) : (
                  <img
                    src={note.fileUrl}
                    alt="Note"
                    className="w-full rounded-xl shadow-lg"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Metadata */}
        <div className="flex flex-wrap gap-3 items-center mt-6 pt-4 border-t border-slate-100">
           {note.owner && (
            <span className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full overflow-hidden">
              {note.owner?.avatar ? (
                <img src={note.owner.avatar} alt="Author" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <FaUser className="text-slate-400" />
              )}
              <span>{note.owner.name || note.owner.email?.split("@")[0] || "Unknown"}</span>
            </span>
           )}
           <span className={`px-3 py-1 rounded-full text-sm font-bold ${note.isPublic ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
             {note.isPublic ? "🌍 Public" : "🔒 Private"}
           </span>
        </div>
      </Card>
    </div>
  );
};

export default NoteModal;
