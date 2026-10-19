---
batch_id: 0610_T16_P2_20261018
verifier_model: "Claude Fable 5.1"
batch_route: PUBLISHED
counts: { published: 30, clean: 20, fixed: 10, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: FIXED
- agreement: full
- issues:
  - No separate solver (owner decision); verifier blind solve only.
  - Models: generator GPT-6 (Codex); verifier Claude Fable 5.1. No two roles share a model.
  - Distractors "nucleus alone" / "cell membrane alone" used an unnatural qualifier not found in real papers.
- fix_type: wording
- changed_file: questions.md
- before: "C nucleus alone / D cell membrane alone"
- after:  "C nucleus / D cell membrane"
- answers_changed: no

## Q2
- verdict: CLEAN
- agreement: full
- issues: none

## Q3
- verdict: CLEAN
- agreement: full
- issues: none

## Q4
- verdict: CLEAN
- agreement: full
- issues: none

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
  - Distractor "FSH alone" used an unnatural qualifier.
- fix_type: wording
- changed_file: questions.md
- before: "B FSH alone"
- after:  "B FSH"
- answers_changed: no

## Q8
- verdict: FIXED
- agreement: full
- issues:
  - Three distractors were absurd (pollen tube, converted into sperm cells), making a "difficulty 3" item trivial; rewritten as plausible but definitely wrong statements about the uterus lining, rationale updated to match.
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "B It becomes a pollen tube. / C It releases the egg from an ovary. / D It is converted into sperm cells."
- after:  "B It thickens and develops more blood vessels. / C It releases an egg into the oviduct. / D It is maintained by a rising concentration of progesterone."
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
- verdict: FIXED
- agreement: full
- issues:
  - Distractor A ("inheritance of an HIV allele") is biological nonsense and D ("receiving a clean blanket") is absurd; replaced with realistic non-transmission routes, rationale updated.
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A inheritance of an HIV allele from an uninfected parent / D receiving a clean blanket"
- after:  "A being hugged by an infected adult / D sharing a drinking cup with an infected adult"
- answers_changed: no

## Q16
- verdict: CLEAN
- agreement: full
- issues: none

## Q17
- verdict: CLEAN
- agreement: full
- issues: none

## Q18
- verdict: CLEAN
- agreement: full
- issues: none

## Q19
- verdict: FIXED
- agreement: full
- issues:
  - Mark scheme listed only glucose and amino acids; other valid dissolved nutrients were not allowed and oxygen (a gas) was not explicitly rejected.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) glucose (1), amino acids (1)"
- after:  "added ALLOW other named dissolved nutrients; REJECT oxygen"
- answers_changed: no

## Q20
- verdict: CLEAN
- agreement: full
- issues: none

## Q21
- verdict: FIXED
- agreement: full
- issues:
  - Stem was awkward ("while an egg has normal stored nutrients") and part (b) "Explain two functions of adaptations of the egg" was ungrammatical and unclear.
- fix_type: wording
- changed_file: questions.md
- before: "Some sperm have a damaged acrosome, while an egg has normal stored nutrients. ... (b) Explain two functions of adaptations of the egg."
- after:  "In a sample of semen, some sperm have a damaged acrosome. ... (b) Explain how two adaptive features of an egg cell help successful reproduction."
- answers_changed: no

## Q22
- verdict: FIXED
- agreement: full
- issues:
  - Stem "A researcher compares sperm and egg cells without using pictures" leaked pipeline constraints into the question; mark scheme (a) accepted only two specific differences.
- fix_type: wording
- changed_file: questions.md, markscheme.md
- before: "A researcher compares sperm and egg cells without using pictures."
- after:  "A student compares human sperm and egg cells." plus ALLOW line for acrosome/mitochondria/jelly coat/size in (a)
- answers_changed: no

## Q23
- verdict: CLEAN
- agreement: full
- issues: none

## Q24
- verdict: FIXED
- agreement: full
- issues:
  - Mark scheme (a) did not credit formation of the corpus luteum, a correct mid-cycle ovarian event.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(a) two points only"
- after:  "added ALLOW: empty follicle becomes a corpus luteum"
- answers_changed: no

## Q25
- verdict: CLEAN
- agreement: full
- issues: none

## Q26
- verdict: CLEAN
- agreement: full
- issues: none

## Q27
- verdict: CLEAN
- agreement: full
- issues: none

## Q28
- verdict: FIXED
- agreement: full
- issues:
  - Mark scheme (b) omitted transmission across the placenta, a standard mother-to-infant route.
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "(b) during birth (1), breast milk (1)"
- after:  "added ALLOW: across the placenta before birth"
- answers_changed: no

## Q29
- verdict: CLEAN
- agreement: full
- issues: none

## Q30
- verdict: CLEAN
- agreement: full
- issues: none
