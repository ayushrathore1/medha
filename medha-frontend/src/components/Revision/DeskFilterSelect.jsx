import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../UI/select";

function OptionLabel({ label, meta }) {
  return (
    <span className="desk-select-option">
      <span className="desk-select-option-text">{label}</span>
      {meta != null && meta !== "" ? (
        <span className="desk-select-meta">{meta}</span>
      ) : null}
    </span>
  );
}

export default function DeskFilterSelect({
  label,
  value,
  onValueChange,
  options,
  span = false,
}) {
  const [open, setOpen] = useState(false);
  const labelId = `${String(label).toLowerCase().replace(/\s+/g, "-")}-filter-label`;
  const selected = options.find((opt) => String(opt.value) === String(value));

  return (
    <div className={`desk-field${span ? " desk-field--span" : ""}`}>
      <span id={labelId}>{label}</span>
      <Select
        value={value}
        open={open}
        onOpenChange={setOpen}
        onValueChange={(next) => {
          onValueChange?.(next);
          setOpen(false);
        }}
      >
        <SelectTrigger
          className="desk-select-trigger"
          aria-labelledby={labelId}
          onPointerDown={(event) => {
            // Keep / re-open on second click of the same opener (no toggle-close).
            if (open) {
              event.preventDefault();
              setOpen(true);
            }
          }}
          onClick={(event) => {
            if (open) {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          <SelectValue>
            {selected ? (
              <OptionLabel label={selected.label} meta={selected.meta} />
            ) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="desk-select-content" position="popper" align="start">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)} className="desk-select-item">
              <OptionLabel label={opt.label} meta={opt.meta} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
