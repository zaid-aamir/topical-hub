/**
 * Power notation (src/lib/power.ts) on strings taken from the Physics sources: a caret followed by
 * an optional minus sign and digits becomes a superscript; nothing else changes.
 */
import { describe, expect, it } from 'vitest';
import { applyPowers, formatPowers } from '../../src/lib/power';
import { mdBlock, mdInline, subjectFormat } from '../../src/lib/markdown';
import { CHEMISTRY_0620, EDEXCEL_CHEMISTRY_4CH1, PHYSICS_0625 } from '../../src/config';

const physics = subjectFormat(PHYSICS_0625);
const edexcelChemistry = subjectFormat(EDEXCEL_CHEMISTRY_4CH1);

describe('formatPowers (plain text)', () => {
  it.each([
    ['m / s^2', 'm / s²'],
    ['6.0 × 10^24 kg', '6.0 × 10²⁴ kg'],
    ['P = I^2R', 'P = I²R'],
    ['10^-7', '10⁻⁷'],
    ['about 5.0 × 10^-7 m.', 'about 5.0 × 10⁻⁷ m.'],
    ['kg / m^3', 'kg / m³'],
    ['1.6 × 10^−19 C', '1.6 × 10⁻¹⁹ C'],
    ['3.0 × 10^8 m / s', '3.0 × 10⁸ m / s'],
  ])('%s -> %s', (source, expected) => {
    expect(formatPowers(source)).toBe(expected);
  });

  it('leaves a caret followed by anything other than digits as it is', () => {
    for (const text of ['In ^A_Z X, the top number', 'x^n', 'a ^ 2', '^-x', '^+y', 'caret at the end ^']) {
      expect(formatPowers(text)).toBe(text);
    }
  });

  it('changes nothing else in the text', () => {
    expect(formatPowers('2H2O and CO2 at 25 °C, 3 × 4 = 12')).toBe('2H2O and CO2 at 25 °C, 3 × 4 = 12');
  });
});

describe('caret charges (Edexcel Chemistry sources)', () => {
  it.each([
    ['Cu^2+ + 2e^– → Cu', 'Cu²⁺ + 2e⁻ → Cu'],
    ['H^+ and OH^–(aq)', 'H⁺ and OH⁻(aq)'],
    ['(Cl^–)', '(Cl⁻)'],
    ['ends in Br^-', 'ends in Br⁻'],
    ['25.0 cm^3 of 0.10 mol/dm^3 acid', '25.0 cm³ of 0.10 mol/dm³ acid'],
    ['a^2+b^2', 'a²+b²'],
  ])('%s -> %s', (source, expected) => {
    expect(formatPowers(source)).toBe(expected);
  });

  it('sets charges as <sup> after chemistry formatting, with a real minus sign', () => {
    expect(mdInline('SO4^2– and NH4^+ in 25.0 cm^3', edexcelChemistry)).toBe(
      'SO<sub>4</sub><sup>2−</sup> and NH<sub>4</sub><sup>+</sup> in 25.0 cm<sup>3</sup>',
    );
    expect(mdInline('Cu^2+ + 2e^– → Cu', edexcelChemistry)).toBe('Cu<sup>2+</sup> + 2e<sup>−</sup> → Cu');
  });
});

describe('applyPowers (HTML text nodes)', () => {
  it('sets powers as <sup> with plain digits and a real minus sign', () => {
    expect(applyPowers('m / s^2')).toBe('m / s<sup>2</sup>');
    expect(applyPowers('P = I^2R')).toBe('P = I<sup>2</sup>R');
    expect(applyPowers('10^-7')).toBe('10<sup>−7</sup>');
  });

  it('never touches tags, attributes or code', () => {
    expect(applyPowers('<span data-x="m^3">m^3</span>')).toBe('<span data-x="m^3">m<sup>3</sup></span>');
    expect(applyPowers('<code>x^2</code>')).toBe('<code>x^2</code>');
  });
});

describe('Markdown rendering per subject', () => {
  it('formats powers on Physics pages, in inline and block text and in tables', () => {
    expect(mdInline('a = 9.8 m / s^2', physics)).toBe('a = 9.8 m / s<sup>2</sup>');
    expect(mdBlock('Mass of the Earth = 6.0 × 10^24 kg', physics)).toBe('<p>Mass of the Earth = 6.0 × 10<sup>24</sup> kg</p>\n');
    expect(mdBlock('| Quantity | Unit |\n|---|---|\n| density | kg / m^3 |', physics)).toContain('kg / m<sup>3</sup>');
  });

  it('leaves carets alone for a subject without powerFormatting', () => {
    expect(mdInline('m / s^2', subjectFormat(CHEMISTRY_0620))).toBe('m / s^2');
  });
});
