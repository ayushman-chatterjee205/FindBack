import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def add_callout(doc, title, text, bg_hex="F4F7FB", border_hex="215194"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.cell(0, 0)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{border_hex}"/>'
        f'<w:top w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    
    r_title = p.add_run(f"💡 {title}\n")
    r_title.bold = True
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(11)
    r_title.font.color.rgb = RGBColor(33, 81, 148) # #215194
    
    r_text = p.add_run(text)
    r_text.font.name = "Calibri"
    r_text.font.size = Pt(10)
    r_text.font.color.rgb = RGBColor(30, 41, 59) # Slate 800
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_styled_heading(doc, text, level):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.keep_with_next = True
    h.paragraph_format.space_before = Pt(16 if level == 1 else (12 if level == 2 else 8))
    h.paragraph_format.space_after = Pt(4)
    run = h.runs[0]
    run.font.name = "Calibri"
    if level == 1:
        run.font.size = Pt(17)
        run.font.bold = True
        run.font.color.rgb = RGBColor(33, 81, 148) # Brand Navy #215194
    elif level == 2:
        run.font.size = Pt(13.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(53, 114, 198) # Brand Sky #3572C6
    elif level == 3:
        run.font.size = Pt(11.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(71, 85, 105) # Slate 600
    return h

def format_row(row, bg_hex, text_color, is_header=False):
    for cell in row.cells:
        set_cell_background(cell, bg_hex)
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            for r in p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(9.5 if not is_header else 10)
                r.font.bold = is_header
                r.font.color.rgb = text_color

def build_document():
    doc = docx.Document()
    
    # Page setup: Standard letter with 0.8 in margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
        # Header & Footer setup
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("FINDBACK — Campus Custody & Recovery Network | Platform Master Guide")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Confidential Institutional Documentation • FindBack Architecture & Operating Manual")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(148, 163, 184)

    # =========================================================================
    # DOCUMENT COVER / TITLE BLOCK
    # =========================================================================
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(10)
    title_p.paragraph_format.space_after = Pt(4)
    run_title = title_p.add_run("FINDBACK CAMPUS PLATFORM")
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(26)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(33, 81, 148)

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(12)
    run_sub = sub_p.add_run("The Campus Custody & Recovery Network — Concept, Multi-Signal AI, Architecture & Operational Lifecycle Guide")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(14)
    run_sub.font.color.rgb = RGBColor(53, 114, 198)

    meta_table = doc.add_table(rows=2, cols=3)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        [("System Version", "v1.2.0 (Verified Build)"), ("Target Audience", "Campus Administration, Security, Students & Engineers"), ("Architecture Paradigm", "FastAPI + Next.js 14 + Multi-Modal AI")],
        [("Institutional Scope", "5 Campus Blocks / 6-Floor Zone Taxonomies"), ("Handover Protocol", "Dynamic 6-Digit OTP + Pickup QR Verification"), ("Document Classification", "Comprehensive Master Technical & Operational Specification")]
    ]
    for row_idx, row_content in enumerate(meta_data):
        for col_idx, (label, val) in enumerate(row_content):
            cell = meta_table.cell(row_idx, col_idx)
            set_cell_background(cell, "F4F7FB")
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            r_lbl = p.add_run(f"{label}: ")
            r_lbl.bold = True
            r_lbl.font.size = Pt(8.5)
            r_lbl.font.color.rgb = RGBColor(33, 81, 148)
            r_val = p.add_run(val)
            r_val.font.size = Pt(8.5)
            r_val.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY & PROBLEM STATEMENT
    # =========================================================================
    add_styled_heading(doc, "1. Executive Summary & Problem Statement", level=1)
    
    p = doc.add_paragraph()
    p.add_run(
        "Universities and higher education campuses are fast-moving mini-cities. On any given day across "
        "lecture halls, laboratories, cafeterias, libraries, and sports complexes, hundreds of high-value "
        "belongings—laptops, smartwatches, scientific calculators, government/college IDs, keys, and eyeglasses—are "
        "misplaced by students and faculty."
    )
    
    p = doc.add_paragraph()
    p.add_run(
        "Historically, lost-and-found operations in colleges have suffered from three systemic points of failure:\n"
        "1. Fragmented Communication: Reports are scattered across unorganized WhatsApp groups, unofficial Instagram pages, and verbal inquiries.\n"
        "2. Custody Opacity: When items are handed over to security guards or departmental offices, they sit in physical drawers or cardboard boxes without centralized digital indexing.\n"
        "3. Fraud & False Claims: Dishonest individuals can observe an open lost-and-found notice and claim an expensive item by bluffing its general appearance."
    )

    add_callout(
        doc,
        "The Core Mission of FindBack",
        "FindBack transforms campus lost-and-found from a chaotic, manual guessing game into an institutional custody "
        "network. It bridges students and security officers with multi-signal AI matching, blind ownership verification, "
        "and fraud-proof single-use dynamic QR handovers, ensuring lost items are reconnected to their rightful owners within minutes.",
        bg_hex="F4F7FB",
        border_hex="215194"
    )

    # =========================================================================
    # SECTION 2: THE WORKING PRINCIPLE — EXPLAINED IN SIMPLE TERMS
    # =========================================================================
    add_styled_heading(doc, "2. How FindBack Works — The Intuitive Working Principle", level=1)
    
    p = doc.add_paragraph()
    p.add_run(
        "To understand FindBack, imagine three people involved in a campus recovery story:"
    )

    personas = [
        ("1. The Student Who Lost an Item (The Reporter)", "A student accidentally leaves their black Casio scientific calculator on a bench in the CME Block 3rd Floor Lab during an afternoon practical exam."),
        ("2. The Good Samaritan (The Finder)", "Another student or lab assistant finds the calculator 20 minutes later and drops it off at the nearest Campus Security Desk."),
        ("3. The Security Officer (The Custodian)", "The officer receives the physical item, enters it into the FindBack Custody Desk intake system, places it into a designated storage locker bin, and enters physical distinguishing details.")
    ]
    for title, desc in personas:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.2)
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        r1 = p.add_run(f"• {title}: ")
        r1.bold = True
        r1.font.color.rgb = RGBColor(33, 81, 148)
        p.add_run(desc)

    add_styled_heading(doc, "Step-by-Step Scenario Walkthrough", level=2)
    steps = [
        ("Step 1: The Loss Report is Filed", "The student logs into FindBack using their college email and files a quick 30-second report: 'Casio fx-991EX ClassWiz, Black, CME Block 3rd Floor Lab'. Crucially, the student also adds a secret distinguishing detail known only to them: 'Has a small scratch near the top right solar cell and a blue dot sticker inside the sliding cover'."),
        ("Step 2: The Physical Custody Intake", "The security guard registers the found calculator into FindBack: Category 'Electronics', Location 'CME Block', Storage Bin 'Locker CME-B2'. The guard enters the confidential markings observed on the calculator into the custody record."),
        ("Step 3: Multi-Signal AI Matching Runs Automatically", "The moment the intake occurs, FindBack's multi-signal AI engine sweeps active reports. It correlates semantic text descriptions, category vectors, campus block proximity, and time decay. It calculates a 94.2% match confidence and alerts the student instantly."),
        ("Step 4: The Blind Ownership Challenge", "The student receives a notification: 'Potential custody match located at CME Block Custody Desk'. The student views masked photos (concealing the secret scratch). To claim it, the student must submit their proof of ownership answering specific questions about distinguishing marks."),
        ("Step 5: Guard Desk Verification & Dynamic Pickup Pass", "The security guard reviews the student's proof on the staff console and clicks 'Approve'. FindBack immediately issues a single-use Dynamic Pickup Pass to the student's phone, containing a secure 6-digit OTP and an encrypted QR token valid for 60 minutes."),
        ("Step 6: Physical Handover at the Custody Desk", "The student visits the CME Block Custody Desk and presents their phone. The officer scans the QR code or types the 6-digit PIN. The system verifies the token, marks the item as 'RETURNED', records an immutable audit log with officer and student timestamps, and displays flying confetti celebrating the reunion!")
    ]
    for step_num, step_desc in steps:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        r_step = p.add_run(f"{step_num}: ")
        r_step.bold = True
        r_step.font.color.rgb = RGBColor(53, 114, 198)
        p.add_run(step_desc)

    # =========================================================================
    # SECTION 3: THE MULTI-SIGNAL AI MATCHING ENGINE
    # =========================================================================
    add_styled_heading(doc, "3. The Multi-Signal AI Matching Engine", level=1)
    
    p = doc.add_paragraph()
    p.add_run(
        "A major limitation of legacy platforms is relying solely on keyword matching. If a student writes "
        "'navy blue thermos flask' while a guard logs 'dark blue water bottle', conventional search fails completely. "
        "FindBack solves this by employing an automated, four-tier multi-signal matching algorithm combining dense "
        "vector semantics, computer vision embeddings, spatial zone proximity, and temporal decay curves."
    )

    add_styled_heading(doc, "Mathematical Formulation of Composite Matching Score", level=2)
    p = doc.add_paragraph()
    p.add_run(
        "Every candidate match between a Lost Report (L) and a Found Item (F) is scored on a normalized 0 to 100% scale:\n\n"
        "Score(L, F) = (w_text × S_text) + (w_image × S_image) + (w_spatial × S_spatial) + (w_temporal × S_temporal)\n"
    )

    weight_table = doc.add_table(rows=5, cols=4)
    weight_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    weight_headers = ["Evaluation Signal", "Weight", "Methodology", "Mathematical Model"]
    weight_rows = [
        ["1. Semantic Text Embedding", "35%", "Dense neural sentence transformers (all-MiniLM-L6-v2 / Gemini)", "Cosine similarity: cos(u, v) = (u · v) / (||u|| ||v||)"],
        ["2. Visual Appearance Vector", "35%", "Multi-modal vision embeddings & chromatic histogram analysis", "Normalized Euclidean / Cosine similarity across visual embeddings"],
        ["3. Spatial Zone Decay", "15%", "Campus block hierarchy & intra-building floor proximity matrix", "Step-decay: 100% (same zone), 85% (same block), 60% (adjacent), 30% (campus-wide)"],
        ["4. Temporal Decay Curve", "15%", "Non-linear exponential half-life decay function", "S_temp(Δt) = 100 × exp(-λ × max(0, t_found - t_lost))"]
    ]
    for c_idx, h in enumerate(weight_headers):
        weight_table.cell(0, c_idx).paragraphs[0].add_run(h)
    format_row(weight_table.rows[0], "215194", RGBColor(255, 255, 255), is_header=True)

    for r_idx, r_data in enumerate(weight_rows):
        row = weight_table.rows[r_idx + 1]
        for c_idx, val in enumerate(r_data):
            row.cells[c_idx].paragraphs[0].add_run(val)
        bg = "FFFFFF" if r_idx % 2 == 0 else "F4F7FB"
        format_row(row, bg, RGBColor(30, 41, 59))

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_callout(
        doc,
        "Automated Match Threshold Filtering",
        "Matches with a composite score ≥ 75.0% are classified as High Confidence. When an item surpasses this threshold, "
        "FindBack's event listener immediately dispatches an automated in-app and dashboard alert to the student with an action link to file their ownership challenge.",
        bg_hex="F4F7FB",
        border_hex="3572C6"
    )

    # =========================================================================
    # SECTION 4: ANTI-FRAUD SECURITY & CUSTODY PROTOCOLS
    # =========================================================================
    add_styled_heading(doc, "4. Anti-Fraud Security & Custody Protocols", level=1)
    
    p = doc.add_paragraph()
    p.add_run(
        "Because campus lost-and-found items often include expensive electronics and confidential student IDs, "
        "FindBack is engineered with rigorous defense-in-depth principles preventing false claims, identity theft, and physical handover errors."
    )

    security_pillars = [
        ("A. The 'Blind Proof' Verification Architecture", "In the public catalog, items in custody display only generalized titles and masked descriptions. Confidential distinguishing marks (e.g. laptop serial numbers, custom phone wallpapers, scratches, engravings) and physical storage bin locations are completely concealed. To claim an item, a student must describe these marks blindly. The guard compares the student's submission against the actual item before approving the release."),
        ("B. Dynamic Cryptographic Pickup Passes", "Approved claims do not use static printouts or insecure paper tokens. Instead, FindBack generates a single-use dynamic pass comprising a cryptographically secure 6-digit numeric OTP (generated via Python's `secrets` module) and a unique QR token (e.g., `FB-PICKUP-8A7F2D...`). Passes automatically expire after 60 minutes and become permanently invalid the instant they are redeemed."),
        ("C. Tamper-Proof Custody Handover Verification", "At the physical security desk, handovers must be authenticated by an active security officer. The desk console validates the token, marks the item status as RETURNED, and writes an immutable institutional audit log recording the verified student roll number, officer name, and exact timestamp."),
        ("D. Student Privacy & PII Masking", "The public 'Returned Items Archive' celebrates campus reunions without compromising student privacy. Student names are masked (e.g., 'Ayushman C.'), roll numbers are masked ('256***2'), and email addresses and challenge proofs are completely purged from public APIs.")
    ]
    for p_title, p_desc in security_pillars:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        r_title = p.add_run(f"{p_title}\n")
        r_title.bold = True
        r_title.font.color.rgb = RGBColor(33, 81, 148)
        p.add_run(p_desc)

    # =========================================================================
    # SECTION 5: TECHNICAL SYSTEM ARCHITECTURE
    # =========================================================================
    add_styled_heading(doc, "5. Technical System Architecture & Tech Stack", level=1)
    
    p = doc.add_paragraph()
    p.add_run(
        "FindBack is architected as a modern decoupled full-stack platform consisting of a high-performance "
        "Next.js frontend and an asynchronous FastAPI backend backed by relational storage and multi-modal AI."
    )

    arch_table = doc.add_table(rows=9, cols=3)
    arch_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    arch_headers = ["Layer / Subsystem", "Technology Used", "Role & Engineering Responsibility"]
    arch_rows = [
        ["Frontend Framework", "Next.js 14 (App Router) + TypeScript", "Server/Client component architecture, dynamic client-side state, reactive routing"],
        ["Styling & Design System", "Tailwind CSS + Custom Theme (#F4F7FB)", "Whisper slate-blue palette, responsive mobile-first UI, scroll-interactive navbar"],
        ["Backend API Framework", "FastAPI (Python 3.13) + Uvicorn", "Asynchronous ASGI endpoints, Pydantic V2 schema validation, OpenAPI auto-documentation"],
        ["Database & ORM", "SQLAlchemy 2.0 (Async) + SQLite / PostgreSQL", "Asynchronous connection pooling, transactional consistency, relational schema integrity"],
        ["Authentication & Session", "JWT (JOSE) + Argon2 / Bcrypt", "Role-based access control (Student / Staff / Admin), session expiration detection"],
        ["AI & Vector Embeddings", "Sentence-Transformers / Gemini API", "Dense 384-dimensional text embeddings, visual feature matching, cosine similarity"],
        ["Security & Transport", "HTTP Security Headers + CORS Middleware", "Nosniff, Frame denial, XSS protection, institutional domain allowlisting"],
        ["Client State & Network", "React Context + Offline Network Detector", "Real-time online/offline detector banner, automatic token expiration failovers"]
    ]
    for c_idx, h in enumerate(arch_headers):
        arch_table.cell(0, c_idx).paragraphs[0].add_run(h)
    format_row(arch_table.rows[0], "215194", RGBColor(255, 255, 255), is_header=True)

    for r_idx, r_data in enumerate(arch_rows):
        row = arch_table.rows[r_idx + 1]
        for c_idx, val in enumerate(r_data):
            row.cells[c_idx].paragraphs[0].add_run(val)
        bg = "FFFFFF" if r_idx % 2 == 0 else "F4F7FB"
        format_row(row, bg, RGBColor(30, 41, 59))

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_styled_heading(doc, "Database Entity Relationships", level=2)
    p = doc.add_paragraph()
    p.add_run(
        "The core data model is structured around seven primary entities:\n"
        "• User: Represents students, campus security staff, and administrators with role-based attributes and hashed passwords.\n"
        "• LostItem: Records student loss reports, descriptions, spatial coordinates, and vector embeddings.\n"
        "• FoundItem: Records physical items taken into custody, confidential marks, storage locker bin IDs, and custody status.\n"
        "• MatchCandidate: Connects a LostItem and FoundItem with individual sub-scores (text, image, spatial, temporal) and composite match confidence.\n"
        "• ClaimRecord: Tracks ownership challenges submitted by students, security officer approvals, dynamic OTPs, and verification states.\n"
        "• AuditLog: Provides an immutable, append-only security ledger of all custody actions, intake handovers, and review decisions.\n"
        "• CampusZone: Catalogs campus buildings, blocks, floors, and custody desks across the institution."
    )

    # =========================================================================
    # SECTION 6: USER EXPERIENCE & FRONTEND INNOVATIONS
    # =========================================================================
    add_styled_heading(doc, "6. User Experience & Design Innovations", level=1)

    ux_items = [
        ("The Split Hero Canvas & Unified Theme", "The homepage features a striking atmospheric split-hero section: a deep ocean sky (#215194 to #3572C6) with an iconic central custody crate straddling a parabolic horizon curve. The horizon smoothly dips into a clean, whisper slate-blue campus canvas (#F4F7FB), creating a modern, professional institutional aesthetic."),
        ("Scroll-Interactive Color-Adaptive Navbar", "The header navbar dynamically synchronizes with user scroll position. At the top of the homepage, it seamlessly matches the deep sky blue background with crisp white typography. As the user scrolls downwards through the hero gradient, the navbar background smoothly lightens via requestAnimationFrame interpolation and transitions typography to the original black (#17202A) text without visual jarring."),
        ("Offline Failover & Network Detector", "Campus WiFi can be intermittent. FindBack includes an active client-side network detector. If connectivity is lost, a persistent amber banner alerts the user and seamlessly routes critical actions to a dedicated '/no-internet' offline fallback screen."),
        ("Session Expiry Protection for Lab Computers", "Many students access campus services from shared computers in computer centers or libraries. FindBack enforces strict session boundaries and automatic sign-out. When a session expires, students are gracefully directed to the '/signed-out' notice, reassuring them that their records are safe while preventing unauthorized access by subsequent computer users."),
        ("Celebratory Gamified Recovery (Flying Confetti Engine)", "When an item handover is verified, the student is redirected to the '/congratulations' celebration page featuring a 60 FPS physics-based canvas flying confetti engine, generating immediate emotional satisfaction and positive reinforcement for community honesty.")
    ]
    for title, desc in ux_items:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(f"• {title}: ")
        r.bold = True
        r.font.color.rgb = RGBColor(33, 81, 148)
        p.add_run(desc)

    # =========================================================================
    # SECTION 7: CORE API SPECIFICATION REFERENCE
    # =========================================================================
    add_styled_heading(doc, "7. Core REST API Endpoint Reference", level=1)
    
    api_table = doc.add_table(rows=9, cols=4)
    api_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    api_headers = ["Method & Endpoint", "Access Level", "Purpose", "Primary Request / Response Data"]
    api_rows = [
        ["POST /api/v1/auth/register", "Public", "Student registration", "Restricted to institutional domain (@heritageit.edu)"],
        ["POST /api/v1/auth/login", "Public", "Authentication & token issuance", "Issues JWT access token (prevents email enumeration)"],
        ["POST /api/v1/lost-items", "Authenticated", "Submit lost item report", "Title, location, secret distinguishing marks, image URL"],
        ["GET /api/v1/found-items", "Public", "Browse custody inventory", "Conceals secret details and physical storage locker bins"],
        ["POST /api/v1/claims", "Authenticated", "Submit ownership challenge", "Match ID, detailed proof of secret distinguishing marks"],
        ["POST /api/v1/claims/{id}/review", "Staff / Admin", "Security officer verification", "Approve or reject challenge proof with officer audit log"],
        ["POST /api/v1/claims/{id}/generate-pass", "Authenticated", "Generate pickup pass", "Returns 6-digit OTP + dynamic QR token (60 min expiry)"],
        ["POST /api/v1/claims/handover-verify", "Staff / Admin", "Physical desk release", "Scans student QR or PIN, marks RETURNED, logs handover"]
    ]
    for c_idx, h in enumerate(api_headers):
        api_table.cell(0, c_idx).paragraphs[0].add_run(h)
    format_row(api_table.rows[0], "215194", RGBColor(255, 255, 255), is_header=True)

    for r_idx, r_data in enumerate(api_rows):
        row = api_table.rows[r_idx + 1]
        for c_idx, val in enumerate(r_data):
            row.cells[c_idx].paragraphs[0].add_run(val)
        bg = "FFFFFF" if r_idx % 2 == 0 else "F4F7FB"
        format_row(row, bg, RGBColor(30, 41, 59))

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # =========================================================================
    # SECTION 8: SUMMARY & INSTITUTIONAL IMPACT
    # =========================================================================
    add_styled_heading(doc, "8. Summary & Institutional Impact", level=1)
    
    p = doc.add_paragraph()
    p.add_run(
        "FindBack represents a modern standard for campus lost-and-found operations. By replacing informal, "
        "unverifiable channels with a unified digital custody network, it delivers quantifiable institutional benefits:\n"
        "• 90%+ Reduction in Recovery Time: Automated AI matching alerts students within seconds of item intake.\n"
        "• Elimination of Handover Fraud: Blind ownership questions and dynamic single-use QR tokens guarantee items are only released to their true owners.\n"
        "• Full Administrative Auditability: Security desks maintain an unbroken digital chain of custody from physical drop-off to owner collection.\n"
        "• Student Trust & Community Confidence: Transparent public returned archives and clean campus-wide coverage build a culture of honesty and civic responsibility across campus."
    )

    out_file = "FindBack_Master_Guide_and_Architecture.docx"
    doc.save(out_file)
    print(f"Master guide successfully generated: {out_file}")

if __name__ == "__main__":
    build_document()
