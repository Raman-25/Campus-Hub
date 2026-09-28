/**
 * Academic constants for Campus Hub
 * Enforces the contract specified in FRONTEND_CONTEXT.md:
 * - Query params: enum constants (COMPUTER_SCIENCE, etc.)
 * - JSON request bodies: readable names ("Computer Science", etc.)
 * - Year labels: exact ordinals (1st Year, 2nd Year, 3rd Year, 4th Year) with integer values (1-4).
 */

export const DEPARTMENTS = [
  {
    code: 'COMPUTER_SCIENCE',
    name: 'Computer Science',
    shortCode: 'CS',
    description: 'Algorithms, Software Systems & Data Structures',
  },
  {
    code: 'ELECTRONICS',
    name: 'Electronics & Communication',
    shortCode: 'ECE',
    description: 'Embedded Systems, VLSI & Signal Processing',
  },
  {
    code: 'MECHANICAL',
    name: 'Mechanical Engineering',
    shortCode: 'ME',
    description: 'Thermodynamics, Robotics & Manufacturing',
  },
  {
    code: 'CIVIL',
    name: 'Civil Engineering',
    shortCode: 'CE',
    description: 'Structural Analysis, Geotech & Urban Planning',
  },
  {
    code: 'ELECTRICAL',
    name: 'Electrical Engineering',
    shortCode: 'EE',
    description: 'Power Grids, Control Systems & Electric Drives',
  },
];

export const YEARS = [
  { value: 1, label: '1st Year' },
  { value: 2, label: '2nd Year' },
  { value: 3, label: '3rd Year' },
  { value: 4, label: '4th Year' },
];

/**
 * Helper to get readable department name from enum code
 */
export function getDepartmentName(code) {
  const match = DEPARTMENTS.find((d) => d.code === code);
  return match ? match.name : code;
}

/**
 * Helper to get enum code from readable department name
 */
export function getDepartmentCode(name) {
  const match = DEPARTMENTS.find((d) => d.name === name);
  return match ? match.code : name;
}

/**
 * Helper to get year label
 */
export function getYearLabel(yearNumber) {
  const match = YEARS.find((y) => y.value === Number(yearNumber));
  return match ? match.label : `${yearNumber}th Year`;
}
