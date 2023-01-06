
// export const COMMITTEE_NAME_CLEANING = {
// TODO - switch over to model analogous to lawmakers to capture variation in committe names from different places in LAWS
// }

export const COMMITTEES = [
    // HOUSE
    { key: "(H) (H) Appropriations", name: 'House Appropriations', daysOfWeek: 'daily', time: '8 a.m.', type: 'fiscal', },

    { key: "(H) (H) Judiciary", name: 'House Judiciary', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },
    { key: "(H) (H) Business and Labor", name: 'House Business and Labor', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },
    { key: "(H) (H) Taxation", name: 'House Taxation', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },
    { key: "(H) (H) State Administration", name: 'House State Administration', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },
    { key: "(H) (H) Human Services", name: 'House Human Services', daysOfWeek: 'daily', time: '3 p.m.', type: 'policy', },

    { key: "(H) (H) Natural Resources", name: 'House Natural Resources', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { key: "(H) (H) Transportation", name: 'House Transportation', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { key: "(H) (H) Education", name: 'House Education', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { key: "(H) (H) Energy, Technology and Federal Relations", name: 'House Energy, Technology and Federal Relations', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },

    { key: "(H) (H) Agriculture", name: 'House Agriculture', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },
    { key: "(H) (H) Fish, Wildlife and Parks", name: 'House Fish, Wildlife and Parks', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },
    { key: "(H) (H) Local Government", name: 'House Local Government', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },

    { key: "(H) (H) Rules", name: 'House Rules', daysOfWeek: 'on call', time: '', type: 'policy', },
    { key: "(H) (H) Ethics", name: 'House Ethics', daysOfWeek: 'on call', time: '', type: 'policy', suppress: true },
    { key: "(H) (H) Legislative Administration", name: 'House Legislative Administration', daysOfWeek: 'on call', time: '', type: 'policy', },


    // SENATE
    { key: "(S) (S) Finance and Claims", name: 'Senate Finance and Claims', daysOfWeek: 'daily', time: '8 a.m.', type: 'fiscal', },

    { key: "(S) (S) Judiciary", name: 'Senate Judiciary', daysOfWeek: 'daily', time: '9 a.m.', type: 'policy', },
    { key: "(S) (S) Business, Labor, and Economic Affairs", name: 'Senate Business, Labor, and Economic Affairs', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },
    { key: "(S) (S) Taxation", name: 'Senate Taxation', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },

    { key: "(S) (S) Energy and Telecommunications", name: 'Senate Education and Cultural Resources', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { key: "(S) (S) Local Government", name: 'Senate Local Government', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { key: "(S) (S) Natural Resources", name: 'Senate Natural Resources', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { key: "(S) (S) Public Health, Welfare and Safety", name: 'Senate Public Health, Welfare and Safety', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { key: "(S) (S) State Administration", name: 'Senate State Administration', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },

    { key: "(S) (S) Agriculture, Livestock and Irrigation", name: 'Senate Agriculture, Livestock and Irrigation', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },
    { key: "(S) (S) Education and Cultural Resources", name: 'Senate Energy and Telecommunications', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },
    { key: "(S) (S) Fish and Game", name: 'Senate Fish and Game', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },
    { key: "(S) (S) Highways and Transportation", name: 'Senate Highways and Transportation', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },

    { key: "(S) (S) Committee on Committees", name: 'Senate Committee on Committees', daysOfWeek: 'on call', time: '', type: 'special', suppress: true },
    { key: "(S) (S) Ethics", name: 'Senate Ethics', daysOfWeek: 'on call', time: '', type: 'special', suppress: true },
    { key: "(S) (S) Rules", name: 'Senate Rules', daysOfWeek: 'on call', time: '', type: 'special', },
    { key: "(S) (S) Legislative Administration", name: 'Senate Legislative Administration', daysOfWeek: 'on call', time: '', type: 'special', },

    // { key: "", name: 'Senate Select Committee on Marijuana Law', daysOfWeek: 'on call', time: '', type: 'policy', },

    // joint approps
    { key: "(H) (H) Joint Appropriations Subcommittee on General Government", name: 'Joint Appropriations Subcommittee A — General Government', daysOfWeek: 'daily', time: '8 a.m.', type: 'fiscal-sub', },
    { key: "(H) (H) Joint Appropriations Subcommittee on Health & Human Services", name: 'Joint Appropriations Subcommittee B — Health and Human Services', daysOfWeek: 'daily', time: '8 a.m.', type: 'fiscal-sub', },
    { key: "(H) (H) Joint Appropriations Subcommittee on Natural Resources and Transportation", name: 'Joint Appropriations Subcommittee C — Natural Resources and Transportation', daysOfWeek: 'daily', time: ' 8:30 a.m.', type: 'fiscal-sub', },
    { key: "(H) (H)Joint Approps Subcom on Judicial Branch, Law Enforcement, and Justice", name: 'Joint Approps Subcommittee D — Judicial Branch, Law Enforcement, and Justice', daysOfWeek: 'daily', time: '8 a.m.', type: 'fiscal-sub', },
    { key: "(H) (H) Joint Appropriations Subcommittee on Education", name: 'Joint Appropriations Subcommittee E — Education', daysOfWeek: 'daily', time: '8:30 a.m.', type: 'fiscal-sub', },
    { key: "(H) (H) Joint Appropriations Subcommittee on Long-Range Planning", name: 'Joint Appropriations Subcommittee F — Long-Range Planning', daysOfWeek: 'daily', time: '8:30 a.m.', type: 'fiscal-sub', },

    // other
    { key: "(H) (H) Joint Rules Committee", name: "Joint Rules Committee", daysOfWeek: 'on call', time: '', type: 'special', },
    { key: "(S) (S) Select Committee on Judicial Transparency and Accountability", name: "Select Committee on Judicial Transparency and Accountability", daysOfWeek: 'on call', time: '', type: 'special', },

    // conference committees
    { key: "", name: 'Senate Conference', daysOfWeek: 'on call', time: '', type: 'conference', },
    { key: "", name: 'Senate Free Conference', daysOfWeek: 'on call', time: '', type: 'conference', },
    { key: "", name: 'House Conference', daysOfWeek: 'on call', time: '', type: 'conference', },
    { key: "", name: 'House Free Conference', daysOfWeek: 'on call', time: '', type: 'conference', },

]

export const EXCLUDE_COMMITTEES = [
    "(J) (S) Committee of Whole",
    "(J) (H) Committee of the Whole",
    "(J) (H) Joint Education",
    "(J) (S) Joint State Admin",
    "(J) (H) Joint Fish, Wildlife & Parks and Senate Fish & Game",
    "(J) (H) Joint Appropriations and Finance & Claims",
    "(J) (H) Joint Natural Resources"
]

