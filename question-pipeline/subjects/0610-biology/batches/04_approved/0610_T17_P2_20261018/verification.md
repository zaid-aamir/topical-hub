---
batch_id: 0610_T17_P2_20261018
verifier_model: "claude-fable-5-1"
batch_route: PUBLISHED
counts: { published: 30, clean: 21, fixed: 9, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: CLEAN
- agreement: full
- issues:
  - No separate solver (owner decision); verifier blind solve only.
  - Models: generator GPT-6 (Codex); verifier claude-fable-5-1; no shared roles.
  - Batch was published on 2026-10-18 without a check; verified 2026-10-19.

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
  - difficulty 3 recorded for a one-step recall item
- fix_type: format
- changed_file: questions.md
- before: "- difficulty: 3"
- after:  "- difficulty: 1"
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
- verdict: FIXED
- agreement: full
- issues:
  - option D was a meaningless distractor ("XX in a notation where only T and t are alleles of the stated gene")
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "Which genotype is heterozygous? A TT / B tt / C Tt / D XX in a notation where only T and t are alleles of the stated gene"
- after:  "Which description applies to a heterozygous individual? A two identical dominant alleles / B two identical recessive alleles / C two different alleles of a gene / D only one allele of a gene; rationale rewritten to match. Correct option is the same (heterozygous = two different alleles)."
- answers_changed: no

## Q8
- verdict: FIXED
- agreement: full
- issues:
  - option D was not a genotype ("B alone in a normal diploid body cell")
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "D B alone in a normal diploid body cell"
- after:  "D both Bb and bb"; rationale updated to dismiss D
- answers_changed: no

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
  - (b) asks for any two other roles but the scheme fixed one mark to growth; the three valid roles should all score
  - (a) explanation lacked ALLOW for replication before mitosis
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "Growth by increasing cell number. (1) / Asexual reproduction or replacement of worn-out cells. (1)"
- after:  "growth (1) / replacement of cells / asexual reproduction (1) / ALLOW any two of the three / REJECT repair (given); (a) ALLOW exact replication before mitosis"
- answers_changed: no

## Q17
- verdict: CLEAN
- agreement: full
- issues: none

## Q18
- verdict: FIXED
- agreement: full
- issues:
  - (a) third syllabus feature of stem cells (daughter cells can become specialised) was not creditable
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) two marking points only"
- after:  "added ALLOW: their daughter cells can become specialised for specific functions"
- answers_changed: no

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - (b) numerical form of the answer (using the 12 chromosomes given) not credited
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "It halves the number of chromosome sets. (1)"
- after:  "added ALLOW: 12 chromosomes reduced to 6"
- answers_changed: no

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
- issues: none (re-derived: Ss × Ss gives 1 : 2 : 1 genotypes, 3 : 1 phenotypes)

## Q23
- verdict: CLEAN
- agreement: full
- issues: none (re-derived: Ll × ll gives 1 : 1)

## Q24
- verdict: CLEAN
- agreement: full
- issues: none

## Q25
- verdict: FIXED
- agreement: full
- issues:
  - the usual term for the heterozygote phenotype was not credited
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "The ratio is 1 red : 2 mixed red-and-white : 1 white. (1)"
- after:  "added ALLOW: roan for mixed red-and-white"
- answers_changed: no

## Q26
- verdict: CLEAN
- agreement: full
- issues: none (re-derived by Punnett square: four genotypes, four groups, equal)

## Q27
- verdict: CLEAN
- agreement: full
- issues: none (re-derived: daughters all receive paternal Xᴺ; sons receive maternal X at 1/2 each)

## Q28
- verdict: FIXED
- agreement: full
- issues:
  - (b) proportion / ratio form of the answer not credited
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "Some offspring will be pp and have white flowers. (1)"
- after:  "added ALLOW: one quarter / 3 : 1 purple : white"
- answers_changed: no

## Q29
- verdict: CLEAN
- agreement: full
- issues: none (re-derived: O parent contributes only Iᵒ)

## Q30
- verdict: FIXED
- agreement: full
- issues:
  - stem wording "The dominant phenotype is complete" is not meaningful
- fix_type: wording
- changed_file: questions.md
- before: "The dominant phenotype is complete and all genotypes survive equally."
- after:  "Dominance is complete and all genotypes survive equally."
- answers_changed: no
