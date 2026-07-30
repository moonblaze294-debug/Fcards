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
        name: 'Section 1: Forensic Medicine',
        chapters: [

          chapter("fm-01",1,"Introduction"),
          chapter("fm-02",2,"Legal Procedure"),
          chapter("fm-03",3,"Medical Law and Ethics"),
          chapter("fm-04",4,"Identification"),
          chapter("fm-05",5,"Medicolegal Autopsy"),
          chapter("fm-06",6,"Death and its Cause"),
          chapter("fm-07",7,"Postmortem Changes"),
          chapter("fm-08",8,"Mechanical Injuries"),
          chapter("fm-09",9,"Regional Injuries"),
          chapter("fm-10",10,"Medicolegal Aspects of Wounds"),
          chapter("fm-11",11,"Thermal Deaths"),
          chapter("fm-12",12,"Starvation"),
          chapter("fm-13",13,"Mechanical Asphyxia"),
          chapter("fm-14",14,"Anesthetic and Operative Deaths"),
          chapter("fm-15",15,"Impotence and Sterility"),
          chapter("fm-16",16,"Virginity, Pregnancy and Delivery"),
          chapter("fm-17",17,"Abortion"),
          chapter("fm-18",18,"Sexual Offences"),
          chapter("fm-19",19,"Infant Deaths"),
          chapter("fm-20",20,"Blood Stains"),
          chapter("fm-21",21,"Artefacts"),
          chapter("fm-22",22,"Forensic Science Laboratory"),
          chapter("fm-23",23,"Forensic Psychiatry")

        ]
      },
      {
        name: 'Section 2: Toxicology',
        chapters: [

          chapter("fm-24",24,"General Considerations"),
          chapter("fm-25",25,"Agricultural Poisons"),
          chapter("fm-26",26,"Corrosive Poisons"),
          chapter("fm-27",27,"Metallic Poisons"),
          chapter("fm-28",28,"Inorganic Irritant Poisons"),
          chapter("fm-29",29,"Inebriant Poisons"),
          chapter("fm-30",30,"Asphyxiants"),
          chapter("fm-31",31,"Pharmaceutical Toxicology"),
          chapter("fm-32",32,"Biotoxicology")

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
        name: null,
        chapters: [

          chapter("cm-01",1,"Man and Medicine Towards Health for All"),
          chapter("cm-02",2,"Concept of Health and Disease"),
          chapter("cm-03",3,"Principles of Epidemiology and Epidemiologic Methods"),
          chapter("cm-04",4,"Screening"),
          chapter("cm-05",5,"Epidemiology of Communicable Diseases"),
          chapter("cm-06",6,"Epidemiology of Non-Communicable Diseases"),
          chapter("cm-07",7,"Health Programmes in India"),
          chapter("cm-08",8,"Demography and Family Planning"),
          chapter("cm-09",9,"Preventive Medicine in Obstetrics, Paediatrics and Geriatrics"),
          chapter("cm-10",10,"Health Care of the Community"),
          chapter("cm-11",11,"Nutrition and Health"),
          chapter("cm-12",12,"Medicine and Social Sciences"),
          chapter("cm-13",13,"Tribal Health in India"),
          chapter("cm-14",14,"Sustainable Development Goals"),
          chapter("cm-15",15,"Environment and Health"),
          chapter("cm-16",16,"Hospital Waste Management"),
          chapter("cm-17",17,"Disaster Management"),
          chapter("cm-18",18,"Occupational Health"),
          chapter("cm-19",19,"Genetics and Health"),
          chapter("cm-20",20,"Mental Health"),
          chapter("cm-21",21,"Health Information and Basic Medical Statistics"),
          chapter("cm-22",22,"Communication for Health Education"),
          chapter("cm-23",23,"Health Planning and Management"),
          chapter("cm-24",24,"Essential Medicines and Counterfeit Medicines"),
          chapter("cm-25",25,"International Health")

        ]
      }
    ]
  }
];
