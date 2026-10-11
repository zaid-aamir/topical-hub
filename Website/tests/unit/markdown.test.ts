import { describe, expect, it } from 'vitest';
import { CHEM_FORMATTING } from '../../src/config';
import { applyChem } from '../../src/lib/chem';
import { escapeHtml, mdBlock, mdBlockRaw, mdInline, mdInlineRaw } from '../../src/lib/markdown';

describe('mdBlock', () => {
  it('renders paragraphs', () => {
    expect(mdBlockRaw('First paragraph.\n\nSecond paragraph.')).toBe('<p>First paragraph.</p>\n<p>Second paragraph.</p>\n');
  });

  it('treats a single newline before a prose line as a paragraph break, never as <br>', () => {
    // 150 worked solutions write "(a) ...", "(b) ..." on consecutive lines.
    expect(mdBlockRaw('(a) First part.\n(b) Second part.')).toBe('<p>(a) First part.</p>\n<p>(b) Second part.</p>\n');
    expect(mdBlockRaw('2CO + 2NO → 2CO2 + N2\nCheck: C 2 = 2.')).toBe('<p>2CO + 2NO → 2CO2 + N2</p>\n<p>Check: C 2 = 2.</p>\n');
    expect(mdBlockRaw('line one\nline two')).not.toContain('<br');
  });

  it('ends a list before a plain line instead of treating it as a lazy continuation', () => {
    expect(mdBlockRaw('1. first\n2. second\nAfter the list.')).toBe(
      '<ol>\n<li>first</li>\n<li>second</li>\n</ol>\n<p>After the list.</p>\n',
    );
    expect(mdBlockRaw('Work down.\n- one\n- two\nOverall order: E, L.')).toBe(
      '<p>Work down.</p>\n<ul>\n<li>one</li>\n<li>two</li>\n</ul>\n<p>Overall order: E, L.</p>\n',
    );
  });

  it('ends a table before a plain line and starts one after prose', () => {
    const html = mdBlockRaw('Results:\n| a | b |\n|---|---|\n| 1 | 2 |\nText after.');
    expect(html).toContain('<p>Results:</p>');
    expect(html).toContain('</table></div>');
    expect(html).toContain('<p>Text after.</p>');
    expect(html).not.toContain('<td>Text after.</td>');
    expect(html.match(/<table>/g)).toHaveLength(1);
  });

  it('renders a GFM table inside div.table-scroll', () => {
    const html = mdBlockRaw('| | Has a fixed shape? | Flows easily? |\n|---|---|---|\n| A | yes | no |\n| B | no | yes |');
    expect(html.startsWith('<div class="table-scroll" tabindex="0"><table>')).toBe(true);
    expect(html.trimEnd().endsWith('</table></div>')).toBe(true);
    expect(html).toContain('<th>Has a fixed shape?</th>');
    expect(html).toContain('<td>A</td>');
    expect(html.match(/<table>/g)).toHaveLength(1);
    expect(html.match(/<div class="table-scroll" tabindex="0">/g)).toHaveLength(1);
  });

  it('renders a nested bullet list', () => {
    const html = mdBlockRaw('- any three from (1 each, max 3):\n  - respiration\n  - photosynthesis\n- last point (1)');
    expect(html).toBe(
      '<ul>\n<li>any three from (1 each, max 3):<ul>\n<li>respiration</li>\n<li>photosynthesis</li>\n</ul>\n</li>\n<li>last point (1)</li>\n</ul>\n',
    );
  });

  it('renders a numbered list', () => {
    expect(mdBlockRaw('1. first\n2. second')).toBe('<ol>\n<li>first</li>\n<li>second</li>\n</ol>\n');
  });

  it('renders bold and italics', () => {
    expect(mdBlockRaw('**(a)** [2] and *emphasis*')).toBe('<p><strong>(a)</strong> [2] and <em>emphasis</em></p>\n');
  });

  it('escapes < and > in text (T01_20260923_01_Q4, T08 markscheme Q19)', () => {
    expect(mdBlockRaw('gas < liquid < solid')).toBe('<p>gas &lt; liquid &lt; solid</p>\n');
    expect(mdBlockRaw('sulfur has melted (200 > 115) but not boiled (200 < 445)')).toBe(
      '<p>sulfur has melted (200 &gt; 115) but not boiled (200 &lt; 445)</p>\n',
    );
  });

  it('escapes & and quotes', () => {
    expect(mdBlockRaw('salt & water, it\'s "quoted"')).toBe('<p>salt &amp; water, it&#39;s &quot;quoted&quot;</p>\n');
  });

  it('never passes raw block HTML through', () => {
    expect(mdBlockRaw('<script>alert(1)</script>')).toBe('<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>\n');
    expect(mdBlockRaw('<div>block</div>\n\npara')).toBe('<p>&lt;div&gt;block&lt;/div&gt;</p>\n<p>para</p>\n');
    expect(mdBlockRaw('<!-- hidden -->')).toBe('<p>&lt;!-- hidden --&gt;</p>\n');
  });

  it('never passes raw inline HTML through', () => {
    expect(mdBlockRaw('text <img src=x onerror=alert(1)> more')).toBe('<p>text &lt;img src=x onerror=alert(1)&gt; more</p>\n');
    expect(mdBlockRaw('a literal <br> tag')).toBe('<p>a literal &lt;br&gt; tag</p>\n');
    expect(mdBlockRaw('x <b>bold</b> y')).toBe('<p>x &lt;b&gt;bold&lt;/b&gt; y</p>\n');
  });

  it('generates no links or images', () => {
    expect(mdBlockRaw('visit www.example.com now')).toBe('<p>visit www.example.com now</p>\n');
    expect(mdBlockRaw('visit https://example.com/x now')).toBe('<p>visit https://example.com/x now</p>\n');
    expect(mdBlockRaw('auto <https://example.com> link')).toBe('<p>auto &lt;https://example.com&gt; link</p>\n');
    expect(mdBlockRaw('[text](http://example.com)')).toBe('<p>[text](http://example.com)</p>\n');
    expect(mdBlockRaw('marks [1](b) continue')).toBe('<p>marks [1](b) continue</p>\n');
    expect(mdBlockRaw('![alt](x.png)')).toBe('<p>![alt](x.png)</p>\n');
    expect(mdBlockRaw('[2] then (a)')).toBe('<p>[2] then (a)</p>\n');
  });

  it('renders code spans escaped, as code', () => {
    expect(mdBlockRaw('use `<br>` here')).toBe('<p>use <code>&lt;br&gt;</code> here</p>\n');
  });

  it('handles empty input', () => {
    expect(mdBlockRaw('')).toBe('');
  });
});

describe('mdInline', () => {
  it('renders inline Markdown without a wrapping <p>', () => {
    expect(mdInlineRaw('**bold** and *em*')).toBe('<strong>bold</strong> and <em>em</em>');
    expect(mdInlineRaw('plain')).toBe('plain');
    expect(mdInlineRaw('')).toBe('');
  });

  it('applies the same escaping rules', () => {
    expect(mdInlineRaw('gas < liquid')).toBe('gas &lt; liquid');
    expect(mdInlineRaw('a <b>x</b> b')).toBe('a &lt;b&gt;x&lt;/b&gt; b');
    expect(mdInlineRaw('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;');
    expect(mdInlineRaw('see www.example.com')).toBe('see www.example.com');
    expect(mdInlineRaw('[1](b)')).toBe('[1](b)');
  });
});

describe('chemistry formatting switch', () => {
  it('formats formulae when chem is on and not when it is off', () => {
    expect(mdInline('H2SO4 and Cu2+', { chem: true })).toBe('H<sub>2</sub>SO<sub>4</sub> and Cu<sup>2+</sup>');
    expect(mdInline('H2SO4 and Cu2+', { chem: false })).toBe('H2SO4 and Cu2+');
    expect(mdInlineRaw('H2SO4 and Cu2+')).toBe('H2SO4 and Cu2+');
    expect(mdBlock('SO4 2− ions', { chem: true })).toBe('<p>SO<sub>4</sub><sup>2−</sup> ions</p>\n');
    expect(mdBlock('SO4 2− ions', { chem: false })).toBe('<p>SO4 2− ions</p>\n');
    expect(mdBlockRaw('SO4 2− ions')).toBe('<p>SO4 2− ions</p>\n');
  });

  it('follows CHEM_FORMATTING from src/config.ts by default', () => {
    const expected = CHEM_FORMATTING ? 'H<sub>2</sub>O' : 'H2O';
    expect(mdInline('H2O')).toBe(expected);
    expect(mdBlock('H2O')).toBe(`<p>${expected}</p>\n`);
  });

  it('formats a table cell but not an attribute', () => {
    const html = mdBlock('| Ion | Formula |\n|:---|---:|\n| sulfate | SO4 2− |\n| acid | H2SO4 |', { chem: true });
    expect(html).toContain('<td align="right">SO<sub>4</sub><sup>2−</sup></td>');
    expect(html).toContain('<td align="right">H<sub>2</sub>SO<sub>4</sub></td>');
    expect(html).toContain('<th align="left">Ion</th>');
    expect(html).not.toContain('H2SO4');
    // Attributes carrying formula-like text are never rewritten.
    expect(applyChem('<td data-formula="H2SO4">H2SO4</td>')).toBe('<td data-formula="H2SO4">H<sub>2</sub>SO<sub>4</sub></td>');
  });

  it('keeps entities correct while formatting around them', () => {
    expect(mdInline('gas < liquid and 2H2O', { chem: true })).toBe('gas &lt; liquid and 2H<sub>2</sub>O');
    expect(mdInline('200 > 115', { chem: true })).toBe('200 &gt; 115');
  });

  it('does not format inside code spans', () => {
    expect(mdInline('`H2O` and H2O', { chem: true })).toBe('<code>H2O</code> and H<sub>2</sub>O');
  });

  it('leaves question references and marks alone (T04_20260923_01_Q16)', () => {
    expect(mdInline('**(a)** Q16 of T04 [2] at pH 7 and 25 °C', { chem: true })).toBe(
      '<strong>(a)</strong> Q16 of T04 [2] at pH 7 and 25 °C',
    );
  });
});

describe('escapeHtml', () => {
  it('escapes all five characters', () => {
    expect(escapeHtml('<a href="x">&\'</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
    expect(escapeHtml('&amp;')).toBe('&amp;amp;');
  });
});
