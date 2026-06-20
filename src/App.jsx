import { useState, useEffect, useRef } from "react";

// ─── Payment links ─────────────────────────────────────────────────────────
const SQUARE = {
  diabetic:     "https://square.link/u/U6wfdobI?src=sheet",
  anatomy:      "https://square.link/u/wTgJct9t?src=sheet",
  nails:        "https://square.link/u/lH86y6Qp?src=sheet",
  wounds:       "https://square.link/u/fE8CgoMk?src=sheet",
  biomechanics: "https://square.link/u/sB2b6ol0?src=sheet",
  paediatric:   "https://square.link/u/nj1eCog7?src=sheet",
  sports:       "https://square.link/u/CGIxxIas?src=sheet",
  dressings:    "https://square.link/u/sRAvkdPg?src=sheet",
  full:         "https://square.link/u/HtNGWVxX?src=sheet",
};

// Access codes — edit these to whatever codes you want to issue per course after a Square payment.
const ACCESS_CODES = {
  diabetic:     "1001",
  anatomy:      "1002",
  nails:        "1003",
  wounds:       "1004",
  biomechanics: "1005",
  paediatric:   "1006",
  sports:       "1007",
  dressings:    "1008",
};
const BUNDLE_CODE = "9999";

// ─── Course data ───────────────────────────────────────────────────────────
const COURSES = [
  {
    id: "diabetic", title: "The Diabetic Foot", icon: "🩺", color: "#1A5276",
    cpd: 4, level: "Intermediate",
    blurb: "IWGDF 2023 risk classification, systematic assessment, offloading evidence and MDT management of the high-risk diabetic foot.",
    slides: [
      {
        id: "d1", heading: "The Scale of Diabetic Foot Disease",
        body: "Diabetes mellitus is one of the defining public health challenges of the 21st century. In the UK, over 4.9 million people are living with diabetes (Diabetes UK, 2023), with a further 13.6 million at high risk. The podiatrist sits at the centre of preventing the most devastating and costly complication of this disease.\n\n**The Clinical Imperative**\n\nThe lifetime risk of developing a diabetic foot ulcer (DFU) is 19-34%. Every 20 seconds globally, a lower limb is lost as a consequence of diabetes. In England alone, more than 135 lower limb amputations occur each week attributable to diabetes. The economic burden exceeds one billion pounds per year in the UK alone.",
        quiz: null
      },
      {
        id: "d2", heading: "Peripheral Neuropathy: Four Biochemical Pathways",
        body: "Diabetic peripheral neuropathy (DPN) affects approximately 50% of patients after 25 years of disease. Its development is insidious, often asymptomatic in early stages. Understanding the biochemical mechanisms explains why DPN develops and why glycaemic control remains the only disease-modifying intervention available.\n\n**The Polyol Pathway**\n\nWhen intracellular glucose overwhelms glycolytic capacity, aldose reductase converts excess glucose to sorbitol, consuming NADPH. Depleted NADPH reduces nitric oxide synthesis causing endoneurial vasoconstriction and nerve ischaemia, impairs glutathione regeneration allowing oxidative damage to accumulate, and allows sorbitol accumulation causing osmotic injury to Schwann cells and neurons.",
        quiz: null
      },
      {
        id: "d3", heading: "DPN: Length-Dependent Loss and Clinical Consequences",
        body: "The four biochemical pathways to nerve damage converge to produce axonal loss in a characteristic length-dependent, distal-to-proximal pattern. The longest axons supplying the feet are lost first because they have the greatest metabolic demands and the longest distance over which axonal transport must function.\n\n**Fibre Type Sequence: Small Before Large**\n\nSmall, lightly myelinated C fibres carrying pain and temperature are lost before large, heavily myelinated A-beta fibres carrying vibration and pressure. The clinical consequence is that a patient loses pain sensation before losing the ability to feel a monofilament. They may have significant neuropathic risk while still perceiving light touch, leading both patient and clinician to underestimate the degree of neurological impairment.",
        quiz: null
      },
      {
        id: "d4", heading: "Peripheral Arterial Disease: Three Critical Differences",
        body: "PAD is 2-4 times more prevalent in diabetes and develops approximately a decade earlier. Three features fundamentally distinguish diabetic PAD from non-diabetic PAD, with direct implications for clinical assessment.\n\n**Distal Vessel Distribution**\n\nNon-diabetic PAD preferentially affects large proximal vessels: the aortoiliac and femoro-popliteal segments. Diabetic PAD preferentially affects smaller, more distal vessels: the tibial and peroneal arteries below the knee. The femoral and popliteal arteries are often relatively preserved. This means claudication symptoms may be atypical or absent even with significant ischaemia, and revascularisation is technically more challenging with smaller, more calcified target vessels.",
        quiz: {
          q: "Why is ABPI unreliable in many patients with diabetes, and what assessment is preferred?",
          options: ["Diabetes raises cardiac output inflating all pressure readings", "Medial arterial calcinosis makes vessel walls non-compressible giving falsely elevated ABPI - TBPI is preferred", "The brachial artery is frequently occluded by diabetic PAD", "Autonomic neuropathy distorts vasomotor responses"],
          answer: 1,
          explain: "Medial arterial calcinosis deposits calcium in the arterial wall media making it rigid and non-compressible. The cuff cannot occlude flow, producing falsely elevated ABPI often above 1.3 even in critical ischaemia. TBPI using photoplethysmography is preferred as digital arteries are spared. TBPI below 0.7 indicates significant ischaemia; below 0.3 indicates critical limb ischaemia."
        }
      },
      {
        id: "d5", heading: "Infection: Susceptibility, Osteomyelitis, and MRSA",
        body: "Hyperglycaemia impairs multiple components of innate immunity: neutrophil chemotaxis is reduced, phagocytic capacity is diminished, complement activation is attenuated, and T-cell-mediated immunity is suppressed. These deficits create a permissive environment for bacterial proliferation that the normal immune response would prevent.\n\n**Osteomyelitis: Frequency and Diagnosis**\n\nOsteomyelitis complicates approximately 20% of moderate and 50-60% of severe diabetic foot infections, arising by contiguous spread from the ulcer base through soft tissue planes to adjacent bone. It dramatically worsens prognosis and frequently necessitates surgical debridement or partial foot amputation if not identified early.",
        quiz: null
      },
      {
        id: "d6", heading: "IWGDF 2023 Risk Classification",
        body: "The IWGDF 2023 risk classification guides review frequency and preventive care intensity. Applying it consistently is a core professional competency for podiatrists working with patients with diabetes.\n\nRisk Category 0: No neuropathy, no PAD, no prior ulceration. Annual structured foot assessment and patient education covering daily self-inspection, footwear selection, nail care, and danger signs.\n\nRisk Category 1: Peripheral neuropathy present without PAD, deformity, or prior ulceration. 6-monthly specialist podiatry review. The patient must understand that visual daily self-inspection must now replace pain as the primary early warning system.",
        quiz: {
          q: "IWGDF 2023: neuropathy AND peripheral arterial disease requires review every:",
          options: ["12 months", "6 months", "3 months", "1 month"],
          answer: 2,
          explain: "IWGDF Risk Category 2 (neuropathy plus PAD and/or significant foot deformity) requires 3-monthly specialist podiatry review to detect deterioration and prevent ulceration."
        }
      },
      {
        id: "d7", heading: "The 10g Monofilament: Protocol and Clinical Significance",
        body: "The 10g Semmes-Weinstein monofilament is the international standard tool for detecting loss of protective sensation. The filament is calibrated to buckle at exactly 10g of pressure when applied perpendicular to the skin surface. This threshold represents the minimum pressure detection required for protective sensation.\n\n**Protocol: Nine Standardised Sites**\n\nApply the monofilament perpendicular to the skin at 9 standardised plantar sites until the filament buckles. Hold for 1-1.5 seconds. The patient, with eyes closed, indicates when they feel the sensation. Test each site randomly, applying the filament 3 times per site and recording the number of detections. Loss at 4 or more of the 9 sites indicates clinically significant DPN: sensitivity 77%, specificity 95% (Booth and Young, 2000).",
        quiz: null
      },
      {
        id: "d8", heading: "Vascular Assessment: Doppler and Pressure Indices",
        body: "Systematic vascular assessment is mandatory at every diabetic foot clinical encounter. Palpation alone is insufficient; Doppler assessment is required whenever either pedal pulse is absent or equivocal.\n\n**Pedal Pulse Palpation**\n\nPalpate the posterior tibial artery posterior and inferior to the medial malleolus, and the dorsalis pedis artery in the first intermetatarsal space. Document as absent, diminished, or present. Absence of either pulse mandates hand-held Doppler assessment before the patient leaves the appointment.",
        quiz: null
      },
      {
        id: "d9", heading: "The Probe-to-Bone Test and Wound Documentation",
        body: "The probe-to-bone test is the most accessible and valuable bedside diagnostic tool for osteomyelitis in the diabetic foot. A sterile metal probe gently inserted through the wound base and advanced until it contacts bone with a characteristic gritty sensation constitutes a positive test — positive predictive value 89% in a high-prevalence DFI population (Grayson et al., 1995, JAMA). A positive result in the right clinical context should be treated as confirmed osteomyelitis pending imaging and microbiology. A negative result does not exclude osteomyelitis but substantially reduces the pre-test probability. This free bedside test requires no equipment beyond a sterile probe and should be performed and clearly documented at every diabetic foot ulcer assessment where osteomyelitis cannot be clinically excluded.",
        quiz: {
          q: "The probe-to-bone test has a PPV for osteomyelitis of approximately:",
          options: ["45%", "65%", "75%", "89%"],
          answer: 3,
          explain: "Grayson et al. (1995, JAMA) established 89% PPV in a high-prevalence DFI population. This free bedside test should be performed and documented at every DFU assessment. A positive result in the right clinical context should be treated as confirmed osteomyelitis pending imaging and microbiology."
        }
      },
      {
        id: "d10", heading: "SINBAD Score and Wound Classification Systems",
        body: "Standardised wound classification enables reproducible clinical documentation, facilitates communication between clinicians, and allows meaningful audit and outcome comparison across clinical settings.\n\n**The SINBAD Score**\n\nSINBAD (Site, Ischaemia, Neuropathy, Bacterial infection, Area, Depth) provides a validated tool for district-level audit. Each of six domains scores 0 or 1 giving a total of 0-6. SINBAD above 3 is associated with significantly higher non-healing rates and major amputation at 12 months (Ince et al., 2008, Diabetes Care). Its simplicity makes it applicable in any clinical setting without specialist equipment.",
        quiz: null
      },
      {
        id: "d11", heading: "Offloading: Hierarchy of Evidence and Device Selection",
        body: "Offloading is the primary treatment for neuropathic plantar DFUs. No wound dressing, no topical agent, and no systemic therapy will consistently heal a neuropathic plantar ulcer if mechanical forces causing and perpetuating the wound are not adequately addressed.\n\n**The Adherence Problem**\n\nArmstrong et al. (2003) quantified the critical issue: patients prescribed removable cast walkers wore their devices for only approximately 28% of waking hours. Patients were not careless; they were non-compliant because the device was removable and their foot was painless. This single finding underpins the entire rationale for the irremovable Total Contact Cast.",
        quiz: null
      },
      {
        id: "d12", heading: "The Total Contact Cast: Application and Contraindications",
        body: "The Total Contact Cast is a closely moulded non-removable cast encompassing the foot and lower leg. It distributes plantar pressure across the entire plantar surface, controls dorsiflexion moments, reduces walking speed, and is completely irremovable without clinical tools, enforcing near-100% offloading adherence.\n\n**Why the TCC Outperforms Removable Devices**\n\nArmstrong et al. (2003) demonstrated only 28% adherence with removable cast walkers. The TCC is better not merely because of superior pressure distribution but primarily because the patient cannot take it off. Every period of unprotected ambulation in a patient with a neuropathic plantar ulcer delivers damaging mechanical loading to the wound bed, resetting the healing trajectory.",
        quiz: {
          q: "Armstrong et al. (2003) demonstrated that patients wear removable cast walkers for approximately what proportion of waking hours?",
          options: ["90%", "70%", "50%", "28%"],
          answer: 3,
          explain: "Armstrong et al. (2003, Diabetes Care) used activity monitoring to demonstrate only approximately 28% adherence with removable cast walkers. This is the key evidence underpinning the Total Contact Cast and instant TCC as preferred offloading devices - they are irremovable, enforcing near-100% adherence."
        }
      },
      {
        id: "d13", heading: "Wound Bed Preparation: TIME in the Diabetic Foot",
        body: "TIME (Tissue, Infection, Moisture, Edge), articulated by Schultz et al. in 2003, is the most widely adopted wound bed preparation framework in clinical practice, applied within the broader context of offloading as the primary treatment.\n\n**T: Tissue and Sharp Debridement**\n\nSharp debridement is the most impactful single wound care intervention available to the podiatrist. It removes the physical barrier of necrotic tissue, eliminates the substrate sustaining bacterial biofilm, removes senescent cells unresponsive to growth factors, and generates acute wound signals that restart the stalled healing cascade. In neuropathic DFUs, callus debridement alone reduces peak plantar pressure by up to 30%. Debridement should be performed at every clinical encounter unless specifically contraindicated.",
        quiz: null
      },
      {
        id: "d14", heading: "Antibiotic Prescribing in Diabetic Foot Infection",
        body: "Antibiotic prescribing in diabetic foot infection requires careful alignment with IWGDF and IDSA guidelines, local microbiological antibiogram data, and the clinical severity of infection. Empirical prescribing without microbiological culture data should be avoided wherever clinically safe.\n\n**IWGDF Severity Classification**\n\nMild DFI: localised skin and subcutaneous tissue involvement only, erythema less than 2cm from wound edge, no systemic features. Moderate DFI: deeper tissue involvement (fascia, muscle, tendon, joint, or bone) or erythema greater than 2cm, but no systemic inflammatory response. Severe DFI: any DFI with systemic inflammatory response syndrome (two or more of: temperature above 38 or below 36 degrees, heart rate above 90, respiratory rate above 20, white cell count above 12 or below 4 x10-9/L).",
        quiz: null
      },
      {
        id: "d15", heading: "Charcot Neuroarthropathy: Recognition and Emergency Management",
        body: "Charcot neuroarthropathy is the most important acute diagnosis in diabetic foot medicine and one of the most commonly missed. The consequences of delayed diagnosis are irreversible: progressive bony destruction, subluxation, and permanent deformity creating lifelong ulceration risk.\n\n**Pathophysiology**\n\nThe neurotraumatic theory proposes that loss of protective pain sensation allows minor repetitive trauma to accumulate unperceived, causing progressive microfractures and gross bone destruction. The neurovascular theory proposes that autonomic neuropathy causes arteriovenous shunting, increasing bone blood flow, activating osteoclastic resorption via the RANKL pathway, and weakening bony architecture. Both mechanisms likely contribute in clinical practice.",
        quiz: {
          q: "The most sensitive bedside sign for acute Charcot neuroarthropathy is:",
          options: ["Severe rest pain", "Unilateral foot swelling", "Skin temperature above 2 degrees Celsius versus contralateral foot", "Raised CRP and white cell count"],
          answer: 2,
          explain: "Skin temperature more than 2 degrees Celsius above the contralateral foot on infrared thermometry is the most sensitive bedside sign. Pain is often absent due to established DPN, the classic diagnostic trap leading to misdiagnosis as cellulitis or DVT. Suspected Charcot is a clinical emergency requiring immediate non-weight-bearing immobilisation."
        }
      },
      {
        id: "d16", heading: "MDT Care, Surgical Options, and NICE NG19",
        body: "The specialist diabetic foot MDT represents the gold standard of care for patients with active diabetic foot disease. Coordinated MDT care reduces major amputation rates, hospital length of stay, and mortality compared with non-MDT or sequential specialist input.\n\n**Core MDT Composition**\n\nA well-functioning diabetic foot MDT includes: diabetes physician for medical management and glycaemic optimisation; vascular surgeon for PAD assessment and intervention; orthopaedic or podiatric surgeon for surgical debridement, reconstruction, and amputation; specialist podiatrist as wound care specialist and often MDT coordinator; diabetes specialist nurse for education and care coordination; orthotist for specialist footwear; dietitian for nutritional optimisation; and microbiologist for antibiotic stewardship input.",
        quiz: null
      },
      {
        id: "d17", heading: "Footwear Assessment and Therapeutic Footwear",
        body: "Appropriate footwear is fundamental to diabetic foot prevention and management. Assessment and prescription should be part of every review for patients at IWGDF Risk Category 2 and above. Footwear education should be provided at every encounter regardless of risk category.\n\n**High-Risk Footwear Characteristics**\n\nTight toe box causing forefoot compression. Inadequate depth causing rubbing over the toe dorsum. Heel height above 2cm increasing forefoot loading. Stiff, inflexible sole that does not accommodate foot deformity. Poor fastening mechanism allowing foot movement within the shoe. Absence of cushioning, particularly important over bony prominences in a neuropathic foot where pressure injury may not be perceived.",
        quiz: null
      },
      {
        id: "d18", heading: "Patient Education and Self-Management",
        body: "Patient education is one of the most cost-effective interventions in diabetic foot care. Structured foot care education reduces ulceration rates, hospital admission rates, and lower limb amputation rates compared with standard care (Dorresteijn et al., 2014, Cochrane).\n\nEvery patient with diabetes should receive education covering: daily foot inspection including between the toes; danger signs requiring immediate review (any skin break, blister, swelling, redness, or temperature change); correct nail trimming (straight across, not shorter than the toe tip); appropriate moisturisation; and avoidance of hazardous self-care such as corn plasters or walking barefoot.",
        quiz: null
      },
      {
        id: "d19", heading: "Prevention and Population-Level Approaches",
        body: "Diabetic foot disease is largely preventable. The greatest potential for reducing the burden of lower limb amputation lies in population-level prevention strategies, systematic screening programmes, and early intervention when risk factors are identified.\n\n**The Prevention Pyramid**\n\nPrimary prevention targets the entire diabetic population: optimising glycaemic control to slow DPN progression, patient education, annual structured foot screening, and appropriate footwear across all risk categories. Secondary prevention targets the high-risk patient: regular specialist podiatry review, aggressive management of modifiable risk factors, callus management, nail care, and prevention of first ulceration. Tertiary prevention targets the patient with active or healed DFU: intensive MDT care, aggressive wound management, offloading, vascular intervention, and prevention of recurrence.",
        quiz: null
      },
      {
        id: "d20", heading: "Emerging Technologies and Future Directions",
        body: "The management of diabetic foot disease is evolving rapidly, with new diagnostic technologies, therapeutic agents, and care models demonstrating potential to further reduce the devastating burden of this condition.\n\n**Smart Insole Technology and Remote Monitoring**\n\nPressure-sensing insole systems providing real-time feedback on plantar loading are commercially available and under clinical evaluation. Early studies suggest that patients receiving visual or vibrotactile feedback when plantar pressure exceeds a set threshold may develop protective offloading behaviours. Infrared thermometry for daily home monitoring of bilateral foot skin temperature has been evaluated as a method for early detection of pre-ulcerative inflammation, with small RCTs demonstrating significant reductions in DFU incidence in high-risk patients.",
        quiz: null
      }
    ],
    exam: [
      { q: "IWGDF 2023: neuropathy AND peripheral arterial disease requires review every:", opts: ["12 months","6 months","3 months","1 month"], a: 2, exp: "IWGDF Risk Category 2 requires 3-monthly specialist podiatry review to detect deterioration and prevent ulceration." },
      { q: "The probe-to-bone test has a positive predictive value for osteomyelitis of:", opts: ["45%","65%","75%","89%"], a: 3, exp: "Grayson et al. (1995, JAMA) established 89% PPV — the most valuable free bedside test for osteomyelitis in podiatric practice." },
      { q: "Armstrong et al. (2003) demonstrated removable cast walker adherence of approximately:", opts: ["90% of waking hours","70% of waking hours","50% of waking hours","28% of waking hours"], a: 3, exp: "Only approximately 28% adherence was demonstrated — the key evidence underpinning the irremovable TCC as the preferred offloading device." },
      { q: "NICE NG19 mandates MDT referral for active diabetic foot disease within:", opts: ["1 week","72 hours","48 hours","24 hours"], a: 3, exp: "NICE NG19 mandates referral to the specialist diabetic foot MDT within 24 hours of active diabetic foot disease." },
      { q: "The most sensitive bedside sign for acute Charcot neuroarthropathy is:", opts: ["Severe rest pain","Unilateral foot swelling","Skin temp above 2 degrees C vs contralateral foot","Raised CRP"], a: 2, exp: "Infrared thermometry showing more than 2 degrees Celsius above the contralateral foot is the most sensitive sign. Pain is often absent due to DPN." },
      { q: "More than what proportion of diabetes-related lower limb amputations are preceded by a treatable foot ulcer?", opts: ["50%","60%","70%","80%"], a: 3, exp: "More than 80% of diabetes-related lower limb amputations are preceded by a foot ulcer that with appropriate podiatric intervention could have healed." },
      { q: "The SINBAD score is used clinically for:", opts: ["Assessing DPN severity","Standardised DFU audit and outcome benchmarking","Classifying Charcot stage","Grading PAD severity"], a: 1, exp: "SINBAD (Site, Ischaemia, Neuropathy, Bacterial infection, Area, Depth) provides a validated 0-6 score for district-level DFU audit. SINBAD above 3 predicts significantly higher non-healing rates and major amputation at 12 months (Ince et al., 2008, Diabetes Care)." },
      { q: "TcPO2 below what threshold predicts near-certain wound healing failure without revascularisation?", opts: ["40mmHg","30mmHg","20mmHg","10mmHg"], a: 2, exp: "TcPO2 below 30mmHg predicts impaired healing; below 20mmHg indicates near-certain failure without revascularisation. This objective measure guides management in ischaemic wounds." },
      { q: "Cadexomer iodine has the strongest RCT evidence for:", opts: ["Pain relief","Biofilm disruption and improved wound healing","Moisture donation to dry wound beds","Promoting epithelialisation in VLUs"], a: 1, exp: "Cadexomer iodine provides controlled-release iodine from a cadexomer bead matrix with multiple RCTs demonstrating biofilm disruption and improved healing outcomes — the topical agent with the strongest evidence base for biofilm management in chronic wounds." },
      { q: "The polyol pathway contributes to DPN primarily by depleting NADPH, which impairs:", opts: ["Vitamin B12 absorption","Nitric oxide synthesis and glutathione regeneration causing nerve ischaemia and oxidative damage","Insulin receptor signalling in Schwann cells","Myelin basic protein synthesis"], a: 1, exp: "NADPH depletion reduces nitric oxide synthesis (causing endoneurial vasoconstriction and nerve ischaemia) and impairs glutathione regeneration (allowing oxidative damage) — both directly contributing to diabetic peripheral neuropathy pathogenesis." }
    ]
  },
  {
    id: "anatomy", title: "Foot and Ankle Anatomy", icon: "🦴", color: "#1B4F72",
    cpd: 3, level: "Foundation",
    blurb: "The 26-bone architecture, key joint mechanics, windlass mechanism, neurovascular supply and clinical correlations for everyday podiatric practice.",
    slides: [
      {
        id: "a1", heading: "The Osseous Architecture: 26 Bones and Three Regions",
        body: "The human foot contains 26 bones divided into three functional regions. The rearfoot (calcaneus and talus) handles ground contact and shock absorption. The midfoot (navicular, cuboid, three cuneiforms) is the structural keystone. The forefoot (five metatarsals, fourteen phalanges) is the propulsive engine of gait.\n\nThe calcaneus is the largest tarsal bone. Its posterior tuberosity is the site of Achilles tendon insertion superiorly and plantar fascia origin inferiorly — explaining frequent co-presentation of Achilles tendinopathy and plantar fasciopathy. Bohler angle (normal 20-40 degrees) and Gissane angle (normal 120-145 degrees) assess calcaneal fracture severity following axial loading injuries.",
        quiz: null
      },
      {
        id: "a2", heading: "The Calcaneus: Anatomy, Angles, and Pathology",
        body: "The calcaneus is the largest tarsal bone and carries the primary load of body weight during standing and gait. Its complex three-dimensional shape and multiple articular surfaces make it both mechanically important and clinically significant in a range of pathologies.\n\n**Articular Surfaces and Clinical Correlations**\n\nThe calcaneus articulates with the talus superiorly via three facets: the anterior, middle, and posterior. The posterior facet is the largest and carries most of the talocalcaneal load. The middle facet, borne on the sustentaculum tali, is a common site of subtalar arthritis in patients with chronic flatfoot deformity and tibialis posterior tendon dysfunction. The anterior facet articulates with the cuboid at the calcaneocuboid joint, a key component of the midtarsal joint complex.",
        quiz: null
      },
      {
        id: "a3", heading: "The Talus: No Muscular Attachments and Clinical Consequences",
        body: "The talus is unique among all 206 bones in the human skeleton: it has no muscular attachments whatsoever. Every force transmitted to the talus passes exclusively through its seven articular surfaces and ligamentous connections, making it entirely dependent on soft tissues for its blood supply.\n\nThree main vascular routes supply the talar body: the artery of the tarsal canal, the artery of the sinus tarsi, and a deltoid branch from the posterior tibial artery. Displaced talar neck fractures interrupt these connections, causing avascular necrosis in 20-50% of displaced fractures. The Hawkins sign — a subchondral radiolucent band on AP radiograph at 6-8 weeks post-fracture — confirms preserved vascularity.",
        quiz: null
      },
      {
        id: "a4", heading: "The Midfoot: Navicular, Cuneiforms, and the Lisfranc Complex",
        body: "The midfoot transmits force between the flexible rearfoot and the rigid forefoot while forming the keystone of both the medial longitudinal and transverse arches. The navicular medial tuberosity is the primary insertion of tibialis posterior, the key dynamic stabiliser of the medial longitudinal arch. An accessory navicular is present in 10-14% of the population.\n\nThe intermediate cuneiform is shorter than the medial and lateral cuneiforms, creating a mortise recess at the second metatarsal base. This keystone configuration locks the second metatarsal under compressive load, providing transverse arch stability.",
        quiz: {
          q: "The intermediate cuneiform is shorter than the medial and lateral cuneiforms. What is the clinical significance of this?",
          options: ["It has no functional significance", "It creates a mortise recess at the second metatarsal base, providing transverse arch stability", "It predisposes to navicular stress fractures", "It is the primary site of tibialis posterior insertion"],
          answer: 1,
          explain: "The shorter intermediate cuneiform creates a mortise recess at the second metatarsal base, forming a keystone configuration that locks the second metatarsal under compressive load and provides transverse arch stability — explaining the second metatarsal's vulnerability to stress fractures in runners."
        }
      },
      {
        id: "a5", heading: "The Forefoot: Metatarsals, Sesamoids, and Toe Deformities",
        body: "The forefoot is the propulsive engine of gait and the site of many of the most common podiatric pathologies. Understanding metatarsal anatomy, the sesamoid complex, and the three major toe deformity patterns underpins accurate diagnosis and treatment planning.\n\n**Metatarsal Load Distribution and Stress Fractures**\n\nAt rest, weight is distributed across the metatarsal heads: the first metatarsal bears approximately 40%, with the remaining four sharing 60% between them. During push-off, the first metatarsal load increases substantially through the sesamoid complex. First ray hypermobility (dorsal displacement greater than 2mm under load) compromises this, transferring excess stress to the second and third metatarsals and producing symptomatic metatarsalgia.",
        quiz: {
          q: "The Jones fracture at the fifth metatarsal has a higher non-union rate than the styloid avulsion fracture because:",
          options: ["It involves the insertion of peroneus brevis", "It occurs in an avascular watershed zone at the metaphyseal-diaphyseal junction", "It always results from a high-energy mechanism", "It affects the metatarsal head rather than the base"],
          answer: 1,
          explain: "The Jones fracture occurs at Zone 2, the metaphyseal-diaphyseal junction of the fifth metatarsal, which lies in a relatively avascular watershed zone between the nutrient artery and periosteal blood supply. This reduced vascularity impairs healing and produces a significantly higher non-union rate than the Zone 1 styloid avulsion fracture, which heals reliably with conservative management."
        }
      },
      {
        id: "a6", heading: "The Talocrural Joint: Anatomy and Equinus",
        body: "The talocrural joint is a mortise-and-tenon synovial hinge formed by the tibial plafond, medial malleolus, and fibula, with the talar dome fitting within the mortise. Normal ankle dorsiflexion is 10-20 degrees from neutral. The talar dome is approximately 6mm wider anteriorly than posteriorly: in dorsiflexion the wide anterior dome locks within the mortise providing maximum bony stability; in plantarflexion the narrow posterior dome articulates with reduced bony constraint — explaining why lateral ankle sprains occur in plantarflexion.",
        quiz: null
      },
      {
        id: "a7", heading: "The Lateral Ligament Complex and Chronic Instability",
        body: "Lateral ankle sprains are the most common musculoskeletal injury in sport and among the most frequent acute presentations in podiatric practice. Despite their frequency, they carry significant risk of developing into chronic lateral ankle instability if inadequately managed.\n\nThe ATFL is the weakest of the three lateral ligaments (failure load 65-75N) and the primary restraint to anterior talar displacement in plantarflexion. It is disrupted in approximately 85% of all lateral ankle sprains. The anterior drawer test has sensitivity 73-96% and specificity 84-97% for ATFL laxity.",
        quiz: {
          q: "The anterior talofibular ligament is disrupted in approximately what proportion of lateral ankle sprains?",
          options: ["40%", "60%", "85%", "95%"],
          answer: 2,
          explain: "The ATFL is the weakest lateral ligament (failure load 65-75N) and is disrupted in approximately 85% of all lateral ankle sprains. It is the primary restraint to anterior talar displacement in plantarflexion, the position in which most lateral ankle sprains occur."
        }
      },
      {
        id: "a8", heading: "The Subtalar Joint: Triplanar Motion and Kinetic Chain",
        body: "The subtalar joint (STJ) is formed by three facets between the talus above and the calcaneus below. Its oblique axis of motion makes it the key triplanar joint of the foot and places it at the centre of both biomechanical assessment and orthotic prescription in podiatric practice.\n\n**Triplanar Motion: The Oblique Axis**\n\nThe STJ axis runs at approximately 42 degrees from horizontal and 16 degrees from the sagittal plane. This oblique axis means that STJ motion is inherently triplanar. STJ pronation equals simultaneous eversion, abduction, and dorsiflexion of the calcaneus beneath the talus. STJ supination equals simultaneous inversion, adduction, and plantarflexion.",
        quiz: null
      },
      {
        id: "a9", heading: "The Windlass Mechanism",
        body: "The windlass mechanism, described by Howard Hicks in 1954, is the most important single biomechanical concept in podiatric practice. Its understanding underpins rational orthotic prescription, the management of plantar fasciopathy, and the clinical interpretation of hallux biomechanics.\n\n**Hicks' Original Description**\n\nHicks observed that the foot behaves as a twisted plate with the plantar aponeurosis as the structural element that converts it between two functional states. The plantar aponeurosis originates from the medial calcaneal tubercle and inserts via a complex pulley system through the plantar plate into the proximal phalanx bases of all five toes.",
        quiz: null
      },
      {
        id: "a10", heading: "First MTPJ: Hallux Limitus, Hallux Rigidus, and Hallux Valgus",
        body: "The first metatarsophalangeal joint (MTPJ) is the most functionally important single joint in the foot. Its dorsiflexion range determines windlass efficiency, its stability determines first ray load-bearing capacity, and its structural alignment determines footwear fit and biomechanical function.\n\n**Normal Function and Assessment**\n\nNormal first MTPJ dorsiflexion is 50-65 degrees non-weight-bearing. Functional hallux limitus is defined as restriction of first MTPJ dorsiflexion below 50-65 degrees, which prevents efficient windlass activation and reduces propulsive efficiency. Structural hallux limitus refers to restriction caused by bony changes at the joint. Hallux rigidus is end-stage disease with dorsiflexion below 20-30 degrees, significant osteophyte formation, and joint space narrowing on radiograph.",
        quiz: null
      },
      {
        id: "a11", heading: "Arterial Supply: Posterior Tibial and Dorsalis Pedis",
        body: "The foot receives its blood supply from two main arterial systems. Accurate knowledge of these vessels and their clinical palpation sites underpins both vascular assessment and safe procedural planning in podiatric practice.\n\n**The Posterior Tibial Artery**\n\nThe posterior tibial artery (PTA) is the dominant vessel supplying the plantar foot. It descends in the deep posterior compartment of the lower leg and passes posterior to the medial malleolus within the tarsal tunnel alongside the tibial nerve and the tendons of tibialis posterior, flexor digitorum longus, and flexor hallucis longus.\n\nThe mnemonic Tom Dick And Nervous Harry describes the tarsal tunnel contents from anterior to posterior: Tibialis posterior, flexor Digitorum longus, posterior tibial Artery, tibial Nerve, flexor Hallucis longus.",
        quiz: null
      },
      {
        id: "a12", heading: "Nerve Supply: The Five Peripheral Nerves of the Foot",
        body: "Five peripheral nerves supply the foot, each with distinct territories and each associated with specific entrapment syndromes. Accurate knowledge of these distributions enables precise neurological examination and differential diagnosis of foot pain.\n\n**The Tibial Nerve and Its Divisions**\n\nThe tibial nerve passes posterior to the medial malleolus within the tarsal tunnel and divides beneath the abductor hallucis into: the medial plantar nerve (medial 3.5 toes, intrinsic muscles of the medial compartment, medial plantar skin) and the lateral plantar nerve (lateral 1.5 toes, remaining intrinsic muscles, lateral plantar skin). The medial calcaneal branches arise proximal to the tarsal tunnel to supply the heel pad.",
        quiz: null
      },
      {
        id: "a13", heading: "Tarsal Tunnel Syndrome and Morton Neuroma",
        body: "Two peripheral nerve entrapment syndromes are sufficiently common in podiatric practice to warrant detailed understanding of their anatomy, diagnosis, and management: tarsal tunnel syndrome and Morton neuroma (interdigital neuritis).\n\n**Tarsal Tunnel Syndrome**\n\nTarsal tunnel syndrome is compression of the tibial nerve or its branches under the flexor retinaculum posterior to the medial malleolus. Clinical presentation: burning, tingling, and numbness over the plantar foot and toes, characteristically nocturnal or worsening with prolonged standing. Pain may radiate proximally along the medial leg (Valleix phenomenon) or distally into the affected digits. Tinel sign (percussion at the tarsal tunnel reproducing distal paraesthesiae) has sensitivity 58%, specificity 86% (Antoniadis et al., 2008).",
        quiz: {
          q: "Tarsal tunnel syndrome results from compression of which nerve under the flexor retinaculum?",
          options: ["Superficial peroneal nerve", "Deep peroneal nerve", "Tibial nerve", "Sural nerve"],
          answer: 2,
          explain: "Tarsal tunnel syndrome is compression of the tibial nerve or its branches under the flexor retinaculum posterior to the medial malleolus, presenting with burning, tingling, and numbness over the plantar foot, characteristically nocturnal or worsening with prolonged standing."
        }
      },
      {
        id: "a14", heading: "Tendons of the Foot: Anatomy and Common Pathologies",
        body: "The tendons of the foot are among the most clinically important structures in podiatric practice, being the site of some of the most common conditions managed by podiatrists.\n\n**Achilles Tendon**\n\nThe Achilles tendon withstands forces of 6-8 times body weight during running. It forms approximately 15cm proximal to the calcaneal insertion and rotates approximately 90 degrees before inserting, contributing to the characteristic zone of degeneration in mid-portion tendinopathy 2-6cm proximal to insertion. The retrocalcaneal bursa lies between the anterior Achilles and posterior calcaneal surface, and its inflammation may co-exist with insertional tendinopathy.",
        quiz: null
      },
      {
        id: "a15", heading: "Plantar Fascia: Anatomy, Windlass, and Fasciopathy",
        body: "The plantar fascia is a thick band of longitudinally arranged collagen fibres spanning the plantar foot from the medial calcaneal tubercle to the proximal phalanx bases of all five toes. Normal central band thickness on ultrasound is 2.0-4.0mm at the calcaneal origin; above 4.0mm indicates pathological thickening in plantar fasciopathy.\n\nThe central band is the cable element of the windlass mechanism (Hicks, 1954). Hallux dorsiflexion at the first MTPJ during terminal stance tightens the plantar aponeurosis around the metatarsal heads, raising the medial longitudinal arch and converting the compliant midstance foot to the rigid propulsive lever required for push-off. This mechanism generates approximately 100N of arch-raising force at just 30 degrees of hallux dorsiflexion.",
        quiz: null
      },
      {
        id: "a16", heading: "Intrinsic Foot Muscles: Anatomy and Clinical Significance",
        body: "The intrinsic foot muscles, those that both originate and insert within the foot, make an important and often underappreciated contribution to dynamic foot function. Evidence from ultrasound imaging and electromyography research has demonstrated that intrinsic muscle weakness is associated with several common foot conditions, making their assessment and rehabilitation clinically important.\n\n**Four Layers of the Plantar Intrinsics**\n\nLayer 1 (most superficial): abductor hallucis (medial), flexor digitorum brevis (central), abductor digiti minimi (lateral). These muscles form the visible superficial muscular architecture of the plantar foot. Layer 2: quadratus plantae and four lumbricals. Layer 3: flexor hallucis brevis, adductor hallucis (oblique and transverse heads), flexor digiti minimi brevis. Layer 4 (deepest): three plantar interossei and four dorsal interossei.",
        quiz: null
      },
      {
        id: "a17", heading: "The Foot Arches: Structure, Function, and Clinical Assessment",
        body: "The foot has three structural arches: the medial longitudinal arch (MLA), lateral longitudinal arch, and transverse arch. The MLA is the most clinically important, spanning from the calcaneal tuberosity to the first metatarsal head with the talus at its apex.\n\nThe MLA's maintenance depends on three components: the bony arch, the plantar ligamentous complex (spring ligament, plantar fascia), and dynamic muscular support (tibialis posterior, intrinsic foot muscles). Navicular drop test: normal is 5-9mm; above 10mm indicates excessive arch lowering.",
        quiz: null
      },
      {
        id: "a18", heading: "Gait Analysis: The Gait Cycle and Normal Parameters",
        body: "Gait analysis is the systematic study of human locomotion. For the podiatrist, it is both a diagnostic tool to identify biomechanical dysfunction and a clinical skill to explain why specific conditions develop in specific patients. Understanding normal gait parameters is the prerequisite for identifying and interpreting deviations.\n\n**The Gait Cycle**\n\nThe gait cycle runs from initial contact of one foot to the next initial contact of the same foot. Stance phase occupies approximately 60% and swing phase 40%. At comfortable self-selected walking speed (approximately 1.3-1.5 m/s), one complete cycle takes approximately 1.0-1.1 seconds.",
        quiz: null
      },
      {
        id: "a19", heading: "Biomechanical Assessment: Examination Protocol",
        body: "A systematic biomechanical examination protocol integrates static structural assessment, dynamic functional testing, and observational gait analysis into a coherent clinical picture that informs diagnosis and treatment planning.\n\n**Static Assessment**\n\nBegin with non-weight-bearing examination of joint ranges of motion: ankle dorsiflexion (lunge test; normal 35-40mm or more), first MTPJ dorsiflexion (normal 50-65 degrees), subtalar joint inversion and eversion (approximate neutral position), midtarsal joint pronation and supination, and lesser digit and hallux assessment. Measure and document all findings bilaterally for comparison.\n\nWeight-bearing assessment: navicular drop, Foot Posture Index, arch height index, hallux valgus angle estimation, toe alignment, and callus distribution (callus pattern reflects chronic pressure loading patterns and provides a functional pressure map).",
        quiz: null
      },
      {
        id: "a20", heading: "Clinical Correlations: Putting Anatomy into Practice",
        body: "The study of foot and ankle anatomy is only valuable insofar as it informs and improves clinical practice. This final slide draws together the key anatomical principles and their direct clinical applications encountered daily in podiatric practice.\n\n**From Anatomy to Diagnosis**\n\nThe talus has no muscular attachments - therefore displaced talar neck fractures carry a 20-50% risk of avascular necrosis. The talar dome is wider anteriorly - therefore lateral ankle sprains occur in plantarflexion. The STJ axis is oblique at 42 degrees - therefore STJ pronation drives internal tibial rotation and associates with proximal conditions. The windlass requires hallux dorsiflexion - therefore hallux rigidus impairs propulsion and increases metatarsal loading.",
        quiz: {
          q: "The windlass mechanism is activated by:",
          options: ["Heel strike causing plantar fascia tension", "Hallux dorsiflexion at the MTPJ tightening the plantar aponeurosis", "Subtalar joint supination elevating the medial arch", "Tibialis posterior contraction raising the navicular"],
          answer: 1,
          explain: "The windlass mechanism is activated when the hallux dorsiflexes at the first MTPJ during terminal stance and pre-swing. Dorsiflexion tightens the plantar aponeurosis around the metatarsal heads like a cable around a capstan drum, raising the medial longitudinal arch and supinating the foot into a rigid propulsive lever for push-off. This was first described by Howard Hicks in 1954."
        }
      }
    ],
    exam: [
      { q: "The talus is unique because it has:", opts: ["No articular surfaces","No muscular attachments","Only one blood supply vessel","No periosteum"], a: 1, exp: "The talus has no muscular attachments — all forces pass through its seven articular surfaces and ligamentous connections, making it entirely dependent on soft tissues for vascularity and vulnerable to AVN after displaced fractures." },
      { q: "Normal lunge test ankle dorsiflexion is:", opts: ["Less than 20mm","20-35mm","35-40mm or more","More than 55mm"], a: 2, exp: "Normal ankle dorsiflexion on the lunge test is 35-40mm or more. Below 35mm constitutes functional equinus with an OR of 23.3 for plantar fasciopathy (Riddle et al., 2003, JBJS)." },
      { q: "Ottawa Ankle Rules reduce unnecessary ankle radiographs by approximately:", opts: ["10%","20%","30-40%","60%"], a: 2, exp: "The Ottawa Ankle Rules reduce unnecessary ankle X-rays by 30-40% while maintaining 96-99% sensitivity for clinically significant fractures." },
      { q: "Morton neuroma most commonly affects which interdigital space?", opts: ["First","Second","Third","Fourth"], a: 2, exp: "The third interdigital space is most commonly affected because the common digital nerve receives contributions from both medial and lateral plantar nerves, making it the largest and most susceptible to compression." },
      { q: "STJ pronation is correctly defined as:", opts: ["Inversion, adduction, plantarflexion","Eversion, abduction, dorsiflexion","Eversion, adduction, plantarflexion","Inversion, abduction, dorsiflexion"], a: 1, exp: "STJ pronation is simultaneous eversion, abduction, and dorsiflexion. The STJ axis runs at approximately 42 degrees from horizontal and 16 degrees from the sagittal plane, making motion inherently triplanar." },
      { q: "The Jones fracture (Zone 2) carries higher non-union risk because:", opts: ["It involves peroneus brevis insertion","Zone 2 lies in a relatively avascular watershed zone","It always results from high-energy trauma","The fifth metatarsal has no periosteal supply"], a: 1, exp: "The Jones fracture (Zone 2, metaphyseal-diaphyseal junction) lies in a relatively avascular watershed zone between the nutrient artery and periosteal blood supply, reducing healing stimulus and producing a significantly higher non-union rate requiring fixation in athletes." },
      { q: "The sustentaculum tali carries the groove for which tendon?", opts: ["Tibialis posterior","Flexor digitorum longus","Flexor hallucis longus","Peroneus longus"], a: 2, exp: "The sustentaculum tali carries the groove for the flexor hallucis longus (FHL) tendon. FHL tenosynovitis at this site presents with posteromedial ankle pain and is common in ballet dancers and distance runners." },
      { q: "The Lisfranc ligament connects:", opts: ["Navicular to second metatarsal","Medial cuneiform to second metatarsal base","Cuboid to fifth metatarsal","Calcaneus to cuboid"], a: 1, exp: "The Lisfranc ligament connects the medial cuneiform to the second metatarsal base — the primary stabiliser of the tarsometatarsal complex. Disruption causes midfoot instability missed on initial presentation in up to 20% of cases." },
      { q: "Normal first MTPJ dorsiflexion for efficient propulsion is approximately:", opts: ["25-30 degrees","35-40 degrees","50-65 degrees","75-80 degrees"], a: 2, exp: "Normal first MTPJ dorsiflexion is approximately 50-65 degrees non-weight-bearing. Restriction below 50 degrees defines functional hallux limitus, impairing windlass activation and increasing loading on lesser metatarsals." },
      { q: "The windlass mechanism was first described by:", opts: ["Root (1971)","Hicks (1954)","Perry (1992)","Manter (1941)"], a: 1, exp: "Howard Hicks (1954) described how hallux dorsiflexion tightens the plantar aponeurosis around the metatarsal heads, raising the medial longitudinal arch and supinating the foot into the rigid propulsive lever of push-off." }
    ]
  },
  {
    id: "nails", title: "Nail Pathology and Surgery", icon: "💅", color: "#145A32",
    cpd: 3, level: "Intermediate",
    blurb: "Onychomycosis diagnosis and evidence-based treatment, Heifetz staging, conservative splinting techniques, and PNA with phenolisation.",
    slides: [
      {
        id: "n1", heading: "Nail Unit Anatomy",
        body: "The nail unit is a specialised cutaneous appendage comprising five distinct anatomical components. Understanding each component's structure and function is the foundation of accurate nail pathology assessment and surgical planning.\n\n**The Nail Matrix**\n\nThe nail matrix is the germinative epithelium responsible for nail plate production. The proximal matrix lies beneath the proximal nail fold and produces the dorsal, harder two-thirds of the nail plate. The distal matrix is visible externally as the lunula, the white crescent at the nail base, and produces the softer ventral one-third. Matrix damage from any cause including trauma, infection, surgery, or inflammatory disease produces permanent nail plate dystrophy proportional to the extent and location of involvement.",
        quiz: null
      },
      {
        id: "n2", heading: "Nail Plate Assessment: The ABCDE Framework",
        body: "Systematic nail assessment using a structured framework prevents diagnostic errors and ensures all key features are consistently evaluated at every clinical encounter. The ABCDE approach provides a comprehensive, reproducible method for nail examination.\n\n**A: Appearance and Colour**\n\nYellow-brown discolouration with subungual hyperkeratosis is the classic onychomycosis pattern. White discolouration may indicate white superficial onychomycosis or leukonychia. Green discolouration (chloronychia) indicates Pseudomonas aeruginosa secondary infection in the space created by onycholysis. Dark brown or black discolouration requires careful assessment: subungual haematoma (traumatic origin, grows distally with the nail plate) must be distinguished from subungual melanoma, which does not follow nail plate growth and may show the Hutchinson sign (pigmentation extending into the periungual skin folds).",
        quiz: null
      },
      {
        id: "n3", heading: "Onychomycosis: Epidemiology and the 50% Rule",
        body: "Onychomycosis is the most common nail disorder in adults, affecting approximately 14% of the UK population and rising to 30-40% in those over 60 years. It generates substantial podiatric clinical workload and creates real quality of life burden through effects on confidence, footwear choice, and social function.\n\n**The Most Important Clinical Principle**\n\nUp to 50% of clinically dystrophic toenails do NOT have a fungal aetiology. Psoriasis, lichen planus, trauma-related onycholysis, onychogryphosis, and peripheral vascular disease can all produce nail changes that are clinically indistinguishable from fungal infection. This means that treating on clinical appearance alone results in inappropriate systemic antifungal prescription in approximately one in two cases.",
        quiz: null
      },
      {
        id: "n4", heading: "Onychomycosis: Clinical Subtypes",
        body: "Four distinct clinical subtypes of onychomycosis are recognised, each with different causative organisms, clinical features, and treatment implications. Accurate subtype classification guides appropriate treatment selection and helps predict response.\n\n**Distal Lateral Subungual Onychomycosis (DLSO)**\n\nDLSO is by far the most common subtype, accounting for approximately 80% of all onychomycosis cases. Invasion begins at the hyponychium at the distal free edge and advances proximally beneath the nail plate. The infective process causes progressive yellow-brown discolouration, accumulation of subungual hyperkeratotic debris, separation of the nail plate from the nail bed (onycholysis), and ultimately nail plate thickening. The lunula is typically spared until late-stage disease when the matrix becomes involved. T. rubrum is the primary causative organism.",
        quiz: null
      },
      {
        id: "n5", heading: "Laboratory Confirmation: Sampling and Diagnostic Modalities",
        body: "Laboratory confirmation of onychomycosis before systemic treatment is not merely good practice; it is an ethical imperative. The reliability of laboratory testing depends critically on the quality of the sample provided.\n\n**Optimal Sampling Technique**\n\nThe site of sampling is critical and commonly incorrect. Sampling the most distal visible debris or nail plate surface recovers material that is often dead, heavily contaminated with environmental organisms, and unlikely to yield viable pathogenic fungi. The optimal sample site is the most proximal point of onycholysis, the leading edge of the infection where actively proliferating fungi are most abundant.",
        quiz: {
          q: "Up to what proportion of clinically dystrophic toenails do NOT have a fungal aetiology?",
          options: ["10%", "25%", "50%", "75%"],
          answer: 2,
          explain: "Up to 50% of clinically dystrophic toenails have a non-fungal cause including psoriasis, trauma, lichen planus, and onychogryphosis, all of which can produce identical clinical appearances. Laboratory confirmation is mandatory before prescribing systemic antifungals, which carry hepatotoxicity risk and significant drug interactions."
        }
      },
      {
        id: "n6", heading: "Terbinafine: First-Line Systemic Treatment",
        body: "Terbinafine 250mg daily for 12 weeks is the first-line oral treatment for dermatophyte onychomycosis and represents the most evidence-based systemic antifungal option available. Understanding its mechanism, efficacy, safety profile, and monitoring requirements is essential for all podiatrists working with onychomycosis.\n\n**Mechanism of Action**\n\nTerbinafine inhibits squalene epoxidase, a key enzyme in the fungal ergosterol biosynthesis pathway. This produces fungicidal rather than merely fungistatic activity against dermatophytes: the drug kills the organism rather than merely inhibiting its growth. This mechanism explains why terbinafine is superior to azole antifungals for dermatophyte onychomycosis, as azoles (which target a different step in ergosterol synthesis) are typically only fungistatic against dermatophytes.",
        quiz: null
      },
      {
        id: "n7", heading: "Itraconazole and Topical Antifungal Treatment",
        body: "Itraconazole provides broader antifungal spectrum than terbinafine, including Candida species and most non-dermatophyte moulds, making it the appropriate choice when laboratory confirmation identifies a non-dermatophyte organism or when Candida onychomycosis is diagnosed.\n\n**Itraconazole: Pulse and Continuous Therapy**\n\nPulse therapy: 400mg daily (two 200mg capsules) for 7 consecutive days per month for 3 pulses (3 months total). Pulse therapy achieves equivalent or superior efficacy to continuous dosing for toenail onychomycosis while reducing total drug exposure and potentially reducing adverse effect frequency.\n\nContinuous therapy: 200mg daily for 12 weeks. May be preferred in patients where pulse therapy compliance is a concern.",
        quiz: {
          q: "Itraconazole pulse therapy for onychomycosis is dosed as:",
          options: ["200mg daily continuously for 12 weeks", "400mg daily for 7 consecutive days per month for 3 months", "100mg twice daily for 6 weeks", "600mg once weekly for 8 weeks"],
          answer: 1,
          explain: "Itraconazole pulse therapy is dosed as 400mg daily (two 200mg capsules) for 7 consecutive days per month, repeated for 3 pulses over 3 months. This pulse regimen achieves equivalent or superior efficacy to continuous dosing while reducing total drug exposure."
        }
      },
      {
        id: "n8", heading: "Ingrown Toenails: Aetiology and Heifetz Classification",
        body: "Onychocryptosis occurs when the lateral margin of the nail plate penetrates the periungual skin, triggering an inflammatory and subsequently granulomatous response. Incorrect nail trimming (cutting corners rounded or too short, leaving a spike that re-embeds) is the most common modifiable cause. Hyperhidrosis softens the periungual skin. Tight footwear applies lateral compression. Hereditary involuted (pincer) nail morphology predisposes to recurrence regardless of trimming technique.",
        quiz: null
      },
      {
        id: "n9", heading: "Conservative Management: Evidence-Based Techniques",
        body: "Conservative management of onychocryptosis at Stage 1, and in some Stage 2 presentations, should always be attempted before progressing to surgery. Evidence-based techniques achieve success rates of over 80% for Stage 1 presentations and avoid the risks, recovery time, and cost of surgical intervention.\n\n**Cotton Wool or Dental Floss Splinting**\n\nA pledget of cotton wool or a loop of dental floss is placed under the elevated free edge of the nail plate at the embedded corner, gently lifting the nail edge clear of the lateral sulcus skin and preventing re-embedding as the nail grows forward. The patient maintains this daily, replacing the cotton wool when it becomes wet or soiled and keeping the area clean and dry.",
        quiz: {
          q: "Evidence-based conservative techniques for Stage 1 onychocryptosis achieve success rates of approximately:",
          options: ["40-50%", "60-70%", "Over 80%", "Under 30%"],
          answer: 2,
          explain: "Evidence-based conservative techniques, such as cotton wool or dental floss splinting, achieve success rates of over 80% for Stage 1 onychocryptosis, making conservative management the appropriate first-line approach before considering surgical intervention at this stage."
        }
      },
      {
        id: "n10", heading: "Digital Ring Block: Safe Anaesthetic Technique",
        body: "A successful and safe digital ring block is the foundation of all nail surgery. Every podiatrist performing nail surgery must be able to perform this procedure safely, using the correct agent, concentration, and technique.\n\n**Equipment and Agent Selection**\n\nEquipment: 2-5ml luer-lock syringe, 25G or 27G needle, 2% plain lidocaine. The agent must be 2% plain lidocaine with absolutely no vasoconstrictor of any kind. This is a non-negotiable safety requirement. Adrenaline (epinephrine) and other vasoconstrictors are absolutely contraindicated in digital ring blocks.",
        quiz: {
          q: "Adrenaline is absolutely contraindicated in digital ring blocks because:",
          options: ["It reduces the duration of anaesthesia", "Digital arteries are end-arteries; vasoconstriction risks irreversible ischaemia and digit loss", "It increases the systemic toxicity risk of lidocaine", "It interacts with phenol to cause necrosis"],
          answer: 1,
          explain: "Digital arteries are end-arteries with no collateral blood supply. Adrenaline-induced vasoconstriction can cause irreversible digital arterial vasospasm, ischaemia, gangrene, and potential digit loss. This risk is dramatically increased in patients with diabetes, PAD, Raynaud phenomenon, or scleroderma. Always use 2% plain lidocaine only."
        }
      },
      {
        id: "n11", heading: "Partial Nail Avulsion: Surgical Technique",
        body: "Partial nail avulsion (PNA) with chemical matrix ablation using phenol is the definitive surgical treatment for recurrent or Stage 3 onychocryptosis. When performed correctly, it achieves recurrence rates of 1-4% at 12 months versus 33-66% for non-phenolised PNA — an overwhelming clinical advantage (Eekhof et al., 2014, Cochrane).\n\n**Digital Ring Block: Safe Anaesthetic Technique**\n\nEquipment: 2-5ml luer-lock syringe, 25G or 27G needle, 2% plain lidocaine. Never use adrenaline or any vasoconstrictor: digital arteries are end-arteries and vasoconstriction risks irreversible digital ischaemia, gangrene, and potential digit loss. Inject 0.5-1ml medially and laterally at the base of the proximal phalanx. Allow 5-7 minutes. Confirm complete anaesthesia before commencing. Apply a digital tourniquet.",
        quiz: null
      },
      {
        id: "n12", heading: "Phenolisation: Pharmacology and Evidence",
        body: "Phenol 88% is a protein-denaturing agent that destroys the germinative cells of the nail matrix when applied for an adequate duration, producing coagulative necrosis of the exposed matrix epithelium and preventing nail plate regrowth from the treated area.\n\nThree separate 30-second applications, neutralised with isopropyl alcohol between each, have been established as the optimal protocol: this achieves more reliable matrix destruction than one prolonged application while causing less collateral tissue damage to surrounding structures. The isopropyl alcohol neutralisation between applications dilutes residual phenol, preventing damage beyond the intended matrix area.",
        quiz: null
      },
      {
        id: "n13", heading: "Nail Surgery Complications and Their Management",
        body: "Like all surgical procedures, partial nail avulsion with phenolisation carries potential complications that the practitioner must be able to recognise, manage, and document. Awareness of these complications and their prevention is essential for safe practice.\n\n**Immediate Intraoperative Complications**\n\nInadequate anaesthesia: if the patient reports sharp pain during the procedure, do not proceed. Reapply local anaesthetic and wait a further 5-7 minutes. If adequate anaesthesia cannot be achieved (often due to infection-related low tissue pH or patient anxiety), abandon the procedure and rearrange. Tourniquet-related ischaemia: ensure the tourniquet is released within 20 minutes of application. Prolonged tourniquet application can cause ischaemic injury to digital tissues.",
        quiz: null
      },
      {
        id: "n14", heading: "Other Common Nail Conditions",
        body: "Beyond onychomycosis and onychocryptosis, podiatrists encounter a range of other nail conditions that require accurate diagnosis and condition-appropriate management. Misidentifying these conditions leads to inappropriate treatment and patient dissatisfaction.\n\n**Subungual Haematoma**\n\nSubungual haematoma is the most common acute nail condition seen in podiatric practice, resulting from blunt trauma to the nail plate and nail bed. A collection of blood beneath the nail plate produces a painful dark discolouration. If pressure is causing significant pain within 48 hours, trephination (perforating the nail plate with a heated metal implement or electrosurgical tip) allows haematoma drainage and immediate pain relief. Large subungual haematomas may indicate an underlying distal phalanx fracture and require radiographic assessment.",
        quiz: null
      },
      {
        id: "n15", heading: "Nail Psoriasis, Paronychia, and Nail Tumours",
        body: "Several other nail conditions encountered in podiatric practice require specific recognition and management: nail psoriasis, paronychia, and subungual tumours.\n\n**Nail Psoriasis in Detail**\n\nThe pathognomonic features of nail psoriasis are: pitting (irregular punctate depressions in the nail plate from abnormal keratinisation in the proximal matrix), oil-drop sign (salmon-coloured discolouration beneath the nail plate from psoriatic involvement of the nail bed), and onycholysis with a clear zone of separation between the detached nail plate and the nail bed. Subungual hyperkeratosis, crumbling of the nail plate, and transverse lines (Beau lines in psoriatic exacerbations) may all also occur.",
        quiz: null
      },
      {
        id: "n16", heading: "Nail Surgery: Total Nail Avulsion and Other Procedures",
        body: "Beyond partial nail avulsion, podiatrists may perform total nail avulsion and other nail-related surgical procedures. Understanding the indications, technique, and post-operative management of these procedures is part of comprehensive nail surgery competency.\n\n**Total Nail Avulsion: Indications**\n\nTotal nail avulsion may be indicated in: severe total dystrophic onychomycosis not amenable to topical therapy; nail plate injury requiring removal for nail bed repair; and as part of the preparation for matrix ablation in patients where all nail plate growth is to be stopped. It may be performed with or without matrix ablation depending on the intended outcome.",
        quiz: null
      },
      {
        id: "n17", heading: "Paediatric Nail Conditions",
        body: "Nail conditions in children require specific consideration of age-appropriate presentation, natural history, and management approaches that differ from adult practice. Several conditions are either exclusive to or far more common in the paediatric population.\n\n**Ingrown Toenails in Children and Adolescents**\n\nOnychocryptosis is common in children, particularly adolescents, where it is often associated with rapid foot growth, increasing nail plate width relative to the lateral nail fold, and the development of adult footwear habits. Management principles are identical to those in adults: accurate Heifetz staging, conservative management first for Stage 1, surgical management for Stage 3 or failure of conservative management.",
        quiz: null
      },
      {
        id: "n18", heading: "Nail Conditions in Diabetes and Peripheral Vascular Disease",
        body: "Nail pathology in patients with diabetes and/or peripheral vascular disease requires modified assessment and management approaches. The combination of impaired immunity, neuropathy, and ischaemia creates unique risks that must be carefully considered before any nail procedure.\n\n**Modified Assessment in High-Risk Patients**\n\nEvery nail procedure in a patient with diabetes must be preceded by a full diabetic foot assessment including neurological assessment (10g monofilament, vibration), vascular assessment (pedal pulse palpation, hand-held Doppler if pulses are equivocal), ABPI or TBPI where indicated, and IWGDF risk category assignment. Photographs should be taken before and after any nail procedure.",
        quiz: null
      },
      {
        id: "n19", heading: "Documentation, Consent, and Medicolegal Considerations",
        body: "Nail surgery, like all clinical procedures, must be accompanied by thorough documentation, appropriate consent processes, and clinical practice that meets medicolegal standards. Adherence to these standards protects both the patient and the practitioner.\n\n**Informed Consent**\n\nInformed consent for nail surgery must include: the diagnosis and rationale for surgical intervention; description of the planned procedure in terms the patient can understand; expected outcomes and success rates (recurrence rate 1-4% with phenolisation); specific risks of the procedure (infection, bleeding, haematoma, wound healing delay, nail spicule regrowth, incomplete ablation); alternative treatments and their outcomes; and the option to decline treatment.",
        quiz: null
      },
      {
        id: "n20", heading: "Nail Surgery in Practice: Clinical Decision-Making",
        body: "This final slide consolidates the clinical decision-making framework for nail pathology into a practical approach that can be applied at every podiatric consultation involving nail conditions.\n\n**The Diagnostic Decision Tree**\n\nWhen presented with a nail abnormality, ask: Is this infection (onychomycosis), structural (ingrown nail, deformity), traumatic (haematoma, dystrophy), systemic (psoriasis, lichen planus, connective tissue disease), or neoplastic (subungual exostosis, wart, melanoma)? Clinical features alone cannot reliably distinguish onychomycosis from non-fungal dystrophy in up to 50% of cases. Laboratory confirmation is mandatory before systemic antifungal treatment.",
        quiz: {
          q: "The 2014 Cochrane review by Eekhof et al. established that phenolised PNA achieves recurrence rates of:",
          options: ["1-4%", "15-20%", "33-50%", "60-70%"],
          answer: 0,
          explain: "Eekhof et al. (2014, Cochrane) found phenolised PNA achieves 1-4% recurrence at 12 months versus 33-66% for non-phenolised PNA. This overwhelming advantage makes phenolisation the unequivocal standard of care for surgical management of onychocryptosis requiring PNA. Post-operative discharge is expected for 4-6 weeks."
        }
      }
    ],
    exam: [
      { q: "T. rubrum accounts for approximately what proportion of onychomycosis?", opts: ["30%","50%","70%","90%"], a: 2, exp: "Trichophyton rubrum accounts for approximately 70% of all onychomycosis cases. All dermatophytes cause approximately 90%; non-dermatophyte moulds account for 5-10% and are inherently resistant to terbinafine." },
      { q: "Pre-treatment LFTs are mandatory before terbinafine because:", opts: ["Terbinafine causes renal impairment","Terbinafine carries hepatotoxicity risk of approximately 1:45,000","Terbinafine inhibits CYP3A4","Terbinafine elevates blood glucose"], a: 1, exp: "Terbinafine is hepatically metabolised and carries a rare but important hepatotoxicity risk. Pre-treatment LFTs are mandatory, with repeat testing if symptoms of hepatitis develop or treatment extends beyond 12 weeks." },
      { q: "Cotton wool splinting for Stage 1 ingrown toenail achieved what success rate at 6 months?", opts: ["55%","70%","84%","95%"], a: 2, exp: "Erdogan et al. (2011, EJDV) demonstrated 84% success at 6 months in an RCT — making cotton wool splinting the most evidence-based first-line technique for Stage 1 onychocryptosis." },
      { q: "Adrenaline is absolutely contraindicated in digital ring blocks because:", opts: ["It reduces anaesthetic duration","Digital arteries are end-arteries — vasoconstriction risks irreversible ischaemia","It increases systemic toxicity","It interacts with phenol"], a: 1, exp: "Digital arteries have no collateral blood supply. Adrenaline-induced vasoconstriction can cause irreversible digital arterial vasospasm, ischaemia, gangrene, and potential digit loss. Always use 2% plain lidocaine only." },
      { q: "Post-operative discharge following PNA with phenolisation is expected for:", opts: ["2-3 days","1-2 weeks","4-6 weeks","3-6 months"], a: 2, exp: "Post-operative wound discharge is expected for 4-6 weeks following phenolisation and must be communicated to patients before the procedure to ensure appropriate wound care and realistic expectations." },
      { q: "Up to what proportion of clinically dystrophic toenails are NOT caused by fungal infection?", opts: ["10%","25%","50%","75%"], a: 2, exp: "Up to 50% of clinically dystrophic toenails have a non-fungal cause. Laboratory confirmation (KOH plus culture or PCR) is mandatory before prescribing systemic antifungals which carry hepatotoxicity risk and significant drug interactions." },
      { q: "Itraconazole pulse therapy for onychomycosis is:", opts: ["200mg daily for 12 weeks","400mg daily for 7 days per month for 3 months","250mg daily for 8 weeks","400mg daily for 4 weeks"], a: 1, exp: "Itraconazole pulse therapy: 400mg daily for 7 consecutive days per month for 3 months. Pulse therapy achieves equivalent efficacy to continuous dosing while reducing total drug exposure. CYP3A4 interactions require thorough medication review before prescribing." },
      { q: "A patient on warfarin with confirmed T. rubrum onychomycosis — the safest systemic treatment is:", opts: ["Itraconazole pulse therapy","Terbinafine 250mg daily","Fluconazole weekly","Griseofulvin"], a: 1, exp: "Terbinafine does not significantly inhibit CYP2C9 (metabolising S-warfarin) and is safer than itraconazole in patients on warfarin. Itraconazole is a potent CYP3A4 inhibitor that can double or triple INR within days." },
      { q: "White superficial onychomycosis (WSO) can be treated with topical therapy alone because:", opts: ["Causative organisms are systemic treatment-resistant","Invasion is limited to the dorsal nail surface without matrix involvement","The nail plate is too thin for systemic drug penetration","Systemic treatment is always contraindicated for surface infections"], a: 1, exp: "WSO involves T. mentagrophytes invading the dorsal nail plate surface directly without penetrating from below. Limited to the superficial nail without matrix involvement, topical amorolfine 5% lacquer is often curative." },
      { q: "Heifetz Stage 3 ingrown toenail is characterised by:", opts: ["Erythema and oedema only","Infection with purulent discharge","Chronic granulation tissue with partial epithelialisation requiring surgery","Bony deformity of the underlying phalanx"], a: 2, exp: "Heifetz Stage 3: chronic granulation tissue with partial epithelialisation at the lateral nail sulcus, persistent discharge, easy contact bleeding. PNA with phenolisation is indicated — achieving 1-4% recurrence (Eekhof et al., 2014, Cochrane)." }
    ]
  },
  {
    id: "wounds", title: "Wound Assessment and Management", icon: "🩹", color: "#784212",
    cpd: 3.5, level: "Intermediate",
    blurb: "Wound bed preparation, the TIME framework, aetiology-first classification, dressing selection evidence and escalation pathways for non-healing wounds.",
    slides: [
      {
        id: "w1", heading: "Wound Healing: Phase 1 Haemostasis",
        body: "Wound healing is a highly orchestrated biological process comprising four overlapping phases. Every therapeutic decision in wound care directly influences one or more of these phases. Understanding the biology of normal healing is essential for recognising why healing fails in chronic wounds and for making rational therapeutic decisions.\n\n**The Haemostatic Response**\n\nFollowing tissue injury, vasoconstriction occurs within seconds, reducing blood flow to the wound site. Platelet adhesion to exposed subendothelial collagen triggers platelet activation and aggregation, forming the primary platelet plug. Simultaneously, the coagulation cascade is activated through both the extrinsic pathway (tissue factor plus factor VII) and intrinsic pathway (contact activation), converging at factor X to generate thrombin.",
        quiz: null
      },
      {
        id: "w2", heading: "Wound Healing: Phase 2 Inflammation",
        body: "The inflammatory phase, typically lasting from hours after injury to day 5, is characterised by two sequential waves of cellular activity. Neutrophils are first to arrive, predominating during the first 48-72 hours, phagocytosing bacteria and debris via oxidative burst mechanisms.\n\nMonocytes arrive from day 2-5 and differentiate into wound macrophages — the central regulatory cell of wound healing. Macrophages perform phagocytosis, secrete growth factors (PDGF, VEGF, FGF), and undergo the critical M1 to M2 phenotypic polarisation shift that signals the transition from inflammation to proliferation.",
        quiz: {
          q: "Which cell type is the central regulatory cell of wound healing, arriving from day 2-5 and orchestrating the M1 to M2 transition?",
          options: ["Neutrophils", "Macrophages", "Fibroblasts", "Keratinocytes"],
          answer: 1,
          explain: "Macrophages arrive from day 2-5, following the initial neutrophil response (first 48-72 hours), and act as the central regulatory cell of wound healing. They phagocytose debris, secrete growth factors, and undergo the critical M1 to M2 polarisation shift that drives the transition from inflammation to proliferation."
        }
      },
      {
        id: "w3", heading: "Wound Healing: Phases 3 and 4",
        body: "The proliferative and remodelling phases represent the constructive stages of wound healing, during which new tissue is formed and ultimately consolidated into a functional scar. Understanding these phases underpins the rationale for wound care decisions that promote or inhibit progress.\n\n**Phase 3: Proliferation (Days 4-21)**\n\nFour simultaneous processes characterise the proliferative phase. Re-epithelialisation: keratinocytes at the wound margins and from residual hair follicle epithelium migrate across the wound surface under the influence of EGF and KGF growth factors. This process requires a moist wound environment; desiccation halts keratinocyte migration and delays re-epithelialisation, explaining the therapeutic rationale for moisture-retentive dressings.",
        quiz: null
      },
      {
        id: "w4", heading: "Wound Classification: Aetiology Determines Treatment",
        body: "The single most important principle in wound management is that aetiology must be identified and addressed before choosing treatment. A venous leg ulcer treated without compression will not heal regardless of dressing. An ischaemic ulcer compressed may progress to critical ischaemia. The dressing is always secondary to addressing the underlying cause.\n\nNeuropathic ulcers occur at plantar pressure points, surrounded by callus, typically painless due to DPN, with a warm foot and bounding pulses. Primary intervention: offloading.\n\nIschaemic ulcers occur at the foot peripheries with pale or necrotic bases and minimal granulation. Characteristically very painful with rest pain relieved by dependency. Primary intervention: revascularisation — do NOT debride dry stable eschar until perfusion is assessed.",
        quiz: null
      },
      {
        id: "w5", heading: "Pyoderma Gangrenosum and Atypical Wounds",
        body: "Several wound types encountered in podiatric practice have specific characteristics that require recognition and a modified management approach fundamentally different from standard wound care principles.\n\n**Pyoderma Gangrenosum: The Diagnosis Never to Miss**\n\nPyoderma gangrenosum (PG) is an autoinflammatory condition caused by dysregulated neutrophil activity. It presents as a rapidly expanding, exquisitely painful ulcer with characteristic undermined, bluish-purple wound margins, a necrotic or purulent base, and surrounding skin that may show a blistered or bullous component. The pathognomonic feature is pathergy: the condition is dramatically worsened by any tissue injury, including debridement.",
        quiz: null
      },
      {
        id: "w6", heading: "Wound Assessment: Ten-Point Documentation",
        body: "Thorough, systematic wound assessment and documentation enables objective monitoring of healing progress, facilitates communication between clinicians, and provides a medicolegal record. Standardised documentation ensures completeness and comparability over time.\n\n**The Ten Parameters of Wound Assessment**\n\n1. Anatomical location: precise anatomical site description and position on a validated body diagram.\n\n2. Wound dimensions: length, width, and depth measured in millimetres or centimetres using a ruler. Document any undermining (extension of the wound beneath wound margins) using a probe and clock-face notation (e.g. undermining from 9 o'clock to 12 o'clock, extending 2cm). Document sinus tract depth and direction.",
        quiz: null
      },
      {
        id: "w7", heading: "The TIME Framework: Tissue and Debridement",
        body: "The TIME framework (Tissue, Infection, Moisture, Edge), articulated by Schultz et al. (2003), is the most widely adopted wound bed preparation framework internationally. Sharp debridement is the most impactful single wound care intervention available to a podiatrist.\n\nDebridement removes the physical barrier of necrotic tissue, eliminates the substrate sustaining bacterial biofilm, removes senescent cells unresponsive to growth factors, and generates acute wound signals that restart the stalled healing cascade. In neuropathic diabetic foot ulcers, callus debridement alone reduces peak plantar pressure at the wound site by up to 30%.",
        quiz: {
          q: "Which is the single most important wound care intervention available to a trained podiatrist?",
          options: ["Application of the most advanced available dressing", "Sharp debridement of necrotic and non-viable tissue", "Prescription of appropriate systemic antibiotics", "Application of NPWT to stimulate granulation tissue"],
          answer: 1,
          explain: "Sharp debridement is the most impactful single wound care intervention available to a podiatrist. It removes necrotic tissue, eliminates biofilm substrate, removes senescent cells unresponsive to growth factors, and generates acute wound signals that can restart the stalled healing cascade. In neuropathic DFUs, callus debridement alone reduces peak plantar pressure by up to 30%. It should be performed at every clinical encounter unless specifically contraindicated."
        }
      },
      {
        id: "w8", heading: "The TIME Framework: Infection and Biofilm",
        body: "The Infection component of the TIME framework addresses the spectrum from biofilm colonisation through local infection to systemic spreading infection. Understanding the biology of wound biofilm and how to differentiate colonisation from clinical infection is essential for rational antimicrobial decision-making.\n\n**Biofilm: The Primary Infection-Related Barrier to Healing**\n\nBiofilm is present in more than 78% of chronic wounds (James et al., 2008, Wound Repair and Regeneration) compared with only 6% of acute wounds. Biofilm consists of microbial communities encased in a self-produced extracellular polymeric matrix of polysaccharides, proteins, and nucleic acids. This matrix provides mechanical protection from the immune system, prevents antibiotic penetration, and facilitates intercellular communication and gene transfer between bacteria.",
        quiz: null
      },
      {
        id: "w9", heading: "The TIME Framework: Moisture and Dressing Selection",
        body: "The Moisture component of the TIME framework concerns the management of wound exudate to maintain optimal moisture balance at the wound surface. Too much moisture causes maceration and periwound skin damage; too little delays re-epithelialisation. Rational dressing selection achieves the appropriate moisture balance for each specific wound.\n\n**The Principle of Moisture Balance**\n\nRe-epithelialisation requires a moist wound surface. Dry eschar forms a physical barrier to keratinocyte migration, forcing cells to tunnel under the eschar rather than migrating across the wound surface. This delays re-epithelialisation and produces less complete coverage. However, excessive exudate and wound maceration damage the fragile epithelium migrating from wound margins and degrade perilesional skin. The goal is maintenance of a moist wound surface without maceration.",
        quiz: null
      },
      {
        id: "w10", heading: "The TIME Framework: Wound Edge and Escalation",
        body: "Non-advancing wound edges at four weeks indicate that cellular senescence has occurred and that the wound is unlikely to progress to healing without escalation of treatment beyond standard wound bed preparation. This four-week milestone is a validated clinical decision point.\n\n**Recognising Non-Advancing Edges**\n\nNon-advancing edges are defined as wound edges that have not progressed — decreased wound area or increased epithelialisation — over a 4-week period despite appropriate wound bed preparation. Associated features include epibole (rolled or undermined wound edges), wound edges that appear raised rather than flat and adherent, hyperkeratosis at wound margins in neuropathic ulcers, and clinical history confirming the wound has been present for more than 4 weeks.",
        quiz: null
      },
      {
        id: "w11", heading: "Venous Leg Ulcers: Assessment and Compression",
        body: "Venous leg ulcers (VLUs) are the most common chronic leg ulcer type, accounting for approximately 70% of all leg ulceration. They represent a significant burden on patients, carers, and healthcare services. Accurate diagnosis and appropriate compression therapy are the foundations of effective VLU management.\n\n**Venous Physiology and Pathophysiology**\n\nThe venous system of the lower limb returns blood to the heart against gravity through a system of one-way valves. The calf muscle pump, contracting during walking, provides the driving force for venous return. Deep vein thrombosis, superficial venous incompetence, or primary valvular dysfunction leads to chronic venous hypertension: abnormally elevated pressure within the venous system during standing and walking.",
        quiz: {
          q: "Venous leg ulcers account for approximately what proportion of all chronic leg ulceration?",
          options: ["30%", "50%", "70%", "90%"],
          answer: 2,
          explain: "Venous leg ulcers account for approximately 70% of all chronic leg ulceration, making them the most common chronic leg ulcer type and underscoring why accurate diagnosis and appropriate compression therapy are central to effective leg ulcer management."
        }
      },
      {
        id: "w12", heading: "Wound Infection: Recognition and Systemic Management",
        body: "Wound infection represents a failure of the wound's host defence mechanisms to contain bacterial colonisation within manageable limits. Recognition, appropriate sampling, and evidence-based antibiotic selection are the key clinical skills required for managing infected wounds.\n\n**The Spectrum from Contamination to Systemic Infection**\n\nAll chronic wounds are contaminated (contain bacteria). Most are colonised (bacteria are present but not causing harm). Critical colonisation is when bacterial burden begins to delay healing without frank clinical infection. Local infection is when clinical signs of infection are present within the wound and immediately surrounding tissue. Spreading infection involves cellulitis extending beyond the immediate wound margins. Systemic infection involves bacteraemia with systemic inflammatory response.",
        quiz: null
      },
      {
        id: "w13", heading: "Advanced Dressings and Wound Care Technologies",
        body: "The wound care dressing market has expanded enormously over the past two decades, producing a large and sometimes bewildering range of products. Understanding the mechanism of action, appropriate indications, and evidence base for the major dressing categories enables rational selection.\n\n**The Core Principle: Match Dressing to Wound**\n\nFour wound characteristics determine appropriate dressing selection: exudate level (volume and character), wound bed status (granulating, sloughing, necrotic, epithelialising), wound dimensions (particularly depth and undermining), and infection status. The goal is to maintain a moist wound surface without maceration — dry eschar halts keratinocyte migration, while excessive exudate damages fragile perilesional skin and the migrating epithelial edge.",
        quiz: null
      },
      {
        id: "w14", heading: "Compression Therapy: Technique and Monitoring",
        body: "Compression therapy is the primary treatment for venous leg ulcers and an important adjunct in the management of chronic limb oedema. Correct application technique and monitoring are essential for both clinical effectiveness and patient safety.\n\n**ABPI Assessment Before Compression**\n\nABPI assessment is mandatory before applying any compression therapy. ABPI of 0.8 or above: full graduated compression (Class 3, 40mmHg at ankle) is safe and appropriate. ABPI 0.6-0.8: modified compression (15-25mmHg) may be applied under specialist supervision. ABPI below 0.6: compression is contraindicated. If ABPI cannot be reliably measured (heavily calcified vessels, as is common in diabetes), TBPI should be used instead.",
        quiz: {
          q: "Compression therapy is contraindicated when ABPI falls below:",
          options: ["1.0", "0.8", "0.6", "0.4"],
          answer: 2,
          explain: "ABPI below 0.6 is a contraindication to compression therapy due to significant arterial insufficiency risk. ABPI 0.8 or above permits full graduated compression (40mmHg). ABPI 0.6-0.8 allows modified compression (15-25mmHg) only under specialist supervision."
        }
      },
      {
        id: "w15", heading: "Pressure Ulcers: Classification and Prevention",
        body: "Pressure ulcers (also termed pressure injuries or decubitus ulcers) result from sustained mechanical load exceeding tissue perfusion pressure, causing ischaemic tissue necrosis. They are largely preventable and their occurrence frequently reflects inadequate preventive care. Understanding their classification and prevention is essential for all podiatrists involved in the care of immobile or high-risk patients.\n\n**EPUAP/NPUAP 2019 Classification**\n\nCategory/Stage 1: Non-blanchable erythema of intact skin. Skin is intact but shows non-blanchable erythema over a bony prominence. The area may be painful, firm, soft, warmer, or cooler than adjacent tissue. Category 1 indicates tissue injury is imminent if pressure is not relieved.",
        quiz: null
      },
      {
        id: "w16", heading: "Leg Ulcer Differential Diagnosis",
        body: "Accurate differential diagnosis of leg ulcers is essential before commencing treatment. The three most common aetiologies (venous, arterial, and neuropathic) each require fundamentally different primary treatments, and misdiagnosis leads to treatment failure or harm.\n\n**Clinical Features of Venous Leg Ulcers**\n\nLocation: medial gaiter region (above medial malleolus) in the distribution of the greatest venous hypertension. Wound characteristics: shallow, irregular, well-defined margins with sloping rather than punched-out edges; moderate to heavy exudate; granulating or sloughy base. Surrounding features: haemosiderin staining (brown pigmentation from RBC extravasation), lipodermatosclerosis (indurated, woody subcutaneous tissue), atrophie blanche (white avascular scar tissue from previous ulceration), varicose eczema, visible varicosities. Symptoms: aching and heaviness of the leg worse on standing, improved by elevation.",
        quiz: null
      },
      {
        id: "w17", heading: "Wound Outcome Measurement and Audit",
        body: "Systematic outcome measurement is essential for monitoring individual patient healing, benchmarking service performance, and contributing to the evidence base for wound care practice. Validated outcome measures allow objective assessment of treatment effectiveness and identification of non-responding patients who require escalation.\n\n**Wound Area Measurement**\n\nSimple linear measurement (length times width in centimetres squared) provides a reproducible estimate of wound area suitable for routine clinical monitoring. Planimetry using acetate tracing or digital photography with area calculation software provides more accurate wound area measurement. Volumetric measurement using wound casting materials or structured light scanning provides three-dimensional data including wound depth and is particularly relevant for deep wounds.",
        quiz: null
      },
      {
        id: "w18", heading: "Wound Care in Special Populations",
        body: "Wound care management requires modification across several special populations where standard approaches may be less effective, carry additional risks, or require specific adaptations. The podiatrist must be able to identify when standard wound care protocols need to be modified and what adaptations are appropriate.\n\n**Wound Care in Diabetes**\n\nAs detailed in the Diabetic Foot module, wound care in diabetes must always begin with offloading as the primary intervention. The monofilament assessment and vascular assessment must precede any wound care decision. Patients with DPN may not feel wound deterioration or treatment-related pain, making regular scheduled review essential rather than patient-reported symptoms as the trigger for reassessment.",
        quiz: null
      },
      {
        id: "w19", heading: "Patient Education and Self-Management in Wound Care",
        body: "Effective patient education in wound care is as important as clinical skill in achieving wound healing. Patients should understand the cause of their wound, why addressing that cause is the primary treatment, the expected healing trajectory, and danger signs requiring immediate review.\n\nPoor adherence with compression therapy is a major cause of VLU treatment failure. Common barriers include discomfort during application, difficulty applying compression independently, and misunderstanding of the mechanism of action. Systematic exploration of barriers and provision of appropriate compression aids improve adherence.\n\nDigital health tools allowing patients to photograph and upload wound images for remote assessment are increasingly used to supplement face-to-face appointments, potentially improving detection of wound deterioration between scheduled visits.",
        quiz: null
      },
      {
        id: "w20", heading: "Wound Care Evidence and Clinical Governance",
        body: "Wound care practice must be grounded in the best available evidence and delivered within a robust clinical governance framework. The rapid evolution of wound care products and technologies makes critical appraisal of evidence and systematic practice review particularly important in this specialty area.\n\n**Critical Appraisal of Wound Care Evidence**\n\nThe wound care evidence base is characterised by multiple small trials, heterogeneous patient populations, poorly defined outcome measures, and significant commercial sponsorship bias. Cochrane systematic reviews provide the highest level of evidence synthesis, though the overall quality of evidence in wound care is often rated as low or very low due to limitations of included trials.",
        quiz: null
      }
    ],
    exam: [
      { q: "Biofilm is present in what proportion of chronic wounds?", opts: ["More than 25%","More than 50%","More than 78%","More than 95%"], a: 2, exp: "James et al. (2008) found biofilm in more than 78% of chronic wounds. Biofilm bacteria are up to 1000 times more antibiotic-resistant than planktonic bacteria, making topical biofilm-active agents the appropriate primary intervention." },
      { q: "Dry stable eschar on an ischaemic limb should:", opts: ["Be debrided urgently","Be treated with larval therapy","Be left intact until arterial perfusion is restored","Be hydrated with hydrogel"], a: 2, exp: "Dry stable eschar on an ischaemic limb protects the underlying tissue. Debridement before restoring perfusion creates an open wound that cannot heal and risks rapid progression to limb-threatening infection." },
      { q: "Full graduated compression for venous leg ulcers requires an ABPI of at least:", opts: ["0.5","0.6","0.8","1.0"], a: 2, exp: "ABPI of 0.8 or above is required before applying full graduated compression (40mmHg at ankle). ABPI 0.6-0.8 allows modified compression under specialist supervision. Below 0.6 is a contraindication." },
      { q: "Pyoderma gangrenosum should NEVER be debrided because:", opts: ["The wound base is too superficial","Debridement triggers pathergy causing massive wound expansion","Debridement introduces infection","The wound edges are too fragile"], a: 1, exp: "PG causes pathergy — tissue injury triggers an autoinflammatory response and massive wound expansion. Treatment is systemic immunosuppression. Refer before debriding any rapidly expanding ulcer with undermined bluish-purple wound margins." },
      { q: "Wound tensile strength at 6 weeks is approximately:", opts: ["20% of normal skin","35%","50%","80%"], a: 2, exp: "Tensile strength reaches approximately 50% at 6 weeks and plateaus at approximately 80% — never exceeding this ceiling. This is why plantar surgical wounds can dehisce even months after apparent clinical healing." },
      { q: "The four phases of wound healing in correct sequence are:", opts: ["Haemostasis, proliferation, inflammation, remodelling","Inflammation, haemostasis, proliferation, remodelling","Haemostasis, inflammation, proliferation, remodelling","Proliferation, haemostasis, inflammation, remodelling"], a: 2, exp: "The four phases: Haemostasis (seconds to minutes); Inflammation (hours to day 5); Proliferation (days 4-21) — re-epithelialisation and granulation tissue; Remodelling (day 21 to 2 years) — collagen maturation." },
      { q: "Achievement of more than 50% wound area reduction at 4 weeks predicts:", opts: ["Complete healing at 24 weeks","Complete healing at 12 weeks","Successful response to NPWT","Adequate granulation tissue formation"], a: 1, exp: "Greater than 50% wound area reduction at 4 weeks is a validated predictor of complete healing at 12 weeks for both VLUs (Phillips et al., 2000) and diabetic foot ulcers (Sheehan et al., 2003, Diabetes Care)." },
      { q: "Venous leg ulcers are most commonly located in the medial gaiter region because:", opts: ["The medial leg has least subcutaneous fat","The greatest venous hypertension from venous incompetence affects this zone","The posterior tibial artery is most vulnerable here","Dependent oedema pools medially"], a: 1, exp: "The medial gaiter region is most affected because the greatest venous hypertension from superficial and deep venous incompetence affects the long saphenous venous distribution, causing haemosiderin deposition, lipodermatosclerosis, and ulceration." },
      { q: "NPWT is typically applied at what pressure range?", opts: ["25-50mmHg","75-125mmHg","150-200mmHg","250-350mmHg"], a: 1, exp: "NPWT is typically applied at -75 to -125mmHg. Standard: -125mmHg continuous for acute wounds; -75mmHg for chronic wounds. Lower pressures are appropriate for fragile granulation tissue or sensitive wound beds." },
      { q: "Which dressing donates moisture to rehydrate dry necrotic wound beds?", opts: ["Alginate","Silicone foam","Hydrogel","Hydrofibre"], a: 2, exp: "Hydrogel dressings (Intrasite Gel, Purilon Gel) contain approximately 80% water and donate moisture to dry wound beds, softening eschar to facilitate autolytic debridement. Contraindicated on heavily exuding wounds." }
    ]
  },
  {
    id: "biomechanics", title: "Biomechanics and Orthotics", icon: "🦿", color: "#6C3483",
    cpd: 4, level: "Advanced",
    blurb: "Gait cycle analysis, STJ triplanar mechanics, tissue stress model of orthotic prescription, tendinopathy evidence, and plantar fasciopathy management.",
    slides: [
      {
        id: "b1", heading: "Gait Cycle: Phases and Temporal-Spatial Parameters",
        body: "Gait analysis is the systematic study of human locomotion. For the podiatrist, it is both a diagnostic tool to identify biomechanical dysfunction and a clinical skill to explain why conditions develop in specific patients. Understanding normal gait parameters is the prerequisite for identifying and interpreting deviations.\n\n**The Gait Cycle Defined**\n\nThe gait cycle is defined as the period from initial contact of one foot to the next initial contact of the same foot. Stance phase occupies approximately 60% and swing phase 40% of the gait cycle. At comfortable self-selected walking speed (approximately 1.3-1.5 m/s in healthy adults), one complete cycle takes approximately 1.0-1.1 seconds.",
        quiz: null
      },
      {
        id: "b2", heading: "Stance Phase Sub-Phases",
        body: "The stance phase of gait comprises four distinct sub-phases, each with characteristic joint kinematics, muscle activation patterns, and ground reaction force (GRF) characteristics.\n\n**Loading Response (0-12%) and Midstance (12-31%)**\n\nLoading response extends from heel contact to foot flat. The GRF rises rapidly to approximately 120% of body weight. The STJ pronates to absorb impact energy, the knee flexes approximately 20 degrees eccentrically, and tibialis anterior decelerates the forefoot to the ground. During midstance, the body's centre of mass passes over the stance limb, the GRF reduces to approximately 80-90% of body weight, and the STJ progressively re-supinates under tibialis posterior eccentric control. This is the critical phase where functional equinus limitation triggers compensatory patterns.",
        quiz: null
      },
      {
        id: "b3", heading: "Swing Phase and Ground Reaction Forces",
        body: "Swing phase comprises approximately 40% of the gait cycle, from toe-off to the next initial contact. While the foot is off the ground, swing phase events determine the quality of the subsequent initial contact. Three sub-phases: initial swing (60-73%) involves rapid limb acceleration away from the ground; tibialis anterior must achieve at least 10 degrees of dorsiflexion for foot clearance — failure produces foot drop requiring steppage or circumduction gait. Mid-swing (73-87%) carries the limb forward with minimal muscular energy. Terminal swing (87-100%) positions the foot for initial contact; hamstrings decelerate knee extension eccentrically.",
        quiz: null
      },
      {
        id: "b4", heading: "Observational Gait Analysis: Lateral View",
        body: "Observational gait analysis requires a systematic viewing protocol and knowledge of normal parameters. The lateral view provides information about sagittal plane motion and is particularly important for assessing initial contact pattern and ankle dorsiflexion during midstance.\n\nGait assessment should be conducted over at least 6-10 metres, observing barefoot where possible since footwear masks pathological patterns. Heel-strike is normal initial contact; foot-flat contact suggests equinus deformity; forefoot or toe-strike suggests severe equinus or neurological pathology.\n\nThe tibia must advance progressively over the fixed foot during midstance. Premature heel rise indicates equinus limitation — the lunge test (normal 35-40mm or more) provides the clinical measure of this restriction.",
        quiz: null
      },
      {
        id: "b5", heading: "Observational Gait Analysis: Posterior and Anterior Views",
        body: "The posterior and anterior views of gait analysis assess frontal and transverse plane mechanics that are not visible from the lateral view. Together with the lateral view, they provide a comprehensive picture of lower limb mechanics during walking.\n\n**Posterior View Assessment**\n\nHelbing sign: medial bowing of the Achilles tendon indicates calcaneal eversion (STJ pronation) during stance. A key indicator of excessive and prolonged STJ pronation. Assess during both loading response and midstance. Some calcaneal eversion at initial contact is normal; abnormal is persistent or excessive eversion continuing throughout midstance.",
        quiz: null
      },
      {
        id: "b6", heading: "The Subtalar Joint: Assessment and Clinical Significance",
        body: "The subtalar joint (STJ) is the primary triplanar joint of the foot and the site of motion most frequently assessed and modified in podiatric biomechanical practice. Accurate STJ assessment informs orthotic prescription and biomechanical diagnosis.\n\n**Subtalar Joint Neutral Position**\n\nRoot et al. (1977) defined STJ neutral as the position in which the subtalar joint is neither pronated nor supinated, characterised by equal amounts of talar head palpable on the medial and lateral aspects of the navicular. While the clinical relevance of STJ neutral as a prescribing position has been questioned by the tissue stress model, its measurement remains clinically useful as a reference point for describing foot posture.",
        quiz: {
          q: "STJ pronation is correctly defined as:",
          options: ["Inversion, adduction, and plantarflexion", "Eversion, abduction, and dorsiflexion", "Eversion, adduction, and plantarflexion", "Inversion, abduction, and dorsiflexion"],
          answer: 1,
          explain: "STJ pronation is simultaneous eversion, abduction, and dorsiflexion of the calcaneus beneath the talus. This triplanar motion occurs because the STJ axis is oblique at approximately 42 degrees from horizontal and 16 degrees from the sagittal plane. STJ supination is the reverse: inversion, adduction, and plantarflexion."
        }
      },
      {
        id: "b7", heading: "Ankle Equinus: Assessment, Causes, and Management",
        body: "Ankle equinus is defined as restriction of ankle dorsiflexion below 10 degrees from neutral with the knee extended, or below 35-40mm on the lunge test. Two forms must be distinguished: gastrocnemius equinus (restriction resolves with knee flexed, isolating the two-joint gastrocnemius) and gastroc-soleus equinus (restriction persists with both positions, indicating both muscles are contractured). The lunge test, performed with the knee over the fifth toe and the heel flat, is the most reliable clinical measure.",
        quiz: null
      },
      {
        id: "b8", heading: "Orthotic Prescription: Theory and Evidence",
        body: "Foot orthoses are insole devices placed within footwear to modify the mechanical environment of the foot and lower limb. Their prescription should be systematic, evidence-based, and driven by a clear therapeutic objective grounded in the tissue stress model.\n\n**The Tissue Stress Model**\n\nMcPoil and Hunt (2014) articulated the tissue stress model of orthotic prescription: the goal is to reduce the mechanical load on the specific symptomatic tissue below its injury threshold, not to achieve a predetermined structural position. This model explains why multiple RCTs have found comparable short-term clinical outcomes between structurally corrective custom orthoses and simpler prefabricated devices: what matters is whether the load on the target tissue is reduced, not how this is achieved.",
        quiz: null
      },
      {
        id: "b9", heading: "Orthotic Prescription Variables",
        body: "Foot orthotic prescription involves selection of multiple interconnected variables, each targeting a specific aspect of foot mechanics. Understanding the biomechanical rationale for each variable enables rational prescription rather than empirical selection.\n\n**Heel Cup Height and Rearfoot Control**\n\nStandard heel cup height is 12-14mm, sufficient for basic rearfoot motion control. Raised heel cup height (18-22mm) increases containment of the heel fat pad, improving its shock absorption properties and reducing lateral heel displacement during loading. Deep heel cups are indicated for pes cavus with fat pad atrophy and calcaneal stress fractures where fat pad containment is protective.",
        quiz: {
          q: "Raised heel cup height (18-22mm) compared to standard height (12-14mm) primarily improves:",
          options: ["Forefoot pressure redistribution", "Containment of the heel fat pad and its shock absorption properties", "First MTPJ dorsiflexion range", "Lateral column stability only"],
          answer: 1,
          explain: "Raised heel cup height increases containment of the heel fat pad, improving its natural shock absorption properties and reducing lateral heel displacement during loading. Deep heel cups are particularly indicated for pes cavus with fat pad atrophy and calcaneal stress fractures."
        }
      },
      {
        id: "b10", heading: "Special Tests in Musculoskeletal Assessment",
        body: "A range of validated special tests is used in podiatric musculoskeletal assessment to assess specific structures, confirm clinical diagnoses, and guide management decisions. Understanding the sensitivity, specificity, and clinical utility of these tests is essential for evidence-based practice.\n\n**Thompson Test for Achilles Tendon Rupture**\n\nThe Thompson test (Simmonds test) is performed with the patient prone and the knee flexed to approximately 90 degrees. The calf belly is squeezed firmly. The normal response is passive plantarflexion of the foot. Absence of passive plantarflexion indicates complete Achilles tendon rupture. Sensitivity 96%, specificity 93% (Thompson, 1962). This simple, highly accurate bedside test should be performed in all cases of acute posterior ankle or lower calf pain following a sudden force injury.",
        quiz: null
      },
      {
        id: "b11", heading: "Tendinopathy: The Tendon Continuum Model",
        body: "Tendinopathy is among the most common musculoskeletal presentations in podiatric practice. Contemporary management, based on understanding tendon pathology at the tissue level, has substantially improved outcomes compared to historic approaches of rest and anti-inflammatory treatment.\n\n**The Tendon Continuum (Cook and Purdam, 2009)**\n\nCook and Purdam proposed that tendon pathology exists on a continuum of three overlapping stages. Reactive tendinopathy is an acute, non-inflammatory cellular response to unusual mechanical load. Histologically: increased proteoglycan content causing matrix swelling, disorganised collagen without fibre disruption, and metabolically active tenocytes. Clinically: short history (days to weeks), diffuse tender swollen tendon, pain clearly related to a recent load increase. This stage is potentially fully reversible with appropriate load reduction.",
        quiz: null
      },
      {
        id: "b12", heading: "Achilles Tendinopathy: Assessment and Loading Protocols",
        body: "Achilles tendinopathy is one of the most common conditions managed by podiatrists, particularly in running and court sport athletes and in middle-aged sedentary individuals. Accurate subtype classification and evidence-based loading protocols are the foundations of effective management.\n\n**Two Subtypes with Different Management Implications**\n\nMid-portion Achilles tendinopathy: located 2-6cm proximal to the calcaneal insertion, in the zone of maximum tendon curvature and lowest vascular density. The most common subtype in running athletes. Responds well to eccentric and heavy slow resistance loading protocols. Eccentric loading over a step (allowing the ankle to go into dorsiflexion during the eccentric phase) is the classic intervention and does not increase compression at the insertion.",
        quiz: null
      },
      {
        id: "b13", heading: "Heavy Slow Resistance and Exercise Dosing for Tendinopathy",
        body: "Heavy Slow Resistance (HSR) training provides equivalent outcomes to eccentric loading for mid-portion Achilles tendinopathy at 12 months with significantly higher patient satisfaction (83% vs 67%) — established by Beyer et al. (2015, AJSM).\n\nHSR uses isotonic calf raises with progressive load: weeks 1-2 at 3x15 reps, weeks 3-4 at 4x12 with increased load, weeks 5-6 at 4x10 with further increase, weeks 7+ at 4x8 with maximum tolerable load. Progressive overload must occur every 1-2 weeks for adequate mechanical stimulus.\n\nPain during exercise is acceptable up to 4-5/10 NRS, returning to baseline within 24 hours. For highly irritable tendons, isometric calf raises (5 x 45-second holds at 70% MVC) provide initial pain relief before progressing to isotonic HSR.",
        quiz: null
      },
      {
        id: "b14", heading: "Plantar Fasciopathy: Risk Factors and Diagnosis",
        body: "Plantar fasciopathy affects approximately 10% of adults over a lifetime. Contemporary histology shows predominantly degenerative rather than inflammatory changes, supporting the term plantar fasciopathy over plantar fasciitis (Lemont et al., 2003, JAPMA).\n\nRiddle et al. (2003, JBJS) identified three strongest predictors: ankle equinus (OR 23.3 — the most powerful single risk factor); elevated BMI (OR 5.6); and prolonged non-occupational weight-bearing. Intrinsic foot muscle weakness and excessive STJ pronation are additional recognised risk factors.\n\nClassic presentation: inferomedial heel pain worst on initial weight-bearing in the morning, easing with walking before worsening with prolonged activity. Maximum tenderness at the medial calcaneal tubercle. The Windlass test reproduces pain with high specificity. Ultrasound shows fascia thickening above 4.0mm.",
        quiz: null
      },
      {
        id: "b15", heading: "Plantar Fasciopathy: Evidence-Based Management",
        body: "The management of plantar fasciopathy has a substantial evidence base that allows a clear, evidence-graded treatment pathway to be implemented in clinical practice. Understanding the evidence underpinning each intervention enables rational, stepwise management.\n\n**First-Line Management: Strong Evidence**\n\nGastrocnemius stretching: three times daily, 3 sets of 30-60 seconds, knee extended, through the full dorsiflexion range. Plantar fascia-specific stretching (DiGiovanni technique): 10 passive toe extensions held for 10 seconds each, performed as the first activity before initial weight-bearing in the morning. RCT by DiGiovanni et al. (2003, JBJS) demonstrated plantar fascia-specific stretching superior to gastrocnemius stretching alone at 8 weeks in patients with chronic plantar fasciopathy.",
        quiz: {
          q: "Ankle equinus is the strongest single structural risk factor for plantar fasciopathy. What odds ratio was established by Riddle et al. (2003)?",
          options: ["4.5", "9.0", "23.3", "45.0"],
          answer: 2,
          explain: "Riddle et al. (2003, JBJS) established an OR of 23.3 for ankle equinus (lunge test below 35mm) as a risk factor for plantar fasciopathy - the strongest single structural risk factor, far exceeding elevated BMI (OR 5.6). Assessment and management of ankle equinus is therefore the primary structural intervention in plantar fasciopathy management."
        }
      },
      {
        id: "b16", heading: "Patellofemoral Pain Syndrome and Lower Limb Biomechanics",
        body: "Patellofemoral pain syndrome (PFPS) is among the most common lower limb conditions in active individuals and is frequently associated with foot biomechanical factors that lie within the podiatrist's scope of practice. Understanding the closed kinetic chain origin of PFPS enables effective podiatric contribution to its management.\n\n**Closed Kinetic Chain Biomechanics of PFPS**\n\nThe patellofemoral joint transmits forces between the quadriceps, the patellar tendon, and the underlying trochlear groove of the femur. Patellofemoral joint reaction force (PFJRF) is the resultant of the quadriceps force and patellar tendon force acting on the patella. PFJRF peaks during activities requiring significant knee flexion under load (stair climbing, running, squatting) and is transmitted to the articular cartilage of the patellofemoral joint.",
        quiz: null
      },
      {
        id: "b17", heading: "Medial Tibial Stress Syndrome and Stress Fractures",
        body: "Medial tibial stress syndrome (MTSS) and lower limb stress fractures are common presentations in running athletes and active military personnel. Both are associated with biomechanical risk factors within the podiatrist's assessment competency and respond to interventions including foot orthoses and gait retraining.\n\n**Medial Tibial Stress Syndrome**\n\nMTSS (formerly called shin splints) presents as diffuse medial tibial pain along the distal two-thirds of the medial tibial border, occurring during and after exercise and tender along a relatively broad area of the posteromedial tibial cortex. It is distinguished from tibial stress fracture by its diffuse rather than focal tenderness and by negative MRI changes in the stress fracture pattern.",
        quiz: null
      },
      {
        id: "b18", heading: "Adult-Acquired Flatfoot Deformity",
        body: "Adult-acquired flatfoot deformity (AAFD), most commonly caused by tibialis posterior tendon dysfunction (PTTD), represents a progressive structural deformity affecting function, footwear fit, and quality of life. Its timely recognition and appropriate management can prevent progression to irreversible deformity requiring surgical intervention.\n\n**Tibialis Posterior Tendon Anatomy and Function**\n\nTibialis posterior is the primary dynamic stabiliser of the medial longitudinal arch. It originates in the deep posterior compartment of the lower leg and its tendon passes posterior to the medial malleolus within its own synovial sheath before inserting primarily at the navicular medial tuberosity with secondary insertions to the cuneiforms, cuboid, and metatarsal bases. Its eccentric contraction during midstance decelerates STJ pronation and prevents excessive arch lowering.",
        quiz: {
          q: "Adult-acquired flatfoot deformity (AAFD) is most commonly caused by dysfunction of which tendon?",
          options: ["Peroneus longus", "Tibialis anterior", "Tibialis posterior", "Flexor hallucis longus"],
          answer: 2,
          explain: "AAFD is most commonly caused by tibialis posterior tendon dysfunction (PTTD). Tibialis posterior is the primary dynamic stabiliser of the medial longitudinal arch, and its progressive dysfunction produces the staged spectrum of AAFD from tenosynovitis through to rigid deformity."
        }
      },
      {
        id: "b19", heading: "Biomechanics of Common Running Injuries",
        body: "Running injuries are among the most frequent presentations in active podiatric patients. Iliotibial band syndrome presents as lateral knee pain developing at a consistent distance into a run, as the IT band compresses against the lateral femoral epicondyle at approximately 30 degrees of knee flexion — the impingement angle during loading response.\n\nBiomechanical risk factors for ITBS include hip abductor weakness and increased contralateral pelvic drop. Gait retraining to increase step rate by 5-10% reduces knee flexion angle at foot strike and has the strongest evidence base alongside hip abductor strengthening.",
        quiz: null
      },
      {
        id: "b20", heading: "Clinical Biomechanics: Synthesis and Evidence-Based Practice",
        body: "The final slide of the Biomechanics and Orthotics module synthesises the key evidence-based principles of biomechanical assessment and treatment, enabling the clinician to apply a coherent, rational framework to the wide range of biomechanical presentations encountered in podiatric practice.\n\n**From Assessment to Diagnosis**\n\nSystematic biomechanical assessment moves from symptom location to structural assessment to dynamic assessment: where is the pain and which tissue is likely causing it? What structural factors (equinus, hyperpronation, hallux rigidus, leg length discrepancy) are loading that tissue excessively? How does the patient's gait confirm or contradict the structural findings? What is the tissue stress, and which intervention will reduce it below the injury threshold?",
        quiz: {
          q: "ESWT for chronic plantar fasciopathy (beyond 3 months) achieves approximately what proportion of good or excellent outcomes in pooled RCT evidence?",
          options: ["20-30%", "40-50%", "60-80%", "More than 90%"],
          answer: 2,
          explain: "Rompe et al. (2010, AJSM) demonstrated 60-80% good or excellent outcomes with ESWT in pooled RCT evidence for chronic plantar fasciopathy. ESWT is the intervention with the strongest evidence base for plantar fasciopathy refractory to conservative management including stretching, orthoses, and strengthening."
        }
      }
    ],
    exam: [
      { q: "Stance phase of the gait cycle occupies approximately:", opts: ["40%","50%","60%","70%"], a: 2, exp: "Stance phase occupies approximately 60% of the gait cycle; swing phase 40%. At comfortable walking speed one complete gait cycle takes approximately 1.0-1.1 seconds." },
      { q: "The tissue stress model of orthotic prescription aims to:", opts: ["Achieve STJ neutral","Maximise rearfoot control","Reduce load on the specific symptomatic tissue below its injury threshold","Correct all structural deformities"], a: 2, exp: "McPoil and Hunt (2014) articulated the goal as reducing load on the specific symptomatic tissue below its injury threshold — not achieving a structural position. This explains comparable outcomes between custom and prefabricated orthoses in RCTs." },
      { q: "Thompson test for complete Achilles tendon rupture has a sensitivity of:", opts: ["72%","85%","96%","99%"], a: 2, exp: "Thompson test (prone calf squeeze, absence of passive plantarflexion = complete rupture) has sensitivity 96% and specificity 93% — the gold-standard bedside test for complete Achilles tendon rupture." },
      { q: "The Alfredson eccentric loading protocol is:", opts: ["3 sets of 10 reps once daily for 6 weeks","3 sets of 15 reps twice daily for 12 weeks","5 sets of 20 reps daily for 8 weeks","2 sets of 20 reps three times weekly"], a: 1, exp: "Alfredson et al. (1998, AJSM): 3 sets of 15 repetitions twice daily for 12 weeks, both straight-leg and bent-knee. The original cohort achieved 89% return to pre-injury training." },
      { q: "ESWT for chronic plantar fasciopathy achieves approximately:", opts: ["20-30% good outcomes","40-50%","60-80%","More than 90%"], a: 2, exp: "Rompe et al. (2010, AJSM) demonstrated 60-80% good or excellent outcomes with ESWT — the intervention with the strongest evidence base for plantar fasciopathy refractory to conservative management." },
      { q: "The Foot Posture Index (FPI-6) scores from:", opts: ["0 to 12","−12 (highly supinated) to +12 (highly pronated)","−5 to +5","0 to 24"], a: 1, exp: "The FPI-6 scores from -12 (highly supinated) to +12 (highly pronated). Scores of +5 to +7 are associated with increased medial arch loading and tibialis posterior tendon stress." },
      { q: "AAFD (tibialis posterior dysfunction) Stage 2 is characterised by:", opts: ["Tenosynovitis with no deformity","Tendon elongation or rupture with flexible flatfoot deformity","Rigid flatfoot with subtalar arthritis","Stage 3 deformity plus ankle valgus"], a: 1, exp: "AAFD Stage 2 (Johnson and Strom): tibialis posterior tendon elongation or rupture with progressive flexible flatfoot deformity — medial arch collapse, hindfoot valgus, forefoot abduction. Custom functional orthoses with significant medial arch support are the primary conservative treatment." },
      { q: "Iliotibial band syndrome (ITBS) occurs at approximately what knee flexion angle?", opts: ["10 degrees","30 degrees","60 degrees","90 degrees"], a: 1, exp: "The IT band compresses at approximately 30 degrees of knee flexion — the impingement angle during loading response when ground reaction forces are highest. This explains why downhill running dramatically exacerbates ITBS." },
      { q: "Increasing running cadence by 5-10% reduces injury risk primarily by:", opts: ["Increasing stride length","Reducing knee flexion angle at foot strike and lowering GRF impulse","Activating gluteus medius more effectively","Improving tibialis anterior eccentric strength"], a: 1, exp: "Increasing cadence by 5-10% while maintaining speed reduces stride length, reducing knee flexion angle at foot strike and lowering ground reaction force impulse — providing evidence-based benefit for MTSS, ITBS, and patellofemoral pain syndrome." },
      { q: "The VISA-A questionnaire is a validated outcome measure for:", opts: ["Plantar fasciopathy","Achilles tendinopathy","Peroneal tendon pathology","Ankle instability"], a: 1, exp: "The VISA-A (Victorian Institute of Sport Assessment - Achilles) scores 0-100 (100 = asymptomatic athlete) and is the recommended validated outcome measure for Achilles tendinopathy research and clinical audit." }
    ]
  },
  {
    id: "paediatric", title: "Paediatric Podiatry", icon: "👶", color: "#0E7C7B",
    cpd: 3.5, level: "Foundation",
    blurb: "Normal foot development, in-toeing patterns, apophysitis conditions, congenital deformities, and red flags across infancy to adolescence.",
    slides: [
      {
        id: "p1", heading: "Normal Foot Development",
        body: "At birth, the foot is predominantly cartilaginous. The calcaneus and talus are ossified at birth; other tarsal bones ossify at predictable ages — cuboid at birth, cuneiforms at 1-2 years, navicular at approximately 3 years.\n\nThe neonatal foot appears flat due to a prominent plantar fat pad, generalised ligamentous laxity, and low calcaneal inclination (4-6 degrees versus the adult 18-22 degrees). The medial longitudinal arch develops progressively between ages 2-8 years as ligamentous laxity reduces and gait matures.\n\nParents commonly present concerned about apparent flatfoot in toddlers — this is almost always a normal developmental stage, not pathology. Reassurance and education about the normal developmental timeline form the basis of most paediatric podiatry consultations in this age group.",
        quiz: null
      },
      {
        id: "p2", heading: "In-Toeing: Metatarsus Adductus",
        body: "In-toeing has three causes presenting in developmental sequence by age, each requiring different assessment and management.\n\nMetatarsus adductus (birth to 2 years) involves medial deviation of the forefoot relative to the rearfoot, producing a C-shaped lateral border. It is the most common congenital foot deformity, affecting approximately 1 in 1000 live births, with a higher incidence in firstborn children (intrauterine positioning).\n\nSpontaneous resolution occurs in 85-90% of cases by age 4. Mild to moderate flexible cases require only parental reassurance and passive stretching. Severe or rigid cases persisting beyond age 4, or those that cannot be passively corrected to neutral, warrant serial casting using the Ponseti technique.",
        quiz: {
          q: "What proportion of metatarsus adductus cases resolve spontaneously by age 4?",
          options: ["50-60%", "65-75%", "85-90%", "95-100%"],
          answer: 2,
          explain: "85-90% of metatarsus adductus cases resolve spontaneously by age 4. Mild to moderate flexible cases require only parental reassurance and passive stretching exercises; serial casting is reserved for severe or rigid presentations persisting beyond this age."
        }
      },
      {
        id: "p3", heading: "In-Toeing: Tibial Torsion and Femoral Anteversion",
        body: "Internal tibial torsion (ages 1-3) is the most common cause of in-toeing in toddlers, resulting from persistence of the normal internal tibial rotation present at birth. It resolves spontaneously in more than 95% of cases by age 8 as the tibia externally rotates during normal growth.\n\nShoe modifications, twister cables, and night splints have no evidence base for accelerating resolution (Staheli, 2004) — parental reassurance is the only evidence-based management. Surgical derotational osteotomy is reserved for severe persistent cases beyond age 8-10 with significant functional impairment.\n\nFemoral anteversion (ages 3-8) presents with squinting patellae and in-toeing, often with compensatory foot pronation. Approximately 80% resolve spontaneously by adolescence. Derotational osteotomy is reserved for severe persistent cases (more than 3 standard deviations from normal, age above 8, significant functional impairment).",
        quiz: null
      },
      {
        id: "p4", heading: "Flexible Flatfoot and the Jack Test",
        body: "Flexible flatfoot is the most common parental concern presenting to paediatric podiatry. The defining clinical test is the Jack (windlass) test: the arch must reconstitute when the child stands on tiptoe or when the hallux is passively dorsiflexed — confirming the deformity is flexible rather than structural.\n\nAn asymptomatic child with flexible flatfoot, normal activity levels, and no pain requires no intervention beyond reassurance. There is no good evidence that orthoses prevent progression to symptomatic flatfoot in asymptomatic children, though they may provide symptomatic relief if pain or fatigue is present.\n\nTarsal coalition presents very differently: a painful RIGID flatfoot, typically presenting at ages 8-16 years, corresponding to the period of coalition ossification. Calcaneonavicular coalition is best visualised on oblique foot radiograph; talocalcaneal coalition requires CT or MRI for diagnosis. Any rigid flatfoot in this age range warrants imaging.",
        quiz: {
          q: "The Jack (windlass) test for flexible flatfoot is positive when:",
          options: ["The arch fails to reconstitute on tiptoe standing", "The arch reconstitutes when the hallux is passively dorsiflexed or on tiptoe standing", "The child reports pain on weight-bearing", "The calcaneus fails to invert on heel rise"],
          answer: 1,
          explain: "A positive Jack test — arch reconstitution on tiptoe standing or passive hallux dorsiflexion — confirms the flatfoot is flexible rather than structural, activating the windlass mechanism to demonstrate the arch is mechanically intact. This distinguishes benign flexible flatfoot from pathological rigid flatfoot requiring further investigation."
        }
      },
      {
        id: "p5", heading: "Severs Disease (Calcaneal Apophysitis)",
        body: "Severs disease is the most common cause of heel pain in children aged 8-15 years, caused by traction apophysitis at the calcaneal growth plate. The calcaneal apophysis ossifies at approximately age 7-8 and fuses at 12-15 years.\n\nDuring rapid growth spurts, the calcaneus lengthens faster than the Achilles tendon and plantar fascia, applying traction forces to the relatively weak unfused apophysis. Bilateral presentation occurs in approximately 60% of cases. Pain is typically activity-related, worse with running and jumping sports, and relieved by rest.\n\nManagement: relative activity modification (not complete cessation), heel raises (6-10mm) in both shoes to reduce Achilles traction, calf stretching, padded heel cups, and ice after activity. Prognosis is universally excellent — resolution is guaranteed on apophyseal fusion, and parents should be clearly reassured of this.",
        quiz: null
      },
      {
        id: "p6", heading: "Kohler Disease and Osgood-Schlatter",
        body: "Kohler disease is avascular necrosis of the tarsal navicular, occurring in children aged 3-7 years (peak age 4-6), more common in boys (ratio approximately 4:1 to 6:1). It presents with a limp, midfoot pain and swelling, and tenderness over the navicular.\n\nRadiographs show navicular sclerosis and flattening. Despite the alarming radiographic appearance, prognosis is universally excellent — complete navicular reconstitution occurs within 2-4 years regardless of treatment. Management is symptomatic: activity modification, supportive footwear, and occasionally short-term immobilisation for severe pain.\n\nOsgood-Schlatter disease, while primarily affecting the knee, is biomechanically relevant: traction apophysitis at the tibial tuberosity from the patellar tendon, common in active adolescents aged 10-15. Like Severs disease, it represents traction apophysitis during rapid growth and resolves with apophyseal fusion, managed with activity modification and quadriceps stretching.",
        quiz: null
      },
      {
        id: "p7", heading: "Verruca Pedis in Children",
        body: "Verruca pedis (plantar warts) are caused by human papillomavirus (HPV) types 1, 2, and 4, with a prevalence in school-age children of approximately 15-20% — substantially higher than in adults due to communal changing room and swimming pool exposure plus developing immune responses.\n\nThe single most important clinical fact for paediatric practice: 65-78% of verrucae resolve spontaneously within 2 years in children without any treatment, reflecting the developing immune system's eventual clearance of HPV. This high spontaneous resolution rate strongly informs management decisions — aggressive treatment is often difficult to justify in young, asymptomatic children.\n\nFirst-line treatment when intervention is desired: salicylic acid 15-50% applied daily after soaking and gentle filing. Cryotherapy is effective but often poorly tolerated by younger children due to pain; RCT evidence shows comparable long-term clearance rates to salicylic acid (Cockayne et al., 2011, BMJ) without the pain disadvantage.",
        quiz: {
          q: "What proportion of verrucae resolve spontaneously within 2 years in children?",
          options: ["25-35%", "45-55%", "65-78%", "85-95%"],
          answer: 2,
          explain: "65-78% of paediatric verrucae resolve spontaneously within 2 years without any treatment, reflecting the developing immune system's eventual HPV clearance. This high spontaneous resolution rate means aggressive or painful treatments are often difficult to justify in young, asymptomatic children, supporting a watch-and-wait approach in many cases."
        }
      },
      {
        id: "p8", heading: "Paediatric Ingrown Toenails",
        body: "Onychocryptosis is common in children and adolescents, frequently associated with rapid foot growth increasing nail plate width relative to lateral nail fold capacity, and the transition to adult footwear styles during the teenage years.\n\nManagement principles mirror adult practice: accurate Heifetz staging, conservative management (cotton wool or gutter splinting) for Stage 1, and surgical management for Stage 3 or conservative treatment failure. The digital ring block technique requires modification in children: smaller anaesthetic volumes (0.5ml per side typically sufficient), smaller gauge needles (27G), and frequently topical anaesthetic cream applied 30-60 minutes before injection to reduce procedure-related distress.\n\nCongenital ingrown toenails in neonates, particularly affecting the great toe, occur due to relatively large soft tissue volume around the neonatal digit compared with nail plate width. Most resolve spontaneously as nail and digit proportions normalise with growth; gentle lateral nail fold compression techniques manage symptomatic cases without surgery.",
        quiz: null
      },
      {
        id: "p9", heading: "Juvenile Idiopathic Arthritis and the Foot",
        body: "Juvenile idiopathic arthritis (JIA) commonly affects the foot and ankle, with the subtalar and midtarsal joints frequently involved early in the disease course — sometimes before knee or hand involvement becomes apparent, making podiatric assessment clinically important for early diagnosis.\n\nClinical features include morning stiffness lasting more than 30 minutes, joint swelling, and a limp that may be the presenting complaint rather than overt pain (children frequently under-report joint pain). Tenosynovitis, particularly of tibialis posterior, is common and can mimic mechanical flatfoot if not specifically examined for synovial swelling along the tendon sheath.\n\nPodiatric management focuses on accommodative orthoses to reduce pain and protect deformed joints, appropriate footwear with adequate depth for swollen joints, and close liaison with the paediatric rheumatology team. Any child presenting with unexplained foot pain, swelling, or limp lasting more than 6 weeks should be considered for rheumatological referral to exclude JIA.",
        quiz: null
      },
      {
        id: "p10", heading: "Cerebral Palsy: Foot and Ankle Management",
        body: "Cerebral palsy (CP) produces characteristic foot and ankle deformities resulting from spasticity, muscle imbalance, and abnormal growth patterns. Equinus deformity from gastrocnemius-soleus spasticity is the most common presentation, producing toe-walking gait.\n\nEquinovarus deformity (combined equinus and hindfoot varus) is common in hemiplegic and some diplegic patterns, while planovalgus deformity (flatfoot with hindfoot valgus) is more common in diplegic and quadriplegic patterns due to different patterns of spasticity and weight-bearing.\n\nManagement is multidisciplinary: ankle-foot orthoses (AFOs) to control equinus and provide stability during gait; botulinum toxin injections to gastrocnemius-soleus to temporarily reduce spasticity and improve range of motion; serial casting for fixed contractures; and surgical intervention (tendon lengthening, tendon transfer) for fixed deformities unresponsive to conservative management. Gait analysis is valuable for surgical planning in complex presentations.",
        quiz: null
      },
      {
        id: "p11", heading: "Talipes Equinovarus (Clubfoot)",
        body: "Congenital talipes equinovarus (clubfoot) affects approximately 1 in 1000 live births, with bilateral involvement in 50% of cases and a male predominance (2:1). The deformity comprises four components: hindfoot equinus, hindfoot varus, midfoot cavus, and forefoot adduction — remembered by the mnemonic CAVE.\n\nThe Ponseti method is the gold-standard treatment, achieving excellent outcomes in more than 90% of cases without extensive surgery. Serial manipulation and casting begins shortly after birth, correcting cavus first, then adduction and varus together, with equinus corrected last (often requiring percutaneous Achilles tenotomy).\n\nFollowing correction, a foot abduction brace (Denis Browne bar) must be worn 23 hours daily for 3 months, then during sleep and naps until age 4-5 years. Relapse occurs in up to 30% of cases, predominantly related to brace non-compliance — making family education about the critical importance of bracing adherence essential to long-term success.",
        quiz: null
      },
      {
        id: "p12", heading: "Sport-Related Injuries in Children",
        body: "Children are not simply small adults biomechanically: open growth plates create unique injury patterns not seen in mature skeletons. Salter-Harris fractures (growth plate fractures) require specific recognition as they carry risk of growth arrest if missed or inadequately managed.\n\nApophysitis conditions — Severs disease (calcaneal), Sinding-Larsen-Johansson (inferior patella), and Osgood-Schlatter (tibial tuberosity) — are unique to the growing skeleton and represent traction injury at growth plates rather than tendon pathology, requiring different management emphasis (activity modification rather than progressive loading protocols used in adult tendinopathy).\n\nOveruse injuries are increasingly common with early sport specialisation. Risk factors include rapid growth spurts (reducing flexibility relative to bone length), training volume increases, and inadequate recovery. The growing consensus recommendation is to limit single-sport specialisation before adolescence and ensure adequate rest days, as repetitive loading on immature growth plates carries different injury mechanisms than in adults.",
        quiz: null
      },
      {
        id: "p13", heading: "Footwear for Children",
        body: "Appropriate children's footwear selection differs substantially from adult principles due to rapid foot growth and developing biomechanics. Children's feet grow rapidly — approximately one shoe size every 3-4 months in toddlers, slowing to every 6 months by school age.\n\nKey footwear principles: adequate length (10-12mm growth room beyond the longest toe, reassessed every 8-10 weeks in young children); appropriate width to avoid lateral compression; flexible sole material allowing natural foot motion during development (rigid soles may impair normal foot muscle development); secure fastening (laces or velcro straps preferred over slip-on styles) to prevent the foot sliding forward and causing toe trauma.\n\nBarefoot or minimal footwear time, where safe and practical, is increasingly supported by evidence for promoting normal intrinsic foot muscle development and proprioception in young children. There is no good evidence supporting expensive \"corrective\" infant shoes or rigid ankle support for normal developing feet — these may in fact impair rather than support natural development.",
        quiz: null
      },
      {
        id: "p14", heading: "Idiopathic Toe Walking",
        body: "Idiopathic toe walking is a diagnosis of exclusion, made after ruling out neurological causes (cerebral palsy, muscular dystrophy), structural causes (congenital short tendo Achilles, tarsal coalition), and sensory processing causes (autism spectrum disorder, sensory processing difficulties).\n\nClinical assessment must include full neurological examination (tone, reflexes, gait pattern), assessment of passive ankle dorsiflexion range, and developmental history. Persistent toe walking beyond age 3, particularly if associated with reduced ankle dorsiflexion range or asymmetry, warrants further investigation rather than reassurance alone.\n\nManagement of confirmed idiopathic toe walking is graduated: observation alone for mild, flexible presentations in young children; stretching programmes and night splints for moderate presentations with reduced but present heel-strike capability; serial casting for fixed equinus contracture; and surgical Achilles lengthening reserved for severe, fixed cases unresponsive to conservative management, typically considered after age 5-6.",
        quiz: null
      },
      {
        id: "p15", heading: "Paediatric Gait Development",
        body: "Gait develops through predictable maturational stages. Independent walking typically begins between 9-18 months, initially with a wide base of support, high guard arm position, and absence of reciprocal arm swing — features that are entirely normal in early walking and should not be misinterpreted as pathological.\n\nMature gait pattern — heel-strike initial contact, reciprocal arm swing, normalised base of support, and adult-like temporal-spatial parameters — typically develops by age 3-4 years. Persistent immature gait patterns (toe-walking, absent heel strike, persistently wide base) beyond age 3-4 warrant assessment.\n\nIn-toeing and out-toeing patterns evolve through childhood as described in earlier slides (metatarsus adductus, tibial torsion, femoral anteversion each peak at different ages and largely self-resolve). Understanding this normal developmental sequence allows the podiatrist to confidently distinguish normal developmental variation from pathology requiring intervention, which is the cornerstone of paediatric podiatric assessment.",
        quiz: null
      },
      {
        id: "p16", heading: "Paediatric Nail Conditions",
        body: "Several nail conditions present distinctly in the paediatric population. Nail biting (onychophagia) is extremely common in children and adolescents, producing short, irregular nail plates with damaged margins and periungual skin excoriation, predisposing to acute paronychia from oral bacterial flora contamination.\n\nDistal nail embedding in infants occurs due to the relatively large soft tissue volume around the neonatal digit compared with nail plate width, most commonly affecting the great toe. Most cases resolve spontaneously as proportions normalise with growth; gentle lateral nail fold compression techniques manage symptomatic presentations.\n\nCongenital nail dystrophies, while rare, should be recognised: congenital malalignment of the great toenail (lateral deviation of the nail growth axis, sometimes requiring surgical realignment in severe cases) and various genodermatoses affecting nail formation. Persistent or progressive nail abnormality in infants warrants dermatological assessment to exclude underlying syndromic conditions.",
        quiz: null
      },
      {
        id: "p17", heading: "Skin Conditions in Paediatric Podiatry",
        body: "Atopic eczema commonly affects the feet in children with broader atopic disease, presenting with dry, erythematous, sometimes vesicular skin particularly in web spaces and the dorsum of the foot. Management follows standard eczema principles: emollients, topical corticosteroids for flares, and identification of irritant or contact triggers (synthetic footwear materials are common culprits).\n\nJuvenile plantar dermatosis presents with a shiny, cracked, erythematous appearance affecting the weight-bearing plantar forefoot and toe pulps, typically in atopic children aged 3-14. It results from a combination of occlusive footwear, friction, and moisture cycling, often worsening in summer with synthetic trainers. Management: breathable footwear, cotton socks, and emollients; it typically resolves by adolescence.\n\nTinea pedis is less common in pre-pubertal children than adults but increases through adolescence with communal changing room exposure. Presentation and management follow adult principles, though griseofulvin rather than terbinafine is sometimes preferred for paediatric dermatophyte infections requiring systemic treatment due to a longer paediatric safety record.",
        quiz: null
      },
      {
        id: "p18", heading: "Hypermobility and the Paediatric Foot",
        body: "Generalised joint hypermobility (GJH) is common in children, assessed using the Beighton score (9-point scale; score of 6 or above in children indicates hypermobility, with different age and sex-adjusted thresholds than adults). GJH is frequently associated with flexible flatfoot, increased navicular drop, and reduced proprioceptive accuracy.\n\nHypermobile Ehlers-Danlos syndrome and other hypermobility spectrum disorders should be considered in children with marked hypermobility, recurrent joint pain, easy bruising, or a family history of connective tissue disorders, warranting wider clinical assessment beyond the foot alone.\n\nManagement of symptomatic hypermobility-related foot pain includes supportive footwear with adequate structure, orthoses to reduce excessive joint motion at symptomatic sites, and graduated proprioceptive and strengthening exercise programmes. Most hypermobile children remain asymptomatic and require no intervention; management is reserved for those with pain, recurrent injury, or functional limitation.",
        quiz: null
      },
      {
        id: "p19", heading: "Communicating with Children and Families",
        body: "Effective paediatric podiatric practice requires communication skills distinct from adult practice. Explanations should be pitched to the child's developmental level — using concrete, simple language and, where appropriate, play-based or demonstration techniques rather than abstract clinical explanation.\n\nBuilding trust before any hands-on examination reduces anxiety and improves cooperation: allowing the child to handle equipment, demonstrating procedures on a parent or toy first, and giving the child appropriate choices within the consultation (which foot to examine first) all support engagement.\n\nParental anxiety frequently exceeds clinical severity, particularly regarding normal developmental variations (flexible flatfoot, in-toeing) that resolve without intervention. Clear, confident explanation of normal developmental physiology, with reference to expected resolution timelines, is often the single most valuable therapeutic intervention — reducing parental anxiety and preventing unnecessary treatment of self-limiting conditions.",
        quiz: null
      },
      {
        id: "p20", heading: "Red Flags in Paediatric Podiatry",
        body: "Certain presentations in paediatric podiatric practice warrant urgent escalation rather than routine management, and recognising these red flags is an essential safety competency.\n\nAsymmetric findings (unilateral flatfoot, unilateral leg length discrepancy, unilateral limp) are more concerning than symmetric presentations, as normal developmental variation is typically bilateral. Unilateral rigid flatfoot suggests tarsal coalition; unilateral limp with pain warrants assessment for infection (septic arthritis, osteomyelitis), malignancy, or inflammatory arthropathy.\n\nNight pain, systemic symptoms (fever, weight loss, malaise), or pain disproportionate to clinical findings should prompt urgent referral to exclude malignancy (osteosarcoma, Ewing sarcoma, leukaemia can present with limb pain) or infection. A limping child who refuses to weight-bear, particularly with fever, requires same-day medical assessment to exclude septic arthritis — a true paediatric orthopaedic emergency. Any child failing to meet expected gait milestones, or with progressive rather than static deformity, warrants paediatric orthopaedic referral rather than ongoing podiatric monitoring alone.",
        quiz: {
          q: "A limping child who refuses to weight-bear, with associated fever, requires:",
          options: ["Routine podiatric review within 2 weeks", "Reassurance \u2014 this is a common self-limiting presentation", "Same-day medical assessment to exclude septic arthritis", "An X-ray only, with review in one week"],
          answer: 2,
          explain: "A limping child who refuses to weight-bear with fever requires same-day medical assessment to exclude septic arthritis — a true paediatric orthopaedic emergency that can rapidly destroy a joint if treatment is delayed. This red flag presentation should never be managed with routine podiatric review alone."
        }
      }
    ],
    exam: [
      { q: "What proportion of metatarsus adductus cases resolve spontaneously by age 4?", opts: ["50-60%", "65-75%", "85-90%", "95-100%"], a: 2, exp: "85-90% of metatarsus adductus cases resolve spontaneously by age 4. Mild flexible cases require only reassurance and passive stretching; serial casting is reserved for severe or rigid presentations persisting beyond this age." },
      { q: "Internal tibial torsion resolves spontaneously in what proportion of cases by age 8?", opts: ["70%", "80%", "More than 95%", "100%"], a: 2, exp: "Internal tibial torsion resolves spontaneously in more than 95% of cases by age 8. Shoe modifications and twister cables have no evidence base (Staheli, 2004) — parental reassurance is the only evidence-based management." },
      { q: "The Jack (windlass) test confirms flexible flatfoot when:", opts: ["The arch fails to reconstitute on tiptoe", "The arch reconstitutes on tiptoe standing or hallux dorsiflexion", "Pain is present on weight-bearing", "The calcaneus inverts excessively"], a: 1, exp: "A positive Jack test — arch reconstitution on tiptoe or passive hallux dorsiflexion — confirms the deformity is flexible rather than structural, activating the windlass mechanism to demonstrate the arch is mechanically intact." },
      { q: "Severs disease (calcaneal apophysitis) has what prognosis?", opts: ["Variable, 40% develop chronic pain", "Good, 75% resolve within 6 months", "Universally excellent, resolution guaranteed on apophyseal fusion", "Poor, most require surgery"], a: 2, exp: "Severs disease has a universally excellent prognosis. Resolution is guaranteed when the calcaneal apophysis fuses to the calcaneal body (typically by age 15), making reassurance about this guaranteed timeline a key part of management." },
      { q: "What proportion of paediatric verrucae resolve spontaneously within 2 years?", opts: ["25-35%", "45-55%", "65-78%", "85-95%"], a: 2, exp: "65-78% of paediatric verrucae resolve spontaneously within 2 years without treatment, reflecting developing immune clearance of HPV. This strongly informs the case for watchful waiting in young, asymptomatic children." },
      { q: "Tarsal coalition typically presents as a painful rigid flatfoot at what age range?", opts: ["2-5 years", "5-8 years", "8-16 years", "16-25 years"], a: 2, exp: "Tarsal coalition typically presents between ages 8-16 years, corresponding to the period of coalition ossification. This contrasts with flexible flatfoot, which is a normal developmental variant at younger ages and is not painful." },
      { q: "The Ponseti method for talipes equinovarus achieves excellent outcomes without extensive surgery in what proportion of cases?", opts: ["50%", "70%", "More than 90%", "100%"], a: 2, exp: "The Ponseti method achieves excellent outcomes in more than 90% of cases without extensive surgery. Brace non-compliance after correction is the predominant cause of the up to 30% relapse rate, making family education essential." },
      { q: "A limping child who refuses to weight-bear with associated fever requires:", opts: ["Routine review within 2 weeks", "Reassurance as a self-limiting presentation", "Same-day medical assessment to exclude septic arthritis", "X-ray only with review in one week"], a: 2, exp: "This presentation requires same-day medical assessment to exclude septic arthritis — a true paediatric orthopaedic emergency that can rapidly destroy a joint if treatment is delayed." },
      { q: "Kohler disease (navicular avascular necrosis) prognosis is:", opts: ["Poor, requiring surgical reconstruction", "Universally excellent, complete reconstitution within 2-4 years", "Variable depending on age at presentation", "Guarded, with risk of permanent deformity"], a: 1, exp: "Despite alarming radiographic appearance, Kohler disease has a universally excellent prognosis with complete navicular reconstitution within 2-4 years regardless of treatment. Management is symptomatic only." },
      { q: "The CAVE mnemonic for congenital talipes equinovarus components stands for:", opts: ["Cavus, Adduction, Varus, Equinus", "Calcaneus, Ankle, Valgus, Eversion", "Contracture, Achilles, Varus, Extension", "Cavus, Abduction, Valgus, Equinus"], a: 0, exp: "CAVE describes the four components of clubfoot: Cavus (midfoot), Adduction (forefoot), Varus (hindfoot), Equinus (hindfoot) — corrected in this specific sequence by the Ponseti method, with equinus corrected last via Achilles tenotomy." }
    ]
  },
  {
    id: "sports", title: "Sports Podiatry and Running Injuries", icon: "🏃", color: "#C0392B",
    cpd: 4, level: "Advanced",
    blurb: "Running gait mechanics, training load, common running injuries, bone stress injury, RED-S, and evidence-based gait retraining for the athletic patient.",
    slides: [
      {
        id: "s1", heading: "The Running Gait Cycle vs Walking",
        body: "Running gait differs fundamentally from walking gait in several key respects that directly affect injury mechanisms and clinical assessment. The defining distinction is the absence of a double-support phase: running has a flight phase where neither foot contacts the ground, while walking always has at least one foot in contact.\n\nStance phase reduces to approximately 30-40% of the running gait cycle (versus 60% in walking), while flight phase occupies 20-30%. Ground reaction forces increase substantially: vertical GRF reaches 200-300% of body weight in running versus 120% in walking, applied over a much shorter contact time.\n\nFoot strike pattern varies: rearfoot strike (heel-first, approximately 80% of recreational runners), midfoot strike, and forefoot strike each load different structures preferentially. Rearfoot strike produces a distinct impact transient (sharp initial GRF spike) absent in midfoot and forefoot strike patterns, which has driven interest in strike pattern modification for injury management, though evidence for universal benefit of switching patterns remains mixed.",
        quiz: null
      },
      {
        id: "s2", heading: "Training Load and Injury Risk",
        body: "Training load — the cumulative volume and intensity of training over time — is the dominant modifiable risk factor for running-related injury. The relationship is not simply more load equals more risk; both insufficient and excessive load relative to an individual's current capacity increase injury risk.\n\nThe acute:chronic workload ratio (ACWR) compares recent training load (acute, typically 7 days) to longer-term average load (chronic, typically 28 days). Ratios between 0.8-1.3 are associated with lowest injury risk; ratios above 1.5 are associated with substantially elevated injury risk — rapid load increases relative to recent training history are the key danger, more than absolute load itself.\n\nThe traditional \"10% rule\" (limiting weekly mileage increases to 10%) lacks strong evidence support as a universal threshold but remains a reasonable conservative starting heuristic. More sophisticated load monitoring using ACWR, session RPE (rate of perceived exertion), and training diaries provides better individualised guidance than fixed percentage rules.",
        quiz: {
          q: "An acute:chronic workload ratio (ACWR) in which range is associated with the lowest injury risk?",
          options: ["0.3-0.6", "0.8-1.3", "1.5-2.0", "2.0-2.5"],
          answer: 1,
          explain: "ACWR between 0.8-1.3 is associated with the lowest injury risk. Ratios above 1.5 are associated with substantially elevated risk, reflecting rapid load increases relative to recent training history rather than absolute load itself."
        }
      },
      {
        id: "s3", heading: "Achilles Tendinopathy in Runners",
        body: "Achilles tendinopathy affects 6-18% of runners over a training career, with mid-portion tendinopathy (2-6cm proximal to insertion) more common than insertional tendinopathy. Risk factors specific to runners include rapid training volume increases, hill training (increasing eccentric loading), and inadequate recovery between sessions.\n\nAssessment includes the arc sign (palpable nodule that moves with ankle motion in tendinopathy, versus fixed position in paratendinopathy) and the Royal London Hospital test (tenderness on palpation reduces with the ankle dorsiflexed compared to plantarflexed, suggesting tendinopathy rather than paratendinopathy).\n\nManagement follows the eccentric loading or Heavy Slow Resistance protocols (Alfredson or Beyer protocols, detailed in the Biomechanics module) with running-specific modifications: temporary reduction in running volume rather than complete cessation where tolerated, gradual hill training reintroduction, and gait retraining toward reduced loading patterns if mechanical contributors are identified.",
        quiz: null
      },
      {
        id: "s4", heading: "Patellofemoral Pain Syndrome in Runners",
        body: "Patellofemoral pain syndrome (PFPS) is the most common running injury, affecting up to 25% of runners. Pain is typically peripatellar or retropatellar, worse with downhill running, prolonged sitting (theatre sign), and stair descent — all activities increasing patellofemoral joint reaction force.\n\nThe closed kinetic chain mechanism connects foot mechanics to PFPS: hip abductor weakness and excessive STJ pronation both increase internal femoral rotation during stance, increasing medial patellar compressive force. This explains why effective PFPS management often requires both proximal (hip strengthening) and distal (foot orthoses, gait retraining) intervention.\n\nCombined hip strengthening and foot orthoses produce superior outcomes to either intervention alone (Barton et al., 2016, BJSM). Gait retraining to increase running cadence by 5-10% reduces patellofemoral joint loading by reducing the knee flexion angle and vertical displacement during stance, with RCT evidence supporting this single, simple intervention.",
        quiz: {
          q: "Combined hip strengthening and foot orthoses for patellofemoral pain syndrome produce:",
          options: ["No additional benefit over either alone", "Superior outcomes compared to either intervention alone", "Benefit only in athletes under 25", "Results inferior to surgical intervention"],
          answer: 1,
          explain: "Barton et al. (2016, BJSM) demonstrated that combined hip strengthening and foot orthoses produce superior outcomes to either intervention alone, reflecting the dual proximal (hip weakness) and distal (foot mechanics) contributions to patellofemoral pain syndrome through the closed kinetic chain."
        }
      },
      {
        id: "s5", heading: "Medial Tibial Stress Syndrome",
        body: "Medial tibial stress syndrome (MTSS, \"shin splints\") presents as diffuse pain along the distal two-thirds of the posteromedial tibial border, tender over a broad area distinguishing it from the focal tenderness of tibial stress fracture. MTSS represents a periosteal traction injury at the origin of the soleus and flexor digitorum longus, exacerbated by repetitive tibial bending forces during running.\n\nRisk factors include excessive STJ pronation, increased navicular drop, reduced ankle dorsiflexion range, female sex, and previous history of MTSS (a strong predictor of recurrence). Rapid training volume increases and running on hard or cambered surfaces are common precipitating factors.\n\nManagement combines relative rest (reducing but not eliminating load) with addressing biomechanical contributors: foot orthoses reducing excessive pronation have systematic review evidence of benefit. Gait retraining to increase cadence by 5-10% reduces tibial bending moments. Calf and tibialis posterior strengthening addresses the muscular component of the traction injury. Differentiation from stress fracture via focal versus diffuse tenderness, and MRI if diagnostic uncertainty persists, is essential before progressing loading.",
        quiz: null
      },
      {
        id: "s6", heading: "Tibial and Metatarsal Stress Fractures",
        body: "Stress fractures occur when repetitive bone loading exceeds the rate of bone repair, producing microscopic damage accumulating to cortical or trabecular failure. Common sites in runners: tibial shaft (most common, often distinguished from MTSS by focal versus diffuse tenderness), metatarsal shafts (particularly second and third), navicular, and calcaneus.\n\nThe navicular stress fracture deserves special mention as the most frequently missed stress fracture, presenting as vague midfoot pain often misattributed to soft tissue injury. Point tenderness at the dorsal navicular (the \"N-spot\") is a specific clinical sign warranting imaging. Navicular stress fractures carry higher risk of delayed union due to the relatively avascular central third of the bone.\n\nImaging: plain radiographs are frequently normal in early stress fractures (sensitivity as low as 15-35% in the first 2-3 weeks); MRI is the gold standard for early diagnosis with high sensitivity and specificity, and additionally grades stress reaction severity. Management: load modification (relative rest, cross-training to maintain fitness), addressing contributing biomechanical and training factors, and graduated return-to-running protocol over 6-12 weeks depending on fracture site and severity.",
        quiz: null
      },
      {
        id: "s7", heading: "Iliotibial Band Syndrome",
        body: "Iliotibial band syndrome (ITBS) is among the most common overuse running injuries, presenting as lateral knee pain typically developing at a consistent distance into a run (the \"impingement point\") rather than from the outset. The IT band compresses against the lateral femoral epicondyle at approximately 30 degrees of knee flexion — the critical impingement angle corresponding to the loading response phase of gait.\n\nDownhill running dramatically exacerbates ITBS by increasing the proportion of the gait cycle spent at the critical knee flexion angle and increasing eccentric loading demands on the IT band-tensor fasciae latae complex.\n\nBiomechanical risk factors include hip abductor weakness (driving increased hip adduction and internal rotation during stance) and increased contralateral pelvic drop. Management combines activity modification (temporary reduction or cessation of downhill running), hip abductor strengthening (gluteus medius, the primary evidence-based intervention), and gait retraining to increase step rate by 5-10%, which reduces knee flexion angle at foot strike and reduces time spent at the critical impingement angle.",
        quiz: null
      },
      {
        id: "s8", heading: "Plantar Fasciopathy in Athletic Populations",
        body: "Plantar fasciopathy in runners differs somewhat from the general population presentation described in the Biomechanics module. While ankle equinus remains a key risk factor, rapid training volume increase is the dominant precipitating factor in athletic populations rather than elevated BMI, which is less relevant in trained runners.\n\nDifferential diagnosis in athletes requires particular care: calcaneal stress fracture can mimic plantar fasciopathy but presents with more diffuse heel pain and positive squeeze test (mediolateral calcaneal compression reproducing pain); Baxter nerve entrapment (first branch of the lateral plantar nerve) can mimic plantar fasciopathy but presents with associated lateral foot numbness or burning.\n\nManagement follows the standard evidence-based hierarchy (stretching, orthoses, intrinsic strengthening, ESWT for chronic cases) with running-specific modification: temporary training volume reduction rather than complete cessation where pain allows, and careful graduated return to running once symptoms substantially improve, typically guided by a pain-monitoring approach similar to tendinopathy rehabilitation (acceptable pain up to 3-4/10 not worsening over 24 hours).",
        quiz: null
      },
      {
        id: "s9", heading: "Footwear and Running Injury Risk",
        body: "The relationship between running shoe characteristics and injury risk is more nuanced than commonly assumed. Despite decades of motion-control and stability shoe marketing premised on correcting pronation, systematic review evidence does not support that prescribing shoes based on foot type or pronation pattern reduces injury risk (Knapik et al., 2014; Malisoux et al., 2020).\n\nThe \"comfort filter\" hypothesis — that runners naturally select footwear that suits their individual biomechanics when allowed to choose based on subjective comfort — has reasonable supporting evidence and represents current best-practice shoe-fitting advice over rigid motion-control prescription based on static foot assessment alone.\n\nMinimalist and barefoot-style running shoes shift loading toward forefoot strike patterns and increase Achilles tendon and calf loading; transitioning too rapidly is a recognised risk factor for metatarsal stress fracture and Achilles tendinopathy. Any transition to minimalist footwear should be very gradual (over several months) with careful load monitoring. Carbon-plated \"super shoes\" demonstrate modest but genuine running economy benefits in elite athletes; evidence for recreational runners and for any injury risk modification remains limited.",
        quiz: null
      },
      {
        id: "s10", heading: "Return to Running After Injury",
        body: "Structured return-to-running protocols reduce re-injury risk compared to ad-hoc resumption of training. A graduated framework typically progresses through walk-run intervals, continuous easy running, then progressive volume and intensity increases, with clear criteria for progression at each stage rather than time-based progression alone.\n\nCriteria-based progression uses functional tests and symptom response rather than calendar time: single-leg hop test (within 90% of the uninjured side), single-leg squat quality, and pain response to the previous training session (no significant increase in symptoms) all inform readiness to progress. This individualises the return timeline rather than imposing an arbitrary fixed schedule.\n\nThe 10% rule provides a conservative starting point for volume progression once continuous running is re-established, though individualised progression based on symptom response is preferable. Cross-training (swimming, cycling, aqua jogging) maintains cardiovascular fitness during the early return phases when running volume must remain low, supporting psychological as well as physical recovery and reducing the temptation to progress running volume too rapidly.",
        quiz: null
      },
      {
        id: "s11", heading: "Bone Stress Injury: The Continuum Model",
        body: "Bone stress injury exists on a continuum from stress reaction (early bone marrow oedema without cortical disruption, visible only on MRI) through stress fracture (partial or complete cortical disruption) to displaced fracture. Understanding this continuum informs both diagnosis and graduated return-to-loading protocols.\n\nLow-risk stress fractures (most metatarsal shafts, posteromedial tibia, fibula) generally heal well with relative rest and progressive reloading over 6-8 weeks. High-risk stress fractures (anterior tibial cortex, navicular, fifth metatarsal, femoral neck) carry substantially higher risk of delayed union, non-union, or complete fracture, often requiring longer non-weight-bearing periods and sometimes surgical fixation.\n\nThe Fredericson MRI grading system (Grade 1-4, based on periosteal and bone marrow oedema extent) helps predict healing time and informs the necessary period of load modification — higher grades require longer periods before progressive return to impact loading. Risk factor assessment should always include nutritional status (relative energy deficiency in sport, RED-S), menstrual history in female athletes (functional hypothalamic amenorrhoea is strongly associated with bone stress injury), and vitamin D status.",
        quiz: null
      },
      {
        id: "s12", heading: "Relative Energy Deficiency in Sport (RED-S)",
        body: "Relative Energy Deficiency in Sport (RED-S) describes the physiological consequences of inadequate energy availability relative to training energy expenditure, extending beyond the previously narrower \"Female Athlete Triad\" concept to recognise impacts across multiple body systems in both male and female athletes.\n\nConsequences include impaired bone health (substantially elevated stress fracture risk), menstrual dysfunction in female athletes, impaired immune function, cardiovascular effects, and impaired training adaptation and performance — making RED-S directly relevant to any podiatrist managing recurrent or unusual stress fractures in athletic patients.\n\nScreening questions for any athlete presenting with stress fracture should include training volume and recent changes, dietary patterns and any history of disordered eating, menstrual history in female athletes (amenorrhoea or oligomenorrhoea), and fatigue or recurrent illness patterns. Recognition of RED-S risk factors should prompt referral to sports medicine physician and dietitian rather than focusing solely on the local biomechanical management of the presenting stress fracture, as addressing the underlying energy deficiency is essential to preventing recurrence.",
        quiz: {
          q: "RED-S extends beyond which previously narrower concept to recognise impacts across multiple body systems in both male and female athletes?",
          options: ["Overtraining Syndrome", "Female Athlete Triad", "Chronic Fatigue Syndrome", "Exercise-Induced Bronchospasm"],
          answer: 1,
          explain: "RED-S extends beyond the previously narrower Female Athlete Triad concept (disordered eating, menstrual dysfunction, low bone density) to recognise that inadequate energy availability affects multiple body systems, including bone health, immune function, and cardiovascular health, in both male and female athletes."
        }
      },
      {
        id: "s13", heading: "Compartment Syndrome: Acute vs Chronic Exertional",
        body: "Acute compartment syndrome is a surgical emergency, typically following significant trauma, characterised by severe pain disproportionate to injury, pain on passive muscle stretch, paraesthesia, and eventually pulselessness (a late and ominous sign). Any suspicion requires immediate orthopaedic referral for compartment pressure measurement and emergency fasciotomy if confirmed — delay risks permanent muscle and nerve damage.\n\nChronic exertional compartment syndrome (CECS) is a distinct, non-emergency condition presenting with exercise-induced lower leg pain and tightness that builds predictably during exercise and resolves with rest, typically within 20-30 minutes. The anterior compartment is most commonly affected in runners, though deep posterior compartment involvement can mimic MTSS.\n\nDiagnosis requires compartment pressure testing before and after standardised exercise (elevated post-exercise pressures confirm the diagnosis). Conservative management (gait retraining toward reduced impact loading, activity modification) has limited evidence of success; fasciotomy remains the definitive treatment for cases significantly limiting athletic participation, with good outcomes reported in properly selected patients.",
        quiz: null
      },
      {
        id: "s14", heading: "Functional Movement Screening in Runners",
        body: "Functional movement screening identifies movement quality deficits that may predispose to injury, though evidence for screening tools predicting specific injury occurrence remains mixed and screening should inform rather than replace clinical reasoning based on the individual athlete's history and presentation.\n\nThe single-leg squat assesses dynamic control of the hip, knee, and ankle simultaneously: observe for pelvic drop (hip abductor weakness), dynamic knee valgus (combined hip and foot contribution), and excessive trunk lean (core control deficit) — each suggesting different areas requiring targeted intervention.\n\nThe single-leg hop test assesses power, control, and confidence, useful both as a screening tool and as a return-to-running readiness criterion after injury (comparing hop distance and landing quality between limbs). Running gait video analysis, increasingly accessible via smartphone slow-motion capture, allows assessment of cadence, vertical oscillation, foot strike pattern, and asymmetries that may not be apparent on static or non-running assessment — providing valuable supplementary information to standard biomechanical examination, particularly for higher-mileage or competitive runners.",
        quiz: null
      },
      {
        id: "s15", heading: "Strength Training for Injury Prevention",
        body: "Strength training, historically underutilised by endurance runners concerned about added bulk or fatigue, has strong evidence for reducing running injury risk — RCT and systematic review evidence consistently demonstrates significant injury risk reduction with structured strength programmes (Lauersen et al., 2014, BJSM, meta-analysis of injury prevention interventions).\n\nCalf and Achilles-specific strengthening (heel raises, progressing to single-leg and weighted variations) addresses the high tissue demands placed on the gastrocnemius-soleus-Achilles complex during running, where forces of 6-8 times body weight are routinely generated.\n\nHip abductor and external rotator strengthening (clamshells, side-lying leg raises, single-leg bridges, progressing to weighted single-leg deadlifts) addresses the proximal control deficits implicated in PFPS, ITBS, and MTSS. A twice-weekly strength programme, even of relatively brief duration (20-30 minutes), demonstrates meaningful injury risk reduction without compromising running performance — indeed, strength training improves running economy in trained runners, providing performance as well as injury-prevention benefit.",
        quiz: null
      },
      {
        id: "s16", heading: "Female Runners: Specific Considerations",
        body: "Female runners face some injury patterns and risk factors that differ from male counterparts, requiring specific clinical awareness. Bone stress injury rates are higher in female runners, substantially influenced by the RED-S and Female Athlete Triad considerations discussed previously — menstrual history should be routinely assessed in any female athlete presenting with stress fracture.\n\nPatellofemoral pain syndrome shows higher prevalence in female athletes, attributed partly to anatomical factors (wider pelvis affecting Q-angle) but more substantially to modifiable factors including hip abductor strength deficits — reinforcing that targeted hip strengthening is a particularly important intervention in this population.\n\nThe menstrual cycle influences injury risk and training response through hormonal effects on tendon and ligament laxity (oestrogen reduces collagen synthesis and tendon stiffness, particularly around ovulation) and on bone metabolism. Increasing availability of menstrual cycle tracking allows individualised training load periodisation, an emerging area of sports science with growing evidence base, though practical application of cycle-based training periodisation remains an evolving field.",
        quiz: null
      },
      {
        id: "s17", heading: "Masters Runners: Age-Related Considerations",
        body: "Masters runners (typically defined as over 35-40 years) present distinct considerations related to age-related physiological changes affecting both injury risk and recovery capacity, requiring modified clinical assessment and management approaches compared to younger athletes.\n\nTendon and connective tissue changes with age include reduced collagen turnover and increased stiffness, contributing to higher rates of degenerative tendinopathy. As discussed in the Biomechanics module, 30-35% of asymptomatic adults over 50 already have degenerative Achilles changes on ultrasound — relevant when masters runners present with sudden-onset symptoms after sudden increased loading, as these tendons carry elevated rupture risk.\n\nRecovery time between training sessions increases with age, requiring modified training periodisation with greater emphasis on recovery days and potentially reduced peak training frequency compared to younger counterparts, while total weekly volume can often be maintained through different distribution. Bone density changes (particularly post-menopausal in women) elevate stress fracture risk, reinforcing the importance of strength training and adequate calcium and vitamin D status. Importantly, age alone should not be used to discourage running participation — running maintains cardiovascular health, bone density, and functional capacity, with appropriately individualised training load.",
        quiz: null
      },
      {
        id: "s18", heading: "Orthotic Prescription for Runners",
        body: "Orthotic prescription for runners follows the tissue stress model principles described in the Biomechanics module, with specific considerations for the running population. Running generates substantially higher loading forces than walking, meaning orthotic interventions that provide adequate control during walking may be insufficient during running gait.\n\nMaterial selection requires balancing control with the higher cyclical loading of running: semi-rigid materials (polypropylene, carbon composite) provide motion control suited to higher-mileage runners with significant pronation-related symptoms, while accommodative materials suit lower-mileage runners prioritising comfort and shock absorption.\n\nRunning-specific orthotic modifications include narrower shells to fit within running shoe volume constraints, and consideration of the runner's typical footwear (orthoses must be compatible with the shoe last shape and volume). As with general orthotic prescription, evidence supports comparable outcomes between custom and well-fitted prefabricated devices for most running-related conditions when combined with appropriate exercise-based rehabilitation — orthoses should be considered an adjunct to, not a replacement for, addressing underlying strength and load management factors.",
        quiz: null
      },
      {
        id: "s19", heading: "Gait Retraining: Evidence and Technique",
        body: "Gait retraining has emerging evidence across multiple running-related conditions, with cadence modification representing the single most evidence-supported and practically accessible intervention. Increasing step rate by 5-10% while maintaining running speed necessarily reduces stride length, which reduces vertical displacement, ground reaction force impulse, and loading at the hip, knee, and ankle simultaneously.\n\nPractical implementation: measure baseline cadence (steps per minute, easily counted over 30 seconds and doubled, or via running watch data), calculate the target 5-10% increase, then use a metronome app or music with matching beats-per-minute to provide an audible cadence cue during training runs. Gradual implementation over 2-4 weeks, beginning with shorter training segments at the target cadence, allows neuromuscular adaptation without overwhelming the runner.\n\nOther gait retraining targets (forefoot strike conversion, reduced vertical oscillation, reduced overstride) have more limited and condition-specific evidence, and altering well-established movement patterns carries its own injury risk during the adaptation period. Cadence modification remains the most broadly applicable, lowest-risk gait retraining intervention with the strongest supporting evidence across PFPS, MTSS, ITBS, and tibial stress injury.",
        quiz: null
      },
      {
        id: "s20", heading: "Building a Sports Podiatry Assessment Framework",
        body: "A comprehensive sports podiatry assessment integrates training history, biomechanical examination, and condition-specific assessment into a coherent clinical framework that identifies modifiable contributing factors rather than focusing on structural findings alone.\n\nTraining history should capture: current weekly volume and recent changes, training surface and terrain, footwear age and recent changes, cross-training activities, and any recent changes in training stimulus (new coach, new programme, return from injury or illness) — training load change is frequently the precipitating factor even when biomechanical findings suggest a structural contributor.\n\nBiomechanical examination follows the framework detailed in the Biomechanics and Orthotics module: joint range of motion, static foot posture, functional testing (single-leg squat, single-leg hop, heel rise), and where available, running gait video analysis. Integration of findings into management requires prioritising the most modifiable and clinically significant factors rather than attempting to address every minor finding simultaneously — a focused intervention plan addressing 2-3 key contributing factors, with planned reassessment, typically produces better adherence and outcomes than an overwhelming list of simultaneous changes.",
        quiz: {
          q: "The single most evidence-supported and practically accessible gait retraining intervention is:",
          options: ["Forefoot strike conversion", "Cadence increase of 5-10%", "Reduced vertical oscillation training", "Barefoot running transition"],
          answer: 1,
          explain: "Increasing running cadence by 5-10% while maintaining speed reduces stride length, vertical displacement, and ground reaction force impulse simultaneously, with RCT evidence supporting benefit across PFPS, MTSS, ITBS, and tibial stress injury. It is also the lowest-risk and most practically accessible intervention, implementable using a simple metronome cue."
        }
      }
    ],
    exam: [
      { q: "Vertical ground reaction force during running reaches approximately what proportion of body weight?", opts: ["100-120%", "150-180%", "200-300%", "350-400%"], a: 2, exp: "Vertical GRF reaches 200-300% of body weight in running, applied over a much shorter contact time than walking (where it reaches approximately 120%), explaining the substantially higher tissue loading demands of running." },
      { q: "Acute:chronic workload ratios above what threshold are associated with substantially elevated injury risk?", opts: ["1.0", "1.2", "1.5", "2.5"], a: 2, exp: "ACWR above 1.5 is associated with substantially elevated injury risk. Ratios between 0.8-1.3 are associated with lowest injury risk — rapid load increases relative to recent training history are the key danger." },
      { q: "Combined hip strengthening and foot orthoses for patellofemoral pain syndrome produce:", opts: ["No additional benefit over either alone", "Superior outcomes compared to either intervention alone", "Benefit only in athletes under 25", "Results inferior to surgical intervention"], a: 1, exp: "Barton et al. (2016, BJSM) demonstrated combined hip strengthening and foot orthoses produce superior outcomes to either alone, reflecting dual proximal and distal contributions to PFPS." },
      { q: "The navicular stress fracture is notable clinically because:", opts: ["It is the most common stress fracture in runners", "It is the most frequently missed stress fracture due to vague presentation", "It always requires surgical fixation", "It only occurs in adolescent athletes"], a: 1, exp: "The navicular stress fracture is the most frequently missed stress fracture, presenting as vague midfoot pain often misattributed to soft tissue injury. The relatively avascular central third also carries higher delayed union risk." },
      { q: "Iliotibial band compression against the lateral femoral epicondyle occurs at approximately what knee flexion angle?", opts: ["10 degrees", "30 degrees", "60 degrees", "90 degrees"], a: 1, exp: "The IT band compresses at approximately 30 degrees of knee flexion — the impingement angle during the loading response phase of gait, when ground reaction forces are highest, explaining why downhill running exacerbates ITBS." },
      { q: "RED-S (Relative Energy Deficiency in Sport) screening should be considered in any athlete presenting with:", opts: ["Ankle sprain", "Recurrent or unusual stress fracture", "Plantar wart", "Ingrown toenail"], a: 1, exp: "RED-S screening (training load, dietary patterns, menstrual history, fatigue) should be considered in any athlete with recurrent or unusual stress fracture, as inadequate energy availability substantially elevates bone stress injury risk." },
      { q: "Acute compartment syndrome is distinguished from chronic exertional compartment syndrome by:", opts: ["Bilateral versus unilateral presentation", "Being a surgical emergency with severe disproportionate pain, versus predictable exercise-induced pain resolving with rest", "Affecting only the anterior compartment", "Occurring only in untrained individuals"], a: 1, exp: "Acute compartment syndrome is a surgical emergency with severe pain disproportionate to injury requiring immediate referral. Chronic exertional compartment syndrome presents with predictable exercise-induced pain resolving within 20-30 minutes of rest — a fundamentally different, non-emergency condition." },
      { q: "Strength training for injury prevention in runners has what evidence base?", opts: ["No supporting evidence", "Weak observational evidence only", "Strong RCT and systematic review evidence for injury risk reduction", "Evidence only in elite athletes"], a: 2, exp: "Lauersen et al. (2014, BJSM) meta-analysis demonstrates strong evidence for strength training reducing injury risk in runners, alongside improving running economy — providing both performance and injury-prevention benefit." },
      { q: "The comfort filter hypothesis in running shoe selection proposes that:", opts: ["Motion-control shoes should be prescribed by foot type", "Runners naturally select footwear suited to their biomechanics based on subjective comfort", "All runners should transition to minimalist footwear", "Shoe cushioning has no effect on injury risk"], a: 1, exp: "The comfort filter hypothesis, with reasonable supporting evidence, proposes that runners naturally select footwear suited to their individual biomechanics when choosing based on comfort — contradicting the traditional motion-control prescription model based on static foot type assessment." },
      { q: "Increasing running cadence by 5-10% reduces injury-related loading primarily by:", opts: ["Increasing stride length", "Reducing stride length, vertical displacement, and GRF impulse", "Converting runners to forefoot strike", "Increasing ground contact time"], a: 1, exp: "Increasing cadence while maintaining speed necessarily reduces stride length, which reduces vertical displacement and ground reaction force impulse simultaneously — the mechanism underlying benefit across PFPS, MTSS, ITBS, and tibial stress injury." }
    ]
  },
  {
    id: "dressings", title: "Wound Dressings and Topical Therapies", icon: "🧴", color: "#5B8C5A",
    cpd: 4, level: "Intermediate",
    blurb: "Every major wound dressing category — mechanism, evidence base, and correct clinical indication, from basic contact layers to NPWT and bioengineered skin substitutes.",
    slides: [
      {
        id: "dr1", heading: "Principles of Wound Bed Preparation and Dressing Selection",
        body: "Dressing selection should never be the starting point of wound management — aetiology, debridement, and offloading or compression come first (see the Wound Assessment module). Once the wound bed is appropriately prepared, dressing selection follows a systematic, evidence-based decision process rather than habit or familiarity.\n\nFour wound characteristics determine dressing choice: exudate level (none, low, moderate, heavy), tissue type present (necrotic, sloughy, granulating, epithelialising), infection status, and wound depth or undermining. No single dressing category is superior for all wounds; the goal is matching dressing properties to the wound's current state and reassessing at every visit, since a healing wound's needs change as it progresses through the phases of healing.\n\nThe moist wound healing principle, established by Winter (1962, Nature) in animal studies and subsequently confirmed in human RCTs, demonstrated that wounds kept moist rather than allowed to dry out and form a hard scab re-epithelialise significantly faster. This single finding underpins almost all modern dressing design — the goal of every dressing category covered in this course is achieving and maintaining the correct moisture balance for that specific wound.",
        quiz: null
      },
      {
        id: "dr2", heading: "Basic Wound Contact Dressings",
        body: "Low-adherent dressings (e.g. Mepitel, NA Ultra, Tricotex) are knitted or perforated materials placed directly on the wound bed to prevent the secondary dressing adhering to the wound surface. They are not designed to manage significant exudate themselves and are typically combined with an absorbent secondary dressing. Indicated for minor, low-exuding wounds, donor sites, and as a non-adherent layer over fragile granulation or epithelialising tissue.\n\nSilicone-coated wound contact layers (Mepitel One, Adaptic Touch) reduce pain and trauma on dressing removal compared with non-silicone alternatives, with RCT evidence demonstrating significantly reduced pain scores at dressing change (White, 2008, J Wound Care). They are particularly valuable for patients with fragile periwound skin, paediatric wounds, or those requiring frequent dressing changes.\n\nSimple absorbent pads (e.g. Mesorb, Surgipad) provide basic fluid absorption as a secondary dressing over a primary contact layer, suited to low-to-moderate exudate wounds without infection. They have minimal specific therapeutic action beyond mechanical absorption and protection, making them appropriate for straightforward, uncomplicated wounds rather than as the primary intervention for complex or chronic wounds.",
        quiz: {
          q: "The moist wound healing principle, foundational to modern dressing design, was originally established by:",
          options: ["Schultz et al. (2003) in the TIME framework paper", "Winter (1962) in animal wound healing studies", "James et al. (2008) in biofilm research", "Cook and Purdam (2009) in tendon pathology research"],
          answer: 1,
          explain: "George Winter's 1962 study, published in Nature, demonstrated that wounds kept moist healed significantly faster than wounds allowed to dry and scab over. This single finding, later confirmed in human studies, underpins the design rationale of almost every modern wound dressing category."
        }
      },
      {
        id: "dr3", heading: "Alginate Dressings: Mechanism and Evidence",
        body: "Alginate dressings (Kaltostat, Sorbsan, Algisite M, SeaSorb) are derived from calcium and sodium salts of alginic acid extracted from brown seaweed. On contact with wound exudate, sodium ions in the exudate exchange with calcium ions in the dressing, converting the fibrous dressing into a soft, cohesive gel.\n\nThis ion-exchange mechanism delivers three distinct benefits beyond simple absorption: the calcium release has a mild haemostatic effect, making alginates particularly useful for lightly bleeding wounds or post-debridement sites; the gel formed maintains a moist wound environment as it absorbs; and the fibrous structure can absorb up to 20 times its own weight in exudate, making it suitable for moderate to heavy exuding wounds.\n\nAlginates require a secondary dressing to retain the gel and provide additional absorption. They are contraindicated in dry or minimally exuding wounds, where they can desiccate the wound bed rather than hydrate it, and should not be used on dry necrotic eschar. Calcium alginate rope or ribbon forms are specifically useful for packing deep cavity wounds and sinus tracts, where the dressing must conform to an irregular wound bed.",
        quiz: null
      },
      {
        id: "dr4", heading: "Hydrofibre Dressings: A Step Beyond Alginates",
        body: "Hydrofibre dressings (Aquacel, Aquacel Extra, Aquacel Ag+) are composed of sodium carboxymethylcellulose fibres, structurally distinct from alginates though often confused with them clinically. On contact with wound fluid, the fibres absorb exudate and convert into a cohesive gel sheet, similar in appearance to alginate gel but with superior fluid-retention properties.\n\nHydrofibre dressings absorb up to 25 times their own weight in fluid and, critically, retain absorbed fluid even under the compression of bandaging or footwear — a property alginates lack, where absorbed fluid can be expressed back out under pressure. This makes hydrofibre dressings particularly suited to heavily exuding wounds under compression bandaging (venous leg ulcers) or beneath offloading devices (diabetic foot ulcers), where lateral fluid leakage and maceration risk are significant clinical concerns.\n\nAquacel Ag+ incorporates ionic silver for antimicrobial activity, indicated for clinically infected or critically colonised wounds, combining the superior fluid management of hydrofibre technology with broad-spectrum antimicrobial action against Gram-positive and Gram-negative organisms including MRSA and Pseudomonas aeruginosa.",
        quiz: {
          q: "Hydrofibre dressings are distinguished from alginate dressings primarily by their:",
          options: ["Lower absorbency capacity", "Ability to retain absorbed fluid even under compression or pressure", "Requirement for a secondary dressing", "Inability to be used on infected wounds"],
          answer: 1,
          explain: "While both alginates and hydrofibres absorb significant fluid and form a gel, hydrofibre dressings retain that fluid even under the compression of bandaging or footwear, whereas alginate gel can be expressed back out under pressure. This makes hydrofibre dressings preferred under compression bandaging or offloading devices where lateral leakage risks maceration."
        }
      },
      {
        id: "dr5", heading: "Foam Dressings: The Workhorse Dressing Category",
        body: "Foam dressings (Mepilex, Mepilex Border, Allevyn, Biatain) are the most widely used dressing category in UK wound care practice, suited to a broad range of wound types and exudate levels. They consist of a hydrophilic polyurethane foam layer that absorbs exudate into its cellular structure while maintaining a moist wound surface.\n\nSilicone-adhesive foam dressings (Mepilex Border) combine the absorptive foam pad with a soft silicone wound contact layer and adhesive border, enabling atraumatic removal that minimises pain and periwound skin stripping — particularly valuable in patients with fragile skin, those on long-term corticosteroids, or elderly patients with reduced skin integrity. RCT evidence demonstrates significantly reduced pain on removal compared with traditional adhesive dressings (Meaume et al., 2003).\n\nFoam dressings can typically remain in place for 3-7 days depending on exudate volume, reducing dressing change frequency, nursing time, and patient discomfort compared with daily dressing changes. This wear-time advantage, combined with broad applicability across exudate levels, explains foam dressings' position as the default choice for moderately exuding wounds without specific additional requirements (infection, deep cavity, dry eschar).",
        quiz: null
      },
      {
        id: "dr6", heading: "Hydrogel Dressings: Rehydration and Autolytic Debridement",
        body: "Hydrogel dressings (Intrasite Gel, Purilon Gel, Aquaflo) are water- or glycerin-based gels containing approximately 80% water content, designed to donate moisture to dry wound beds rather than absorb exudate. This makes their mechanism of action fundamentally opposite to alginates, hydrofibres, and foams.\n\nThe primary clinical indication for hydrogels is dry or minimally exuding wounds with necrotic or sloughy tissue requiring rehydration to facilitate autolytic debridement — the body's own enzymatic processes liquefying and removing devitalised tissue once adequately hydrated. By donating moisture into dry, hardened necrotic tissue, hydrogels soften eschar over several days, allowing it to be more easily and safely debrided, or in some cases facilitating spontaneous separation.\n\nHydrogels are contraindicated in moderately to heavily exuding wounds, where their moisture-donating action would worsen maceration of the wound bed and periwound skin. They require a secondary dressing to retain the gel in place and typically need more frequent dressing changes (every 1-3 days) than absorbent dressing categories, since their moisture-donating capacity diminishes as the gel mixes with wound exudate over time.",
        quiz: {
          q: "Hydrogel dressings are specifically indicated for which wound presentation?",
          options: ["Heavily exuding wounds requiring maximum absorption", "Dry or minimally exuding wounds with necrotic or sloughy tissue requiring rehydration", "Clinically infected wounds requiring antimicrobial action", "Deep cavity wounds requiring packing material"],
          answer: 1,
          explain: "Hydrogels donate moisture (approximately 80% water content) rather than absorb it, making them specifically suited to dry, minimally exuding wounds with necrotic or sloughy tissue. This rehydrates hardened tissue and facilitates autolytic debridement. They are contraindicated in moderate-heavy exudate, where they would worsen maceration."
        }
      },
      {
        id: "dr7", heading: "Silver-Containing Dressings: Antimicrobial Evidence",
        body: "Silver ions exert broad-spectrum antimicrobial activity through multiple mechanisms: disruption of bacterial cell membrane integrity, binding to bacterial DNA and inhibiting replication, and interference with the electron transport chain and key respiratory enzymes. This multi-mechanism action explains the very low rate of bacterial resistance development to silver, in contrast to many systemic and topical antibiotics.\n\nNanocrystalline silver dressings (Acticoat) release the highest sustained silver concentrations of available silver dressing technologies and have the broadest clinical evidence base, including RCT data supporting reduced bacterial bioburden and, in some studies, accelerated healing in critically colonised or infected wounds (Silver, 2003). Silver-impregnated hydrofibre (Aquacel Ag+) and silver foam (Mepilex Ag) combine the absorptive properties of their base technology with antimicrobial action.\n\nSilver dressings are indicated for clinically infected or critically colonised wounds, not for routine use on uncomplicated, non-infected wounds, where the additional cost is not justified by the evidence and unnecessary use may theoretically contribute to selection pressure. Clinical infection status should be reassessed at each dressing change; silver dressings should be discontinued once infection has resolved, generally within 2 weeks, rather than continued indefinitely.",
        quiz: null
      },
      {
        id: "dr8", heading: "Iodine-Based Dressings: Cadexomer and Povidone-Iodine",
        body: "Cadexomer iodine (Iodosorb, Iodoflex) is a starch-based polymer matrix containing 0.9% iodine, distinct in mechanism from simple povidone-iodine antiseptic solutions. The cadexomer beads absorb wound exudate, slowly swelling and releasing iodine in a controlled, sustained manner directly into the wound bed as the beads absorb fluid, rather than as a single high-concentration application.\n\nThis controlled-release mechanism delivers antimicrobial activity, including documented activity against biofilm-forming organisms (a property not shared by all topical antimicrobials), while simultaneously providing exudate absorption. Cochrane review evidence supports cadexomer iodine for chronic wound healing, with particular evidence in venous leg ulcers (O'Meara et al., 2010, Cochrane).\n\nPovidone-iodine solutions and dressings provide broad-spectrum but shorter-acting antimicrobial activity compared with cadexomer iodine, with some historical concern regarding cytotoxicity to healthy fibroblasts and keratinocytes at higher concentrations, though clinical significance of this in vivo remains debated. Iodine-based products are contraindicated in patients with known iodine sensitivity, thyroid disorders (due to potential systemic iodine absorption with extensive or prolonged use), and during pregnancy.",
        quiz: {
          q: "Cadexomer iodine differs from povidone-iodine antiseptic solution in that it:",
          options: ["Has no antimicrobial activity, only absorbent properties", "Releases iodine in a slow, controlled manner as beads absorb exudate, combining absorption with sustained antimicrobial action", "Cannot be used on infected wounds", "Is contraindicated in venous leg ulcers"],
          answer: 1,
          explain: "Cadexomer iodine uses a starch-based polymer bead matrix that absorbs wound exudate while simultaneously releasing iodine in a slow, controlled manner, providing sustained antimicrobial action including activity against biofilm, combined with genuine exudate management — distinct from the rapid-release, shorter-acting action of simple povidone-iodine antiseptic solutions."
        }
      },
      {
        id: "dr9", heading: "Honey-Based Dressings: Medical-Grade Manuka Honey",
        body: "Medical-grade Manuka honey dressings (Activon Tulle, Medihoney) are derived from Leptospermum scoparium nectar and are sterilised and standardised for clinical use, distinct from culinary or non-medical-grade honey, which carries infection risk from potential Clostridium botulinum spore contamination and is not appropriate for wound use.\n\nThe antimicrobial mechanism is multi-factorial: high osmolarity draws fluid from bacterial cells, hydrogen peroxide is generated through the glucose oxidase enzyme naturally present in honey, and methylglyoxal (present at unusually high concentration in Manuka honey specifically, derived from dihydroxyacetone in the Leptospermum nectar) provides additional broad-spectrum antibacterial activity not present in other honey varieties.\n\nRCT and systematic review evidence supports honey dressings for managing bioburden and biofilm in chronic wounds, with some evidence of accelerated healing in specific wound types including burns and some chronic leg ulcers (Jull et al., 2015, Cochrane). Honey dressings commonly cause a transient stinging or burning sensation on application, particularly in wounds with some retained pain sensation; patients should be counselled about this before first application to avoid unnecessary alarm or treatment discontinuation.",
        quiz: null
      },
      {
        id: "dr10", heading: "Negative Pressure Wound Therapy (NPWT)",
        body: "Negative pressure wound therapy applies controlled sub-atmospheric pressure to a wound via an open-cell foam or gauze dressing sealed with an occlusive film and connected to a vacuum pump, continuously or intermittently removing exudate into a collection canister.\n\nThe mechanism delivers multiple simultaneous benefits beyond simple exudate removal: mechanical deformation of the wound bed at a cellular level stimulates angiogenesis and granulation tissue formation; the sealed system reduces bacterial contamination from the external environment; oedema is reduced through continuous fluid removal; and wound contraction is mechanically encouraged through the negative pressure itself, particularly with the standard -125mmHg continuous setting.\n\nNPWT is indicated for deep wounds with significant exudate, dehisced surgical wounds, wounds with cavities or undermining requiring conformable filling, and as an adjunct following surgical debridement of complex wounds. Standard settings are -125mmHg continuous for acute, healthy-tissue wounds and -75mmHg (continuous or intermittent) for more chronic, fragile, or pressure-sensitive wound beds. Contraindications include exposed blood vessels, organs, or nerves; untreated osteomyelitis; malignancy within the wound; and necrotic tissue with eschar that has not been debrided.",
        quiz: {
          q: "The standard NPWT pressure setting for acute wounds with healthy tissue is:",
          options: ["-25mmHg continuous", "-75mmHg intermittent", "-125mmHg continuous", "-200mmHg continuous"],
          answer: 2,
          explain: "-125mmHg continuous is the standard NPWT setting for acute wounds with healthy tissue. -75mmHg (continuous or intermittent) is typically reserved for more chronic, fragile wound beds where the higher standard pressure may not be tolerated or could damage delicate granulation tissue."
        }
      },
      {
        id: "dr11", heading: "Collagen and Protease-Modulating Dressings",
        body: "Chronic, non-healing wounds are characterised by elevated levels of matrix metalloproteinases (MMPs) — proteolytic enzymes that, in excess, degrade not only damaged tissue but also essential growth factors and the extracellular matrix proteins required for healing to progress. This elevated protease environment is a key biochemical feature distinguishing chronic, stalled wounds from acute, normally healing wounds.\n\nCollagen-containing dressings (Promogran, OASIS Wound Matrix) work by providing an exogenous collagen substrate. Excess MMPs in the wound fluid preferentially bind to and degrade this exogenous collagen rather than the wound's own endogenous growth factors and matrix proteins, effectively protecting the wound's own healing machinery from premature degradation by the hostile protease environment.\n\nPromogran combines collagen with oxidised regenerated cellulose (ORC), which additionally binds and inactivates excess MMPs directly. Clinical evidence supports use in stalled chronic wounds with non-advancing edges at 4 weeks despite otherwise appropriate standard wound care — the population in whom elevated protease activity is most likely to be the limiting factor preventing progression to healing. These dressings are not first-line for newly presenting or actively healing wounds, where standard moisture-balance dressings remain appropriate and more cost-effective.",
        quiz: null
      },
      {
        id: "dr12", heading: "Film Dressings and Their Role",
        body: "Transparent film dressings (Tegaderm, Opsite, Bioclusive) are thin, semi-permeable polyurethane membranes that are permeable to water vapour and oxygen but impermeable to bacteria and liquid water, providing a protective barrier while allowing visual wound inspection without dressing removal.\n\nFilms have minimal absorptive capacity and are therefore appropriate only for wounds with no or minimal exudate: superficial abrasions, donor sites with minimal ooze, as a secondary fixation dressing over another primary dressing, or as a protective barrier over at-risk intact skin (prophylactic use over bony prominences or friction-prone areas).\n\nA specific and clinically valuable application is as a secondary dressing over thin alginate or hydrofibre dressings in wounds with low-moderate exudate, creating a moist wound healing environment while permitting visual monitoring of exudate volume and colour through the transparent film without disturbing the wound bed. Films should not be used as a primary dressing on moderately to heavily exuding wounds, where the limited absorptive capacity rapidly leads to fluid pooling and periwound maceration.",
        quiz: null
      },
      {
        id: "dr13", heading: "Antimicrobial Versus Antiseptic: An Important Distinction",
        body: "Confusion frequently arises between antimicrobial dressings (silver, iodine, honey, PHMB) and the broader category of wound antiseptics, and understanding the distinction has direct prescribing implications. Antimicrobial dressings are designed for sustained, lower-concentration, prolonged-contact activity appropriate for chronic wound management over days. Antiseptic solutions (chlorhexidine, povidone-iodine wash, hypochlorous acid solutions) are typically designed for short-contact-time cleansing or irrigation rather than prolonged dressing-based delivery.\n\nPHMB (polyhexamethylene biguanide) dressings (Suprasorb X+PHMB, Kerlix AMD) provide broad-spectrum antimicrobial activity against Gram-positive and Gram-negative bacteria including MRSA, with the specific advantage of no documented bacterial resistance development despite extensive clinical use over more than two decades — a property increasingly valued given growing antimicrobial stewardship concerns across all antimicrobial classes, not only systemic antibiotics.\n\nThe decision to use any antimicrobial dressing should be based on the NERDS and STONEES criteria for clinical infection or critical colonisation detailed in the Wound Assessment module, not applied routinely to all chronic wounds. Once infection has resolved, typically within 1-2 weeks, antimicrobial dressings should be discontinued and management returned to standard moisture-balance dressings appropriate to the wound's exudate level and tissue type.",
        quiz: {
          q: "PHMB (polyhexamethylene biguanide) dressings are notable among antimicrobial dressing options because:",
          options: ["They are the only dressing effective against MRSA", "No documented bacterial resistance has developed despite over two decades of clinical use", "They are absorbent enough to replace foam dressings entirely", "They cannot be combined with other wound care principles"],
          answer: 1,
          explain: "PHMB has been used extensively in wound care for more than two decades without documented development of bacterial resistance, an increasingly valued property given growing antimicrobial stewardship concerns across all antimicrobial classes, including topical agents used in chronic wound management."
        }
      },
      {
        id: "dr14", heading: "Dressing Selection for Diabetic Foot Ulcers",
        body: "Dressing selection in diabetic foot ulcers must always be considered secondary to offloading, which remains the primary intervention as detailed extensively in the Diabetic Foot module — no dressing, however advanced, will heal a neuropathic plantar ulcer without adequate pressure redistribution.\n\nWithin the context of appropriate offloading, dressing selection follows standard exudate and tissue-type principles, with specific considerations: dressings under offloading devices (total contact casts, removable cast walkers) must withstand sustained pressure without excessive bulk that could itself create new pressure points, favouring thinner foam or hydrofibre dressings over bulky alginate ropes in non-cavity wounds. Hydrofibre dressings are frequently preferred under offloading devices specifically because they retain absorbed fluid under compression, unlike alginates.\n\nFor diabetic foot ulcers with confirmed or suspected infection, evidence does not support any single antimicrobial dressing as definitively superior; selection should be guided by exudate level alongside antimicrobial need (silver hydrofibre for moderate-heavy exudate with infection; iodine-based products where biofilm is a specific concern). Systemic antibiotics, guided by microbiological culture, remain necessary for spreading or systemic infection — antimicrobial dressings alone are insufficient for clinically significant diabetic foot infection.",
        quiz: null
      },
      {
        id: "dr15", heading: "Dressing Selection for Venous Leg Ulcers",
        body: "Dressing selection for venous leg ulcers operates within the context of compression therapy as the primary evidence-based intervention, detailed in the Wound Assessment module. The dressing sits beneath compression bandaging and must be selected with this context specifically in mind.\n\nExudate from venous leg ulcers is frequently heavy, particularly in the early phase of compression therapy as chronic oedema begins to resolve, making highly absorbent options (hydrofibre, alginate, or absorbent foam) appropriate first-line choices. As compression therapy progresses and chronic oedema reduces over several weeks, exudate volume typically decreases substantially, and dressing choice should be reviewed and adjusted accordingly at each compression bandage change.\n\nPeriwound skin in venous disease frequently shows varicose eczema, haemosiderin staining, and is often fragile due to chronic venous hypertension and prior dressing adhesive trauma — favouring silicone-adhesive or non-adherent dressing technologies to minimise further periwound skin damage. Where venous eczema is present and active, a topical corticosteroid applied to the surrounding skin (not the wound bed itself) alongside the wound dressing is frequently required, managed in coordination with appropriate prescribing guidance.",
        quiz: null
      },
      {
        id: "dr16", heading: "Dressing Selection for Pressure Ulcers",
        body: "Pressure ulcer dressing selection follows the EPUAP/NPUAP staging system (detailed in the Wound Assessment module) alongside standard exudate and tissue-type principles, with pressure redistribution (appropriate support surfaces, repositioning schedules) remaining the primary preventive and therapeutic intervention rather than dressing choice alone.\n\nCategory 1 pressure injuries (non-blanchable erythema, intact skin) do not require a therapeutic dressing in the traditional sense; management is offloading the affected area and protective films or silicone foam dressings may be used prophylactically to reduce friction and shear at the site, but the dressing is preventive rather than treating an open wound.\n\nCategory 3-4 pressure injuries (full thickness tissue loss, potentially exposing bone, tendon, or muscle) frequently present with significant cavity depth requiring conformable packing materials (alginate or hydrofibre rope) to fill dead space and prevent premature surface closure over an unhealed deeper cavity, which would risk abscess formation. Deep tissue pressure injury, presenting as intact discoloured skin with the visible extent dramatically underestimating true underlying damage, should not be debrided or aggressively dressed until the full extent of tissue involvement has declared itself, typically over 1-2 weeks.",
        quiz: {
          q: "Category 1 pressure injuries (non-blanchable erythema, intact skin) are managed primarily by:",
          options: ["Applying a heavily absorbent alginate dressing", "Pressure offloading of the affected area, with protective dressings used preventively rather than therapeutically", "Surgical debridement", "Antimicrobial silver dressings"],
          answer: 1,
          explain: "Category 1 pressure injuries have intact skin with no open wound, so the primary intervention is pressure offloading and repositioning. Protective films or silicone foam may be used prophylactically to reduce friction and shear, but this is preventive use rather than treating an established open wound."
        }
      },
      {
        id: "dr17", heading: "Dressing Frequency, Wear Time, and Cost-Effectiveness",
        body: "Dressing change frequency should be determined by exudate volume and clinical need, not by arbitrary scheduling or habit. Excessively frequent dressing changes disrupt the wound bed temperature and the developing healing microenvironment, cause unnecessary trauma to fragile new tissue and periwound skin, increase nursing time and patient discomfort, and substantially increase the overall cost of wound care delivery.\n\nModern advanced dressings are specifically designed for extended wear time: foam dressings typically 3-7 days, hydrofibre dressings 3-7 days depending on exudate, compared with daily changes historically required for basic gauze dressings. This extended wear-time capability is a major driver of the genuine cost-effectiveness of advanced dressings despite their higher unit cost compared with basic gauze, since total cost of wound care includes nursing time, dressing materials, and patient travel or appointment burden, not unit dressing cost in isolation.\n\nA pragmatic clinical principle: if a dressing requires changing more frequently than its designed wear time due to strikethrough (exudate visible on the outer surface of the dressing) or leakage, this indicates the dressing's absorptive capacity is mismatched to the wound's current exudate level, and the dressing type or size should be reconsidered rather than simply increasing change frequency of an inadequate dressing.",
        quiz: null
      },
      {
        id: "dr18", heading: "Allergy, Sensitivity, and Adverse Reactions to Dressings",
        body: "Contact dermatitis to dressing components, while uncommon, does occur and should be considered whenever periwound skin deteriorates with new erythema, itching, or vesiculation following dressing application, distinguishing this from infection or maceration which present differently and require different management.\n\nAdhesive-related skin injury, increasingly recognised as a distinct clinical entity, includes medical adhesive-related skin injury (MARSI) from repeated dressing adhesive application and removal, particularly in patients with fragile skin (elderly patients, those on long-term corticosteroids, oedematous limbs). Silicone-adhesive technologies significantly reduce MARSI risk compared with traditional acrylic adhesives, supporting their preferential use in high-risk patient groups.\n\nIodine sensitivity, while genuine sensitivity is less common than perceived, should be specifically asked about before using iodine-based products, alongside any history of thyroid disease where prolonged or extensive iodine-containing dressing use carries theoretical risk of systemic iodine absorption affecting thyroid function. Silver sensitivity is rare but documented; argyria (skin discolouration from silver deposition) is a theoretical concern with very prolonged silver dressing use but is not clinically significant with standard short-term (1-2 week) use guided by appropriate infection-status reassessment.",
        quiz: null
      },
      {
        id: "dr19", heading: "Emerging Dressing Technologies and the Evidence Hierarchy",
        body: "Bioengineered skin substitutes (Apligraf, Dermagraft) provide living or acellular extracellular matrix scaffolds intended to deliver growth factors and cellular components directly to stalled chronic wounds, reserved for wounds with non-advancing edges at 4 weeks despite optimal standard care, reflecting their significantly higher cost relative to standard advanced dressings.\n\nGrowth factor therapies, specifically becaplermin (recombinant human PDGF-BB, Regranex), have FDA approval specifically for neuropathic diabetic foot ulcers not responding to standard wound care, with RCT evidence demonstrating a 43% improvement in complete healing rates compared with placebo gel (Wieman et al., 1998, Diabetes Care) — representing one of the few topical wound therapies with this level of specific regulatory approval and trial evidence.\n\nWhen evaluating any new or emerging dressing technology, apply a consistent evidence hierarchy: systematic reviews and meta-analyses (highest level), individual RCTs, then cohort and observational studies, with manufacturer-funded case series and individual case reports carrying the least weight despite often being the most prominently marketed evidence type for newer products. Cochrane reviews specifically for wound care interventions provide a particularly valuable, regularly updated, independent evidence source for evaluating dressing categories against this hierarchy.",
        quiz: {
          q: "Becaplermin (recombinant PDGF-BB) demonstrated what improvement in complete healing rates compared with placebo in the pivotal trial?",
          options: ["15%", "28%", "43%", "65%"],
          answer: 2,
          explain: "Wieman et al. (1998, Diabetes Care) demonstrated a 43% improvement in complete healing rates with becaplermin gel compared with placebo gel in neuropathic diabetic foot ulcers, supporting its specific FDA approval for this indication when standard wound care has not achieved adequate progress."
        }
      },
      {
        id: "dr20", heading: "Building an Evidence-Based Dressing Formulary",
        body: "A rational, evidence-based approach to dressing selection in everyday practice does not require memorising every available branded product, but rather understanding the core mechanism, indication, and evidence base for each dressing category covered in this course, then selecting the category appropriate to the wound's current presentation at each assessment.\n\nA practical decision sequence: first confirm aetiology and ensure the primary intervention (offloading, compression, pressure redistribution) is addressed; second, assess tissue type and debride if appropriate; third, assess exudate level and select the dressing category matched to that level (hydrogel for dry, foam for moderate, alginate or hydrofibre for heavy); fourth, assess for clinical infection using NERDS/STONEES criteria and add an antimicrobial dressing only if criteria are met; fifth, reassess at every dressing change and adjust the category as the wound's exudate and tissue type change through the healing trajectory.\n\nNo dressing category is inherently superior in isolation from this clinical reasoning process — a foam dressing applied to a dry wound, or a hydrogel applied to a heavily exuding wound, will both produce poor outcomes regardless of the underlying evidence supporting that dressing category for its correct indication. The skill being assessed throughout this course is matching evidence-based dressing properties to the individual wound's actual current presentation, reassessed and adjusted at every encounter rather than fixed at the first assessment.",
        quiz: null
      }
    ],
    exam: [
      { q: "Alginate dressings achieve their gelling action through:", opts: ["Simple water absorption", "Calcium-sodium ion exchange with wound exudate", "Enzymatic breakdown of fibres", "Reaction with atmospheric oxygen"], a: 1, exp: "Alginate dressings work through ion exchange: sodium ions in wound exudate exchange with calcium ions in the dressing, converting the fibrous structure into a soft cohesive gel. This also provides a mild haemostatic effect from the calcium release." },
      { q: "Hydrofibre dressings are preferred over alginates under compression bandaging or offloading devices because they:", opts: ["Are cheaper to manufacture", "Retain absorbed fluid even under pressure, unlike alginate gel which can be expressed out", "Have antimicrobial properties alginates lack", "Require less frequent changing"], a: 1, exp: "Hydrofibre dressings retain absorbed fluid even under the compression of bandaging or offloading devices, whereas alginate gel can be expressed back out under pressure, risking lateral leakage and periwound maceration." },
      { q: "Hydrogel dressings are specifically contraindicated in:", opts: ["Dry necrotic wounds requiring debridement", "Moderately to heavily exuding wounds, where they would worsen maceration", "Wounds requiring autolytic debridement", "Minimally exuding wounds with sloughy tissue"], a: 1, exp: "Hydrogels donate moisture rather than absorb it. In moderately to heavily exuding wounds, this moisture-donating action worsens maceration of the wound bed and periwound skin. They are correctly indicated for dry or minimally exuding wounds requiring rehydration." },
      { q: "Nanocrystalline silver dressings are indicated for:", opts: ["Routine prophylactic use on all chronic wounds", "Clinically infected or critically colonised wounds, not routine uncomplicated wound care", "Dry wounds requiring rehydration", "Wounds with no exudate"], a: 1, exp: "Silver dressings are indicated specifically for clinically infected or critically colonised wounds (assessed via NERDS/STONEES criteria), not for routine use on uncomplicated wounds, where the cost is not justified by the evidence base." },
      { q: "Cadexomer iodine differs from simple povidone-iodine antiseptic solution because it:", opts: ["Has no antimicrobial properties", "Releases iodine slowly and continuously as beads absorb exudate, providing sustained action plus absorption", "Is contraindicated in chronic wounds", "Cannot be used near venous leg ulcers"], a: 1, exp: "Cadexomer iodine uses a starch-polymer bead matrix that absorbs exudate while releasing iodine in a slow, sustained manner, combining genuine fluid management with prolonged antimicrobial action, including documented activity against biofilm." },
      { q: "Medical-grade Manuka honey owes part of its distinctive antibacterial activity to elevated levels of:", opts: ["Hydrogen peroxide alone", "Methylglyoxal, derived from dihydroxyacetone unique to Leptospermum nectar", "Silver ions", "Iodine compounds"], a: 1, exp: "Methylglyoxal, present at unusually high concentrations in Manuka honey due to dihydroxyacetone in Leptospermum scoparium nectar, provides additional broad-spectrum antibacterial activity beyond the hydrogen peroxide and osmotic mechanisms present in honey generally." },
      { q: "The standard NPWT pressure setting for acute wounds with healthy tissue is:", opts: ["-25mmHg", "-75mmHg", "-125mmHg continuous", "-200mmHg"], a: 2, exp: "-125mmHg continuous is standard for acute wounds with healthy tissue. -75mmHg (continuous or intermittent) is reserved for more chronic or fragile wound beds that may not tolerate the higher standard pressure." },
      { q: "Collagen-containing dressings such as Promogran work by:", opts: ["Directly killing bacteria", "Providing exogenous collagen that absorbs excess matrix metalloproteinases, protecting the wound's own growth factors from degradation", "Donating moisture to dry wounds", "Providing mechanical compression"], a: 1, exp: "Chronic wounds have elevated matrix metalloproteinases (MMPs) that degrade growth factors needed for healing. Collagen dressings provide an exogenous collagen substrate that MMPs preferentially bind and degrade instead, protecting the wound's own healing machinery." },
      { q: "PHMB dressings are notable among antimicrobial options because:", opts: ["They are the only effective option against Pseudomonas", "No documented bacterial resistance has developed despite over two decades of use", "They cannot be used on chronic wounds", "They have no activity against MRSA"], a: 1, exp: "PHMB has been used extensively for more than two decades in wound care without documented bacterial resistance development, an increasingly valued property given growing antimicrobial stewardship concerns." },
      { q: "Becaplermin (recombinant PDGF-BB) is specifically FDA-approved for:", opts: ["All chronic wound types", "Neuropathic diabetic foot ulcers not responding to standard wound care", "Venous leg ulcers only", "Pressure ulcers only"], a: 1, exp: "Becaplermin (Regranex) has specific FDA approval for neuropathic diabetic foot ulcers not responding to standard wound care, with RCT evidence (Wieman et al., 1998) demonstrating 43% improvement in complete healing versus placebo." }
    ]
  }
];



// ─── Helpers ───────────────────────────────────────────────────────────────
function save(data) { try { localStorage.setItem("podcpd", JSON.stringify(data)); } catch(e) {} }
function load() { try { return JSON.parse(localStorage.getItem("podcpd") || "{}"); } catch(e) { return {}; } }
function readingMins(body) { return Math.max(1, Math.ceil((body||"").split(" ").length / 200)); }

const MOBILE_CSS = [
"@media (max-width: 640px) {",
"  .pcpd-hero-h1 { font-size: 1.7rem !important; }",
"  .pcpd-hero-pad { padding: 2.5rem 1.25rem 2rem !important; }",
"  .pcpd-grid { grid-template-columns: 1fr !important; padding: 1.5rem 1rem !important; }",
"  .pcpd-pricing-grid { grid-template-columns: 1fr !important; }",
"  .pcpd-stats-row > div { padding: 0.6rem 1rem 0.6rem 0 !important; margin-right: 1rem !important; }",
"  .pcpd-slide-card { padding: 1.25rem 1.1rem !important; }",
"  .pcpd-cert-wrap { padding: 1.25rem 0.75rem !important; }",
"  .pcpd-cert-inner { padding: 1.25rem 1rem !important; }",
"  .pcpd-cert-grid { grid-template-columns: 1fr !important; }",
"  .pcpd-cert-sig { grid-template-columns: 1fr !important; gap: 0.5rem !important; }",
"  .pcpd-cert-foot { flex-direction: column !important; align-items: center !important; gap: 0.75rem !important; }",
"  .pcpd-progress-card { padding: 0.75rem 1rem !important; }",
"  .pcpd-nav-desktop { display: none !important; }",
"  .pcpd-quiz-opt { font-size: 0.82rem !important; padding: 9px 11px !important; }",
"  .pcpd-readerwrap { padding: 1rem 0.6rem !important; }",
"  .pcpd-footer { flex-direction: column !important; text-align: center !important; gap: 1.25rem !important; }",
"  .pcpd-footer-links { justify-content: center !important; flex-wrap: wrap !important; }",
"  .pcpd-trust-row { font-size: 0.7rem !important; gap: 0.85rem !important; }",
"  .pcpd-course-meta { flex-wrap: wrap !important; gap: 0.5rem !important; }",
"  .pcpd-exam-card { padding: 1.5rem 1.1rem !important; }",
"  .pcpd-name-modal { padding: 1.75rem 1.25rem !important; margin: 0 0.75rem !important; }",
"  .pcpd-bookmarks-panel { width: 100% !important; }",
"}",
"@media (max-width: 400px) {",
"  .pcpd-hero-h1 { font-size: 1.45rem !important; }",
"  .pcpd-nav-badges { display: none !important; }",
"}",
"@media print {",
"  nav, .pcpd-no-print { display: none !important; }",
"  body, .pcpd-page-root { background: #fff !important; }",
"  .pcpd-cert-wrap { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }",
"  .pcpd-cert-print-area { display: block !important; }",
"}"
].join("\n");

export default function App() {
  const [screen, setScreen] = useState("home");
  const [course, setCourse] = useState(null);
  const [slide, setSlide] = useState(0);
  const [quizAns, setQuizAns] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [examAnswers, setExamAnswers] = useState({});
  const [examDone, setExamDone] = useState(false);
  const [examScore, setExamScore] = useState(null);
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingCourse, setPendingCourse] = useState(null);
  const [progress, setProgress] = useState({});
  const [notepad, setNotepad] = useState("");
  const [showNotepad, setShowNotepad] = useState(false);
  const [noteSavedFlash, setNoteSavedFlash] = useState(false);
  const noteSaveTimer = useRef(null);
  const [confetti, setConfetti] = useState(false);
  const [faq, setFaq] = useState(null);
  const [bookmarks, setBookmarks] = useState({});
  const [reflections, setReflections] = useState({});
  const [reflectInput, setReflectInput] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [revisionIdx, setRevisionIdx] = useState(0);
  const [revisionAns, setRevisionAns] = useState(null);
  const [revisionDone, setRevisionDone] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // New features
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(1); // multiplier
  const [studySeconds, setStudySeconds] = useState({});
  const [timerActive, setTimerActive] = useState(false);
  const [preQuiz, setPreQuiz] = useState(null); // null | "active" | "done"
  const [preAnswers, setPreAnswers] = useState({});
  const [preSubmitted, setPreSubmitted] = useState(false);
  const [showRefs, setShowRefs] = useState(false);
  const [courseFilter, setCourseFilter] = useState("all");
  const [courseSearch, setCourseSearch] = useState("");
  const [unlockedCourses, setUnlockedCourses] = useState({});
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [codeEntryFor, setCodeEntryFor] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [showTermsGate, setShowTermsGate] = useState(false);
  const [pendingBuyUrl, setPendingBuyUrl] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const canvasRef = useRef(null);
  const topRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const d = load();
    if (d.userName) setUserName(d.userName);
    if (d.progress) setProgress(d.progress);
    if (d.notepad) setNotepad(d.notepad);
    if (d.bookmarks) setBookmarks(d.bookmarks);
    if (d.reflections) setReflections(d.reflections);
    if (d.studySeconds) setStudySeconds(d.studySeconds);
    if (d.darkMode) setDarkMode(d.darkMode);
    if (d.fontSize) setFontSize(d.fontSize);
    if (d.unlockedCourses) setUnlockedCourses(d.unlockedCourses);
    if (d.hasFullAccess) setHasFullAccess(d.hasFullAccess);
  }, []);

  // Study timer
  useEffect(() => {
    if (screen === "course" && !revisionMode) {
      setTimerActive(true);
      timerRef.current = setInterval(() => {
        setStudySeconds(prev => {
          const cid = course?.id || "misc";
          const updated = { ...prev, [cid]: (prev[cid] || 0) + 1 };
          const d = load(); d.studySeconds = updated; save(d);
          return updated;
        });
      }, 1000);
    } else {
      setTimerActive(false);
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, revisionMode, course?.id]);

  // Warn before leaving with unsaved exam progress
  useEffect(() => {
    function handler(e) {
      const examInProgress = screen === "exam" && Object.keys(examAnswers).length > 0 && !examDone;
      if (examInProgress) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [screen, examAnswers, examDone]);

  // Keyboard nav
  useEffect(() => {
    if (screen !== "course") return;
    function onKey(e) {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight" && canNext && !isLastSlide) goNext();
      if (e.key === "ArrowLeft" && slide > 0) goPrev();
      if (e.key === "b" || e.key === "B") { if (course && pg) toggleBookmark(course.id, pg.id); }
      if (e.key === "d" || e.key === "D") toggleDark();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Confetti
  useEffect(() => {
    if (!confetti || !canvasRef.current) return;
    const c = canvasRef.current, ctx = c.getContext("2d");
    c.width = window.innerWidth; c.height = window.innerHeight;
    const cols = ["#2B7FDD","#00B4C5","#D4A017","#1A7A4A","#C0392B","#9B59B6"];
    const pts = Array.from({length:110}, () => ({ x:Math.random()*c.width, y:Math.random()*-300, w:Math.random()*10+4, h:Math.random()*6+3, r:Math.random()*Math.PI*2, dr:(Math.random()-.5)*.15, vx:(Math.random()-.5)*3, vy:Math.random()*3+2, col:cols[Math.floor(Math.random()*cols.length)], op:1 }));
    let frame=0, raf;
    function draw() {
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.r+=p.dr; if(frame>80)p.op=Math.max(0,p.op-.015); ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.globalAlpha=p.op; ctx.fillStyle=p.col; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore(); });
      frame++; if(frame<160) raf=requestAnimationFrame(draw); else setConfetti(false);
    }
    raf=requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [confetti]);

  function goTop() { if(topRef.current) topRef.current.scrollIntoView({behavior:"smooth"}); }
  function toggleDark() { setDarkMode(p => { const next=!p; const d=load(); d.darkMode=next; save(d); return next; }); }
  function cycleFontSize() { setFontSize(p => { const next = p >= 1.2 ? 0.9 : p + 0.1; const d=load(); d.fontSize=next; save(d); return Math.round(next*10)/10; }); }

  function isCourseUnlocked(c) {
    return hasFullAccess || !!unlockedCourses[c.id];
  }
  function submitCode() {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    if (code === BUNDLE_CODE.toUpperCase()) {
      setHasFullAccess(true);
      const d = load(); d.hasFullAccess = true; save(d);
      setCodeEntryFor(null); setCodeInput(""); setCodeError("");
      if (codeEntryFor) { startCourse(codeEntryFor); }
      return;
    }
    const target = codeEntryFor;
    if (target && ACCESS_CODES[target.id] && code === ACCESS_CODES[target.id].toUpperCase()) {
      const next = { ...unlockedCourses, [target.id]: true };
      setUnlockedCourses(next);
      const d = load(); d.unlockedCourses = next; save(d);
      setCodeEntryFor(null); setCodeInput(""); setCodeError("");
      startCourse(target);
      return;
    }
    setCodeError("That code isn't valid for this course. Codes are emailed after purchase — if it's been more than 24 hours, contact amirpodiatrist@gmail.com");
  }
  function openCourse(c) {
    if (!isCourseUnlocked(c)) { startCourse(c); return; }
    if (!userName) { setPendingCourse(c); setShowNameModal(true); return; }
    startCourse(c);
  }
  function startCourse(c) {
    setCourse(c); setSlide(0); setQuizAns(null); setQuizDone(false);
    setExamAnswers({}); setExamDone(false); setExamScore(null);
    setRevisionMode(false);
    const alreadyDidPreQuiz = !!(progress[c.id] && progress[c.id].preQuizDone);
    setPreQuiz(alreadyDidPreQuiz ? "done" : null);
    setPreAnswers({}); setPreSubmitted(false);
    setScreen("course"); goTop();
  }
  function saveName() {
    const n=nameInput.trim(); if(!n) return;
    setUserName(n); const d=load(); d.userName=n; save(d);
    setShowNameModal(false);
    if(pendingCourse) { startCourse(pendingCourse); setPendingCourse(null); }
  }
  function markSlide(courseId, slideId) {
    setProgress(prev => {
      const cp=prev[courseId]||{done:[]}; if(cp.done.includes(slideId)) return prev;
      const updated={...prev,[courseId]:{...cp,done:[...cp.done,slideId]}};
      const d=load(); d.progress=updated; save(d); return updated;
    });
  }
  function toggleBookmark(courseId, slideId) {
    const key=courseId+"_"+slideId;
    setBookmarks(prev => {
      const next={...prev};
      if(next[key]) delete next[key];
      else next[key]={courseId,slideId,title:course?.slides[slide]?.heading,ts:Date.now()};
      const d=load(); d.bookmarks=next; save(d); return next;
    });
  }
  function startPurchase(url) {
    setPendingBuyUrl(url);
    setTermsAccepted(false);
    setShowTermsGate(true);
  }
  function saveReflection() {
    if(!course) return;
    setReflections(prev => {
      const next={...prev,[course.id]:{text:reflectInput,date:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}),course:course.title,cpd:course.cpd}};
      const d=load(); d.reflections=next; save(d); return next;
    });
  }

  const pages = course ? course.slides : [];
  const pg = pages[slide];
  const isLastSlide = slide === pages.length - 1;
  const cp = course ? (progress[course.id]||{done:[]}) : {done:[]};
  const slidesDone = cp.done || [];
  const courseComplete = course ? slidesDone.length >= pages.length : false;
  const hasQuiz = pg && pg.quiz;
  const canNext = !hasQuiz || quizDone;
  const isBookmarked = pg && bookmarks[course?.id+"_"+pg.id];
  const allBookmarks = Object.values(bookmarks);
  const totalCPD = COURSES.reduce((s,c) => { const p=progress[c.id]||{}; return p.examScore>=70?s+c.cpd:s; }, 0);
  const totalStudyMins = Math.round(Object.values(studySeconds).reduce((a,b)=>a+b,0) / 60);

  function goNext() {
    if (!isCourseUnlocked(course) && slide === 0) { setCodeEntryFor(course); setCodeInput(""); setCodeError(""); return; }
    markSlide(course.id,pg.id); setSlide(s=>s+1); setQuizAns(null); setQuizDone(false); setShowRefs(false); goTop();
  }
  function goPrev() { setSlide(s=>s-1); setQuizAns(null); setQuizDone(false); setShowRefs(false); goTop(); }

  function submitExam() {
    let correct=0; course.exam.forEach((q,i)=>{if(examAnswers[i]===q.a)correct++;});
    const pct=Math.round((correct/course.exam.length)*100);
    setExamScore(pct); setExamDone(true);
    if(pct>=70) {
      const now=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
      const d=load(); d.progress=d.progress||{};
      d.progress[course.id]=d.progress[course.id]||{done:[]};
      d.progress[course.id].examScore=pct; d.progress[course.id].date=now;
      save(d); setProgress(d.progress); setConfetti(true);
    }
  }

  // Theme colours
  const dm = darkMode;
  const bg = dm?"#0F1923":"#F0F4F8";
  const surface = dm?"#1A2535":"#fff";
  const border = dm?"#2A3A50":"#DDE5EF";
  const text = dm?"#C8DCF0":"#1a2332";
  const muted = dm?"#5C7A90":"#5C718A";
  const navBg = dm?"#060D14":"#0B1F35";

  const baseFs = fontSize;
  const S = {
    page:{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:bg, minHeight:"100vh", color:text, fontSize:baseFs+"rem" },
    nav:{ background:navBg, padding:"0 1.5rem", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 16px rgba(0,0,0,.35)", borderBottom:"1px solid rgba(255,255,255,.06)" },
    navBtn:{ background:"none", border:"none", color:"#6A9AB0", fontSize:".82rem", fontWeight:500, cursor:"pointer", padding:"6px 10px", borderRadius:7 },
    navBtnOn:{ color:"#fff", background:"rgba(255,255,255,.1)" },
    navCPD:{ background:"rgba(0,180,197,.15)", border:"1px solid rgba(0,180,197,.3)", color:"#00B4C5", padding:"4px 11px", borderRadius:20, fontSize:".75rem", fontWeight:700 },
    card:{ background:surface, borderRadius:14, overflow:"hidden", cursor:"pointer", boxShadow:dm?"0 2px 14px rgba(0,0,0,.3)":"0 2px 14px rgba(11,31,53,.07)", border:"1.5px solid "+border },
    slideCard:{ background:surface, borderRadius:12, padding:"2rem 2.5rem", boxShadow:dm?"0 2px 14px rgba(0,0,0,.3)":"0 2px 14px rgba(11,31,53,.07)", marginBottom:"1.25rem", border:"1.5px solid "+border },
    quizBox:{ background:dm?"rgba(43,127,221,.1)":"linear-gradient(135deg,#EBF5FB,#E4EFF9)", border:"2px solid "+(dm?"rgba(43,127,221,.3)":"#B8D3ED"), borderRadius:12, padding:"1.5rem", marginTop:"1.75rem" },
    progressCard:{ background:surface, borderRadius:12, padding:".9rem 1.4rem", marginBottom:"1.25rem", boxShadow:dm?"0 2px 10px rgba(0,0,0,.3)":"0 2px 10px rgba(11,31,53,.06)", border:"1.5px solid "+border },
    btnP:{ background:"#2B7FDD", color:"#fff", border:"none", padding:"11px 22px", borderRadius:9, fontWeight:600, fontSize:".9rem", cursor:"pointer" },
    btnO:{ background:"transparent", color:"#fff", border:"1.5px solid rgba(255,255,255,.25)", padding:"11px 22px", borderRadius:9, fontWeight:600, fontSize:".9rem", cursor:"pointer", textDecoration:"none", display:"inline-block" },
    btnG:{ background:"transparent", color:"#2B7FDD", border:"2px solid #2B7FDD", padding:"9px 18px", borderRadius:9, fontWeight:600, fontSize:".85rem", cursor:"pointer" },
    wrap:{ maxWidth:900, margin:"0 auto", padding:"1.5rem 1rem" },
  };

  function renderBody(txt) {
    if(!txt) return null;
    return txt.split("\n\n").map((para,i) => {
      if(!para.trim()) return null;
      const parts=para.split(/(\*\*[^*]+\*\*)/g);
      return <p key={i} style={{marginBottom:"1rem",lineHeight:1.85,fontSize:baseFs*0.96+"rem",color:dm?"#C0D8F0":"#2C3E50"}}>{parts.map((s,j)=>s.startsWith("**")&&s.endsWith("**")?<strong key={j} style={{color:dm?"#E8F4FF":"#0B1F35"}}>{s.slice(2,-2)}</strong>:s)}</p>;
    });
  }

  // Per-course references (key evidence base)
  const REFS = {
    diabetic:["IWGDF Guidelines 2023 — iwgdfguidelines.org","NICE NG19 (2023) Diabetic foot problems — nice.org.uk/guidance/ng19","Grayson ML et al. (1995) Probing to bone in infected DFUs. JAMA 273(9):721-723","Armstrong DG et al. (2003) Activity patterns of patients with DFUs. Diabetes Care 26(9):2595-2597","Booth J and Young MJ (2000) Differences in responses to the 10g SWM. Diabetes Care 23(8):1200","Ince P et al. (2008) Use of the SINBAD system to predict healing of chronic foot ulcers. Diabetes Care 31(12)","Bus SA et al. (2016) IWGDF guidance on footwear and offloading. Diabetes Metab Res Rev 32(S1):25-36","James GA et al. (2008) Biofilm in chronic wounds. Wound Repair Regen 16(1):37-44"],
    anatomy:["Riddle DL et al. (2003) Risk factors for plantar fasciopathy. JBJS 85(5):872-877","Hicks JH (1954) The mechanics of the foot II. J Anatomy 88(1):25-30","Sarrafian SK and Kelikian AS (2011) Anatomy of the Foot and Ankle. 3rd ed. LWW","Perry J and Burnfield JM (2010) Gait Analysis: Normal and Pathological Function. 2nd ed. SLACK","Lawrence SJ and Botte MJ (1993) Jones fractures and related fractures. Foot Ankle Int 14(7):358-365","Thompson TC (1962) A test for rupture of the tendo achillis. Acta Orthop Scand 32:461-465"],
    nails:["Eekhof JAH et al. (2014) Interventions for ingrowing toenails. Cochrane Database Syst Rev 4:CD001541","Erdogan FG et al. (2011) Conservative treatment of ingrown toenails. EJDV 25(1):60-64","Baran R et al. (2007) Onychomycosis combination therapy. BJDV 156(5):921-926","British National Formulary (current edition) — bnf.nice.org.uk","Ameen M et al. (2001) Onychomycosis effective management. Clin Exp Dermatol 26(6):509-514"],
    wounds:["Schultz GS et al. (2003) Wound bed preparation: a systematic approach. Wound Repair Regen 11(S1):S1-S28","James GA et al. (2008) Biofilm in chronic wounds. Wound Repair Regen 16(1):37-44","Sheehan P et al. (2003) Percent change in wound area at 4 weeks as predictor of healing. Diabetes Care 26(6):1879-1882","Gethin G and Cowman S (2009) Manuka honey vs hydrogel for sloughy VLUs. J Wound Care 18(7):290-295","Wieman TJ et al. (1998) Effectiveness of becaplermin gel for DFUs. Diabetes Care 21(5):822-827","Murray HJ et al. (1996) The relationship between callus and high pressures in DFUs. Diabet Med 13(11):979-982","EPUAP/NPUAP/PPPIA (2019) International pressure injury guidelines"],
    biomechanics:["Riddle DL et al. (2003) Risk factors for plantar fasciopathy. JBJS 85(5):872-877","Alfredson H et al. (1998) Heavy-load eccentric calf training for Achilles tendinosis. AJSM 26(3):360-366","Cook JL and Purdam CR (2009) Is tendon pathology a continuum? BJSM 43(6):409-416","Beyer R et al. (2015) Heavy slow resistance versus eccentric training for Achilles. AJSM 43(7):1704-1711","McPoil TG and Hunt GC (2014) Evaluation and management of foot and ankle disorders. JOSPT 44(7):435-443","Rompe JD et al. (2010) Shock wave therapy for chronic plantar fasciopathy. Br J Sports Med 44(15):1173-1184","Fredericson M et al. (2000) Hip abductor weakness in runners with iliotibial band syndrome. Clin J Sport Med 10(3):169-175"],
    paediatric:["Staheli LT (2004) Practice of Pediatric Orthopedics. 2nd ed. Lippincott Williams and Wilkins","Cockayne S et al. (2011) Cryotherapy versus salicylic acid for treatment of plantar warts. BMJ 342:d3271","Ponseti IV (1996) Congenital Clubfoot: Fundamentals of Treatment. Oxford University Press","Sass P and Hassan G (2003) Lower extremity abnormalities in children. Am Fam Physician 68(3):461-468","Wenger DR et al. (1989) Corrective shoes and inserts as treatment for flexible flatfoot. JBJS 71(6):800-810"],
    sports:["Lauersen JB et al. (2014) The effectiveness of exercise interventions to prevent sports injuries. Br J Sports Med 48(11):871-877","Barton CJ et al. (2016) Hip and knee strengthening exercises for patellofemoral pain. Br J Sports Med 50(14):844-852","Mountjoy M et al. (2018) IOC consensus statement on Relative Energy Deficiency in Sport (RED-S). Br J Sports Med 52(11):687-697","Fredericson M et al. (1995) Tibial stress reaction in runners: MRI grading. Am J Sports Med 23(4):472-481","Malisoux L et al. (2020) Effect of shoe cushioning on landing impact and running economy. Footwear Science 12(3)"],
    dressings:["Winter GD (1962) Formation of the scab and the rate of epithelialisation. Nature 193:293-294","O'Meara S et al. (2010) Antibiotics and antiseptics for venous leg ulcers. Cochrane Database Syst Rev 1:CD003557","Jull AB et al. (2015) Honey as a topical treatment for wounds. Cochrane Database Syst Rev 3:CD005083","Wieman TJ et al. (1998) Effectiveness of becaplermin gel for DFUs. Diabetes Care 21(5):822-827","White R (2008) Evidence for atraumatic soft silicone wound dressing use. J Wound Care 17(7)","Meaume S et al. (2003) A study to compare a new self-adherent soft silicone dressing with a self-adherent polymer dressing in stage II pressure ulcers. J Wound Care 12(3)","EPUAP/NPUAP/PPPIA (2019) International pressure injury guidelines","Sibbald RG et al. (2011) Special considerations in wound bed preparation. Adv Skin Wound Care 24(9)"],
  };

  // Pre-course self-assessment questions (3 per course)
  const PRE_QUIZ = {
    diabetic:[
      {q:"How often should a patient with diabetic peripheral neuropathy AND peripheral arterial disease be reviewed?",opts:["Annually","Every 6 months","Every 3 months","Monthly"],a:2},
      {q:"What is the positive predictive value of the probe-to-bone test for osteomyelitis?",opts:["45%","65%","75%","89%"],a:3},
      {q:"Approximately what proportion of waking hours do patients wear removable cast walkers?",opts:["90%","70%","50%","28%"],a:3},
    ],
    anatomy:[
      {q:"The windlass mechanism was first described by:",opts:["Root (1971)","Hicks (1954)","Perry (1992)","Manter (1941)"],a:1},
      {q:"Ankle equinus is the strongest risk factor for plantar fasciopathy — what odds ratio?",opts:["4.5","9.0","23.3","45.0"],a:2},
      {q:"The ATFL is disrupted in approximately what proportion of lateral ankle sprains?",opts:["40%","60%","85%","95%"],a:2},
    ],
    nails:[
      {q:"What proportion of clinically dystrophic toenails are NOT fungal in origin?",opts:["10%","25%","50%","75%"],a:2},
      {q:"Phenolised PNA achieves recurrence rates of approximately:",opts:["1-4%","15-20%","33-50%","60-70%"],a:0},
      {q:"Why is adrenaline contraindicated in digital ring blocks?",opts:["Reduces anaesthetic duration","Risks irreversible digital arterial ischaemia","Increases systemic toxicity","Interacts with phenol"],a:1},
    ],
    wounds:[
      {q:"Biofilm is present in what proportion of chronic wounds?",opts:["25%","50%","78%+","95%+"],a:2},
      {q:"What ABPI is required before applying full graduated compression for VLUs?",opts:["0.5+","0.6+","0.8+","1.0+"],a:2},
      {q:"Wound tensile strength plateaus at approximately what proportion of normal skin?",opts:["20%","50%","80%","100%"],a:2},
    ],
    biomechanics:[
      {q:"Stance phase occupies approximately what proportion of the gait cycle?",opts:["40%","50%","60%","70%"],a:2},
      {q:"The Alfredson eccentric protocol for Achilles tendinopathy: correct dosing?",opts:["3×10 daily 6 weeks","3×15 twice daily 12 weeks","5×20 daily 8 weeks","2×20 three times/week"],a:1},
      {q:"ESWT for chronic plantar fasciopathy achieves approximately:",opts:["20-30% good outcomes","40-50%","60-80%","90%+"],a:2},
    ],
    dressings:[
      {q:"Which dressing type works through calcium-sodium ion exchange to form a gel?",opts:["Hydrogel","Alginate","Film dressing","Foam dressing"],a:1},
      {q:"Hydrofibre dressings are preferred under compression bandaging because they:",opts:["Are cheaper","Retain fluid even under pressure","Have no absorbency","Cannot be cut to size"],a:1},
      {q:"The standard NPWT pressure setting for acute wounds is:",opts:["-25mmHg","-75mmHg","-125mmHg","-200mmHg"],a:2},
    ],
    paediatric:[
      {q:"What proportion of metatarsus adductus cases resolve spontaneously by age 4?",opts:["50-60%","65-75%","85-90%","95-100%"],a:2},
      {q:"Severs disease (calcaneal apophysitis) has what prognosis?",opts:["Variable","Good with treatment","Universally excellent on apophyseal fusion","Poor, usually needs surgery"],a:2},
      {q:"A limping child who refuses to weight-bear with fever requires:",opts:["Routine review in 2 weeks","Reassurance","Same-day medical assessment","X-ray only"],a:2},
    ],
    sports:[
      {q:"Vertical ground reaction force during running reaches approximately what proportion of body weight?",opts:["100-120%","150-180%","200-300%","350-400%"],a:2},
      {q:"Acute:chronic workload ratios above what threshold are linked to elevated injury risk?",opts:["1.0","1.2","1.5","2.5"],a:2},
      {q:"Iliotibial band compression occurs at approximately what knee flexion angle?",opts:["10 degrees","30 degrees","60 degrees","90 degrees"],a:1},
    ],
  };

  // ── PRE-COURSE QUIZ ──────────────────────────────────────────────────────
  function PreCourseQuiz() {
    if(!course) return null;
    const qs=PRE_QUIZ[course.id]||[];
    if(qs.length===0) {
      setPreQuiz("done");
      const d2=load(); d2.progress=d2.progress||{}; d2.progress[course.id]=d2.progress[course.id]||{done:[]}; d2.progress[course.id].preQuizDone=true; save(d2); setProgress(d2.progress);
      return null;
    }
    const allAns=Object.keys(preAnswers).length===qs.length;
    const correct=preSubmitted?qs.filter((q,i)=>preAnswers[i]===q.a).length:0;
    return (
      <div className="pcpd-readerwrap" style={S.wrap}>
        <div style={{...S.slideCard}}>
          <div style={{textAlign:"center",marginBottom:"1.5rem",paddingBottom:"1.25rem",borderBottom:"2px solid "+border}}>
            <div style={{display:"inline-block",background:"rgba(124,58,237,.1)",color:"#7C3AED",padding:"3px 14px",borderRadius:20,fontSize:".7rem",fontWeight:700,marginBottom:".6rem"}}>Pre-Course Assessment</div>
            <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.5rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".25rem"}}>{course.title}</h2>
            <div style={{color:muted,fontSize:".85rem",lineHeight:1.6}}>Answer these 3 questions before starting to see where your knowledge currently stands. Results don't affect your course access.</div>
          </div>
          {qs.map((q,qi)=>(
            <div key={qi} style={{marginBottom:"1.5rem"}}>
              <div style={{fontWeight:600,fontSize:".97rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".75rem",lineHeight:1.5}}>Q{qi+1}. {q.q}</div>
              <div style={{display:"grid",gap:7}}>
                {q.opts.map((opt,oi)=>{
                  let bg=surface,border2="2px solid "+border,col=text,ltrBg=dm?"#2A3A50":"#EEF1F5",ltrCol=muted;
                  if(preAnswers[qi]===oi&&!preSubmitted){bg=dm?"rgba(43,127,221,.2)":"#E8F2FF";border2="2px solid #2B7FDD";col="#2B7FDD";ltrBg="#2B7FDD";ltrCol="#fff";}
                  if(preSubmitted){if(oi===q.a){bg=dm?"rgba(26,122,74,.2)":"#E6F5EE";border2="2px solid #1A7A4A";col="#1A7A4A";ltrBg="#1A7A4A";ltrCol="#fff";}else if(preAnswers[qi]===oi){bg=dm?"rgba(192,57,43,.2)":"#FDEEEC";border2="2px solid #C0392B";col="#C0392B";ltrBg="#C0392B";ltrCol="#fff";}}
                  return <button key={oi} disabled={preSubmitted} onClick={()=>{const u={...preAnswers};u[qi]=oi;setPreAnswers(u);}} style={{background:bg,border:border2,color:col,borderRadius:9,padding:"10px 14px",textAlign:"left",cursor:preSubmitted?"default":"pointer",fontSize:".86rem",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit",width:"100%"}}><span style={{width:25,height:25,borderRadius:"50%",background:ltrBg,color:ltrCol,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".67rem",fontWeight:700,flexShrink:0}}>{["A","B","C","D"][oi]}</span>{opt}</button>;
                })}
              </div>
            </div>
          ))}
          {!preSubmitted
            ? <button disabled={!allAns} onClick={()=>setPreSubmitted(true)} style={{...S.btnP,width:"100%",opacity:allAns?1:.45,cursor:allAns?"pointer":"not-allowed"}}>Submit and see results</button>
            : (
              <div>
                <div style={{background:correct===qs.length?"rgba(26,122,74,.1)":correct>0?"rgba(212,160,23,.1)":"rgba(192,57,43,.1)",border:"2px solid "+(correct===qs.length?"#1A7A4A":correct>0?"#D4A017":"#C0392B"),borderRadius:12,padding:"1rem",textAlign:"center",marginBottom:"1rem"}}>
                  <div style={{fontFamily:"Georgia,serif",fontSize:"1.5rem",color:correct===qs.length?"#1A7A4A":correct>0?"#975A00":"#C0392B",marginBottom:4}}>{correct}/{qs.length} correct</div>
                  <div style={{fontSize:".85rem",color:muted}}>{correct===qs.length?"Excellent prior knowledge! The course will consolidate and extend what you already know.":correct>0?"Some familiarity — the course will fill the gaps and deepen your understanding.":"This course will significantly build your knowledge in this area."}</div>
                </div>
                <button style={{...S.btnP,width:"100%"}} onClick={function () {
              setPreQuiz("done");
              var d = load();
              d.progress = d.progress || {};
              d.progress[course.id] = d.progress[course.id] || { done: [] };
              d.progress[course.id].preQuizDone = true;
              save(d);
              setProgress(d.progress);
            }}>Start the course →</button>
              </div>
            )
          }
        </div>
      </div>
    );
  }

  // ── REVISION MODE ─────────────────────────────────────────────────────────
  function RevisionMode() {
    if(!course) return null;
    const qs=course.slides.filter(s=>s.quiz).map(s=>({...s.quiz,slideHead:s.heading}));
    if(qs.length===0) return <div className="pcpd-readerwrap" style={S.wrap}><p>No knowledge checks in this course.</p></div>;
    if(revisionDone) return (
      <div className="pcpd-readerwrap" style={S.wrap}>
        <div style={{...S.slideCard,textAlign:"center"}}>
          <div style={{fontSize:"3rem",marginBottom:".5rem"}}>🧠</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.4rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".5rem"}}>Revision complete!</div>
          <div style={{color:muted,marginBottom:"1.5rem"}}>You worked through all {qs.length} knowledge checks.</div>
          <button style={S.btnP} onClick={()=>{setRevisionMode(false);setRevisionIdx(0);setRevisionAns(null);setRevisionDone(false);}}>Back to course</button>
        </div>
      </div>
    );
    const q=qs[revisionIdx];
    return (
      <div className="pcpd-readerwrap" style={S.wrap}>
        <button style={{...S.navBtn,color:"#2B7FDD",padding:0,marginBottom:"1.25rem"}} onClick={()=>{setRevisionMode(false);setRevisionIdx(0);setRevisionAns(null);}}>← Exit revision mode</button>
        <div className="pcpd-slide-card" style={S.slideCard}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
            <div style={{background:"rgba(124,58,237,.1)",color:"#7C3AED",padding:"3px 12px",borderRadius:20,fontSize:".7rem",fontWeight:700}}>🧠 Revision Mode</div>
            <div style={{fontSize:".78rem",color:muted}}>{revisionIdx+1} / {qs.length}</div>
          </div>
          <div style={{fontSize:".72rem",color:muted,marginBottom:".5rem"}}>{q.slideHead}</div>
          <div style={{fontWeight:600,fontSize:"1rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:"1rem",lineHeight:1.55}}>{q.q}</div>
          <div style={{display:"grid",gap:8}}>
            {q.options.map((opt,oi)=>{
              let bg=surface,brd="2px solid "+border,col=text,lBg=dm?"#2A3A50":"#DDE5EF",lC=muted;
              if(revisionAns!==null){if(oi===q.answer){bg=dm?"rgba(26,122,74,.2)":"#E6F5EE";brd="2px solid #1A7A4A";col="#1A7A4A";lBg="#1A7A4A";lC="#fff";}else if(revisionAns===oi){bg=dm?"rgba(192,57,43,.2)":"#FDEEEC";brd="2px solid #C0392B";col="#C0392B";lBg="#C0392B";lC="#fff";}}
              else if(revisionAns===oi){bg=dm?"rgba(43,127,221,.2)":"#E8F2FF";brd="2px solid #2B7FDD";col="#2B7FDD";lBg="#2B7FDD";lC="#fff";}
              return <button key={oi} disabled={revisionAns!==null} onClick={()=>setRevisionAns(oi)} style={{background:bg,border:brd,color:col,borderRadius:10,padding:"11px 14px",textAlign:"left",cursor:revisionAns!==null?"default":"pointer",fontSize:".86rem",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit",width:"100%"}}><span style={{width:26,height:26,borderRadius:"50%",background:lBg,color:lC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".68rem",fontWeight:700,flexShrink:0}}>{["A","B","C","D"][oi]}</span>{opt}</button>;
            })}
          </div>
          {revisionAns!==null&&<div style={{background:dm?"rgba(255,255,255,.05)":"#F0F4F8",borderLeft:"3px solid #2B7FDD",padding:"9px 13px",borderRadius:"0 8px 8px 0",fontSize:".8rem",color:muted,marginTop:8,lineHeight:1.65}}><strong>Explanation:</strong> {q.explain}</div>}
          {revisionAns!==null&&<button style={{...S.btnP,marginTop:"1.25rem",width:"100%"}} onClick={()=>{if(revisionIdx<qs.length-1){setRevisionIdx(i=>i+1);setRevisionAns(null);}else setRevisionDone(true);}}>{revisionIdx<qs.length-1?"Next →":"Finish revision"}</button>}
        </div>
      </div>
    );
  }

  // ── BOOKMARKS PANEL ───────────────────────────────────────────────────────
  function BookmarksPanel() {
    return (
      <div className="pcpd-bookmarks-panel" style={{position:"fixed",top:60,right:0,width:310,height:"calc(100vh - 60px)",background:surface,boxShadow:"-4px 0 24px rgba(0,0,0,.2)",zIndex:90,overflowY:"auto",padding:"1.4rem",border:"1px solid "+border}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",color:dm?"#E8F4FF":"#0B1F35",fontWeight:700}}>☆ My Bookmarks</div>
          <button onClick={()=>setShowBookmarks(false)} style={{background:"none",border:"none",fontSize:"1.2rem",cursor:"pointer",color:muted}}>×</button>
        </div>
        {allBookmarks.length===0
          ? <div style={{color:muted,fontSize:".85rem",textAlign:"center",padding:"2rem 0"}}>No bookmarks yet.<br/>Press <strong>☆ Save slide</strong> or <strong>B</strong> on any slide.</div>
          : allBookmarks.sort((a,b)=>b.ts-a.ts).map((bm,i)=>{
              const cc=COURSES.find(x=>x.id===bm.courseId);
              return <div key={i} style={{padding:".85rem",borderRadius:10,border:"1.5px solid "+border,marginBottom:".6rem",cursor:"pointer",background:dm?"#1F2F40":""}} onClick={()=>{openCourse(cc);setShowBookmarks(false);}}>
                <div style={{fontSize:".68rem",color:cc?.color||"#2B7FDD",fontWeight:700,marginBottom:2}}>{cc?.icon} {cc?.title}</div>
                <div style={{fontSize:".83rem",color:dm?"#E8F4FF":"#0B1F35",fontWeight:500}}>{bm.title}</div>
              </div>;
            })
        }
      </div>
    );
  }

  // ── COURSE READER ─────────────────────────────────────────────────────────
  function CourseReader() {
    if (!course || !pg) return null;
    if (preQuiz === null) return <PreCourseQuiz />;
    if (revisionMode) return <RevisionMode />;
    var pct = Math.round((slidesDone.length / pages.length) * 100);
    var mins = readingMins(pg.body);
    var courseStudyMins = Math.round((studySeconds[course.id] || 0) / 60);
    var refs = REFS[course.id] || [];
    var refLabel;
    return (
      <div className="pcpd-readerwrap" style={S.wrap}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem", flexWrap: "wrap", gap: 8 }}>
          <button style={{ ...S.navBtn, color: "#2B7FDD", padding: 0 }} onClick={function () { setScreen("home"); goTop(); }}>← Back to courses</button>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <button style={{ ...S.navBtn, color: isBookmarked ? "#D4A017" : muted, background: isBookmarked ? "rgba(212,160,23,.1)" : "none", border: isBookmarked ? "1px solid rgba(212,160,23,.3)" : "none", borderRadius: 8, padding: "5px 11px" }} onClick={function () { toggleBookmark(course.id, pg.id); }} title="[B] Bookmark slide">{isBookmarked ? "★ Saved" : "☆ Save"}</button>
            {courseComplete && <button style={{ ...S.navBtn, color: "#7C3AED", background: "rgba(124,58,237,.1)", border: "1px solid rgba(124,58,237,.25)", borderRadius: 8, padding: "5px 11px" }} onClick={function () { setRevisionMode(true); setRevisionIdx(0); setRevisionAns(null); setRevisionDone(false); goTop(); }}>🧠 Revise</button>}
            <button style={{ ...S.navBtn, color: "#00B4C5", background: "rgba(0,180,197,.08)", border: "1px solid rgba(0,180,197,.2)", borderRadius: 8, padding: "5px 11px" }} onClick={function () { setShowRefs(!showRefs); }}>📚 Refs</button>
          </div>
        </div>

        <div style={{ borderRadius: 12, padding: "1.4rem 1.75rem", color: "#fff", marginBottom: "1.5rem", display: "flex", gap: "1.2rem", alignItems: "flex-start", background: "linear-gradient(135deg," + course.color + "," + course.color + "CC)" }}>
          <div style={{ fontSize: "2.2rem" }}>{course.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Georgia,serif", fontSize: "1.4rem", lineHeight: 1.2, marginBottom: 4 }}>{course.title}</div>
            <div className="pcpd-course-meta" style={{ display: "flex", gap: "1rem", fontSize: ".8rem", opacity: .85, flexWrap: "wrap" }}>
              <span>{course.cpd} CPD hrs</span>
              <span>{pages.length} slides</span>
              <span>⏱ {courseStudyMins} min studied</span>
            </div>
          </div>
        </div>

        {showRefs && refs.length > 0 ? (
          <div style={{ background: dm ? "rgba(0,180,197,.08)" : "rgba(0,180,197,.06)", border: "2px solid rgba(0,180,197,.25)", borderRadius: 12, padding: "1.1rem 1.4rem", marginBottom: "1.25rem" }}>
            <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#00B4C5", marginBottom: ".65rem" }}>Key References for this Course</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".4rem" }}>
              {refs.map(function (r, i) {
                refLabel = "Ref " + (i + 1) + ":";
                return (
                  <li key={i} style={{ fontSize: ".8rem", color: muted, lineHeight: 1.6, paddingLeft: "1.1rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#00B4C5", fontWeight: 700 }}>{i + 1}.</span>
                    {r}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div className="pcpd-progress-card" style={S.progressCard}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: ".75rem", color: muted, fontWeight: 500, flexWrap: "wrap", gap: 4 }}>
            <span>Slide {slide + 1} of {pages.length} · <span style={{ color: "#2B7FDD" }}>~{mins} min read</span></span>
            <span style={{ display: "flex", gap: 12 }}><span>{pct}% complete</span>{slidesDone.length > 0 && <span style={{ color: "#1A7A4A" }}>✓ {slidesDone.length} done</span>}</span>
          </div>
          <div style={{ background: dm ? "#0F1923" : "#F0F4F8", borderRadius: 4, height: 8, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ height: "100%", width: pct + "%", background: course.color, borderRadius: 4, transition: "width .4s" }} />
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {pages.map(function (s, i) {
              return (
                <div
                  key={i}
                  title={s.heading}
                  onClick={function () {
                    if (i <= slidesDone.length) {
                      setSlide(i);
                      setQuizAns(null);
                      setQuizDone(false);
                      setShowRefs(false);
                      goTop();
                    }
                  }}
                  style={{
                    width: 9, height: 9, borderRadius: "50%",
                    background: slidesDone.includes(s.id) ? "#1A7A4A" : (i === slide ? course.color : (dm ? "#2A3A50" : "#DDE5EF")),
                    transform: i === slide ? "scale(1.35)" : "none",
                    cursor: i <= slidesDone.length ? "pointer" : "default",
                    flexShrink: 0, transition: "all .2s"
                  }}
                />
              );
            })}
          </div>
          <div style={{ marginTop: 5, fontSize: ".67rem", color: dm ? "#3A5A70" : "#bbb" }}>← → arrow keys · B to bookmark · D for dark mode</div>
        </div>

        <div className="pcpd-slide-card" style={S.slideCard}>
          {!isCourseUnlocked(course) && (
            <div style={{ background: "rgba(212,160,23,.12)", border: "1px solid rgba(212,160,23,.3)", borderRadius: 9, padding: ".7rem 1rem", marginBottom: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.1rem" }}>👀</span>
              <span style={{ fontSize: ".82rem", color: dm ? "#E8C97A" : "#7A5C10", fontWeight: 500 }}>Free preview — this is slide 1 of {pages.length}. Unlock the course to access the rest.</span>
            </div>
          )}
          <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: muted, marginBottom: ".6rem" }}>Slide {slide + 1} of {pages.length}</div>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.3rem", color: dm ? "#E8F4FF" : "#0B1F35", marginBottom: "1.25rem", lineHeight: 1.3, borderLeft: "3px solid " + course.color, paddingLeft: ".85rem" }}>{pg.heading}</h2>
          <div>{renderBody(pg.body)}</div>

          {pg.quiz ? (
            <div style={S.quizBox}>
              <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#2B7FDD", marginBottom: ".7rem" }}>🧠 Knowledge Check</div>
              <div style={{ fontWeight: 600, color: dm ? "#E8F4FF" : "#0B1F35", marginBottom: "1rem", lineHeight: 1.5 }}>{pg.quiz.q}</div>
              <div>
                {pg.quiz.options.map(function (opt, oi) {
                  var bg = dm ? "rgba(255,255,255,.04)" : "#fff";
                  var brd = "2px solid " + border;
                  var col = text;
                  var lBg = dm ? "#2A3A50" : "#EEF1F5";
                  var lC = muted;
                  if (quizAns !== null) {
                    if (oi === pg.quiz.answer) {
                      bg = dm ? "rgba(26,122,74,.2)" : "#E6F5EE"; brd = "2px solid #1A7A4A"; col = "#1A7A4A"; lBg = "#1A7A4A"; lC = "#fff";
                    } else if (quizAns === oi) {
                      bg = dm ? "rgba(192,57,43,.2)" : "#FDEEEC"; brd = "2px solid #C0392B"; col = "#C0392B"; lBg = "#C0392B"; lC = "#fff";
                    }
                  } else if (quizAns === oi) {
                    bg = dm ? "rgba(43,127,221,.2)" : "#E8F2FF"; brd = "2px solid #2B7FDD";
                  }
                  var letters = ["A", "B", "C", "D"];
                  return (
                    <button key={oi} disabled={quizDone} onClick={function () { setQuizAns(oi); if (oi === pg.quiz.answer) setQuizDone(true); }} style={{ background: bg, border: brd, color: col, borderRadius: 9, padding: "10px 14px", textAlign: "left", cursor: quizDone ? "default" : "pointer", fontSize: ".86rem", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit", width: "100%", marginBottom: 7 }} className="pcpd-quiz-opt">
                      <span style={{ width: 25, height: 25, borderRadius: "50%", background: lBg, color: lC, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".67rem", fontWeight: 700, flexShrink: 0 }}>{letters[oi]}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {quizAns !== null && <div style={{ background: dm ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.7)", borderLeft: "3px solid #2B7FDD", padding: "9px 13px", borderRadius: "0 8px 8px 0", fontSize: ".82rem", color: muted, marginTop: 9, lineHeight: 1.65 }}><strong>Explanation:</strong> {pg.quiz.explain}</div>}
              {quizDone && <div style={{ color: "#1A7A4A", fontWeight: 600, fontSize: ".82rem", marginTop: ".75rem" }}>✅ Correct — you can continue</div>}
              {quizAns !== null && !quizDone && <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginTop: ".75rem" }}><span style={{ fontSize: ".8rem", color: "#C0392B" }}>Incorrect — try again.</span><button onClick={function () { setQuizAns(null); }} style={{ background: "#2B7FDD", color: "#fff", border: "none", padding: "5px 14px", borderRadius: 7, fontSize: ".78rem", fontWeight: 600, cursor: "pointer" }}>Try Again</button></div>}
            </div>
          ) : null}
        </div>

        <div style={{ ...S.progressCard }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showNotepad ? ".6rem" : 0 }}>
            <div style={{ fontSize: ".73rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: muted }}>📝 Notes</div>
            <button onClick={function () { setShowNotepad(!showNotepad); }} style={{ background: "none", border: "none", color: "#2B7FDD", fontSize: ".78rem", fontWeight: 600, cursor: "pointer" }}>{showNotepad ? "Hide" : "Show"}</button>
          </div>
          {showNotepad ? (
            <textarea
              style={{ width: "100%", border: "2px solid " + border, borderRadius: 9, padding: "9px 12px", fontSize: ".85rem", fontFamily: "inherit", resize: "vertical", minHeight: 80, outline: "none", color: text, background: dm ? "#0F1923" : "#fff", lineHeight: 1.6, boxSizing: "border-box", marginTop: ".6rem" }}
              placeholder="Type your notes here…"
              value={notepad}
              onChange={function (e) {
                var val = e.target.value;
                setNotepad(val);
                clearTimeout(noteSaveTimer.current);
                noteSaveTimer.current = setTimeout(function () {
                  var d = load();
                  d.notepad = val;
                  save(d);
                  setNoteSavedFlash(true);
                  setTimeout(function () { setNoteSavedFlash(false); }, 1500);
                }, 600);
              }}
              onBlur={function () {
                clearTimeout(noteSaveTimer.current);
                var d = load();
                d.notepad = notepad;
                save(d);
              }}
            />
          ) : null}
          {noteSavedFlash && <div style={{ fontSize: ".72rem", color: "#1A7A4A", marginTop: 6, fontWeight: 600 }}>✓ Saved</div>}
        </div>

        <div style={{ ...S.progressCard, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button disabled={slide === 0} onClick={goPrev} style={{ padding: "9px 20px", borderRadius: 9, fontWeight: 600, fontSize: ".86rem", cursor: slide === 0 ? "not-allowed" : "pointer", border: "none", background: dm ? "#1A2535" : "#F0F4F8", color: slide === 0 ? "#aaa" : muted }}>← Previous</button>
          <div style={{ fontSize: ".77rem", color: muted, textAlign: "center" }}>{slide + 1} of {pages.length}</div>
          {!isLastSlide ? (
            canNext ? (
              <button onClick={goNext} style={{ padding: "9px 20px", borderRadius: 9, fontWeight: 600, fontSize: ".86rem", cursor: "pointer", border: "none", background: (!isCourseUnlocked(course) && slide===0) ? "#D4A017" : "#2B7FDD", color: "#fff" }}>{(!isCourseUnlocked(course) && slide===0) ? "🔒 Unlock to Continue" : "Next →"}</button>
            ) : (
              <button disabled style={{ padding: "9px 14px", borderRadius: 9, fontWeight: 600, fontSize: ".78rem", cursor: "not-allowed", border: "1.5px solid " + border, background: dm ? "#1A2535" : "#F0F4F8", color: "#aaa" }}>Answer check first</button>
            )
          ) : (
            canNext ? (
              <button onClick={function () { markSlide(course.id, pg.id); setScreen("exam"); goTop(); }} style={{ padding: "9px 20px", borderRadius: 9, fontWeight: 600, fontSize: ".86rem", cursor: "pointer", border: "none", background: courseComplete ? "#1A7A4A" : "#2B7FDD", color: "#fff" }}>Assessment →</button>
            ) : (
              <button disabled style={{ padding: "9px 14px", borderRadius: 9, fontWeight: 600, fontSize: ".78rem", cursor: "not-allowed", border: "1.5px solid " + border, background: dm ? "#1A2535" : "#F0F4F8", color: "#aaa" }}>Answer check first</button>
            )
          )}
        </div>
      </div>
    );
  }

  // ── EXAM ──────────────────────────────────────────────────────────────────
  function Exam() {
    if(!course) return null;
    const allAns=Object.keys(examAnswers).length===course.exam.length;
    return (
      <div className="pcpd-readerwrap" style={S.wrap}>
        <button style={{...S.navBtn,color:"#2B7FDD",padding:0,marginBottom:"1.25rem"}} onClick={()=>{setScreen("course");setSlide(pages.length-1);goTop();}}>← Back to slides</button>
        <div className="pcpd-exam-card" style={{background:surface,borderRadius:14,padding:"2.5rem",boxShadow:dm?"0 2px 14px rgba(0,0,0,.3)":"0 2px 14px rgba(11,31,53,.07)",marginBottom:"1.25rem",border:"1.5px solid "+border}}>
          <div style={{textAlign:"center",marginBottom:"2rem",paddingBottom:"1.5rem",borderBottom:"2px solid "+border}}>
            <div style={{display:"inline-block",background:dm?"rgba(212,160,23,.15)":"#FFF3CD",color:"#975A00",padding:"3px 12px",borderRadius:20,fontSize:".7rem",fontWeight:700,marginBottom:".6rem"}}>Final Assessment</div>
            <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.6rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".25rem"}}>Knowledge Assessment</h2>
            <div style={{color:muted,fontSize:".85rem"}}>{course.title} · Pass mark: 70% — 7 of 10 required</div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:"1.75rem",flexWrap:"wrap"}}>
            {course.exam.map((_,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:examDone?(examAnswers[i]===course.exam[i].a?"#1A7A4A":"#C0392B"):examAnswers[i]!==undefined?"#2B7FDD":(dm?"#2A3A50":"#DDE5EF")}} />)}
          </div>
          {course.exam.map((q,qi)=>(
            <div key={qi} style={{marginBottom:"1.75rem"}}>
              <div style={{fontSize:".67rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"#2B7FDD",marginBottom:".3rem"}}>Question {qi+1}</div>
              <div style={{fontWeight:600,fontSize:".98rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".85rem",lineHeight:1.55}}>{q.q}</div>
              <div style={{display:"grid",gap:8}}>
                {q.opts.map((opt,oi)=>{
                  let bg=dm?"rgba(255,255,255,.04)":"#F0F4F8",brd="2px solid "+border,col=text,lBg=dm?"#2A3A50":"#DDE5EF",lC=muted;
                  if(examAnswers[qi]===oi){bg=dm?"rgba(43,127,221,.2)":"#E8F2FF";brd="2px solid #2B7FDD";col="#2B7FDD";lBg="#2B7FDD";lC="#fff";}
                  if(examDone){if(oi===q.a){bg=dm?"rgba(26,122,74,.2)":"#E6F5EE";brd="2px solid #1A7A4A";col="#1A7A4A";lBg="#1A7A4A";lC="#fff";}else if(examAnswers[qi]===oi){bg=dm?"rgba(192,57,43,.2)":"#FDEEEC";brd="2px solid #C0392B";col="#C0392B";lBg="#C0392B";lC="#fff";}}
                  return <button key={oi} disabled={examDone} onClick={()=>{const u={...examAnswers};u[qi]=oi;setExamAnswers(u);}} style={{background:bg,border:brd,color:col,borderRadius:10,padding:"11px 14px",textAlign:"left",cursor:examDone?"default":"pointer",fontSize:".86rem",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit",width:"100%"}}><span style={{width:26,height:26,borderRadius:"50%",background:lBg,color:lC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".68rem",fontWeight:700,flexShrink:0}}>{["A","B","C","D"][oi]}</span>{opt}</button>;
                })}
              </div>
              {examDone&&<div style={{background:dm?"rgba(255,255,255,.05)":"#F0F4F8",borderLeft:"3px solid #2B7FDD",padding:"9px 13px",borderRadius:"0 8px 8px 0",fontSize:".8rem",color:muted,marginTop:8,lineHeight:1.65}}><strong>Explanation:</strong> {q.exp}</div>}
            </div>
          ))}
          {!examDone
            ? <button disabled={!allAns} onClick={submitExam} style={{display:"block",width:"100%",background:allAns?"linear-gradient(135deg,#2B7FDD,#00B4C5)":"#DDE5EF",color:allAns?"#fff":"#aaa",border:"none",padding:14,borderRadius:12,fontSize:".95rem",fontWeight:700,cursor:allAns?"pointer":"not-allowed"}}>{allAns?"Submit Assessment":"Answer all "+course.exam.length+" questions to submit ("+Object.keys(examAnswers).length+" answered)"}</button>
            : <button onClick={()=>{setScreen("cert");goTop();}} style={{display:"block",width:"100%",background:"linear-gradient(135deg,#1A7A4A,#145A32)",color:"#fff",border:"none",padding:14,borderRadius:12,fontSize:".95rem",fontWeight:700,cursor:"pointer"}}>View Results and Certificate →</button>
          }
        </div>
      </div>
    );
  }

  // ── CERTIFICATE ───────────────────────────────────────────────────────────
  function Cert() {
    if(!course||examScore===null) return null;
    const passed=examScore>=70;
    const certData=progress[course.id]||{};
    const refNum="PCPD-"+course.id.slice(0,4).toUpperCase()+"-"+(certData.date?certData.date.replace(/[^0-9]/g,"").slice(0,6):"000000");
    const reflection=reflections[course.id];
    return (
      <div className="pcpd-readerwrap" style={S.wrap}>
        <button className="pcpd-no-print" style={{...S.navBtn,color:"#2B7FDD",padding:0,marginBottom:"1.25rem"}} onClick={()=>{setScreen("exam");goTop();}}>← Back to assessment</button>
        <div className="pcpd-no-print" style={{background:surface,borderRadius:14,padding:"2.5rem",boxShadow:dm?"0 2px 14px rgba(0,0,0,.3)":"0 2px 14px rgba(11,31,53,.07)",textAlign:"center",marginBottom:"1.5rem",border:"1.5px solid "+border}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"4rem",lineHeight:1,color:passed?"#1A7A4A":"#C0392B",marginBottom:".5rem"}}>{examScore}%</div>
          <div style={{color:muted,fontSize:".95rem",marginBottom:"1rem",lineHeight:1.65}}>{passed?<span><strong>Excellent work!</strong> You passed with {examScore}%. Your {course.cpd} CPD hours are recorded.</span>:<span>You scored {examScore}% — {70-examScore}% below the pass mark. Review the slides and retake.</span>}</div>
          {!passed&&<div style={{display:"flex",gap:10,justifyContent:"center"}}><button onClick={()=>{setExamAnswers({});setExamDone(false);setExamScore(null);setScreen("exam");goTop();}} style={S.btnP}>Retake</button><button onClick={()=>{setScreen("course");setSlide(0);goTop();}} style={S.btnG}>Review slides</button></div>}
        </div>
        {passed&&(
          <div>
            {!userName&&<div style={{textAlign:"center",marginBottom:"1.25rem"}}><button onClick={()=>setShowNameModal(true)} style={S.btnG}>Add your name to the certificate</button></div>}
            <div className="pcpd-no-print" style={{background:dm?"rgba(26,122,74,.08)":"linear-gradient(135deg,#F0FFF7,#E6F5EE)",border:"2px solid rgba(26,122,74,.25)",borderRadius:12,padding:"1.5rem",marginBottom:"1.5rem"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:".75rem",marginBottom:"1rem"}}>
                <div style={{fontSize:"1.4rem",flexShrink:0}}>📋</div>
                <div><div style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".2rem"}}>Reflective Log</div><div style={{color:muted,fontSize:".82rem",lineHeight:1.6}}>Many professional bodies expect evidence that your learning influenced your practice. Your reflection prints on the certificate.</div></div>
              </div>
              {reflection
                ? <div><div style={{background:dm?"rgba(255,255,255,.06)":"rgba(255,255,255,.8)",borderRadius:9,padding:"1rem",border:"1px solid rgba(26,122,74,.2)",marginBottom:".75rem"}}><div style={{fontSize:".68rem",color:"#1A7A4A",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Your reflection — {reflection.date}</div><div style={{fontSize:".87rem",color:dm?"#C8DCF0":text,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{reflection.text}</div></div><button onClick={()=>{setReflectInput(reflection.text);}} style={{...S.navBtn,color:"#1A7A4A",padding:"5px 12px",border:"1px solid rgba(26,122,74,.3)",borderRadius:8,background:"none"}}>Edit reflection</button></div>
                : <div><div style={{marginBottom:".75rem"}}><div style={{fontSize:".75rem",color:muted,marginBottom:".35rem",fontWeight:500}}>What have you learned, and what will you do differently in clinical practice?</div><textarea value={reflectInput} onChange={e=>setReflectInput(e.target.value)} style={{width:"100%",border:"2px solid rgba(26,122,74,.25)",borderRadius:9,padding:"10px 14px",fontSize:".88rem",fontFamily:"inherit",resize:"vertical",minHeight:100,outline:"none",color:text,background:dm?"rgba(255,255,255,.05)":"rgba(255,255,255,.8)",lineHeight:1.7,boxSizing:"border-box"}} placeholder="e.g. I will implement the 10g monofilament at all 9 sites and document findings on a foot diagram at every diabetic foot review. I had previously been assessing only 4-5 sites…" /></div><button disabled={!reflectInput.trim()} onClick={saveReflection} style={{background:reflectInput.trim()?"#1A7A4A":"#DDE5EF",color:reflectInput.trim()?"#fff":"#aaa",border:"none",padding:"9px 22px",borderRadius:9,fontWeight:600,fontSize:".87rem",cursor:reflectInput.trim()?"pointer":"not-allowed"}}>Save Reflection</button></div>
              }
            </div>
            <div className="pcpd-cert-wrap" style={{background:"linear-gradient(145deg,#FDFCF5,#FAF6E4)",border:"2px solid #D4A017",borderRadius:18,padding:"2.5rem",maxWidth:640,margin:"0 auto 1.5rem",boxShadow:"0 8px 36px rgba(212,160,23,.1)"}}>
              <div className="pcpd-cert-inner" style={{border:"1px solid rgba(212,160,23,.28)",borderRadius:12,padding:"2rem",textAlign:"center"}}>
                <div style={{fontSize:"2rem",marginBottom:4}}>🦶</div>
                <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",color:"#8B6914",marginBottom:"1.25rem"}}>PodCPD Academy — United Kingdom</div>
                <div style={{width:"70%",margin:"0 auto 1.25rem",borderTop:"1px solid rgba(212,160,23,.3)"}} />
                <div style={{color:"#8B6914",fontSize:".85rem",marginBottom:3}}>This is to certify that</div>
                <div style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"1.85rem",color:"#0B1F35",marginBottom:4}}>{userName||"Healthcare Professional"}</div>
                <div style={{color:"#8B6914",fontSize:".85rem",marginBottom:".4rem"}}>has successfully completed</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:"1.3rem",color:"#0B1F35",lineHeight:1.3,marginBottom:"1rem"}}>{course.title}</div>
                <div style={{display:"inline-block",background:"linear-gradient(135deg,#D4A017,#B8860B)",color:"#fff",padding:"6px 22px",borderRadius:20,fontWeight:700,fontSize:".88rem",marginBottom:"1.2rem"}}>{course.cpd} CPD Hours Awarded</div>
                <div className="pcpd-cert-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".4rem .6rem",background:"rgba(212,160,23,.06)",border:"1px solid rgba(212,160,23,.18)",borderRadius:10,padding:".9rem 1.2rem",marginBottom:"1rem",textAlign:"left"}}>
                  {[["Level",course.level],["Score",examScore+"%"],["Pass Mark","70%"],["Date",certData.date||""],["CPD Hours",course.cpd+" hours"],["Slides",pages.length+" completed"]].map(([k,v])=><div key={k}><div style={{color:"#8B6914",fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",fontSize:".6rem"}}>{k}</div><div style={{color:"#2C3E50",fontWeight:600,fontSize:".74rem",marginTop:1}}>{v}</div></div>)}
                </div>
                {reflection&&<div style={{background:"rgba(212,160,23,.06)",border:"1px solid rgba(212,160,23,.18)",borderRadius:10,padding:".9rem 1.2rem",marginBottom:"1rem",textAlign:"left"}}><div style={{color:"#8B6914",fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",fontSize:".6rem",marginBottom:4}}>Reflective Statement</div><div style={{color:"#2C3E50",fontSize:".74rem",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{reflection.text}</div></div>}
                <div className="pcpd-cert-sig" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",margin:".8rem 0 .6rem"}}>{[["Course Director","PodCPD Academy"],["Date of Issue",certData.date||""]].map(([k,v])=><div key={k} style={{borderTop:"1.5px solid rgba(212,160,23,.4)",paddingTop:".35rem",textAlign:"center"}}><div style={{fontSize:".66rem",color:"#8B6914",fontWeight:600}}>{k}</div><div style={{fontSize:".74rem",color:"#2C3E50",fontWeight:600,marginTop:2}}>{v}</div></div>)}</div>
                <div style={{width:"70%",margin:"0 auto .6rem",borderTop:"1px solid rgba(212,160,23,.3)"}} />
                <div style={{color:"#C4B07A",fontSize:".62rem",fontFamily:"monospace"}}>Ref: {refNum}</div>
                <div style={{color:"#A09060",fontSize:".7rem",marginTop:".6rem",fontStyle:"italic",lineHeight:1.6}}>This certificate confirms completion of {course.cpd} hours of self-directed learning. It does not indicate the content has been externally verified or accredited, and is not endorsed by the HCPC or the Royal College of Podiatry (RCPod). Provided for educational purposes only; does not substitute professional clinical judgment. Always verify against current local protocols.</div>
              </div>
            </div>
            <div className="pcpd-no-print" style={{background:dm?"rgba(43,127,221,.1)":"#EBF5FB",border:"1px solid "+(dm?"rgba(43,127,221,.3)":"#B8D3ED"),borderRadius:10,padding:"1rem 1.2rem",marginBottom:"1.1rem",maxWidth:640,marginLeft:"auto",marginRight:"auto",textAlign:"center"}}>
              <div style={{fontSize:".85rem",fontWeight:600,color:dm?"#7EC8F0":"#1B4F72",marginBottom:".25rem"}}>📥 Save this now</div>
              <div style={{fontSize:".8rem",color:muted,lineHeight:1.6}}>This certificate is stored in your browser, not in an account. Print or save a PDF copy today so you always have it, even if you switch devices, clear your browser, or come back after a long break.</div>
            </div>
            <div className="pcpd-no-print" style={{display:"flex",gap:9,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>window.print()} style={S.btnP}>Print or Save as PDF</button>
              <button onClick={()=>setShowNameModal(true)} style={S.btnG}>Edit Name</button>
              <button onClick={()=>{setScreen("progress");goTop();}} style={{...S.btnG,borderColor:"#1A7A4A",color:"#1A7A4A"}}>My CPD Record</button>
              <button onClick={()=>{setScreen("home");goTop();}} style={{...S.btnG,borderColor:border,color:muted}}>All Courses</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── HOME ──────────────────────────────────────────────────────────────────
  function Home() {
    const started=COURSES.filter(c=>{const p=progress[c.id]||{};return(p.done||[]).length>0&&!(p.examScore>=70);});
    return (
      <div>
        <div className="pcpd-hero-pad" style={{background:"linear-gradient(145deg,#0B1F35 0%,#0E2A47 60%,#0D3A60 100%)",padding:"5rem 2rem 4rem"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{display:"inline-block",background:"rgba(43,127,221,.15)",border:"1px solid rgba(43,127,221,.35)",color:"#00B4C5",padding:"4px 14px",borderRadius:20,fontSize:".7rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"1.2rem"}}>UK Podiatry Learning Resource</div>
            <h1 className="pcpd-hero-h1" style={{fontFamily:"Georgia,serif",fontSize:"clamp(2rem,4.5vw,3rem)",color:"#fff",lineHeight:1.2,marginBottom:"1rem",maxWidth:680}}>Evidence-based CPD for <em style={{color:"#00B4C5",fontStyle:"italic"}}>practising podiatrists</em></h1>
            <p style={{color:"#6A9AB0",fontSize:"1rem",lineHeight:1.75,maxWidth:540,marginBottom:"2rem"}}>Interactive slide-by-slide learning with pre-course assessment, bookmarks, dark mode, study timer, references, reflective logs, and certificates of completion.</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:"2.5rem"}}>
              <button style={S.btnP} onClick={()=>{const el=document.getElementById("courses");if(el)el.scrollIntoView({behavior:"smooth"});}}>Browse courses</button>
              <button onClick={()=>startPurchase(SQUARE.full)} style={{...S.btnO,fontFamily:"inherit"}}>Full bundle</button>
            </div>
            <div className="pcpd-stats-row" style={{display:"flex",gap:0,flexWrap:"wrap"}}>
              {[[String(COURSES.length),"Courses"],[String(COURSES.reduce((s,c)=>s+c.cpd,0)),"CPD Hours"],["20","Slides/course"],[String(COURSES.reduce((s,c)=>s+c.slides.filter(sl=>sl.quiz).length+c.exam.length,0)),"Knowledge checks"],["70%","Pass mark"]].map(([n,l],i)=><div key={i} style={{padding:".8rem 2rem .8rem 0",marginRight:"2rem",borderRight:"1px solid rgba(255,255,255,.1)"}}><div style={{fontFamily:"Georgia,serif",fontSize:"1.8rem",color:"#fff",lineHeight:1,marginBottom:2}}>{n}</div><div style={{color:"#4A7090",fontSize:".7rem"}}>{l}</div></div>)}
            </div>
          </div>
        </div>

        {started.length>0&&<div style={{background:"linear-gradient(135deg,#0B1F35,#0E3060)",borderBottom:"2px solid rgba(43,127,221,.3)",padding:".9rem 2rem"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap",marginBottom:started.length>1?".6rem":0}}>
              <div><div style={{color:"#fff",fontWeight:700,fontSize:".9rem",marginBottom:2}}>Welcome back</div><div style={{color:"#6A9AB0",fontSize:".83rem"}}>{started[0].title} · {(progress[started[0].id]?.done||[]).length}/{started[0].slides.length} slides done</div></div>
              <button style={S.btnP} onClick={()=>openCourse(started[0])}>Continue →</button>
            </div>
            {started.length>1&&<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {started.slice(1).map(sc=>{
                const p=progress[sc.id]||{done:[]};
                const pct=Math.round(((p.done||[]).length/sc.slides.length)*100);
                return <button key={sc.id} onClick={()=>openCourse(sc)} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",color:"#9FB8D0",fontSize:".74rem",padding:"5px 11px",borderRadius:20,cursor:"pointer",whiteSpace:"nowrap"}}>{sc.icon} {sc.title} — {pct}%</button>;
              })}
            </div>}
          </div>
        </div>}

        <div style={{background:surface,borderBottom:"1px solid "+border,padding:".9rem 2rem"}}>
          <div className="pcpd-trust-row" style={{maxWidth:1100,margin:"0 auto",display:"flex",gap:"1.5rem",flexWrap:"wrap",justifyContent:"center"}}>
            {["Pre-course self-assessment","20 slides per module","Knowledge checks gate each section","← → keyboard navigation","Dark mode [D key]","Bookmarks [B key]","Study time tracker","Course references","Reflective log","Certificate of completion"].map((t,i)=><div key={i} style={{fontSize:".78rem",color:muted,fontWeight:500}}>✓ {t}</div>)}
          </div>
        </div>

        <div className="pcpd-grid" style={{maxWidth:1140,margin:"0 auto",padding:"3rem 2rem"}} id="courses">
          <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"#2B7FDD",marginBottom:".4rem"}}>Courses</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.6rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".3rem"}}>{COURSES.length} clinical CPD modules · 20 slides each</div>
          <p style={{color:muted,fontSize:".9rem",marginBottom:"1.25rem"}}>Each course begins with a self-assessment and ends with a certificate of completion including your reflective log</p>

          <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",alignItems:"center",marginBottom:"1.5rem"}}>
            <input value={courseSearch} onChange={e=>setCourseSearch(e.target.value)} placeholder="Search courses…" style={{flex:"1 1 220px",minWidth:160,background:surface,border:"1.5px solid "+border,borderRadius:9,padding:"8px 13px",fontSize:".85rem",color:text,outline:"none",fontFamily:"inherit"}} />
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["all","Foundation","Intermediate","Advanced"].map(lvl=>(
                <button key={lvl} onClick={()=>setCourseFilter(lvl)} style={{background:courseFilter===lvl?"#2B7FDD":(dm?"rgba(255,255,255,.06)":"#F0F4F8"),color:courseFilter===lvl?"#fff":muted,border:"1.5px solid "+(courseFilter===lvl?"#2B7FDD":border),borderRadius:20,padding:"6px 14px",fontSize:".78rem",fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                  {lvl==="all"?"All levels":lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="pcpd-grid-cards" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1.25rem"}}>
            {COURSES.filter(c=>{
              const matchesLevel = courseFilter==="all" || c.level===courseFilter;
              const q = courseSearch.trim().toLowerCase();
              const matchesSearch = !q || c.title.toLowerCase().includes(q) || c.blurb.toLowerCase().includes(q);
              return matchesLevel && matchesSearch;
            }).map(c=>{
              const p=progress[c.id]||{done:[]};
              const done=(p.done||[]).length;
              const pct=Math.round((done/c.slides.length)*100);
              const passed=p.examScore>=70;
              const hasRef=!!reflections[c.id];
              const studyM=Math.round((studySeconds[c.id]||0)/60);
              const locked=!isCourseUnlocked(c);
              return (
                <div key={c.id} style={{...S.card,opacity:locked?0.88:1}} onClick={()=>openCourse(c)}>
                  <div style={{padding:"1.5rem 1.75rem 1.2rem",position:"relative"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"14px 14px 0 0",background:c.color}} />
                    {locked&&<div style={{position:"absolute",top:".9rem",right:".9rem",background:"rgba(212,160,23,.14)",color:"#975A00",border:"1px solid rgba(212,160,23,.3)",padding:"2px 9px",borderRadius:12,fontSize:".64rem",fontWeight:700,display:"flex",alignItems:"center",gap:4}}>🔒 Locked</div>}
                    {passed&&<div style={{position:"absolute",top:".9rem",right:".9rem",background:"rgba(26,122,74,.12)",color:"#1A7A4A",border:"1px solid rgba(26,122,74,.25)",padding:"2px 9px",borderRadius:12,fontSize:".64rem",fontWeight:700}}>✓ Completed{hasRef?" · Reflected":""}</div>}
                    <div style={{width:44,height:44,borderRadius:10,background:c.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",marginBottom:".8rem"}}>{c.icon}</div>
                    <div style={{fontSize:".65rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:c.color,marginBottom:".25rem"}}>{c.level}</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:"1.05rem",color:dm?"#E8F4FF":"#0B1F35",lineHeight:1.3,marginBottom:".2rem"}}>{c.title}</div>
                    <div style={{color:muted,fontSize:".78rem",lineHeight:1.55}}>{c.blurb}</div>
                  </div>
                  <div style={{padding:"1rem 1.75rem 1.4rem",borderTop:"1px solid "+border}}>
                    <div style={{display:"flex",gap:"1rem",marginBottom:".9rem",flexWrap:"wrap"}}>
                      <div style={{fontSize:".74rem",color:muted,fontWeight:500}}>⏱ {c.cpd} CPD hrs</div>
                      <div style={{fontSize:".74rem",color:muted,fontWeight:500}}>📄 {c.slides.length} slides</div>
                      {studyM>0&&<div style={{fontSize:".74rem",color:"#2B7FDD",fontWeight:500}}>🕐 {studyM}m studied</div>}
                    </div>
                    <div style={{background:dm?"#0F1923":"#F0F4F8",borderRadius:4,height:5,overflow:"hidden",marginBottom:4}}><div style={{height:"100%",width:pct+"%",background:c.color,borderRadius:4}} /></div>
                    <div style={{fontSize:".69rem",color:muted,display:"flex",justifyContent:"space-between",marginBottom:".8rem"}}><span>{done}/{c.slides.length} slides</span><span>{pct}%</span></div>
                    <button style={{display:"block",width:"100%",padding:"9px",borderRadius:9,fontSize:".82rem",fontWeight:600,textAlign:"center",cursor:"pointer",border:"none",color:"#fff",background:locked?"#8B6914":passed?"#1A7A4A":c.color}}>{locked?"👀 Free Preview →":passed?"View certificate":done>0?"Continue →":"Start module →"}</button>
                  </div>
                </div>
              );
            })}
          </div>
          {COURSES.filter(c=>{
            const matchesLevel = courseFilter==="all" || c.level===courseFilter;
            const q = courseSearch.trim().toLowerCase();
            const matchesSearch = !q || c.title.toLowerCase().includes(q) || c.blurb.toLowerCase().includes(q);
            return matchesLevel && matchesSearch;
          }).length===0 && (
            <div style={{textAlign:"center",padding:"3rem 1rem",color:muted}}>
              <div style={{fontSize:"2rem",marginBottom:".5rem"}}>🔍</div>
              <div style={{fontSize:".9rem",marginBottom:".75rem"}}>No courses match your search or filter.</div>
              <button onClick={()=>{setCourseSearch("");setCourseFilter("all");}} style={{...S.btnG}}>Clear filters</button>
            </div>
          )}
        </div>

        <div id="pricing-anchor" style={{background:"#0B1F35",padding:"4rem 2rem"}}>
          <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
            <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"#00B4C5",marginBottom:".4rem"}}>Pricing</div>
                        <h2 style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:"1.9rem",marginBottom:".4rem"}}>Invest in your practice</h2>
            <p style={{color:"#4A7090",marginBottom:"2.5rem"}}>All prices include VAT · Certificate of completion · Access for as long as this site is available</p>

            <div style={{background:"#2B7FDD",border:"1.5px solid #2B7FDD",borderRadius:14,padding:"2rem",marginBottom:"2.5rem",textAlign:"left",maxWidth:520,marginLeft:"auto",marginRight:"auto"}}>
              <div style={{fontSize:".65rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,.8)",marginBottom:".5rem"}}>Best Value</div>
              <div style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:"1.25rem",marginBottom:".15rem"}}>Full Bundle — All {COURSES.length} Courses</div>
              <div style={{fontSize:"2rem",fontWeight:800,color:"#fff",lineHeight:1,margin:".4rem 0 .15rem"}}>£79<span style={{fontSize:".9rem",fontWeight:400,opacity:.55}}> /all {COURSES.length} courses</span></div>
              <div style={{color:"rgba(255,255,255,.7)",fontSize:".8rem",margin:".75rem 0 1rem",lineHeight:1.6}}>All {COURSES.length} courses, {COURSES.reduce((s,c)=>s+c.cpd,0)} CPD hours, all certificates, instant access — cheaper than buying more than 5 courses individually.</div>
              <ul style={{listStyle:"none",padding:0,margin:"0 0 1.4rem",display:"flex",flexDirection:"column",gap:5}}>
                {["All "+COURSES.length+" courses",COURSES.reduce((s,c)=>s+c.cpd,0)+" learning hours","All certificates","Reflective logs","Access while the site is live"].map((f,j)=><li key={j} style={{fontSize:".8rem",color:"rgba(255,255,255,.85)"}}>✓ {f}</li>)}
              </ul>
              <button onClick={()=>startPurchase(SQUARE.full)} style={{display:"block",width:"100%",padding:"12px",borderRadius:9,fontSize:".9rem",fontWeight:700,textAlign:"center",cursor:"pointer",background:"#fff",color:"#2B7FDD",border:"none",fontFamily:"inherit"}}>Get the Full Bundle →</button>
            </div>

            <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"#00B4C5",marginBottom:"1rem"}}>Or buy individual courses</div>
            <div style={{maxWidth:640,margin:"0 auto",textAlign:"left",display:"flex",flexDirection:"column",gap:8}}>
              {COURSES.map(c=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.09)",borderRadius:10,padding:".9rem 1.2rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:".75rem",minWidth:0}}>
                    <span style={{fontSize:"1.2rem",flexShrink:0}}>{c.icon}</span>
                    <div style={{minWidth:0}}>
                      <div style={{color:"#fff",fontSize:".87rem",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.title}</div>
                      <div style={{color:"#4A7090",fontSize:".74rem"}}>{c.cpd} CPD hrs · {c.level}</div>
                    </div>
                  </div>
                  <button onClick={()=>startPurchase(SQUARE[c.id])} style={{flexShrink:0,background:"transparent",border:"1.5px solid rgba(255,255,255,.3)",color:"#fff",padding:"7px 16px",borderRadius:8,fontSize:".82rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>£15 →</button>
                </div>
              ))}
            </div>

            <div style={{maxWidth:640,margin:"2rem auto 0",background:"rgba(0,180,197,.08)",border:"1px solid rgba(0,180,197,.25)",borderRadius:10,padding:"1rem 1.3rem",textAlign:"left"}}>
              <div style={{color:"#00B4C5",fontSize:".82rem",fontWeight:700,marginBottom:".25rem"}}>📚 Always growing</div>
              <div style={{color:"#8BA4BF",fontSize:".82rem",lineHeight:1.6}}>New courses are added over time. Full Bundle buyers can purchase any newly added course individually whenever it's released — there's no separate subscription to manage.</div>
            </div>
          </div>
        </div>

        <div style={{background:surface,borderTop:"1px solid "+border,padding:"3.5rem 2rem"}}>
          <div style={{maxWidth:740,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:"2rem"}}>
              <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"#2B7FDD",marginBottom:".4rem"}}>FAQ</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:"1.5rem",color:dm?"#E8F4FF":"#0B1F35"}}>Common questions</div>
            </div>
            {[
              {q:"How does my name get on the certificate?",a:"When you start your first course, a prompt appears asking for your name exactly as you would like it on the certificate. You can add or update it from the navigation bar at any time."},
              {q:"What is the pre-course self-assessment?",a:"Before starting each course, you answer 3 questions on the topic to see your current knowledge level. This helps you understand where you need to focus. Your answers don't affect course access or your certificate in any way."},
              {q:"What keyboard shortcuts are available?",a:"While reading slides: ← and → arrow keys navigate between slides. B bookmarks the current slide. D toggles dark mode. Shortcuts are disabled when typing in text boxes."},
              {q:"What is the reflective log?",a:"After passing each course, you can write a reflection on what you learned and what you will change in clinical practice. This reflection is stored permanently and prints on your certificate alongside the course details, useful evidence for your own professional development records."},
              {q:"What score do I need to pass?",a:"70% on the final 10-question MCQ assessment. There is no limit on retakes — full explanations are shown after each submission."},
              {q:"Is this accredited CPD?",a:"No. PodCPD Academy is an independent self-study resource, not an accredited or formally certified CPD provider. It is not endorsed by the HCPC or the Royal College of Podiatry (RCPod). The certificate of completion confirms you have worked through the material and passed the assessment; it does not indicate that the content has been externally verified. This material is provided for educational purposes only and does not substitute professional clinical judgment. Always check your professional body's current CPD requirements and verify clinical content against up-to-date local protocols before relying on it in practice. The author accepts no liability for clinical outcomes or practices implemented based on this material."},
            ].map((item,i)=>(
              <div key={i} style={{borderBottom:"1px solid "+border}}>
                <button style={{width:"100%",background:"none",border:"none",padding:"1rem 0",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:".95rem",fontWeight:600,color:dm?"#E8F4FF":"#0B1F35",textAlign:"left",gap:"1rem"}} onClick={()=>setFaq(faq===i?null:i)}>{item.q}<span style={{color:"#2B7FDD",fontSize:".8rem"}}>{faq===i?"▲":"▼"}</span></button>
                {faq===i&&<div style={{fontSize:".87rem",color:muted,lineHeight:1.8,paddingBottom:"1rem"}}>{item.a}</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"#060F1A",padding:"2.5rem 2rem",borderTop:"1px solid rgba(255,255,255,.05)"}}>
          <div className="pcpd-footer" style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
            <div><div style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:"1rem",marginBottom:3}}>PodCPD Academy</div><div style={{fontSize:".74rem",color:"#3E5A6E"}}>Independent self-study resource for UK podiatrists · not accredited or formally certified · referencing NICE, IWGDF, Cochrane</div></div>
            <div className="pcpd-footer-links" style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
              <button onClick={()=>{setScreen("home");setTimeout(()=>{const el=document.getElementById("pricing-anchor");if(el)el.scrollIntoView({behavior:"smooth"});},50);}} style={{background:"none",border:"none",color:"#3E5A6E",fontSize:".74rem",cursor:"pointer",fontFamily:"inherit",padding:0}}>Buy a Course (£15)</button>
              <button onClick={()=>startPurchase(SQUARE.full)} style={{background:"none",border:"none",color:"#3E5A6E",fontSize:".74rem",cursor:"pointer",fontFamily:"inherit",padding:0}}>Full Bundle</button>
              <button onClick={()=>{setScreen("terms");goTop();}} style={{background:"none",border:"none",color:"#3E5A6E",fontSize:".74rem",cursor:"pointer",fontFamily:"inherit",padding:0}}>Terms and Conditions</button>
              <a href="mailto:amirpodiatrist@gmail.com" style={{color:"#3E5A6E",fontSize:".74rem",textDecoration:"none"}}>Contact</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── TERMS AND CONDITIONS ──────────────────────────────────────────────
  function Terms() {
    const sections = [
      {h:"1. Who We Are", b:"PodCPD Academy (\"we\", \"us\", \"the Site\") is an independent, self-funded educational resource for podiatry professionals in the United Kingdom. We are not a college, university, royal college, or any form of regulatory or accrediting body."},
      {h:"2. Not Accredited or Certified CPD", b:"PodCPD Academy is not an accredited or formally certified Continuing Professional Development (CPD) provider. We are not endorsed, approved, or affiliated with the Health and Care Professions Council (HCPC), the Royal College of Podiatry (RCPod), or any other professional, regulatory, or accrediting body. Certificates of completion issued by this Site confirm only that you have worked through the relevant course material and achieved the required score on the associated assessment. They do not constitute formal accreditation, and do not guarantee acceptance as valid CPD evidence by the HCPC, RCPod, or any other body. You are solely responsible for checking your own professional body's current CPD requirements and for determining whether and how material from this Site may be used as part of your own CPD portfolio."},
      {h:"3. Educational Purpose Only", b:"All content on this Site, including but not limited to course text, slides, knowledge checks, assessments, and any AI-generated study tutor responses, is provided for general educational and reference purposes only. It is not, and must not be relied upon as, a substitute for your own professional clinical judgment, up-to-date local clinical protocols, manufacturer guidance, or the advice of a qualified, currently-practising clinician. Clinical practice, guidelines, and evidence change over time. You are responsible for independently verifying any clinical information against current, authoritative sources before applying it in practice."},
      {h:"4. No Liability for Clinical Outcomes", b:"To the fullest extent permitted by law, we accept no liability whatsoever for any clinical outcomes, decisions, treatments, or practices undertaken or implemented on the basis of material provided on this Site. This includes, without limitation, any loss, harm, or damage arising from reliance on course content, knowledge check explanations, or assessment feedback. Nothing in these Terms excludes or limits liability where it would be unlawful to do so, including liability for death or personal injury caused by our negligence, or for fraud or fraudulent misrepresentation."},
      {h:"5. Accuracy of Content", b:"While content is prepared with reference to published clinical literature and guidelines (including but not limited to NICE, IWGDF, and Cochrane sources), we make no warranty, express or implied, that the content is complete, current, error-free, or suitable for any particular purpose. References cited within courses should be checked against the original source material."},
      {h:"6. Purchases, Payment, and Access Delivery", b:"Course access is purchased via third-party payment processing (currently Square). By completing a purchase, you confirm you have read, understood, and agree to these Terms and Conditions in full, including Sections 2, 3, and 4 above. Prices are as displayed at the time of purchase and include VAT where applicable. Access codes are sent manually by email after payment is confirmed, typically within 24 hours. If you have not received your code within this time, please contact us at the email address below."},
      {h:"7. Refunds", b:"Refund requests will be considered on a case-by-case basis. Please contact us at the email address below within 14 days of purchase if you wish to request a refund. Nothing in this section affects your statutory rights as a consumer under UK law."},
      {h:"8. Account Data, Progress, and Access Duration", b:"Your course progress, notes, bookmarks, and reflective log entries are currently stored locally within your web browser and are not synced to a central account or accessible across multiple devices. Clearing your browser data, using a different browser, or using a different device will result in loss of this locally stored progress. We recommend printing or saving a copy of any certificate or reflective log you wish to retain, as these are yours to keep regardless of the Site's future availability. Course access is provided for as long as this Site remains available online. While we intend to keep the Site running on an ongoing basis, we do not guarantee indefinite or perpetual hosting, and access cannot be guaranteed beyond the period the Site is operational. We recommend completing purchased courses and saving your certificates promptly after purchase."},
      {h:"9. Intellectual Property", b:"All course content, design, and materials on this Site are the property of PodCPD Academy unless otherwise stated. You may not reproduce, redistribute, or resell course content without prior written permission."},
      {h:"10. Changes to These Terms", b:"We may update these Terms and Conditions from time to time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms."},
      {h:"11. Contact", b:"Questions about these Terms can be directed to amirpodiatrist@gmail.com."},
    ];
    return (
      <div style={{maxWidth:760,margin:"0 auto",padding:"2.5rem 1.5rem 4rem"}}>
        <button style={{...S.navBtn,color:"#2B7FDD",padding:0,marginBottom:"1.5rem"}} onClick={()=>{setScreen("home");goTop();}}>← Back to home</button>
        <div style={{marginBottom:"2rem"}}>
          <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"#2B7FDD",marginBottom:".4rem"}}>Legal</div>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.85rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".5rem"}}>Terms and Conditions</h2>
          <p style={{color:muted,fontSize:".85rem"}}>Last updated: {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</p>
        </div>
        <div style={{background:dm?"rgba(212,160,23,.08)":"#FFF8E1",border:"1px solid "+(dm?"rgba(212,160,23,.25)":"#F0D98C"),borderRadius:10,padding:"1.1rem 1.3rem",marginBottom:"2rem"}}>
          <div style={{fontSize:".85rem",fontWeight:700,color:dm?"#E8C97A":"#6B5410",marginBottom:".35rem"}}>Summary</div>
          <div style={{fontSize:".85rem",color:dm?"#E8C97A":"#6B5410",lineHeight:1.65}}>
            PodCPD Academy is an independent self-study resource, not an accredited or formally certified CPD provider. It is not endorsed by the HCPC or the Royal College of Podiatry (RCPod). The certificate of completion confirms you have worked through the material and passed the assessment; it does not indicate that the content has been externally verified. This material is provided for educational purposes only and does not substitute professional clinical judgment. Always check your professional body's current CPD requirements and verify clinical content against up-to-date local protocols before relying on it in practice. The author accepts no liability for clinical outcomes or practices implemented based on this material.
          </div>
        </div>
        {sections.map((s,i)=>(
          <div key={i} style={{marginBottom:"1.5rem"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:"1.05rem",fontWeight:700,color:dm?"#E8F4FF":"#0B1F35",marginBottom:".4rem"}}>{s.h}</div>
            <div style={{fontSize:".88rem",color:muted,lineHeight:1.75}}>{s.b}</div>
          </div>
        ))}
      </div>
    );
  }

  // ── PROGRESS ──────────────────────────────────────────────────────────────
  function Progress() {
    const done2=COURSES.filter(c=>(progress[c.id]||{}).examScore>=70);
    const inProg=COURSES.filter(c=>{const p=progress[c.id]||{};return(p.done||[]).length>0&&!(p.examScore>=70);});
    const allBms=Object.values(bookmarks);
    return (
      <div style={{maxWidth:860,margin:"0 auto",padding:"2.5rem 1.5rem"}}>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"1.85rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".25rem"}}>My CPD Record</h2>
        <p style={{color:muted,marginBottom:"1.75rem"}}>Completed courses, CPD hours, study time, reflective logs, and bookmarks</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:"1rem",marginBottom:"1.75rem"}}>
          {[{n:totalCPD,l:"CPD Hours",c:"#2B7FDD"},{n:done2.length,l:"Completed",c:"#1A7A4A"},{n:totalStudyMins,l:"Minutes Studied",c:"#7C3AED"},{n:Object.keys(reflections).length,l:"Reflections",c:"#D4A017"},{n:allBms.length,l:"Bookmarks",c:"#00B4C5"}].map((s,i)=>(
            <div key={i} style={{background:surface,borderRadius:12,padding:"1.1rem 1.35rem",boxShadow:dm?"0 2px 10px rgba(0,0,0,.3)":"0 2px 10px rgba(11,31,53,.07)",border:"1.5px solid "+border}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:"1.9rem",color:s.c,lineHeight:1,marginBottom:3}}>{s.n}</div>
              <div style={{fontSize:".76rem",color:muted}}>{s.l}</div>
            </div>
          ))}
        </div>
        {done2.length>0&&<div style={{marginBottom:"2rem"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.15rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".85rem"}}>Completed Certificates</div>
          {done2.map(c=>{const d=progress[c.id]||{};const ref=reflections[c.id];return(
            <div key={c.id} style={{background:surface,borderRadius:12,padding:"1.1rem 1.4rem",boxShadow:dm?"0 2px 10px rgba(0,0,0,.3)":"0 2px 10px rgba(11,31,53,.06)",marginBottom:".7rem",border:"1.5px solid "+border}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:".85rem"}}><div style={{width:40,height:40,borderRadius:9,background:c.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem"}}>{c.icon}</div><div><div style={{fontWeight:600,color:dm?"#E8F4FF":"#0B1F35",fontSize:".9rem"}}>{c.title}</div><div style={{fontSize:".76rem",color:muted,marginTop:2}}>Score: {d.examScore}% · {d.date} · {c.cpd} CPD hrs</div></div></div>
                <div style={{display:"flex",gap:9,alignItems:"center"}}>{ref&&<span style={{fontSize:".7rem",background:"rgba(212,160,23,.1)",color:"#975A00",border:"1px solid rgba(212,160,23,.25)",padding:"3px 9px",borderRadius:12,fontWeight:700}}>📋 Reflected</span>}<button onClick={()=>{setCourse(c);setExamScore(d.examScore);setExamDone(true);setScreen("cert");goTop();}} style={{padding:"6px 13px",borderRadius:8,fontSize:".78rem",fontWeight:600,cursor:"pointer",border:"2px solid #2B7FDD",color:"#2B7FDD",background:surface}}>View certificate</button></div>
              </div>
              {ref&&<div style={{marginTop:".75rem",background:dm?"rgba(212,160,23,.06)":"rgba(212,160,23,.04)",borderLeft:"3px solid rgba(212,160,23,.4)",padding:"8px 12px",borderRadius:"0 8px 8px 0",fontSize:".79rem",color:muted,lineHeight:1.65}}><strong style={{color:"#975A00"}}>Your reflection:</strong> {ref.text.length>180?ref.text.slice(0,180)+"…":ref.text}</div>}
            </div>
          );})}
        </div>}
        {inProg.length>0&&<div style={{marginBottom:"2rem"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.15rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".85rem"}}>In Progress</div>
          {inProg.map(c=>{const d=progress[c.id]||{done:[]};const pct=Math.round(((d.done||[]).length/c.slides.length)*100);return(<div key={c.id} style={{background:surface,borderRadius:12,padding:"1.1rem 1.4rem",boxShadow:dm?"0 2px 10px rgba(0,0,0,.3)":"0 2px 10px rgba(11,31,53,.06)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",marginBottom:".7rem",border:"1.5px solid "+border,flexWrap:"wrap"}}><div style={{display:"flex",alignItems:"center",gap:".85rem"}}><div style={{width:40,height:40,borderRadius:9,background:c.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem"}}>{c.icon}</div><div><div style={{fontWeight:600,color:dm?"#E8F4FF":"#0B1F35",fontSize:".9rem"}}>{c.title}</div><div style={{fontSize:".76rem",color:muted,marginTop:2}}>{(d.done||[]).length}/{c.slides.length} slides · {pct}%</div></div></div><button onClick={()=>openCourse(c)} style={{padding:"7px 14px",borderRadius:8,fontSize:".78rem",fontWeight:600,cursor:"pointer",background:"#2B7FDD",color:"#fff",border:"none"}}>Continue</button></div>);})}
        </div>}
        {allBms.length>0&&<div style={{marginBottom:"2rem"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.15rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".85rem"}}>My Bookmarks</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:".75rem"}}>
            {allBms.sort((a,b)=>b.ts-a.ts).map((bm,i)=>{const cc=COURSES.find(x=>x.id===bm.courseId);return(<div key={i} style={{background:surface,borderRadius:10,padding:".9rem 1.1rem",border:"1.5px solid "+border,cursor:"pointer"}} onClick={()=>openCourse(cc)}><div style={{fontSize:".68rem",color:cc?.color||"#2B7FDD",fontWeight:700,marginBottom:2}}>{cc?.icon} {cc?.title}</div><div style={{fontSize:".83rem",color:dm?"#E8F4FF":"#0B1F35",fontWeight:500}}>{bm.title}</div></div>);})}
          </div>
        </div>}
        {done2.length===0&&inProg.length===0&&<div style={{textAlign:"center",padding:"4rem",color:muted}}><div style={{fontSize:"3rem",marginBottom:"1rem"}}>📚</div><p style={{marginBottom:"1.25rem"}}>No courses started yet.</p><button onClick={()=>{setScreen("home");goTop();}} style={S.btnP}>Browse courses</button></div>}
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={S.page} ref={topRef}>
      <style>{MOBILE_CSS}</style>
      {confetti&&<canvas ref={canvasRef} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}} />}
      {showBookmarks&&<BookmarksPanel />}

      {showNameModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(11,31,53,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:"1rem"}}>
          <div className="pcpd-name-modal" style={{background:surface,borderRadius:18,padding:"2.5rem",maxWidth:420,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.25)"}}>
            <h3 style={{fontFamily:"Georgia,serif",fontSize:"1.5rem",color:dm?"#E8F4FF":"#0B1F35",marginBottom:".4rem"}}>Your name on the certificate</h3>
            <p style={{color:muted,fontSize:".87rem",marginBottom:"1.4rem",lineHeight:1.65}}>Enter your name exactly as you would like it on your CPD certificate — e.g. Dr Jane Smith or Jane Smith BSc(Hons) MCPod</p>
            <input autoFocus type="text" placeholder="Your full name or professional title" value={nameInput} onChange={e=>setNameInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveName()} style={{width:"100%",border:"2px solid "+border,borderRadius:10,padding:"12px 15px",fontSize:"1rem",fontFamily:"inherit",outline:"none",color:text,background:surface,marginBottom:"1rem",boxSizing:"border-box"}} />
            <button onClick={saveName} style={{...S.btnP,width:"100%",padding:13,fontSize:"1rem"}}>Save and continue</button>
            <button onClick={()=>{setShowNameModal(false);if(pendingCourse){startCourse(pendingCourse);setPendingCourse(null);}}} style={{width:"100%",background:"none",border:"none",color:muted,fontSize:".83rem",padding:8,cursor:"pointer",marginTop:7}}>Skip for now</button>
          </div>
        </div>
      )}

      {codeEntryFor&&(
        <div style={{position:"fixed",inset:0,background:"rgba(11,31,53,.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:"1rem"}}>
          <div style={{background:surface,borderRadius:18,padding:"2rem",maxWidth:440,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.3)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:".75rem"}}>
              <div style={{fontSize:"1.6rem"}}>🔒</div>
              <h3 style={{fontFamily:"Georgia,serif",fontSize:"1.25rem",color:dm?"#E8F4FF":"#0B1F35",margin:0}}>{codeEntryFor.title}</h3>
            </div>
            <p style={{color:muted,fontSize:".85rem",lineHeight:1.6,marginBottom:"1.25rem"}}>This course requires purchase. After you buy, we'll email you the access code within 24 hours — enter it below to unlock the course instantly.</p>
            <div style={{display:"flex",gap:9,marginBottom:"1.25rem"}}>
              <button onClick={()=>{const url=SQUARE[codeEntryFor.id];setCodeEntryFor(null);startPurchase(url);}} style={{...S.btnP,flex:1,padding:"10px"}}>Buy this course — £15</button>
              <button onClick={()=>{setCodeEntryFor(null);startPurchase(SQUARE.full);}} style={{...S.btnG,flex:1,padding:"9px"}}>Buy full bundle — £79</button>
            </div>
            <div style={{borderTop:"1px solid "+border,paddingTop:"1.1rem"}}>
              <label style={{fontSize:".78rem",color:muted,fontWeight:600,display:"block",marginBottom:".4rem"}}>Already paid? Enter your access code</label>
              <input autoFocus type="text" inputMode="numeric" maxLength={4} placeholder="e.g. 1001" value={codeInput}
                onChange={e=>{setCodeInput(e.target.value.replace(/[^0-9]/g,""));setCodeError("");}}
                onKeyDown={e=>e.key==="Enter"&&submitCode()}
                style={{width:"100%",border:"2px solid "+border,borderRadius:10,padding:"11px 14px",fontSize:"1.3rem",fontWeight:700,letterSpacing:"4px",textAlign:"center",fontFamily:"inherit",outline:"none",color:text,background:dm?"#0F1923":"#fff",marginBottom:".75rem",boxSizing:"border-box"}} />
              {codeError&&<div style={{color:"#C0392B",fontSize:".78rem",marginBottom:".75rem",lineHeight:1.5}}>{codeError}</div>}
              <div style={{display:"flex",gap:9}}>
                <button onClick={()=>{setCodeEntryFor(null);setCodeInput("");setCodeError("");}} style={{flex:1,background:"none",border:"1.5px solid "+border,color:muted,padding:"10px",borderRadius:9,fontWeight:600,fontSize:".85rem",cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                <button disabled={!codeInput.trim()} onClick={submitCode} style={{flex:1,background:codeInput.trim()?"#1A7A4A":(dm?"#2A3A50":"#DDE5EF"),color:codeInput.trim()?"#fff":"#aaa",border:"none",padding:"10px",borderRadius:9,fontWeight:700,fontSize:".85rem",cursor:codeInput.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>Unlock Course</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTermsGate&&(
        <div style={{position:"fixed",inset:0,background:"rgba(11,31,53,.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:"1rem"}}>
          <div style={{background:surface,borderRadius:18,padding:"2rem",maxWidth:480,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,.3)",maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1rem"}}>
              <div style={{fontSize:"1.4rem"}}>📋</div>
              <h3 style={{fontFamily:"Georgia,serif",fontSize:"1.3rem",color:dm?"#E8F4FF":"#0B1F35",margin:0}}>Before you continue to checkout</h3>
            </div>
            <div style={{background:dm?"rgba(212,160,23,.08)":"#FFF8E1",border:"1px solid "+(dm?"rgba(212,160,23,.25)":"#F0D98C"),borderRadius:10,padding:"1rem 1.1rem",marginBottom:"1.25rem",fontSize:".83rem",color:dm?"#E8C97A":"#6B5410",lineHeight:1.65}}>
              PodCPD Academy is an independent self-study resource. It is <strong>not accredited or formally certified CPD</strong>, and is not endorsed by the HCPC or the Royal College of Podiatry (RCPod). Please read the full <button onClick={()=>{setShowTermsGate(false);setScreen("terms");goTop();}} style={{background:"none",border:"none",color:"#2B7FDD",textDecoration:"underline",cursor:"pointer",fontSize:".83rem",padding:0,fontFamily:"inherit"}}>Terms and Conditions</button> before purchasing.
            </div>
            <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",marginBottom:"1.5rem"}}>
              <input type="checkbox" checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)} style={{marginTop:3,width:18,height:18,flexShrink:0,cursor:"pointer"}} />
              <span style={{fontSize:".87rem",color:text,lineHeight:1.55}}>I have read and agree to the <button onClick={()=>{setShowTermsGate(false);setScreen("terms");goTop();}} style={{background:"none",border:"none",color:"#2B7FDD",textDecoration:"underline",cursor:"pointer",fontSize:".87rem",padding:0,fontFamily:"inherit"}}>Terms and Conditions</button>, including the disclaimer that this is unaccredited educational content provided for reference only.</span>
            </label>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>{setShowTermsGate(false);setPendingBuyUrl(null);}} style={{flex:1,background:"none",border:"1.5px solid "+border,color:muted,padding:"11px",borderRadius:9,fontWeight:600,fontSize:".87rem",cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
              {termsAccepted
                ? <a href={pendingBuyUrl} target="_blank" rel="noreferrer" onClick={()=>{setTimeout(function(){setShowTermsGate(false);setPendingBuyUrl(null);},0);}} style={{flex:1,display:"block",textAlign:"center",background:"#2B7FDD",color:"#fff",border:"none",padding:"11px",borderRadius:9,fontWeight:700,fontSize:".87rem",cursor:"pointer",fontFamily:"inherit",textDecoration:"none",boxSizing:"border-box"}}>Continue to Checkout →</a>
                : <button disabled style={{flex:1,background:dm?"#2A3A50":"#DDE5EF",color:"#aaa",border:"none",padding:"11px",borderRadius:9,fontWeight:700,fontSize:".87rem",cursor:"not-allowed",fontFamily:"inherit"}}>Continue to Checkout →</button>
              }
            </div>
          </div>
        </div>
      )}

      <nav style={S.nav}>
        {/* Brand / Logo */}
        <button style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",background:"none",border:"none",padding:"0 4px",flexShrink:0}} onClick={()=>{setScreen("home");setMenuOpen(false);goTop();}}>
          <div style={{width:38,height:38,background:"linear-gradient(135deg,#2B7FDD,#00B4C5)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,boxShadow:"0 2px 8px rgba(43,127,221,.4)"}}>🦶</div>
          <div style={{textAlign:"left",lineHeight:1.1}}>
            <div style={{color:"#fff",fontWeight:700,fontSize:"1rem",letterSpacing:"-.2px"}}>PodCPD Academy</div>
            <div style={{color:"#4A7090",fontSize:".62rem",letterSpacing:"1.8px",textTransform:"uppercase",marginTop:2}}>Podiatry CPD</div>
          </div>
        </button>

        {/* Desktop nav — hidden on mobile via display */}
        <div className="pcpd-nav-desktop" style={{display:"flex",alignItems:"center",gap:4}}>
          {totalCPD>0&&<span style={{background:"rgba(0,180,197,.15)",border:"1px solid rgba(0,180,197,.3)",color:"#00B4C5",padding:"3px 10px",borderRadius:20,fontSize:".72rem",fontWeight:700,whiteSpace:"nowrap"}}>{totalCPD} CPD hrs</span>}
          <div style={{width:1,height:24,background:"rgba(255,255,255,.1)",margin:"0 4px"}} />
          <button style={{background:showBookmarks?"rgba(255,255,255,.1)":"none",border:"none",color:showBookmarks?"#fff":"#6A9AB0",fontSize:".8rem",cursor:"pointer",padding:"6px 9px",borderRadius:7,display:"flex",alignItems:"center",gap:4}} onClick={()=>setShowBookmarks(!showBookmarks)} title="Bookmarks [B]">
            <span style={{fontSize:"1rem"}}>{allBookmarks.length>0?"★":"☆"}</span>
            {allBookmarks.length>0&&<span style={{fontSize:".72rem"}}>{allBookmarks.length}</span>}
          </button>
          <button style={{background:"none",border:"none",color:"#6A9AB0",cursor:"pointer",padding:"6px 8px",borderRadius:7}} onClick={cycleFontSize} title="Font size">
            <span style={{fontSize:fontSize>1?"1.1rem":fontSize<1?".75rem":".9rem",fontWeight:700,color:"#8BA4BF"}}>A</span>
          </button>
          <button style={{background:"none",border:"none",cursor:"pointer",padding:"6px 8px",borderRadius:7,fontSize:"1.05rem"}} onClick={toggleDark} title="Dark mode [D]">{darkMode?"☀️":"🌙"}</button>
          <div style={{width:1,height:24,background:"rgba(255,255,255,.1)",margin:"0 4px"}} />
          {userName
            ? <button style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",color:"#C0D8F0",fontSize:".8rem",fontWeight:500,cursor:"pointer",padding:"5px 12px",borderRadius:7,whiteSpace:"nowrap"}} onClick={()=>setShowNameModal(true)}>👤 {userName.split(" ")[0]}</button>
            : <button style={{background:"rgba(43,127,221,.15)",border:"1px solid rgba(43,127,221,.3)",color:"#7EC8F0",fontSize:".8rem",fontWeight:500,cursor:"pointer",padding:"5px 12px",borderRadius:7,whiteSpace:"nowrap"}} onClick={()=>setShowNameModal(true)}>+ Add name</button>
          }
          <button style={{background:screen==="progress"?"rgba(255,255,255,.1)":"none",border:screen==="progress"?"1px solid rgba(255,255,255,.15)":"none",color:screen==="progress"?"#fff":"#6A9AB0",fontSize:".8rem",cursor:"pointer",padding:"5px 12px",borderRadius:7,whiteSpace:"nowrap"}} onClick={()=>{setScreen("progress");goTop();}}>My CPD</button>
          {screen!=="home"&&<button style={{background:"none",border:"none",color:"#6A9AB0",fontSize:".8rem",cursor:"pointer",padding:"5px 12px",borderRadius:7,whiteSpace:"nowrap"}} onClick={()=>{setScreen("home");goTop();}}>All courses</button>}
        </div>

        {/* Hamburger button — always visible, opens mobile menu */}
        <button
          onClick={()=>setMenuOpen(o=>!o)}
          aria-label={menuOpen?"Close menu":"Open menu"}
          style={{display:"flex",flexDirection:"column",justifyContent:"space-between",width:34,height:24,background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}}>
          <span style={{display:"block",height:2.5,borderRadius:2,background:menuOpen?"#fff":"#6A9AB0",width:"100%",transform:menuOpen?"rotate(45deg) translateY(10px)":"none",transition:"all .2s"}} />
          <span style={{display:"block",height:2.5,borderRadius:2,background:menuOpen?"#fff":"#6A9AB0",width:"100%",opacity:menuOpen?0:1,transition:"all .2s"}} />
          <span style={{display:"block",height:2.5,borderRadius:2,background:menuOpen?"#fff":"#6A9AB0",width:"100%",transform:menuOpen?"rotate(-45deg) translateY(-10px)":"none",transition:"all .2s"}} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen&&(
        <div style={{position:"fixed",top:64,left:0,right:0,background:navBg,zIndex:99,borderBottom:"2px solid rgba(43,127,221,.3)",boxShadow:"0 8px 32px rgba(0,0,0,.4)"}}>
          <div style={{padding:"1rem 1.5rem",display:"flex",flexDirection:"column",gap:0}}>
            {/* Name / Identity */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".75rem 0",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
              <div>
                {userName
                  ? <div style={{color:"#fff",fontWeight:600,fontSize:".9rem"}}>👤 {userName}</div>
                  : <div style={{color:"#6A9AB0",fontSize:".85rem"}}>No name added yet</div>
                }
                <div style={{color:"#4A7090",fontSize:".72rem",marginTop:2}}>
                  {totalCPD>0?totalCPD+" CPD hrs earned":""}{totalStudyMins>0?" · "+totalStudyMins+"m studied":""}
                </div>
              </div>
              <button style={{background:"rgba(43,127,221,.15)",border:"1px solid rgba(43,127,221,.3)",color:"#7EC8F0",fontSize:".78rem",fontWeight:500,cursor:"pointer",padding:"5px 12px",borderRadius:7}} onClick={()=>{setShowNameModal(true);setMenuOpen(false);}}>
                {userName?"Edit name":"+ Add name"}
              </button>
            </div>
            {/* Nav links */}
            {[
              {label:"🏠  All courses",action:()=>{setScreen("home");setMenuOpen(false);goTop();}},
              {label:"📊  My CPD Record",action:()=>{setScreen("progress");setMenuOpen(false);goTop();}},
              {label:"☆  Bookmarks"+(allBookmarks.length>0?" ("+allBookmarks.length+")":""),action:()=>{setShowBookmarks(b=>!b);setMenuOpen(false);}},
              {label:"📋  Terms and Conditions",action:()=>{setScreen("terms");setMenuOpen(false);goTop();}},
            ].map((item,i)=>(
              <button key={i} onClick={item.action} style={{background:"none",border:"none",color:"#C0D8F0",fontSize:".9rem",cursor:"pointer",padding:".85rem 0",borderBottom:"1px solid rgba(255,255,255,.06)",textAlign:"left",fontFamily:"inherit",fontWeight:500}}>
                {item.label}
              </button>
            ))}
            {/* Tools row */}
            <div style={{display:"flex",gap:"0.75rem",padding:".85rem 0",alignItems:"center"}}>
              <button onClick={()=>{toggleDark();setMenuOpen(false);}} style={{flex:1,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"#C0D8F0",fontSize:".82rem",cursor:"pointer",padding:"9px",borderRadius:9,fontFamily:"inherit"}}>
                {darkMode?"☀️  Light mode":"🌙  Dark mode"}
              </button>
              <button onClick={()=>{cycleFontSize();}} style={{flex:1,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"#C0D8F0",fontSize:".82rem",cursor:"pointer",padding:"9px",borderRadius:9,fontFamily:"inherit"}}>
                <span style={{fontWeight:700}}>A</span>  Font size ({Math.round(fontSize*100)}%)
              </button>
            </div>
          </div>
        </div>
      )}

      {screen==="home"&&<Home />}
      {screen==="course"&&course&&pg&&<CourseReader />}
      {screen==="exam"&&<Exam />}
      {screen==="cert"&&<Cert />}
      {screen==="progress"&&<Progress />}
      {screen==="terms"&&<Terms />}
    </div>
  );
}
