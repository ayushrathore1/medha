=== MEDHA REVISION — AUTH + NOTES COMMUNITY + CHATBOT PLAN ===
Complete Implementation Plan
UI matches Landing Page: cream bg, DM Sans, green/amber accents
=============================================================

=============================================================
PART 1 — LOGIN & SIGNUP PAGES
=============================================================

CURRENT PROBLEMS:
  ❌ Dark bg doesn't match landing page cream theme
  ❌ Generic "Welcome Back" copy
  ❌ No personality, no brand voice
  ❌ Feels like any random SaaS login
  ❌ "your personal knowledge archive awaits" — wrong copy
     students don't think of it that way

=============================================================
LOGIN PAGE SPEC
=============================================================

FILE: src/pages/Login.jsx
ROUTE: /login

FULL PAGE LAYOUT:
  Two column — Left 55% visual | Right 45% form
  Min-height: 100vh
  Background: --cream #F2EDE4

LEFT COLUMN (visual, full height):
  Background: #1A1A2E (dark)
  Position: relative overflow-hidden
  
  CSS BACKGROUND LAYERS:
  
  Layer 1 — Line grid:
  <div className="line-grid absolute inset-0 opacity-50" />
  
  Layer 2 — Green blob top-right:
  <div className="blob blob-green absolute"
       style={{ width:400, height:400, right:-80, top:-80 }} />
  
  Layer 3 — Amber blob bottom-left:
  <div className="blob blob-amber absolute"
       style={{ width:300, height:300, left:-60, bottom:-60 }} />
  
  Layer 4 — Large watermark:
  <div style={{
    position:'absolute', fontSize:200, fontWeight:900,
    color:'rgba(255,255,255,0.02)', letterSpacing:'-0.05em',
    lineHeight:1, bottom:'-5%', left:'-2%',
    userSelect:'none', pointerEvents:'none'
  }}>MEDHA</div>
  
  CONTENT (centered, z-10 relative):
  padding: 60px 48px
  display: flex flex-col justify-between h-full
  
  TOP — Logo:
  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
    <span style={{ fontSize:22, fontWeight:800, color:'white',
                   letterSpacing:'-0.03em' }}>MEDHA</span>
    <span className="logo-dot" style={{
      display:'inline-block', width:8, height:8,
      borderRadius:'50%', background:'#F59E0B'
    }} />
  </div>
  
  MIDDLE — Main message:
  
  Pre-label pill (green):
  "EXAM SEASON IS HERE"
  
  Headline:
  "Stop scrolling."
  "Start studying."
  
  Font: 52px weight-800 white -0.04em line-height 1.0
  Period "." → amber
  
  Sub:
  "The students who pass aren't smarter.
   They just knew what to study."
  16px rgba(255,255,255,0.6) line-height 1.7 max-width 360px
  
  FEATURE PILLS (3 horizontal pills):
  <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:32 }}>
    {[
      { icon:'⚡', text:'AI Note Summaries' },
      { icon:'📄', text:'RTU PYQ Archive' },
      { icon:'🎯', text:'Syllabus-Matched Lectures' },
    ].map((f, i) => (
      <div style={{
        display:'flex', alignItems:'center', gap:6,
        background:'rgba(255,255,255,0.07)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:999, padding:'8px 14px',
        fontSize:13, color:'rgba(255,255,255,0.8)'
      }}>
        <span>{f.icon}</span>
        <span>{f.text}</span>
      </div>
    ))}
  </div>
  
  BOTTOM — Social proof:
  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
    {/* Avatar stack — CSS gradients */}
    <div style={{ display:'flex' }}>
      {[
        { from:'#7DC67A', to:'#4A9E47', text:'RS' },
        { from:'#F59E0B', to:'#D97706', text:'PM' },
        { from:'#8B5CF6', to:'#6D28D9', text:'AK' },
      ].map((a, i) => (
        <div style={{
          width:32, height:32, borderRadius:'50%',
          border:'2px solid #1A1A2E',
          background:`linear-gradient(135deg, ${a.from}, ${a.to})`,
          marginLeft: i===0 ? 0 : -8,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:11, fontWeight:700, color:'white'
        }}>{a.text}</div>
      ))}
    </div>
    <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>
      <span style={{ color:'white', fontWeight:700 }}>149+ students</span>
      {' '}already studying smarter
    </div>
  </div>

RIGHT COLUMN (form):
  Background: --cream #F2EDE4
  Padding: 60px 48px
  Display: flex flex-col justify-center
  
  CSS BACKGROUND:
  <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />
  
  FORM CARD:
  Background: white
  Border-radius: 20px
  Padding: 40px
  Border: 1px solid #E8E4DC
  Box-shadow: 0 4px 24px rgba(0,0,0,0.06)
  Position: relative z-10
  
  TOP OF CARD:
  
  Small logo (mobile only / when left col hidden):
  "MEDHA." — amber dot, 18px weight-800
  
  HEADLINE:
  "Welcome back"
  Font: 28px weight-800 #1A1A2E -0.03em
  
  Sub:
  "Your exam prep is waiting."
  Font: 15px weight-400 #6B6B6B margin-top: 4px
  
  Margin-bottom: 32px
  
  FORM FIELDS:
  
  Field wrapper style (both fields):
  margin-bottom: 16px
  
  Label:
  fontSize: 12px fontWeight: 600 color: #9A9A9A
  letterSpacing: '0.06em' textTransform: 'uppercase'
  display: 'block' marginBottom: 6
  
  Input base style:
  width: '100%' padding: '14px 16px'
  border: '1.5px solid #E8E4DC'
  borderRadius: 12 fontSize: 15
  color: '#1A1A2E' background: '#F9F6F1'
  outline: 'none'
  transition: 'border-color 200ms, box-shadow 200ms'
  
  Input focus style:
  borderColor: '#7DC67A'
  boxShadow: '0 0 0 3px rgba(125,198,122,0.1)'
  background: 'white'
  
  Input error style:
  borderColor: '#EF4444'
  boxShadow: '0 0 0 3px rgba(239,68,68,0.1)'
  
  Field 1 — Email:
  Label: "EMAIL"
  Type: email
  Placeholder: "you@university.edu"
  Left icon: @ symbol in muted gray
  
  Field 2 — Password:
  Label: "PASSWORD"
  Type: password (toggle show/hide)
  Placeholder: "Your password"
  Right icon: 👁 show/hide toggle button
  
  CSS eye icon:
  .eye-icon {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    width: 18px; height: 12px;
    border: 2px solid #9A9A9A; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    cursor: pointer;
  }
  .eye-icon::after {
    content: ''; position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 6px; height: 6px;
    background: #9A9A9A; border-radius: 50%;
  }
  
  FORGOT PASSWORD LINK:
  Align: right
  "Forgot password?" — 13px #7DC67A hover:underline
  Margin-bottom: 24px
  
  SIGN IN BUTTON:
  width: '100%'
  padding: '16px'
  background: '#1A1A2E'
  color: 'white'
  borderRadius: 12
  border: 'none'
  fontSize: 16 fontWeight: 700
  cursor: 'pointer'
  
  className="btn-shine"
  
  Hover: background #2D2D3F + translateY(-1px)
  shadow on hover: 0 8px 20px rgba(26,26,46,0.2)
  
  Loading state: CSS spinner + "Signing in..."
  
  OR DIVIDER:
  <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0' }}>
    <div style={{ flex:1, height:1, background:'#E8E4DC' }} />
    <span style={{ fontSize:12, color:'#9A9A9A', fontWeight:500 }}>OR</span>
    <div style={{ flex:1, height:1, background:'#E8E4DC' }} />
  </div>
  
  GOOGLE SIGN IN:
  width: '100%' padding: '14px'
  background: 'white'
  border: '1.5px solid #E8E4DC'
  borderRadius: 12 fontSize: 15 fontWeight: 500
  color: '#1A1A2E' cursor: 'pointer'
  display: flex items-center justify-center gap-3
  
  Google CSS icon:
  <div style={{ position:'relative', width:18, height:18 }}>
    {/* G letter */}
    <div style={{
      fontSize:14, fontWeight:700,
      background:'linear-gradient(135deg, #4285F4, #34A853, #FBBC04, #EA4335)',
      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
    }}>G</div>
  </div>
  "Continue with Google"
  
  Hover: border-color #7DC67A background #F9F6F1
  
  BOTTOM LINK:
  "New to MEDHA?{' '}
  <Link to="/signup" style={{ color:'#7DC67A', fontWeight:600 }}>
    Create an account
  </Link>"
  Font: 14px #6B6B6B text-align center margin-top: 24px

ERROR STATES:
  Inline error below field:
  <div style={{ display:'flex', alignItems:'center', gap:6,
                fontSize:12, color:'#EF4444', marginTop:6 }}>
    <span>⚠</span>
    <span>{errorMessage}</span>
  </div>
  
  Common errors:
  Wrong password: "Incorrect password. Try again or reset it."
  No account: "No account found with this email."
  Server error: "Something went wrong. Please try again."

=============================================================
SIGNUP PAGE SPEC
=============================================================

FILE: src/pages/Signup.jsx
ROUTE: /signup

SAME LEFT COLUMN as Login BUT:
  Change copy to:
  
  Pre-label: "JOIN 149+ STUDENTS"
  
  Headline:
  "Study smart."
  "Not hard."
  
  Sub:
  "Create your free account and get access to
   AI notes, past papers, and lecture recommendations
   matched to your exact syllabus."

RIGHT COLUMN — FORM CARD:

HEADLINE: "Create your account"
Sub: "Free forever. No credit card needed."
     "Free" → green color

PROGRESS INDICATOR (2 steps):
  Step 1: Account  →  Step 2: Your Details
  
  <div style={{ display:'flex', gap:4, marginBottom:28 }}>
    {[1,2].map(step => (
      <div style={{
        flex:1, height:4, borderRadius:2,
        background: currentStep >= step ? '#7DC67A' : '#E8E4DC',
        transition: 'background 300ms'
      }} />
    ))}
  </div>

STEP 1 — ACCOUNT DETAILS:

  Field 1 — Full Name:
  Label: "FULL NAME"
  Placeholder: "Ayush Rathore"
  
  Field 2 — Email:
  Label: "EMAIL"
  Placeholder: "you@university.edu"
  
  Field 3 — Password:
  Label: "PASSWORD"
  Placeholder: "Min. 8 characters"
  
  Password strength indicator:
  <div style={{ marginTop:8 }}>
    <div style={{ display:'flex', gap:3 }}>
      {[1,2,3,4].map(level => (
        <div style={{
          flex:1, height:3, borderRadius:2,
          background: strength >= level
            ? level <= 1 ? '#EF4444'
              : level <= 2 ? '#F59E0B'
              : '#7DC67A'
            : '#E8E4DC',
          transition:'background 200ms'
        }} />
      ))}
    </div>
    <span style={{ fontSize:11, color:'#9A9A9A', marginTop:4 }}>
      {strengthLabel}  ← Weak / Fair / Strong / Very Strong
    </span>
  </div>
  
  NEXT BUTTON:
  "Continue →"
  Same style as Sign In button (dark)

STEP 2 — YOUR DETAILS (slide in from right):
  Framer: { x:60→0, opacity:0→1, duration:0.4s }

  Field 1 — University/College:
  Label: "COLLEGE"
  Placeholder: "RTU Kota / Poornima College / ..."
  
  Field 2 — Branch:
  Label: "BRANCH"
  Dropdown: CSE | ECE | ME | Civil | IT | AIDS | CSD | CAI
  
  Field 3 — Semester:
  Label: "CURRENT SEMESTER"
  Dropdown: 1st | 2nd | 3rd | 4th | 5th | 6th | 7th | 8th
  
  Why we ask (below fields):
  <div style={{
    background:'#F0FAF0', border:'1px solid rgba(125,198,122,0.3)',
    borderRadius:10, padding:'10px 14px',
    fontSize:12, color:'#4A9E47', lineHeight:1.5,
    marginBottom:20
  }}>
    ✦ We use this to show you the right syllabus, past papers,
      and lecture recommendations for your semester.
  </div>
  
  CREATE ACCOUNT BUTTON:
  "Create My Account →"
  Background: #7DC67A (green — feels positive/celebratory)
  Color: #1A1A2E (dark text on green)
  Same style otherwise
  
  Back link:
  "← Back" — 13px #6B6B6B cursor pointer
  onClick: setCurrentStep(1)

TERMS:
  "By creating an account, you agree to our{' '}
  <a>Terms of Service</a> and <a>Privacy Policy</a>."
  Font: 12px #9A9A9A text-center margin-top: 16px
  Links: color #7DC67A

SUCCESS STATE (after account creation):
  Replace form card with:
  
  <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}}>
    {/* CSS checkmark animation */}
    <div style={{
      width:72, height:72, borderRadius:'50%',
      background:'#F0FAF0', border:'3px solid #7DC67A',
      margin:'0 auto 20px',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:28
    }}>✓</div>
    
    <h2 style={{ fontSize:24, fontWeight:800, textAlign:'center',
                 color:'#1A1A2E', marginBottom:8 }}>
      You're in, {firstName}! 🎉
    </h2>
    <p style={{ fontSize:15, color:'#6B6B6B', textAlign:'center',
                marginBottom:24, lineHeight:1.6 }}>
      Your MEDHA account is ready.
      Setting up your personalized dashboard...
    </p>
    
    {/* Loading bar */}
    <div style={{ height:4, background:'#E8E4DC', borderRadius:2, overflow:'hidden' }}>
      <motion.div
        initial={{ width:0 }} animate={{ width:'100%' }}
        transition={{ duration:2, ease:'easeInOut' }}
        style={{ height:'100%', background:'#7DC67A', borderRadius:2 }}
      />
    </div>
  </motion.div>

MOBILE LAYOUT (< 768px):
  Hide left column entirely
  Show only form card, full width
  Add MEDHA logo at top of form
  Background: cream

=============================================================
PART 2 — NOTES COMMUNITY REDESIGN
=============================================================

CURRENT PROBLEMS:
  ❌ All notes dumped in one grid, no organization
  ❌ "Oops RTU PYQ of 2025" — confusing titles
  ❌ No semester / subject categorization visible
  ❌ Upload process stressful — no clear guidance
  ❌ Find process stressful — no clear filter hierarchy
  ❌ PDF type badge doesn't help with navigation
  ❌ Heart count / like count not useful for students

=============================================================
NOTES COMMUNITY REDESIGN SPEC
=============================================================

FILE: src/pages/NotesCommunity.jsx
ROUTE: /notes

PAGE LAYOUT:
  Background: --cream
  CSS BACKGROUND: dot-grid opacity-30 + grain overlay

------------------------------------------------------------------
SECTION A — HEADER
------------------------------------------------------------------

Left:
  H1: "Notes Community"
  Font: 36px weight-800 #1A1A2E -0.03em
  
  Sub: "Study materials uploaded by students, for students."
  Font: 15px #6B6B6B

Right:
  "+ Share Your Notes" button
  Background: #1A1A2E color: white
  Border-radius: 12px padding: 12px 20px
  Icon: + before text
  className="btn-shine"

Disclaimer banner (below header):
  <div style={{
    background:'#FFF8ED', border:'1px solid rgba(245,158,11,0.3)',
    borderRadius:10, padding:'10px 16px',
    display:'flex', alignItems:'center', gap:8,
    fontSize:13, color:'#92400E', marginTop:16
  }}>
    <span>⚠</span>
    Notes are uploaded by students. 
    MEDHA doesn't own this content. For educational use only.
  </div>

------------------------------------------------------------------
SECTION B — SMART FIND BAR (replaces plain search)
------------------------------------------------------------------

<div style={{
  background:'white', borderRadius:16,
  border:'1px solid #E8E4DC',
  padding:20, marginTop:24,
  boxShadow:'0 4px 20px rgba(0,0,0,0.05)'
}}>

  Row 1 — Filter chips (horizontal scroll, mobile friendly):
  
  SEMESTER ROW:
  Label: "SEMESTER" — 11px uppercase green tracking-wide mb-2
  
  Chips: [All] [1st] [2nd] [3rd] [4th] [5th] [6th] [7th] [8th]
  
  Active chip:
    bg: #1A1A2E color: white border-color: #1A1A2E
  
  Inactive chip:
    bg: white color: #6B6B6B border: 1px solid #E8E4DC
    hover: border-green
  
  Framer layoutId="sem-active" for smooth slide

  Row 2 — Subject chips (appears after semester selected):
  Framer: fade+slide down on semester select
  
  Label: "SUBJECT" — same style
  Chips: dynamically populated based on semester
  e.g. Semester 3 CSE: [All] [OOPs] [Maths-III] [COA] [DSA] [EVS]
  
  Row 3 — Type chips:
  Label: "TYPE"
  Chips: [All Notes] [📄 PYQ Papers] [📝 Handwritten] [💻 Typed] [📊 Diagrams]

  Row 4 — Search input (last, most specific):
  Margin-top: 12px
  
  <div style={{ display:'flex', gap:0 }}>
    <input
      placeholder="Search by topic, chapter, author..."
      style={{
        flex:1, padding:'12px 16px 12px 44px',
        border:'1.5px solid #E8E4DC', borderRight:'none',
        borderRadius:'10px 0 0 10px', fontSize:15,
        background:'#F9F6F1', color:'#1A1A2E', outline:'none'
      }} />
    <button style={{
      padding:'12px 24px',
      background:'#7DC67A', color:'white',
      border:'none', borderRadius:'0 10px 10px 0',
      fontSize:15, fontWeight:700, cursor:'pointer'
    }}>Search</button>
  </div>

</div>

ACTIVE FILTERS STRIP (shows when any filter applied):
  <div style={{ display:'flex', gap:6, marginTop:12, flexWrap:'wrap' }}>
    <span style={{ fontSize:12, color:'#9A9A9A' }}>Filtered by:</span>
    
    {activeFilters.map(filter => (
      <div style={{
        display:'flex', alignItems:'center', gap:4,
        background:'#F0FAF0', border:'1px solid rgba(125,198,122,0.3)',
        borderRadius:999, padding:'3px 10px',
        fontSize:12, color:'#4A9E47', fontWeight:500
      }}>
        {filter.label}
        <button onClick={() => removeFilter(filter)}
          style={{ marginLeft:2, color:'#4A9E47',
                   background:'none', border:'none', cursor:'pointer',
                   fontSize:14, lineHeight:1 }}>×</button>
      </div>
    ))}
    
    <button onClick={clearAll}
      style={{ fontSize:12, color:'#9A9A9A', textDecoration:'underline',
               background:'none', border:'none', cursor:'pointer' }}>
      Clear all
    </button>
  </div>

RESULTS COUNT:
  "Showing 24 notes for 3rd Semester · OOPs"
  Font: 13px #9A9A9A margin-top: 16px margin-bottom: 20px

------------------------------------------------------------------
SECTION C — NOTES GRID
------------------------------------------------------------------

LAYOUT: grid-cols-4 gap-5 (desktop)
        grid-cols-2 gap-4 (tablet)
        grid-cols-1 gap-4 (mobile)

Each NoteCard:

<motion.div
  whileHover={{ y:-3, boxShadow:'0 8px 24px rgba(0,0,0,0.1)' }}
  style={{
    background:'white', borderRadius:16,
    border:'1.5px solid #E8E4DC',
    overflow:'hidden', cursor:'pointer',
    transition:'all 200ms'
  }}
  onClick={() => openNote(note)}>

  {/* TOP — colored thumbnail area */}
  <div style={{
    height:120, position:'relative',
    background: subjectColors[note.subject] || '#F2EDE4',
    display:'flex', alignItems:'center', justifyContent:'center'
  }}>
    
    {/* Subject initial big letter */}
    <div style={{
      fontSize:64, fontWeight:900,
      color:'rgba(26,26,46,0.08)',
      lineHeight:1, userSelect:'none'
    }}>
      {note.subject.slice(0,2).toUpperCase()}
    </div>
    
    {/* File type badge top-left */}
    <div style={{
      position:'absolute', top:10, left:10,
      background: note.type === 'PDF' ? '#EF4444' : '#1A1A2E',
      color:'white', fontSize:10, fontWeight:700,
      padding:'3px 8px', borderRadius:6,
      letterSpacing:'0.04em'
    }}>
      {note.type}
    </div>
    
    {/* Semester badge top-right */}
    <div style={{
      position:'absolute', top:10, right:10,
      background:'rgba(26,26,46,0.6)',
      backdropFilter:'blur(8px)',
      color:'white', fontSize:10, fontWeight:600,
      padding:'3px 8px', borderRadius:6
    }}>
      Sem {note.semester}
    </div>
    
    {/* CSS document icon centered */}
    <div style={{
      position:'absolute',
      width:44, height:54,
      background:'white',
      borderRadius:'0 8px 4px 4px',
      boxShadow:'0 4px 12px rgba(0,0,0,0.12)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:18
    }}>
      {note.type === 'PDF' ? '📄' : '📝'}
      {/* Top-right fold */}
      <div style={{
        position:'absolute', top:0, right:0,
        width:0, height:0,
        borderStyle:'solid',
        borderWidth:'0 10px 10px 0',
        borderColor:`transparent ${subjectColors[note.subject]} transparent transparent`
      }} />
    </div>
  </div>

  {/* BOTTOM — content */}
  <div style={{ padding:'14px 16px' }}>
    
    {/* Subject tag */}
    <div style={{
      display:'inline-flex', alignItems:'center', gap:4,
      background: subjectTagBg[note.subject] || '#F9F6F1',
      border:`1px solid ${subjectTagBorder[note.subject] || '#E8E4DC'}`,
      borderRadius:999, padding:'2px 8px',
      fontSize:11, fontWeight:600,
      color: subjectTagColor[note.subject] || '#6B6B6B',
      marginBottom:8
    }}>
      {note.subject}
    </div>
    
    {/* Title */}
    <div style={{
      fontSize:14, fontWeight:600, color:'#1A1A2E',
      lineHeight:1.4, marginBottom:8,
      display:'-webkit-box', WebkitLineClamp:2,
      WebkitBoxOrient:'vertical', overflow:'hidden'
    }}>
      {note.title}
    </div>
    
    {/* Footer row */}
    <div style={{
      display:'flex', alignItems:'center',
      justifyContent:'space-between',
      fontSize:12, color:'#9A9A9A'
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
        {/* Author avatar */}
        <div style={{
          width:18, height:18, borderRadius:'50%',
          background:'linear-gradient(135deg, #7DC67A, #4A9E47)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:9, fontWeight:700, color:'white'
        }}>
          {note.author.slice(0,1).toUpperCase()}
        </div>
        <span>{note.author}</span>
      </div>
      <span>{formatDate(note.uploadedAt)}</span>
    </div>
  </div>
</motion.div>

SUBJECT COLOR MAP (for card thumbnails):
  OOPs:      { bg:'#E8D2BF', tagBg:'#FFF3E8', tagColor:'#C04A00', tagBorder:'rgba(192,74,0,0.2)' }
  DBMS:      { bg:'#C8DDB8', tagBg:'#F0FAF0', tagColor:'#4A9E47', tagBorder:'rgba(74,158,71,0.2)' }
  DSA:       { bg:'#D2D8D8', tagBg:'#F0F4F4', tagColor:'#3D7A8A', tagBorder:'rgba(61,122,138,0.2)' }
  CN:        { bg:'#E2D4ED', tagBg:'#F5F0FF', tagColor:'#6D28D9', tagBorder:'rgba(109,40,217,0.2)' }
  OS:        { bg:'#FDE68A', tagBg:'#FFFBEB', tagColor:'#B45309', tagBorder:'rgba(180,83,9,0.2)' }
  Math:      { bg:'#BFDBFE', tagBg:'#EFF6FF', tagColor:'#1D4ED8', tagBorder:'rgba(29,78,216,0.2)' }
  default:   { bg:'#F2EDE4', tagBg:'#F9F6F1', tagColor:'#6B6B6B', tagBorder:'#E8E4DC' }

------------------------------------------------------------------
SECTION D — NOTE DETAIL MODAL (replaces current basic modal)
------------------------------------------------------------------

Framer: scale 0.95→1 + opacity 0→1
Overlay: rgba(26,26,46,0.6) backdrop-blur-sm

MODAL:
  max-width: 900px width: 90vw
  background: white borderRadius: 20px
  overflow: hidden
  max-height: 90vh display: flex flex-col

MODAL HEADER:
  padding: 20px 24px
  border-bottom: 1px solid #E8E4DC
  display: flex justify-between align-center
  
  LEFT:
  Subject tag pill (colored)
  Title: 20px weight-700 #1A1A2E margin-top: 6px
  Meta: "by {author} · {date} · {semester} Sem · {subject}"
        13px #9A9A9A
  
  RIGHT:
  Close button (×): 32px circle, hover bg:#F9F6F1
  Download button:
    "⬇ Download PDF"
    bg: #7DC67A color: white
    border-radius: 8px padding: 8px 16px
    font: 13px weight-600
    hover: bg #4A9E47

MODAL BODY:
  flex: 1 overflow: hidden
  display: grid grid-cols-[1fr_280px]
  
  LEFT — PDF viewer:
  <iframe src={note.fileUrl + '#toolbar=0'}
    style={{ width:'100%', height:'100%', border:'none' }} />
  
  RIGHT SIDEBAR:
  padding: 20px
  border-left: 1px solid #E8E4DC
  overflow-y: auto
  
  Section 1 — "About this note":
  bg: #F9F6F1 rounded-xl p-4 mb-4
  
  Stats row:
  "📄 {note.pages} pages"
  "📁 {note.fileSize}"
  "👁 {note.views} views"
  Each: 13px #6B6B6B
  
  Section 2 — AI Summary (PREMIUM feature):
  bg: #1A1A2E rounded-xl p-4 mb-4
  
  Header: "✦ AI Summary" — 12px green uppercase
  
  If user is premium:
    3-4 bullet points summarizing the note
    font: 13px rgba(255,255,255,0.8)
  
  If free user:
    "Unlock AI summaries of any note"
    [Join Premium →] amber button
  
  Section 3 — Related notes:
  "From same subject" header — 12px uppercase #9A9A9A
  3 small related note cards (horizontal, compact)

------------------------------------------------------------------
SECTION E — UPLOAD FLOW (eliminates stress)
------------------------------------------------------------------

TRIGGER: "+ Share Your Notes" button

UPLOAD MODAL — 3 step wizard:

STEP INDICATOR (top of modal):
  3 dots connected by line
  Active: filled green circle
  Done: green with ✓
  Pending: empty circle with number

STEP 1 — "What are you uploading?":
  Headline: "What are you sharing?"
  Sub: "This helps students find your note faster."
  
  Field 1 — Title:
  Label: "NOTE TITLE"
  Placeholder: "e.g. OOPs Unit 3 — Inheritance Notes"
  Helper: "Be specific — include subject + topic"
  
  Field 2 — Semester:
  Label: "SEMESTER"
  Big visual selector (not dropdown) — 2-row grid of semester buttons:
  [1st] [2nd] [3rd] [4th]
  [5th] [6th] [7th] [8th]
  Each: 60px x 40px card, border, rounded-lg
  Active: bg #1A1A2E text white
  
  Field 3 — Subject:
  Auto-populated based on semester selection
  Same visual button grid style
  
  Field 4 — Note Type:
  Label: "TYPE"
  Visual cards (not dropdown):
  [📄 PYQ Paper] [📝 Handwritten Notes] [💻 Typed Notes] [📊 Diagrams]
  Each: small card with icon + label
  Active: green border + bg #F0FAF0

STEP 2 — "Upload your file":
  
  Drop zone:
  <div style={{
    border:'2px dashed #E8E4DC', borderRadius:16,
    padding:'48px 32px', textAlign:'center',
    background:'#F9F6F1',
    transition:'all 200ms'
  }}
  onDragOver → border-color: #7DC67A bg: #F0FAF0
  >
    {/* CSS upload icon */}
    <div style={{
      width:64, height:64, borderRadius:'50%',
      background:'white', border:'2px solid #E8E4DC',
      margin:'0 auto 16px',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:24
    }}>⬆</div>
    
    <div style={{ fontSize:16, fontWeight:600, color:'#1A1A2E', marginBottom:6 }}>
      Drop your file here
    </div>
    <div style={{ fontSize:13, color:'#9A9A9A', marginBottom:20 }}>
      or click to browse
    </div>
    
    <button style={{
      background:'#1A1A2E', color:'white',
      borderRadius:10, padding:'10px 24px',
      fontSize:14, fontWeight:600, border:'none', cursor:'pointer'
    }}>Browse Files</button>
    
    <div style={{ fontSize:12, color:'#9A9A9A', marginTop:12 }}>
      PDF, JPG, PNG · Max 10MB
    </div>
  </div>
  
  UPLOAD PROGRESS (after file selected):
  File name + size row
  Progress bar: 0→100% green fill
  "Uploading... 67%" text

STEP 3 — "Almost done!":
  Preview thumbnail of uploaded file
  
  Optional description:
  Label: "ADD CONTEXT (OPTIONAL)"
  Placeholder: "e.g. This covers Unit 3 and 4 of OOPs. Includes examples."
  
  Checkboxes:
  ☑ I have the right to share this material
  ☑ This is for educational purposes only
  
  SUBMIT: "Share with community →"
  bg: #7DC67A color: #1A1A2E font: weight-700

=============================================================
PART 3 — CHATBOT WITH VERCEL AI SDK
=============================================================

CURRENT STATE:
  Using Groq AI + custom implementation
  Positioned as floating bubble bottom-right
  

RECOMMENDATION: USE VERCEL AI SDK
Reasons:
  → useChat hook handles streaming out of the box
  → Works perfectly with Next.js/Vite
  → Built-in loading/error states
  → Streaming responses feel much more alive
  → Easier to add tools (web search, note search)
  → Drop-in replacement for current implementation

INSTALL:
  npm install ai @ai-sdk/openai @ai-sdk/anthropic

BACKEND — api/chat.js (Vercel serverless function or Express route):

import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function POST(req) {
  const { messages, userContext } = await req.json()

  const result = await streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: `You are MEDHA, an AI study assistant built for RTU engineering students.
    
    Student context:
    - Branch: ${userContext.branch}
    - Current semester: ${userContext.semester}
    - Current subjects: ${userContext.subjects?.join(', ')}
    - Nearest exam: ${userContext.nextExam || 'not set'}
    
    Your personality:
    - You speak like a smart senior student, not a formal tutor
    - You are direct, concise, exam-focused
    - You know RTU syllabus well
    - You give 5-min explanations, not 50-minute lectures
    - You always relate answers to what's likely in the exam
    - You use simple analogies for complex concepts
    - You occasionally use Hindi words naturally (bhai, yaar, chal)
    
    Your capabilities:
    - Explain any engineering concept simply
    - Tell which topics are important for RTU exams
    - Help with past paper questions
    - Suggest what to study when time is limited
    - Compare topics to syllabus weightage
    
    IMPORTANT:
    - Keep answers under 200 words unless asked for more
    - Always end with "Want me to explain this with an example?" for concept questions
    - For urgent study situations (exam in X hours), prioritize ruthlessly`,
    messages,
    maxTokens: 1000,
  })

  return result.toDataStreamResponse()
}

FRONTEND — ChatWidget.jsx:

import { useChat } from 'ai/react'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      userContext: {
        branch: user.branch,
        semester: user.semester,
        subjects: user.subjects,
        nextExam: user.nextExam
      }
    },
    initialMessages: [{
      id: 'welcome',
      role: 'assistant',
      content: `Hey! I'm MEDHA. What do you need to understand right now?`
    }]
  })

  return (
    <>
      {/* TRIGGER BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale:1.05 }}
        whileTap={{ scale:0.95 }}
        style={{
          position:'fixed', bottom:24, right:24,
          width:52, height:52, borderRadius:'50%',
          background:'#1A1A2E',
          border:'2px solid rgba(125,198,122,0.4)',
          boxShadow:'0 8px 24px rgba(26,26,46,0.3)',
          cursor:'pointer', zIndex:1000,
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
        {isOpen ? (
          <span style={{ color:'white', fontSize:18 }}>×</span>
        ) : (
          /* CSS brain icon */
          <div style={{
            width:24, height:24,
            background:'linear-gradient(135deg, #7DC67A, #8B5CF6)',
            borderRadius:6,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14
          }}>M</div>
        )}
        
        {/* Unread dot */}
        {!isOpen && hasUnread && (
          <div style={{
            position:'absolute', top:0, right:0,
            width:12, height:12, borderRadius:'50%',
            background:'#EF4444',
            border:'2px solid white'
          }} />
        )}
      </motion.button>

      {/* CHAT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity:0, scale:0.9, y:20 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.9, y:20 }}
            transition={{ duration:0.2, ease:[0.16,1,0.3,1] }}
            style={{
              position:'fixed', bottom:88, right:24,
              width:360, height:520,
              background:'white',
              borderRadius:20,
              border:'1px solid #E8E4DC',
              boxShadow:'0 20px 60px rgba(0,0,0,0.15)',
              display:'flex', flexDirection:'column',
              overflow:'hidden', zIndex:999
            }}>

            {/* HEADER */}
            <div style={{
              padding:'16px 20px',
              background:'#1A1A2E',
              display:'flex', alignItems:'center', gap:10
            }}>
              <div style={{
                width:36, height:36, borderRadius:10,
                background:'linear-gradient(135deg, #7DC67A, #8B5CF6)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:16, fontWeight:800, color:'white'
              }}>M</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'white' }}>
                  MEDHA AI
                </div>
                <div style={{
                  fontSize:11, color:'#7DC67A',
                  display:'flex', alignItems:'center', gap:4
                }}>
                  <span className="pulse-dot" style={{ width:6, height:6 }} />
                  Ready to help
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  marginLeft:'auto', background:'none', border:'none',
                  color:'rgba(255,255,255,0.5)', fontSize:18, cursor:'pointer'
                }}>×</button>
            </div>

            {/* MESSAGES */}
            <div style={{
              flex:1, overflowY:'auto', padding:'16px',
              display:'flex', flexDirection:'column', gap:10
            }}>
              
              {/* Welcome state (no messages yet) */}
              {messages.length <= 1 && (
                <div style={{ padding:'8px 0' }}>
                  
                  {/* Suggested prompts */}
                  <div style={{
                    fontSize:11, fontWeight:600, color:'#9A9A9A',
                    textTransform:'uppercase', letterSpacing:'0.06em',
                    marginBottom:8
                  }}>TRY ASKING</div>
                  
                  {[
                    "What should I study for DBMS tomorrow?",
                    "Explain SQL joins simply",
                    "Which units are most important in OS?",
                    "I have 3 hours, what to focus on?",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        handleInputChange({ target:{ value:prompt } })
                        setTimeout(() => handleSubmit(), 100)
                      }}
                      style={{
                        display:'block', width:'100%',
                        textAlign:'left', padding:'10px 12px',
                        background:'#F9F6F1', border:'1px solid #E8E4DC',
                        borderRadius:10, fontSize:13, color:'#1A1A2E',
                        cursor:'pointer', marginBottom:6,
                        transition:'all 150ms'
                      }}
                      onMouseEnter={e => {
                        e.target.style.borderColor='#7DC67A'
                        e.target.style.background='#F0FAF0'
                      }}
                      onMouseLeave={e => {
                        e.target.style.borderColor='#E8E4DC'
                        e.target.style.background='#F9F6F1'
                      }}>
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Message bubbles */}
              {messages.map(message => (
                <div key={message.id}
                  style={{
                    display:'flex',
                    justifyContent: message.role==='user' ? 'flex-end' : 'flex-start'
                  }}>
                  
                  {/* AI avatar (assistant only) */}
                  {message.role === 'assistant' && (
                    <div style={{
                      width:24, height:24, borderRadius:6,
                      background:'linear-gradient(135deg, #7DC67A, #8B5CF6)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10, fontWeight:800, color:'white',
                      marginRight:6, flexShrink:0, marginTop:2
                    }}>M</div>
                  )}
                  
                  <div style={{
                    maxWidth:'80%',
                    padding:'10px 14px',
                    borderRadius: message.role==='user'
                      ? '14px 14px 4px 14px'
                      : '14px 14px 14px 4px',
                    background: message.role==='user'
                      ? '#1A1A2E'
                      : '#F9F6F1',
                    color: message.role==='user' ? 'white' : '#1A1A2E',
                    fontSize:14, lineHeight:1.6
                  }}>
                    {/* Render markdown-light: bold, bullets */}
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div style={{ display:'flex', gap:4, padding:'6px 0' }}>
                  <div style={{
                    width:24, height:24, borderRadius:6,
                    background:'linear-gradient(135deg, #7DC67A, #8B5CF6)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:10, fontWeight:800, color:'white',
                    marginRight:6
                  }}>M</div>
                  <div style={{
                    background:'#F9F6F1', borderRadius:'14px 14px 14px 4px',
                    padding:'12px 16px', display:'flex', gap:4
                  }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width:6, height:6, borderRadius:'50%',
                        background:'#9A9A9A',
                        animation:`dot-breathe 1.2s ease-in-out ${i*0.2}s infinite`
                      }} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div style={{
              padding:'12px 16px',
              borderTop:'1px solid #E8E4DC',
              background:'white'
            }}>
              <form onSubmit={handleSubmit}
                style={{ display:'flex', gap:8 }}>
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask anything..."
                  style={{
                    flex:1, padding:'10px 14px',
                    border:'1.5px solid #E8E4DC',
                    borderRadius:10, fontSize:14,
                    outline:'none', color:'#1A1A2E',
                    background:'#F9F6F1',
                    transition:'border-color 200ms'
                  }}
                  onFocus={e => e.target.style.borderColor='#7DC67A'}
                  onBlur={e => e.target.style.borderColor='#E8E4DC'}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  style={{
                    width:40, height:40, borderRadius:10,
                    background: input.trim() ? '#7DC67A' : '#E8E4DC',
                    border:'none', cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all 150ms', flexShrink:0
                  }}>
                  <span style={{
                    fontSize:16, color: input.trim() ? 'white' : '#9A9A9A'
                  }}>→</span>
                </button>
              </form>
              <div style={{
                fontSize:10, color:'#9A9A9A',
                textAlign:'center', marginTop:6
              }}>
                Press Enter · Powered by Claude AI
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

=============================================================
WHERE TO PLACE THE CHATBOT
=============================================================

PLACEMENT: Bottom-right corner, fixed position, ALL pages
z-index: 999 (above everything except modals which are 1000+)

CONTEXT-AWARE BEHAVIOR (based on current page):

On /dashboard:
  initialMessage: "Hey {name}! Exam in {X} days. 
                   What do you want to understand today?"

On /notes (Notes Community):
  Show quick prompt: "Summarize this note" when a note is open
  Auto-inject note content as context when PDF is open

On /exams (PYQ Archive):
  Show quick prompt: "Explain this question"
  When user opens a paper, offer "Break down this paper"

On /recommendations (Lecture Finder):
  Show quick prompt: "I don't understand what was in this video"
  Context: current search query

On /visualizations:
  Show quick prompt: "Explain this concept in text"
  Context: current visualization topic

On /login and /signup:
  HIDE the chatbot entirely
  Don't distract from conversion

CHATBOT TRIGGER VARIATIONS:
  Default: Brain icon M in gradient circle
  
  Context nudge (appears after 30s on any page if not opened):
  Subtle "bubble" above button:
  "Need help with {current subject}?" 
  Appears, waits 4s, auto-dismisses
  User can click to open chat with that as first message

=============================================================
IMPLEMENTATION CHECKLIST FOR AGENT
=============================================================

AUTH PAGES:
  □ Login.jsx — two column, dark left + cream right form
  □ Signup.jsx — same layout, 2-step form with progress bar
  □ Password strength indicator CSS
  □ Google OAuth button CSS
  □ Error states inline
  □ Success animation after signup
  □ Mobile: hide left column, cream bg full width

NOTES COMMUNITY:
  □ NotesCommunity.jsx — smart find bar replaces plain search
  □ Semester → Subject → Type → Search filter hierarchy
  □ Active filters strip with remove chips
  □ 4-col grid with colored subject thumbnails
  □ NoteCard.jsx — colored thumbnail + subject tag
  □ NoteDetailModal.jsx — PDF viewer + sidebar + AI summary
  □ UploadWizard.jsx — 3-step, visual selectors not dropdowns
  □ Subject color map system

CHATBOT:
  □ Install: npm install ai @ai-sdk/anthropic
  □ Backend: POST /api/chat with streamText
  □ System prompt with student context injection
  □ ChatWidget.jsx with useChat hook
  □ Streaming messages rendering
  □ Suggested prompts on empty state
  □ Context-aware per page
  □ Hide on /login and /signup
  □ Context nudge bubble after 30s
  □ ReactMarkdown for response formatting