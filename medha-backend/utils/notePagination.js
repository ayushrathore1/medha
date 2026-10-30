const mongoose = require("mongoose");

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const PREVIEW_CHARS = 240;

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parsePositiveInt(value) {
  if (value === undefined || value === null || value === "") return null;
  if (!/^\d+$/.test(String(value))) return NaN;
  return parseInt(value, 10);
}

function decodeCursor(raw) {
  if (!raw) return null;
  const text = String(raw);
  const splitAt = text.lastIndexOf("_");
  if (splitAt <= 0) return null;
  const createdAt = new Date(text.slice(0, splitAt));
  const id = text.slice(splitAt + 1);
  if (Number.isNaN(createdAt.getTime()) || !mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return { createdAt, id: new mongoose.Types.ObjectId(id) };
}

function encodeCursor(doc) {
  if (!doc?.createdAt || !doc?._id) return null;
  return `${new Date(doc.createdAt).toISOString()}_${doc._id}`;
}

function parseNoteListQuery(query = {}) {
  if (query.limit !== undefined && query.limit !== "") {
    const limitVal = parsePositiveInt(query.limit);
    if (!Number.isInteger(limitVal) || limitVal < 1) {
      return { error: "Invalid limit. Use a positive integer." };
    }
  }

  if (query.page !== undefined && query.page !== "") {
    const pageVal = parsePositiveInt(query.page);
    if (!Number.isInteger(pageVal) || pageVal < 1) {
      return { error: "Invalid page. Use a positive integer." };
    }
  }

  let cursor = null;
  if (query.cursor) {
    cursor = decodeCursor(query.cursor);
    if (!cursor) {
      return { error: "Invalid cursor." };
    }
  }

  const requestedLimit = parsePositiveInt(query.limit);
  const limit = Math.min(
    MAX_LIMIT,
    requestedLimit && requestedLimit > 0 ? requestedLimit : DEFAULT_LIMIT
  );
  const page = parsePositiveInt(query.page) || 1;

  return { limit, page, cursor };
}

function keysetFilter(cursor) {
  if (!cursor) return null;
  return {
    $or: [
      { createdAt: { $lt: cursor.createdAt } },
      { createdAt: cursor.createdAt, _id: { $lt: cursor.id } },
    ],
  };
}

function previewContent(content) {
  if (typeof content !== "string" || content.length <= PREVIEW_CHARS) {
    return content || "";
  }
  return content.slice(0, PREVIEW_CHARS);
}

function paginationMeta({ notes, limit, page, hasMore }) {
  const last = notes[notes.length - 1];
  return {
    limit,
    page,
    hasMore,
    nextCursor: hasMore ? encodeCursor(last) : null,
  };
}

module.exports = {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  PREVIEW_CHARS,
  escapeRegex,
  parseNoteListQuery,
  keysetFilter,
  encodeCursor,
  decodeCursor,
  previewContent,
  paginationMeta,
};
