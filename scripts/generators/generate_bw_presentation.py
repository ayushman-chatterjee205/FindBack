import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# Color Palette Constants (Brutalist Black & White with Space Aesthetic)
BG_IMAGE = "template_bg.jpg"
DARK_OBSIDIAN = RGBColor(12, 15, 22)
CARD_BG = RGBColor(18, 22, 32)
CARD_BORDER = RGBColor(90, 105, 130)
CARD_BORDER_BRIGHT = RGBColor(200, 215, 235)
WHITE = RGBColor(255, 255, 255)
SLATE_MUTED = RGBColor(148, 163, 184)
SLATE_LIGHT = RGBColor(226, 232, 240)
EMERALD_ACCENT = RGBColor(52, 211, 153)
ALERT_ACCENT = RGBColor(248, 113, 113)
PILL_BG = RGBColor(255, 255, 255)
PILL_TEXT = RGBColor(12, 15, 22)

FONT_TITLE = "Trebuchet MS"
FONT_HEADING = "Trebuchet MS"
FONT_BODY = "Calibri"

def add_run(p, text=""):
    r = p.add_run()
    r.text = text
    return r

def create_base_slide(prs):
    blank_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_layout)
    if os.path.exists(BG_IMAGE):
        slide.shapes.add_picture(BG_IMAGE, 0, 0, prs.slide_width, prs.slide_height)
    else:
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = DARK_OBSIDIAN
        bg.line.fill.background()
    return slide

def add_top_bar(slide, left_text="HERITAGE INSTITUTE OF TECHNOLOGY", right_badge="FINDBACK ↗"):
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(8.0), Inches(0.35))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = left_text.upper()
    p.font.name = FONT_HEADING
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = SLATE_MUTED

    tb_r = slide.shapes.add_textbox(Inches(9.2), Inches(0.4), Inches(3.33), Inches(0.35))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True
    p_r = tf_r.paragraphs[0]
    p_r.alignment = PP_ALIGN.RIGHT
    p_r.text = right_badge.upper()
    p_r.font.name = FONT_HEADING
    p_r.font.size = Pt(9.5)
    p_r.font.bold = True
    p_r.font.color.rgb = WHITE

    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.78), Inches(11.73), Inches(0.015))
    line.fill.solid()
    line.fill.fore_color.rgb = CARD_BORDER
    line.line.fill.background()

def add_footer(slide, current_slide, total_slides=10):
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.92), Inches(11.73), Inches(0.015))
    line.fill.solid()
    line.fill.fore_color.rgb = CARD_BORDER
    line.line.fill.background()

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(7.02), Inches(9.0), Inches(0.3))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "FINDBACK: THE CAMPUS CUSTODY & RECOVERY NETWORK • DESIGN THINKING & IDEATION LAB"
    p.font.name = FONT_BODY
    p.font.size = Pt(8.5)
    p.font.color.rgb = SLATE_MUTED

    tb_r = slide.shapes.add_textbox(Inches(10.0), Inches(7.02), Inches(2.53), Inches(0.3))
    tf_r = tb_r.text_frame
    p_r = tf_r.paragraphs[0]
    p_r.alignment = PP_ALIGN.RIGHT
    p_r.text = f"{current_slide:02d} / {total_slides:02d}"
    p_r.font.name = FONT_HEADING
    p_r.font.size = Pt(9)
    p_r.font.bold = True
    p_r.font.color.rgb = WHITE

def add_card(slide, left, top, width, height, bg_rgb=CARD_BG, border_rgb=CARD_BORDER):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_rgb
    shape.line.color.rgb = border_rgb
    shape.line.width = Pt(1)
    return shape

def add_pill(slide, left, top, text, width=Inches(2.5), height=Inches(0.32)):
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    pill.fill.solid()
    pill.fill.fore_color.rgb = PILL_BG
    pill.line.fill.background()
    tf = pill.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = add_run(p, text.upper())
    r.font.name = FONT_HEADING
    r.font.size = Pt(8.5)
    r.font.bold = True
    r.font.color.rgb = PILL_TEXT
    return pill

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # =========================================================================
    # SLIDE 1: COVER
    # =========================================================================
    s1 = create_base_slide(prs)
    add_top_bar(s1, "CSE (IOT & CYBER SECURITY INCLUDING BLOCKCHAIN TECHNOLOGY)", "PITCH DECK ↗")
    
    add_pill(s1, Inches(0.8), Inches(1.1), "DESIGN THINKING & IDEATION LAB", width=Inches(3.2), height=Inches(0.32))

    tb_title = s1.shapes.add_textbox(Inches(0.75), Inches(1.5), Inches(11.8), Inches(2.2))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True
    p_t = tf_title.paragraphs[0]
    r_t = add_run(p_t, "FINDBACK")
    r_t.font.name = FONT_TITLE
    r_t.font.size = Pt(82)
    r_t.font.bold = True
    r_t.font.color.rgb = WHITE

    tb_sub = s1.shapes.add_textbox(Inches(0.8), Inches(3.4), Inches(11.7), Inches(0.8))
    tf_sub = tb_sub.text_frame
    tf_sub.word_wrap = True
    p_s = tf_sub.paragraphs[0]
    r_s = add_run(p_s, "AI-POWERED DIGITAL LOST & FOUND FOR EDUCATIONAL CAMPUSES")
    r_s.font.name = FONT_HEADING
    r_s.font.size = Pt(20)
    r_s.font.bold = True
    r_s.font.color.rgb = SLATE_LIGHT

    tb_tag = s1.shapes.add_textbox(Inches(0.8), Inches(4.2), Inches(11.7), Inches(0.5))
    tf_tag = tb_tag.text_frame
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = "LOST  ↗  REGISTERED  ↗  AI MATCHED  ↗  BLIND VERIFIED  ↗  SECURELY RETURNED"
    p_tag.font.name = FONT_HEADING
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = WHITE

    card_w = Inches(3.75)
    gap = Inches(0.24)
    y_card = Inches(4.9)
    h_card = Inches(1.75)

    # Card 1: Institution
    add_card(s1, Inches(0.8), y_card, card_w, h_card)
    tb_c1 = s1.shapes.add_textbox(Inches(0.95), y_card + Inches(0.12), card_w - Inches(0.3), h_card - Inches(0.2))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True
    p1 = tf_c1.paragraphs[0]
    p1.text = "INSTITUTION & LAB"
    p1.font.name = FONT_HEADING
    p1.font.size = Pt(10)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1_sub = tf_c1.add_paragraph()
    p1_sub.space_before = Pt(4)
    p1_sub.text = "Heritage Institute of Technology, Kolkata\nDept of Computer Science & Engineering\nIoT & Cyber Security with Blockchain Tech"
    p1_sub.font.name = FONT_BODY
    p1_sub.font.size = Pt(9.5)
    p1_sub.font.color.rgb = SLATE_MUTED

    # Card 2: Tech Stack
    add_card(s1, Inches(0.8) + card_w + gap, y_card, card_w, h_card)
    tb_c2 = s1.shapes.add_textbox(Inches(0.95) + card_w + gap, y_card + Inches(0.12), card_w - Inches(0.3), h_card - Inches(0.2))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True
    p2 = tf_c2.paragraphs[0]
    p2.text = "ARCHITECTURE FOUNDATION"
    p2.font.name = FONT_HEADING
    p2.font.size = Pt(10)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2_sub = tf_c2.add_paragraph()
    p2_sub.space_before = Pt(4)
    p2_sub.text = "• Decoupled Next.js 14 App Router + FastAPI\n• 4-Signal Multi-Modal AI Engine (Threshold ≥ 75%)\n• Blind Proof & 60-min Dynamic QR Pass"
    p2_sub.font.name = FONT_BODY
    p2_sub.font.size = Pt(9.5)
    p2_sub.font.color.rgb = SLATE_MUTED

    # Card 3: Team
    add_card(s1, Inches(0.8) + (card_w + gap)*2, y_card, card_w, h_card)
    tb_c3 = s1.shapes.add_textbox(Inches(0.95) + (card_w + gap)*2, y_card + Inches(0.12), card_w - Inches(0.3), h_card - Inches(0.2))
    tf_c3 = tb_c3.text_frame
    tf_c3.word_wrap = True
    p3 = tf_c3.paragraphs[0]
    p3.text = "PROJECT TEAM"
    p3.font.name = FONT_HEADING
    p3.font.size = Pt(10)
    p3.font.bold = True
    p3.font.color.rgb = WHITE
    p3_sub = tf_c3.add_paragraph()
    p3_sub.space_before = Pt(4)
    p3_sub.text = "Ayushman Chatterjee (2563002)\nNiladri Mukherjee (2563001) • Rishi Mishra (2563020)\nAnkit Patel (2563021) • Erina Kar (2563022)"
    p3_sub.font.name = FONT_BODY
    p3_sub.font.size = Pt(9.5)
    p3_sub.font.color.rgb = SLATE_MUTED

    add_footer(s1, 1)

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT
    # =========================================================================
    s2 = create_base_slide(prs)
    add_top_bar(s2, "CAMPUS RECOVERY CHALLENGES", "PROBLEM STATEMENT ↗")

    tb_h2 = s2.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.73), Inches(1.1))
    tf_h2 = tb_h2.text_frame
    tf_h2.word_wrap = True
    p_h2 = tf_h2.paragraphs[0]
    r_h2 = add_run(p_h2, "PROBLEM STATEMENT")
    r_h2.font.name = FONT_TITLE
    r_h2.font.size = Pt(38)
    r_h2.font.bold = True
    r_h2.font.color.rgb = WHITE

    p_h2_sub = tf_h2.add_paragraph()
    p_h2_sub.text = "THE LOST & FOUND GAP: WHY CURRENT CAMPUS OPERATIONS BREAK DOWN"
    p_h2_sub.font.name = FONT_HEADING
    p_h2_sub.font.size = Pt(12)
    p_h2_sub.font.bold = True
    p_h2_sub.font.color.rgb = SLATE_MUTED

    col_w = Inches(5.72)
    col_gap = Inches(0.29)
    y_p2 = Inches(2.25)
    h_p2 = Inches(4.35)

    # Left Column: Campus Discovery Gap
    add_card(s2, Inches(0.8), y_p2, col_w, h_p2)
    tb_col1 = s2.shapes.add_textbox(Inches(1.05), y_p2 + Inches(0.2), col_w - Inches(0.5), h_p2 - Inches(0.4))
    tf_col1 = tb_col1.text_frame
    tf_col1.word_wrap = True
    
    p = tf_col1.paragraphs[0]
    p.text = "01 / THE CAMPUS DISCOVERY GAP"
    p.font.name = FONT_HEADING
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = WHITE

    points1 = [
        ("High-Velocity Multi-Block Campus", "Higher education institutions operate as bustling micro-cities. At Heritage Institute of Technology, thousands of students navigate 5 major building complexes (CME, Central, ICT, Mechanical, Science) across multi-floor lecture theatres, high-precision laboratories, and common cafeterias."),
        ("High Incidence Rate", "Belongings such as scientific calculators, laptops, lab coats, identity cards, and keys are frequently misplaced during rapid classroom transitions. Survey data confirms over 60% of students have lost high-value items during their academic semester."),
        ("Information Fragmentation", "Lost item notices are scattered unpredictably across unmoderated WhatsApp group chats, departmental message boards, and social media feeds, leaving seekers with zero central visibility or indexed searchable archive.")
    ]
    for title, desc in points1:
        p_item = tf_col1.add_paragraph()
        p_item.space_before = Pt(12)
        r_t = add_run(p_item, f"• {title}: ")
        r_t.font.bold = True
        r_t.font.size = Pt(10)
        r_t.font.color.rgb = SLATE_LIGHT
        r_d = add_run(p_item, desc)
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = SLATE_MUTED

    # Right Column: The Manual Breakdown
    add_card(s2, Inches(0.8) + col_w + col_gap, y_p2, col_w, h_p2)
    tb_col2 = s2.shapes.add_textbox(Inches(1.05) + col_w + col_gap, y_p2 + Inches(0.2), col_w - Inches(0.5), h_p2 - Inches(0.4))
    tf_col2 = tb_col2.text_frame
    tf_col2.word_wrap = True

    p = tf_col2.paragraphs[0]
    p.text = "02 / THE MANUAL BREAKDOWN"
    p.font.name = FONT_HEADING
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = WHITE

    points2 = [
        ("Manual Paper-Bound Logging", "Campus security guards and departmental staff record found items in physical bound logbooks. Descriptions are brief, handwriting is often illegible, and there is no cross-departmental synchronization between building kiosks."),
        ("Exhausting Physical Legwork", "Students must physically walk between multiple gate security desks, faculty rooms, and lab offices across distant campus blocks, often revisiting repeatedly over weeks with critically low recovery satisfaction (2.4 / 5.0)."),
        ("Verification & Custody Vulnerability", "Handing over found items relies almost entirely on informal verbal claims ('it's a black Casio calculator'). Without tamper-proof custody or secret verification, items risk being misidentified, claimed falsely, or left abandoned indefinitely.")
    ]
    for title, desc in points2:
        p_item = tf_col2.add_paragraph()
        p_item.space_before = Pt(12)
        r_t = add_run(p_item, f"• {title}: ")
        r_t.font.bold = True
        r_t.font.size = Pt(10)
        r_t.font.color.rgb = SLATE_LIGHT
        r_d = add_run(p_item, desc)
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = SLATE_MUTED

    add_footer(s2, 2)

    # =========================================================================
    # SLIDE 3: THE SOLUTION
    # =========================================================================
    s3 = create_base_slide(prs)
    add_top_bar(s3, "PLATFORM FOUNDATION", "THE SOLUTION ↗")

    tb_h3 = s3.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.73), Inches(1.1))
    tf_h3 = tb_h3.text_frame
    tf_h3.word_wrap = True
    p_h3 = tf_h3.paragraphs[0]
    r_h3 = add_run(p_h3, "THE SOLUTION: MEET FINDBACK")
    r_h3.font.name = FONT_TITLE
    r_h3.font.size = Pt(38)
    r_h3.font.bold = True
    r_h3.font.color.rgb = WHITE

    p_h3_sub = tf_h3.add_paragraph()
    p_h3_sub.text = "A DIGITAL LAYER OVER THE COLLEGE'S EXISTING LOST & FOUND INFRASTRUCTURE"
    p_h3_sub.font.name = FONT_HEADING
    p_h3_sub.font.size = Pt(12)
    p_h3_sub.font.bold = True
    p_h3_sub.font.color.rgb = SLATE_MUTED

    # Core Banner
    add_card(s3, Inches(0.8), Inches(2.2), Inches(11.73), Inches(0.65), bg_rgb=RGBColor(24, 30, 44), border_rgb=CARD_BORDER_BRIGHT)
    tb_b = s3.shapes.add_textbox(Inches(0.9), Inches(2.25), Inches(11.53), Inches(0.55))
    tf_b = tb_b.text_frame
    p_b = tf_b.paragraphs[0]
    p_b.alignment = PP_ALIGN.CENTER
    r_bq = add_run(p_b, '“We don’t replace the people already solving the problem. We give them a smarter way to solve it.”')
    r_bq.font.name = FONT_TITLE
    r_bq.font.size = Pt(13)
    r_bq.font.bold = True
    r_bq.font.color.rgb = WHITE

    # 3-Actor Cards
    card_w3 = Inches(3.75)
    gap3 = Inches(0.24)
    y_c3 = Inches(3.05)
    h_c3 = Inches(3.65)

    actors = [
        ("01 / THE STUDENT (REPORTER)", "Instantly reports lost items in 30 seconds", [
            ("Rapid Digital Filing", "Submits item category, title, photo, timestamp, and campus block/zone from any phone or PC."),
            ("Blind Proof Registration", "Stores hidden proprietary markings (serial numbers, engravings, stickers) securely without public disclosure."),
            ("Real-Time Automated Alerts", "Receives immediate notifications whenever an AI match threshold (≥ 75%) is triggered.")
        ]),
        ("02 / THE GOOD SAMARITAN (FINDER)", "Safely drops off found belongings", [
            ("Hassle-Free Handover", "Surrenders found items to the nearest campus security desk or files a quick discovery intake."),
            ("Zero Personal Exposure", "Protected from having their private personal phone number blasted across public WhatsApp groups."),
            ("Community Contribution", "Participates in campus integrity culture, turning lost items into registered custody in minutes.")
        ]),
        ("03 / THE CAMPUS CUSTODIAN", "Audits custody & executes verified return", [
            ("Central Vault Indexing", "Registers items into physical barcode-indexed crates (Bin #E-01 to #E-12, Central Block Room 101)."),
            ("Intelligent Verification", "Inspects blind ownership proof submitted by claimant before authorizing physical pickup."),
            ("Tamper-Proof Handover", "Scans student's 60-min dynamic cryptographic QR pass or enters 6-digit OTP to finalize return.")
        ])
    ]

    for i, (title, role, bullets) in enumerate(actors):
        x = Inches(0.8) + i * (card_w3 + gap3)
        add_card(s3, x, y_c3, card_w3, h_c3)
        tb = s3.shapes.add_textbox(x + Inches(0.18), y_c3 + Inches(0.18), card_w3 - Inches(0.36), h_c3 - Inches(0.36))
        tf = tb.text_frame
        tf.word_wrap = True

        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE

        p_r = tf.add_paragraph()
        p_r.text = role.upper()
        p_r.font.name = FONT_BODY
        p_r.font.size = Pt(9)
        p_r.font.bold = True
        p_r.font.color.rgb = SLATE_LIGHT

        for b_title, b_desc in bullets:
            p_b = tf.add_paragraph()
            p_b.space_before = Pt(8)
            r_bt = add_run(p_b, f"• {b_title}: ")
            r_bt.font.bold = True
            r_bt.font.size = Pt(9.5)
            r_bt.font.color.rgb = WHITE
            r_bd = add_run(p_b, b_desc)
            r_bd.font.size = Pt(9)
            r_bd.font.color.rgb = SLATE_MUTED

    add_footer(s3, 3)

    # =========================================================================
    # SLIDE 4: CAMPUS DATA & OPPORTUNITY
    # =========================================================================
    s4 = create_base_slide(prs)
    add_top_bar(s4, "USER RESEARCH & DISCOVERY", "SURVEY METRICS ↗")

    tb_h4 = s4.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.73), Inches(1.1))
    tf_h4 = tb_h4.text_frame
    tf_h4.word_wrap = True
    p_h4 = tf_h4.paragraphs[0]
    r_h4 = add_run(p_h4, "CAMPUS DATA & OPPORTUNITY")
    r_h4.font.name = FONT_TITLE
    r_h4.font.size = Pt(38)
    r_h4.font.bold = True
    r_h4.font.color.rgb = WHITE

    p_h4_sub = tf_h4.add_paragraph()
    p_h4_sub.text = "EMPIRICAL RESEARCH FINDINGS FROM HERITAGE INSTITUTE OF TECHNOLOGY STUDENTS"
    p_h4_sub.font.name = FONT_HEADING
    p_h4_sub.font.size = Pt(12)
    p_h4_sub.font.bold = True
    p_h4_sub.font.color.rgb = SLATE_MUTED

    box_w = Inches(2.75)
    box_gap = Inches(0.24)
    y_box = Inches(2.3)
    h_box = Inches(2.3)

    metrics = [
        ("60%", "LOSS INCIDENCE RATE", "12 of 20 surveyed students reported losing valuable personal items on campus during this semester alone."),
        ("2.4 / 5", "SATISFACTION SCORE", "Average student satisfaction with current legacy paper lost-and-found and WhatsApp inquiries is critically low."),
        ("3.4 / 5", "INFO DISCOVERY EASE", "Students struggle significantly to determine which department or security desk holds their lost property."),
        ("90%+", "RECOVERY SPEEDUP", "Projected reduction in retrieval latency—from an average of 4-7 days down to under 4 hours via automated AI.")
    ]

    for i, (val, label, desc) in enumerate(metrics):
        x = Inches(0.8) + i * (box_w + box_gap)
        add_card(s4, x, y_box, box_w, h_box, bg_rgb=RGBColor(20, 25, 36), border_rgb=CARD_BORDER_BRIGHT)
        tb = s4.shapes.add_textbox(x + Inches(0.15), y_box + Inches(0.15), box_w - Inches(0.3), h_box - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p_v = tf.paragraphs[0]
        p_v.alignment = PP_ALIGN.CENTER
        r_v = add_run(p_v, val)
        r_v.font.name = FONT_TITLE
        r_v.font.size = Pt(44)
        r_v.font.bold = True
        r_v.font.color.rgb = WHITE

        p_l = tf.add_paragraph()
        p_l.alignment = PP_ALIGN.CENTER
        p_l.space_before = Pt(4)
        r_l = add_run(p_l, label)
        r_l.font.name = FONT_HEADING
        r_l.font.size = Pt(10)
        r_l.font.bold = True
        r_l.font.color.rgb = SLATE_LIGHT

        p_d = tf.add_paragraph()
        p_d.space_before = Pt(8)
        r_d = add_run(p_d, desc)
        r_d.font.name = FONT_BODY
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = SLATE_MUTED

    add_card(s4, Inches(0.8), Inches(4.85), Inches(11.73), Inches(1.85))
    tb_syn = s4.shapes.add_textbox(Inches(1.05), Inches(4.98), Inches(11.23), Inches(1.58))
    tf_syn = tb_syn.text_frame
    tf_syn.word_wrap = True

    p_st = tf_syn.paragraphs[0]
    p_st.text = "KEY RESEARCH INSIGHT & OPPORTUNITY"
    p_st.font.name = FONT_HEADING
    p_st.font.size = Pt(13)
    p_st.font.bold = True
    p_st.font.color.rgb = WHITE

    p_sb = tf_syn.add_paragraph()
    p_sb.space_before = Pt(6)
    p_sb.text = (
        "The problem on campus isn't an absence of goodwill or physical security kiosks—it is the profound absence of "
        "visibility, real-time intelligence, and cryptographic verification. Staff want to return items, and students want to find them. "
        "By digitizing intake into indexed Central Vault storage bins (Room 101) and deploying multi-signal AI matching with blind "
        "ownership challenges, FindBack connects finders and owners with zero administrative friction and 100% chain-of-custody certainty."
    )
    p_sb.font.name = FONT_BODY
    p_sb.font.size = Pt(10.5)
    p_sb.font.color.rgb = SLATE_MUTED

    add_footer(s4, 4)

    # =========================================================================
    # SLIDE 5: CUSTODY WORKFLOW
    # =========================================================================
    s5 = create_base_slide(prs)
    add_top_bar(s5, "OPERATIONAL LIFECYCLE", "SERVICE OVERVIEW ↗")

    tb_h5 = s5.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.73), Inches(1.1))
    tf_h5 = tb_h5.text_frame
    tf_h5.word_wrap = True
    p_h5 = tf_h5.paragraphs[0]
    r_h5 = add_run(p_h5, "CUSTODY WORKFLOW")
    r_h5.font.name = FONT_TITLE
    r_h5.font.size = Pt(38)
    r_h5.font.bold = True
    r_h5.font.color.rgb = WHITE

    p_h5_sub = tf_h5.add_paragraph()
    p_h5_sub.text = "ONE UNIFIED WORKFLOW. SIX SECURE TRACEABLE STEPS."
    p_h5_sub.font.name = FONT_HEADING
    p_h5_sub.font.size = Pt(12)
    p_h5_sub.font.bold = True
    p_h5_sub.font.color.rgb = SLATE_MUTED

    step_w = Inches(3.75)
    step_gap = Inches(0.24)
    h_step = Inches(2.1)

    steps = [
        ("01 / REPORT", "Student Files Loss Report", "The student logs in with institutional @heritageit.edu credentials, selects category, inputs loss location, estimated timestamp, and confidential blind proof."),
        ("02 / REGISTER", "Staff Logs Physical Intake", "Security officer enters found item details at the Central Vault desk. Item is assigned a physical custody bin (Bin #E-01 to #E-12) with instant intake timestamp."),
        ("03 / AI MATCH", "Multi-Signal Similarity Engine", "Background pipeline evaluates candidate pairs across 4 signals: semantic text (35%), image embeddings (35%), spatial block proximity (15%), and time decay (15%)."),
        ("04 / NOTIFY", "Instant Proactive Alert", "When composite score reaches or exceeds 75%, an automated alert notification and dashboard badge are instantly dispatched to the student's authenticated portal."),
        ("05 / BLIND VERIFY", "Ownership Proof Verification", "Student enters secret identifying marks (engravings, stickers, unique scratches). Staff verifies this private challenge on the console without exposing data publicly."),
        ("06 / RETURN", "Dynamic QR Handover at Vault", "Student visits Central Vault Room 101 and presents a 60-minute cryptographic dynamic QR pass or 6-digit OTP. Handover is logged with permanent audit trail.")
    ]

    for i, (num_title, title, desc) in enumerate(steps):
        row = i // 3
        col = i % 3
        x = Inches(0.8) + col * (step_w + step_gap)
        y = Inches(2.3) + row * (h_step + Inches(0.2))

        add_card(s5, x, y, step_w, h_step)
        tb = s5.shapes.add_textbox(x + Inches(0.18), y + Inches(0.15), step_w - Inches(0.36), h_step - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p_t = tf.paragraphs[0]
        p_t.text = num_title
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE

        p_s = tf.add_paragraph()
        p_s.text = title.upper()
        p_s.font.name = FONT_BODY
        p_s.font.size = Pt(9)
        p_s.font.bold = True
        p_s.font.color.rgb = SLATE_LIGHT

        p_d = tf.add_paragraph()
        p_d.space_before = Pt(6)
        p_d.text = desc
        p_d.font.name = FONT_BODY
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = SLATE_MUTED

    add_footer(s5, 5)

    # =========================================================================
    # SLIDE 6: SYSTEM ARCHITECTURE & CUSTODY MODEL
    # =========================================================================
    s6 = create_base_slide(prs)
    add_top_bar(s6, "TECHNICAL ARCHITECTURE", "SYSTEM & CUSTODY MODEL ↗")

    tb_h6 = s6.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.73), Inches(1.1))
    tf_h6 = tb_h6.text_frame
    tf_h6.word_wrap = True
    p_h6 = tf_h6.paragraphs[0]
    r_h6 = add_run(p_h6, "SYSTEM ARCHITECTURE")
    r_h6.font.name = FONT_TITLE
    r_h6.font.size = Pt(38)
    r_h6.font.bold = True
    r_h6.font.color.rgb = WHITE

    p_h6_sub = tf_h6.add_paragraph()
    p_h6_sub.text = "DECOUPLED ASYNCHRONOUS FULL-STACK PLATFORM & PHYSICAL VAULT MODEL"
    p_h6_sub.font.name = FONT_HEADING
    p_h6_sub.font.size = Pt(12)
    p_h6_sub.font.bold = True
    p_h6_sub.font.color.rgb = SLATE_MUTED

    col_w6 = Inches(3.75)
    gap6 = Inches(0.24)
    y_c6 = Inches(2.25)
    h_c6 = Inches(4.35)

    arch_pillars = [
        ("01 / FULL-STACK PLATFORM", "Modern, Reactive & Decoupled", [
            ("Next.js 14 App Router", "Server and client components, React 18, TypeScript, Tailwind CSS, Lucide Icons."),
            ("FastAPI Asynchronous Core", "High-throughput asynchronous Python REST API with dependency injection."),
            ("SQLAlchemy 2.0 ORM", "Structured entity models: User, LostReport, FoundItem, CustodyBin, Claim, HandoverAudit."),
            ("Client State Resilience", "Client-side Network State Detector with offline failover and session expiry protection for shared lab computers.")
        ]),
        ("02 / CUSTODY VAULT MODEL", "Physical Campus Asset Hierarchy", [
            ("5 Campus Blocks Mapped", "Hierarchical zone indexing: CME, Heritage Central, ICT, Mechanical, and Science Blocks."),
            ("Central Vault Room 101", "Physical security repository located at Central Block Ground Floor."),
            ("Barcode-Indexed Storage", "Physical lockable crates (Bin #E-01 to #E-12) for electronics, books, and valuables."),
            ("Custody Transfer Audit", "Every bin assignment, item movement, and handover is time-stamped and signed.")
        ]),
        ("03 / OWASP API SECURITY", "Multi-Tiered Security Hardening", [
            ("Argon2id Password Hashing", "State-of-the-art password protection against GPU dictionary attacks."),
            ("Stateless JWT Authentication", "Cryptographic Bearer tokens with strict 60-min expiration windows."),
            ("Role-Based Access Control", "Granular role gates: STUDENT (reports), STAFF (vault check-in), ADMIN (supervision)."),
            ("Adaptive Rate Limiting", "OWASP compliant rate limiting: 5 req/min on authentication, 60 req/min general endpoints.")
        ])
    ]

    for i, (title, sub, bullets) in enumerate(arch_pillars):
        x = Inches(0.8) + i * (col_w6 + gap6)
        add_card(s6, x, y_c6, col_w6, h_c6)
        tb = s6.shapes.add_textbox(x + Inches(0.18), y_c6 + Inches(0.18), col_w6 - Inches(0.36), h_c6 - Inches(0.36))
        tf = tb.text_frame
        tf.word_wrap = True

        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE

        p_s = tf.add_paragraph()
        p_s.text = sub.upper()
        p_s.font.name = FONT_BODY
        p_s.font.size = Pt(9)
        p_s.font.bold = True
        p_s.font.color.rgb = SLATE_LIGHT

        for b_t, b_d in bullets:
            p_b = tf.add_paragraph()
            p_b.space_before = Pt(10)
            r_bt = add_run(p_b, f"• {b_t}: ")
            r_bt.font.bold = True
            r_bt.font.size = Pt(9.5)
            r_bt.font.color.rgb = WHITE
            r_bd = add_run(p_b, b_d)
            r_bd.font.size = Pt(9)
            r_bd.font.color.rgb = SLATE_MUTED

    add_footer(s6, 6)

    # =========================================================================
    # SLIDE 7: PROTOCOL ANALYSIS & COMPARISON MATRIX
    # =========================================================================
    s7 = create_base_slide(prs)
    add_top_bar(s7, "SECURITY & PROTOCOL BENCHMARK", "PROTOCOL ANALYSIS ↗")

    tb_h7 = s7.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.73), Inches(1.1))
    tf_h7 = tb_h7.text_frame
    tf_h7.word_wrap = True
    p_h7 = tf_h7.paragraphs[0]
    r_h7 = add_run(p_h7, "PROTOCOL ANALYSIS")
    r_h7.font.name = FONT_TITLE
    r_h7.font.size = Pt(38)
    r_h7.font.bold = True
    r_h7.font.color.rgb = WHITE

    p_h7_sub = tf_h7.add_paragraph()
    p_h7_sub.text = "LEGACY CAMPUS METHODS VS. FINDBACK DIGITAL CUSTODY PROTOCOL"
    p_h7_sub.font.name = FONT_HEADING
    p_h7_sub.font.size = Pt(12)
    p_h7_sub.font.bold = True
    p_h7_sub.font.color.rgb = SLATE_MUTED

    y_table = Inches(2.25)
    h_table = Inches(4.35)
    add_card(s7, Inches(0.8), y_table, Inches(11.73), h_table)

    comparisons = [
        ("DISCOVERY MECHANISM", "Scattered WhatsApp chats, notice boards, word-of-mouth. Zero searchability or indexing.", "Centralized indexed digital catalog with multi-signal search across all 5 campus blocks."),
        ("CUSTODY TRACKING", "Dispersed haphazardly across gate kiosks and faculty desks. High loss/abandonment.", "Physical Central Vault Room 101 with barcode-indexed custody bins (#E-01 to #E-12)."),
        ("OWNERSHIP PROOF", "Informal verbal claims ('it's a black Casio'). Highly vulnerable to social engineering.", "Blind Proof Architecture: Private secret identifiers stored encrypted and verified blindly."),
        ("HANDOVER SECURITY", "Unrecorded or handwritten signatures in physical bound paper logbooks.", "60-Minute Dynamic Cryptographic QR Pass + 6-digit OTP verified live at custody desk."),
        ("STUDENT PRIVACY", "Personal mobile numbers and email addresses exposed on public bulletin boards.", "Complete PII Masking: Automated relays ensure zero personal contact info is ever made public.")
    ]

    tb_th = s7.shapes.add_textbox(Inches(1.05), y_table + Inches(0.12), Inches(11.23), Inches(0.4))
    tf_th = tb_th.text_frame
    p_th = tf_th.paragraphs[0]
    r1 = add_run(p_th, f"{'OPERATIONAL DIMENSION':<26}")
    r1.font.bold = True
    r1.font.size = Pt(9.5)
    r1.font.color.rgb = SLATE_LIGHT
    r2 = add_run(p_th, f"{'LEGACY CAMPUS OPERATION':<42}")
    r2.font.bold = True
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = ALERT_ACCENT
    r3 = add_run(p_th, "FINDBACK PLATFORM PROTOCOL")
    r3.font.bold = True
    r3.font.size = Pt(9.5)
    r3.font.color.rgb = EMERALD_ACCENT

    row_h = Inches(0.72)
    for idx, (dim, legacy, findback) in enumerate(comparisons):
        y_r = y_table + Inches(0.55) + idx * row_h
        
        div = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.05), y_r, Inches(11.23), Inches(0.01))
        div.fill.solid()
        div.fill.fore_color.rgb = CARD_BORDER
        div.line.fill.background()

        tb_row = s7.shapes.add_textbox(Inches(1.05), y_r + Inches(0.04), Inches(11.23), row_h - Inches(0.06))
        tf_row = tb_row.text_frame
        tf_row.word_wrap = True

        p_r = tf_row.paragraphs[0]
        r_dim = add_run(p_r, dim + "\n")
        r_dim.font.name = FONT_HEADING
        r_dim.font.size = Pt(9.5)
        r_dim.font.bold = True
        r_dim.font.color.rgb = WHITE

        p_desc = tf_row.add_paragraph()
        p_desc.space_before = Pt(2)
        r_leg = add_run(p_desc, "Legacy: " + legacy + "   |   ")
        r_leg.font.name = FONT_BODY
        r_leg.font.size = Pt(9)
        r_leg.font.color.rgb = SLATE_MUTED

        r_fb = add_run(p_desc, "FindBack: " + findback)
        r_fb.font.name = FONT_BODY
        r_fb.font.size = Pt(9)
        r_fb.font.color.rgb = SLATE_LIGHT

    add_footer(s7, 7)

    # =========================================================================
    # SLIDE 8: THE TEAM
    # =========================================================================
    s8 = create_base_slide(prs)
    add_top_bar(s8, "PROJECT CONTRIBUTORS", "THE TEAM ↗")

    tb_h8 = s8.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.73), Inches(1.1))
    tf_h8 = tb_h8.text_frame
    tf_h8.word_wrap = True
    p_h8 = tf_h8.paragraphs[0]
    r_h8 = add_run(p_h8, "THE TEAM")
    r_h8.font.name = FONT_TITLE
    r_h8.font.size = Pt(38)
    r_h8.font.bold = True
    r_h8.font.color.rgb = WHITE

    p_h8_sub = tf_h8.add_paragraph()
    p_h8_sub.text = "DEPT OF COMPUTER SCIENCE & ENGINEERING (IOT & CYBER SECURITY INCLUDING BLOCKCHAIN TECHNOLOGY)"
    p_h8_sub.font.name = FONT_HEADING
    p_h8_sub.font.size = Pt(12)
    p_h8_sub.font.bold = True
    p_h8_sub.font.color.rgb = SLATE_MUTED

    m_w = Inches(2.21)
    m_gap = Inches(0.17)
    y_m = Inches(2.25)
    h_m = Inches(4.35)

    team_members = [
        ("AYUSHMAN CHATTERJEE", "2563002", "ENGINEERING LEAD", [
            ("Full-Stack Integration", "End-to-end system synchronization between Next.js frontend and FastAPI backend."),
            ("State & Resilience", "Offline failover, network state detector, and session preservation on lab PCs.")
        ]),
        ("NILADRI MUKHERJEE", "2563001", "SYSTEMS ARCHITECT", [
            ("Custody Pipeline", "Architecture for campus vault, barcode bin allocation, and intake workflows."),
            ("Campus Spatial Graph", "Mapping 5 building complexes, multi-floor zones, and adjacency weighting.")
        ]),
        ("RISHI MISHRA", "2563020", "SECURITY LEAD", [
            ("OWASP Hardening", "Argon2id password hashing, stateless JWT tokens, and strict IP rate limiting."),
            ("Cryptographic Tokens", "60-minute dynamic QR pass generation and OTP verification routines.")
        ]),
        ("ANKIT PATEL", "2563021", "AI PIPELINE LEAD", [
            ("Multi-Signal AI", "Mathematical formulation: 35% text + 35% visual + 15% spatial + 15% temporal."),
            ("Vector Similarity", "Semantic token matching, visual feature cosine distances, and threshold gating.")
        ]),
        ("ERINA KAR", "2563022", "FRONTEND & UX LEAD", [
            ("Brutalist UI/UX", "High-contrast editorial design system, accessible navigation, responsive layouts."),
            ("Interactive Flows", "Blind claim modal dialogs, loading animations, and celebratory recovery feedback.")
        ])
    ]

    for i, (name, roll, role, specs) in enumerate(team_members):
        x = Inches(0.8) + i * (m_w + m_gap)
        add_card(s8, x, y_m, m_w, h_m)
        tb = s8.shapes.add_textbox(x + Inches(0.12), y_m + Inches(0.15), m_w - Inches(0.24), h_m - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p_name = tf.paragraphs[0]
        p_name.text = name
        p_name.font.name = FONT_HEADING
        p_name.font.size = Pt(11)
        p_name.font.bold = True
        p_name.font.color.rgb = WHITE

        p_roll = tf.add_paragraph()
        p_roll.text = f"ROLL: {roll}"
        p_roll.font.name = FONT_BODY
        p_roll.font.size = Pt(8.5)
        p_roll.font.bold = True
        p_roll.font.color.rgb = SLATE_LIGHT

        p_role = tf.add_paragraph()
        p_role.space_before = Pt(4)
        p_role.text = role
        p_role.font.name = FONT_HEADING
        p_role.font.size = Pt(8.5)
        p_role.font.bold = True
        p_role.font.color.rgb = CARD_BORDER_BRIGHT

        for s_t, s_d in specs:
            p_s = tf.add_paragraph()
            p_s.space_before = Pt(10)
            r_st = add_run(p_s, f"• {s_t}:\n")
            r_st.font.bold = True
            r_st.font.size = Pt(8.5)
            r_st.font.color.rgb = WHITE
            r_sd = add_run(p_s, s_d)
            r_sd.font.size = Pt(8)
            r_sd.font.color.rgb = SLATE_MUTED

    add_footer(s8, 8)

    # =========================================================================
    # SLIDE 9: AI MATCHING ENGINE & STATISTIC
    # =========================================================================
    s9 = create_base_slide(prs)
    add_top_bar(s9, "MULTI-SIGNAL INTELLIGENCE", "AI MATCHING ENGINE ↗")

    tb_h9 = s9.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.73), Inches(1.1))
    tf_h9 = tb_h9.text_frame
    tf_h9.word_wrap = True
    p_h9 = tf_h9.paragraphs[0]
    r_h9 = add_run(p_h9, "AI MATCHING ENGINE")
    r_h9.font.name = FONT_TITLE
    r_h9.font.size = Pt(38)
    r_h9.font.bold = True
    r_h9.font.color.rgb = WHITE

    p_h9_sub = tf_h9.add_paragraph()
    p_h9_sub.text = "MULTI-SIGNAL COMPOSITE FORMULATION & REAL-WORLD EMPIRICAL CASE STUDY"
    p_h9_sub.font.name = FONT_HEADING
    p_h9_sub.font.size = Pt(12)
    p_h9_sub.font.bold = True
    p_h9_sub.font.color.rgb = SLATE_MUTED

    w_left9 = Inches(6.5)
    y_s9 = Inches(2.25)
    h_s9 = Inches(4.35)

    add_card(s9, Inches(0.8), y_s9, w_left9, h_s9)
    tb_l9 = s9.shapes.add_textbox(Inches(1.05), y_s9 + Inches(0.2), w_left9 - Inches(0.5), h_s9 - Inches(0.4))
    tf_l9 = tb_l9.text_frame
    tf_l9.word_wrap = True

    p = tf_l9.paragraphs[0]
    p.text = "COMPOSITE MATCHING SCORE FORMULATION"
    p.font.name = FONT_HEADING
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p_eq = tf_l9.add_paragraph()
    p_eq.space_before = Pt(8)
    p_eq.text = "Score(L, F) = 0.35 · S_text + 0.35 · S_img + 0.15 · S_spatial + 0.15 · S_temporal"
    p_eq.font.name = FONT_TITLE
    p_eq.font.size = Pt(11.5)
    p_eq.font.bold = True
    p_eq.font.color.rgb = CARD_BORDER_BRIGHT

    signals = [
        ("35% — Text Semantic Similarity (S_text)", "Natural language tokenization, attribute embeddings, and title matching. Overcomes linguistic discrepancies (e.g., 'water bottle' vs. 'thermos flask')."),
        ("35% — Visual Image Cosine Similarity (S_img)", "Deep visual embeddings comparing form factor, primary color palette, and geometric proportions between user upload and custody intake photos."),
        ("15% — Spatial Proximity Weighting (S_spatial)", "Topological graph distances between the 5 campus blocks and floor levels, heavily weighting items found within contiguous movement paths."),
        ("15% — Temporal Decay Curve (S_temporal)", "Exponential decay formulation favoring items found closely following the reported loss timestamp (decay halflife = 72 hours).")
    ]

    for sig_t, sig_d in signals:
        p_sig = tf_l9.add_paragraph()
        p_sig.space_before = Pt(8)
        r_st = add_run(p_sig, f"• {sig_t}:\n")
        r_st.font.bold = True
        r_st.font.size = Pt(9.5)
        r_st.font.color.rgb = WHITE
        r_sd = add_run(p_sig, sig_d)
        r_sd.font.size = Pt(9)
        r_sd.font.color.rgb = SLATE_MUTED

    p_th = tf_l9.add_paragraph()
    p_th.space_before = Pt(10)
    r_th = add_run(p_th, "DECISION THRESHOLD: ")
    r_th.font.bold = True
    r_th.font.size = Pt(9.5)
    r_th.font.color.rgb = WHITE
    r_th_d = add_run(p_th, "Candidate alerts trigger automatically at composite score ≥ 75%. Staff verification remains mandatory.")
    r_th_d.font.size = Pt(9)
    r_th_d.font.color.rgb = SLATE_LIGHT

    w_r9 = Inches(4.94)
    x_r9 = Inches(0.8) + w_left9 + Inches(0.29)
    add_card(s9, x_r9, y_s9, w_r9, h_s9, bg_rgb=RGBColor(20, 25, 36), border_rgb=CARD_BORDER_BRIGHT)
    tb_r9 = s9.shapes.add_textbox(x_r9 + Inches(0.2), y_s9 + Inches(0.2), w_r9 - Inches(0.4), h_s9 - Inches(0.4))
    tf_r9 = tb_r9.text_frame
    tf_r9.word_wrap = True

    p = tf_r9.paragraphs[0]
    p.text = "EMPIRICAL CASE STUDY"
    p.font.name = FONT_HEADING
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p_score = tf_r9.add_paragraph()
    p_score.space_before = Pt(6)
    p_score.alignment = PP_ALIGN.CENTER
    r_sc = add_run(p_score, "93%")
    r_sc.font.name = FONT_TITLE
    r_sc.font.size = Pt(56)
    r_sc.font.bold = True
    r_sc.font.color.rgb = WHITE

    p_sc_l = tf_r9.add_paragraph()
    p_sc_l.alignment = PP_ALIGN.CENTER
    r_scl = add_run(p_sc_l, "POTENTIAL MATCH CONFIDENCE")
    r_scl.font.name = FONT_HEADING
    r_scl.font.size = Pt(10)
    r_scl.font.bold = True
    r_scl.font.color.rgb = EMERALD_ACCENT

    case_items = [
        ("Misplaced Belonging", "Black Casio fx-991CW Scientific Calculator"),
        ("Loss Report", "Reported lost in CME Block, CSE Lab 204 at 2:30 PM"),
        ("Custody Intake", "Registered at CME Security Desk at 2:50 PM (Bin #E-03)"),
        ("Automated Notification", "Alert sent to student within 12 seconds of intake"),
        ("Blind Proof Resolution", "Student verified custom sticker on battery compartment"),
        ("Total Recovery Latency", "32 minutes from intake to verified physical return")
    ]

    for label, val in case_items:
        p_c = tf_r9.add_paragraph()
        p_c.space_before = Pt(5)
        r_cl = add_run(p_c, f"{label}: ")
        r_cl.font.bold = True
        r_cl.font.size = Pt(9)
        r_cl.font.color.rgb = SLATE_LIGHT
        r_cv = add_run(p_c, val)
        r_cv.font.size = Pt(8.5)
        r_cv.font.color.rgb = SLATE_MUTED

    add_footer(s9, 9)

    # =========================================================================
    # SLIDE 10: CONCLUSION & INSTITUTIONAL IMPACT
    # =========================================================================
    s10 = create_base_slide(prs)
    add_top_bar(s10, "HERITAGE INSTITUTE OF TECHNOLOGY", "CONCLUSION ↗")

    tb_h10 = s10.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.73), Inches(1.1))
    tf_h10 = tb_h10.text_frame
    tf_h10.word_wrap = True
    p_h10 = tf_h10.paragraphs[0]
    r_h10 = add_run(p_h10, "THANK YOU")
    r_h10.font.name = FONT_TITLE
    r_h10.font.size = Pt(46)
    r_h10.font.bold = True
    r_h10.font.color.rgb = WHITE

    p_h10_sub = tf_h10.add_paragraph()
    p_h10_sub.text = "FINDBACK: THE STANDARD FOR MODERN CAMPUS CUSTODY & RECOVERY"
    p_h10_sub.font.name = FONT_HEADING
    p_h10_sub.font.size = Pt(12)
    p_h10_sub.font.bold = True
    p_h10_sub.font.color.rgb = SLATE_MUTED

    add_card(s10, Inches(0.8), Inches(2.3), Inches(11.73), Inches(0.85), bg_rgb=RGBColor(24, 30, 44), border_rgb=CARD_BORDER_BRIGHT)
    tb_q = s10.shapes.add_textbox(Inches(0.95), Inches(2.38), Inches(11.43), Inches(0.7))
    tf_q = tb_q.text_frame
    p_q = tf_q.paragraphs[0]
    p_q.alignment = PP_ALIGN.CENTER
    r_q = add_run(p_q, '“We don’t replace the people already solving the problem.\nWe give them a smarter way to solve it.”')
    r_q.font.name = FONT_TITLE
    r_q.font.size = Pt(13)
    r_q.font.bold = True
    r_q.font.color.rgb = WHITE

    card_w10 = Inches(3.75)
    gap10 = Inches(0.24)
    y_c10 = Inches(3.45)
    h_c10 = Inches(3.2)

    pillars = [
        ("QUANTIFIED IMPACT", "Transforming Campus Operations", [
            ("90%+ Recovery Time Reduction", "Lost item return latency slashed from an average of 5-7 days to under 4 hours."),
            ("Zero Handover Fraud", "Blind proof challenges eliminate false verbal claims and mistaken releases."),
            ("100% Chain-of-Custody", "Full digital audit trail from good samaritan intake to vault handover.")
        ]),
        ("CAMPUS INFRASTRUCTURE", "Seamless Integration", [
            ("Central Vault Room 101", "Physical security repository with barcode-indexed storage bins (#E-01 to #E-12)."),
            ("Campus-Wide Coverage", "Synchronized coverage across all 5 major blocks and specialized departments."),
            ("No Hardware Overhead", "Runs effortlessly on existing campus PCs, tablets, and student smartphones.")
        ]),
        ("DEPLOYMENT & CONTACT", "Institutional Portal Access", [
            ("Web Platform", "https://findback.heritageit.edu"),
            ("Custody Repository", "Central Block Vault Desk, Room 101"),
            ("Department", "Computer Science & Engineering (IoT & Cyber Security with Blockchain)"),
            ("Academic Lab", "Design Thinking & Ideation Lab 2026")
        ])
    ]

    for i, (p_title, p_sub, bullets) in enumerate(pillars):
        x = Inches(0.8) + i * (card_w10 + gap10)
        add_card(s10, x, y_c10, card_w10, h_c10)
        tb = s10.shapes.add_textbox(x + Inches(0.18), y_c10 + Inches(0.18), card_w10 - Inches(0.36), h_c10 - Inches(0.36))
        tf = tb.text_frame
        tf.word_wrap = True

        p_t = tf.paragraphs[0]
        p_t.text = p_title
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE

        p_s = tf.add_paragraph()
        p_s.text = p_sub.upper()
        p_s.font.name = FONT_BODY
        p_s.font.size = Pt(9)
        p_s.font.bold = True
        p_s.font.color.rgb = SLATE_LIGHT

        for b_t, b_d in bullets:
            p_b = tf.add_paragraph()
            p_b.space_before = Pt(8)
            r_bt = add_run(p_b, f"• {b_t}: ")
            r_bt.font.bold = True
            r_bt.font.size = Pt(9.5)
            r_bt.font.color.rgb = WHITE
            r_bd = add_run(p_b, b_d)
            r_bd.font.size = Pt(9)
            r_bd.font.color.rgb = SLATE_MUTED

    add_footer(s10, 10)

    output_path = "FindBack_Project_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    build_presentation()
