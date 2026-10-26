import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/UI/dialog";
import { cn } from "@/lib/utils";

/**
 * Backward-compatible Modal wrapper around shadcn Dialog.
 * Maintains the same API: isOpen, onClose, title, children, actions.
 */
const Modal = ({ isOpen, onClose, title, children, actions, className }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent
        className={cn(
          "bg-card/95 backdrop-blur-xl border-[var(--glass-border)] shadow-2xl sm:max-w-md",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {title}
          </DialogDescription>
        </DialogHeader>

        <div className="text-foreground/95">{children}</div>

        {actions && (
          <DialogFooter>
            {actions}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
// Re-export shadcn Dialog parts for new code
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
