"""
Master Generator for 86 Unique, High-Aesthetic, No-Copyright Certificate Covers
Khohar Portofolio - Grand Codex Library Edition
"""
import os
import math
import random
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

import motif_drawers as md
import cert_renderers as cr

W, H = 720, 960
OUT_DIR = os.path.join("cert_covers", "ai_art")
os.makedirs(OUT_DIR, exist_ok=True)

def get_fonts():
    fonts = {}
    font_paths = {
        "title": "C:/Windows/Fonts/georgiab.ttf",
        "title_alt": "C:/Windows/Fonts/cambriab.ttf",
        "sub": "C:/Windows/Fonts/arialbd.ttf",
        "small": "C:/Windows/Fonts/arial.ttf",
        "mono": "C:/Windows/Fonts/consola.ttf"
    }
    for k, p in font_paths.items():
        fonts[k] = p if os.path.exists(p) else None
    return fonts

FONTS = get_fonts()

def load_font(key, size):
    path = FONTS.get(key)
    if path and os.path.exists(path):
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()

THEME_PALETTES = {
    "gold": {
        "bg_top": (10, 14, 28),
        "bg_bot": (5, 8, 16),
        "glow_core": (245, 195, 75),
        "glow_soft": (212, 175, 55),
        "accent": (255, 235, 170),
        "border": (218, 165, 32),
        "ribbon": (180, 130, 20),
        "text_gold": (250, 230, 150),
    },
    "emerald": {
        "bg_top": (6, 22, 16),
        "bg_bot": (3, 10, 8),
        "glow_core": (34, 197, 94),
        "glow_soft": (16, 185, 129),
        "accent": (167, 243, 208),
        "border": (52, 211, 153),
        "ribbon": (16, 120, 80),
        "text_gold": (209, 250, 229),
    },
    "electro": {
        "bg_top": (18, 10, 34),
        "bg_bot": (8, 4, 18),
        "glow_core": (168, 85, 247),
        "glow_soft": (139, 92, 246),
        "accent": (233, 213, 255),
        "border": (192, 132, 252),
        "ribbon": (109, 40, 217),
        "text_gold": (243, 232, 255),
    },
    "cyan": {
        "bg_top": (8, 20, 32),
        "bg_bot": (3, 9, 18),
        "glow_core": (6, 182, 212),
        "glow_soft": (14, 165, 233),
        "accent": (186, 230, 253),
        "border": (56, 189, 248),
        "ribbon": (3, 105, 161),
        "text_gold": (224, 242, 254),
    },
    "pyro": {
        "bg_top": (30, 12, 12),
        "bg_bot": (14, 5, 5),
        "glow_core": (249, 115, 22),
        "glow_soft": (239, 68, 68),
        "accent": (254, 215, 170),
        "border": (251, 146, 60),
        "ribbon": (194, 65, 12),
        "text_gold": (255, 237, 213),
    },
    "ruby": {
        "bg_top": (28, 8, 18),
        "bg_bot": (12, 3, 8),
        "glow_core": (244, 63, 94),
        "glow_soft": (225, 29, 72),
        "accent": (254, 205, 211),
        "border": (251, 113, 133),
        "ribbon": (190, 18, 60),
        "text_gold": (255, 228, 230),
    }
}

def create_base_canvas(theme_key, seed):
    rng = random.Random(seed)
    pal = THEME_PALETTES.get(theme_key, THEME_PALETTES["gold"])
    
    # 1. Base gradient
    top_c = np.array(pal["bg_top"], dtype=float)
    bot_c = np.array(pal["bg_bot"], dtype=float)
    arr = np.zeros((H, W, 4), dtype=np.uint8)
    for y in range(H):
        t = y / (H - 1)
        c = (1 - t) * top_c + t * bot_c
        arr[y, :, 0] = int(c[0])
        arr[y, :, 1] = int(c[1])
        arr[y, :, 2] = int(c[2])
        arr[y, :, 3] = 255
    img = Image.fromarray(arr, "RGBA")
    
    # 2. Central nebula glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_glow = ImageDraw.Draw(glow)
    cx, cy = W // 2, 400
    
    core_c = pal["glow_core"]
    soft_c = pal["glow_soft"]
    
    for r in range(250, 20, -25):
        alpha = int(24 * (1 - r / 250) ** 1.4)
        d_glow.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(soft_c[0], soft_c[1], soft_c[2], alpha))
    for r in range(130, 10, -15):
        alpha = int(48 * (1 - r / 130))
        d_glow.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(core_c[0], core_c[1], core_c[2], alpha))
        
    glow = glow.filter(ImageFilter.GaussianBlur(25))
    img = Image.alpha_composite(img, glow)
    
    # 3. Celestial Starfield & Constellation Grid
    stars = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_stars = ImageDraw.Draw(stars)
    star_pts = []
    for _ in range(110):
        sx = rng.randint(35, W - 35)
        sy = rng.randint(45, H - 150)
        mag = rng.random()
        star_pts.append((sx, sy, mag))
        if mag > 0.85:
            cr = rng.randint(4, 7)
            d_stars.line([(sx - cr, sy), (sx + cr, sy)], fill=(255, 255, 255, 180), width=1)
            d_stars.line([(sx, sy - cr), (sx, sy + cr)], fill=(255, 255, 255, 180), width=1)
            d_stars.ellipse([sx - 1, sy - 1, sx + 1, sy + 1], fill=(255, 255, 255, 240))
        elif mag > 0.5:
            d_stars.ellipse([sx - 1, sy - 1, sx + 1, sy + 1], fill=(240, 240, 255, int(110 + 70 * mag)))
        else:
            d_stars.point((sx, sy), fill=(220, 220, 255, int(70 + 90 * mag)))
            
    for i in range(len(star_pts) - 1):
        x1, y1, m1 = star_pts[i]
        for j in range(i + 1, min(i + 4, len(star_pts))):
            x2, y2, m2 = star_pts[j]
            dist = math.hypot(x2 - x1, y2 - y1)
            if 35 < dist < 85 and (m1 > 0.65 or m2 > 0.65):
                d_stars.line([(x1, y1), (x2, y2)], fill=(pal["border"][0], pal["border"][1], pal["border"][2], 30), width=1)
                
    img = Image.alpha_composite(img, stars)
    
    # 4. Sacred Celestial Focus Ring
    ring_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_ring = ImageDraw.Draw(ring_img)
    bc = pal["border"]
    
    d_ring.ellipse([cx - 190, cy - 190, cx + 190, cy + 190], outline=(bc[0], bc[1], bc[2], 85), width=2)
    d_ring.ellipse([cx - 175, cy - 175, cx + 175, cy + 175], outline=(bc[0], bc[1], bc[2], 45), width=1)
    d_ring.ellipse([cx - 130, cy - 130, cx + 130, cy + 130], outline=(bc[0], bc[1], bc[2], 65), width=1)
    
    for deg in range(0, 360, 15):
        rad = math.radians(deg)
        r1 = 175
        r2 = 190 if deg % 45 == 0 else 183
        x1 = cx + r1 * math.cos(rad)
        y1 = cy + r1 * math.sin(rad)
        x2 = cx + r2 * math.cos(rad)
        y2 = cy + r2 * math.sin(rad)
        alpha = 130 if deg % 45 == 0 else 60
        d_ring.line([(x1, y1), (x2, y2)], fill=(bc[0], bc[1], bc[2], alpha), width=1 if deg % 45 != 0 else 2)
        
    for deg in range(0, 360, 45):
        rad = math.radians(deg)
        x1 = cx + 80 * math.cos(rad)
        y1 = cy + 80 * math.sin(rad)
        x2 = cx + 210 * math.cos(rad)
        y2 = cy + 210 * math.sin(rad)
        d_ring.line([(x1, y1), (x2, y2)], fill=(bc[0], bc[1], bc[2], 35), width=1)
        
    img = Image.alpha_composite(img, ring_img)
    return img, pal

def draw_frame_and_decorations(img, pal, cat_name, title_text, cert_id, stars_count=5):
    draw = ImageDraw.Draw(img)
    bc = pal["border"]
    
    pad1 = 22
    pad2 = 30
    draw.rectangle([pad1, pad1, W - pad1, H - pad1], outline=(bc[0], bc[1], bc[2], 200), width=2)
    draw.rectangle([pad2, pad2, W - pad2, H - pad2], outline=(bc[0], bc[1], bc[2], 90), width=1)
    
    c_size = 28
    corners = [
        (pad1, pad1, 1, 1),
        (W - pad1, pad1, -1, 1),
        (pad1, H - pad1, 1, -1),
        (W - pad1, H - pad1, -1, -1)
    ]
    for cx, cy, dx, dy in corners:
        draw.line([(cx, cy + dy * c_size), (cx + dx * c_size, cy)], fill=(bc[0], bc[1], bc[2], 230), width=2)
        draw.line([(cx + dx * 8, cy + dy * c_size), (cx + dx * c_size, cy + dy * 8)], fill=(bc[0], bc[1], bc[2], 120), width=1)
        mx, my = cx + dx * 10, cy + dy * 10
        draw.polygon([(mx, my - 4), (mx + 4, my), (mx, my + 4), (mx - 4, my)], fill=(255, 235, 170, 240), outline=(bc[0], bc[1], bc[2], 255))

    # Top Ribbon Plate
    rib_w, rib_h = 380, 42
    rx1 = (W - rib_w) // 2
    ry1 = pad1 - 10
    rx2 = rx1 + rib_w
    ry2 = ry1 + rib_h
    
    draw.rectangle([rx1, ry1, rx2, ry2], fill=(pal["bg_top"][0], pal["bg_top"][1], pal["bg_top"][2], 245), outline=(bc[0], bc[1], bc[2], 230), width=2)
    draw.rectangle([rx1 + 4, ry1 + 3, rx2 - 4, ry2 - 3], outline=(bc[0], bc[1], bc[2], 100), width=1)
    
    f_cat = load_font("sub", 14)
    cat_upper = cat_name.upper()
    try:
        bbox = f_cat.getbbox(cat_upper)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
    except Exception:
        tw, th = 150, 14
    tx = rx1 + (rib_w - tw) // 2
    ty = ry1 + (rib_h - th) // 2 - 2
    draw.text((tx, ty), cat_upper, font=f_cat, fill=pal["accent"])
    
    # Bottom Plaque: Title and Star Rating
    bot_w, bot_h = 630, 205
    bx1 = (W - bot_w) // 2
    by1 = H - pad1 - bot_h
    bx2 = bx1 + bot_w
    by2 = by1 + bot_h
    
    draw.rectangle([bx1, by1, bx2, by2], fill=(pal["bg_bot"][0], pal["bg_bot"][1], pal["bg_bot"][2], 240), outline=(bc[0], bc[1], bc[2], 220), width=2)
    draw.rectangle([bx1 + 5, by1 + 5, bx2 - 5, by2 - 5], outline=(bc[0], bc[1], bc[2], 80), width=1)
    
    tab_w = 190
    tx1 = (W - tab_w) // 2
    draw.rectangle([tx1, by1 - 12, tx1 + tab_w, by1 + 1], fill=(bc[0], bc[1], bc[2], 220))
    f_id = load_font("mono", 11)
    id_txt = cert_id.upper()
    draw.text((tx1 + (tab_w - 60)//2, by1 - 10), id_txt, font=f_id, fill=(10, 15, 25))
    
    star_y = by1 + 20
    star_spacing = 26
    start_star_x = W // 2 - ((stars_count - 1) * star_spacing) // 2
    for s in range(stars_count):
        sx = start_star_x + s * star_spacing
        sy = star_y
        star_poly = []
        for i in range(10):
            r = 9 if i % 2 == 0 else 4.5
            angle = i * math.pi / 5 - math.pi / 2
            star_poly.append((sx + r * math.cos(angle), sy + r * math.sin(angle)))
        draw.polygon(star_poly, fill=(255, 215, 0, 255), outline=(218, 165, 32, 255))
        draw.point((sx, sy), fill=(255, 255, 255, 255))
        
    f_title = load_font("title", 20)
    words = title_text.split()
    lines = []
    cur = ""
    for w in words:
        test = cur + (" " if cur else "") + w
        try:
            bb = f_title.getbbox(test)
            w_px = bb[2] - bb[0]
        except Exception:
            w_px = len(test) * 11
        if w_px < bot_w - 50:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
        
    lines = lines[:3]
    line_h = 28
    tot_text_h = len(lines) * line_h
    start_ty = by1 + 60 + (85 - tot_text_h) // 2
    for idx, l in enumerate(lines):
        try:
            bb = f_title.getbbox(l)
            w_px = bb[2] - bb[0]
        except Exception:
            w_px = len(l) * 11
        lx = (W - w_px) // 2
        ly = start_ty + idx * line_h
        draw.text((lx + 1, ly + 1), l, font=f_title, fill=(5, 5, 10, 220))
        draw.text((lx, ly), l, font=f_title, fill=pal["text_gold"])
        
    f_seal = load_font("small", 12)
    seal_txt = "ACADEMIC ARCHIVE • VERIFIED CREDENTIAL"
    try:
        bb = f_seal.getbbox(seal_txt)
        sw = bb[2] - bb[0]
    except Exception:
        sw = 220
    draw.text(((W - sw) // 2, by2 - 25), seal_txt, font=f_seal, fill=(bc[0], bc[1], bc[2], 180))

def generate_cover_for_cert(cert):
    cert_id = cert["id"]
    category = cert.get("category", "olim")
    cat_name = cert.get("category_name_id", "Sertifikat")
    title_text = cert.get("title_id", cert_id)
    color_theme = cert.get("color_theme", "gold")
    stars_count = cert.get("stars", 5)
    
    # Unique deterministic seed based on ID
    seed = sum(ord(c) * (i + 1) for i, c in enumerate(cert_id))
    
    # 1. Base canvas with cosmic theme
    img, pal = create_base_canvas(color_theme, seed)
    
    # 2. Draw Hero Motif in center
    cx, cy = W // 2, 400
    hero_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_hero = ImageDraw.Draw(hero_layer)
    cr.render_hero_motif(cert_id, d_hero, pal, cx, cy)
    img = Image.alpha_composite(img, hero_layer)
    
    # 3. Draw Frame and Plaques
    draw_frame_and_decorations(img, pal, cat_name, title_text, cert_id, stars_count)
    
    # 4. Save as WebP
    out_filename = f"cover_{cert_id}.webp"
    out_path = os.path.join(OUT_DIR, out_filename)
    
    # Convert RGBA to RGB for saving
    rgb_img = Image.new("RGB", (W, H), (10, 15, 25))
    rgb_img.paste(img, mask=img.split()[3])
    rgb_img.save(out_path, "WEBP", quality=92)
    
    return os.path.join("cert_covers", "ai_art", out_filename).replace("\\", "/")

def main():
    with open("certificates.json", "r", encoding="utf-8") as f:
        certs = json.load(f)
        
    print(f"Starting generation for {len(certs)} certificate covers...")
    updated_count = 0
    
    for i, cert in enumerate(certs):
        cert_id = cert["id"]
        rel_path = generate_cover_for_cert(cert)
        cert["thumb_img"] = rel_path
        updated_count += 1
        print(f"[{updated_count:02d}/{len(certs):02d}] Generated cover for {cert_id}: {cert.get('title_id')[:35]}... -> {rel_path}")
        
    # Write back updated certificates.json
    with open("certificates.json", "w", encoding="utf-8") as f:
        json.dump(certs, f, indent=2, ensure_ascii=False)
        
    print(f"\nAll {updated_count} covers successfully generated and certificates.json updated!")

if __name__ == "__main__":
    main()
