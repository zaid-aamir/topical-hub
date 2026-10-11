import { describe, expect, it } from 'vitest';
import { applyChem } from '../../../src/lib/chem/applyChem';

describe('applyChem', () => {
  it('formats text nodes as <sub>/<sup> and leaves tags untouched', () => {
    expect(applyChem('<p>Dilute H2SO4 contains H+ and SO4 2− ions.</p>\n')).toBe(
      '<p>Dilute H<sub>2</sub>SO<sub>4</sub> contains H<sup>+</sup> and SO<sub>4</sub><sup>2−</sup> ions.</p>\n',
    );
  });

  it('sets the plain characters inside the elements (copy-paste gives H2SO4)', () => {
    const html = applyChem('H2SO4 and Cu2+ and Cl− and cm3');
    expect(html).toBe('H<sub>2</sub>SO<sub>4</sub> and Cu<sup>2+</sup> and Cl<sup>−</sup> and cm<sup>3</sup>');
    expect(html.replace(/<[^>]+>/g, '')).toBe('H2SO4 and Cu2+ and Cl− and cm3');
  });

  it('converts sub/superscripts already written as Unicode in the source', () => {
    expect(applyChem('<p>³⁹₁₉K and 6.02 × 10²³ per mol and 24 dm3</p>')).toBe(
      '<p><sup>39</sup><sub>19</sub>K and 6.02 × 10<sup>23</sup> per mol and 24 dm<sup>3</sup></p>',
    );
  });

  it('never changes attribute values', () => {
    expect(applyChem('<td data-x="H2O" class="c2" title=\'Cu2+\'>H2O</td>')).toBe(
      '<td data-x="H2O" class="c2" title=\'Cu2+\'>H<sub>2</sub>O</td>',
    );
  });

  it('handles a ">" inside a quoted attribute', () => {
    expect(applyChem('<span title="a > b">CO2</span>')).toBe('<span title="a > b">CO<sub>2</sub></span>');
  });

  it('leaves entities untouched and formats the text around them', () => {
    expect(applyChem('gas &lt; liquid &lt; solid')).toBe('gas &lt; liquid &lt; solid');
    expect(applyChem('<p>Cu2+ &amp; Cl− ions; it&#39;s 2H2O</p>')).toBe(
      '<p>Cu<sup>2+</sup> &amp; Cl<sup>−</sup> ions; it&#39;s 2H<sub>2</sub>O</p>',
    );
    expect(applyChem('200 &gt; 115 and SO4 2−&nbsp;ions')).toBe('200 &gt; 115 and SO<sub>4</sub><sup>2−</sup>&nbsp;ions');
    expect(applyChem('&#x27;H2O&#x27;')).toBe('&#x27;H<sub>2</sub>O&#x27;');
  });

  it('does not format inside <code>, <pre>, <a>, <script> or <style>', () => {
    expect(applyChem('<p>Write <code>H2O</code> for H2O</p>')).toBe('<p>Write <code>H2O</code> for H<sub>2</sub>O</p>');
    expect(applyChem('<pre>2H2 + O2 → 2H2O</pre><p>2H2 + O2 → 2H2O</p>')).toBe(
      '<pre>2H2 + O2 → 2H2O</pre><p>2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O</p>',
    );
    expect(applyChem('<a href="/x">H2O <b>H2O</b></a> H2O')).toBe('<a href="/x">H2O <b>H2O</b></a> H<sub>2</sub>O');
    expect(applyChem('<script>var x = "H2O";</script>H2O')).toBe('<script>var x = "H2O";</script>H<sub>2</sub>O');
    expect(applyChem('<style>.H2O{}</style>H2O')).toBe('<style>.H2O{}</style>H<sub>2</sub>O');
  });

  it('tracks nesting of skipped elements', () => {
    expect(applyChem('<pre><code>H2O</code> H2O</pre> H2O')).toBe('<pre><code>H2O</code> H2O</pre> H<sub>2</sub>O');
    expect(applyChem('<CODE>H2O</CODE> H2O')).toBe('<CODE>H2O</CODE> H<sub>2</sub>O');
  });

  it('formats table cells', () => {
    expect(
      applyChem('<table>\n<tr>\n<td align="left">H2SO4</td>\n<td>SO4 2−</td>\n<td>2</td>\n</tr>\n</table>\n'),
    ).toBe(
      '<table>\n<tr>\n<td align="left">H<sub>2</sub>SO<sub>4</sub></td>\n<td>SO<sub>4</sub><sup>2−</sup></td>\n<td>2</td>\n</tr>\n</table>\n',
    );
  });

  it('keeps escaped tag text as text and still formats it', () => {
    expect(applyChem('&lt;b&gt;H2O&lt;/b&gt;')).toBe('&lt;b&gt;H<sub>2</sub>O&lt;/b&gt;');
  });

  it('copies comments and declarations through unchanged', () => {
    expect(applyChem('<!-- H2O -->H2O<!doctype html>')).toBe('<!-- H2O -->H<sub>2</sub>O<!doctype html>');
  });

  it('treats a stray "<" that is not a tag as text', () => {
    expect(applyChem('a < b and H2O')).toBe('a < b and H<sub>2</sub>O');
    expect(applyChem('H2O <')).toBe('H<sub>2</sub>O <');
  });

  it('leaves non-formula text exactly as it is', () => {
    const text = '<p>Q16 of T04 [2] at pH 7 and 25 °C, Paper 1, Group 1, 1.1.2, CnH2n+2</p>';
    expect(applyChem(text)).toBe(text);
  });

  it('is idempotent and handles empty input', () => {
    const once = applyChem('<p>Cu2+ + 2e− → Cu and ³⁹₁₉K</p>');
    expect(once).toBe('<p>Cu<sup>2+</sup> + 2e<sup>−</sup> → Cu and <sup>39</sup><sub>19</sub>K</p>');
    expect(applyChem(once)).toBe(once);
    expect(applyChem('')).toBe('');
    expect(applyChem('<br>')).toBe('<br>');
  });
});
