"""
Individual Hero Motif Renderers for all 86 Certificates
"""
import math
from PIL import ImageDraw
import motif_drawers as md

def render_hero_motif(cert_id, draw, pal, cx, cy):
    bc = pal["border"]
    acc = pal["accent"]
    glow_c = pal["glow_core"]
    
    # ----------------------------------------------------
    # OLIMPIADE (olim-1 to olim-8)
    # ----------------------------------------------------
    if cert_id == "olim-1":
        # Biology: DNA Helix + Botanicals
        md.draw_dna(draw, cx, cy, h=200, w=55, color1=(52, 211, 153), color2=(245, 195, 75))
        # Leaves flanking
        draw.arc([cx - 85, cy - 40, cx - 45, cy + 40], start=90, end=270, fill=(34, 197, 94), width=3)
        draw.arc([cx + 45, cy - 40, cx + 85, cy + 40], start=270, end=90, fill=(34, 197, 94), width=3)
    elif cert_id == "olim-2":
        # English Linguistics: Open Lexicon + Golden Quill
        md.draw_book_open(draw, cx, cy + 15, w=85, h=55, fill_c=(20, 28, 48), outline_c=bc)
        md.draw_quill(draw, cx + 25, cy - 35, length=120, angle=-45, fill_c=(255, 235, 170), outline_c=bc)
        # Floating letters
        draw.text((cx - 65, cy - 65), "A", fill=(245, 195, 75, 200))
        draw.text((cx, cy - 85), "Ω", fill=(245, 195, 75, 220))
        draw.text((cx + 55, cy - 60), "Z", fill=(245, 195, 75, 180))
    elif cert_id == "olim-3":
        # Physics ISMO: Quantum Bohr Atom
        md.draw_atom(draw, cx, cy, r=80, ring_c=(6, 182, 212), core_c=(245, 195, 75))
        md.draw_glow_circle(draw, cx, cy, 95, (6, 182, 212), glow_w=6)
    elif cert_id == "olim-4":
        # English OSP: Global Linguistic Sphere + Scroll
        md.draw_armillary(draw, cx, cy, r=70, color=bc)
        md.draw_quill(draw, cx + 15, cy - 25, length=110, angle=-50, fill_c=(255, 235, 170), outline_c=bc)
        draw.arc([cx - 90, cy - 30, cx + 90, cy + 30], start=0, end=180, fill=(245, 195, 75), width=3)
    elif cert_id == "olim-5":
        # Physics OSPENAS: Optical Prism + Spectrum
        md.draw_prism(draw, cx, cy, size=75, main_c=(255, 255, 255))
    elif cert_id == "olim-6":
        # Physics KSN-HP: Spacetime Grid + Singularity
        md.draw_spacetime(draw, cx, cy, r=95, color=(147, 197, 253))
    elif cert_id == "olim-7":
        # Astronomy ONSB: Celestial Armillary + Galaxy
        md.draw_armillary(draw, cx, cy, r=78, color=(245, 195, 75))
        # Spiral arms
        for i in range(40):
            t = i / 39 * 2.5 * math.pi
            r_g = 15 + i * 2.2
            gx = cx + r_g * math.cos(t)
            gy = cy + r_g * 0.4 * math.sin(t)
            draw.point((gx, gy), fill=(255, 255, 255, 220))
            draw.point((cx - (gx - cx), cy - (gy - cy)), fill=(255, 255, 255, 220))
    elif cert_id == "olim-8":
        # Sociology ONSB: Global Social Network Web
        md.draw_network(draw, cx, cy, r=80, n_nodes=10, color=(52, 211, 153))

    # ----------------------------------------------------
    # PROFESI (prof-1 to prof-16)
    # ----------------------------------------------------
    elif cert_id == "prof-1":
        # Scrum SFC: Agile Sprint Cycle
        md.draw_scrum_cycle(draw, cx, cy, r=75, color=(16, 185, 129))
    elif cert_id == "prof-2":
        # Six Sigma Yellow Belt: Bell Curve + Caliper
        md.draw_bell_curve(draw, cx, cy, w=150, h=80, color=(245, 195, 75))
    elif cert_id == "prof-3":
        # Six Sigma White Belt: DMAIC Wheel
        md.draw_dmaic_wheel(draw, cx, cy, r=75, color=(220, 230, 240))
    elif cert_id == "prof-4":
        # Lean Six Sigma: Kaizen Streamlined Funnel
        # Funnel
        draw.polygon([(cx - 70, cy - 60), (cx + 70, cy - 60), (cx + 20, cy + 15), (cx - 20, cy + 15)], fill=(20, 35, 30), outline=(52, 211, 153), width=2)
        draw.polygon([(cx - 15, cy + 15), (cx + 15, cy + 15), (cx + 15, cy + 65), (cx, cy + 85), (cx - 15, cy + 65)], fill=(34, 197, 94), outline=(52, 211, 153))
        # Emerald leaf
        draw.arc([cx - 50, cy - 40, cx - 10, cy], start=0, end=180, fill=(34, 197, 94), width=3)
    elif cert_id == "prof-5":
        # Kanban Essentials: Taskboard with Columns & Cards
        md.draw_kanban_board(draw, cx, cy, w=150, h=95, color=(16, 185, 129))
    elif cert_id == "prof-6":
        # OKR Fundamentals: Target Compass & Summit Flag
        draw.ellipse([cx - 75, cy - 75, cx + 75, cy + 75], outline=(52, 211, 153), width=2)
        draw.ellipse([cx - 45, cy - 45, cx + 45, cy + 45], outline=(52, 211, 153), width=1)
        # Mountain peak
        draw.polygon([(cx, cy - 50), (cx - 45, cy + 40), (cx + 45, cy + 40)], fill=(20, 35, 30), outline=(245, 195, 75), width=2)
        # Summit flag
        draw.line([(cx, cy - 50), (cx, cy - 70)], fill=(245, 195, 75), width=2)
        draw.polygon([(cx, cy - 70), (cx + 25, cy - 60), (cx, cy - 50)], fill=(239, 68, 68))
    elif cert_id == "prof-7":
        # Project Management: Triple Constraint + Gantt
        draw.polygon([(cx, cy - 75), (cx - 85, cy + 60), (cx + 85, cy + 60)], outline=(52, 211, 153), width=3)
        # Gantt bars inside
        for idx, (gx, gw) in enumerate([(cx - 45, 40), (cx - 20, 50), (cx + 5, 45)]):
            gy = cy - 20 + idx * 24
            draw.rectangle([gx, gy, gx + gw, gy + 12], fill=(245, 195, 75), outline=(255, 255, 255))
    elif cert_id == "prof-8":
        # Starting a Business: Rocket Launch
        md.draw_rocket(draw, cx, cy, length=95, color=(244, 63, 94))
    elif cert_id == "prof-9":
        # Business Analysis: Enterprise Flow & SWOT Matrix
        # 4 diamond quadrants
        for dx, dy, c in [(-30, -30, (52, 211, 153)), (30, -30, (6, 182, 212)), (-30, 30, (245, 195, 75)), (30, 30, (239, 68, 68))]:
            draw.polygon([(cx + dx, cy + dy - 22), (cx + dx + 22, cy + dy), (cx + dx, cy + dy + 22), (cx + dx - 22, cy + dy)], fill=(15, 25, 30), outline=c, width=2)
    elif cert_id == "prof-10":
        # Business Management: Chess King & Enterprise Pillars
        md.draw_courthouse(draw, cx, cy, w=130, h=95, color=(52, 211, 153))
        # Crowned King Piece
        draw.rectangle([cx - 15, cy - 35, cx + 15, cy + 15], fill=(245, 195, 75), outline=(218, 165, 32), width=2)
        draw.polygon([(cx - 18, cy - 35), (cx - 12, cy - 50), (cx, cy - 40), (cx + 12, cy - 50), (cx + 18, cy - 35)], fill=(245, 195, 75))
    elif cert_id == "prof-11":
        # Leadership Essentials: Lighthouse Beacon & Waves
        md.draw_lighthouse(draw, cx, cy, w=35, h=105, color=(255, 235, 170))
    elif cert_id == "prof-12":
        # Corporate Sales: Handshake & Growth Chart
        md.draw_handshake(draw, cx, cy + 10, w=85, h=45, color=(245, 195, 75))
    elif cert_id == "prof-13":
        # Negotiation Associate: Scales of Justice
        md.draw_scales_justice(draw, cx, cy, w=115, h=95, color=(52, 211, 153))
    elif cert_id == "prof-14":
        # Marketing Strategy: Concentric Radar & Flight Arrow
        for r in [85, 60, 35, 12]:
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(52, 211, 153), width=2)
        # Striking Arrow
        draw.line([(cx - 80, cy - 80), (cx, cy)], fill=(245, 195, 75), width=4)
        draw.polygon([(cx, cy), (cx - 18, cy - 5), (cx - 5, cy - 18)], fill=(245, 195, 75))
    elif cert_id == "prof-15":
        # Marketing Research: Magnifying Glass & Demographic Pie
        md.draw_glow_circle(draw, cx - 15, cy - 15, 45, (6, 182, 212), glow_w=6)
        # Glass handle
        draw.line([(cx + 20, cy + 20), (cx + 70, cy + 70)], fill=(245, 195, 75), width=8)
        # Pie chart inside
        draw.pieslice([cx - 50, cy - 50, cx + 20, cy + 20], start=0, end=130, fill=(34, 197, 94))
        draw.pieslice([cx - 50, cy - 50, cx + 20, cy + 20], start=130, end=270, fill=(6, 182, 212))
        draw.pieslice([cx - 50, cy - 50, cx + 20, cy + 20], start=270, end=360, fill=(245, 195, 75))
    elif cert_id == "prof-16":
        # Digital Marketing: Viral Network & Megaphone
        # Megaphone
        draw.polygon([(cx - 55, cy - 15), (cx - 15, cy - 35), (cx - 15, cy + 35), (cx - 55, cy + 15)], fill=(244, 63, 94), outline=(255, 255, 255), width=2)
        # Acoustic engagement waves
        for r in [35, 55, 75]:
            draw.arc([cx - 15 - r, cy - r, cx - 15 + r, cy + r], start=-45, end=45, fill=(52, 211, 153), width=3)
        # Floating digital icons (Heart, Star, Click)
        draw.ellipse([cx + 65, cy - 35, cx + 85, cy - 15], fill=(239, 68, 68))
        draw.ellipse([cx + 70, cy + 20, cx + 90, cy + 40], fill=(245, 195, 75))

    # ----------------------------------------------------
    # IBM SKILLSBUILD (ibm-1 to ibm-23)
    # ----------------------------------------------------
    elif cert_id == "ibm-1":
        # AI Customer Service: Bot Headset + Waveform
        draw.ellipse([cx - 45, cy - 45, cx + 45, cy + 45], fill=(20, 25, 45), outline=(168, 85, 247), width=3)
        # Eyes & Smile
        draw.ellipse([cx - 20, cy - 10, cx - 10, cy], fill=(6, 182, 212))
        draw.ellipse([cx + 10, cy - 10, cx + 20, cy], fill=(6, 182, 212))
        draw.arc([cx - 18, cy + 5, cx + 18, cy + 25], start=0, end=180, fill=(6, 182, 212), width=2)
        # Headset
        draw.arc([cx - 52, cy - 52, cx + 52, cy + 52], start=180, end=0, fill=(245, 195, 75), width=4)
        draw.rectangle([cx - 58, cy - 15, cx - 48, cy + 15], fill=(245, 195, 75))
        draw.rectangle([cx + 48, cy - 15, cx + 58, cy + 15], fill=(245, 195, 75))
        draw.line([(cx + 53, cy + 15), (cx + 25, cy + 38)], fill=(245, 195, 75), width=3)
    elif cert_id == "ibm-2":
        # AI Governance: Scales weighing Brain & Law
        md.draw_scales_justice(draw, cx, cy, w=115, h=95, color=(168, 85, 247))
        # Brain icon on left pan
        md.draw_brain(draw, cx - 58, cy - 15, r=22, color=(6, 182, 212))
        # Law book on right pan
        md.draw_book_open(draw, cx + 58, cy - 15, w=22, h=14, fill_c=(15, 20, 30), outline_c=(245, 195, 75))
    elif cert_id == "ibm-3":
        # AI Literacy: Open Digital Codex + Code Matrix
        md.draw_book_open(draw, cx, cy + 20, w=85, h=55, fill_c=(15, 20, 35), outline_c=(6, 182, 212))
        # Binary streams
        for idx, (bx, txt) in enumerate([(-50, "0110"), (-15, "1001"), (20, "1101"), (55, "0010")]):
            draw.text((cx + bx, cy - 65 + (idx % 2) * 15), txt, fill=(168, 85, 247))
    elif cert_id == "ibm-4":
        # Enterprise AI Solutions: Monolith Skyscraper + AI Core
        draw.polygon([(cx - 40, cy + 75), (cx + 40, cy + 75), (cx + 25, cy - 75), (cx - 25, cy - 75)], fill=(15, 25, 45), outline=(168, 85, 247), width=2)
        # Windows
        for row in range(5):
            wy = cy - 50 + row * 22
            draw.line([(cx - 18, wy), (cx + 18, wy)], fill=(6, 182, 212, 180), width=2)
        # Glowing AI Core inside
        draw.ellipse([cx - 15, cy - 15, cx + 15, cy + 15], fill=(245, 195, 75), outline=(255, 255, 255), width=2)
    elif cert_id == "ibm-5":
        # Generative AI: Magic Cyber Stylus & Nebula Swirls
        # Stylus
        draw.line([(cx - 65, cy + 65), (cx + 25, cy - 25)], fill=(220, 230, 245), width=7)
        draw.polygon([(cx + 25, cy - 25), (cx + 38, cy - 38), (cx + 20, cy - 40)], fill=(245, 195, 75))
        # Swirl of stars
        for i in range(25):
            ang = i * 0.4
            sr = 20 + i * 2.5
            sx = cx + 30 + sr * math.cos(ang)
            sy = cy - 30 + sr * math.sin(ang)
            draw.point((sx, sy), fill=(168, 85, 247, 240))
        md.draw_star(draw, cx + 35, cy - 35, 16, 5, 4, (255, 255, 255), (168, 85, 247))
    elif cert_id == "ibm-6":
        # Human-AI Collaborative Planning: Hand & Robot Touch Spark
        # Human hand left
        draw.polygon([(cx - 85, cy + 15), (cx - 35, cy), (cx - 10, cy - 5), (cx - 30, cy + 25)], fill=(251, 191, 36))
        # Robot finger right
        draw.polygon([(cx + 85, cy + 15), (cx + 35, cy), (cx + 10, cy - 5), (cx + 30, cy + 25)], fill=(168, 85, 247), outline=(6, 182, 212))
        # Plasma spark
        md.draw_star(draw, cx, cy - 5, 22, 7, 6, (255, 255, 255), (245, 195, 75))
    elif cert_id == "ibm-7":
        # Enterprise Design Thinking: Infinity Loop
        md.draw_infinity_loop(draw, cx, cy, w=130, h=65, color=(6, 182, 212))
    elif cert_id == "ibm-8":
        # Design Thinking Co-Creator: Sticky Board + Connecting Threads
        md.draw_kanban_board(draw, cx, cy, w=145, h=90, color=(6, 182, 212))
        draw.line([(cx - 40, cy - 15), (cx + 40, cy + 15)], fill=(245, 195, 75), width=2)
    elif cert_id == "ibm-9":
        # Team Essentials: Triad Avatars + Innovation Lightbulb
        # Central bulb
        draw.ellipse([cx - 22, cy - 35, cx + 22, cy + 5], fill=(245, 195, 75), outline=(255, 255, 255), width=2)
        draw.rectangle([cx - 12, cy + 5, cx + 12, cy + 18], fill=(160, 170, 180))
        # 3 Team avatars
        for deg in [150, 270, 30]:
            rad = math.radians(deg)
            ax = cx + 65 * math.cos(rad)
            ay = cy + 65 * math.sin(rad)
            draw.ellipse([ax - 12, ay - 12, ax + 12, ay + 12], fill=(6, 182, 212), outline=(255, 255, 255))
    elif cert_id == "ibm-10":
        # Empathy Mapping: 4 Quadrants + Profile
        draw.line([(cx - 75, cy), (cx + 75, cy)], fill=(6, 182, 212), width=2)
        draw.line([(cx, cy - 75), (cx, cy + 75)], fill=(6, 182, 212), width=2)
        # Human head silhouette center
        draw.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], fill=(20, 30, 50), outline=(245, 195, 75), width=2)
    elif cert_id == "ibm-11":
        # Hills & Playbacks: 3 Mountain Hills + Projector Beam
        draw.polygon([(cx - 75, cy + 45), (cx - 45, cy - 25), (cx - 15, cy + 45)], fill=(20, 35, 55), outline=(6, 182, 212), width=2)
        draw.polygon([(cx - 25, cy + 45), (cx, cy - 45), (cx + 25, cy + 45)], fill=(25, 45, 75), outline=(245, 195, 75), width=2)
        draw.polygon([(cx + 15, cy + 45), (cx + 45, cy - 25), (cx + 75, cy + 45)], fill=(20, 35, 55), outline=(6, 182, 212), width=2)
        # Projector beam from above
        draw.polygon([(cx, cy - 80), (cx - 65, cy + 45), (cx + 65, cy + 45)], fill=(255, 245, 180, 50))
    elif cert_id == "ibm-12":
        # Prototyping & Iteration: Wireframe to 3D Glass
        draw.rectangle([cx - 55, cy - 45, cx + 15, cy + 45], fill=(15, 20, 30), outline=(100, 110, 130), width=2)
        # Elevated 3D Glass Layer
        draw.rectangle([cx - 25, cy - 60, cx + 45, cy + 30], fill=(6, 182, 212, 140), outline=(255, 255, 255), width=2)
        draw.ellipse([cx + 10, cy - 15, cx + 25, cy], fill=(245, 195, 75))
    elif cert_id == "ibm-13":
        # Big Idea Matrix: 2x2 Grid + Golden Star
        draw.rectangle([cx - 70, cy - 70, cx + 70, cy + 70], outline=(6, 182, 212), width=2)
        draw.line([(cx - 70, cy), (cx + 70, cy)], fill=(6, 182, 212), width=1)
        draw.line([(cx, cy - 70), (cx, cy + 70)], fill=(6, 182, 212), width=1)
        # Top right quadrant star
        md.draw_star(draw, cx + 35, cy - 35, 24, 9, 5, (255, 215, 0), (245, 195, 75))
    elif cert_id == "ibm-14":
        # Experience Roadmap: Winding Journey + Milestones
        pts = []
        for i in range(60):
            t = i / 59
            x = cx - 75 + t * 150
            y = cy + 40 * math.sin(t * 2 * math.pi)
            pts.append((x, y))
        draw.line(pts, fill=(245, 195, 75), width=4)
        for mx, my in [pts[10], pts[30], pts[50]]:
            draw.ellipse([mx - 8, my - 8, mx + 8, my + 8], fill=(6, 182, 212), outline=(255, 255, 255), width=2)
    elif cert_id == "ibm-15":
        # User-Centered Systems Architecture: Tiered Pyramid + User Apex
        draw.polygon([(cx, cy - 65), (cx - 75, cy + 55), (cx + 75, cy + 55)], outline=(6, 182, 212), width=2)
        draw.line([(cx - 35, cy - 10), (cx + 35, cy - 10)], fill=(6, 182, 212), width=2)
        draw.line([(cx - 55, cy + 25), (cx + 55, cy + 25)], fill=(6, 182, 212), width=2)
        # User at top
        draw.ellipse([cx - 10, cy - 80, cx + 10, cy - 60], fill=(245, 195, 75), outline=(255, 255, 255))
    elif cert_id == "ibm-16":
        # Stakeholder Alignment: Circular Council Table + Convergence
        draw.ellipse([cx - 75, cy - 75, cx + 75, cy + 75], outline=(6, 182, 212), width=2)
        for i in range(6):
            ang = i * math.pi / 3
            px = cx + 75 * math.cos(ang)
            py = cy + 75 * math.sin(ang)
            draw.line([(px, py), (cx, cy)], fill=(6, 182, 212, 140), width=2)
            draw.ellipse([px - 10, py - 10, px + 10, py + 10], fill=(168, 85, 247), outline=(255, 255, 255))
        draw.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=(245, 195, 75))
    elif cert_id == "ibm-17":
        # Design Strategy: North Star + Compass
        draw.ellipse([cx - 70, cy - 70, cx + 70, cy + 70], outline=(6, 182, 212), width=2)
        # Compass needle
        draw.polygon([(cx, cy - 65), (cx + 12, cy), (cx, cy + 20), (cx - 12, cy)], fill=(239, 68, 68))
        draw.polygon([(cx, cy + 65), (cx + 12, cy), (cx, cy - 20), (cx - 12, cy)], fill=(240, 240, 245))
        md.draw_star(draw, cx, cy - 75, 16, 6, 4, (255, 255, 255), (245, 195, 75))
    elif cert_id == "ibm-18":
        # Design Systems: Modular Token Cards
        cards = [
            (cx - 65, cy - 55, 55, 45, (6, 182, 212)),
            (cx + 10, cy - 55, 55, 45, (168, 85, 247)),
            (cx - 65, cy + 10, 55, 45, (245, 195, 75)),
            (cx + 10, cy + 10, 55, 45, (34, 197, 94))
        ]
        for kx, ky, kw, kh, kc in cards:
            draw.rectangle([kx, ky, kx + kw, ky + kh], fill=(15, 20, 30), outline=kc, width=2)
            draw.line([(kx + 8, ky + 15), (kx + kw - 8, ky + 15)], fill=kc, width=2)
    elif cert_id == "ibm-19":
        # Advanced Design Thinking Mastery: Golden Hexagon + Laurels
        hex_pts = []
        for i in range(6):
            ang = i * math.pi / 3 - math.pi / 6
            hex_pts.append((cx + 80 * math.cos(ang), cy + 80 * math.sin(ang)))
        draw.polygon(hex_pts, outline=(245, 195, 75), width=3)
        md.draw_infinity_loop(draw, cx, cy, w=90, h=45, color=(6, 182, 212))
    elif cert_id == "ibm-20":
        # Lifelong Professional Skills: Ascending Spiral Staircase
        for i in range(8):
            sy = cy + 50 - i * 14
            sx = cx - 40 + (i % 2) * 20 + i * 4
            draw.rectangle([sx, sy, sx + 50, sy + 8], fill=(220, 230, 245), outline=(6, 182, 212), width=1)
        md.draw_star(draw, cx + 35, cy - 65, 20, 7, 5, (255, 235, 170), (245, 195, 75))
    elif cert_id == "ibm-21":
        # Agentic AI: Central Orchestrator Core + Swarm
        draw.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], fill=(168, 85, 247), outline=(255, 255, 255), width=2)
        for i in range(5):
            ang = i * 2 * math.pi / 5 - math.pi / 2
            ax = cx + 70 * math.cos(ang)
            ay = cy + 70 * math.sin(ang)
            draw.line([(cx, cy), (ax, ay)], fill=(6, 182, 212), width=2)
            draw.ellipse([ax - 12, ay - 12, ax + 12, ay + 12], fill=(6, 182, 212), outline=(255, 255, 255))
    elif cert_id == "ibm-22":
        # Project Management Fundamentals: Chrono Gear + Checklist
        md.draw_gear(draw, cx - 25, cy - 15, r_out=50, r_in=35, teeth=8, fill_c=(15, 25, 40), outline_c=(6, 182, 212))
        # Clipboard checklist
        draw.rectangle([cx, cy - 25, cx + 55, cy + 45], fill=(240, 245, 255), outline=(245, 195, 75), width=2)
        for idx in range(3):
            ly = cy - 10 + idx * 18
            draw.line([(cx + 20, ly), (cx + 45, ly)], fill=(30, 40, 60), width=2)
            draw.ellipse([cx + 8, ly - 4, cx + 14, ly + 2], fill=(34, 197, 94))
    elif cert_id == "ibm-23":
        # Responsible AI: Aegis Shield + Risk Deflection
        md.draw_shield(draw, cx, cy, w=65, h=75, fill_c=(15, 20, 35), outline_c=(168, 85, 247))
        # Eye of vigilance in center
        draw.arc([cx - 25, cy - 20, cx + 25, cy + 20], start=0, end=180, fill=(6, 182, 212), width=3)
        draw.arc([cx - 25, cy - 20, cx + 25, cy + 20], start=180, end=360, fill=(6, 182, 212), width=3)
        draw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=(245, 195, 75))

    # ----------------------------------------------------
    # SEMINAR (sem-cec-ub, sem-compendium, sem-20 to sem-56)
    # ----------------------------------------------------
    elif cert_id == "sem-cec-ub":
        # Economics Club: Financial Candlesticks & Globe
        draw.ellipse([cx - 75, cy - 75, cx + 75, cy + 75], outline=(251, 146, 60), width=2)
        # Candlestick bars
        bars = [(-45, 30, (239, 68, 68)), (-15, -40, (34, 197, 94)), (15, 20, (239, 68, 68)), (45, -55, (34, 197, 94))]
        for bx, bh, bc_col in bars:
            by = cy + bh // 2
            draw.line([(cx + bx, by - abs(bh)), (cx + bx, by + abs(bh))], fill=bc_col, width=2)
            draw.rectangle([cx + bx - 6, cy - abs(bh)//2, cx + bx + 6, cy + abs(bh)//2], fill=bc_col)
    elif cert_id == "sem-compendium":
        # Compendium Tome: Regal Leather Book + Golden Wax Seals
        md.draw_book_open(draw, cx, cy, w=85, h=60, fill_c=(45, 15, 20), outline_c=(251, 146, 60))
        # Triple golden seals
        for idx, sx in enumerate([-40, 0, 40]):
            draw.ellipse([cx + sx - 12, cy + 30 - 12, cx + sx + 12, cy + 30 + 12], fill=(245, 195, 75), outline=(180, 130, 20))
    elif cert_id == "sem-20":
        # Digital Transformation: Cogs transforming into Fiber Matrix
        md.draw_gear(draw, cx - 35, cy, r_out=45, r_in=30, teeth=8, fill_c=(40, 20, 20), outline_c=(251, 146, 60))
        # Cyber circuits
        for idx in range(4):
            fy = cy - 30 + idx * 20
            draw.line([(cx + 10, fy), (cx + 70, fy)], fill=(6, 182, 212), width=2)
            draw.ellipse([cx + 66, fy - 4, cx + 74, fy + 4], fill=(255, 255, 255))
    elif cert_id == "sem-21":
        # Economic Resilience: Stone Citadel vs Waves
        draw.polygon([(cx - 45, cy + 60), (cx + 45, cy + 60), (cx + 40, cy - 40), (cx - 40, cy - 40)], fill=(35, 20, 25), outline=(251, 146, 60), width=2)
        # Turrets
        for tx in [-35, 0, 35]:
            draw.rectangle([cx + tx - 8, cy - 55, cx + tx + 8, cy - 40], fill=(251, 146, 60))
        # Storm wave
        draw.arc([cx - 85, cy + 35, cx + 85, cy + 85], start=0, end=180, fill=(6, 182, 212), width=4)
    elif cert_id == "sem-22":
        # Corporate Risk: Bank Vault Door
        draw.ellipse([cx - 75, cy - 75, cx + 75, cy + 75], fill=(30, 20, 25), outline=(251, 146, 60), width=4)
        draw.ellipse([cx - 45, cy - 45, cx + 45, cy + 45], outline=(251, 146, 60), width=2)
        # Vault spokes
        for deg in range(0, 360, 45):
            rad = math.radians(deg)
            draw.line([(cx, cy), (cx + 45 * math.cos(rad), cy + 45 * math.sin(rad))], fill=(245, 195, 75), width=3)
    elif cert_id == "sem-23":
        # Talent Development: Tree of Talent & Oak
        md.draw_tree_of_talent(draw, cx, cy, w=110, h=100, color=(34, 197, 94))
    elif cert_id == "sem-24":
        # Green Energy: Wind Turbine + Solar Leaf
        md.draw_wind_turbine(draw, cx, cy, h=110, color=(34, 197, 94))
    elif cert_id == "sem-25":
        # Big Data Analytics: 3D Isometric Data Cube
        md.draw_3d_cube(draw, cx, cy, size=60, color=(249, 115, 22))
    elif cert_id == "sem-26":
        # Research Entrepreneurship: Beaker incubating Bulb
        # Laboratory Flask
        draw.polygon([(cx - 15, cy - 55), (cx + 15, cy - 55), (cx + 55, cy + 45), (cx - 55, cy + 45)], fill=(30, 15, 20), outline=(251, 146, 60), width=2)
        # Sprouting lightbulb inside
        draw.ellipse([cx - 16, cy - 15, cx + 16, cy + 15], fill=(245, 195, 75))
    elif cert_id == "sem-27":
        # Cybersecurity: Padlock & Hex Forcefield
        md.draw_padlock(draw, cx, cy, w=70, h=60, color=(6, 182, 212))
    elif cert_id == "sem-28":
        # Scientific Research Methodology: Microscope
        draw.line([(cx - 20, cy + 60), (cx + 30, cy + 60)], fill=(251, 146, 60), width=4)
        draw.arc([cx - 40, cy - 30, cx + 20, cy + 50], start=90, end=270, fill=(251, 146, 60), width=6)
        # Tube angled
        draw.line([(cx - 25, cy - 45), (cx + 20, cy + 15)], fill=(220, 230, 245), width=10)
    elif cert_id == "sem-29":
        # Global Supply Chain: Shipping Container & Globe
        draw.ellipse([cx - 70, cy - 70, cx + 70, cy + 70], outline=(251, 146, 60), width=2)
        # Cargo ship in center
        draw.polygon([(cx - 45, cy + 20), (cx + 45, cy + 20), (cx + 35, cy + 40), (cx - 35, cy + 40)], fill=(20, 30, 50), outline=(251, 146, 60), width=2)
        # Shipping container
        draw.rectangle([cx - 20, cy, cx + 20, cy + 20], fill=(239, 68, 68), outline=(255, 255, 255))
    elif cert_id == "sem-30":
        # Industrial Automation: Robotic Arm Welding
        md.draw_robot_arm(draw, cx, cy, color=(249, 115, 22))
    elif cert_id == "sem-31":
        # Business Law & Ethics: Greco-Roman Courthouse & Gavel
        md.draw_courthouse(draw, cx, cy, w=125, h=90, color=(251, 146, 60))
    elif cert_id == "sem-32":
        # Financial Planning: Investment Pie & Coins
        draw.ellipse([cx - 50, cy - 50, cx + 50, cy + 50], fill=(20, 30, 45), outline=(251, 146, 60), width=2)
        draw.pieslice([cx - 50, cy - 50, cx + 50, cy + 50], start=0, end=140, fill=(245, 195, 75))
        draw.pieslice([cx - 50, cy - 50, cx + 50, cy + 50], start=140, end=250, fill=(34, 197, 94))
        # Gold coins stack
        for i in range(3):
            cy_c = cy + 40 - i * 10
            draw.ellipse([cx + 35 - 18, cy_c - 6, cx + 35 + 18, cy_c + 6], fill=(245, 195, 75), outline=(180, 130, 20))
    elif cert_id == "sem-33":
        # UX Metrics: Smartphone Device & Heatmap
        draw.rectangle([cx - 40, cy - 65, cx + 40, cy + 65], fill=(15, 20, 30), outline=(251, 146, 60), width=2)
        # Touch reticle
        draw.ellipse([cx - 15, cy - 15, cx + 15, cy + 15], outline=(239, 68, 68), width=2)
        draw.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=(245, 195, 75))
    elif cert_id == "sem-34":
        # Total Quality Management (TQM): ISO Quality Ribbon & Medal
        draw.ellipse([cx - 45, cy - 35, cx + 45, cy + 55], fill=(245, 195, 75), outline=(180, 130, 20), width=3)
        # Ribbons below
        draw.polygon([(cx - 25, cy + 45), (cx - 35, cy + 85), (cx - 10, cy + 70)], fill=(239, 68, 68))
        draw.polygon([(cx + 25, cy + 45), (cx + 35, cy + 85), (cx + 10, cy + 70)], fill=(239, 68, 68))
    elif cert_id == "sem-35":
        # Public Policy: Parliament Dome Building
        draw.chord([cx - 55, cy - 60, cx + 55, cy + 20], start=180, end=0, fill=(35, 20, 25), outline=(251, 146, 60), width=2)
        draw.rectangle([cx - 65, cy + 10, cx + 65, cy + 55], fill=(35, 20, 25), outline=(251, 146, 60), width=2)
    elif cert_id == "sem-36":
        # Corporate Communications: Studio Microphone & Soundwaves
        draw.ellipse([cx - 20, cy - 45, cx + 20, cy - 5], fill=(220, 230, 240), outline=(251, 146, 60), width=2)
        draw.arc([cx - 28, cy - 35, cx + 28, cy + 15], start=0, end=180, fill=(251, 146, 60), width=3)
        draw.line([(cx, cy + 15), (cx, cy + 55)], fill=(251, 146, 60), width=3)
    elif cert_id == "sem-37":
        # Organizational Psychology: Brain Puzzle Synergy
        md.draw_brain(draw, cx, cy, r=65, color=(251, 146, 60))
    elif cert_id == "sem-38":
        # Strategic Marketing: Ruby Heart & Magnetic Field
        draw.polygon([(cx, cy + 45), (cx - 45, cy), (cx - 25, cy - 40), (cx, cy - 20), (cx + 25, cy - 40), (cx + 45, cy)], fill=(239, 68, 68), outline=(255, 255, 255), width=2)
    elif cert_id == "sem-39":
        # Agile Leadership: Exploration Sailing Ship
        draw.polygon([(cx - 55, cy + 25), (cx + 55, cy + 25), (cx + 40, cy + 55), (cx - 40, cy + 55)], fill=(146, 64, 14), outline=(251, 146, 60), width=2)
        # Mast & Sails
        draw.line([(cx, cy - 55), (cx, cy + 25)], fill=(251, 146, 60), width=3)
        draw.polygon([(cx, cy - 50), (cx + 45, cy - 20), (cx, cy + 10)], fill=(240, 245, 255))
    elif cert_id == "sem-40":
        # Academic Integrity: Mortarboard Graduation Cap & Scroll
        draw.polygon([(cx, cy - 45), (cx + 65, cy - 25), (cx, cy - 5), (cx - 65, cy - 25)], fill=(20, 25, 40), outline=(251, 146, 60), width=2)
        draw.polygon([(cx - 35, cy - 15), (cx + 35, cy - 15), (cx + 30, cy + 15), (cx - 30, cy + 15)], fill=(20, 25, 40))
        # Tassel
        draw.line([(cx, cy - 25), (cx + 55, cy)], fill=(245, 195, 75), width=2)
    elif cert_id == "sem-41":
        # IT Audit: Server Scanner & Security Checkmark
        draw.rectangle([cx - 45, cy - 55, cx + 45, cy + 55], fill=(15, 20, 30), outline=(251, 146, 60), width=2)
        # Checkmark shield in center
        draw.ellipse([cx - 20, cy - 20, cx + 20, cy + 20], fill=(34, 197, 94))
        draw.line([(cx - 8, cy), (cx - 2, cy + 8), (cx + 8, cy - 6)], fill=(255, 255, 255), width=3)
    elif cert_id == "sem-42":
        # BPR (Business Process Reengineering): Streamlined Process Loop
        md.draw_scrum_cycle(draw, cx, cy, r=70, color=(251, 146, 60))
    elif cert_id == "sem-43":
        # Leadership Ethics: Moral Compass in Storm
        draw.ellipse([cx - 70, cy - 70, cx + 70, cy + 70], outline=(251, 146, 60), width=3)
        draw.polygon([(cx, cy - 60), (cx + 12, cy), (cx, cy + 15), (cx - 12, cy)], fill=(245, 195, 75))
        draw.polygon([(cx, cy + 60), (cx + 12, cy), (cx, cy - 15), (cx - 12, cy)], fill=(100, 110, 130))
    elif cert_id == "sem-44":
        # Change Management: Metamorphic Butterfly
        draw.polygon([(cx, cy - 10), (cx - 60, cy - 55), (cx - 50, cy + 15)], fill=(251, 146, 60))
        draw.polygon([(cx, cy - 10), (cx + 60, cy - 55), (cx + 50, cy + 15)], fill=(251, 146, 60))
        draw.line([(cx, cy - 35), (cx, cy + 35)], fill=(245, 195, 75), width=4)
    elif cert_id == "sem-45":
        # Cloud Architecture: Multi-Tiered Cloud & Nodes
        md.draw_cloud_architecture(draw, cx, cy, w=110, h=60, color=(6, 182, 212))
    elif cert_id == "sem-46":
        # Data Science Market Prediction: Regression Curve
        pts = []
        for i in range(50):
            t = i / 49
            px = cx - 75 + t * 150
            py = cy + 45 - 90 * (t ** 1.8)
            pts.append((px, py))
        draw.line(pts, fill=(245, 195, 75), width=4)
        for idx in range(12):
            dx = cx - 60 + idx * 11
            dy = cy + 35 - idx * 7 + (idx % 3) * 12
            draw.ellipse([dx - 3, dy - 3, dx + 3, dy + 3], fill=(6, 182, 212))
    elif cert_id == "sem-47":
        # Cross-Cultural Negotiation: Bridge of Unity
        # Arching bridge
        draw.arc([cx - 85, cy - 20, cx + 85, cy + 70], start=180, end=0, fill=(251, 146, 60), width=4)
        draw.line([(cx - 85, cy + 25), (cx + 85, cy + 25)], fill=(251, 146, 60), width=2)
    elif cert_id == "sem-48":
        # Strategic Asset Management: Industrial Turbine & Telemetry
        md.draw_gear(draw, cx, cy, r_out=65, r_in=45, teeth=12, fill_c=(30, 20, 25), outline_c=(251, 146, 60))
    elif cert_id == "sem-49":
        # Startup Governance & VC: Venture Hourglass
        draw.polygon([(cx - 45, cy - 65), (cx + 45, cy - 65), (cx, cy), (cx - 45, cy - 65)], fill=(30, 15, 20), outline=(251, 146, 60), width=2)
        draw.polygon([(cx, cy), (cx + 45, cy + 65), (cx - 45, cy + 65), (cx, cy)], fill=(30, 15, 20), outline=(251, 146, 60), width=2)
        # Golden sand dripping
        draw.ellipse([cx - 15, cy + 45, cx + 15, cy + 60], fill=(245, 195, 75))
    elif cert_id == "sem-50":
        # Disruptive Business Models: Disruptive Energy Arc
        draw.rectangle([cx - 50, cy - 40, cx + 50, cy + 40], fill=(20, 25, 35), outline=(251, 146, 60), width=2)
        # Lightning bolt
        draw.polygon([(cx + 5, cy - 55), (cx - 25, cy), (cx + 5, cy), (cx - 5, cy + 55), (cx + 25, cy), (cx - 5, cy)], fill=(245, 195, 75))
    elif cert_id == "sem-51":
        # K3 Occupational Safety: Hardhat & Safety Cross
        md.draw_hardhat_safety(draw, cx, cy, w=95, h=70, color=(234, 179, 8))
    elif cert_id == "sem-52":
        # ESG Sustainability: Environmental Leaf & Pillar
        draw.arc([cx - 45, cy - 60, cx + 45, cy + 30], start=0, end=180, fill=(34, 197, 94), width=4)
        draw.line([(cx, cy - 50), (cx, cy + 50)], fill=(251, 146, 60), width=4)
        draw.ellipse([cx - 12, cy + 20, cx + 12, cy + 44], fill=(245, 195, 75))
    elif cert_id == "sem-53":
        # Enterprise Software Architecture: Container Pods & API Gateway
        draw.rectangle([cx - 50, cy - 65, cx + 50, cy - 25], fill=(20, 30, 50), outline=(6, 182, 212), width=2)
        draw.rectangle([cx - 65, cy + 15, cx - 15, cy + 60], fill=(20, 30, 50), outline=(251, 146, 60), width=2)
        draw.rectangle([cx + 15, cy + 15, cx + 65, cy + 60], fill=(20, 30, 50), outline=(251, 146, 60), width=2)
        draw.line([(cx, cy - 25), (cx - 40, cy + 15)], fill=(245, 195, 75), width=2)
        draw.line([(cx, cy - 25), (cx + 40, cy + 15)], fill=(245, 195, 75), width=2)
    elif cert_id == "sem-54":
        # Emotional Intelligence: Heart-Brain Union
        # Left half heart
        draw.polygon([(cx, cy + 40), (cx - 40, cy), (cx - 20, cy - 35), (cx, cy - 15)], fill=(239, 68, 68))
        # Right half brain
        draw.arc([cx, cy - 35, cx + 45, cy + 35], start=270, end=90, fill=(6, 182, 212), width=4)
        draw.line([(cx, cy - 35), (cx, cy + 40)], fill=(245, 195, 75), width=3)
    elif cert_id == "sem-55":
        # Quantitative Forecasting: Bell Curve & Regression Fan
        md.draw_bell_curve(draw, cx, cy, w=140, h=70, color=(251, 146, 60))
    elif cert_id == "sem-56":
        # Youth Leadership: Blazing Olympic Torch
        md.draw_torch_flame(draw, cx, cy, h=110, color=(249, 115, 22))
    else:
        # Fallback ornate seal
        md.draw_glow_circle(draw, cx, cy, 60, (245, 195, 75), glow_w=8)
        md.draw_star(draw, cx, cy, 40, 15, 8, (245, 195, 75), (255, 255, 255))

print("Cert renderers module ready!")
