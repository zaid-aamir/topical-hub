---
batch_id: 0610_T17_P1_20261018
verifier_model: "Claude Fable 5.1"
batch_route: PUBLISHED
counts: { published: 30, clean: 25, fixed: 5, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - No separate solver (owner decision); verifier blind solve only.
  - Models: generator GPT-6 (Codex); solver none; verifier Claude Fable 5.1 — no two roles share a model.
  - Batch-wide note: all 15 structured worked solutions (except Q17, Q26 now rewritten) are verbatim repeats of the marking points rather than teaching explanations; publishable but weak. Several MCQ distractors (Q2, Q9, Q12) are implausible rather than tempting; answers unaffected.

## Q2
- verdict: CLEAN
- agreement: full
- issues: none

## Q3
- verdict: CLEAN
- agreement: full
- issues: none

## Q4
- verdict: FIXED
- agreement: full
- issues:
  - difficulty 3 on a one-step recall item (male body cell = XY); misleading metadata for a trivially easy question
- fix_type: format
- changed_file: questions.md
- before: '- difficulty: 3'
- after:  '- difficulty: 1'
- answers_changed: no

## Q5
- verdict: CLEAN
- agreement: full
- issues: none

## Q6
- verdict: CLEAN
- agreement: full
- issues: none

## Q7
- verdict: CLEAN
- agreement: full
- issues: none

## Q8
- verdict: CLEAN
- agreement: full
- issues: none

## Q9
- verdict: CLEAN
- agreement: full
- issues: none

## Q10
- verdict: CLEAN
- agreement: full
- issues: none

## Q11
- verdict: CLEAN
- agreement: full
- issues: none

## Q12
- verdict: CLEAN
- agreement: full
- issues: none

## Q13
- verdict: CLEAN
- agreement: full
- issues: none

## Q14
- verdict: CLEAN
- agreement: full
- issues: none

## Q15
- verdict: CLEAN
- agreement: full
- issues: none

## Q16
- verdict: FIXED
- agreement: full
- issues:
  - Core question, but (b) second marking point ('differences in their DNA sequence') leans on Supplement 17.1.5 wording; added ALLOW so a Core answer (different versions / forms of the same gene; different DNA) scores
  - No separate solver (owner decision); verifier blind solve only.
  - Models: generator GPT-6 (Codex); no solver; verifier Claude Fable 5.1 — no two roles share a model
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: '- Different alleles have differences in their DNA sequence. (1)'
- after:  '- Different alleles have differences in their DNA sequence. (1)\n  - ALLOW: alleles are different versions / forms of the same gene; alleles have different DNA'
- answers_changed: no

## Q17
- verdict: FIXED
- agreement: full
- issues:
  - worked solution was a verbatim repeat of the marking points, not a teaching explanation; sex-determination cross not shown
  - added ALLOW for the 1 : 1 / equal-chance statement
- fix_type: wording
- changed_file: markscheme.md
- before: 'Worked solution repeated the two (a) and two (b) marking points word for word'
- after:  'Worked solution rewritten: haploid gametes, all eggs X, sperm X or Y, Punnett table (X egg vs X/Y sperm) giving XX and XY in 1 : 1; re-derived by gamete count and by table'
- answers_changed: no

## Q18
- verdict: CLEAN
- agreement: full
- issues: none

## Q19
- verdict: CLEAN
- agreement: full
- issues: none

## Q20
- verdict: CLEAN
- agreement: full
- issues: none

## Q21
- verdict: CLEAN
- agreement: full
- issues: none

## Q22
- verdict: CLEAN
- agreement: full
- issues: none

## Q23
- verdict: CLEAN
- agreement: full
- issues: none

## Q24
- verdict: CLEAN
- agreement: full
- issues: none

## Q25
- verdict: CLEAN
- agreement: full
- issues: none

## Q26
- verdict: FIXED
- agreement: full
- issues:
  - worked solution was a verbatim repeat of the marking points; probability claim not derived
  - added ALLOW for 50% / 1 in 2 / 1 : 1
- fix_type: wording
- changed_file: markscheme.md
- before: 'Worked solution repeated the marking points word for word'
- after:  'Worked solution rewritten with Punnett table; chance of XY per child derived as 1 in 2 both from the sperm split and from the table; independence of successive fertilisations explained'
- answers_changed: no

## Q27
- verdict: FIXED
- agreement: full
- issues:
  - (a) 'State the genetic feature that specifies this order' is a one-point State question carrying 2 marks; the mark scheme's second point (different alleles in the two individuals) was not asked for
- fix_type: wording
- changed_file: questions.md
- before: '(a) State the genetic feature that specifies this order. [2]'
- after:  '(a) State the genetic feature that specifies this order and suggest why it differs between the two individuals. [2]'
- answers_changed: no

## Q28
- verdict: CLEAN
- agreement: full
- issues: none

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
