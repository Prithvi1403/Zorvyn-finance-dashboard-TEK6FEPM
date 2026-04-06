/* ══════════════════════════════════════════
   SVG Icon Library — Zero Dependencies
   Clean geometric icons replacing all emojis
   ══════════════════════════════════════════ */

const I = ({ children, size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

// ── Navigation ──
export const IconDashboard = (p) => <I {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></I>;
export const IconList      = (p) => <I {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></I>;
export const IconPieChart  = (p) => <I {...p}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></I>;
export const IconSettings  = (p) => <I {...p}><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></I>;
export const IconBrain     = (p) => <I {...p}><path d="M12 2a6 6 0 0 0-6 6c0 2.5 1.5 4.5 3 5.74V16h6v-2.26c1.5-1.24 3-3.24 3-5.74a6 6 0 0 0-6-6z"/><line x1="10" y1="16" x2="10" y2="20"/><line x1="14" y1="16" x2="14" y2="20"/><line x1="9" y1="20" x2="15" y2="20"/></I>;

// ── Category Icons ──
export const IconUtensils  = (p) => <I {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="22"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7"/></I>;
export const IconCar       = (p) => <I {...p}><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></I>;
export const IconHome      = (p) => <I {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></I>;
export const IconFilm      = (p) => <I {...p}><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></I>;
export const IconHeart     = (p) => <I {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></I>;
export const IconBag       = (p) => <I {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></I>;
export const IconBriefcase = (p) => <I {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></I>;
export const IconTrendUp   = (p) => <I {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></I>;
export const IconLaptop    = (p) => <I {...p}><rect x="3" y="4" width="18" height="12" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></I>;
export const IconZap       = (p) => <I {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></I>;

// ── UI Icons ──
export const IconSearch    = (p) => <I {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></I>;
export const IconPlus      = (p) => <I {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>;
export const IconX         = (p) => <I {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></I>;
export const IconTrash     = (p) => <I {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></I>;
export const IconDownload  = (p) => <I {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></I>;
export const IconEye       = (p) => <I {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></I>;
export const IconShield    = (p) => <I {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>;
export const IconArrowUp   = (p) => <I {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></I>;
export const IconArrowDown = (p) => <I {...p}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></I>;
export const IconRefresh   = (p) => <I {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></I>;
export const IconMenu      = (p) => <I {...p}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></I>;
export const IconCheck     = (p) => <I {...p}><polyline points="20 6 9 17 4 12"/></I>;
export const IconAlert     = (p) => <I {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></I>;
export const IconCurrency  = (p) => <I {...p}><line x1="6" y1="4" x2="18" y2="4"/><line x1="6" y1="8" x2="18" y2="8"/><path d="M14 4v4a4 4 0 1 1-4-4"/><line x1="6" y1="20" x2="14" y2="12"/></I>;

// ── Category icon map ──
export const CATEGORY_ICON_MAP = {
  'Food & Dining':    IconUtensils,
  'Transport':        IconCar,
  'Housing':          IconHome,
  'Entertainment':    IconFilm,
  'Health & Wellness': IconHeart,
  'Shopping':         IconBag,
  'Salary':           IconBriefcase,
  'Investment':       IconTrendUp,
  'Freelance':        IconLaptop,
  'Utilities':        IconZap,
};

export function CategoryIcon({ category, size = 14, ...props }) {
  const Comp = CATEGORY_ICON_MAP[category];
  return Comp ? <Comp size={size} {...props} /> : <IconZap size={size} {...props} />;
}
