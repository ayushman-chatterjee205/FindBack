import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# Color Palette Constants
NAVY = RGBColor(33, 81, 148)       # #215194 Primary Brand
SKY = RGBColor(53, 114, 198)       # #3572C6 Accent Sky
EMERALD = RGBColor(16, 185, 129)   # #10B981 Success Green
DARK_TEXT = RGBColor(15, 23, 42)   # #0F172A Slate 900
BODY_TEXT = RGBColor(51, 65, 85)   # #334155 Slate 700
MUTED = RGBColor(100, 116, 139)    # #64748B Slate 500
CANVAS_BG = RGBColor(244, 247, 251)# #F4F7FB Whisper Canvas
BG_TINT = RGBColor(244, 247, 251)  # #F4F7FB Card alternate
WHITE = RGBColor(255, 255, 255)
BORDER_COLOR = RGBColor(226, 232, 240)
CARD_BG = RGBColor(255, 255, 255)

def create_blank_slide(prs, bg_color=CANVAS_BG):
    blank_slide_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_slide_layout)
    
    # Background fill
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = bg_color
    bg.line.fill.background()
    return slide

def add_header(slide, title_text, category_text="CAMPUS RECOVERY NETWORK"):
    # Category Pill
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(2.6), Inches(0.32))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(224, 242, 254) # Light Sky Tint
    pill.line.fill.background()
    tf_p = pill.text_frame
    tf_p.word_wrap = True
    p_p = tf_p.paragraphs[0]
    p_p.alignment = PP_ALIGN.CENTER
    r_p = p_p.add_run()
    r_p.text = category_text.upper()
    r_p.font.name = "Calibri"
    r_p.font.size = Pt(9)
    r_p.font.bold = True
    r_p.font.color.rgb = NAVY

    # Title
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.5), Inches(0.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = title_text
    r.font.name = "Calibri"
    r.font.size = Pt(22)
    r.font.bold = True
    r.font.color.rgb = NAVY

    # Divider Line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.73), Inches(0.02))
    line.fill.solid()
    line.fill.fore_color.rgb = BORDER_COLOR
    line.line.fill.background()

def add_footer(slide, current_idx, total_count=13):
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(11.73), Inches(0.35))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = f"FINDBACK: The Campus Custody & Recovery Network • Heritage Institute of Technology"
    p.font.name = "Calibri"
    p.font.size = Pt(8.5)
    p.font.color.rgb = MUTED

    p2 = tf.add_paragraph()
    p2.alignment = PP_ALIGN.RIGHT
    p2.text = f"Slide {current_idx} of {total_count}"
    p2.font.name = "Calibri"
    p2.font.size = Pt(8.5)
    p2.font.color.rgb = MUTED

def add_card(slide, left, top, width, height, title, subtitle=None, bg_color=CARD_BG, border_color=BORDER_COLOR):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1)

    tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), height - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.space_after = Pt(4)
    r_title = p.add_run()
    r_title.text = title
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(13)
    r_title.font.bold = True
    r_title.font.color.rgb = NAVY

    if subtitle:
        p_sub = tf.add_paragraph()
        p_sub.space_after = Pt(6)
        r_sub = p_sub.add_run()
        r_sub.text = subtitle
        r_sub.font.name = "Calibri"
        r_sub.font.size = Pt(9.5)
        r_sub.font.color.rgb = MUTED

    return tf

def build_presentation(output_path="FindBack_Project_Presentation.pptx"):
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # =========================================================================
    # SLIDE 1: TITLE SLIDE (Cover / Hero)
    # =========================================================================
    s1 = create_blank_slide(prs, bg_color=NAVY)
    
    # Decorative upper sky banner
    sky_band = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(0), Inches(13.333), Inches(0.2))
    sky_band.fill.solid()
    sky_band.fill.fore_color.rgb = SKY
    sky_band.line.fill.background()

    # Center Brand Badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.66), Inches(1.3), Inches(4.0), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(255, 255, 255)
    badge.line.fill.background()
    p_b = badge.text_frame.paragraphs[0]
    p_b.alignment = PP_ALIGN.CENTER
    r_b = p_b.add_run()
    r_b.text = "THE CAMPUS CUSTODY & RECOVERY NETWORK"
    r_b.font.name = "Calibri"
    r_b.font.size = Pt(10)
    r_b.font.bold = True
    r_b.font.color.rgb = NAVY

    # Hero Title Text Box
    tb_t = s1.shapes.add_textbox(Inches(1.0), Inches(1.9), Inches(11.333), Inches(2.2))
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True
    
    p1 = tf_t.paragraphs[0]
    p1.alignment = PP_ALIGN.CENTER
    r1 = p1.add_run()
    r1.text = "FINDBACK"
    r1.font.name = "Calibri"
    r1.font.size = Pt(50)
    r1.font.bold = True
    r1.font.color.rgb = WHITE

    p2 = tf_t.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    r2 = p2.add_run()
    r2.text = "Automated Multi-Signal AI Matching & Anti-Fraud Dynamic QR Custody Handovers"
    r2.font.name = "Calibri"
    r2.font.size = Pt(18)
    r2.font.color.rgb = RGBColor(186, 230, 253) # Light Sky Text

    # Metadata Card at Bottom
    card_meta = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.0), Inches(4.6), Inches(9.333), Inches(1.8))
    card_meta.fill.solid()
    card_meta.fill.fore_color.rgb = RGBColor(255, 255, 255)
    card_meta.line.fill.background()
    
    tf_m = card_meta.text_frame
    tf_m.word_wrap = True
    
    p_m1 = tf_m.paragraphs[0]
    p_m1.alignment = PP_ALIGN.CENTER
    r_m1 = p_m1.add_run()
    r_m1.text = "Lead Architect & Developer: Ayushman Chatterjee (Roll: 2563002)\n"
    r_m1.font.name = "Calibri"
    r_m1.font.size = Pt(13)
    r_m1.font.bold = True
    r_m1.font.color.rgb = NAVY

    p_m2 = tf_m.add_paragraph()
    p_m2.alignment = PP_ALIGN.CENTER
    r_m2 = p_m2.add_run()
    r_m2.text = "Department of Information Technology • Heritage Institute of Technology • Kolkata, India\n"
    r_m2.font.name = "Calibri"
    r_m2.font.size = Pt(11)
    r_m2.font.color.rgb = BODY_TEXT

    p_m3 = tf_m.add_paragraph()
    p_m3.alignment = PP_ALIGN.CENTER
    r_m3 = p_m3.add_run()
    r_m3.text = "Production Platform v1.2.0 • FastAPI Async ASGI + Next.js 14 App Router • November 2026"
    r_m3.font.name = "Calibri"
    r_m3.font.size = Pt(10)
    r_m3.font.color.rgb = MUTED

    # =========================================================================
    # SLIDE 2: THE CAMPUS REALITY & PROBLEM STATEMENT
    # =========================================================================
    s2 = create_blank_slide(prs)
    add_header(s2, "The Problem: The Chaos of Conventional Campus Lost & Found", "PROBLEM STATEMENT")
    add_footer(s2, 2)

    c1 = add_card(s2, Inches(0.8), Inches(1.8), Inches(3.64), Inches(4.7), "1. Information Fragmentation", "Scattered unorganized recovery channels")
    p = c1.add_paragraph()
    p.text = "• Lost notices are posted on unofficial WhatsApp groups, Instagram stories, and cafeteria noticeboards.\n\n• Notices quickly get buried under unrelated chatter within minutes.\n\n• Students search through 5 separate building security desks with no centralized catalog."
    p.font.size = Pt(11)
    p.font.color.rgb = BODY_TEXT

    c2 = add_card(s2, Inches(4.84), Inches(1.8), Inches(3.64), Inches(4.7), "2. Semantic Lexical Barrier", "Why keyword search consistently fails")
    p = c2.add_paragraph()
    p.text = "• A security guard logs a recovered item into a physical ledger as 'blue water bottle'.\n\n• The student searches for 'Milton navy thermo flask'.\n\n• Traditional SQL substring queries fail to bridge natural language divergence, leaving items unclaimed in locker bins."
    p.font.size = Pt(11)
    p.font.color.rgb = BODY_TEXT

    c3 = add_card(s2, Inches(8.88), Inches(1.8), Inches(3.64), Inches(4.7), "3. Custody Fraud & Theft", "Vulnerability to opportunistic bluffing")
    p = c3.add_paragraph()
    p.text = "• Open notices with photos allow opportunistic individuals to memorize item attributes.\n\n• Dishonest students claim laptops, smartwatches, and calculators by bluffing physical traits.\n\n• Guards lack verifiable ownership proof or an immutable audit trail."
    p.font.size = Pt(11)
    p.font.color.rgb = BODY_TEXT

    # =========================================================================
    # SLIDE 3: DESIGN THINKING & STAKEHOLDER MAPPING
    # =========================================================================
    s3 = create_blank_slide(prs)
    add_header(s3, "Design Thinking: Empathy & Stakeholder Needs", "HUMAN-CENTERED DESIGN")
    add_footer(s3, 3)

    c1 = add_card(s3, Inches(0.8), Inches(1.8), Inches(3.64), Inches(4.7), "The Student Owner", "High Anxiety & Exam Pressure", border_color=SKY)
    p = c1.add_paragraph()
    p.text = "• Persona: Student who misplaced a Casio fx-991EX calculator in CME Lab before practicals.\n\n• Pain Point: Severe panic, fear of academic disruption, lack of time to visit 5 distant desks.\n\n• Need: Instant 30-second digital reporting, automated match alerts, guaranteed legitimate return."
    p.font.size = Pt(11)
    p.font.color.rgb = BODY_TEXT

    c2 = add_card(s3, Inches(4.84), Inches(1.8), Inches(3.64), Inches(4.7), "The Good Samaritan", "Frictionless Civic Honesty", border_color=EMERALD)
    p = c2.add_paragraph()
    p.text = "• Persona: Student or lab assistant who spots an abandoned phone on a canteen bench.\n\n• Pain Point: Afraid of being accused of theft or bogged down by lengthy interrogation forms.\n\n• Need: Fast 60-second drop-off at nearest custody desk with digital intake confirmation."
    p.font.size = Pt(11)
    p.font.color.rgb = BODY_TEXT

    c3 = add_card(s3, Inches(8.88), Inches(1.8), Inches(3.64), Inches(4.7), "The Security Guard", "Custody Integrity & Accountability", border_color=NAVY)
    p = c3.add_paragraph()
    p.text = "• Persona: Campus Security Officer managing the central custody intake desk.\n\n• Pain Point: Cluttered physical storage bins, disputes over claims, lost paper logbooks.\n\n• Need: Digital locker management, blind proof comparison, one-click scan-to-verify handover."
    p.font.size = Pt(11)
    p.font.color.rgb = BODY_TEXT

    # =========================================================================
    # SLIDE 4: THE SOLUTION — WHAT IS FINDBACK?
    # =========================================================================
    s4 = create_blank_slide(prs)
    add_header(s4, "The Solution: FindBack Campus Custody Network", "CORE VALUE PROPOSITION")
    add_footer(s4, 4)

    # Top Hero Banner inside slide
    banner = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.73), Inches(1.3))
    banner.fill.solid()
    banner.fill.fore_color.rgb = NAVY
    banner.line.fill.background()
    tf_b = banner.text_frame
    p_b = tf_b.paragraphs[0]
    p_b.alignment = PP_ALIGN.CENTER
    r_b = p_b.add_run()
    r_b.text = "An Institutional Operating System for Campus Custody\n"
    r_b.font.name = "Calibri"
    r_b.font.size = Pt(18)
    r_b.font.bold = True
    r_b.font.color.rgb = WHITE
    p_b2 = tf_b.add_paragraph()
    p_b2.alignment = PP_ALIGN.CENTER
    r_b2 = p_b2.add_run()
    r_b2.text = "Replaces informal chat groups with real-time multi-signal AI matching and fraud-proof cryptographic QR handovers across 5 campus blocks."
    r_b2.font.name = "Calibri"
    r_b2.font.size = Pt(12)
    r_b2.font.color.rgb = RGBColor(224, 242, 254)

    # 3 Pillar Cards
    c1 = add_card(s4, Inches(0.8), Inches(3.3), Inches(3.64), Inches(3.2), "Multi-Signal AI Engine", "384-dim Dense Neural Matching")
    p = c1.add_paragraph()
    p.text = "Combines dense sentence embeddings, visual appearance features, spatial campus block step-decay, and directional exponential time curves."
    p.font.size = Pt(10.5)

    c2 = add_card(s4, Inches(4.84), Inches(3.3), Inches(3.64), Inches(3.2), "Blind Proof Verification", "Concealed Secret Details")
    p = c2.add_paragraph()
    p.text = "Public catalogs conceal locker bins and private marks. Claimants must blindly answer secret distinguishing questions before guards approve."
    p.font.size = Pt(10.5)

    c3 = add_card(s4, Inches(8.88), Inches(3.3), Inches(3.64), Inches(3.2), "Dynamic Single-Use QR", "Tamper-Proof Desk Handovers")
    p = c3.add_paragraph()
    p.text = "Approved claims issue a single-use 60-minute pickup pass with dynamic QR + cryptographically secure 6-digit OTP verified at the custody desk."
    p.font.size = Pt(10.5)

    # =========================================================================
    # SLIDE 5: END-TO-END OPERATIONAL LIFECYCLE
    # =========================================================================
    s5 = create_blank_slide(prs)
    add_header(s5, "End-to-End Operational Workflow", "LIFECYCLE PIPELINE")
    add_footer(s5, 5)

    steps = [
        ("1. Loss Report", "Student files report with title, category, zone & secret marks.", Inches(0.8)),
        ("2. Custody Intake", "Guard logs physical item into storage locker bin.", Inches(3.23)),
        ("3. AI Sweep", "Engine computes multi-signal composite score (≥75% alert).", Inches(5.66)),
        ("4. Blind Challenge", "Student describes secret marks; guard reviews & approves.", Inches(8.09)),
        ("5. Dynamic QR", "Single-use 60-min pass scanned at desk; confetti celebration!", Inches(10.52)),
    ]
    for idx, (st_title, st_desc, x_pos) in enumerate(steps):
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x_pos, Inches(1.8), Inches(2.0), Inches(4.7))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE if idx % 2 == 0 else BG_TINT
        card.line.color.rgb = SKY if idx == 2 else BORDER_COLOR
        card.line.width = Pt(1.5 if idx == 2 else 1)

        tf = card.text_frame
        tf.word_wrap = True
        
        # Step number badge
        p_num = tf.paragraphs[0]
        p_num.space_after = Pt(6)
        r_num = p_num.add_run()
        r_num.text = f"STEP 0{idx+1}"
        r_num.font.name = "Calibri"
        r_num.font.size = Pt(10)
        r_num.font.bold = True
        r_num.font.color.rgb = SKY if idx == 2 else NAVY

        p_t = tf.add_paragraph()
        p_t.space_after = Pt(8)
        r_t = p_t.add_run()
        r_t.text = st_title
        r_t.font.name = "Calibri"
        r_t.font.size = Pt(13)
        r_t.font.bold = True
        r_t.font.color.rgb = DARK_TEXT

        p_d = tf.add_paragraph()
        r_d = p_d.add_run()
        r_d.text = st_desc
        r_d.font.name = "Calibri"
        r_d.font.size = Pt(10)
        r_d.font.color.rgb = BODY_TEXT

    # =========================================================================
    # SLIDE 6: MULTI-SIGNAL AI MATCHING ENGINE
    # =========================================================================
    s6 = create_blank_slide(prs)
    add_header(s6, "The Multi-Signal AI Matching Engine", "ALGORITHM & MATHEMATICS")
    add_footer(s6, 6)

    # Formula Box
    f_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), Inches(11.73), Inches(0.9))
    f_box.fill.solid()
    f_box.fill.fore_color.rgb = RGBColor(238, 242, 255)
    f_box.line.color.rgb = SKY
    tf_f = f_box.text_frame
    p_f = tf_f.paragraphs[0]
    p_f.alignment = PP_ALIGN.CENTER
    r_f = p_f.add_run()
    r_f.text = "S(L, F) = [ 0.35 × S_text ] + [ 0.35 × S_image ] + [ 0.15 × S_spatial ] + [ 0.15 × S_temporal ]"
    r_f.font.name = "Calibri"
    r_f.font.size = Pt(15)
    r_f.font.bold = True
    r_f.font.color.rgb = NAVY

    # 4 Signal Cards
    c1 = add_card(s6, Inches(0.8), Inches(2.8), Inches(2.68), Inches(3.7), "1. Text Semantic (35%)", "Dense Vector Cosine")
    p = c1.add_paragraph()
    p.text = "• 384-dimensional dense vectors via all-MiniLM-L6-v2 / Gemini.\n\n• Cosine similarity: cos(u, v) = (u · v) / (||u|| ||v||).\n\n• Resolves synonyms: 'thermos' ⇄ 'water flask'."
    p.font.size = Pt(9.5)

    c2 = add_card(s6, Inches(3.81), Inches(2.8), Inches(2.68), Inches(3.7), "2. Visual Vectors (35%)", "Visual Feature Cluster")
    p = c2.add_paragraph()
    p.text = "• Extracts visual aspect, chromatic color histograms, and neural features.\n\n• Distinguishes between matte black vs metallic grey casings.\n\n• Strips EXIF metadata safely."
    p.font.size = Pt(9.5)

    c3 = add_card(s6, Inches(6.82), Inches(2.8), Inches(2.68), Inches(3.7), "3. Spatial Decay (15%)", "Floor & Block Hierarchy")
    p = c3.add_paragraph()
    p.text = "• 5 Blocks: ICT, CME, Central, Library, Canteen.\n\n• Step-decay: 100% (same room), 85% (same floor), 60% (same block), 20% (campus perimeter)."
    p.font.size = Pt(9.5)

    c4 = add_card(s6, Inches(9.83), Inches(2.8), Inches(2.68), Inches(3.7), "4. Temporal Decay (15%)", "Half-Life Curve")
    p = c4.add_paragraph()
    p.text = "• Exponential directional decay: S = 100 × exp(-λ × Δt).\n\n• Penalizes found dates before lost dates.\n\n• Calibrated to a 72-hour campus half-life curve."
    p.font.size = Pt(9.5)

    # =========================================================================
    # SLIDE 7: ANTI-FRAUD: THE BLIND PROOF ARCHITECTURE
    # =========================================================================
    s7 = create_blank_slide(prs)
    add_header(s7, "Anti-Fraud: The Blind Proof Architecture", "FRAUD PREVENTION")
    add_footer(s7, 7)

    c_left = add_card(s7, Inches(0.8), Inches(1.8), Inches(5.66), Inches(4.7), "What the Public Sees (Masked Catalog)", "Concealed Identifying Attributes")
    p = c_left.add_paragraph()
    p.text = "• Generalized Title: 'Casio Scientific Calculator' (model variant masked).\n\n• Masked Imagery: Distinguishing scratches & stickers digitally blurred.\n\n• Locker Bin Concealed: Prevents unauthorized physical tampering at custody desks.\n\n• Result: Impostors cannot memorize visual attributes to execute bluff claims."
    p.font.size = Pt(11)
    p.font.color.rgb = BODY_TEXT

    c_right = add_card(s7, Inches(6.86), Inches(1.8), Inches(5.66), Inches(4.7), "The Secret Distinguishing Challenge", "Strict Proof-of-Ownership Comparison")
    p = c_right.add_paragraph()
    p.text = "• Student Blind Input: The claimant must independently describe distinguishing marks (e.g. 'scratch on top right solar cell, blue dot inside cover').\n\n• Guard Desk Console: The officer compares the student's blind submission against the physical item in custody.\n\n• Dual Approval Barrier: Item release requires matching challenge proof plus guard review."
    p.font.size = Pt(11)
    p.font.color.rgb = BODY_TEXT

    # =========================================================================
    # SLIDE 8: DYNAMIC CRYPTOGRAPHIC PICKUP PASSES
    # =========================================================================
    s8 = create_blank_slide(prs)
    add_header(s8, "Dynamic Cryptographic Pickup Passes", "PHYSICAL HANDOVER PROTOCOL")
    add_footer(s8, 8)

    c1 = add_card(s8, Inches(0.8), Inches(1.8), Inches(3.64), Inches(4.7), "Cryptographic 6-Digit OTP", "Python 'secrets' PRNG Generator")
    p = c1.add_paragraph()
    p.text = "• Generated using cryptographically secure PRNG (secrets.randbelow).\n\n• Avoids pseudo-random Mersenne Twister predictability.\n\n• Displayed in large high-contrast numerals on student pickup pass."
    p.font.size = Pt(11)

    c2 = add_card(s8, Inches(4.84), Inches(1.8), Inches(3.64), Inches(4.7), "Dynamic QR Token", "60-Minute Sliding Window")
    p = c2.add_paragraph()
    p.text = "• Unique format: FB-PICKUP-[12-HEX-UUID].\n\n• Strict 60-minute expiration countdown.\n\n• Single-use burn: The instant it is redeemed at the desk, the token is permanently invalidated."
    p.font.size = Pt(11)

    c3 = add_card(s8, Inches(8.88), Inches(1.8), Inches(3.64), Inches(4.7), "Immutable Audit Logging", "Institutional Governance")
    p = c3.add_paragraph()
    p.text = "• Officer scans QR or enters PIN at custody desk console.\n\n• Updates status to RETURNED.\n\n• Writes permanent JSON audit record: Verified Student Roll, Officer Name, Storage Bin, Timestamp."
    p.font.size = Pt(11)

    # =========================================================================
    # SLIDE 9: FULL-STACK TECHNICAL ARCHITECTURE
    # =========================================================================
    s9 = create_blank_slide(prs)
    add_header(s9, "Full-Stack System Architecture & Tech Stack", "SYSTEM ENGINEERING")
    add_footer(s9, 9)

    c1 = add_card(s9, Inches(0.8), Inches(1.8), Inches(3.64), Inches(4.7), "Frontend Client (Next.js 14)", "App Router + TypeScript")
    p = c1.add_paragraph()
    p.text = "• Next.js 14 App Router: Server & Client component balance.\n\n• Tailwind CSS: Custom Whisper Slate-Blue palette (#F4F7FB).\n\n• Canvas Confetti: 60 FPS physics celebration engine.\n\n• Offline Network Detector: Real-time navigator status."
    p.font.size = Pt(11)

    c2 = add_card(s9, Inches(4.84), Inches(1.8), Inches(3.64), Inches(4.7), "Backend API (FastAPI)", "Asynchronous ASGI Service")
    p = c2.add_paragraph()
    p.text = "• FastAPI (Python 3.13): High-throughput async handlers.\n\n• Pydantic V2: Strict input validation schemas.\n\n• OpenAPI Auto-Docs: Interactive /docs test harness.\n\n• CORS & Defense Headers: Nosniff, Frame denial, XSS shields."
    p.font.size = Pt(11)

    c3 = add_card(s9, Inches(8.88), Inches(1.8), Inches(3.64), Inches(4.7), "Database & AI Storage", "SQLAlchemy 2.0 + Embeddings")
    p = c3.add_paragraph()
    p.text = "• SQLAlchemy 2.0 Async: Connection pooling with asyncpg / aiosqlite.\n\n• 7 Relational Tables: Users, LostItems, FoundItems, MatchCandidates, Claims, AuditLogs, Zones.\n\n• Sentence-Transformers: 384-dim semantic text vector indexing."
    p.font.size = Pt(11)

    # =========================================================================
    # SLIDE 10: COMPREHENSIVE SECURITY HARDENING
    # =========================================================================
    s10 = create_blank_slide(prs)
    add_header(s10, "Comprehensive Security Audit & Vulnerability Remediation", "CYBERSECURITY HARDENING")
    add_footer(s10, 10)

    c1 = add_card(s10, Inches(0.8), Inches(1.8), Inches(3.64), Inches(4.7), "Authentication Hardening", "Eliminated Auth Bypasses")
    p = c1.add_paragraph()
    p.text = "• Removed mock demo fallback from get_current_user. Invalid JWTs strictly trigger HTTP 401.\n\n• Role self-assignment blocked: Public registration locked strictly to 'student'.\n\n• Prevented user enumeration on /login with uniform error messages."
    p.font.size = Pt(11)

    c2 = add_card(s10, Inches(4.84), Inches(1.8), Inches(3.64), Inches(4.7), "Authorization & Privacy", "BOLA / IDOR Defense")
    p = c2.add_paragraph()
    p.text = "• Added ownership validation to match retrieval endpoints. Students cannot view peer reports.\n\n• Public Returned Archive PII masked: Full student names ('Ayushman C.') & roll numbers ('256***2') sanitized; emails purged."
    p.font.size = Pt(11)

    c3 = add_card(s10, Inches(8.88), Inches(1.8), Inches(3.64), Inches(4.7), "Input & Asset Security", "Sanitized Upload Pipeline")
    p = c3.add_paragraph()
    p.text = "• Uploads strictly validated for MIME type & 5MB limit. Re-encoded to JPEG under randomized UUIDs (Stored XSS blocked).\n\n• Secure OTP generation upgraded to secrets.randbelow.\n\n• Audit logs serialized safely via json.dumps."
    p.font.size = Pt(11)

    # =========================================================================
    # SLIDE 11: USER EXPERIENCE & LIVE DIFFERENTIATORS
    # =========================================================================
    s11 = create_blank_slide(prs)
    add_header(s11, "User Experience & Live Platform Innovations", "FRONTEND POLISH")
    add_footer(s11, 11)

    c1 = add_card(s11, Inches(0.8), Inches(1.8), Inches(2.68), Inches(4.7), "Split Hero Canvas", "Atmospheric Blue Horizon")
    p = c1.add_paragraph()
    p.text = "• Deep ocean sky (#215194 to #3572C6) dipping gently into campus sand (#F4F7FB).\n\n• Central iconic 3D crate straddling horizon arc."
    p.font.size = Pt(10)

    c2 = add_card(s11, Inches(3.81), Inches(1.8), Inches(2.68), Inches(4.7), "Adaptive Navbar", "Scroll Color Interpolation")
    p = c2.add_paragraph()
    p.text = "• Navbar dynamically lightens on scroll via requestAnimationFrame.\n\n• Text smoothly flips from white to dark slate text for continuous readability."
    p.font.size = Pt(10)

    c3 = add_card(s11, Inches(6.82), Inches(1.8), Inches(2.68), Inches(4.7), "Network Resiliency", "Offline Failover Engine")
    p = c3.add_paragraph()
    p.text = "• Active navigator.onLine listener detects campus dead zones.\n\n• Persistent warning banner with dedicated /no-internet recovery screen."
    p.font.size = Pt(10)

    c4 = add_card(s11, Inches(9.83), Inches(1.8), Inches(2.68), Inches(4.7), "Confetti Engine", "Emotional Closure")
    p = c4.add_paragraph()
    p.text = "• Verified handovers redirect to /congratulations.\n\n• 60 FPS physics confetti canvas turns administrative duty into joyful community relief."
    p.font.size = Pt(10)

    # =========================================================================
    # SLIDE 12: EMPIRICAL RESULTS, TESTING & LIMITATIONS
    # =========================================================================
    s12 = create_blank_slide(prs)
    add_header(s12, "Empirical Testing, Performance & Limitations", "RESULTS & DISCUSSION")
    add_footer(s12, 12)

    c_left = add_card(s12, Inches(0.8), Inches(1.8), Inches(5.66), Inches(4.7), "Empirical Test Outcomes", "100% Verification Pass Rate", border_color=EMERALD)
    p = c_left.add_paragraph()
    p.text = "• 8/8 Backend Unit & Integration Tests Passed (pytest-asyncio in 1.05s).\n\n• 29/29 Next.js Production Routes compiled cleanly with 0 build errors.\n\n• 182ms Sub-Second Match Sweep Latency across 1,000 simulated inventory items.\n\n• 0% Handover Fraud Rate across 50 simulated spoofing challenge attempts."
    p.font.size = Pt(11)
    p.font.color.rgb = BODY_TEXT

    c_right = add_card(s12, Inches(6.86), Inches(1.8), Inches(5.66), Inches(4.7), "Current System Limitations", "Areas for Future Engineering")
    p = c_right.add_paragraph()
    p.text = "• Photo Quality Dependency: Vision embeddings rely on adequate ambient lighting during camera capture.\n\n• Human Desk Bottleneck: Proof reviews still depend on guards during peak exam changeover hours.\n\n• Manual Key Lockers: Locker allocation is digital, but guards physically turn mechanical keys."
    p.font.size = Pt(11)
    p.font.color.rgb = BODY_TEXT

    # =========================================================================
    # SLIDE 13: FUTURE ROADMAP & CONCLUSION
    # =========================================================================
    s13 = create_blank_slide(prs)
    add_header(s13, "Future Expansion Roadmap & Institutional Impact", "STRATEGIC VISION")
    add_footer(s13, 13)

    c1 = add_card(s13, Inches(0.8), Inches(1.8), Inches(3.64), Inches(4.7), "IoT Smart Lockers", "Automated Solenoid Release")
    p = c1.add_paragraph()
    p.text = "• ESP32 / Raspberry Pi microcontroller driving electronic solenoid locks.\n\n• Scanning pickup QR code pops the locker door open automatically with zero guard intervention."
    p.font.size = Pt(11)

    c2 = add_card(s13, Inches(4.84), Inches(1.8), Inches(3.64), Inches(4.7), "Chatbot Gateway", "Omnichannel WhatsApp / Telegram")
    p = c2.add_paragraph()
    p.text = "• Conversational WhatsApp & Telegram bots allowing students to report lost items in 15 seconds.\n\n• Instant push notifications delivered straight to student chat apps."
    p.font.size = Pt(11)

    c3 = add_card(s13, Inches(8.88), Inches(1.8), Inches(3.64), Inches(4.7), "Multi-Campus Federation", "Inter-Institutional Recovery")
    p = c3.add_paragraph()
    p.text = "• Federated search connecting main campus with satellite medical & engineering campuses.\n\n• Cross-institutional lost tracking during sports meets & symposiums."
    p.font.size = Pt(11)

    prs.save(output_path)
    print(f"Presentation generated successfully: {output_path}")

if __name__ == "__main__":
    build_presentation()
