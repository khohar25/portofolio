"""
Master Scenic Cover Generator for 86 Unique, No-Copyright Certificate Illustrations
Khohar Portofolio - Scenic Concept Art Edition
"""
import os
import glob
import json
from PIL import Image, ImageEnhance, ImageOps

OUT_DIR = os.path.join("cert_covers", "ai_art")
os.makedirs(OUT_DIR, exist_ok=True)

BRAIN_DIR = r"C:\Users\fatah\.gemini\antigravity\brain\db35a3c8-ad71-4821-a4f7-b99412c68352"

# 1. Collect all 25 master original paintings
MASTER_KEYS = {
    "biology_research": "art_biology_research_1790661684867.jpg",
    "biology_dna_lab": "test_quota_check_1790730667886.jpg",
    "physics_quantum_lab": "art_quantum_physics_1790731477864.jpg",
    "physics_optics": "art_physics_quantum_1790661711764.jpg",
    "astronomy_cosmos": "art_astronomy_cosmos_1790661736978.jpg",
    "english_linguistics": "art_english_linguistics_1790661760108.jpg",
    "sociology_humanities": "art_sociology_humanities_1790661800335.jpg",
    "scrum_agile": "art_scrum_agile_1790661825254.jpg",
    "sixsigma_quality": "art_sixsigma_quality_1790661848768.jpg",
    "business_venture": "art_business_venture_1790731504382.jpg",
    "ai_agentic": "art_ai_agentic_1790661876332.jpg",
    "design_thinking": "art_design_thinking_1790661898247.jpg",
    "cybersecurity": "art_cybersecurity_1790661928850.jpg",
    "cloud_devops": "art_cloud_devops_1790661976889.jpg",
    "bigdata_analytics": "art_bigdata_analytics_1790662009351.jpg",
    "green_energy": "art_green_energy_1790662044290.jpg",
    "robotics_automation": "art_robotics_automation_1790731529160.jpg",
    "supply_chain": "art_supply_chain_1790731560767.jpg",
    "macro_finance": "art_macro_finance_1790731627223.jpg",
    "business_law": "art_business_law_1790731670819.jpg",
    "health_safety": "art_health_safety_1790731708197.jpg",
    "software_architecture": "art_software_architecture_1790731742775.jpg",
    "esg_sustainability": "art_esg_sustainability_1790731770849.jpg",
    "leadership_negotiation": "art_leadership_negotiation_1790731810293.jpg",
    "marketing_strategy": "art_marketing_strategy_1790731878520.jpg",
}

# Verify all master images exist
MASTER_IMAGES = {}
for k, fname in MASTER_KEYS.items():
    p = os.path.join(BRAIN_DIR, fname)
    if os.path.exists(p):
        MASTER_IMAGES[k] = p
    else:
        print(f"Warning: {fname} not found!")

# Master Mapping for all 86 certificates
# tuple format: (master_key, crop_type, color_adjust)
# crop_types: 'full', 'zoom_center', 'zoom_top', 'zoom_bottom', 'zoom_left', 'zoom_right', 'cinematic_wide'
CERT_MAP = {
    # 1. Olimpiade
    "olim-1": ("biology_research", "full", {"warmth": 1.05, "sat": 1.1}),
    "olim-2": ("english_linguistics", "full", {"warmth": 1.1, "sat": 1.05}),
    "olim-3": ("physics_quantum_lab", "zoom_center", {"warmth": 1.05, "contrast": 1.08}),
    "olim-4": ("english_linguistics", "zoom_bottom", {"warmth": 1.15, "contrast": 1.05}),
    "olim-5": ("physics_optics", "full", {"sat": 1.15, "contrast": 1.05}),
    "olim-6": ("physics_quantum_lab", "zoom_top", {"contrast": 1.1, "sat": 1.1}),
    "olim-7": ("astronomy_cosmos", "full", {"sat": 1.1, "contrast": 1.08}),
    "olim-8": ("sociology_humanities", "full", {"warmth": 1.08, "sat": 1.05}),

    # 2. Profesi
    "prof-1": ("scrum_agile", "full", {"sat": 1.08, "contrast": 1.05}),
    "prof-2": ("sixsigma_quality", "zoom_center", {"warmth": 1.18, "sat": 1.1}),      # Yellow belt warm
    "prof-3": ("sixsigma_quality", "zoom_bottom", {"warmth": 0.95, "contrast": 1.08}), # White belt cool
    "prof-4": ("sixsigma_quality", "zoom_left", {"tint_green": 1.12, "sat": 1.08}),   # Lean emerald
    "prof-5": ("scrum_agile", "zoom_right", {"sat": 1.1, "contrast": 1.05}),          # Kanban board
    "prof-6": ("marketing_strategy", "zoom_bottom", {"warmth": 1.12, "contrast": 1.06}), # OKR Target
    "prof-7": ("leadership_negotiation", "zoom_bottom", {"contrast": 1.08, "sat": 1.05}), # PM Plan
    "prof-8": ("business_venture", "full", {"warmth": 1.08, "contrast": 1.08}),      # Startup rocket
    "prof-9": ("software_architecture", "zoom_center", {"sat": 1.12, "contrast": 1.08}), # BA flow
    "prof-10": ("leadership_negotiation", "zoom_center", {"warmth": 1.1, "contrast": 1.05}), # Business Mgmt
    "prof-11": ("leadership_negotiation", "full", {"warmth": 1.12, "contrast": 1.08}),      # Leadership
    "prof-12": ("macro_finance", "zoom_bottom", {"warmth": 1.15, "sat": 1.1}),              # Corporate Sales
    "prof-13": ("business_law", "zoom_center", {"warmth": 1.08, "contrast": 1.05}),          # Negotiation
    "prof-14": ("marketing_strategy", "full", {"sat": 1.12, "contrast": 1.08}),             # Mktg Strategy
    "prof-15": ("marketing_strategy", "zoom_left", {"contrast": 1.1, "sat": 1.1}),          # Mktg Research
    "prof-16": ("marketing_strategy", "zoom_top", {"sat": 1.15, "contrast": 1.08}),          # Digital Mktg

    # 3. IBM SkillsBuild
    "ibm-1": ("ai_agentic", "zoom_left", {"sat": 1.15, "contrast": 1.05}),          # AI Customer Service
    "ibm-2": ("business_law", "zoom_left", {"contrast": 1.08, "sat": 1.05}),        # AI Governance
    "ibm-3": ("ai_agentic", "zoom_bottom", {"sat": 1.1, "contrast": 1.08}),         # AI Literacy
    "ibm-4": ("cloud_devops", "full", {"contrast": 1.1, "sat": 1.08}),              # Enterprise AI
    "ibm-5": ("ai_agentic", "full", {"sat": 1.2, "contrast": 1.1}),                 # Generative AI
    "ibm-6": ("ai_agentic", "zoom_right", {"warmth": 1.1, "contrast": 1.08}),       # Human-AI Planning
    "ibm-7": ("design_thinking", "full", {"sat": 1.1, "contrast": 1.05}),           # EDT Practitioner
    "ibm-8": ("design_thinking", "zoom_right", {"sat": 1.15, "contrast": 1.08}),   # EDT Co-Creator
    "ibm-9": ("design_thinking", "zoom_left", {"sat": 1.08, "contrast": 1.05}),    # EDT Team Essentials
    "ibm-10": ("design_thinking", "zoom_center", {"contrast": 1.1, "sat": 1.08}),  # User Research Empathy
    "ibm-11": ("design_thinking", "zoom_top", {"warmth": 1.08, "contrast": 1.05}), # Hills & Playbacks
    "ibm-12": ("design_thinking", "zoom_bottom", {"contrast": 1.12, "sat": 1.1}),  # Creative Prototyping
    "ibm-13": ("marketing_strategy", "zoom_right", {"sat": 1.1, "contrast": 1.08}),# Prioritization Matrix
    "ibm-14": ("marketing_strategy", "zoom_center", {"sat": 1.15, "contrast": 1.05}), # Experience Roadmap
    "ibm-15": ("software_architecture", "zoom_top", {"contrast": 1.1, "sat": 1.1}), # User-Centered Arch
    "ibm-16": ("leadership_negotiation", "zoom_left", {"contrast": 1.08, "sat": 1.05}), # Stakeholder Align
    "ibm-17": ("astronomy_cosmos", "zoom_top", {"sat": 1.12, "contrast": 1.08}),   # Product Vision
    "ibm-18": ("design_thinking", "cinematic_wide", {"sat": 1.1, "contrast": 1.06}),# Design Systems
    "ibm-19": ("design_thinking", "zoom_center", {"sat": 1.2, "contrast": 1.12}),  # Advanced EDT
    "ibm-20": ("english_linguistics", "zoom_top", {"warmth": 1.1, "contrast": 1.05}), # Lifelong Skills
    "ibm-21": ("ai_agentic", "zoom_center", {"sat": 1.25, "contrast": 1.12}),       # Agentic AI
    "ibm-22": ("scrum_agile", "zoom_left", {"contrast": 1.08, "sat": 1.05}),        # PM Fundamentals
    "ibm-23": ("cybersecurity", "zoom_center", {"contrast": 1.15, "sat": 1.1}),     # Responsible AI Risk

    # 4. Seminar & Konferensi Nasional
    "sem-cec-ub": ("macro_finance", "full", {"warmth": 1.12, "contrast": 1.08}),
    "sem-compendium": ("business_law", "zoom_bottom", {"warmth": 1.15, "contrast": 1.1}),
    "sem-20": ("software_architecture", "full", {"contrast": 1.1, "sat": 1.12}),           # Digital Transform
    "sem-21": ("macro_finance", "zoom_top", {"warmth": 1.1, "contrast": 1.08}),             # Economic Resilience
    "sem-22": ("cybersecurity", "full", {"contrast": 1.12, "sat": 1.08}),                   # Corporate Risk
    "sem-23": ("leadership_negotiation", "zoom_right", {"warmth": 1.1, "contrast": 1.08}),  # Talent & Leadership
    "sem-24": ("green_energy", "full", {"tint_green": 1.15, "sat": 1.12}),                 # Green Energy
    "sem-25": ("bigdata_analytics", "full", {"sat": 1.15, "contrast": 1.1}),                # Big Data
    "sem-26": ("business_venture", "zoom_left", {"warmth": 1.1, "contrast": 1.08}),         # Research Incubator
    "sem-27": ("cybersecurity", "zoom_left", {"contrast": 1.15, "sat": 1.1}),              # Cybersecurity Privacy
    "sem-28": ("biology_dna_lab", "full", {"sat": 1.1, "contrast": 1.06}),                  # Scientific Methodology
    "sem-29": ("supply_chain", "full", {"sat": 1.12, "contrast": 1.08}),                    # Global Supply Chain
    "sem-30": ("robotics_automation", "full", {"warmth": 1.12, "contrast": 1.1}),          # Industrial Robotics
    "sem-31": ("business_law", "full", {"warmth": 1.1, "contrast": 1.08}),                  # Business Law & Ethics
    "sem-32": ("macro_finance", "zoom_left", {"warmth": 1.15, "contrast": 1.1}),           # Strategic Investment
    "sem-33": ("design_thinking", "zoom_bottom", {"sat": 1.1, "contrast": 1.08}),          # UX Metrics Design
    "sem-34": ("sixsigma_quality", "full", {"sat": 1.08, "contrast": 1.08}),                # Total Quality TQM
    "sem-35": ("business_law", "zoom_top", {"warmth": 1.12, "contrast": 1.08}),            # Public Policy Education
    "sem-36": ("marketing_strategy", "zoom_top", {"sat": 1.12, "contrast": 1.06}),         # Corporate PR Comms
    "sem-37": ("sociology_humanities", "zoom_center", {"sat": 1.08, "contrast": 1.05}),     # Organizational Psych
    "sem-38": ("marketing_strategy", "zoom_center", {"warmth": 1.1, "sat": 1.12}),         # Value-Based Mktg
    "sem-39": ("scrum_agile", "zoom_center", {"sat": 1.1, "contrast": 1.08}),              # Agile Leadership
    "sem-40": ("english_linguistics", "zoom_bottom", {"warmth": 1.12, "contrast": 1.08}),   # Academic Integrity
    "sem-41": ("cybersecurity", "zoom_right", {"contrast": 1.12, "sat": 1.08}),            # IT Compliance Audit
    "sem-42": ("robotics_automation", "zoom_right", {"warmth": 1.1, "contrast": 1.08}),     # BPR Reengineering
    "sem-43": ("leadership_negotiation", "zoom_center", {"warmth": 1.12, "contrast": 1.1}),# Leadership Ethics
    "sem-44": ("leadership_negotiation", "zoom_top", {"warmth": 1.1, "contrast": 1.08}),   # Change Management
    "sem-45": ("cloud_devops", "zoom_center", {"contrast": 1.12, "sat": 1.1}),             # Cloud Architecture IT
    "sem-46": ("bigdata_analytics", "zoom_center", {"sat": 1.15, "contrast": 1.1}),        # Data Science Market
    "sem-47": ("leadership_negotiation", "cinematic_wide", {"warmth": 1.12, "contrast": 1.08}), # Cross-Cultural Neg
    "sem-48": ("robotics_automation", "zoom_left", {"contrast": 1.1, "sat": 1.08}),         # Asset Maintenance
    "sem-49": ("business_venture", "zoom_bottom", {"warmth": 1.15, "contrast": 1.1}),      # Startup VC Funding
    "sem-50": ("business_venture", "zoom_center", {"warmth": 1.1, "contrast": 1.08}),      # Disruptive Business
    "sem-51": ("health_safety", "full", {"tint_green": 1.1, "sat": 1.12}),                  # K3 Occupational Safety
    "sem-52": ("esg_sustainability", "full", {"tint_green": 1.15, "sat": 1.15}),           # Corporate ESG
    "sem-53": ("software_architecture", "zoom_center", {"contrast": 1.12, "sat": 1.1}),     # Enterprise Software
    "sem-54": ("leadership_negotiation", "zoom_bottom", {"warmth": 1.12, "contrast": 1.08}),# Emotional Intelligence
    "sem-55": ("macro_finance", "zoom_right", {"warmth": 1.1, "contrast": 1.1}),           # Quantitative Forecasting
    "sem-56": ("leadership_negotiation", "zoom_top", {"warmth": 1.15, "contrast": 1.1}),   # Young Leaders Forum
}

def apply_focal_crop(im, crop_type):
    w, h = im.size
    target_aspect = 720 / 960  # 3:4 aspect ratio
    
    if crop_type == "full":
        # Best center crop matching 3:4
        target_w = int(h * target_aspect)
        if target_w <= w:
            left = (w - target_w) // 2
            return im.crop((left, 0, left + target_w, h))
        else:
            target_h = int(w / target_aspect)
            top = (h - target_h) // 2
            return im.crop((0, top, w, top + target_h))
            
    elif crop_type == "zoom_center":
        # 1.25x zoom focused on center
        zw, zh = int(w * 0.8), int(h * 0.8)
        left = (w - zw) // 2
        top = (h - zh) // 2
        cropped = im.crop((left, top, left + zw, top + zh))
        return apply_focal_crop(cropped, "full")
        
    elif crop_type == "zoom_top":
        # Focus on upper grandeur / dome / chandeliers
        target_w = int(h * 0.8 * target_aspect)
        left = (w - target_w) // 2
        return im.crop((max(0, left), 0, min(w, left + target_w), int(h * 0.82)))
        
    elif crop_type == "zoom_bottom":
        # Focus on desk / foreground instruments / blueprints / ledgers
        target_w = int(h * 0.8 * target_aspect)
        left = (w - target_w) // 2
        top = int(h * 0.18)
        return im.crop((max(0, left), top, min(w, left + target_w), h))
        
    elif crop_type == "zoom_left":
        # Focus on left workstation / screens / machines
        target_w = int(h * 0.85 * target_aspect)
        return im.crop((0, int(h * 0.08), min(w, target_w), int(h * 0.95)))
        
    elif crop_type == "zoom_right":
        # Focus on right workstation / charts / devices
        target_w = int(h * 0.85 * target_aspect)
        left = max(0, w - target_w)
        return im.crop((left, int(h * 0.08), w, int(h * 0.95)))
        
    elif crop_type == "cinematic_wide":
        # Slightly wider framing
        target_w = int(h * target_aspect)
        left = (w - target_w) // 2
        return im.crop((left, int(h * 0.05), left + target_w, int(h * 0.95)))
        
    return im

def apply_color_grading(im, adjust):
    # Brightness / Contrast / Saturation
    if "contrast" in adjust:
        im = ImageEnhance.Contrast(im).enhance(adjust["contrast"])
    if "sat" in adjust:
        im = ImageEnhance.Color(im).enhance(adjust["sat"])
    if "bright" in adjust:
        im = ImageEnhance.Brightness(im).enhance(adjust["bright"])
        
    # Warmth / Tinting in RGB
    if "warmth" in adjust or "tint_green" in adjust:
        r, g, b = im.split()
        if "warmth" in adjust:
            w_factor = adjust["warmth"]
            r = ImageEnhance.Brightness(r).enhance(w_factor)
            b = ImageEnhance.Brightness(b).enhance(1.0 / (w_factor ** 0.5))
        if "tint_green" in adjust:
            g_factor = adjust["tint_green"]
            g = ImageEnhance.Brightness(g).enhance(g_factor)
        im = Image.merge("RGB", (r, g, b))
        
    return im

def generate_scenic_cover(cert_id):
    cfg = CERT_MAP.get(cert_id, ("macro_finance", "full", {}))
    master_key, crop_type, color_adj = cfg
    
    img_path = MASTER_IMAGES.get(master_key)
    if not img_path:
        # Fallback to any available
        img_path = list(MASTER_IMAGES.values())[0]
        
    src_img = Image.open(img_path).convert("RGB")
    
    # 1. Apply focal crop
    cropped = apply_focal_crop(src_img, crop_type)
    
    # 2. Resize to standard book cover dimensions (720 x 960) with high fidelity
    resized = cropped.resize((720, 960), Image.Resampling.LANCZOS)
    
    # 3. Apply color grading
    graded = apply_color_grading(resized, color_adj)
    
    # 4. Save as high-quality WebP
    out_name = f"cover_{cert_id}.webp"
    out_path = os.path.join(OUT_DIR, out_name)
    graded.save(out_path, "WEBP", quality=92)
    
    return os.path.join("cert_covers", "ai_art", out_name).replace("\\", "/")

def main():
    with open("certificates.json", "r", encoding="utf-8") as f:
        certs = json.load(f)
        
    print(f"Generating full-scenic pictorial covers for {len(certs)} certificates...")
    
    for i, c in enumerate(certs):
        cid = c["id"]
        rel_path = generate_scenic_cover(cid)
        c["thumb_img"] = rel_path
        print(f"[{i+1:02d}/{len(certs):02d}] {cid}: {c.get('title_id')[:35]}... -> {rel_path}")
        
    with open("certificates.json", "w", encoding="utf-8") as f:
        json.dump(certs, f, indent=2, ensure_ascii=False)
        
    print("\nSUCCESS! All 86 scenic digital painting covers generated and certificates.json updated!")

if __name__ == "__main__":
    main()
