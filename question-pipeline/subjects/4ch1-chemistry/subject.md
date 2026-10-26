# 4CH1 Chemistry — subject rules (DRAFT, from the specification only)

Source: Pearson Edexcel International GCSE Chemistry (4CH1) specification, Issue 3 (cover; footers read "Specification – Issue 3 – September 2024"; p. 1 still says "This specification is Issue 2"). First teaching September 2017, first examination June 2019. Page numbers are the **printed** page numbers (PDF page = printed page + 6). Statements are cited by `point_id` from `config/syllabus_map.json`. Status: draft for owner checking against the PDF.

Always call it "Pearson Edexcel International GCSE Chemistry (4CH1)". Never "Cambridge", never "IGCSE 0620".

Papers (pp. 7, 8, 27): the qualification is **untiered**; every student sits both papers in the same series.
- **Paper 1 (4CH1/1C)**: 2 hours, 110 marks, 61.1%. Assesses only content that is not in bold and has no 'C' reference.
- **Paper 2 (4CH1/2C)**: 1 hour 15 minutes, 70 marks, 38.9%. Assesses all the content, including the bold 'C' statements ("Bold statements cover some sub-topics in greater depth").

In the map, tier `core` = Paper 1 & 2 content (no suffix, 130 statements); tier `supplement` = **Paper 2 only** (C suffix, 52 statements). The website labels these "Paper 1 & 2" and "Paper 2 only", never Core/Extended. A `core` question may use only statements without the C suffix (and no C-only facts, relationships or units); a `supplement` question must use at least one C statement.

## 1. Exam data given

- **The specification does not say that anything is printed in the exam papers.** It describes no formula sheet, equation list or data booklet (checked pp. 7–8, 27–29, 37–51).
- **Appendix 7: The Periodic Table (p. 49)** is the only data in the specification. It provides, for every element (lanthanoids 58–71 and actinoids 90–103 omitted): relative atomic mass (top), atomic symbol, name, and atomic (proton) number (bottom). Groups are headed 1, 2, 3, 4, 5, 6, 7, 0; hydrogen stands alone above the main block. All relative atomic masses are whole numbers except **Cl = 35.5** and **Cu = 63.5** (footnote: "have not been rounded to the nearest whole number"); radioactive elements carry bracketed values (e.g. Tc [98], Po [209], Rn [222]). Elements 112–116 "have been reported but not fully authenticated".
  - Useful values as printed: H 1, He 4, Li 7, Be 9, B 11, C 12, N 14, O 16, F 19, Ne 20, Na 23, Mg 24, Al 27, Si 28, P 31, S 32, Cl 35.5, Ar 40, K 39, Ca 40, Ti 48, V 51, Cr 52, Mn 55, Fe 56, Co 59, Ni 59, Cu 63.5, Zn 65, Br 80, Rb 85, Sr 88, Ag 108, Sn 119, I 127, Ba 137, Pt 195, Au 197, Hg 201, Pb 207.
  - **Draft rule (owner to confirm):** points 1.19 and 1.21 require students to work from positions in the Periodic Table, so questions may assume a Periodic Table is available. Questions may therefore expect students to look up Ar values, atomic numbers and group numbers; when a question needs an Ar it must use exactly the value printed in Appendix 7 (never 35.45, 63.55, etc.). Because the specification does not explicitly state that the table is in the paper, a generator may also state the Ar values in a question; that is always safe.
- **Calculators** may be used (pp. 7, 8). Students are expected to have access to a suitable electronic calculator for all papers; calculators that retrieve text or formulae, or have QWERTY keyboards, are not allowed (p. 28).
- **Must be given in the question when used** (not in the specification): bond energies (3.7C); the specific heat capacity of water or any solution (3.3; the specification prints no value); any experimental data (1.29, 1.33, 1.17 isotopic abundances and masses); "suitable information" for unfamiliar reactions (1.25); "appropriate information" about an extraction process (2.24C); solubility data (1.6C); Rf distances (1.12); the theoretical yield or the data to calculate it (1.30); any physical data (melting points, boiling points, densities).

## 2. Must be recalled, never given

Relationships (the specification asks students to calculate with these but prints only Q = mcΔT; none is stated as supplied):

| Point | Relationship | Tier |
|---|---|---|
| 1.17 | Ar = Σ(relative isotopic mass × abundance) / total abundance (from isotopic abundances) | Paper 1 & 2 |
| 1.26 | Mr = sum of the Ar values of all atoms in the formula | Paper 1 & 2 |
| 1.28 | amount of substance (mol) = mass (g) / Mr (or Ar) | Paper 1 & 2 |
| 1.29 | reacting masses via mole ratio from the balanced equation | Paper 1 & 2 |
| 1.30 | percentage yield = (actual yield / theoretical yield) × 100 | Paper 1 & 2 |
| 1.12 | Rf = distance moved by spot / distance moved by solvent front | Paper 1 & 2 |
| 1.33 | empirical formula from mass or percentage data ÷ Ar, simplest whole-number ratio; molecular formula from Mr | Paper 1 & 2 |
| 3.3 | Q = mcΔT (printed in the statement) | Paper 1 & 2 |
| 3.4 | ΔH = −Q / amount of the stated reactant (mol); negative for exothermic, positive for endothermic (sign convention and kJ/mol not stated in the specification) | Paper 1 & 2 |
| 1.34C | concentration (mol/dm^3) = amount (mol) / volume (dm^3) | Paper 2 only |
| 1.35C | molar volume of a gas = 24 dm^3 = 24 000 cm^3 at rtp; gas volume = amount (mol) × 24 dm^3 | Paper 2 only |
| 3.7C | enthalpy change = total energy of bonds broken − total energy of bonds made | Paper 2 only |

**Molar volume:** 24 dm^3 / 24 000 cm^3 at rtp is written into statement 1.35C, so it is recalled, not given, and it is Paper 2 only. Do not use molar volume in a `core` question. (Owner to confirm whether questions should state it anyway, as is common in real papers.)

Facts printed in the content (recall exactly as listed):
- **Ion charges (1.38):** metals in Groups 1, 2 and 3; non-metals in Groups 5, 6 and 7; Ag^+, Cu^2+, Fe^2+, Fe^3+, Pb^2+, Zn^2+; H^+, OH^–, NH4^+, CO3^2–, NO3^–, SO4^2–. Formulae of compounds between these ions (1.39). Group-based charges cover ions such as Al^3+, N^3–, O^2–, Cl^–. Any ion outside 1.38 (e.g. phosphate, hydrogencarbonate, sulfite) must be given in the question if used.
- **Solubility rules (2.34):** common sodium, potassium and ammonium compounds soluble; all nitrates soluble; common chlorides soluble except silver and lead(II); common sulfates soluble except barium, calcium and lead(II); common carbonates insoluble except sodium, potassium and ammonium; common hydroxides insoluble except sodium, potassium and calcium (calcium hydroxide slightly soluble).
- **Reactivity order (2.17):** potassium, sodium, lithium, calcium, magnesium, aluminium, zinc, iron, copper, silver, gold. (Note: the specification places sodium above lithium.) Carbon and hydrogen are not in the printed series.
- **pH bands (2.29):** strongly acidic 0–3, weakly acidic 4–6, neutral 7, weakly alkaline 8–10, strongly alkaline 11–14.
- **Flame colours (2.46):** Li^+ red; Na^+ yellow; K^+ lilac; Ca^2+ orange-red; Cu^2+ blue-green.
- **Crude oil fractions (4.9):** refinery gases, gasoline, kerosene, diesel, fuel oil, bitumen; trends in colour, boiling point and viscosity (4.10).
- **Cracking (4.17):** silica or alumina catalyst, 600–700 °C.
- **Ethanol (4.31C, 4.32C, Paper 2 only):** oxidation by burning, by microbial oxidation to ethanoic acid, and by heating with potassium dichromate(VI) in dilute sulfuric acid; manufacture from ethene + steam with phosphoric acid catalyst at about 300 °C and about 60–70 atm; fermentation of glucose in the absence of air at an optimum of about 30 °C using enzymes in yeast.
- **Functional groups:** >C=C< (4.23); −OH (4.29C); –COOH (4.34C); –COO– (4.38C).
- **Equilibrium (3.20C, 3.22C, Paper 2 only):** forward and reverse rates equal, concentrations constant; temperature rise shifts towards the endothermic direction; pressure rise shifts towards fewer moles of gas.
- **Other definitions in the content:** solvent, solute, solution, saturated solution (1.4); solubility in g per 100 g of solvent (1.5C); atom, molecule, atomic number, mass number, isotopes, Ar (1.14, 1.16); mole (1.27); empirical and molecular formula (1.32); covalent bond (1.44); anion, cation (1.57C); oxidation, reduction, redox, oxidising agent, reducing agent in terms of oxygen and electrons (2.20); acid as proton donor, base as proton acceptor (2.36); alkali as soluble base (2.38); alloy (2.26C); exothermic, endothermic (3.1); catalyst (3.12, 3.13); hydrocarbon (4.1); homologous series, functional group, isomerism (4.3); fuel (4.11); addition polymer, monomer (4.44); condensation polymerisation (4.48C); biopolyesters (4.50C).

Facts the specification names without printing values (students recall standard IGCSE values; the verifier checks against standard textbook values): the approximate percentages of the four most abundant gases in dry air (2.9: nitrogen about 78%, oxygen about 21%, argon about 0.9%, carbon dioxide about 0.04%); colours and physical states of chlorine, bromine and iodine (2.5); general formulae CnH2n+2 (alkanes, 4.19) and CnH2n (alkenes, 4.24); tests for gases, cations, anions and water (2.44, 2.47–2.50); conditions for rusting (2.18).

Explicitly **not required**: Le Chatelier's principle (3.22C); reaction mechanisms (4.6, 4.22); references to haemoglobin (4.13); cis/trans or E/Z notation (4.26); detailed knowledge of the extraction process for a specific metal (2.24C); reactions of nitric acid with metals (2.37); steels other than low-carbon (mild), high-carbon and stainless (2.25C); naming compounds with more than six carbon atoms (4.4); propanol and butanol isomers other than propan-1-ol and butan-1-ol (4.30C).

**Not in the specification at all — do not use:** the Avogadro constant or particle-number mole calculations; Kc or any equilibrium constant.

Titration calculations are not named in the specification (2.33C is "describe how to carry out an acid-alkali titration"), but they fall under 1.34C concentration calculations, so they are Paper 2 only.

## 3. Notation and units

- **Formulae:** subscripts inline (H2O, CO2, H2SO4, C60); water of crystallisation with a centred dot (CuSO4·5H2O). Ion charges as superscripts with `^`: Na^+, Cu^2+, Fe^3+, Cl^–, O^2–, SO4^2–, NH4^+, CO3^2–, NO3^–, OH^–. Use the en dash `–` as the minus in charges; a hyphen is acceptable in answers.
- **State symbols (1.25):** "balanced chemical equations (including state symbols)" — use (s), (l), (g), (aq), placed immediately after each formula, e.g. `Mg(s) + 2HCl(aq) → MgCl2(aq) + H2(g)`. The specification does not list the symbols; these are the standard ones.
- **Arrows:** `→` for reactions; `⇌` for reversible reactions (3.17).
- **Ionic half-equations (1.59C, Paper 2 only):** electrons written `e^–`, e.g. `Cu^2+ + 2e^– → Cu`, `2Cl^– → Cl2 + 2e^–`, `2H^+ + 2e^– → H2`, `Pb^2+ + 2e^– → Pb`, `2Br^– → Br2 + 2e^–`, `4OH^– → O2 + 2H2O + 4e^–`. Oxidation = loss of electrons, reduction = gain of electrons (2.20). Half-equations are only in the specification for electrolysis; full ionic equations are not mentioned — if used (e.g. precipitation `Ag^+(aq) + Cl^–(aq) → AgCl(s)`), Paper 2 only and the question should make the expectation clear.
- **Organic formulae in text:** molecular (C2H6O), structural/condensed (CH3CH2OH, CH2=CHCH3, CH3COOCH2CH3), general (CnH2n+2). Displayed formulae cannot be drawn; where a question needs one, describe it in words or use a condensed structural formula. Repeat units in text: `–[CH2–CH2]–n`, `–[CH2–CH(CH3)]–n`, `–[CH2–CHCl]–n`, `–[CF2–CF2]–n`; polyester from ethanedioic acid and ethanediol: `–[CO–CO–O–CH2CH2–O]–n` with 2n H2O (4.49C).
- **Naming (4.4, 4.30C, 4.45):** IUPAC names for compounds relevant to the specification with up to six carbon atoms (e.g. but-1-ene, propan-1-ol, 2-methylpropane, 1,2-dibromoethane, ethyl ethanoate, ethanoic acid). "Propanol" and "butanol" are acceptable for propan-1-ol and butan-1-ol. Polymers: poly(ethene), poly(propene), poly(chloroethene), (poly)tetrafluoroethene. Roman-numeral oxidation states in names: copper(II) oxide, copper(II) sulfate, lead(II) bromide, lead(II) sulfate, iron(II)/iron(III) ions, potassium dichromate(VI). Spellings as in the specification: sulfur, sulfate, sulfuric, aluminium, caesium, phosphorus.
- **Units in the content:** mol (1.27); mol/dm^3 (1.34C); dm^3, cm^3 (1.35C); g per 100 g of solvent (1.5C); °C (4.17, 4.32C); atm (4.32C). Not stated but needed for 3.3/3.4/3.7C: Q in J or kJ; ΔH in kJ/mol; bond energies in kJ/mol; c in J/g/°C. Write units with a solidus as the specification does: `mol/dm^3`, `kJ/mol`, `J/g/°C`, `g/cm^3`. Use dm^3, never litre.
- **Symbols:** Ar, Mr (printed italic with subscript), Rf, Q, m, c, ΔT, ΔH. "rtp" = room temperature and pressure (1.35C).
- Group 0 for the noble gases (1.24, Periodic Table heading); groups 1–7 otherwise.

## 4. Calculation conventions

- The specification says only "Use an appropriate number of significant figures" (Appendix 4, 2A, p. 43). Draft rule (pipeline convention, not from the specification): give final answers to the same number of significant figures as the least precise data, usually 2 or 3; accept 2–4 s.f. in mark schemes unless the question specifies; never round intermediate values.
- Numbers in decimal and standard form (Appendix 4, 1A, 1B); ratios, fractions, percentages, powers and roots (1C); arithmetic mean (2B); order-of-magnitude calculations (2I); change the subject, substitute values with appropriate units, solve simple equations (3B–3D).
- Graph skills for chemistry (Appendix 4, 4A–4E): translate between graphical and numerical form; y = mx + c; plot two variables; slope and intercept of a linear graph; slope of a tangent to a curve as a measure of rate of change. Area under a curve (4F) and geometry/trigonometry (section 5) are NOT ticked for chemistry. In text questions, give graph data as a Markdown table, and give a tangent as two points it passes through.
- Mole calculations use Ar values exactly as printed in the Periodic Table (Cl 35.5, Cu 63.5, others whole numbers).
- Empirical formulae: ratios rounded to the simplest whole numbers; water of crystallisation (1.31) as `·xH2O`.
- Enthalpy: state the sign of ΔH explicitly (− exothermic, + endothermic); for 3.4, convert Q from J to kJ before dividing by the amount in mol, giving ΔH in kJ/mol.
- Gas volumes (Paper 2 only): 24 dm^3 or 24 000 cm^3 per mole at rtp; check cm^3 ↔ dm^3 (÷ 1000).
- Concentration (Paper 2 only): volumes in cm^3 converted to dm^3 (÷ 1000).
- Every final numerical answer carries a unit where one exists (percentages and Rf have none).

## 5. Diagrams

- `essential` points are out of scope — do not set questions on them: **1.6C, 1.40, 1.46, 1.52C, 3.5C, 3.14C** (6 of 182 statements, 3.3%; 2 Paper 1 & 2, 4 Paper 2 only). See `config/diagram_coverage.md`. Ideas from these points may still appear inside other questions when expressed in words (e.g. "the energy of the products is lower than that of the reactants" under 3.1; the number of shared electron pairs in a molecule under 1.44).
- `partial` points (45): describe apparatus and set-ups in words (e.g. "a gas syringe connected to a conical flask containing marble chips and acid"), give chromatogram spot distances and graph data as Markdown tables, and give organic structures as condensed structural formulae. Never write "see the diagram". Never ask students to draw a displayed formula, dot-and-cross diagram, energy level diagram, reaction profile or apparatus diagram; "Draw", "Sketch", "Plot", "Add/Label" and "Complete" (a diagram) are not used. "Complete" may be used for a Markdown table or an equation.
- Practical statements (italic in the specification: 1.7C, 1.13, 1.36, 1.60C, 2.14, 2.21, 2.42, 2.43C, 3.8, 3.15, 3.16, 4.43C) are tested through method, variables, observations, results and evaluation in words and tables.

## 6. Subject-specific checks for the verifier

- **Paper check:** a `core` question uses no C-suffix statement, fact or relationship (e.g. no molar volume, no mol/dm^3 concentration, no bond-energy calculation, no half-equations, no alcohols/carboxylic acids/esters/condensation polymers, no metallic bonding, no electrolysis, no dynamic equilibrium, no extraction of metals or alloys, no titration method, no solubility in g per 100 g). A `supplement` question uses at least one C statement.
- **Equations:** every chemical equation is balanced for atoms and charge; state symbols are correct where asked; half-equations balance electrons; reversible reactions use ⇌.
- **Formulae:** every formula is correct and consistent with the ion charges in 1.38; names match formulae; IUPAC names are correct and use the specification's spellings.
- **Data:** Ar values match Appendix 7 exactly; nothing in Section 2 is given in the question; anything not in Section 2 (bond energies, c, experimental data) is given.
- **Calculations:** check every mole step, unit conversion (cm^3 ↔ dm^3, g ↔ kg, J ↔ kJ), the sign of ΔH, and significant figures; the final answer has a unit.
- **Facts:** check against the specification's own lists (reactivity order 2.17, solubility rules 2.34, flame colours 2.46, pH bands 2.29, cracking conditions 4.17, ethanol conditions 4.32C) and standard IGCSE test results (e.g. hydrogen "squeaky pop", oxygen relights a glowing splint, carbon dioxide turns limewater milky/cloudy, ammonia turns damp red litmus blue, chlorine bleaches damp litmus; Cu^2+ blue precipitate, Fe^2+ green precipitate, Fe^3+ orange-brown precipitate with NaOH(aq); halides with acidified AgNO3: Cl^– white, Br^– cream, I^– yellow; sulfate white precipitate with acidified BaCl2; anhydrous copper(II) sulfate white → blue with water; pure water boils at 100 °C / freezes at 0 °C).
- **Scope:** nothing explicitly not required (Section 2) is needed; no Le Chatelier's principle wording is required in answers; no mechanisms; no E/Z.
- **Command words** are used with the Appendix 5 meanings (Section 7); no drawing command words for essential content.
- **Partial-diagram questions** must be fully answerable from the words or table alone.

## 7. Anything else

- **Question styles (pp. 7, 8, 27):** both papers contain "a mixture of different question styles, including multiple-choice questions, short-answer questions, calculations and extended open-response questions". Questions may come from any topic area across the specification. Multiple-choice items exist but papers are mostly structured. The specification does not state the number of multiple-choice items or the size of extended open-response questions (e.g. 6-mark questions are not mentioned). MCQ stems use "What", "Why", "Which" (p. 46).
- **Command words (Appendix 5, pp. 45–46):** Add/Label, Calculate, Comment on, Complete, Deduce, Describe, Determine, Design, Discuss, Draw, Estimate, Evaluate, Explain, Give/State/Name, Give a reason/reasons, Identify, Justify, Plot, Predict, Show that, Sketch, State what is meant by, Suggest; "Analyse the data/graph to explain"; MCQ: What, Why, Which. Definitions are in `config/syllabus_map.json`. "Determine" needs a quantitative element; "Describe" needs linked statements without justification; "Explain" needs reasoning.
- **Assessment objectives (p. 29):** AO1 knowledge and understanding 38–42%; AO2 application, analysis and evaluation 38–42%; AO3 experimental skills, analysis and evaluation of data and methods 19–21%. Roughly a fifth of marks are practical-context questions.
- **Experimental skills (p. 28)** are assessed in the written papers: solving problems in a practical context; planning investigations and selecting techniques; describing methods and safe technique; making and recording observations and measurements with appropriate precision; identifying independent, dependent and control variables; analysing and interpreting data to draw conclusions; communicating findings with calculations and graphs; assessing reliability; evaluating data and methods for accuracy and validity.
- **Content notes (p. 1):** "The word 'including' in the content helps specify the detail of what must be covered"; examples ("e.g.") are illustrative only, so questions may use other examples. Practical investigations are the italic statements.
- **Appendix 6 (pp. 47–48)** lists extra suggested practicals (e.g. thermal decomposition of carbonates, cracking paraffin oil, molar volume of hydrogen from magnesium and acid, % yield, electroplating). These are not statements; they may supply contexts for questions on the related statements but add no new content.
- **Applied/unfamiliar contexts:** 1.25 (unfamiliar reactions with information provided), 2.3 and 2.6 (predicting properties of other alkali metals/halogens), 2.24C (commenting on an extraction process given information) and AO2 explicitly allow unfamiliar contexts, provided all needed information is given.
- Assessment is in English only (p. 31).


## Manager decisions (26 Oct 2026, override anything above)

- A Periodic Table (Appendix 7 values: whole-number Ar except Cl 35.5 and Cu 63.5) is available for every question; questions may say "Use the Periodic Table" and use those Ar values. Do not restate Ar values unless the question needs a non-Periodic-Table value.
- Molar volume: a question that needs it states "(1 mol of any gas occupies 24 dm^3 at rtp)" in the question, as real papers do.
- Q = mcΔT is recalled; the specific heat capacity of water (4.2 J/g/°C) and any bond energies are always stated in the question.
- Never use the Avogadro constant or Kc.
