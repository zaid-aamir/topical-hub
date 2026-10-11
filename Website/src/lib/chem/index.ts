/**
 * Display-only chemistry formatting (H2SO4 -> H₂SO₄, Cu2+ -> Cu²⁺, cm3 -> cm³).
 *
 * - formatChem(text): plain text to plain text, strict and idempotent.
 * - applyChem(html): formatChem over the text nodes of an HTML string only.
 * - ELEMENTS / ELEMENT_SET / isElement: the 118 element symbols.
 *
 * Whether the site uses any of this is decided by CHEM_FORMATTING in src/config.ts, read by
 * src/lib/markdown.ts. These functions themselves never look at the switch.
 */
export { formatChem } from './formatChem';
export { applyChem } from './applyChem';
export { ELEMENTS, ELEMENT_SET, isElement } from './elements';
