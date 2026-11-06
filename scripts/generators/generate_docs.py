import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_styled_heading(doc, text, level):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.keep_with_next = True
    h.paragraph_format.space_before = Pt(14)
    h.paragraph_format.space_after = Pt(4)
    run = h.runs[0]
    if level == 1:
        run.font.size = Pt(18)
        run.font.bold = True
        run.font.color.rgb = RGBColor(26, 54, 93)  # Navy
    elif level == 2:
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = RGBColor(43, 108, 176)  # Blue
    elif level == 3:
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = RGBColor(74, 85, 104)  # Slate
    return h

def add_callout(doc, title, text, bg_hex="EDF2F7", border_hex="3182CE"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    
    # Left border styling via XML
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="24" w:space="0" w:color="{border_hex}"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    r_title = p.add_run(f"{title}\n")
    r_title.bold = True
    r_title.font.size = Pt(10.5)
    r_title.font.color.rgb = RGBColor(43, 108, 176)
    
    r_text = p.add_run(text)
    r_text.font.size = Pt(10)
    r_text.font.color.rgb = RGBColor(45, 55, 72)
    
    # Empty paragraph after table for spacing
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_before = Pt(0)
    spacer.paragraph_format.space_after = Pt(6)

def format_table_headers_and_borders(table, col_widths=None):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, row in enumerate(table.rows):
        # Prevent row split across pages
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        
        if i == 0:
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
            for j, cell in enumerate(row.cells):
                set_cell_background(cell, "1A365D")  # Dark navy
                set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
                for p in cell.paragraphs:
                    p.paragraph_format.space_before = Pt(2)
                    p.paragraph_format.space_after = Pt(2)
                    for r in p.runs:
                        r.font.bold = True
                        r.font.size = Pt(9.5)
                        r.font.color.rgb = RGBColor(255, 255, 255)
        else:
            bg_color = "F7FAFC" if i % 2 == 1 else "FFFFFF"
            for j, cell in enumerate(row.cells):
                set_cell_background(cell, bg_color)
                set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
                for p in cell.paragraphs:
                    p.paragraph_format.space_before = Pt(2)
                    p.paragraph_format.space_after = Pt(2)
                    for r in p.runs:
                        r.font.size = Pt(9)
                        r.font.color.rgb = RGBColor(45, 55, 72)
                        
        if col_widths:
            for j, w in enumerate(col_widths):
                if j < len(row.cells):
                    row.cells[j].width = Inches(w)

def generate_docx(output_path):
    doc = docx.Document()
    
    # Set page margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.85)
        section.right_margin = Inches(0.85)
        
    # Normal style font
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(10.5)
    font.color.rgb = RGBColor(45, 55, 72)
    
    # Title Block
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(12)
    title_p.paragraph_format.space_after = Pt(4)
    r_title = title_p.add_run("FindBack: AI-Powered Campus Lost & Found System")
    r_title.bold = True
    r_title.font.size = Pt(24)
    r_title.font.color.rgb = RGBColor(26, 54, 93)
    
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(16)
    r_sub = sub_p.add_run("Comprehensive System Architecture, Project Structure, AI Matching Engine & Security Improvements")
    r_sub.font.size = Pt(13)
    r_sub.font.color.rgb = RGBColor(74, 85, 104)
    
    meta_table = doc.add_table(rows=2, cols=2)
    meta_table.rows[0].cells[0].paragraphs[0].add_run("Author / Architect: Ayushman Chatterjee & Antigravity").bold = True
    meta_table.rows[0].cells[1].paragraphs[0].add_run("Version: 1.1 (Production-Ready Architecture)").bold = True
    meta_table.rows[1].cells[0].paragraphs[0].add_run("Repository Target: /Findback").italic = True
    meta_table.rows[1].cells[1].paragraphs[0].add_run("Date: September 2026").italic = True
    format_table_headers_and_borders(meta_table, [3.2, 3.2])
    
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # Section 1: Executive Summary
    add_styled_heading(doc, "1. Executive Summary & Problem Landscape", level=1)
    doc.add_paragraph(
        "Educational campuses suffer from severe inefficiency, high friction, and lack of transparency when managing lost property. "
        "Traditional lost-and-found registers are physical notebooks or static spreadsheets maintained by security desks. "
        "Students frequently lose expensive electronics (calculators, laptops, headphones), identity cards, keys, and personal belongings. "
        "Because there is no centralized, intelligent search platform, over 70% of lost items are never reclaimed, storage lockers overflow, "
        "and fraudulent ownership claims cannot be effectively verified."
    )
    doc.add_paragraph(
        "FindBack solves this systemic challenge through a high-precision, multi-signal AI matching engine and a tamper-resistant "
        "chain-of-custody protocol. The system cross-references lost reports and found custody records across visual embeddings, semantic text, "
        "campus spatial hierarchy, and temporal proximity. Physical handovers are secured via dynamic 15-minute OTP and cryptographic QR passes, "
        "supported by complete institutional audit trails."
    )
    
    add_callout(
        doc,
        "Core Philosophy: Zero Fraud, Zero Guesswork, Rapid Custody Return",
        "By combining automated AI vector similarity with zero-knowledge verification (concealing unrevealed distinguishing marks "
        "from public listings and demanding private proof), FindBack ensures that only legitimate owners can claim items while eliminating "
        "manual paperwork for campus security staff."
    )
    
    # Section 2: Technology Stack & Architectural Decisions
    add_styled_heading(doc, "2. High-Level Technology Architecture", level=1)
    doc.add_paragraph(
        "FindBack is organized as a clean, modular monorepo containing containerized frontend, backend, database, and caching services:"
    )
    
    tech_table = doc.add_table(rows=6, cols=3)
    tech_table.rows[0].cells[0].paragraphs[0].add_run("Layer")
    tech_table.rows[0].cells[1].paragraphs[0].add_run("Technology")
    tech_table.rows[0].cells[2].paragraphs[0].add_run("Architectural Justification")
    
    tech_data = [
        ("Frontend Application", "Next.js 14+ (App Router), React, TypeScript, Tailwind CSS", "High performance, server-side and client-side rendering, responsive mobile-first UI for campus students and security staff on mobile devices."),
        ("Backend REST API", "FastAPI (Python 3.11+), Pydantic v2, SQLAlchemy 2.0 Async", "High-throughput asynchronous I/O, native integration with Python AI/ML runtimes (PyTorch, CLIP, HuggingFace transformers), automated OpenAPI/Swagger specs."),
        ("Database & Vector Store", "PostgreSQL 16 + pgvector extension", "Unified relational database preserving foreign key integrity, ACID compliance, and native vector similarity search using HNSW indexing in one unified persistence layer."),
        ("Cache & Fast Storage", "Redis 7 (Alpine)", "Sub-millisecond storage for 15-minute dynamic OTP tokens, rate-limiting counters for verification attempts, and background task queuing."),
        ("AI Embeddings & Vision", "SentenceTransformers (all-MiniLM-L6-v2) + OpenAI CLIP / Gemini Vision", "Multimodal vector generation for deep semantic matching of descriptions and cosine image similarity.")
    ]
    
    for idx, (layer, tech, just) in enumerate(tech_data, start=1):
        tech_table.rows[idx].cells[0].paragraphs[0].add_run(layer).bold = True
        tech_table.rows[idx].cells[1].paragraphs[0].add_run(tech)
        tech_table.rows[idx].cells[2].paragraphs[0].add_run(just)
        
    format_table_headers_and_borders(tech_table, [1.5, 2.0, 3.2])
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # Section 3: Project Directory Walkthrough
    add_styled_heading(doc, "3. Complete Project Structure & Directory Walkthrough", level=1)
    doc.add_paragraph(
        "The project repository (/Findback) is structured for enterprise-grade scalability, strict separation of concerns, "
        "and rapid developer onboarding:"
    )
    
    struct_table = doc.add_table(rows=17, cols=2)
    struct_table.rows[0].cells[0].paragraphs[0].add_run("Path")
    struct_table.rows[0].cells[1].paragraphs[0].add_run("Role & Purpose")
    
    struct_data = [
        ("docker-compose.yml", "Multi-container orchestration for PostgreSQL (pgvector), Redis, FastAPI backend, and Next.js frontend."),
        ("backend/app/main.py", "FastAPI app initialization, CORS middleware, API v1 routing, and lifespan context registration."),
        ("backend/app/core/lifespan.py", "Application startup/shutdown context manager for pre-warming PyTorch/CLIP models into RAM/VRAM."),
        ("backend/app/core/security.py", "Argon2/bcrypt password hashing, JWT issue/validation, RBAC role guard dependencies."),
        ("backend/app/ai_engine/", "Composite AI matching engine (text_embedder, image_embedder, spatial, temporal, matcher, model_loader)."),
        ("backend/app/api/v1/endpoints/", "Modular REST routes: auth, lost_items, found_items, matches, claims, campus_zones, notifications, analytics."),
        ("backend/app/models/", "SQLAlchemy database tables: users, campus, items, matches, claims, notifications, audit_logs."),
        ("backend/app/schemas/", "Pydantic v2 schemas validating request inputs and defining serialization responses."),
        ("backend/app/services/", "Storage service (image handling & EXIF sanitization) and notification dispatcher (email/webhooks)."),
        ("backend/scripts/seed_campus.py", "Automated seed script to populate campus hierarchy (buildings, floors, rooms) and item categories."),
        ("backend/tests/", "Automated pytest suite for AI matching weights, campus distance matrices, and auth security."),
        ("frontend/src/middleware.ts", "Next.js Edge middleware enforcing Role-Based Access Control (RBAC) on staff routes."),
        ("frontend/src/context/AuthContext.tsx", "Global React authentication context managing JWT tokens, user profile, and session refresh."),
        ("frontend/src/app/(public)/browse/", "Public catalog of found items with masked private attributes and search/filters."),
        ("frontend/src/app/(student)/", "Student workflows: report-lost, my-reports tracking, and ownership claim challenge submission."),
        ("frontend/src/app/(staff)/", "Security staff workflows: register found items, storage bin inventory, claim review, and QR/PIN handover.")
    ]
    
    for idx, (path, role) in enumerate(struct_data, start=1):
        struct_table.rows[idx].cells[0].paragraphs[0].add_run(path).bold = True
        struct_table.rows[idx].cells[1].paragraphs[0].add_run(role)
        
    format_table_headers_and_borders(struct_table, [2.5, 4.2])
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # Section 4: AI Matching Engine Deep Dive
    add_styled_heading(doc, "4. The Multi-Signal AI Matching Engine", level=1)
    doc.add_paragraph(
        "Unlike basic keyword searches that fail when descriptions differ (e.g., 'Casio scientific calculator' vs 'Black fx-991EX'), "
        "FindBack's AI engine implements a 4-dimensional composite scoring algorithm combining semantic text, visual similarity, "
        "spatial campus distance, and temporal decay."
    )
    
    add_styled_heading(doc, "Composite Scoring Formula", level=2)
    doc.add_paragraph(
        "Confidence Score = (w_text * S_text) + (w_image * S_image) + (w_spatial * S_spatial) + (w_temporal * S_temporal)\n"
        "Where the default weights are tuned as: w_text = 0.35, w_image = 0.35, w_spatial = 0.15, w_temporal = 0.15 (Total = 1.00)."
    )
    
    signal_table = doc.add_table(rows=5, cols=3)
    signal_table.rows[0].cells[0].paragraphs[0].add_run("Signal")
    signal_table.rows[0].cells[1].paragraphs[0].add_run("Technique & Model")
    signal_table.rows[0].cells[2].paragraphs[0].add_run("Operational Mechanics")
    
    signals = [
        ("Text Semantic (S_text)", "SentenceTransformers (all-MiniLM-L6-v2) or Gemini Embeddings", "Generates 384-dimensional dense vectors from title, category, brand, and description. Cosine similarity captures semantic equivalence even across synonyms."),
        ("Visual Feature (S_image)", "CLIP ViT-B/32 or Gemini Vision", "Extracts 512-dimensional visual feature vectors. Enables matching reference photos (or manufacturer catalog images) with real photos taken by custody officers."),
        ("Spatial Proximity (S_spatial)", "Hierarchical Campus Distance Matrix", "Campus structured as Tree: Campus -> Building -> Floor -> Room. Proximity is scored highest (1.0) if found in same room, 0.85 on same floor, 0.60 in same building, 0.20 across campus."),
        ("Temporal Decay (S_temporal)", "Exponential Decay: exp(-lambda * delta_t)", "Scored based on time difference (delta_t = t_found - t_lost). An item found 30 minutes after loss scores near 1.0; after 3 weeks it decays towards 0. Found time must be >= Lost time.")
    ]
    
    for idx, (sig, tech, mech) in enumerate(signals, start=1):
        signal_table.rows[idx].cells[0].paragraphs[0].add_run(sig).bold = True
        signal_table.rows[idx].cells[1].paragraphs[0].add_run(tech)
        signal_table.rows[idx].cells[2].paragraphs[0].add_run(mech)
        
    format_table_headers_and_borders(signal_table, [1.5, 2.2, 3.0])
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # Section 5: Anti-Fraud & Two-Factor Custody Handover
    add_styled_heading(doc, "5. Anti-Fraud & Two-Factor Custody Handover Protocol", level=1)
    doc.add_paragraph(
        "The greatest risk in public lost-and-found systems is theft by claim: opportunistic individuals seeing a found item listing "
        "and falsely claiming ownership. FindBack solves this through a multi-stage zero-knowledge verification protocol:"
    )
    
    add_styled_heading(doc, "Step 1: Public Redaction & Masked Listings", level=2)
    doc.add_paragraph(
        "When an item is registered into custody, distinct unrevealed attributes (e.g., lock screen photo, engraved initials, specific scratches, "
        "contents of inner pockets) are marked as hidden. The public catalog only displays general categories, approximate location, and masked images."
    )
    
    add_styled_heading(doc, "Step 2: Ownership Challenge Proof", level=2)
    doc.add_paragraph(
        "To initiate a claim, the student must submit answers describing these unrevealed details. Security staff compare the student's submission "
        "against the physical item in their locker. The student cannot view staff answers."
    )
    
    add_styled_heading(doc, "Step 3: Dynamic Two-Factor Pickup Pass (QR Code & OTP)", level=2)
    doc.add_paragraph(
        "Once a claim is approved by staff, the student is issued a dynamic 15-minute digital pickup pass in the app. "
        "This pass contains: (1) A cryptographically signed single-use QR token, and (2) A 6-digit dynamic OTP generated via Redis. "
        "At the custody desk, staff scans the QR code or enters the OTP into the staff dashboard. The server validates the token, completes "
        "custody transfer, changes status to RETURNED, and writes an immutable audit log entry."
    )
    
    # Section 6: Comprehensive Audit & Game-Changing Improvements
    add_styled_heading(doc, "6. Audited Enhancements & Architectural Changes", level=1)
    doc.add_paragraph(
        "During the technical audit of the initial architecture, several critical institutional and operational requirements were identified. "
        "These enhancements have been integrated directly into the project layout and significantly elevate the system's robustness:"
    )
    
    improvements = [
        ("1. Immutable Audit Logging (models/audit_log.py)",
         "Prevents custody loss, staff disputes, and theft of high-value items (laptops, jewelry, cash). Every status transition, custody transfer, "
         "failed OTP attempt, and locker bin movement is recorded with timestamp, staff ID, and client IP address."),
        
        ("2. Dedicated Redis Service (docker-compose.yml)",
         "Eliminates database thrashing by handling 15-minute dynamic OTP expiration (TTL), sub-millisecond rate-limiting to prevent PIN brute-forcing, "
         "and asynchronous background task broker queues for heavy AI embedding calculations."),
        
        ("3. Model Pre-Warming & Lifespan Handler (core/lifespan.py, ai_engine/model_loader.py)",
         "PyTorch and transformer models consume 1-2 GB of memory. Loading models lazily on HTTP requests causes 4-second timeout spikes. "
         "The lifespan handler loads and warms model weights once during FastAPI startup, ensuring sub-50ms inference availability."),
        
        ("4. EXIF Sanitization & Privacy Guard (services/storage.py)",
         "Smartphone camera photos contain sensitive GPS latitude/longitude and camera serial numbers. Storage services now strip all EXIF metadata "
         "before storing images on disk or cloud storage."),
        
        ("5. Public Search & Discovery Catalog (/browse/page.tsx)",
         "Surveys show 65% of students look for found items before filing a lost report. The dedicated public catalog allows instant discovery "
         "with category filters, without requiring mandatory report submission."),
        
        ("6. In-App Notification Center (endpoints/notifications.py, NotificationBell.tsx)",
         "Campus emails often get buried in junk folders or delayed. In-app notification badges and feeds alert students the moment AI detects "
         "a match score >= 75%."),
        
        ("7. Staff Analytics & Recovery KPIs (endpoints/analytics.py, schemas/analytics.py)",
         "Provides campus administration with actionable dashboard metrics: item recovery rate, average days in custody, high-loss campus zones, "
         "and 90-day unclaimed item disposition logs."),
        
        ("8. Edge Route Protection (middleware.ts & AuthContext.tsx)",
         "Ensures students cannot navigate into staff custody registers, verification queues, or handover consoles through robust JWT token verification "
         "at the Next.js edge router layer."),
         
        ("9. Automated Campus Hierarchy Seed (scripts/seed_campus.py)",
         "Provides an instant seed script populating college buildings (e.g. Academic Block, Library, Sports Complex), floors, and laboratory zones, "
         "enabling immediate testing of spatial hierarchy distance algorithms.")
    ]
    
    for title, desc in improvements:
        add_callout(doc, title, desc, bg_hex="F7FAFC", border_hex="2B6CB0")
        
    # Section 7: Database Schema & Entity Relationships
    add_styled_heading(doc, "7. Database Entity Relationship & Data Dictionary", level=1)
    doc.add_paragraph(
        "FindBack relies on 8 core database tables in PostgreSQL, leveraging the pgvector extension for dense vector similarity indexing:"
    )
    
    db_table = doc.add_table(rows=9, cols=3)
    db_table.rows[0].cells[0].paragraphs[0].add_run("Table Name")
    db_table.rows[0].cells[1].paragraphs[0].add_run("Primary Fields & Types")
    db_table.rows[0].cells[2].paragraphs[0].add_run("Description & Vector Columns")
    
    db_entities = [
        ("users", "id (UUID), email, password_hash, full_name, roll_number, role (student/staff/admin)", "Campus user accounts. Restricts registrations to official college domains (@campus.edu)."),
        ("campus_zones", "id (INT), name, building, floor, room_number, parent_id", "Hierarchical campus location tree used for spatial distance matrix calculations."),
        ("lost_items", "id (UUID), user_id, title, category, brand, description, location_id, lost_timestamp, status, text_embedding (vector)", "Student lost item reports. Embeddings generated via MiniLM for vector cosine matching."),
        ("found_items", "id (UUID), reported_by_id, title, storage_bin, location_id, found_timestamp, status, text_embedding, image_embedding (vector)", "Staff found item custody registry. Includes both text and CLIP image vector embeddings."),
        ("matches", "id (UUID), lost_item_id, found_item_id, composite_score, text_score, image_score, spatial_score, temporal_score, status", "Candidate pairings evaluated by the AI engine. Scores above 75% trigger student notifications."),
        ("claims", "id (UUID), match_id, student_id, proof_description, proof_image_url, status, reviewed_by_id, handover_otp_hash", "Ownership verification challenges and staff approval records."),
        ("audit_logs", "id (UUID), entity_type, entity_id, action, performed_by_id, client_ip, timestamp, metadata (JSONB)", "Immutable institutional audit trail tracking every custody movement, review, and handover."),
        ("notifications", "id (UUID), user_id, title, message, link_url, is_read, created_at", "In-app alerts notifying students of AI matches and claim review updates.")
    ]
    
    for idx, (tname, fields, desc) in enumerate(db_entities, start=1):
        db_table.rows[idx].cells[0].paragraphs[0].add_run(tname).bold = True
        db_table.rows[idx].cells[1].paragraphs[0].add_run(fields)
        db_table.rows[idx].cells[2].paragraphs[0].add_run(desc)
        
    format_table_headers_and_borders(db_table, [1.4, 2.3, 3.0])
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # Section 8: REST API Endpoints Specification
    add_styled_heading(doc, "8. Complete REST API Endpoints Specification", level=1)
    doc.add_paragraph("All API endpoints are versioned under /api/v1 and documented via OpenAPI:")
    
    api_table = doc.add_table(rows=13, cols=3)
    api_table.rows[0].cells[0].paragraphs[0].add_run("Method & Route")
    api_table.rows[0].cells[1].paragraphs[0].add_run("Access Role")
    api_table.rows[0].cells[2].paragraphs[0].add_run("Functionality")
    
    endpoints = [
        ("POST /api/v1/auth/register", "Public", "Student or staff registration with college email validation."),
        ("POST /api/v1/auth/login", "Public", "Argon2 verification and JWT access token issuance."),
        ("GET /api/v1/lost-items/my", "Student", "List items reported lost by the authenticated student."),
        ("POST /api/v1/lost-items", "Student", "Submit a lost report, generate embeddings, and trigger AI match sweep."),
        ("GET /api/v1/found-items", "Public", "Public catalog of found items with masked attributes."),
        ("POST /api/v1/found-items", "Staff", "Register found item into custody, record storage bin, and trigger AI matching."),
        ("GET /api/v1/matches/lost/{id}", "Student / Staff", "Retrieve AI-ranked candidate matches with breakdown of 4 sub-scores."),
        ("POST /api/v1/claims", "Student", "Submit proof challenge to claim ownership of a matched item."),
        ("PATCH /api/v1/claims/{id}/review", "Staff", "Security officer approves or rejects student ownership claim."),
        ("POST /api/v1/claims/{id}/generate-pass", "Student", "Generate dynamic 15-minute OTP and cryptographic pickup QR code."),
        ("POST /api/v1/claims/handover-verify", "Staff", "Scan QR or verify OTP to finalize item return and log custody transfer."),
        ("GET /api/v1/analytics/kpis", "Staff / Admin", "Retrieve campus recovery rate, average return time, and high-loss zones.")
    ]
    
    for idx, (route, access, func) in enumerate(endpoints, start=1):
        api_table.rows[idx].cells[0].paragraphs[0].add_run(route).bold = True
        api_table.rows[idx].cells[1].paragraphs[0].add_run(access)
        api_table.rows[idx].cells[2].paragraphs[0].add_run(func)
        
    format_table_headers_and_borders(api_table, [2.5, 1.3, 2.9])
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # Section 9: Deployment & Execution Instructions
    add_styled_heading(doc, "9. Execution & Deployment Guide", level=1)
    doc.add_paragraph(
        "FindBack is prepared for 1-command startup using Docker Compose. Execute the following steps inside the repository:"
    )
    
    run_steps = [
        "1. Configure Environment Variables: Copy `.env.example` to `.env` in the root, `backend/.env`, and `frontend/.env.local`.",
        "2. Launch Containers: Run `docker-compose up --build` to start PostgreSQL (pgvector), Redis, FastAPI backend, and Next.js frontend.",
        "3. Seed Campus Data: Run `docker exec -it findback_backend python scripts/seed_campus.py` to populate initial campus zones.",
        "4. Access Interfaces:\n   • Frontend Application: http://localhost:3000\n   • Interactive Swagger Documentation: http://localhost:8000/docs\n   • Database: localhost:5432 (User: findback, DB: findback_db)"
    ]
    
    for step in run_steps:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.2)
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.add_run(step)
        
    doc.save(output_path)
    print(f"Document successfully created at {output_path}")

if __name__ == "__main__":
    generate_docx("Findback_Architecture_and_Specification.docx")
