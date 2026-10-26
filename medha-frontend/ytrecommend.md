=== MEDHA — YT RECOMMENDATIONS FEATURE ===
Complete Implementation Plan
Frontend + Backend + Admin Portal + AI Logic
==========================================

==========================================
FEATURE OVERVIEW
==========================================

Name: Smart Lecture Finder
Tagline: "Find the best lecture for exactly what you need to study."

What it does:
  1. Student enters a topic or unit name
  2. AI searches YouTube using pre-approved channels only
  3. AI fetches GeeksForGeeks articles for same topic
  4. AI matches results to RTU syllabus for that subject
  5. AI scores each result on syllabus relevance (0-100%)
  6. Student sees ranked, scored, explained recommendations
  7. Admin can manage approved channels from admin portal

What it does NOT do:
  → Does NOT search with "RTU" keyword
  → Does NOT show random YouTube results
  → Does NOT search outside approved channel list
  → Does NOT show irrelevant or off-syllabus content

==========================================
DATABASE SCHEMA
==========================================

-- Table 1: Approved YouTube Channels
CREATE TABLE approved_channels (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id    VARCHAR(64) UNIQUE NOT NULL,    -- YouTube channel ID (UCxxxx)
  channel_name  VARCHAR(255) NOT NULL,           -- Display name
  channel_url   VARCHAR(512) NOT NULL,           -- Full channel URL
  subject_tags  TEXT[],                          -- e.g. ['DBMS','OS','CN','DSA']
  priority      INTEGER DEFAULT 5,               -- 1-10, higher = shown first
  is_active     BOOLEAN DEFAULT true,
  added_by      UUID REFERENCES users(id),
  added_at      TIMESTAMP DEFAULT NOW(),
  notes         TEXT                             -- Admin notes about this channel
);

-- Table 2: RTU Syllabus
CREATE TABLE rtu_syllabus (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code  VARCHAR(20) NOT NULL,            -- e.g. 'CS-401'
  subject_name  VARCHAR(255) NOT NULL,            -- e.g. 'Database Management Systems'
  branch        VARCHAR(50),                      -- CSE, ECE, ME, etc.
  semester      INTEGER,                          -- 1-8
  unit_number   INTEGER NOT NULL,                 -- 1-6
  unit_title    VARCHAR(255) NOT NULL,            -- e.g. 'Relational Algebra'
  topics        TEXT[] NOT NULL,                  -- Array of topic strings
  keywords      TEXT[],                          -- Search keywords for this unit
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Table 3: Cached Search Results (avoid duplicate API calls)
CREATE TABLE lecture_cache (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query    VARCHAR(512) NOT NULL,
  channel_id      VARCHAR(64),
  video_id        VARCHAR(32) UNIQUE,
  video_title     VARCHAR(512),
  video_duration  VARCHAR(20),
  thumbnail_url   VARCHAR(512),
  channel_name    VARCHAR(255),
  view_count      BIGINT,
  published_at    TIMESTAMP,
  relevance_score INTEGER,                        -- 0-100 AI score
  syllabus_match  TEXT,                          -- AI explanation of match
  matched_topics  TEXT[],                        -- Which syllabus topics matched
  cached_at       TIMESTAMP DEFAULT NOW(),
  expires_at      TIMESTAMP DEFAULT NOW() + INTERVAL '6 hours'
);

-- Table 4: GFG Article Cache
CREATE TABLE gfg_cache (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query    VARCHAR(512) NOT NULL,
  article_url     VARCHAR(512),
  article_title   VARCHAR(512),
  summary         TEXT,
  relevance_score INTEGER,
  cached_at       TIMESTAMP DEFAULT NOW(),
  expires_at      TIMESTAMP DEFAULT NOW() + INTERVAL '12 hours'
);

-- Table 5: Search History (for analytics)
CREATE TABLE search_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  query       VARCHAR(512),
  subject     VARCHAR(255),
  unit        VARCHAR(255),
  result_count INTEGER,
  searched_at TIMESTAMP DEFAULT NOW()
);

==========================================
INITIAL CHANNEL SEED DATA
==========================================

-- Run this SQL to seed approved channels
INSERT INTO approved_channels 
  (channel_id, channel_name, channel_url, subject_tags, priority) 
VALUES
-- CS/DSA/Programming Fundamentals
('UCJskGeByzRRSvmOyZtNYsog', 'Abdul Bari',
 'https://youtube.com/@abdul_bari', 
 ARRAY['DSA','Algorithms','Theory of Computation','Compiler Design'], 9),

('UCo8bcnLyZH8tBIH9V1mLgqQ', 'Neso Academy',
 'https://youtube.com/@nesoacademy',
 ARRAY['Digital Electronics','Computer Networks','Computer Organization','OS'], 9),

('UCVwWF0MheVCxCN-8oBDEMtA', 'Gate Smashers',
 'https://youtube.com/@GateSmashers',
 ARRAY['DBMS','OS','CN','DSA','TOC','Compiler Design','CD'], 10),

('UCe_G2V-YuNxUkBN4cqEsBag', 'Jenny Lectures CS IT',
 'https://youtube.com/@JennyslecturesCSITNEW',
 ARRAY['DSA','C++','Data Structures','Algorithms'], 8),

('UCZCFT0ZxaLV8BDkfDrCKCqQ', 'Anuj Bhaiya',
 'https://youtube.com/@AnujBhaiya',
 ARRAY['DBMS','OS','Web Dev','Java'], 8),

('UCBwmMxybNva6P_5VmxjzwqA', 'CodeWithHarry',
 'https://youtube.com/@CodeWithHarry',
 ARRAY['Python','Web Dev','C','Programming Fundamentals'], 7),

('UCVLbzhxVTiTLiVKeGV7WEBg', 'Apna College',
 'https://youtube.com/@ApnaCollegeOfficial',
 ARRAY['DSA','Java','SQL','Web Dev'], 8),

('UCJihxo56p1XxlXBQPfbcBLQ', 'Knowledge Gate',
 'https://youtube.com/@KnowledgeGATE',
 ARRAY['DBMS','OS','CN','TOC'], 9),

('UCVKh7rjAkMNGVm77ZEuJCLQ', 'Last Moment Tuitions',
 'https://youtube.com/@LastMomentTuitions',
 ARRAY['ALL'], 10),    -- LMT covers almost all CS subjects

('UC0RhatS1pyxInC00YKjjBqQ', 'Gaurav Sen',
 'https://youtube.com/@gkcs',
 ARRAY['System Design','DBMS','Distributed Systems'], 8),

('UCM-yUTYGmrNvKOCcAl21g3A', 'Kunal Kushwaha',
 'https://youtube.com/@KunalKushwaha',
 ARRAY['DSA','Java','Git','Linux'], 7),

('UCqmugCqELzhIMNYnsjScXXw', 'Striver',
 'https://youtube.com/@takeUforward',
 ARRAY['DSA','Competitive Programming','System Design'], 9),

-- Math subjects
('UCRGXV1QlxZ8aucmE45tQgmQ', 'Professor Leonard',
 'https://youtube.com/@ProfessorLeonard',
 ARRAY['Engineering Mathematics','Calculus','Linear Algebra'], 8),

('UC9-y-6csu5WGm29I7JiwpnA', 'Computerphile',
 'https://youtube.com/@Computerphile',
 ARRAY['Computer Networks','Security','Algorithms','Cryptography'], 7),

-- ECE specific
('UCo8bcnLyZH8tBIH9V1mLgqQ', 'Neso Academy',
 'https://youtube.com/@nesoacademy',
 ARRAY['Signals Systems','Electronics','Digital Circuits','Microprocessors'], 9),

('UCiDKcjKocimAO1tVw0qCjow', 'ALL About Electronics',
 'https://youtube.com/@ALL_About_Electronics',
 ARRAY['Analog Electronics','Digital Electronics','Control Systems'], 8),

-- Additional curated channels
('UCONPe-zI46GKq8dNHLeFs8g', 'Science with Avni',
 'https://youtube.com/@ScienceWithAvni',
 ARRAY['Physics','Engineering Mathematics','Chemistry','Science'], 8),

('UCNQ6FEtztATuaVhZKCY28Yw', 'Chai aur Code',
 'https://youtube.com/@chaborcode',
 ARRAY['Web Dev','JavaScript','React','Node.js','Python','Backend'], 8),

('UCuJtT_b4VwmEqLNgbre1nEQ', '5 Minute Engineering',
 'https://youtube.com/@5MinuteEngineering',
 ARRAY['ALL'], 9),    -- Quick concept videos across all engineering subjects

('UCa7vbFGaaOB20FIYqPBWt-g', 'Gajendra Purohit',
 'https://youtube.com/@GajendraPurohit',
 ARRAY['Engineering Mathematics','Calculus','Linear Algebra','Differential Equations','Probability'], 9),

('UCYHOdG_XqQ-T-P4SrCqY3_Q', 'Pradeep Giri Academy',
 'https://youtube.com/@PradeepGiriAcademy',
 ARRAY['DBMS','OS','CN','DSA','TOC','Compiler Design'], 9);

==========================================
BACKEND IMPLEMENTATION
==========================================

FILE STRUCTURE:
backend/
├── routes/
│   ├── lectureSearch.js      ← main search endpoint
│   ├── adminChannels.js      ← admin channel management
│   └── syllabus.js           ← syllabus CRUD
├── services/
│   ├── youtubeService.js     ← YouTube Data API v3
│   ├── gfgService.js         ← GFG scraper/search
│   ├── aiScoring.js          ← Groq API for scoring (LLaMA 3)
│   └── syllabusService.js    ← syllabus lookup
├── middleware/
│   └── adminAuth.js
├── utils/
│   └── cacheManager.js       ← Redis-backed cache
└── config/
    └── redis.js               ← Redis client setup

--------------------------------------------------
FILE: services/youtubeService.js
--------------------------------------------------

const { google } = require('googleapis')
const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY })

// Get approved channels from DB filtered by subject relevance
async function getApprovedChannels(subjectHint = null) {
  let query = `SELECT * FROM approved_channels WHERE is_active = true`
  if (subjectHint) {
    query += ` AND (
      subject_tags @> ARRAY[$1]::text[] 
      OR 'ALL' = ANY(subject_tags)
    ) ORDER BY priority DESC`
    return db.query(query, [subjectHint])
  }
  return db.query(query + ' ORDER BY priority DESC')
}

// Search YouTube within approved channels ONLY
// NOTE: NO "RTU" keyword - pure topic search
async function searchYouTube(topicQuery, approvedChannels) {
  const results = []

  // Build channel filter string (max 50 channels per API call)
  // YouTube search API doesn't support multi-channel filter directly
  // So we search per-channel or use channelId filter with highest priority channels

  // Strategy: Search top 5 priority channels individually
  // Then deduplicate and rank by relevance score
  
  const topChannels = approvedChannels.slice(0, 8)  // Top 8 by priority

  const searchPromises = topChannels.map(async (channel) => {
    try {
      const response = await youtube.search.list({
        part: ['snippet'],
        q: topicQuery,                      // ONLY topic name, no RTU keyword
        channelId: channel.channel_id,      // Restrict to this channel
        type: ['video'],
        maxResults: 3,                       // Top 3 per channel
        order: 'relevance',
        videoDuration: 'medium',            // Filter out <4min and >20min
        relevanceLanguage: 'en',
      })

      const videos = response.data.items || []

      // Get video statistics (views, likes)
      if (videos.length > 0) {
        const videoIds = videos.map(v => v.id.videoId).join(',')
        const statsResponse = await youtube.videos.list({
          part: ['statistics', 'contentDetails'],
          id: [videoIds]
        })

        const statsMap = {}
        statsResponse.data.items.forEach(item => {
          statsMap[item.id] = {
            viewCount: parseInt(item.statistics.viewCount || 0),
            likeCount: parseInt(item.statistics.likeCount || 0),
            duration: item.contentDetails.duration  // ISO 8601 duration
          }
        })

        return videos.map(video => ({
          videoId:     video.id.videoId,
          title:       video.snippet.title,
          description: video.snippet.description?.slice(0, 300),
          channelId:   video.snippet.channelId,
          channelName: video.snippet.channelTitle,
          thumbnail:   video.snippet.thumbnails?.high?.url,
          publishedAt: video.snippet.publishedAt,
          viewCount:   statsMap[video.id.videoId]?.viewCount || 0,
          duration:    statsMap[video.id.videoId]?.duration || '',
          channelPriority: channel.priority,
          url: `https://youtube.com/watch?v=${video.id.videoId}`
        }))
      }
      return []
    } catch (err) {
      console.error(`YouTube search error for channel ${channel.channel_name}:`, err.message)
      return []
    }
  })

  const allResults = await Promise.allSettled(searchPromises)
  allResults.forEach(result => {
    if (result.status === 'fulfilled') {
      results.push(...result.value)
    }
  })

  return results
}

// Parse ISO 8601 duration to readable format
function parseDuration(iso) {
  const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  const h = parseInt(match[1]) || 0
  const m = parseInt(match[2]) || 0
  const s = parseInt(match[3]) || 0
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

module.exports = { searchYouTube, getApprovedChannels, parseDuration }

--------------------------------------------------
FILE: services/gfgService.js
--------------------------------------------------

const axios = require('axios')
const cheerio = require('cheerio')

// GFG search — no RTU keyword, pure topic search
async function searchGFG(topicQuery) {
  try {
    // GFG has a search endpoint
    const searchUrl = `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topicQuery)}`
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      },
      timeout: 8000
    })

    const $ = cheerio.load(response.data)
    const articles = []

    // Parse GFG search results
    $('.search-result, article.article-card, .content-card').each((i, el) => {
      if (i >= 5) return false  // Max 5 results

      const $el = $(el)
      const title = $el.find('h2, h3, .article-title').first().text().trim()
      const url   = $el.find('a').first().attr('href')
      const desc  = $el.find('p, .article-desc').first().text().trim().slice(0, 200)

      if (title && url) {
        articles.push({
          title,
          url: url.startsWith('http') ? url : `https://www.geeksforgeeks.org${url}`,
          description: desc,
          source: 'GeeksForGeeks',
          type: 'article'
        })
      }
    })

    return articles
  } catch (err) {
    console.error('GFG search error:', err.message)
    return []
  }
}

module.exports = { searchGFG }

--------------------------------------------------
FILE: services/syllabusService.js
--------------------------------------------------

// Get syllabus topics for a given subject + optional unit
async function getSyllabusContext(subjectName, unitNumber = null) {
  let query = `
    SELECT subject_name, unit_number, unit_title, topics, keywords
    FROM rtu_syllabus
    WHERE LOWER(subject_name) ILIKE $1
  `
  const params = [`%${subjectName.toLowerCase()}%`]

  if (unitNumber) {
    query += ` AND unit_number = $2`
    params.push(unitNumber)
  }

  query += ` ORDER BY unit_number`
  const result = await db.query(query, params)
  return result.rows
}

// Get all topics as flat array for matching
function flattenSyllabus(syllabusRows) {
  const allTopics = []
  syllabusRows.forEach(row => {
    allTopics.push(row.unit_title)
    row.topics.forEach(t => allTopics.push(t))
    if (row.keywords) row.keywords.forEach(k => allTopics.push(k))
  })
  return [...new Set(allTopics)]  // deduplicate
}

module.exports = { getSyllabusContext, flattenSyllabus }

--------------------------------------------------
FILE: services/aiScoring.js
--------------------------------------------------

const Groq = require('groq-sdk')
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Score and explain relevance of each result against syllabus
async function scoreResultsAgainstSyllabus({
  searchQuery,
  syllabusContext,
  youtubeResults,
  gfgResults
}) {
  // Build syllabus text for AI context
  const syllabusText = syllabusContext.map(unit =>
    `Unit ${unit.unit_number}: ${unit.unit_title}\nTopics: ${unit.topics.join(', ')}`
  ).join('\n\n')

  // Build results list for AI
  const ytList = youtubeResults.map((v, i) =>
    `YT_${i}: "${v.title}" by ${v.channelName} (${v.viewCount.toLocaleString()} views)`
  ).join('\n')

  const gfgList = gfgResults.map((a, i) =>
    `GFG_${i}: "${a.title}" - ${a.description}`
  ).join('\n')

  const prompt = `
You are an academic content evaluator for engineering students.

STUDENT SEARCHED FOR: "${searchQuery}"

SYLLABUS CONTEXT (what needs to be covered in this subject):
${syllabusText}

YOUTUBE RESULTS TO EVALUATE:
${ytList}

GFG ARTICLES TO EVALUATE:
${gfgList}

Your task:
1. For each YouTube result (YT_0, YT_1, etc.) assign a relevance score 0-100
2. For each GFG result (GFG_0, GFG_1, etc.) assign a relevance score 0-100
3. For each result, identify WHICH specific syllabus topics it covers
4. Write a 1-sentence explanation of why it's relevant or not
5. Flag any result that seems off-topic or too advanced/basic

Scoring guide:
  90-100: Covers the exact topic perfectly, matches syllabus keywords
  70-89:  Covers the topic well, covers most relevant concepts
  50-69:  Partially relevant, covers some concepts
  30-49:  Loosely related, might have some useful sections
  0-29:   Not relevant for this topic

RESPOND IN THIS EXACT JSON FORMAT:
{
  "youtube": [
    {
      "id": "YT_0",
      "score": 92,
      "matchedTopics": ["SQL Joins", "Natural Join", "Equi Join"],
      "explanation": "Covers all types of SQL joins with examples exactly matching Unit 3 syllabus.",
      "recommended": true,
      "bestFor": "Complete topic coverage"
    }
  ],
  "gfg": [
    {
      "id": "GFG_0",
      "score": 88,
      "matchedTopics": ["SQL Joins"],
      "explanation": "GFG article covers joins with diagrams and practice queries.",
      "recommended": true,
      "bestFor": "Quick reference and examples"
    }
  ],
  "topPick": "YT_0",
  "studyTip": "Watch the top video first, then use GFG article to practice queries."
}
`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are an academic content evaluator. Always respond in valid JSON only.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: 'json_object' }  // Groq supports JSON mode
  })

  const text = response.choices[0].message.content
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI returned invalid JSON')

  return JSON.parse(jsonMatch[0])
}

module.exports = { scoreResultsAgainstSyllabus }

--------------------------------------------------
FILE: routes/lectureSearch.js
--------------------------------------------------

const express = require('express')
const router = express.Router()
const { searchYouTube, getApprovedChannels, parseDuration } = require('../services/youtubeService')
const { searchGFG } = require('../services/gfgService')
const { getSyllabusContext, flattenSyllabus } = require('../services/syllabusService')
const { scoreResultsAgainstSyllabus } = require('../services/aiScoring')
const { checkCache, setCache } = require('../utils/cacheManager')
const authMiddleware = require('../middleware/auth')

// POST /api/lectures/search
// Body: { query, subject, unit (optional) }
router.post('/search', authMiddleware, async (req, res) => {
  const { query, subject, unit } = req.body

  // Validation
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter a topic to search' })
  }
  if (!subject) {
    return res.status(400).json({ error: 'Please select a subject' })
  }

  const cleanQuery = query.trim()
  const cacheKey = `${cleanQuery}:${subject}:${unit || 'all'}`

  try {
    // 1. Check cache first
    const cached = await checkCache(cacheKey)
    if (cached) {
      return res.json({ ...cached, fromCache: true })
    }

    // 2. Get syllabus context for this subject + unit
    const syllabusRows = await getSyllabusContext(subject, unit)

    // 3. Get approved channels filtered by subject
    const channels = await getApprovedChannels(subject)
    if (channels.rows.length === 0) {
      // Fall back to all active channels
      const allChannels = await getApprovedChannels()
      channels.rows = allChannels.rows
    }

    // 4. Search YouTube and GFG in parallel
    // IMPORTANT: searchQuery is ONLY the topic, never "RTU + topic"
    const [ytResults, gfgResults] = await Promise.all([
      searchYouTube(cleanQuery, channels.rows),
      searchGFG(cleanQuery)
    ])

    if (ytResults.length === 0 && gfgResults.length === 0) {
      return res.json({
        results: [],
        message: 'No results found. Try a different search term.',
        query: cleanQuery
      })
    }

    // 5. AI scoring against syllabus
    let scoringResults = null
    if (syllabusRows.length > 0) {
      scoringResults = await scoreResultsAgainstSyllabus({
        searchQuery: cleanQuery,
        syllabusContext: syllabusRows,
        youtubeResults: ytResults.slice(0, 10),  // Max 10 for AI context
        gfgResults: gfgResults.slice(0, 5)
      })
    }

    // 6. Merge scores back into results
    const scoredYT = ytResults.slice(0, 10).map((video, i) => {
      const aiScore = scoringResults?.youtube?.find(s => s.id === `YT_${i}`)
      return {
        ...video,
        duration: parseDuration(video.duration || 'PT0S'),
        relevanceScore: aiScore?.score || 50,
        matchedTopics: aiScore?.matchedTopics || [],
        explanation: aiScore?.explanation || '',
        recommended: aiScore?.recommended || false,
        bestFor: aiScore?.bestFor || '',
        type: 'youtube',
        isTopPick: scoringResults?.topPick === `YT_${i}`
      }
    })

    const scoredGFG = gfgResults.slice(0, 5).map((article, i) => {
      const aiScore = scoringResults?.gfg?.find(s => s.id === `GFG_${i}`)
      return {
        ...article,
        relevanceScore: aiScore?.score || 50,
        matchedTopics: aiScore?.matchedTopics || [],
        explanation: aiScore?.explanation || '',
        recommended: aiScore?.recommended || false,
        bestFor: aiScore?.bestFor || '',
        type: 'gfg'
      }
    })

    // 7. Sort by relevance score descending
    const sortedYT = scoredYT.sort((a, b) => b.relevanceScore - a.relevanceScore)
    const sortedGFG = scoredGFG.sort((a, b) => b.relevanceScore - a.relevanceScore)

    // 8. Filter out low relevance (below 30)
    const filteredYT = sortedYT.filter(v => v.relevanceScore >= 30)
    const filteredGFG = sortedGFG.filter(a => a.relevanceScore >= 30)

    const response = {
      query: cleanQuery,
      subject,
      unit: unit || null,
      youtube: filteredYT,
      gfg: filteredGFG,
      studyTip: scoringResults?.studyTip || null,
      totalResults: filteredYT.length + filteredGFG.length,
      fromCache: false
    }

    // 9. Cache the result for 6 hours
    await setCache(cacheKey, response, 6 * 60 * 60)

    // 10. Log search
    await db.query(
      `INSERT INTO search_history (user_id, query, subject, unit, result_count)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.id, cleanQuery, subject, unit, response.totalResults]
    )

    return res.json(response)

  } catch (err) {
    console.error('Lecture search error:', err)
    return res.status(500).json({ error: 'Search failed. Please try again.' })
  }
})

// GET /api/lectures/subjects
// Returns list of subjects available in syllabus
router.get('/subjects', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT DISTINCT subject_name, subject_code, branch, semester
     FROM rtu_syllabus ORDER BY semester, subject_name`
  )
  res.json(result.rows)
})

// GET /api/lectures/units/:subjectName
// Returns units for a subject
router.get('/units/:subjectName', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT unit_number, unit_title, topics
     FROM rtu_syllabus
     WHERE LOWER(subject_name) ILIKE $1
     ORDER BY unit_number`,
    [`%${req.params.subjectName.toLowerCase()}%`]
  )
  res.json(result.rows)
})

module.exports = router

--------------------------------------------------
FILE: routes/adminChannels.js
--------------------------------------------------

const express = require('express')
const router = express.Router()
const adminAuth = require('../middleware/adminAuth')

// GET /api/admin/channels — list all channels
router.get('/', adminAuth, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM approved_channels ORDER BY priority DESC, channel_name`
  )
  res.json(result.rows)
})

// POST /api/admin/channels — add new channel
router.post('/', adminAuth, async (req, res) => {
  const { channelId, channelName, channelUrl, subjectTags, priority, notes } = req.body

  // Validate YouTube channel exists
  const { google } = require('googleapis')
  const youtube = google.youtube({ version:'v3', auth: process.env.YOUTUBE_API_KEY })
  
  try {
    const channelCheck = await youtube.channels.list({
      part: ['snippet'],
      id: [channelId]
    })
    
    if (!channelCheck.data.items?.length) {
      return res.status(400).json({ error: 'YouTube channel not found. Check channel ID.' })
    }

    const result = await db.query(
      `INSERT INTO approved_channels 
       (channel_id, channel_name, channel_url, subject_tags, priority, notes, added_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [channelId, channelName, channelUrl, subjectTags, priority || 5, notes, req.admin.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/admin/channels/:id — update channel
router.patch('/:id', adminAuth, async (req, res) => {
  const { channelName, subjectTags, priority, isActive, notes } = req.body
  const result = await db.query(
    `UPDATE approved_channels SET
       channel_name = COALESCE($1, channel_name),
       subject_tags = COALESCE($2, subject_tags),
       priority = COALESCE($3, priority),
       is_active = COALESCE($4, is_active),
       notes = COALESCE($5, notes)
     WHERE id = $6 RETURNING *`,
    [channelName, subjectTags, priority, isActive, notes, req.params.id]
  )
  res.json(result.rows[0])
})

// DELETE /api/admin/channels/:id — remove channel
router.delete('/:id', adminAuth, async (req, res) => {
  await db.query('DELETE FROM approved_channels WHERE id = $1', [req.params.id])
  res.json({ success: true })
})

// GET /api/admin/channels/stats — usage stats
router.get('/stats', adminAuth, async (req, res) => {
  const stats = await db.query(`
    SELECT 
      COUNT(DISTINCT search_query) as unique_searches,
      COUNT(*) as total_searches,
      AVG(result_count) as avg_results
    FROM search_history
    WHERE searched_at > NOW() - INTERVAL '7 days'
  `)
  res.json(stats.rows[0])
})

module.exports = router

==========================================
FRONTEND IMPLEMENTATION
==========================================

FILE: src/pages/LectureSearch.jsx

--------------------------------------------------
FULL COMPONENT SPEC
--------------------------------------------------

STATE:
  query          → string (user input)
  subject        → string (selected subject)
  unit           → string (selected unit, optional)
  subjects       → array (from /api/lectures/subjects)
  units          → array (from /api/lectures/units/:subject)
  results        → { youtube:[], gfg:[], studyTip, query }
  loading        → boolean
  error          → string | null
  activeTab      → 'all' | 'youtube' | 'gfg'
  searched       → boolean (has search been done)

--------------------------------------------------
PAGE LAYOUT SPEC
--------------------------------------------------

OUTER WRAPPER:
  min-h-screen bg-cream relative overflow-hidden

CSS BACKGROUND:
  <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none z-0" />
  
  Top-right blob:
  <div className="blob blob-green absolute pointer-events-none z-0"
       style={{ width:400, height:400, right:-100, top:-100, opacity:0.08 }} />

CONTENT:
  max-w-5xl mx-auto px-8 py-12 relative z-10

--------------------------------------------------
HEADER BLOCK
--------------------------------------------------

<motion.div {...fadeUp}>
  
  {/* Pre-label */}
  <span className="inline-flex items-center gap-2
                   bg-green/10 border border-green/25
                   rounded-full px-4 py-1.5 mb-5
                   text-[11px] font-semibold text-green uppercase tracking-[0.1em]">
    <span className="w-1.5 h-1.5 rounded-full bg-green" />
    AI Lecture Finder
  </span>
  
  {/* Headline */}
  <h1 style={{ fontSize:'clamp(36px,4vw,52px)', fontWeight:800,
               letterSpacing:'-0.03em', color:'#1A1A2E', lineHeight:1.1 }}>
    Find the best lecture for
    <br/>
    exactly what you need to study
    <span style={{ color:'#F59E0B' }}>.</span>
  </h1>
  
  {/* Sub */}
  <p style={{ fontSize:18, color:'#6B6B6B', marginTop:12, lineHeight:1.6 }}>
    Searched across{' '}
    <span style={{ color:'#1A1A2E', fontWeight:600 }}>
      {channels.length} curated channels
    </span>
    {' '}— ranked by how well they match your syllabus.
  </p>

</motion.div>

--------------------------------------------------
SEARCH FORM
--------------------------------------------------

<motion.div {...fadeUp} transition={{ delay:0.1 }}
  style={{
    background:'white', borderRadius:20,
    padding:28, marginTop:36,
    border:'1px solid #E8E4DC',
    boxShadow:'0 4px 20px rgba(0,0,0,0.06)'
  }}>

  {/* Row 1: Subject + Unit selectors */}
  <div style={{ display:'flex', gap:12, marginBottom:16 }}>
    
    {/* Subject dropdown */}
    <div style={{ flex:1 }}>
      <label style={{ fontSize:12, fontWeight:600, color:'#9A9A9A',
                      letterSpacing:'0.06em', textTransform:'uppercase',
                      display:'block', marginBottom:6 }}>
        Subject
      </label>
      <select
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value)
          setUnit('')
          fetchUnits(e.target.value)
        }}
        style={{
          width:'100%', padding:'12px 14px',
          border:'1.5px solid #E8E4DC', borderRadius:10,
          fontSize:15, color:'#1A1A2E', background:'#F9F6F1',
          cursor:'pointer', appearance:'none'
        }}>
        <option value="">Select subject...</option>
        {subjects.map(s => (
          <option key={s.subject_code} value={s.subject_name}>
            {s.subject_name} (Sem {s.semester})
          </option>
        ))}
      </select>
    </div>
    
    {/* Unit dropdown — only shows when subject selected */}
    {subject && (
      <div style={{ flex:1 }}>
        <label style={{ fontSize:12, fontWeight:600, color:'#9A9A9A',
                        letterSpacing:'0.06em', textTransform:'uppercase',
                        display:'block', marginBottom:6 }}>
          Unit (Optional)
        </label>
        <select
          value={unit}
          onChange={e => setUnit(e.target.value)}
          style={{
            width:'100%', padding:'12px 14px',
            border:'1.5px solid #E8E4DC', borderRadius:10,
            fontSize:15, color:'#1A1A2E', background:'#F9F6F1',
            cursor:'pointer', appearance:'none'
          }}>
          <option value="">All units</option>
          {units.map(u => (
            <option key={u.unit_number} value={u.unit_number}>
              Unit {u.unit_number}: {u.unit_title}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>

  {/* Row 2: Topic input + Search button */}
  <div style={{ display:'flex', gap:0, alignItems:'stretch' }}>
    
    <div style={{ flex:1, position:'relative' }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        placeholder={
          subject
            ? `Enter topic or unit name from ${subject}...`
            : "Select a subject first, then enter topic..."
        }
        disabled={!subject}
        style={{
          width:'100%', padding:'16px 20px',
          border:'1.5px solid #E8E4DC', borderRight:'none',
          borderRadius:'12px 0 0 12px',
          fontSize:16, color:'#1A1A2E',
          background: subject ? 'white' : '#F9F6F1',
          outline:'none',
          transition:'border-color 200ms'
        }}
        onFocus={e => e.target.style.borderColor = '#7DC67A'}
        onBlur={e => e.target.style.borderColor = '#E8E4DC'}
      />
      {/* Clear button */}
      {query && (
        <button
          onClick={() => setQuery('')}
          style={{
            position:'absolute', right:12, top:'50%',
            transform:'translateY(-50%)',
            width:20, height:20, borderRadius:'50%',
            background:'#E8E4DC', border:'none',
            fontSize:12, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#6B6B6B'
          }}>
          ×
        </button>
      )}
    </div>
    
    <button
      onClick={handleSearch}
      disabled={!query || !subject || loading}
      style={{
        padding:'16px 32px',
        background: (!query || !subject) ? '#E8E4DC' : '#7DC67A',
        color: (!query || !subject) ? '#9A9A9A' : 'white',
        border:'none', borderRadius:'0 12px 12px 0',
        fontSize:16, fontWeight:700, cursor:'pointer',
        transition:'all 150ms',
        display:'flex', alignItems:'center', gap:8,
        minWidth:120
      }}>
      {loading ? (
        <>
          {/* CSS Spinner */}
          <div style={{
            width:16, height:16, borderRadius:'50%',
            border:'2px solid rgba(255,255,255,0.3)',
            borderTopColor:'white',
            animation:'spin 0.8s linear infinite'
          }} />
          Searching
        </>
      ) : (
        <>Find →</>
      )}
    </button>
  </div>

  {/* Quick topic chips — suggested topics based on selected unit */}
  {unit && quickTopics.length > 0 && (
    <div style={{ marginTop:14, display:'flex', flexWrap:'wrap', gap:6 }}>
      <span style={{ fontSize:12, color:'#9A9A9A', alignSelf:'center' }}>
        Quick topics:
      </span>
      {quickTopics.map((topic, i) => (
        <button
          key={i}
          onClick={() => { setQuery(topic); handleSearch(topic) }}
          style={{
            padding:'4px 12px', borderRadius:999,
            border:'1px solid #E8E4DC', background:'#F9F6F1',
            fontSize:13, color:'#1A1A2E', cursor:'pointer',
            transition:'all 150ms'
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = '#7DC67A'
            e.target.style.background = '#F0FAF0'
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = '#E8E4DC'
            e.target.style.background = '#F9F6F1'
          }}>
          {topic}
        </button>
      ))}
    </div>
  )}

</motion.div>

--------------------------------------------------
LOADING STATE
--------------------------------------------------

{loading && (
  <motion.div
    initial={{ opacity:0 }} animate={{ opacity:1 }}
    style={{ textAlign:'center', padding:'60px 0' }}>
    
    {/* CSS animated search illustration */}
    <div style={{ position:'relative', width:80, height:80,
                  margin:'0 auto 24px' }}>
      {/* Spinning ring */}
      <div style={{
        position:'absolute', inset:0,
        borderRadius:'50%',
        border:'3px solid #E8E4DC',
        borderTopColor:'#7DC67A',
        animation:'spin 1s linear infinite'
      }} />
      {/* Inner icon */}
      <div style={{
        position:'absolute', inset:8,
        borderRadius:'50%', background:'#F0FAF0',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:24
      }}>🎯</div>
    </div>
    
    {/* Animated loading steps */}
    <LoadingSteps steps={[
      { text: `Searching across ${channels.length} approved channels...`, delay: 0 },
      { text: 'Checking GeeksForGeeks...', delay: 1500 },
      { text: 'Matching to your syllabus with AI...', delay: 3000 },
      { text: 'Ranking by relevance...', delay: 4500 },
    ]} />
  </motion.div>
)}

LoadingSteps component:
  Each step fades in at its delay
  Current step: white text, bold
  Previous steps: muted, with checkmark ✓
  Shows realistic progress feel

--------------------------------------------------
RESULTS SECTION
--------------------------------------------------

{searched && !loading && (

<motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>

  {/* Results header */}
  <div style={{
    display:'flex', alignItems:'center', justifyContent:'space-between',
    marginTop:40, marginBottom:24
  }}>
    <div>
      <h2 style={{ fontSize:22, fontWeight:700, color:'#1A1A2E' }}>
        Results for "{results.query}"
      </h2>
      <p style={{ fontSize:14, color:'#6B6B6B', marginTop:4 }}>
        Found {results.totalResults} resources ·{' '}
        {results.youtube.length} videos ·{' '}
        {results.gfg.length} articles ·{' '}
        Matched to {subject} syllabus
      </p>
    </div>
    
    {/* Tab filter */}
    <div style={{
      display:'flex', gap:4,
      background:'white', border:'1px solid #E8E4DC',
      borderRadius:10, padding:4
    }}>
      {['all', 'youtube', 'gfg'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            padding:'6px 14px', borderRadius:8,
            border:'none', fontSize:13, fontWeight:500,
            cursor:'pointer', transition:'all 150ms',
            background: activeTab === tab ? '#1A1A2E' : 'transparent',
            color: activeTab === tab ? 'white' : '#6B6B6B'
          }}>
          {tab === 'all' ? 'All' : tab === 'youtube' ? '▶ YouTube' : '📄 GFG'}
        </button>
      ))}
    </div>
  </div>

  {/* AI Study Tip banner */}
  {results.studyTip && (
    <div style={{
      background:'linear-gradient(135deg, #F0FAF0, #E8F5E8)',
      border:'1px solid rgba(125,198,122,0.3)',
      borderRadius:14, padding:'16px 20px',
      marginBottom:24,
      display:'flex', alignItems:'flex-start', gap:12
    }}>
      <div style={{
        width:32, height:32, borderRadius:'50%',
        background:'#7DC67A', flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:16
      }}>✦</div>
      <div>
        <div style={{ fontSize:12, fontWeight:700, color:'#4A9E47',
                      letterSpacing:'0.06em', textTransform:'uppercase',
                      marginBottom:4 }}>
          AI STUDY TIP
        </div>
        <div style={{ fontSize:14, color:'#1A1A2E', lineHeight:1.6 }}>
          {results.studyTip}
        </div>
      </div>
    </div>
  )}

  {/* TOP PICK CARD (if any result is top pick) */}
  {topPick && (
    <TopPickCard video={topPick} />
  )}

  {/* YouTube Results */}
  {(activeTab === 'all' || activeTab === 'youtube') && 
   results.youtube.length > 0 && (
    <div style={{ marginBottom:32 }}>
      <div style={{
        display:'flex', alignItems:'center', gap:8, marginBottom:16
      }}>
        <div style={{
          width:28, height:28, borderRadius:6,
          background:'#EF4444',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:12, color:'white', fontWeight:700
        }}>▶</div>
        <h3 style={{ fontSize:17, fontWeight:700, color:'#1A1A2E' }}>
          YouTube Lectures
        </h3>
        <span style={{
          fontSize:12, fontWeight:600, color:'#7DC67A',
          background:'#F0FAF0', borderRadius:999, padding:'2px 8px'
        }}>
          {results.youtube.length} found
        </span>
      </div>
      
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {results.youtube.map((video, i) => (
          <VideoCard key={video.videoId} video={video} rank={i+1} />
        ))}
      </div>
    </div>
  )}

  {/* GFG Results */}
  {(activeTab === 'all' || activeTab === 'gfg') &&
   results.gfg.length > 0 && (
    <div>
      <div style={{
        display:'flex', alignItems:'center', gap:8, marginBottom:16
      }}>
        <div style={{
          width:28, height:28, borderRadius:6,
          background:'#2F8D46',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:10, color:'white', fontWeight:900
        }}>GFG</div>
        <h3 style={{ fontSize:17, fontWeight:700, color:'#1A1A2E' }}>
          GeeksForGeeks Articles
        </h3>
      </div>
      
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {results.gfg.map((article, i) => (
          <GFGCard key={i} article={article} />
        ))}
      </div>
    </div>
  )}

</motion.div>
)}

--------------------------------------------------
VideoCard COMPONENT
--------------------------------------------------

function VideoCard({ video, rank }) {
  const scoreColor = video.relevanceScore >= 80 ? '#7DC67A'
                   : video.relevanceScore >= 60 ? '#F59E0B'
                   : '#9A9A9A'
  
  const scoreLabel = video.relevanceScore >= 80 ? 'HIGH MATCH'
                   : video.relevanceScore >= 60 ? 'GOOD MATCH'
                   : 'PARTIAL MATCH'

  return (
    <motion.a
      href={video.url} target="_blank" rel="noopener noreferrer"
      whileHover={{ y:-2, boxShadow:'0 8px 24px rgba(0,0,0,0.1)' }}
      style={{
        display:'flex', gap:16,
        background:'white', borderRadius:16,
        padding:20, border:'1.5px solid #E8E4DC',
        textDecoration:'none', color:'inherit',
        transition:'all 200ms',
        position:'relative', overflow:'hidden'
      }}>
      
      {/* Top-pick badge */}
      {video.isTopPick && (
        <div style={{
          position:'absolute', top:0, left:0,
          background:'#F59E0B', color:'white',
          fontSize:10, fontWeight:700,
          padding:'4px 12px', borderRadius:'0 0 8px 0',
          letterSpacing:'0.06em'
        }}>⭐ TOP PICK</div>
      )}
      
      {/* Thumbnail — CSS gradient fallback */}
      <div style={{
        width:140, height:90, borderRadius:10,
        overflow:'hidden', flexShrink:0, position:'relative',
        background:'linear-gradient(135deg, #1A1A2E, #2D2D3F)',
        marginTop: video.isTopPick ? 16 : 0
      }}>
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title}
               style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          /* CSS fallback thumbnail */
          <div style={{
            position:'absolute', inset:0,
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            <div style={{
              width:32, height:32, borderRadius:'50%',
              background:'rgba(239,68,68,0.8)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:14, color:'white', fontWeight:700
            }}>▶</div>
          </div>
        )}
        {/* Duration overlay */}
        <div style={{
          position:'absolute', bottom:4, right:4,
          background:'rgba(0,0,0,0.8)', color:'white',
          fontSize:11, fontWeight:600,
          padding:'2px 6px', borderRadius:4
        }}>{video.duration}</div>
      </div>
      
      {/* Content */}
      <div style={{ flex:1, minWidth:0, marginTop: video.isTopPick ? 16 : 0 }}>
        
        {/* Title */}
        <div style={{
          fontSize:15, fontWeight:600, color:'#1A1A2E',
          lineHeight:1.4, marginBottom:6,
          display:'-webkit-box', WebkitLineClamp:2,
          WebkitBoxOrient:'vertical', overflow:'hidden'
        }}>
          {video.title}
        </div>
        
        {/* Channel + Views row */}
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          fontSize:13, color:'#6B6B6B', marginBottom:8
        }}>
          <span style={{ fontWeight:500 }}>{video.channelName}</span>
          <span>·</span>
          <span>{(video.viewCount / 1000).toFixed(0)}K views</span>
        </div>
        
        {/* Matched topics chips */}
        {video.matchedTopics.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:8 }}>
            {video.matchedTopics.slice(0, 3).map((topic, i) => (
              <span key={i} style={{
                background:'#F0FAF0', color:'#4A9E47',
                border:'1px solid rgba(125,198,122,0.3)',
                borderRadius:999, padding:'2px 8px',
                fontSize:11, fontWeight:600
              }}>
                {topic}
              </span>
            ))}
          </div>
        )}
        
        {/* AI explanation */}
        {video.explanation && (
          <div style={{
            fontSize:13, color:'#6B6B6B',
            lineHeight:1.5
          }}>
            {video.explanation}
          </div>
        )}
      </div>
      
      {/* Relevance score — right side */}
      <div style={{
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        flexShrink:0, minWidth:64,
        marginTop: video.isTopPick ? 16 : 0
      }}>
        {/* Score circle */}
        <div style={{ position:'relative', width:52, height:52 }}>
          <svg width="52" height="52" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="26" cy="26" r="22"
              fill="none" stroke="#E8E4DC" strokeWidth="3" />
            <circle cx="26" cy="26" r="22"
              fill="none" stroke={scoreColor} strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - video.relevanceScore/100)}`}
              strokeLinecap="round" />
          </svg>
          <div style={{
            position:'absolute', inset:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:13, fontWeight:800, color:'#1A1A2E'
          }}>
            {video.relevanceScore}
          </div>
        </div>
        <div style={{
          fontSize:9, fontWeight:700, color:scoreColor,
          textTransform:'uppercase', letterSpacing:'0.04em',
          marginTop:4, textAlign:'center'
        }}>
          {scoreLabel}
        </div>
      </div>
    </motion.a>
  )
}

--------------------------------------------------
GFGCard COMPONENT
--------------------------------------------------

function GFGCard({ article }) {
  return (
    <motion.a
      href={article.url} target="_blank" rel="noopener noreferrer"
      whileHover={{ y:-2, boxShadow:'0 8px 24px rgba(0,0,0,0.08)' }}
      style={{
        display:'block', background:'white',
        borderRadius:14, padding:20,
        border:'1.5px solid #E8E4DC',
        textDecoration:'none', color:'inherit',
        transition:'all 200ms'
      }}>
      
      {/* GFG badge */}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
        <div style={{
          background:'#2F8D46', color:'white',
          fontSize:10, fontWeight:700,
          padding:'3px 8px', borderRadius:6,
          letterSpacing:'0.04em'
        }}>GEEKSFORGEEKS</div>
        
        {/* Score */}
        <div style={{
          fontSize:13, fontWeight:700,
          color: article.relevanceScore >= 70 ? '#7DC67A' : '#F59E0B'
        }}>
          {article.relevanceScore}% match
        </div>
      </div>
      
      {/* Title */}
      <div style={{
        fontSize:15, fontWeight:600, color:'#1A1A2E',
        lineHeight:1.4, marginBottom:8
      }}>
        {article.title}
      </div>
      
      {/* Matched topics */}
      {article.matchedTopics.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
          {article.matchedTopics.slice(0, 2).map((t, i) => (
            <span key={i} style={{
              background:'#F0FAF0', color:'#4A9E47',
              borderRadius:999, padding:'2px 8px',
              fontSize:11, fontWeight:500
            }}>{t}</span>
          ))}
        </div>
      )}
    </motion.a>
  )
}

--------------------------------------------------
EMPTY STATE
--------------------------------------------------

{searched && !loading && results.totalResults === 0 && (
  <div style={{ textAlign:'center', padding:'60px 0' }}>
    
    {/* CSS illustration — empty search */}
    <div style={{
      width:80, height:80, borderRadius:'50%',
      background:'#F9F6F1', border:'2px dashed #E8E4DC',
      margin:'0 auto 20px',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:32
    }}>🔍</div>
    
    <h3 style={{ fontSize:20, fontWeight:700, color:'#1A1A2E', marginBottom:8 }}>
      No lectures found for this topic
    </h3>
    <p style={{ fontSize:15, color:'#6B6B6B', maxWidth:400, margin:'0 auto' }}>
      Try a broader term like "SQL" instead of 
      "Natural Join with Foreign Key", or check 
      if the topic is covered in another unit.
    </p>
    
    {/* Suggested searches */}
    <div style={{ marginTop:20 }}>
      <p style={{ fontSize:13, color:'#9A9A9A', marginBottom:10 }}>Try searching:</p>
      {['SQL Joins', 'Normalization', 'Transactions', 'ER Diagram'].map((s, i) => (
        <button key={i}
          onClick={() => { setQuery(s); handleSearch(s) }}
          style={{
            margin:4, padding:'6px 14px',
            border:'1px solid #E8E4DC', borderRadius:999,
            background:'white', fontSize:13,
            color:'#1A1A2E', cursor:'pointer'
          }}>
          {s}
        </button>
      ))}
    </div>
  </div>
)}

==========================================
ADMIN PORTAL — CHANNEL MANAGEMENT
==========================================

FILE: src/pages/admin/ChannelManager.jsx

PAGE TITLE: "Approved YouTube Channels"
SUB: "These are the only channels MEDHA searches when finding lectures."

LAYOUT:
  Two panels side by side:
  Left (60%): Channels table
  Right (40%): Add/Edit form

LEFT — CHANNELS TABLE:

  Search bar: filter channels by name/subject
  
  Table columns:
  Channel Name | Subject Tags | Priority | Status | Actions
  
  Each row:
  - Channel name with thumbnail avatar
  - Subject tag pills (colored by subject)
  - Priority: 1-10 slider or number badge
  - Status: green "Active" / red "Inactive" toggle switch
  - Actions: Edit | Deactivate | Delete
  
  Priority visual:
  Priority 9-10: amber badge "TOP"
  Priority 7-8:  green badge
  Priority 5-6:  gray badge
  Priority 1-4:  muted

RIGHT — ADD CHANNEL FORM:

  Fields:
  1. YouTube Channel URL or ID
     placeholder: "https://youtube.com/@channelname or UCxxxxxxxxx"
     
     On blur/paste: Auto-fetch channel name + thumbnail from YouTube API
     Show preview: channel avatar + name + subscriber count
     
  2. Subject Tags (multi-select):
     ALL | DBMS | OS | CN | DSA | Algorithms | TOC
     Compiler Design | Engineering Math | Digital Electronics
     Computer Organization | Signals | Control Systems | Mechanics
     
  3. Priority (1-10):
     Slider with labels:
     1-3: Low  4-6: Normal  7-8: High  9-10: Top Priority
     
  4. Notes (optional):
     "Why is this channel good? Any specific topics it covers well?"
     
  Submit: "Add Channel"
  
  VALIDATION:
  - Channel ID must be valid YouTube channel
  - Auto-verify via YouTube API on submit
  - Show error if channel already exists

BOTTOM SECTION — STATS:
  Cards showing:
  - Total active channels: {count}
  - Most searched topic: {topic} ({count} searches)
  - Average results per search: {avg}
  - Searches this week: {count}

==========================================
ENVIRONMENT VARIABLES NEEDED
==========================================

YOUTUBE_API_KEY=your_youtube_data_api_v3_key
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_postgres_connection_string
REDIS_URL=redis://localhost:6379  (or your Redis Cloud URL)

Get YouTube API key:
  → console.developers.google.com
  → Create project → Enable "YouTube Data API v3"
  → Credentials → API Key
  → Restrict to YouTube Data API v3

YouTube API quota note:
  Search API = 100 units per query
  Daily free quota = 10,000 units
  = ~100 searches per day free
  Recommendation: Cache aggressively (6 hours via Redis)

Get Groq API key:
  → console.groq.com
  → Sign up / Login → API Keys → Create new key
  → Model used: llama-3.3-70b-versatile
  → Free tier: 14,400 requests/day, 30 RPM
  → No credit card required

Install Groq SDK:
  npm install groq-sdk

==========================================
COMPLETE USER FLOW
==========================================

STEP 1: Student lands on Lecture Finder tab
  → Sees headline + channel count
  → Form empty, subject dropdown shown

STEP 2: Select subject
  → e.g. "Database Management Systems (Sem 4)"
  → Unit dropdown populates with units 1-6
  → Quick topic chips appear based on selected unit

STEP 3: Optional — select unit
  → e.g. "Unit 3: SQL and Relational Algebra"
  → Quick topic chips update to unit-specific topics
  → e.g. chips: [SQL Joins] [Normalization] [Transactions] [Indexing]

STEP 4: Enter topic or click chip
  → e.g. click "SQL Joins" or type "joins in sql"
  → Search button activates (green)

STEP 5: Click Find → or press Enter
  → Loading animation starts
  → Steps show: "Searching channels..." → "Checking GFG..." → "Matching syllabus..."

STEP 6: Results appear (3-6 seconds total)
  → AI study tip banner at top
  → Top Pick highlighted with amber badge
  → YouTube results with relevance scores
  → GFG articles in 2-column grid
  → Each result shows matched syllabus topics

STEP 7: Student clicks result
  → Opens YouTube in new tab / GFG in new tab
  → Search saved to history

==========================================
COPY — ALL PAGE TEXT
==========================================

PAGE HEADER:
  Pre-label: "AI LECTURE FINDER"
  H1: "Find the best lecture for exactly what you need to study."
  Sub: "Searched across [N] curated channels — ranked by how well they match your syllabus."

FORM LABELS:
  Subject dropdown label:     "Subject"
  Subject placeholder:        "Select subject..."
  Unit dropdown label:        "Unit (Optional)"
  Unit placeholder:           "All units"
  Topic input placeholder:    "Enter topic or unit name from [Subject]..."
  Topic input disabled:       "Select a subject first, then enter topic..."
  Search button:              "Find →"
  Search button loading:      "Searching"
  Quick topics label:         "Quick topics:"

LOADING STEPS:
  Step 1: "Searching across [N] approved channels..."
  Step 2: "Checking GeeksForGeeks..."
  Step 3: "Matching to your syllabus with AI..."
  Step 4: "Ranking by relevance..."

RESULTS HEADER:
  H2: "Results for "{query}""
  Sub: "Found [N] resources · [N] videos · [N] articles · Matched to [Subject] syllabus"

STUDY TIP LABEL: "AI STUDY TIP"

RELEVANCE LABELS:
  90+: "HIGH MATCH"
  70-89: "GOOD MATCH"
  50-69: "PARTIAL MATCH"
  <50: "LOOSELY RELATED"

EMPTY STATE:
  H3: "No lectures found for this topic"
  Sub: "Try a broader term like "SQL" instead of "Natural Join with Foreign Key",
        or check if the topic is covered in another unit."
  Suggestions label: "Try searching:"

ADMIN PAGE:
  H1: "Approved YouTube Channels"
  Sub: "These are the only channels MEDHA searches when finding lectures for students."
  Add form title: "Add New Channel"
  Add button: "Add Channel"
  Notes placeholder: "Why is this channel good? Any specific topics it covers well?"

==========================================
REDIS SETUP
==========================================

Install:
  npm install ioredis

Redis is used for caching search results (6 hours) to save
YouTube API quota and Groq API calls.

--------------------------------------------------
FILE: config/redis.js
--------------------------------------------------

const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) return null  // stop retrying after 3 attempts
    return Math.min(times * 200, 2000)
  },
  lazyConnect: true
})

redis.on('connect', () => console.log('✅ Redis connected'))
redis.on('error', (err) => console.error('❌ Redis error:', err.message))

// Graceful connect — won't crash if Redis is down
async function connectRedis() {
  try {
    await redis.connect()
  } catch (err) {
    console.warn('⚠️  Redis unavailable, falling back to no-cache mode')
  }
}

module.exports = { redis, connectRedis }

--------------------------------------------------
FILE: utils/cacheManager.js
--------------------------------------------------

const { redis } = require('../config/redis')

const CACHE_PREFIX = 'lecture:'

// Check cache — returns parsed JSON or null
async function checkCache(key) {
  try {
    if (redis.status !== 'ready') return null
    const data = await redis.get(CACHE_PREFIX + key)
    return data ? JSON.parse(data) : null
  } catch {
    return null  // fail silently
  }
}

// Set cache with TTL in seconds
async function setCache(key, value, ttlSeconds = 21600) {
  try {
    if (redis.status !== 'ready') return
    await redis.setex(CACHE_PREFIX + key, ttlSeconds, JSON.stringify(value))
  } catch {
    // fail silently — caching is optional
  }
}

// Clear all lecture caches
async function clearCache() {
  try {
    if (redis.status !== 'ready') return
    const keys = await redis.keys(CACHE_PREFIX + '*')
    if (keys.length > 0) await redis.del(...keys)
  } catch {
    // fail silently
  }
}

module.exports = { checkCache, setCache, clearCache }

Startup in server.js:
  const { connectRedis } = require('./config/redis')
  await connectRedis()  // call before app.listen()

Local Redis (Windows):
  Option A: Docker → docker run -d -p 6379:6379 redis:alpine
  Option B: Memurai (Windows native Redis) → https://www.memurai.com
  Option C: Redis Cloud free tier → https://redis.com/try-free/

==========================================
SUMMARY CHECKLIST FOR AGENT
==========================================

Backend:
  □ Create DB tables (approved_channels, rtu_syllabus, lecture_cache, gfg_cache, search_history)
  □ Seed approved_channels with initial channel list above (21 channels incl. new 5)
  □ Seed rtu_syllabus with RTU syllabus data for CSE/ECE/ME subjects
  □ youtubeService.js — search by channelId, NO RTU keyword
  □ gfgService.js — scrape/search GFG articles
  □ aiScoring.js — Groq API (LLaMA 3.3 70B) scores each result vs syllabus
  □ syllabusService.js — lookup syllabus context
  □ config/redis.js — Redis client with graceful fallback
  □ utils/cacheManager.js — Redis-backed 6-hour cache
  □ lectureSearch route — POST /api/lectures/search
  □ lectureSearch route — GET /api/lectures/subjects
  □ lectureSearch route — GET /api/lectures/units/:subject
  □ adminChannels route — full CRUD

Frontend:
  □ LectureSearch.jsx — full page with form + results
  □ VideoCard.jsx — YouTube result card with SVG score circle
  □ GFGCard.jsx — GFG result card
  □ LoadingSteps.jsx — animated loading sequence
  □ TopPickCard.jsx — highlighted top result
  □ Subject + Unit dropdowns wired to API
  □ Quick topic chips from syllabus data
  □ Results tabs: All / YouTube / GFG
  □ AI study tip banner
  □ Empty state with suggestions
  □ All CSS-only visuals, no images

Admin:
  □ ChannelManager.jsx — table + add form
  □ Auto-fetch channel info on URL paste
  □ Subject tag multi-select
  □ Priority slider
  □ Active/Inactive toggle
  □ Stats cards at bottom
==========================================