"""
Motif Drawers for 86 Unique Certificate Covers
Each function draws a distinctive, high-detail hero motif on a PIL ImageDraw context.
"""
import math
import random
from PIL import ImageDraw

def draw_glow_circle(draw, cx, cy, r, color, glow_w=8):
    cr, cg, cb = color[:3]
    for w in range(glow_w, 0, -2):
        alpha = int(40 * (1 - w / glow_w))
        draw.ellipse([cx - r - w, cy - r - w, cx + r + w, cy + r + w], outline=(cr, cg, cb, alpha), width=2)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(cr, cg, cb, 240), width=2)

def draw_star(draw, cx, cy, r_out, r_in, points, fill_c, outline_c):
    poly = []
    for i in range(points * 2):
        r = r_out if i % 2 == 0 else r_in
        ang = i * math.pi / points - math.pi / 2
        poly.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    draw.polygon(poly, fill=fill_c, outline=outline_c)

def draw_gear(draw, cx, cy, r_out, r_in, teeth, fill_c, outline_c):
    poly = []
    step = math.pi / teeth
    for i in range(teeth * 2):
        ang1 = i * step
        ang2 = (i + 0.6) * step
        r = r_out if i % 2 == 0 else r_in
        poly.append((cx + r * math.cos(ang1), cy + r * math.sin(ang1)))
        poly.append((cx + r * math.cos(ang2), cy + r * math.sin(ang2)))
    draw.polygon(poly, fill=fill_c, outline=outline_c)
    draw.ellipse([cx - r_in * 0.4, cy - r_in * 0.4, cx + r_in * 0.4, cy + r_in * 0.4], fill=(10, 15, 25, 255), outline=outline_c, width=2)

def draw_shield(draw, cx, cy, w, h, fill_c, outline_c):
    poly = [
        (cx - w, cy - h * 0.7),
        (cx + w, cy - h * 0.7),
        (cx + w * 0.85, cy + h * 0.2),
        (cx, cy + h),
        (cx - w * 0.85, cy + h * 0.2)
    ]
    draw.polygon(poly, fill=fill_c, outline=outline_c)

def draw_book_open(draw, cx, cy, w, h, fill_c, outline_c):
    # Left page
    poly_l = [
        (cx - 2, cy - h),
        (cx - w, cy - h * 0.85),
        (cx - w, cy + h * 0.85),
        (cx - 2, cy + h)
    ]
    # Right page
    poly_r = [
        (cx + 2, cy - h),
        (cx + w, cy - h * 0.85),
        (cx + w, cy + h * 0.85),
        (cx + 2, cy + h)
    ]
    draw.polygon(poly_l, fill=fill_c, outline=outline_c)
    draw.polygon(poly_r, fill=fill_c, outline=outline_c)
    # Spine line
    draw.line([(cx, cy - h - 5), (cx, cy + h + 5)], fill=outline_c, width=3)
    # Page lines
    for i in range(3):
        ly = cy - h * 0.5 + i * h * 0.4
        draw.line([(cx - w + 15, ly), (cx - 15, ly)], fill=outline_c, width=1)
        draw.line([(cx + 15, ly), (cx + w - 15, ly)], fill=outline_c, width=1)

def draw_quill(draw, cx, cy, length, angle, fill_c, outline_c):
    rad = math.radians(angle)
    dx = math.cos(rad)
    dy = math.sin(rad)
    px = -dy
    py = dx
    tip = (cx + length * 0.5 * dx, cy + length * 0.5 * dy)
    feather_top = (cx - length * 0.5 * dx, cy - length * 0.5 * dy)
    left_vane = (cx - length * 0.1 * dx + px * 20, cy - length * 0.1 * dy + py * 20)
    right_vane = (cx - length * 0.1 * dx - px * 15, cy - length * 0.1 * dy - py * 15)
    
    draw.polygon([feather_top, left_vane, tip, right_vane], fill=fill_c, outline=outline_c)
    draw.line([feather_top, tip], fill=outline_c, width=2)

def draw_dna(draw, cx, cy, h=220, w=60, color1=(52, 211, 153), color2=(245, 195, 75)):
    steps = 30
    for i in range(steps):
        t = i / (steps - 1)
        y = cy - h / 2 + t * h
        ang = t * 4 * math.pi
        x1 = cx + w * math.sin(ang)
        x2 = cx - w * math.sin(ang)
        
        # Draw rung
        if i % 2 == 0:
            draw.line([(x1, y), (x2, y)], fill=(color1[0], color1[1], color1[2], 180), width=2)
            mx = (x1 + x2) / 2
            draw.ellipse([mx - 3, y - 3, mx + 3, y + 3], fill=color2)
            
        # Draw nucleotide nodes
        draw.ellipse([x1 - 4, y - 4, x1 + 4, y + 4], fill=color1, outline=(255, 255, 255, 220))
        draw.ellipse([x2 - 4, y - 4, x2 + 4, y + 4], fill=color2, outline=(255, 255, 255, 220))

def draw_atom(draw, cx, cy, r=80, ring_c=(6, 182, 212), core_c=(245, 195, 75)):
    draw.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], fill=core_c, outline=(255, 255, 255, 240))
    for ang in [0, 60, 120]:
        rad = math.radians(ang)
        # Rotated ellipse points
        pts = []
        for a in range(0, 360, 10):
            arad = math.radians(a)
            lx = r * math.cos(arad)
            ly = r * 0.38 * math.sin(arad)
            # rotate
            rx = cx + lx * math.cos(rad) - ly * math.sin(rad)
            ry = cy + lx * math.sin(rad) + ly * math.cos(rad)
            pts.append((rx, ry))
        draw.polygon(pts, outline=ring_c, fill=None)
        # Draw electron on ring
        ex = cx + r * math.cos(rad)
        ey = cy + r * math.sin(rad)
        draw.ellipse([ex - 5, ey - 5, ex + 5, ey + 5], fill=(255, 255, 255), outline=ring_c)

def draw_prism(draw, cx, cy, size=70, main_c=(255, 255, 255)):
    p1 = (cx, cy - size)
    p2 = (cx - size * 0.86, cy + size * 0.5)
    p3 = (cx + size * 0.86, cy + size * 0.5)
    draw.polygon([p1, p2, p3], fill=(20, 30, 50, 140), outline=(main_c[0], main_c[1], main_c[2], 240))
    # Incoming white beam
    draw.line([(cx - 160, cy + 10), (cx - size * 0.43, cy)], fill=(255, 255, 255, 250), width=3)
    # Refracted rainbow rays
    rainbow = [
        (239, 68, 68),   # Red
        (249, 115, 22),  # Orange
        (234, 179, 8),   # Yellow
        (34, 197, 94),   # Green
        (6, 182, 212),   # Cyan
        (59, 130, 246),  # Blue
        (168, 85, 247)   # Violet
    ]
    for idx, col in enumerate(rainbow):
        offset_y = (idx - 3) * 12
        draw.line([(cx + size * 0.43, cy), (cx + 160, cy - 30 + offset_y)], fill=(col[0], col[1], col[2], 220), width=2)

def draw_spacetime(draw, cx, cy, r=100, color=(147, 197, 253)):
    for ring in range(20, r + 20, 20):
        # concentric warped circles
        draw.ellipse([cx - ring, cy - ring * 0.4, cx + ring, cy + ring * 0.4], outline=(color[0], color[1], color[2], 120), width=1)
    for deg in range(0, 360, 30):
        rad = math.radians(deg)
        x2 = cx + r * math.cos(rad)
        y2 = cy + r * 0.4 * math.sin(rad)
        draw.line([(cx, cy), (x2, y2)], fill=(color[0], color[1], color[2], 90), width=1)
    # Central black hole singularity
    draw.ellipse([cx - 22, cy - 9, cx + 22, cy + 9], fill=(5, 5, 10), outline=(245, 195, 75), width=2)
    draw.line([(cx, cy - 60), (cx, cy + 60)], fill=(255, 255, 255, 220), width=2)

def draw_armillary(draw, cx, cy, r=80, color=(245, 195, 75)):
    # Outer horizon ring
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=2)
    # Tilted ecliptic ring
    draw.ellipse([cx - r, cy - r * 0.35, cx + r, cy + r * 0.35], outline=(color[0], color[1], color[2], 180), width=2)
    # Polar ring
    draw.ellipse([cx - r * 0.35, cy - r, cx + r * 0.35, cy + r], outline=(color[0], color[1], color[2], 180), width=2)
    # Polar axis
    draw.line([(cx - r * 0.7, cy - r * 0.7), (cx + r * 0.7, cy + r * 0.7)], fill=color, width=2)
    # Central sphere
    draw.ellipse([cx - 15, cy - 15, cx + 15, cy + 15], fill=(59, 130, 246, 220), outline=color, width=2)

def draw_network(draw, cx, cy, r=85, n_nodes=8, color=(52, 211, 153)):
    nodes = []
    for i in range(n_nodes):
        ang = i * 2 * math.pi / n_nodes
        nx = cx + r * math.cos(ang)
        ny = cy + r * math.sin(ang)
        nodes.append((nx, ny))
    # Connect nodes
    for i in range(n_nodes):
        for j in range(i + 1, n_nodes):
            if (j - i) in (1, 2, n_nodes - 1, n_nodes - 2) or (j - i) == n_nodes // 2:
                draw.line([nodes[i], nodes[j]], fill=(color[0], color[1], color[2], 100), width=1)
    # Central hub
    draw.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=(color[0], color[1], color[2], 180), outline=(255, 255, 255, 220), width=2)
    for nx, ny in nodes:
        draw.line([(cx, cy), (nx, ny)], fill=(color[0], color[1], color[2], 140), width=1)
        draw.ellipse([nx - 9, ny - 9, nx + 9, ny + 9], fill=(10, 20, 30, 240), outline=color, width=2)
        draw.ellipse([nx - 4, ny - 4, nx + 4, ny + 4], fill=color)

def draw_kanban_board(draw, cx, cy, w=140, h=90, color=(16, 185, 129)):
    x1 = cx - w // 2
    y1 = cy - h // 2
    x2 = cx + w // 2
    y2 = cy + h // 2
    draw.rectangle([x1, y1, x2, y2], fill=(10, 20, 25, 200), outline=color, width=2)
    col_w = w // 3
    for i in range(1, 3):
        draw.line([(x1 + i * col_w, y1), (x1 + i * col_w, y2)], fill=(color[0], color[1], color[2], 120), width=1)
    # Sticky notes
    cards = [
        (x1 + 6, y1 + 15, col_w - 12, 18, (245, 195, 75)),
        (x1 + 6, y1 + 40, col_w - 12, 18, (244, 63, 94)),
        (x1 + col_w + 6, y1 + 15, col_w - 12, 22, (6, 182, 212)),
        (x1 + 2 * col_w + 6, y1 + 15, col_w - 12, 18, (34, 197, 94)),
        (x1 + 2 * col_w + 6, y1 + 40, col_w - 12, 18, (52, 211, 153))
    ]
    for kx, ky, kw, kh, kc in cards:
        draw.rectangle([kx, ky, kx + kw, ky + kh], fill=kc, outline=(255, 255, 255, 180))

def draw_scrum_cycle(draw, cx, cy, r=75, color=(16, 185, 129)):
    # 360 degree loop arrow
    draw.arc([cx - r, cy - r, cx + r, cy + r], start=30, end=330, fill=color, width=4)
    # Arrow head
    rad = math.radians(330)
    ax = cx + r * math.cos(rad)
    ay = cy + r * math.sin(rad)
    draw.polygon([(ax, ay - 12), (ax + 14, ay), (ax - 6, ay + 10)], fill=color)
    # Inside 3-box board
    draw_kanban_board(draw, cx, cy, w=90, h=55, color=color)

def draw_bell_curve(draw, cx, cy, w=150, h=80, color=(245, 195, 75)):
    # Baseline
    draw.line([(cx - w // 2, cy + h // 2), (cx + w // 2, cy + h // 2)], fill=color, width=2)
    # Normal distribution points
    pts = []
    for x in range(-w // 2, w // 2 + 1, 4):
        # Gaussian equation
        sigma = w / 5
        y = (h * 0.95) * math.exp(-0.5 * (x / sigma) ** 2)
        pts.append((cx + x, cy + h // 2 - y))
    draw.line(pts, fill=(color[0], color[1], color[2], 240), width=3)
    # Sigma lines
    for mult in [-1, 0, 1]:
        sx = cx + mult * (w // 5)
        draw.line([(sx, cy + h // 2), (sx, cy + h // 2 - h * 0.6)], fill=(255, 255, 255, 140), width=1)
    # Caliper symbol below
    draw.line([(cx - 40, cy + h // 2 + 15), (cx + 40, cy + h // 2 + 15)], fill=color, width=2)
    draw.line([(cx - 40, cy + h // 2 + 8), (cx - 40, cy + h // 2 + 22)], fill=color, width=2)
    draw.line([(cx + 40, cy + h // 2 + 8), (cx + 40, cy + h // 2 + 22)], fill=color, width=2)

def draw_dmaic_wheel(draw, cx, cy, r=75, color=(52, 211, 153)):
    # 5 nodes in pentagon
    pts = []
    for i in range(5):
        ang = i * 2 * math.pi / 5 - math.pi / 2
        px = cx + r * math.cos(ang)
        py = cy + r * math.sin(ang)
        pts.append((px, py))
    for i in range(5):
        draw.line([pts[i], pts[(i + 1) % 5]], fill=(color[0], color[1], color[2], 180), width=3)
    # Nodes with labels
    for px, py in pts:
        draw.ellipse([px - 14, py - 14, px + 14, py + 14], fill=(15, 25, 30, 240), outline=color, width=2)
        draw.ellipse([px - 6, py - 6, px + 6, py + 6], fill=(245, 195, 75))
    # Bullseye in center
    draw.ellipse([cx - 20, cy - 20, cx + 20, cy + 20], outline=color, width=2)
    draw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=(255, 255, 255))

def draw_rocket(draw, cx, cy, length=90, color=(244, 63, 94)):
    # Rocket body
    w = 24
    top = (cx, cy - length * 0.6)
    bot_l = (cx - w, cy + length * 0.3)
    bot_r = (cx + w, cy + length * 0.3)
    draw.polygon([top, bot_r, (cx, cy + length * 0.25), bot_l], fill=(240, 245, 255), outline=color, width=2)
    # Window
    draw.ellipse([cx - 8, cy - length * 0.15 - 8, cx + 8, cy - length * 0.15 + 8], fill=(6, 182, 212), outline=color, width=2)
    # Fins
    draw.polygon([(cx - w, cy + length * 0.1), (cx - w - 16, cy + length * 0.35), (cx - w, cy + length * 0.3)], fill=color)
    draw.polygon([(cx + w, cy + length * 0.1), (cx + w + 16, cy + length * 0.35), (cx + w, cy + length * 0.3)], fill=color)
    # Flame plume
    draw.polygon([(cx - 14, cy + length * 0.3), (cx, cy + length * 0.7), (cx + 14, cy + length * 0.3)], fill=(249, 115, 22))
    draw.polygon([(cx - 7, cy + length * 0.3), (cx, cy + length * 0.55), (cx + 7, cy + length * 0.3)], fill=(245, 195, 75))

def draw_scales_justice(draw, cx, cy, w=110, h=90, color=(245, 195, 75)):
    # Pillar
    draw.line([(cx, cy - h * 0.5), (cx, cy + h * 0.5)], fill=color, width=3)
    draw.line([(cx - 30, cy + h * 0.5), (cx + 30, cy + h * 0.5)], fill=color, width=3)
    # Crossbeam
    draw.line([(cx - w * 0.5, cy - h * 0.4), (cx + w * 0.5, cy - h * 0.4)], fill=color, width=3)
    # Left pan
    lx = cx - w * 0.5
    draw.line([(lx, cy - h * 0.4), (lx - 18, cy + 10)], fill=(color[0], color[1], color[2], 180), width=1)
    draw.line([(lx, cy - h * 0.4), (lx + 18, cy + 10)], fill=(color[0], color[1], color[2], 180), width=1)
    draw.arc([lx - 22, cy + 5, lx + 22, cy + 25], start=0, end=180, fill=color, width=2)
    # Right pan
    rx = cx + w * 0.5
    draw.line([(rx, cy - h * 0.4), (rx - 18, cy + 10)], fill=(color[0], color[1], color[2], 180), width=1)
    draw.line([(rx, cy - h * 0.4), (rx + 18, cy + 10)], fill=(color[0], color[1], color[2], 180), width=1)
    draw.arc([rx - 22, cy + 5, rx + 22, cy + 25], start=0, end=180, fill=color, width=2)

def draw_lighthouse(draw, cx, cy, w=35, h=100, color=(255, 235, 170)):
    # Tower trapezoid
    poly = [
        (cx - w * 0.4, cy - h * 0.4),
        (cx + w * 0.4, cy - h * 0.4),
        (cx + w * 0.7, cy + h * 0.5),
        (cx - w * 0.7, cy + h * 0.5)
    ]
    draw.polygon(poly, fill=(230, 235, 245), outline=(100, 110, 130), width=2)
    # Red stripe
    draw.polygon([
        (cx - w * 0.5, cy - h * 0.1),
        (cx + w * 0.5, cy - h * 0.1),
        (cx + w * 0.6, cy + h * 0.15),
        (cx - w * 0.6, cy + h * 0.15)
    ], fill=(239, 68, 68))
    # Lantern room & light beam
    lx = cx
    ly = cy - h * 0.45
    draw.rectangle([lx - 12, ly - 15, lx + 12, ly], fill=(255, 255, 200), outline=(218, 165, 32), width=2)
    # Beams
    draw.polygon([(lx, ly - 7), (lx - 160, ly - 50), (lx - 160, ly + 25)], fill=(255, 245, 180, 80))
    draw.polygon([(lx, ly - 7), (lx + 160, ly - 50), (lx + 160, ly + 25)], fill=(255, 245, 180, 80))

def draw_handshake(draw, cx, cy, w=90, h=50, color=(245, 195, 75)):
    # Left cuff
    draw.rectangle([cx - w, cy - 15, cx - w + 25, cy + 15], fill=(30, 58, 138), outline=color)
    # Right cuff
    draw.rectangle([cx + w - 25, cy - 15, cx + w, cy + 15], fill=(15, 23, 42), outline=color)
    # Hands joined
    draw.polygon([(cx - w + 25, cy - 10), (cx, cy - 18), (cx + 20, cy), (cx, cy + 15), (cx - 20, cy + 5)], fill=(251, 191, 36), outline=(218, 165, 32))
    draw.polygon([(cx + w - 25, cy - 10), (cx, cy - 18), (cx - 20, cy), (cx, cy + 15), (cx + 20, cy + 5)], fill=(245, 158, 11), outline=(218, 165, 32))
    # Growth graph above
    for idx, gh in enumerate([20, 35, 55, 75]):
        bx = cx - 45 + idx * 24
        draw.rectangle([bx, cy - 40 - gh, bx + 16, cy - 40], fill=(34, 197, 94, 200), outline=color)
    draw.line([(cx - 50, cy - 40), (cx + 45, cy - 115)], fill=(245, 195, 75), width=3)
    draw.polygon([(cx + 45, cy - 115), (cx + 45, cy - 100), (cx + 30, cy - 115)], fill=(245, 195, 75))

def draw_infinity_loop(draw, cx, cy, w=130, h=65, color=(6, 182, 212)):
    # Lemniscate of Bernoulli
    pts_l = []
    pts_r = []
    steps = 80
    for i in range(steps):
        t = i * 2 * math.pi / steps
        denom = 1 + math.sin(t) ** 2
        x = cx + (w * math.cos(t)) / denom
        y = cy + (h * math.sin(t) * math.cos(t)) / denom
        if x < cx:
            pts_l.append((x, y))
        else:
            pts_r.append((x, y))
    draw.line(pts_l + [(cx, cy)], fill=color, width=4)
    draw.line(pts_r + [(cx, cy)], fill=(168, 85, 247), width=4)
    # Core nodes
    draw.ellipse([cx - w * 0.42 - 8, cy - 8, cx - w * 0.42 + 8, cy + 8], fill=(255, 255, 255), outline=color, width=2)
    draw.ellipse([cx + w * 0.42 - 8, cy - 8, cx + w * 0.42 + 8, cy + 8], fill=(255, 255, 255), outline=(168, 85, 247), width=2)
    draw.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=(245, 195, 75))

def draw_brain(draw, cx, cy, r=70, color=(168, 85, 247)):
    # Left lobe
    draw.arc([cx - r, cy - r * 0.7, cx, cy + r * 0.7], start=90, end=270, fill=color, width=3)
    # Right lobe
    draw.arc([cx, cy - r * 0.7, cx + r, cy + r * 0.7], start=270, end=90, fill=color, width=3)
    draw.line([(cx, cy - r * 0.65), (cx, cy + r * 0.65)], fill=color, width=2)
    # Circuit convolutions
    for idx, dy in enumerate([-30, -10, 10, 30]):
        draw.line([(cx - 5, cy + dy), (cx - 40, cy + dy)], fill=color, width=2)
        draw.ellipse([cx - 44, cy + dy - 4, cx - 36, cy + dy + 4], fill=(255, 255, 255))
        draw.line([(cx + 5, cy + dy), (cx + 40, cy + dy)], fill=(6, 182, 212), width=2)
        draw.ellipse([cx + 36, cy + dy - 4, cx + 44, cy + dy + 4], fill=(255, 255, 255))

def draw_cloud_architecture(draw, cx, cy, w=110, h=60, color=(6, 182, 212)):
    # Cloud puff circles
    draw.ellipse([cx - 45, cy - 25, cx + 5, cy + 25], fill=(30, 58, 138, 220), outline=color, width=2)
    draw.ellipse([cx - 15, cy - 45, cx + 45, cy + 15], fill=(30, 58, 138, 220), outline=color, width=2)
    draw.ellipse([cx + 5, cy - 25, cx + 55, cy + 25], fill=(30, 58, 138, 220), outline=color, width=2)
    draw.rectangle([cx - 35, cy, cx + 45, cy + 25], fill=(30, 58, 138, 220))
    draw.line([(cx - 35, cy + 25), (cx + 45, cy + 25)], fill=color, width=2)
    # Server rack below
    sy = cy + 45
    draw.rectangle([cx - 40, sy, cx + 40, sy + 35], fill=(15, 23, 42), outline=color, width=2)
    for i in range(3):
        draw.line([(cx - 35, sy + 9 + i * 9), (cx + 35, sy + 9 + i * 9)], fill=(color[0], color[1], color[2], 140), width=1)
        draw.ellipse([cx + 25, sy + 6 + i * 9, cx + 31, sy + 12 + i * 9], fill=(34, 197, 94))
    # Connecting lightning / data stream
    draw.line([(cx, cy + 25), (cx, sy)], fill=(245, 195, 75), width=2)

def draw_wind_turbine(draw, cx, cy, h=110, color=(34, 197, 94)):
    # Tower
    draw.polygon([(cx - 4, cy - h * 0.2), (cx + 4, cy - h * 0.2), (cx + 10, cy + h * 0.6), (cx - 10, cy + h * 0.6)], fill=(220, 230, 240), outline=color, width=2)
    # Hub
    hy = cy - h * 0.2
    draw.ellipse([cx - 8, hy - 8, cx + 8, hy + 8], fill=(245, 195, 75), outline=color, width=2)
    # 3 Rotor blades
    blade_len = 70
    for deg in [0, 120, 240]:
        rad = math.radians(deg)
        bx = cx + blade_len * math.sin(rad)
        by = hy - blade_len * math.cos(rad)
        # Blade polygon
        px = 8 * math.cos(rad)
        py = 8 * math.sin(rad)
        draw.polygon([(cx, hy), (bx - px, by - py), (bx, by), (bx + px, by + py)], fill=(240, 250, 240), outline=color)
    # Solar panel at base
    py1 = cy + h * 0.35
    draw.polygon([(cx - 50, py1 + 25), (cx - 20, py1), (cx + 50, py1), (cx + 20, py1 + 25)], fill=(30, 58, 138), outline=color, width=2)
    draw.line([(cx - 35, py1 + 12), (cx + 35, py1 + 12)], fill=(6, 182, 212), width=1)

def draw_3d_cube(draw, cx, cy, size=55, color=(249, 115, 22)):
    # Isometric cube
    top_p = [
        (cx, cy - size),
        (cx + size * 0.86, cy - size * 0.5),
        (cx, cy),
        (cx - size * 0.86, cy - size * 0.5)
    ]
    left_p = [
        (cx - size * 0.86, cy - size * 0.5),
        (cx, cy),
        (cx, cy + size),
        (cx - size * 0.86, cy + size * 0.5)
    ]
    right_p = [
        (cx, cy),
        (cx + size * 0.86, cy - size * 0.5),
        (cx + size * 0.86, cy + size * 0.5),
        (cx, cy + size)
    ]
    draw.polygon(top_p, fill=(color[0], color[1], color[2], 230), outline=(255, 255, 255, 240), width=2)
    draw.polygon(left_p, fill=(int(color[0]*0.7), int(color[1]*0.7), int(color[2]*0.7), 230), outline=(255, 255, 255, 240), width=2)
    draw.polygon(right_p, fill=(int(color[0]*0.4), int(color[1]*0.4), int(color[2]*0.4), 230), outline=(255, 255, 255, 240), width=2)
    # Insight gem on top
    draw.ellipse([cx - 10, cy - size * 0.5 - 10, cx + 10, cy - size * 0.5 + 10], fill=(255, 235, 170), outline=(245, 195, 75), width=2)

def draw_padlock(draw, cx, cy, w=70, h=60, color=(6, 182, 212)):
    # Shackle
    draw.arc([cx - 25, cy - 65, cx + 25, cy - 15], start=180, end=0, fill=(220, 230, 240), width=8)
    draw.line([(cx - 25, cy - 40), (cx - 25, cy - 10)], fill=(220, 230, 240), width=8)
    draw.line([(cx + 25, cy - 40), (cx + 25, cy - 10)], fill=(220, 230, 240), width=8)
    # Body
    draw.rectangle([cx - w // 2, cy - 10, cx + w // 2, cy + h], fill=(20, 30, 50), outline=color, width=3)
    # Keyhole
    draw.ellipse([cx - 8, cy + 10, cx + 8, cy + 26], fill=color)
    draw.polygon([(cx - 5, cy + 24), (cx + 5, cy + 24), (cx + 8, cy + 40), (cx - 8, cy + 40)], fill=color)
    # Hexagonal forcefield around
    hex_pts = []
    for i in range(6):
        ang = i * math.pi / 3 - math.pi / 6
        hex_pts.append((cx + 85 * math.cos(ang), cy + 15 + 85 * math.sin(ang)))
    draw.polygon(hex_pts, outline=(color[0], color[1], color[2], 120), fill=None)

def draw_robot_arm(draw, cx, cy, color=(249, 115, 22)):
    # Base
    draw.rectangle([cx - 45, cy + 60, cx + 45, cy + 80], fill=(40, 50, 60), outline=color, width=2)
    # Joint 1
    draw.ellipse([cx - 16, cy + 45, cx + 16, cy + 77], fill=color)
    # Arm segment 1
    p1 = (cx, cy + 60)
    p2 = (cx - 45, cy - 10)
    draw.line([p1, p2], fill=(200, 210, 220), width=10)
    draw.line([p1, p2], fill=color, width=2)
    # Joint 2
    draw.ellipse([p2[0] - 14, p2[1] - 14, p2[0] + 14, p2[1] + 14], fill=color)
    # Arm segment 2
    p3 = (cx + 25, cy - 40)
    draw.line([p2, p3], fill=(200, 210, 220), width=8)
    draw.line([p2, p3], fill=color, width=2)
    # Gripper / Welder head
    draw.polygon([(p3[0], p3[1]), (p3[0] + 25, p3[1] + 15), (p3[0] + 15, p3[1] + 25)], fill=color)
    # Welding spark
    sp_x, sp_y = p3[0] + 25, p3[1] + 25
    draw.ellipse([sp_x - 6, sp_y - 6, sp_x + 6, sp_y + 6], fill=(255, 255, 255))
    draw_star(draw, sp_x, sp_y, 18, 6, 4, (255, 245, 150), (249, 115, 22))

def draw_courthouse(draw, cx, cy, w=120, h=90, color=(251, 146, 60)):
    # Triangular pediment
    top = (cx, cy - h * 0.6)
    p_l = (cx - w * 0.5, cy - h * 0.2)
    p_r = (cx + w * 0.5, cy - h * 0.2)
    draw.polygon([top, p_l, p_r], fill=(30, 40, 50), outline=color, width=2)
    # Columns
    cols = 4
    col_w = 12
    step = (w - col_w * cols) / (cols - 1)
    for i in range(cols):
        lx = cx - w * 0.5 + i * (col_w + step)
        draw.rectangle([lx, cy - h * 0.2, lx + col_w, cy + h * 0.4], fill=(220, 230, 240), outline=color, width=1)
    # Base stairs
    draw.rectangle([cx - w * 0.55, cy + h * 0.4, cx + w * 0.55, cy + h * 0.48], fill=(30, 40, 50), outline=color, width=2)
    draw.rectangle([cx - w * 0.6, cy + h * 0.48, cx + w * 0.6, cy + h * 0.56], fill=(30, 40, 50), outline=color, width=2)
    # Gavel in front
    gx, gy = cx, cy + 5
    draw.rectangle([gx - 22, gy - 12, gx + 22, gy + 12], fill=(180, 83, 9), outline=color, width=2)
    draw.line([(gx, gy + 12), (gx + 35, gy + 45)], fill=(180, 83, 9), width=4)

def draw_tree_of_talent(draw, cx, cy, w=110, h=100, color=(34, 197, 94)):
    # Trunk
    draw.polygon([(cx - 12, cy + h * 0.5), (cx + 12, cy + h * 0.5), (cx + 6, cy - h * 0.1), (cx - 6, cy - h * 0.1)], fill=(146, 64, 14), outline=(245, 195, 75), width=2)
    # Canopy circles
    canopies = [
        (cx, cy - h * 0.35, 42),
        (cx - 35, cy - h * 0.15, 32),
        (cx + 35, cy - h * 0.15, 32),
        (cx - 20, cy - h * 0.45, 26),
        (cx + 20, cy - h * 0.45, 26)
    ]
    for kx, ky, kr in canopies:
        draw.ellipse([kx - kr, ky - kr, kx + kr, ky + kr], fill=(22, 101, 52, 220), outline=color, width=2)
    # Glowing fruit / stars of talent
    fruits = [(cx, cy - h*0.35), (cx - 25, cy - h*0.2), (cx + 25, cy - h*0.2), (cx - 15, cy - h*0.45), (cx + 15, cy - h*0.45)]
    for fx, fy in fruits:
        draw.ellipse([fx - 5, fy - 5, fx + 5, fy + 5], fill=(245, 195, 75), outline=(255, 255, 255))

def draw_hardhat_safety(draw, cx, cy, w=90, h=65, color=(234, 179, 8)):
    # Helmet dome
    draw.chord([cx - w * 0.5, cy - h * 0.7, cx + w * 0.5, cy + h * 0.3], start=180, end=0, fill=color, outline=(180, 130, 20), width=2)
    # Brim
    draw.rectangle([cx - w * 0.6, cy + h * 0.05, cx + w * 0.6, cy + h * 0.22], fill=color, outline=(180, 130, 20), width=2)
    # Ridge
    draw.line([(cx, cy - h * 0.65), (cx, cy + h * 0.05)], fill=(255, 255, 255), width=4)
    # Emerald cross badge on helmet
    draw.rectangle([cx - 4, cy - h * 0.4, cx + 4, cy - h * 0.1], fill=(34, 197, 94))
    draw.rectangle([cx - 12, cy - h * 0.28, cx + 12, cy - h * 0.22], fill=(34, 197, 94))

def draw_torch_flame(draw, cx, cy, h=110, color=(249, 115, 22)):
    # Torch handle
    draw.polygon([(cx - 10, cy), (cx + 10, cy), (cx + 6, cy + h * 0.5), (cx - 6, cy + h * 0.5)], fill=(218, 165, 32), outline=(180, 130, 20), width=2)
    # Torch bowl
    draw.polygon([(cx - 26, cy - 15), (cx + 26, cy - 15), (cx + 14, cy), (cx - 14, cy)], fill=(245, 195, 75), outline=(180, 130, 20), width=2)
    # Blazing flames
    draw.polygon([(cx - 20, cy - 15), (cx - 12, cy - 65), (cx, cy - 40), (cx + 12, cy - 80), (cx + 20, cy - 15)], fill=(239, 68, 68))
    draw.polygon([(cx - 12, cy - 15), (cx - 6, cy - 50), (cx, cy - 35), (cx + 6, cy - 60), (cx + 12, cy - 15)], fill=(249, 115, 22))
    draw.polygon([(cx - 6, cy - 15), (cx, cy - 45), (cx + 6, cy - 15)], fill=(255, 235, 170))

print("Motif drawers module ready!")
