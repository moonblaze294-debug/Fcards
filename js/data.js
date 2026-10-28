function chapter(id, num, name) {
  return {
    id,
    num,
    name,
    premium: false,
    estimatedCards: 0,
    estimatedNotes: 0,
    estimatedQuiz: 0,
    estimatedViva: 0,
    lastUpdated: null,
    topics: []
  };
}

const SUBJECTS = [
  {
    id: 'forensic',
    name: 'Forensic Medicine and Toxicology',
    code: 'FM',
    sections: [
      {
        name: 'Forensic Medicine',
        chapters: [
          chapter('fm-01', 1, 'Introduction to Forensic Medicine'),
          chapter('fm-02', 2, 'Legal Procedure and Ethics'),
          chapter('fm-03', 3, 'Identification and Personal Identity'),
          chapter('fm-04', 4, 'Death and Postmortem Changes')
        ]
      },
      {
        name: 'Toxicology',
        chapters: [
          chapter('fm-05', 5, 'General Toxicology'),
          chapter('fm-06', 6, 'Agricultural Poisons'),
          chapter('fm-07', 7, 'Corrosives and Metallic Poisons'),
          chapter('fm-08', 8, 'Inorganic and Organic Poisons')
        ]
      }
    ]
  },
  {
    id: 'community',
    name: 'Community Medicine',
    code: 'CM',
    sections: [
      {
        name: 'Core Community Medicine',
        chapters: [
          chapter('cm-01', 1, 'Health and Disease Concepts'),
          chapter('cm-02', 2, 'Epidemiology and Screening'),
          chapter('cm-03', 3, 'Communicable and Non-communicable Diseases'),
          chapter('cm-04', 4, 'Nutrition and Health Programs')
        ]
      }
    ]
  },
  {
    id: 'anatomy',
    name: 'Anatomy',
    code: 'AN',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('an-01', 1, 'General Anatomy'),
        chapter('an-02', 2, 'Upper Limb'),
        chapter('an-03', 3, 'Lower Limb'),
        chapter('an-04', 4, 'Thorax and Abdomen')
      ]
    }]
  },
  {
    id: 'physiology',
    name: 'Physiology',
    code: 'PH',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('ph-01', 1, 'General Physiology'),
        chapter('ph-02', 2, 'Nerve and Muscle'),
        chapter('ph-03', 3, 'Cardiovascular System'),
        chapter('ph-04', 4, 'Respiratory System')
      ]
    }]
  },
  {
    id: 'biochemistry',
    name: 'Biochemistry',
    code: 'BC',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('bc-01', 1, 'Enzymes and Metabolism'),
        chapter('bc-02', 2, 'Carbohydrates and Lipids'),
        chapter('bc-03', 3, 'Proteins and Nucleic Acids'),
        chapter('bc-04', 4, 'Clinical Biochemistry')
      ]
    }]
  },
  {
    id: 'pathology',
    name: 'Pathology',
    code: 'PA',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('pa-01', 1, 'General Pathology'),
        chapter('pa-02', 2, 'Inflammation and Repair'),
        chapter('pa-03', 3, 'Neoplasia'),
        chapter('pa-04', 4, 'Systemic Pathology')
      ]
    }]
  },
  {
    id: 'microbiology',
    name: 'Microbiology',
    code: 'MI',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('mi-01', 1, 'General Microbiology'),
        chapter('mi-02', 2, 'Bacteriology'),
        chapter('mi-03', 3, 'Virology'),
        chapter('mi-04', 4, 'Mycology and Parasitology')
      ]
    }]
  },
  {
    id: 'pharmacology',
    name: 'Pharmacology',
    code: 'PG',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('pg-01', 1, 'General Pharmacology'),
        chapter('pg-02', 2, 'Autonomic Nervous System'),
        chapter('pg-03', 3, 'Cardiovascular Drugs'),
        chapter('pg-04', 4, 'Antimicrobials')
      ]
    }]
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    code: 'GM',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('gm-01', 1, 'Approach to Diagnosis'),
        chapter('gm-02', 2, 'Cardiology'),
        chapter('gm-03', 3, 'Pulmonology'),
        chapter('gm-04', 4, 'Endocrinology')
      ]
    }]
  },
  {
    id: 'general-surgery',
    name: 'General Surgery',
    code: 'GS',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('gs-01', 1, 'Surgical Principles'),
        chapter('gs-02', 2, 'Head and Neck'),
        chapter('gs-03', 3, 'Abdominal Surgery'),
        chapter('gs-04', 4, 'Trauma and Emergency Surgery')
      ]
    }]
  },
  {
    id: 'obgyn',
    name: 'Obstetrics and Gynaecology',
    code: 'OG',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('og-01', 1, 'Basic Obstetrics'),
        chapter('og-02', 2, 'Normal Labour'),
        chapter('og-03', 3, 'Gynaecology Basics'),
        chapter('og-04', 4, 'High-Risk Pregnancy')
      ]
    }]
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    code: 'PD',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('pd-01', 1, 'Growth and Development'),
        chapter('pd-02', 2, 'Neonatology'),
        chapter('pd-03', 3, 'Infectious Diseases in Children'),
        chapter('pd-04', 4, 'Nutrition and Paediatric Emergencies')
      ]
    }]
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    code: 'OP',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('op-01', 1, 'Eye Anatomy and Physiology'),
        chapter('op-02', 2, 'Refraction and Optics'),
        chapter('op-03', 3, 'Diseases of the Conjunctiva'),
        chapter('op-04', 4, 'Glaucoma and Retina')
      ]
    }]
  },
  {
    id: 'ent',
    name: 'Otorhinolaryngology (ENT)',
    code: 'EN',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('en-01', 1, 'ENT Anatomy'),
        chapter('en-02', 2, 'Ear Disorders'),
        chapter('en-03', 3, 'Nose and Sinus Disorders'),
        chapter('en-04', 4, 'Throat and Larynx Disorders')
      ]
    }]
  },
  {
    id: 'orthopaedics',
    name: 'Orthopaedics',
    code: 'OR',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('or-01', 1, 'Basic Orthopaedic Principles'),
        chapter('or-02', 2, 'Trauma and Fractures'),
        chapter('or-03', 3, 'Joint Disorders'),
        chapter('or-04', 4, 'Spine and Paediatric Orthopaedics')
      ]
    }]
  },
  {
    id: 'dermatology',
    name: 'Dermatology, Venereology, and Leprosy',
    code: 'DV',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('dv-01', 1, 'Skin Anatomy and Functions'),
        chapter('dv-02', 2, 'Infections of the Skin'),
        chapter('dv-03', 3, 'Dermatitis and Eczema'),
        chapter('dv-04', 4, 'Leprosy and STI Disorders')
      ]
    }]
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    code: 'PS',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('ps-01', 1, 'Psychiatric Assessment'),
        chapter('ps-02', 2, 'Mood and Anxiety Disorders'),
        chapter('ps-03', 3, 'Psychotic Disorders'),
        chapter('ps-04', 4, 'Substance Abuse and Emergency Psychiatry')
      ]
    }]
  },
  {
    id: 'anesthesiology',
    name: 'Anesthesiology',
    code: 'AS',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('as-01', 1, 'Principles of Anaesthesia'),
        chapter('as-02', 2, 'Airway Management'),
        chapter('as-03', 3, 'Regional Anaesthesia'),
        chapter('as-04', 4, 'Monitoring and Complications')
      ]
    }]
  },
  {
    id: 'radiology',
    name: 'Radiology',
    code: 'RA',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('ra-01', 1, 'Principles of Imaging'),
        chapter('ra-02', 2, 'Chest Radiology'),
        chapter('ra-03', 3, 'Abdominal Imaging'),
        chapter('ra-04', 4, 'Neuroimaging Basics')
      ]
    }]
  },
  {
    id: 'emergency-medicine',
    name: 'Emergency Medicine',
    code: 'EM',
    sections: [{
      name: 'Core Chapters',
      chapters: [
        chapter('em-01', 1, 'Emergency Triage'),
        chapter('em-02', 2, 'Resuscitation'),
        chapter('em-03', 3, 'Trauma Management'),
        chapter('em-04', 4, 'Medical Emergencies')
      ]
    }]
  }
];
