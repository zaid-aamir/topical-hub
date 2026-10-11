import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { formatChem } from '../../../src/lib/chem/formatChem';
import { ELEMENTS, ELEMENT_SET, isElement } from '../../../src/lib/chem/elements';

/**
 * Positive cases: [input, expected output, where it comes from].
 * Question ids are cited where the token appears in the real content.
 */
const positive: Array<[string, string, string]> = [
  // Subscripts
  ['H2SO4', 'H₂SO₄', 'T03 Q? sulfuric acid'],
  ['Ca(OH)2', 'Ca(OH)₂', 'spec'],
  ['C6H12O6', 'C₆H₁₂O₆', 'T05 glucose'],
  ['2H2O', '2H₂O', 'spec: coefficient stays'],
  ['6CO2', '6CO₂', 'T05 photosynthesis'],
  ['Al2(SO4)3', 'Al₂(SO₄)₃', 'T03_20260923_01_Q5 option A'],
  ['(NH4)2SO4', '(NH₄)₂SO₄', 'spec'],
  ['Mr(NH3)', 'Mr(NH₃)', 'T03 relative formula mass'],
  ['CH3COOH', 'CH₃COOH', 'T11 ethanoic acid'],
  ['CH3CH2OH', 'CH₃CH₂OH', 'T11 ethanol'],
  ['CH3CH(OH)CH2CH3', 'CH₃CH(OH)CH₂CH₃', 'T11 butan-2-ol'],
  ['In2O3', 'In₂O₃', 'spec: In is indium'],
  ['PbBr2', 'PbBr₂', 'T04 markscheme Q3'],
  ['K2Cr2O7', 'K₂Cr₂O₇', 'T06 dichromate'],
  ['CuSO4', 'CuSO₄', 'T07 copper(II) sulfate'],
  ['Fe2O3', 'Fe₂O₃', 'T09 iron(III) oxide'],
  ['N2', 'N₂', 'T05 nitrogen'],
  ['C2H4', 'C₂H₄', 'T11 ethene'],
  ['H2O2', 'H₂O₂', 'spec'],
  ['C12H26', 'C₁₂H₂₆', 'T11 markscheme Q13: two-digit subscript'],
  // Charges
  ['Cu2+', 'Cu²⁺', 'T04 copper(II) ion'],
  ['Fe3+', 'Fe³⁺', 'T06 iron(III) ion'],
  ['Na+', 'Na⁺', 'T02 sodium ion'],
  ['Cl−', 'Cl⁻', 'T02 chloride ion'],
  ['OH−', 'OH⁻', 'T07 hydroxide ion'],
  ['H+', 'H⁺', 'T07 hydrogen ion'],
  ['NH4+', 'NH₄⁺', 'T03 ammonium ion'],
  ['NO3−', 'NO₃⁻', 'T12 nitrate ion'],
  ['MnO4−', 'MnO₄⁻', 'T06_20260923_01_Q27 (d)'],
  ['ClO3−', 'ClO₃⁻', 'spec'],
  ['Pb2+', 'Pb²⁺', 'T04 markscheme Q3'],
  ['Mg2+', 'Mg²⁺', 'T02 magnesium ion'],
  ['S2−', 'S²⁻', 'T02_20260923_01_Q7 sulfide ion'],
  ['O2−', 'O²⁻', 'T02 oxide ion'],
  ['N3−', 'N³⁻', 'T08 markscheme Q16 nitride ion'],
  ['H3O+', 'H₃O⁺', 'T07 markscheme Q2 ALLOW line'],
  ['F-', 'F⁻', 'T02_20260923_01_Q16: ASCII hyphen as the charge'],
  ['Cl-', 'Cl⁻', 'T02 option text with ASCII hyphen'],
  ['CH3COO−(aq)', 'CH₃COO⁻(aq)', 'T07 ethanoate ion with state symbol'],
  ['Zn2+(aq)', 'Zn²⁺(aq)', 'T09 zinc ion with state symbol'],
  ['2Cl−', '2Cl⁻', 'T04 half equation'],
  ['2O2− → O2 + 4e−', '2O²⁻ → O₂ + 4e⁻', 'T09 markscheme Q29 (b) anode half equation'],
  // Hypothetical elements written as one capital letter, charged
  ['X2+', 'X²⁺', 'T08 markscheme Q25'],
  ['T2−', 'T²⁻', 'T08_20260925_01_Q23 option C'],
  ['W2+', 'W²⁺', 'T08 markscheme Q8 ALLOW line (W is tungsten anyway)'],
  // Spaced charges
  ['SO4 2−', 'SO₄²⁻', 'T03_20260923_01_Q5'],
  ['CO3 2−', 'CO₃²⁻', 'T12_20260925_01_Q28 (b)'],
  ['SO3 2−', 'SO₃²⁻', 'T06_20260923_01_Q27 (c)'],
  ['Cr2O7 2−', 'Cr₂O₇²⁻', 'T06_20260923_01_Q27 (b)'],
  ['sulfate ions, SO4 2−, combine', 'sulfate ions, SO₄²⁻, combine', 'T03_20260923_01_Q5 stem (comma after the charge)'],
  ['three SO4 2− ions', 'three SO₄²⁻ ions', 'T03 markscheme Q5 (word after the charge)'],
  ['O2 2−', 'O₂²⁻', 'peroxide: spaced charge after a diatomic'],
  // Electrons and units
  ['2Br− → Br2 + 2e−', '2Br⁻ → Br₂ + 2e⁻', 'T04 anode half equation'],
  ['e−', 'e⁻', 'T04 single electron'],
  ['e-)', 'e⁻)', 'T04 ASCII hyphen electron before a bracket'],
  ['24 dm3', '24 dm³', 'T03 molar gas volume'],
  ['25.0 cm3', '25.0 cm³', 'T03 titration volume'],
  ['0.1 mol/dm3', '0.1 mol/dm³', 'T03_20260923_01_Q22 concentration unit'],
  ['g/dm3 and mol/dm3', 'g/dm³ and mol/dm³', 'T03_20260923_01_Q18 option A'],
  ['(cm3)', '(cm³)', 'T06 table header unit in brackets'],
  // Equations and structures
  ['2Na(s) + 2H2O(l) → 2NaOH(aq) + H2(g)', '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)', 'spec: the + between species is not a charge'],
  ['Na2CO3(s) + H2SO4(aq) → Na2SO4(aq) + H2O(l) + CO2(g)', 'Na₂CO₃(s) + H₂SO₄(aq) → Na₂SO₄(aq) + H₂O(l) + CO₂(g)', 'T03_20260923_01_Q28'],
  ['CuO + H2SO4 → CuSO4 + H2O', 'CuO + H₂SO₄ → CuSO₄ + H₂O', 'T07 markscheme Q9'],
  ['Cu2+ + 2e− → Cu', 'Cu²⁺ + 2e⁻ → Cu', 'T04 cathode half equation'],
  ['O2(g)', 'O₂(g)', 'T05 oxygen with state symbol'],
  ['3H2(g)', '3H₂(g)', 'T06 Haber process'],
  ['HOOC–CH2–CH2–COOH', 'HOOC–CH₂–CH₂–COOH', 'T11_20260925_01_Q29 butanedioic acid (en dash bonds)'],
  ['–[OC–CH2–CH2–CO–O–CH2–CH2–O]–', '–[OC–CH₂–CH₂–CO–O–CH₂–CH₂–O]–', 'T11 markscheme Q29 polyester repeat unit'],
  ['H2N–CH2–CH2–NH2', 'H₂N–CH₂–CH₂–NH₂', 'T11_20260925_01_Q29 (d) diamine'],
  ['–[CH2–CH(CH3)]–', '–[CH₂–CH(CH₃)]–', 'T11 markscheme poly(propene) repeat unit'],
  ['CH2=CHCH3', 'CH₂=CHCH₃', 'T11_20260925_01_Q2 option C'],
  ['CH3CH2CH=CH2 and CH2=CHCH2CH3', 'CH₃CH₂CH=CH₂ and CH₂=CHCH₂CH₃', 'T11_20260925_01_Q3 option B'],
  ['(CH3COO)2Ca', '(CH₃COO)₂Ca', 'T07 calcium ethanoate'],
  ['CuSO4•5H2O', 'CuSO₄•5H₂O', 'T07_20260925_01_Q24 hydrated copper(II) sulfate'],
  ['CuSO4·5H2O', 'CuSO₄·5H₂O', 'T06 markscheme Q10 (middle dot)'],
  ['(H+', '(H⁺', 'unbalanced leading bracket'],
  ['(Cu2+)', '(Cu²⁺)', 'balanced brackets around an ion'],
  ['Ca(CH3COO)2)', 'Ca(CH₃COO)₂)', 'T07 formula followed by a closing bracket'],
  ['Picture the displayed formula of CH2=CH–CH2–CH3.', 'Picture the displayed formula of CH₂=CH–CH₂–CH₃.', 'T11 markscheme Q6 (d)'],
];

/** Inputs that must come out exactly as they went in. */
const unchanged: Array<[string, string]> = [
  ['Q16', 'question reference'],
  ['T04', 'topic reference'],
  ['T04_20260923_01_Q16', 'question id'],
  ['[2]', 'mark bracket'],
  ['(1)', 'mark point'],
  ['(1 each, max 3)', 'mark scheme note'],
  ['pH 7', 'pH'],
  ['25 °C', 'temperature'],
  ['100 kPa', 'pressure'],
  ['10 minutes', 'time'],
  ['1.1.2', 'syllabus point'],
  ['Paper 1', 'paper'],
  ['Group 1', 'group'],
  ['Group VII', 'roman numeral group'],
  ['Period 4', 'period'],
  ['35.5', 'decimal'],
  ['2,8,8,2', 'electronic configuration'],
  ['−890 kJ/mol', 'negative enthalpy change: leading minus is not a charge'],
  ['+2', 'oxidation state'],
  ['a charge of 2+', 'standalone charge'],
  ['charge 2-', 'standalone charge with ASCII hyphen'],
  ['CnH2n+2', 'T11_20260925_01_Q1 general formula: n is not an element'],
  ['CnH2n', 'T11 general formula of alkenes'],
  ['CnH2n+1', 'T11 alkyl group'],
  ['X2', 'T08 markscheme: X is not an element'],
  ['XCl2', 'T08 markscheme Q25 (c): hypothetical compound stays plain'],
  ['Mr', 'relative formula mass symbol'],
  ['Ar = 40', 'relative atomic mass'],
  ['He is', 'English word that is an element symbol'],
  ['In 2026', 'English word plus a year'],
  ['At first', 'English word'],
  ['(Ar: H = 1; N = 14; Cl = 35.5)', 'relative atomic masses line'],
  ['³⁹₁₉K and ⁴¹₁₉K', 'T02_20260923_01_Q10 isotope notation already in Unicode'],
  ['9.3 × 10⁻³ g/s', 'T06 markscheme: power of ten already in Unicode'],
  ['C(=O)', 'functional group with a boundary inside the brackets'],
  ['e.g.', 'abbreviation'],
  ['1:2', 'ratio'],
  ['P, R, T and V', 'T09 hypothetical metals'],
  ['V (rapid) > P (slow) > T (none)', 'T09 markscheme ordering'],
  ['(C1–C2) and two C–C single bonds (C2–C3 and C3–C4)', 'T11 markscheme Q6 (d): carbon position labels'],
  ['C3', 'T11 carbon count, not a molecule'],
  ['B 6+', 'T08_20260925_01_Q2 option line: B is boron, 6+ must not merge'],
  ['D 2−', 'T08_20260925_01_Q2 option line'],
  ['Mg + 2HCl', 'formulae without digits in an equation'],
  ['4(−)', 'T09 markscheme Q29 charge check'],
  ['(re-)emit', 'T10 markscheme hyphenated word in brackets'],
  ['X-ray', 'hyphenated word'],
  ['cross-linked', 'hyphenated word'],
  ['but-2-ene', 'IUPAC name with locant'],
  ['2-methylpropane', 'IUPAC name with leading locant'],
  ['mg per m3', 'T10_20260925_01_Q29: m3 is not a formatted unit'],
  ['cm2', 'area unit is not formatted'],
  ['Cl–Cl', 'T05 bond with en dash'],
  ['C=C', 'double bond'],
  ['Ea(forward)', 'T06 activation energy label'],
  ['iron(II) and manganate(VII)', 'oxidation states in names'],
  ['Hydrogen–oxygen fuel cells', 'T04 subtopic name'],
  ['Hg2 2+', 'lone element with a non-molecular subscript is not touched, so no merge either'],
  ['IGCSE2 and MCQ1', 'acronyms with digits'],
  ['CL2', 'T08 markscheme REJECT line: wrong case stays as written'],
  ['the K-shell', 'hyphenated element letter'],
  ['e-mail', 'hyphenated word starting with e'],
  ['O-H', 'bond with ASCII hyphen'],
  ['', 'empty string'],
  ['no digits or signs here', 'plain prose'],
];

describe('ELEMENTS', () => {
  it('lists all 118 symbols once, from H to Og', () => {
    expect(ELEMENTS).toHaveLength(118);
    expect(ELEMENT_SET.size).toBe(118);
    expect(ELEMENTS[0]).toBe('H');
    expect(ELEMENTS[117]).toBe('Og');
    expect(isElement('Cl')).toBe(true);
    expect(isElement('In')).toBe(true);
    expect(isElement('CL')).toBe(false);
    expect(isElement('X')).toBe(false);
    expect(isElement('')).toBe(false);
  });
});

describe('formatChem transforms real formulae', () => {
  for (const [input, expected, source] of positive) {
    it(`${source}: ${input} -> ${expected}`, () => {
      expect(formatChem(input)).toBe(expected);
    });
  }

  it('is idempotent on every positive case', () => {
    for (const [input] of positive) {
      const once = formatChem(input);
      expect(formatChem(once), `second pass changed ${JSON.stringify(once)}`).toBe(once);
    }
  });

  it('uses the Unicode subscript and superscript blocks only', () => {
    const allowed = /^[₀-₉⁰¹²³⁴-⁹⁺⁻]+$/;
    for (const [input, expected] of positive) {
      const added = [...formatChem(input)].filter((c) => !input.includes(c)).join('');
      if (added) expect(added, `characters added for ${input}`).toMatch(allowed);
      expect(expected).toBe(formatChem(input));
    }
  });
});

describe('formatChem leaves everything else alone', () => {
  for (const [input, why] of unchanged) {
    it(`${why}: ${JSON.stringify(input)}`, () => {
      expect(formatChem(input)).toBe(input);
    });
  }
});

describe('formatChem over the real content', () => {
  const root = fileURLToPath(new URL('../../../../igcse-chem-pipeline/pipeline/04_approved/', import.meta.url));
  const batches = existsSync(root) ? readdirSync(root).filter((d) => /^T\d\d_/.test(d)).sort() : [];
  const files = batches.flatMap((b) => ['questions.md', 'markscheme.md'].map((f) => ({ batch: b, name: f, path: join(root, b, f) })));

  /** Map sub/superscripts back to plain characters so a line can be compared with its source. */
  const SUPERSCRIPTS: Readonly<Record<string, string>> = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
    '⁺': '+', '⁻': '−',
  };
  const flatten = (s: string): string =>
    s
      .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080))
      .replace(/[⁰¹²³⁴-⁹⁺⁻]/g, (c) => SUPERSCRIPTS[c] ?? c)
      .replace(/ /g, '')
      .replace(/-/g, '−');

  it('finds the 12 batches', () => {
    expect(batches).toHaveLength(12);
  });

  it('never adds, removes or reorders a letter, digit or sign; only spaces before a merged charge go', () => {
    const failures: string[] = [];
    let changed = 0;
    for (const file of files) {
      for (const line of readFileSync(file.path, 'utf8').split(/\r?\n/)) {
        const out = formatChem(line);
        if (out === line) continue;
        changed++;
        if (flatten(out) !== flatten(line)) failures.push(`${file.batch}/${file.name}: ${line}\n   -> ${out}`);
        if (formatChem(out) !== out) failures.push(`not idempotent: ${file.batch}/${file.name}: ${out}`);
      }
    }
    expect(failures, failures.slice(0, 10).join('\n')).toEqual([]);
    // 729 lines at the time of writing; a collapse to near zero would mean the formatter is broken.
    expect(changed).toBeGreaterThan(500);
  });

  const lineContaining = (batchPrefix: string, name: string, needle: string): string => {
    const file = files.find((f) => f.batch.startsWith(batchPrefix) && f.name === name);
    const line = file && readFileSync(file.path, 'utf8').split(/\r?\n/).find((l) => l.includes(needle));
    if (!line) throw new Error(`no line containing ${JSON.stringify(needle)} in ${batchPrefix} ${name}`);
    return line;
  };

  it('T11 markscheme Q6: formats the alkene but not the carbon position labels', () => {
    const out = formatChem(lineContaining('T11', 'markscheme.md', 'C1–C2'));
    expect(out).toContain('CH₂=CH–CH₂–CH₃');
    expect(out).toContain('(C1–C2)');
    expect(out).toContain('(C2–C3 and C3–C4)');
    expect(out).toContain('8 C–H bonds');
  });

  it('T02_20260923_01_Q10: leaves Unicode isotope notation alone', () => {
    const line = lineContaining('T02', 'questions.md', '³⁹₁₉K and ⁴¹₁₉K');
    expect(formatChem(line)).toBe(line);
  });

  it('T08 markscheme Q25: X2+ is formatted but hypothetical compounds XO2 / X2O stay plain', () => {
    const out = formatChem(lineContaining('T08', 'markscheme.md', 'forms X2+ ions'));
    expect(out).toContain('X²⁺');
    const reject = lineContaining('T08', 'markscheme.md', 'REJECT XO2 / X2O');
    expect(formatChem(reject)).toBe(reject);
  });

  it('T08_20260925_01_Q2: standalone option charges are not merged into the option letter', () => {
    for (const needle of ['A 2+', 'B 6+', 'C 6−', 'D 2−']) {
      const line = lineContaining('T08', 'questions.md', needle);
      expect(formatChem(line)).toBe(line);
    }
  });

  it('T10_20260925_01_Q29: "per m3" is not a volume unit we format', () => {
    const line = lineContaining('T10', 'questions.md', 'per m3');
    expect(formatChem(line)).toBe(line);
  });

  it('T03_20260923_01_Q5: spaced charge in running text', () => {
    const out = formatChem(lineContaining('T03', 'questions.md', 'sulfate ions, SO4 2−'));
    expect(out).toContain('Al³⁺');
    expect(out).toContain('SO₄²⁻,');
  });
});
