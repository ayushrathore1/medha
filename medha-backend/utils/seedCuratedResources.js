const CuratedResource = require("../models/CuratedResource");
const SYLLABUS_CATALOG = require("../data/syllabusCatalog");
const { ARTICLES } = require("../data/gfgArticles");

let seeding = null;

function youtubeDocs() {
  const docs = [];
  Object.entries(SYLLABUS_CATALOG).forEach(([subjectName, subData]) => {
    const semester = subData.semester || null;
    if (subData.playlistUrl) {
      docs.push({
        kind: "youtube",
        title: `${subjectName} — Complete Syllabus Playlist`,
        subject: subjectName,
        semester,
        channelTitle: subData.channelTitle || "Curated Channel",
        duration: "Full Playlist",
        url: subData.playlistUrl,
        videoId: null,
        thumbnailUrl: null,
        tags: [subjectName.toLowerCase(), "playlist"],
        sourceKey: `yt-playlist:${subjectName}`,
        active: true,
      });
    }
    (subData.units || []).forEach((unit) => {
      (unit.videos || []).forEach((video) => {
        if (!video.videoId && !video.url) return;
        docs.push({
          kind: "youtube",
          title: video.title || unit.title,
          subject: subjectName,
          semester,
          unitNumber: unit.unitNumber,
          unitTitle: unit.title,
          channelTitle: video.channelTitle || subData.channelTitle || "YouTube",
          duration: video.duration || "",
          videoId: video.videoId || null,
          url: video.url || (video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : null),
          thumbnailUrl: video.thumbnail || (video.videoId ? `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg` : null),
          tags: [
            subjectName.toLowerCase(),
            unit.title.toLowerCase(),
            ...(unit.topics || []).map((t) => t.toLowerCase()).slice(0, 8),
          ],
          sourceKey: `yt:${video.videoId || video.title}:${subjectName}:${unit.unitNumber}`,
          active: true,
        });
      });
    });
  });
  return docs;
}

function gfgDocs() {
  return ARTICLES.map((article) => ({
    kind: "gfg",
    title: article.title,
    subject: "",
    tags: article.tags || [],
    url: article.url,
    videoId: null,
    thumbnailUrl: null,
    sourceKey: `gfg:${article.title}`,
    active: true,
  }));
}

async function seedCuratedResources() {
  if (seeding) return seeding;
  seeding = (async () => {
    const count = await CuratedResource.estimatedDocumentCount();
    if (count > 0) return { seeded: false, count };

    const docs = [...youtubeDocs(), ...gfgDocs()];
    if (!docs.length) return { seeded: false, count: 0 };

    await CuratedResource.bulkWrite(
      docs.map((doc) => ({
        updateOne: {
          filter: { sourceKey: doc.sourceKey },
          update: { $setOnInsert: doc },
          upsert: true,
        },
      })),
      { ordered: false }
    );

    const next = await CuratedResource.estimatedDocumentCount();
    console.log(`📚 Curated resources seeded: ${next}`);
    return { seeded: true, count: next };
  })().finally(() => {
    seeding = null;
  });

  return seeding;
}

module.exports = { seedCuratedResources, youtubeDocs, gfgDocs };
