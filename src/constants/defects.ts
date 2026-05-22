export const DEFECT_CLASSES = [
  'Missing Hole',
  'Mouse Bite',
  'Spur',
  'Short Circuit',
  'Open Circuit',
  'Spurious Copper',
] as const;

export type DefectClass = (typeof DEFECT_CLASSES)[number];

export const DEFECT_DESCRIPTIONS: Record<DefectClass, string> = {
  'Missing Hole': 'Drill hole absent from expected PCB location',
  'Mouse Bite': 'Irregular edge erosion along PCB boundary',
  'Spur': 'Unwanted copper protrusion on trace',
  'Short Circuit': 'Unintended conductive bridge between traces',
  'Open Circuit': 'Break in conductive path causing circuit failure',
  'Spurious Copper': 'Residual copper deposit outside intended areas',
};

export const DEFECT_SEVERITY: Record<DefectClass, 'critical' | 'major' | 'minor'> = {
  'Missing Hole': 'critical',
  'Mouse Bite': 'major',
  'Spur': 'minor',
  'Short Circuit': 'critical',
  'Open Circuit': 'critical',
  'Spurious Copper': 'major',
};
