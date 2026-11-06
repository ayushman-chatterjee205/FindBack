import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# Exact Color Palette from Template PDF (media_1793559818633_65c3a2dd.pdf)
# Background: #21211F (Dark Charcoal Matte Black)
BG_COLOR = RGBColor(33, 33, 31)
# Accent: #C1E328 (Electric Neon Lime / Chartreuse)
LIME = RGBColor(193, 227, 40)
# Text & Highlights
WHITE = RGBColor(255, 255, 255)
MUTED_GREY = RGBColor(180, 184, 175)
DARK_CARD = RGBColor(42, 42, 40)
CARD_BORDER = RGBColor(65, 65, 62)

FONT_DISPLAY = "Arial Black"
FONT_HEADING = "Trebuchet MS"
FONT_BODY = "Calibri"

def add_run(p, text=""):
    r = p.add_run()
    r.text = text
    return r

def create_slide(prs):
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_COLOR
    bg.line.fill.background()
    return slide

def add_header_brand(slide, right_text="DESIGN THINKING & IDEATION LAB"):
    # Top Left Brand
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(6.0), Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    r = add_run(p, "HERITAGE INSTITUTE OF TECHNOLOGY")
    r.font.name = FONT_HEADING
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = LIME

    # Top Right Metadata
    tb_r = slide.shapes.add_textbox(Inches(7.0), Inches(0.4), Inches(5.53), Inches(0.4))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True
    p_r = tf_r.paragraphs[0]
    p_r.alignment = PP_ALIGN.RIGHT
    r_r = add_run(p_r, right_text.upper())
    r_r.font.name = FONT_HEADING
    r_r.font.size = Pt(9.5)
    r_r.font.bold = True
    r_r.font.color.rgb = MUTED_GREY

def add_divider_line(slide, left, top, width, color=LIME, height=0.02):
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, Inches(height))
    line.fill.solid()
    line.fill.fore_color.rgb = color
    line.line.fill.background()
    return line

def build_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # =========================================================================
    # SLIDE 1: COVER
    # =========================================================================
    s1 = create_slide(prs)
    add_header_brand(s1, "PITCH PRESENTATION | 2026")

    # Giant Display Title: FINDBACK.
    tb_t = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(9.5), Inches(2.6))
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True
    p1 = tf_t.paragraphs[0]
    r1 = add_run(p1, "FINDBACK.")
    r1.font.name = FONT_DISPLAY
    r1.font.size = Pt(88)
    r1.font.bold = True
    r1.font.color.rgb = LIME

    # Large Chevron Icon ">" next to title
    tb_chev = s1.shapes.add_textbox(Inches(11.2), Inches(1.8), Inches(1.5), Inches(2.0))
    tf_chev = tb_chev.text_frame
    p_chev = tf_chev.paragraphs[0]
    r_chev = add_run(p_chev, "❯")
    r_chev.font.name = FONT_DISPLAY
    r_chev.font.size = Pt(72)
    r_chev.font.bold = True
    r_chev.font.color.rgb = LIME

    # Subtitle Narrative
    tb_sub = s1.shapes.add_textbox(Inches(0.85), Inches(4.2), Inches(11.5), Inches(0.9))
    tf_sub = tb_sub.text_frame
    tf_sub.word_wrap = True
    p_sub = tf_sub.paragraphs[0]
    r_sub = add_run(p_sub, "AI-POWERED DIGITAL LOST & FOUND FOR EDUCATIONAL CAMPUSES\n")
    r_sub.font.name = FONT_HEADING
    r_sub.font.size = Pt(18)
    r_sub.font.bold = True
    r_sub.font.color.rgb = WHITE

    p_sub2 = tf_sub.add_paragraph()
    p_sub2.space_before = Pt(4)
    r_sub2 = add_run(p_sub2, "Building a smarter campus with multi-signal intelligence, blind custody verification, and physical vault recovery.")
    r_sub2.font.name = FONT_BODY
    r_sub2.font.size = Pt(13)
    r_sub2.font.color.rgb = MUTED_GREY

    # Divider Line
    add_divider_line(s1, Inches(0.85), Inches(5.4), Inches(11.68), color=LIME, height=0.02)

    # Team Roster at Bottom
    tb_team = s1.shapes.add_textbox(Inches(0.85), Inches(5.6), Inches(11.68), Inches(1.3))
    tf_team = tb_team.text_frame
    tf_team.word_wrap = True
    p_th = tf_team.paragraphs[0]
    r_th = add_run(p_th, "PROJECT TEAM — CSE (IOT & CYBER SECURITY INCLUDING BLOCKCHAIN TECHNOLOGY)")
    r_th.font.name = FONT_HEADING
    r_th.font.size = Pt(10)
    r_th.font.bold = True
    r_th.font.color.rgb = LIME

    p_tm = tf_team.add_paragraph()
    p_tm.space_before = Pt(6)
    r_tm = add_run(p_tm, "Ayushman Chatterjee (2563002)   •   Niladri Mukherjee (2563001)   •   Ankit Patel (2563021)   •   Erina Kar (2563022)   •   Shibam Singh (2563034)")
    r_tm.font.name = FONT_BODY
    r_tm.font.size = Pt(11)
    r_tm.font.bold = True
    r_tm.font.color.rgb = WHITE

    # =========================================================================
    # SLIDE 2: THE PROBLEM
    # =========================================================================
    s2 = create_slide(prs)
    add_header_brand(s2, "CAMPUS RECOVERY CHALLENGES")

    # Left Column: Image & Big Title
    if os.path.exists("t2_slide_2_X4.jpg"):
        s2.shapes.add_picture("t2_slide_2_X4.jpg", Inches(0.8), Inches(1.1), Inches(5.5), Inches(2.2))

    tb_p2_t = s2.shapes.add_textbox(Inches(0.8), Inches(3.45), Inches(5.5), Inches(1.8))
    tf_p2_t = tb_p2_t.text_frame
    tf_p2_t.word_wrap = True
    p = tf_p2_t.paragraphs[0]
    r = add_run(p, "THE\nPROBLEM")
    r.font.name = FONT_DISPLAY
    r.font.size = Pt(44)
    r.font.bold = True
    r.font.color.rgb = LIME

    tb_p2_desc = s2.shapes.add_textbox(Inches(0.8), Inches(5.3), Inches(5.5), Inches(1.6))
    tf_p2_desc = tb_p2_desc.text_frame
    tf_p2_desc.word_wrap = True
    p = tf_p2_desc.paragraphs[0]
    r = add_run(p, "In bustling higher education campuses like Heritage Institute of Technology spanning 5 major blocks (CME, Central, ICT, Mechanical, Science), students constantly misplace calculators, laptops, and IDs during rapid classroom transitions.")
    r.font.name = FONT_BODY
    r.font.size = Pt(10.5)
    r.font.color.rgb = MUTED_GREY

    # Right Column: Key Points
    tb_p2_r = s2.shapes.add_textbox(Inches(6.8), Inches(1.1), Inches(5.7), Inches(5.8))
    tf_p2_r = tb_p2_r.text_frame
    tf_p2_r.word_wrap = True

    p = tf_p2_r.paragraphs[0]
    r = add_run(p, "KEY FAILURE POINTS:")
    r.font.name = FONT_HEADING
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = LIME

    failure_points = [
        ("FRAGMENTED CHANNELS", "Lost item notices are scattered unpredictably across informal WhatsApp groups, departmental message boards, and social media feeds with zero centralized searchability."),
        ("MANUAL PAPER BOTTLENECKS", "Security officers record found items in physical bound logbooks. Brief handwriting and lack of cross-departmental synchronization cause massive retrieval delays."),
        ("VERIFICATION VULNERABILITY", "Handing over found items relies almost entirely on informal verbal claims ('it's a black Casio'). Without secret proof, items risk false handovers and identity spoofing.")
    ]

    for title, desc in failure_points:
        p_t = tf_p2_r.add_paragraph()
        p_t.space_before = Pt(14)
        r_t = add_run(p_t, title)
        r_t.font.name = FONT_HEADING
        r_t.font.size = Pt(12)
        r_t.font.bold = True
        r_t.font.color.rgb = LIME

        p_d = tf_p2_r.add_paragraph()
        p_d.space_before = Pt(3)
        r_d = add_run(p_d, desc)
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(10)
        r_d.font.color.rgb = WHITE

    p_bottom = tf_p2_r.add_paragraph()
    p_bottom.space_before = Pt(16)
    r_b = add_run(p_bottom, "The problem isn't the absence of Lost & Found kiosks — it is the critical absence of visibility, automated multi-signal matching, and cryptographically verified custody.")
    r_b.font.name = FONT_BODY
    r_b.font.size = Pt(10)
    r_b.font.color.rgb = MUTED_GREY

    # =========================================================================
    # SLIDE 3: THE SOLUTION
    # =========================================================================
    s3 = create_slide(prs)
    add_header_brand(s3, "PLATFORM FOUNDATION")

    # Big Plus Sign Top Right
    tb_plus = s3.shapes.add_textbox(Inches(11.8), Inches(0.8), Inches(1.0), Inches(1.0))
    tf_plus = tb_plus.text_frame
    p_plus = tf_plus.paragraphs[0]
    r_plus = add_run(p_plus, "+")
    r_plus.font.name = FONT_DISPLAY
    r_plus.font.size = Pt(64)
    r_plus.font.bold = True
    r_plus.font.color.rgb = LIME

    # Left: Big Title
    tb_s3_t = s3.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(5.0), Inches(1.8))
    tf_s3_t = tb_s3_t.text_frame
    tf_s3_t.word_wrap = True
    p = tf_s3_t.paragraphs[0]
    r = add_run(p, "THE\nSOLUTION")
    r.font.name = FONT_DISPLAY
    r.font.size = Pt(44)
    r.font.bold = True
    r.font.color.rgb = LIME

    # Architecture Image in Center
    if os.path.exists("t2_slide_3_X4.jpg"):
        s3.shapes.add_picture("t2_slide_3_X4.jpg", Inches(6.0), Inches(1.1), Inches(5.5), Inches(2.3))

    # Narrative Under Title
    tb_s3_desc = s3.shapes.add_textbox(Inches(0.8), Inches(3.0), Inches(11.73), Inches(0.9))
    tf_s3_desc = tb_s3_desc.text_frame
    tf_s3_desc.word_wrap = True
    p = tf_s3_desc.paragraphs[0]
    r = add_run(p, "FindBack provides an all-in-one digital custody layer over the college's existing Lost & Found facility—connecting students, finders, and campus security in a verified, multi-signal network.")
    r.font.name = FONT_BODY
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = WHITE

    # 4 Bottom Columns
    col_w3 = Inches(2.72)
    gap3 = Inches(0.28)
    y_c3 = Inches(4.2)
    h_c3 = Inches(2.6)

    solution_pillars = [
        ("INTELLIGENT AI MATCH", "Multi-signal composite similarity engine evaluating semantic text (35%), deep visual embeddings (35%), spatial campus block proximity (15%), and time decay (15%)."),
        ("BLIND PROOF CUSTODY", "Proprietary verification architecture: Unique identifying details (stickers, serials, scratches) remain masked from public catalog and verified blindly during claims."),
        ("PHYSICAL VAULT BINS", "Intake is organized into physical lockable custody crates (Bin #E-01 to #E-12) located in the Central Security Vault (Room 101, Central Block Ground Floor)."),
        ("DYNAMIC QR HANDOVER", "Handovers are authenticated via 60-minute cryptographic dynamic QR pass or 6-digit OTP pass, generating an immutable, tamper-proof audit log.")
    ]

    for i, (title, desc) in enumerate(solution_pillars):
        x = Inches(0.8) + i * (col_w3 + gap3)
        tb_col = s3.shapes.add_textbox(x, y_c3, col_w3, h_c3)
        tf_col = tb_col.text_frame
        tf_col.word_wrap = True

        p_t = tf_col.paragraphs[0]
        r_t = add_run(p_t, title)
        r_t.font.name = FONT_HEADING
        r_t.font.size = Pt(11)
        r_t.font.bold = True
        r_t.font.color.rgb = LIME

        p_d = tf_col.add_paragraph()
        p_d.space_before = Pt(8)
        r_d = add_run(p_d, desc)
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = MUTED_GREY

    # =========================================================================
    # SLIDE 4: CAMPUS OPPORTUNITY & RECOVERY METRICS
    # =========================================================================
    s4 = create_slide(prs)
    add_header_brand(s4, "CAMPUS RESEARCH & SCALE")

    # Left: Big Title
    tb_s4_t = s4.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(5.5), Inches(1.8))
    tf_s4_t = tb_s4_t.text_frame
    tf_s4_t.word_wrap = True
    p = tf_s4_t.paragraphs[0]
    r = add_run(p, "CAMPUS\nOPPORTUNITY")
    r.font.name = FONT_DISPLAY
    r.font.size = Pt(44)
    r.font.bold = True
    r.font.color.rgb = LIME

    tb_s4_desc = s4.shapes.add_textbox(Inches(0.8), Inches(3.2), Inches(5.5), Inches(1.8))
    tf_s4_desc = tb_s4_desc.text_frame
    tf_s4_desc.word_wrap = True
    p = tf_s4_desc.paragraphs[0]
    r = add_run(p, "The demand for modern, reliable campus recovery expands rapidly as academic institutions grow. Across 5 building blocks, students face significant friction retrieving lost property through legacy channels.")
    r.font.name = FONT_BODY
    r.font.size = Pt(11)
    r.font.color.rgb = MUTED_GREY

    # Right: Recovery Progression Metric Graph
    tb_graph = s4.shapes.add_textbox(Inches(6.8), Inches(1.2), Inches(5.7), Inches(4.0))
    tf_graph = tb_graph.text_frame
    tf_graph.word_wrap = True

    p = tf_graph.paragraphs[0]
    r = add_run(p, "RECOVERY SUCCESS RATE BY CHANNEL:")
    r.font.name = FONT_HEADING
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = LIME

    graph_stages = [
        ("Informal WhatsApp Groups", "18% Recovery", 18),
        ("Departmental Notice Boards", "24% Recovery", 24),
        ("Physical Security Paper Logs", "32% Recovery", 32),
        ("FindBack Multi-Signal AI Matching", "86% Recovery", 86),
        ("Verified Central Vault Handover", "98% Handover Certainty", 98)
    ]

    for label, val_str, pct in graph_stages:
        p_l = tf_graph.add_paragraph()
        p_l.space_before = Pt(10)
        r_l = add_run(p_l, f"• {label}: ")
        r_l.font.name = FONT_HEADING
        r_l.font.size = Pt(10)
        r_l.font.bold = True
        r_l.font.color.rgb = WHITE
        r_v = add_run(p_l, val_str)
        r_v.font.name = FONT_HEADING
        r_v.font.size = Pt(10)
        r_v.font.bold = True
        r_v.font.color.rgb = LIME if pct > 50 else MUTED_GREY

    # Bottom Highlight Banner with Lime Bar
    add_divider_line(s4, Inches(0.8), Inches(5.5), Inches(1.5), color=LIME, height=0.06)
    tb_callout = s4.shapes.add_textbox(Inches(0.8), Inches(5.7), Inches(11.73), Inches(1.2))
    tf_callout = tb_callout.text_frame
    tf_callout.word_wrap = True
    p = tf_callout.paragraphs[0]
    r = add_run(p, "OVER 60% OF CAMPUS STUDENTS EXPERIENCE BELONGING LOSS EACH SEMESTER.\nFINDBACK SLASHES AVERAGE RECOVERY TIME FROM 5-7 DAYS DOWN TO UNDER 4 HOURS.")
    r.font.name = FONT_HEADING
    r.font.size = Pt(12.5)
    r.font.bold = True
    r.font.color.rgb = WHITE

    # =========================================================================
    # SLIDE 5: SERVICE OVERVIEW
    # =========================================================================
    s5 = create_slide(prs)
    add_header_brand(s5, "OPERATIONAL LIFECYCLE")

    # Stepped arrow in Lime
    tb_arrow = s5.shapes.add_textbox(Inches(3.8), Inches(1.5), Inches(1.5), Inches(1.5))
    tf_arrow = tb_arrow.text_frame
    p_arr = tf_arrow.paragraphs[0]
    r_arr = add_run(p_arr, "↳⇘")
    r_arr.font.name = FONT_DISPLAY
    r_arr.font.size = Pt(40)
    r_arr.font.bold = True
    r_arr.font.color.rgb = LIME

    # Left: Big Title
    tb_s5_t = s5.shapes.add_textbox(Inches(0.8), Inches(3.2), Inches(4.5), Inches(1.8))
    tf_s5_t = tb_s5_t.text_frame
    tf_s5_t.word_wrap = True
    p = tf_s5_t.paragraphs[0]
    r = add_run(p, "SERVICE\nOVERVIEW")
    r.font.name = FONT_DISPLAY
    r.font.size = Pt(44)
    r.font.bold = True
    r.font.color.rgb = LIME

    tb_s5_desc = s5.shapes.add_textbox(Inches(0.8), Inches(5.2), Inches(4.5), Inches(1.8))
    tf_s5_desc = tb_s5_desc.text_frame
    tf_s5_desc.word_wrap = True
    p = tf_s5_desc.paragraphs[0]
    r = add_run(p, "Designed around three campus stakeholders: The Student Reporter, The Good Samaritan Finder, and The Campus Security Custodian.")
    r.font.name = FONT_BODY
    r.font.size = Pt(10.5)
    r.font.color.rgb = MUTED_GREY

    # Center: Two Stacked Photos
    if os.path.exists("t2_slide_5_X5.jpg"):
        s5.shapes.add_picture("t2_slide_5_X5.jpg", Inches(5.6), Inches(1.1), Inches(2.8), Inches(2.6))
    if os.path.exists("t2_slide_5_X8.jpg"):
        s5.shapes.add_picture("t2_slide_5_X8.jpg", Inches(5.6), Inches(3.9), Inches(2.8), Inches(2.8))

    # Right: Narrative Blocks
    tb_s5_r = s5.shapes.add_textbox(Inches(8.7), Inches(1.1), Inches(3.8), Inches(5.8))
    tf_s5_r = tb_s5_r.text_frame
    tf_s5_r.word_wrap = True

    p = tf_s5_r.paragraphs[0]
    r = add_run(p, "SEAMLESS 30-SEC REPORTING")
    r.font.name = FONT_HEADING
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = LIME

    p_d1 = tf_s5_r.add_paragraph()
    p_d1.space_before = Pt(4)
    r_d1 = add_run(p_d1, "Students file a report in 30 seconds with photos, loss timestamp, floor zone, and confidential blind proof. The client-side Network State Detector ensures zero data loss during campus WiFi drops.")
    r_d1.font.name = FONT_BODY
    r_d1.font.size = Pt(9.5)
    r_d1.font.color.rgb = WHITE

    p_t2 = tf_s5_r.add_paragraph()
    p_t2.space_before = Pt(20)
    r_t2 = add_run(p_t2, "CENTRAL VAULT INTAKE & RETURN")
    r_t2.font.name = FONT_HEADING
    r_t2.font.size = Pt(12)
    r_t2.font.bold = True
    r_t2.font.color.rgb = LIME

    p_d2 = tf_s5_r.add_paragraph()
    p_d2.space_before = Pt(4)
    r_d2 = add_run(p_d2, "Staff at Central Vault Room 101 checks items into barcode-indexed bins (#E-01 to #E-12). Multi-signal AI triggers automated alerts (≥75% score), and handovers are finalized via dynamic QR/OTP passes.")
    r_d2.font.name = FONT_BODY
    r_d2.font.size = Pt(9.5)
    r_d2.font.color.rgb = WHITE

    # =========================================================================
    # SLIDE 6: CUSTODY ARCHITECTURE (Template: Business Model)
    # =========================================================================
    s6 = create_slide(prs)
    add_header_brand(s6, "TECHNICAL ARCHITECTURE")

    # Left: Big Title
    tb_s6_t = s6.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(4.5), Inches(1.8))
    tf_s6_t = tb_s6_t.text_frame
    tf_s6_t.word_wrap = True
    p = tf_s6_t.paragraphs[0]
    r = add_run(p, "CUSTODY\nARCHITECTURE")
    r.font.name = FONT_DISPLAY
    r.font.size = Pt(42)
    r.font.bold = True
    r.font.color.rgb = LIME

    tb_s6_desc = s6.shapes.add_textbox(Inches(0.8), Inches(4.2), Inches(4.5), Inches(2.2))
    tf_s6_desc = tb_s6_desc.text_frame
    tf_s6_desc.word_wrap = True
    p = tf_s6_desc.paragraphs[0]
    r = add_run(p, "Engineered as a decoupled asynchronous full-stack platform delivering military-grade security, instant AI vector scoring, and complete chain-of-custody tracking.")
    r.font.name = FONT_BODY
    r.font.size = Pt(11)
    r.font.color.rgb = MUTED_GREY

    # Right: 3 Horizontal Sections with Divider Lines
    x_r6 = Inches(5.8)
    w_r6 = Inches(6.7)
    y_r6 = Inches(1.3)

    arch_sections = [
        ("FULL-STACK PLATFORM FOUNDATION", "Next.js 14 App Router (React 18, TypeScript, Tailwind CSS) paired with high-performance asynchronous FastAPI, SQLAlchemy 2.0 ORM, and client-side Network State Detector for campus WiFi resilience."),
        ("PHYSICAL VAULT & CAMPUS SPATIAL HIERARCHY", "Hierarchical campus zone graph mapping 5 major blocks (CME, Central, ICT, Mechanical, Science) and Central Block Vault Room 101 with barcode-indexed storage bins (Bin #E-01 to #E-12)."),
        ("OWASP API HARDENING & SESSION SECURITY", "Argon2id password hashing, stateless JWT Bearer tokens with strict 60-min expiration, role-based access control (Student, Staff, Admin), and IP rate limiting (5 req/min on auth, 60 req/min general).")
    ]

    for idx, (title, desc) in enumerate(arch_sections):
        y_sec = y_r6 + idx * Inches(1.8)
        
        # Section text
        tb = s6.shapes.add_textbox(x_r6, y_sec, w_r6, Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p_t = tf.paragraphs[0]
        r_t = add_run(p_t, title)
        r_t.font.name = FONT_HEADING
        r_t.font.size = Pt(12)
        r_t.font.bold = True
        r_t.font.color.rgb = LIME

        p_d = tf.add_paragraph()
        p_d.space_before = Pt(4)
        r_d = add_run(p_d, desc)
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(10)
        r_d.font.color.rgb = WHITE

        # Lime divider line below
        add_divider_line(s6, x_r6, y_sec + Inches(1.55), w_r6, color=LIME, height=0.015)

    # =========================================================================
    # SLIDE 7: COMPETITIVE ADVANTAGE
    # =========================================================================
    s7 = create_slide(prs)
    add_header_brand(s7, "PROTOCOL COMPARISON")

    # Starburst accent bottom left
    tb_star = s7.shapes.add_textbox(Inches(0.8), Inches(6.0), Inches(0.8), Inches(0.8))
    tf_star = tb_star.text_frame
    p_star = tf_star.paragraphs[0]
    r_star = add_run(p_star, "✳")
    r_star.font.name = FONT_DISPLAY
    r_star.font.size = Pt(36)
    r_star.font.color.rgb = LIME

    # Top: Big Title
    tb_s7_t = s7.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.73), Inches(1.3))
    tf_s7_t = tb_s7_t.text_frame
    tf_s7_t.word_wrap = True
    p = tf_s7_t.paragraphs[0]
    r = add_run(p, "COMPETITIVE ADVANTAGE")
    r.font.name = FONT_DISPLAY
    r.font.size = Pt(42)
    r.font.bold = True
    r.font.color.rgb = LIME

    # Vertical Lime Divider Line between Question and Answer columns
    add_divider_line(s7, Inches(4.5), Inches(2.4), Inches(0.015), color=LIME, height=4.2)

    qa_items = [
        ("WHAT ARE THE EXISTING CAMPUS ALTERNATIVES?", "Informal WhatsApp groups, departmental paper logbooks, and physical bulletin boards. These are fragmented, unindexed, leak private student phone numbers, and lack any ownership verification."),
        ("WHAT ARE FINDBACK’S CORE STRENGTHS?", "A 4-signal multi-modal AI matching engine (Text 35% + Image 35% + Spatial 15% + Temporal 15%), Blind Proof-of-Ownership architecture, and 60-minute cryptographic dynamic QR/OTP handover passes."),
        ("WHY WILL INSTITUTIONS CHOOSE FINDBACK?", "Zero operational friction: It doesn't replace campus security staff—it eliminates their manual paper burden, provides 100% chain-of-custody auditability, and guarantees student privacy with complete PII masking.")
    ]

    for idx, (q, a) in enumerate(qa_items):
        y_qa = Inches(2.5) + idx * Inches(1.4)

        # Question on left
        tb_q = s7.shapes.add_textbox(Inches(0.8), y_qa, Inches(3.5), Inches(1.2))
        tf_q = tb_q.text_frame
        tf_q.word_wrap = True
        p_q = tf_q.paragraphs[0]
        r_q = add_run(p_q, q)
        r_q.font.name = FONT_HEADING
        r_q.font.size = Pt(11)
        r_q.font.bold = True
        r_q.font.color.rgb = LIME

        # Answer on right
        tb_a = s7.shapes.add_textbox(Inches(4.8), y_qa, Inches(7.73), Inches(1.2))
        tf_a = tb_a.text_frame
        tf_a.word_wrap = True
        p_a = tf_a.paragraphs[0]
        r_a = add_run(p_a, a)
        r_a.font.name = FONT_BODY
        r_a.font.size = Pt(10.5)
        r_a.font.color.rgb = WHITE

    # =========================================================================
    # SLIDE 8: AI MATCHING STRATEGY (Template: Market Strategy)
    # =========================================================================
    s8 = create_slide(prs)
    add_header_brand(s8, "INTELLIGENCE PIPELINE")

    # Large Diagonal Arrow Top Right & Bottom Left
    tb_arr_tr = s8.shapes.add_textbox(Inches(11.0), Inches(0.8), Inches(1.5), Inches(1.5))
    tf_arr_tr = tb_arr_tr.text_frame
    p_tr = tf_arr_tr.paragraphs[0]
    r_tr = add_run(p_tr, "↗")
    r_tr.font.name = FONT_DISPLAY
    r_tr.font.size = Pt(72)
    r_tr.font.bold = True
    r_tr.font.color.rgb = LIME

    tb_arr_bl = s8.shapes.add_textbox(Inches(0.8), Inches(5.8), Inches(1.2), Inches(1.2))
    tf_arr_bl = tb_arr_bl.text_frame
    p_bl = tf_arr_bl.paragraphs[0]
    r_bl = add_run(p_bl, "↗")
    r_bl.font.name = FONT_DISPLAY
    r_bl.font.size = Pt(48)
    r_bl.font.bold = True
    r_bl.font.color.rgb = LIME

    # Left: Big Title
    tb_s8_t = s8.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(5.0), Inches(1.8))
    tf_s8_t = tb_s8_t.text_frame
    tf_s8_t.word_wrap = True
    p = tf_s8_t.paragraphs[0]
    r = add_run(p, "AI MATCHING\nSTRATEGY")
    r.font.name = FONT_DISPLAY
    r.font.size = Pt(42)
    r.font.bold = True
    r.font.color.rgb = LIME

    tb_s8_desc = s8.shapes.add_textbox(Inches(0.8), Inches(3.8), Inches(4.8), Inches(1.8))
    tf_s8_desc = tb_s8_desc.text_frame
    tf_s8_desc.word_wrap = True
    p = tf_s8_desc.paragraphs[0]
    r = add_run(p, "Moving beyond brittle keyword matching to a multi-signal composite formulation combining semantic tokens, visual cosine similarity, campus geometry, and temporal decay.")
    r.font.name = FONT_BODY
    r.font.size = Pt(11)
    r.font.color.rgb = MUTED_GREY

    # Right: 3 Horizontal Strategy Sections
    x_r8 = Inches(5.8)
    w_r8 = Inches(6.7)
    y_r8 = Inches(1.3)

    strategy_items = [
        ("COMPOSITE MATCHING SCORE FORMULATION", "Score(L, F) = 0.35 · S_text + 0.35 · S_img + 0.15 · S_spatial + 0.15 · S_temporal. Automatic candidate alerts trigger when composite similarity reaches or exceeds 75%."),
        ("MULTI-MODAL VECTOR EMBEDDINGS", "Text semantics overcome lexical mismatches (e.g., 'water bottle' vs. 'thermos flask'); visual embeddings compare primary color palette, form factor, and geometric proportions."),
        ("EMPIRICAL BENCHMARK (CASIO CALCULATOR CASE STUDY)", "Black Casio fx-991CW lost in CME Lab 204 matched against Central Vault intake in 12 seconds with 93% match confidence; verified and safely returned within 32 minutes.")
    ]

    for idx, (title, desc) in enumerate(strategy_items):
        y_sec = y_r8 + idx * Inches(1.8)

        tb = s8.shapes.add_textbox(x_r8, y_sec, w_r8, Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p_t = tf.paragraphs[0]
        r_t = add_run(p_t, title)
        r_t.font.name = FONT_HEADING
        r_t.font.size = Pt(12)
        r_t.font.bold = True
        r_t.font.color.rgb = LIME

        p_d = tf.add_paragraph()
        p_d.space_before = Pt(4)
        r_d = add_run(p_d, desc)
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(10)
        r_d.font.color.rgb = WHITE

        add_divider_line(s8, x_r8, y_sec + Inches(1.55), w_r8, color=LIME, height=0.015)

    # =========================================================================
    # SLIDE 9: OUR TEAM
    # =========================================================================
    s9 = create_slide(prs)
    add_header_brand(s9, "PROJECT CONTRIBUTORS")

    # Big Block Accent "L" Shape in Lime
    shape_l1 = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.3), Inches(0.45), Inches(1.2))
    shape_l1.fill.solid()
    shape_l1.fill.fore_color.rgb = LIME
    shape_l1.line.fill.background()

    shape_l2 = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(2.05), Inches(1.2), Inches(0.45))
    shape_l2.fill.solid()
    shape_l2.fill.fore_color.rgb = LIME
    shape_l2.line.fill.background()

    # Left: Big Title
    tb_s9_t = s9.shapes.add_textbox(Inches(0.8), Inches(2.7), Inches(5.0), Inches(1.2))
    tf_s9_t = tb_s9_t.text_frame
    tf_s9_t.word_wrap = True
    p = tf_s9_t.paragraphs[0]
    r = add_run(p, "OUR TEAM")
    r.font.name = FONT_DISPLAY
    r.font.size = Pt(44)
    r.font.bold = True
    r.font.color.rgb = LIME

    tb_s9_desc = s9.shapes.add_textbox(Inches(0.8), Inches(4.0), Inches(5.0), Inches(1.5))
    tf_s9_desc = tb_s9_desc.text_frame
    tf_s9_desc.word_wrap = True
    p = tf_s9_desc.paragraphs[0]
    r = add_run(p, "Department of Computer Science & Engineering\n(IoT & Cyber Security including Blockchain Technology)\nHeritage Institute of Technology, Kolkata")
    r.font.name = FONT_BODY
    r.font.size = Pt(11)
    r.font.color.rgb = MUTED_GREY

    # Right: 5 Team Member Cards (Horizontal Row)
    # Total width available: ~6.7 inches. Let's make 5 compact high-density cards
    card_w9 = Inches(2.25)
    gap9 = Inches(0.12)
    # Let's arrange as 2 rows: Top row (3 members), Bottom row (2 members) for perfect readability!
    team = [
        ("AYUSHMAN CHATTERJEE", "2563002", "ENGINEERING LEAD", "Full-stack integration, Next.js App Router, FastAPI async sync, client-side network detector & offline state."),
        ("NILADRI MUKHERJEE", "2563001", "SYSTEMS ARCHITECT", "Custody pipeline architecture, Central Vault hierarchy (Bins #E-01 to #E-12), and campus spatial zone graph."),
        ("ANKIT PATEL", "2563021", "AI PIPELINE LEAD", "4-signal composite matching formulation, semantic embeddings, visual cosine distance, and threshold gating."),
        ("ERINA KAR", "2563022", "FRONTEND & UX LEAD", "Brutalist design system, responsive UI, blind claim modals, accessibility compliance, and recovery feedback."),
        ("SHIBAM SINGH", "2563034", "SECURITY LEAD", "OWASP API hardening, Argon2id hashing, stateless JWT Bearer auth, and 60-min dynamic QR/OTP verification.")
    ]

    # Top Row: 3 members
    for i in range(3):
        x = Inches(6.0) + i * (card_w9 + gap9)
        y = Inches(1.3)
        name, roll, role, desc = team[i]

        tb = s9.shapes.add_textbox(x, y, card_w9, Inches(2.6))
        tf = tb.text_frame
        tf.word_wrap = True

        p_n = tf.paragraphs[0]
        r_n = add_run(p_n, name)
        r_n.font.name = FONT_HEADING
        r_n.font.size = Pt(10.5)
        r_n.font.bold = True
        r_n.font.color.rgb = WHITE

        p_r = tf.add_paragraph()
        r_r = add_run(p_r, f"ROLL: {roll}")
        r_r.font.name = FONT_BODY
        r_r.font.size = Pt(8.5)
        r_r.font.bold = True
        r_r.font.color.rgb = LIME

        p_ro = tf.add_paragraph()
        p_ro.space_before = Pt(2)
        r_ro = add_run(p_ro, role)
        r_ro.font.name = FONT_HEADING
        r_ro.font.size = Pt(8.5)
        r_ro.font.bold = True
        r_ro.font.color.rgb = MUTED_GREY

        p_d = tf.add_paragraph()
        p_d.space_before = Pt(4)
        r_d = add_run(p_d, desc)
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(8.5)
        r_d.font.color.rgb = MUTED_GREY

    # Bottom Row: 2 members
    for i in range(2):
        x = Inches(6.0) + i * (card_w9 + gap9)
        y = Inches(4.3)
        name, roll, role, desc = team[3 + i]

        tb = s9.shapes.add_textbox(x, y, card_w9, Inches(2.6))
        tf = tb.text_frame
        tf.word_wrap = True

        p_n = tf.paragraphs[0]
        r_n = add_run(p_n, name)
        r_n.font.name = FONT_HEADING
        r_n.font.size = Pt(10.5)
        r_n.font.bold = True
        r_n.font.color.rgb = WHITE

        p_r = tf.add_paragraph()
        r_r = add_run(p_r, f"ROLL: {roll}")
        r_r.font.name = FONT_BODY
        r_r.font.size = Pt(8.5)
        r_r.font.bold = True
        r_r.font.color.rgb = LIME

        p_ro = tf.add_paragraph()
        p_ro.space_before = Pt(2)
        r_ro = add_run(p_ro, role)
        r_ro.font.name = FONT_HEADING
        r_ro.font.size = Pt(8.5)
        r_ro.font.bold = True
        r_ro.font.color.rgb = MUTED_GREY

        p_d = tf.add_paragraph()
        p_d.space_before = Pt(4)
        r_d = add_run(p_d, desc)
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(8.5)
        r_d.font.color.rgb = MUTED_GREY

    # =========================================================================
    # SLIDE 10: CONCLUSION & THANK YOU
    # =========================================================================
    s10 = create_slide(prs)
    add_header_brand(s10, "CAMPUS DEPLOYMENT")

    # Landscape Banner Image at Top Center
    if os.path.exists("t2_slide_10_X4.jpg"):
        s10.shapes.add_picture("t2_slide_10_X4.jpg", Inches(3.2), Inches(1.1), Inches(6.8), Inches(1.8))

    # Sun / Starburst Graphic on Right in Lime
    tb_sun = s10.shapes.add_textbox(Inches(11.2), Inches(1.2), Inches(1.5), Inches(1.5))
    tf_sun = tb_sun.text_frame
    p_sun = tf_sun.paragraphs[0]
    r_sun = add_run(p_sun, "☼")
    r_sun.font.name = FONT_DISPLAY
    r_sun.font.size = Pt(72)
    r_sun.font.color.rgb = LIME

    # Left: Big Title
    tb_s10_t = s10.shapes.add_textbox(Inches(0.8), Inches(3.2), Inches(5.5), Inches(1.8))
    tf_s10_t = tb_s10_t.text_frame
    tf_s10_t.word_wrap = True
    p = tf_s10_t.paragraphs[0]
    r = add_run(p, "THANK\nYOU.")
    r.font.name = FONT_DISPLAY
    r.font.size = Pt(56)
    r.font.bold = True
    r.font.color.rgb = LIME

    tb_s10_q = s10.shapes.add_textbox(Inches(0.8), Inches(5.2), Inches(5.5), Inches(1.8))
    tf_s10_q = tb_s10_q.text_frame
    tf_s10_q.word_wrap = True
    p = tf_s10_q.paragraphs[0]
    r = add_run(p, "“We don’t replace the people already solving the problem.\nWe give them a smarter way to solve it.”")
    r.font.name = FONT_HEADING
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = WHITE

    # Right: Contact & Institutional Info
    tb_s10_r = s10.shapes.add_textbox(Inches(7.2), Inches(3.4), Inches(5.3), Inches(3.5))
    tf_s10_r = tb_s10_r.text_frame
    tf_s10_r.word_wrap = True

    p = tf_s10_r.paragraphs[0]
    r = add_run(p, "CONTACT & PORTAL ACCESS:")
    r.font.name = FONT_HEADING
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = LIME

    contacts = [
        ("CAMPUS WEB PORTAL", "https://findback.heritageit.edu"),
        ("CENTRAL VAULT DESK", "Room 101, Ground Floor, Central Block"),
        ("INSTITUTIONAL EMAIL", "support@findback.heritageit.edu"),
        ("ACADEMIC DEPARTMENT", "CSE (IoT & Cyber Security with Blockchain)"),
        ("INNOVATION LAB", "Design Thinking & Ideation Lab 2026")
    ]

    for label, val in contacts:
        p_c = tf_s10_r.add_paragraph()
        p_c.space_before = Pt(8)
        r_cl = add_run(p_c, f"• {label}:\n  ")
        r_cl.font.name = FONT_HEADING
        r_cl.font.size = Pt(10)
        r_cl.font.bold = True
        r_cl.font.color.rgb = WHITE

        r_cv = add_run(p_c, val)
        r_cv.font.name = FONT_BODY
        r_cv.font.size = Pt(9.5)
        r_cv.font.color.rgb = MUTED_GREY

    output_path = "FindBack_Project_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    build_deck()
