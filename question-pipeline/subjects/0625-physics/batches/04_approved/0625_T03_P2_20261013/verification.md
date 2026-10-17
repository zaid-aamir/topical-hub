---
batch_id: 0625_T03_P2_20261013
verifier_model: "Claude Fable 5.1 (claude-fable-5-1)"
batch_route: PUBLISHED
counts: { published: 30, clean: 21, fixed: 9, answer_fixes: 0, withheld: 0 }
sampled: no
---

## Q1
- verdict: FIXED
- agreement: full
- issues:
  - models: generator Claude Opus 5.5, solver Claude Sonnet 5.5, verifier Claude Fable 5.1; no two roles share a model
  - stem line began with "A " ("A parallel beam ..."), which a parser expecting plain "A text" option lines could read as a fifth option
- fix_type: format
- changed_file: questions.md
- before: "A parallel beam of light, travelling parallel to the principal axis, passes through a thin diverging lens."
- after:  "Parallel rays of light, travelling parallel to the principal axis, pass through a thin diverging lens."
- answers_changed: no

## Q2
- verdict: CLEAN
- agreement: full
- issues: none

## Q3
- verdict: FIXED
- agreement: full
- issues:
  - stem line began with "A " ("A candle flame ..."), parser hazard for plain-line MCQ options
- fix_type: format
- changed_file: questions.md
- before: "A candle flame is placed on the principal axis of a thin converging lens of focal length 10 cm."
- after:  "The flame of a candle is placed on the principal axis of a thin converging lens of focal length 10 cm."
- answers_changed: no

## Q4
- verdict: CLEAN
- agreement: full
- issues: none

## Q5
- verdict: FIXED
- agreement: full
- issues:
  - stem line began with "A " ("A student is short-sighted."), parser hazard for plain-line MCQ options
- fix_type: format
- changed_file: questions.md
- before: "A student is short-sighted. / Which statement describes the student's problem and how it is corrected?"
- after:  "Mei is short-sighted. / Which statement describes her problem and how it is corrected?"
- answers_changed: no

## Q6
- verdict: FIXED
- agreement: full
- issues:
  - stem line began with "A " ("A narrow beam ..."), parser hazard for plain-line MCQ options
- fix_type: format
- changed_file: questions.md
- before: "A narrow beam of white light passes through a glass prism."
- after:  "White light in a narrow beam passes through a glass prism."
- answers_changed: no

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
- verdict: FIXED
- agreement: full
- issues:
  - solver medium confidence (radio waves also used with some satellites) dismissed: syllabus 3.3.5 says communication with satellites is mainly by microwaves, so only one option is correct
  - stem line began with "A " ("A company sends ..."), parser hazard for table-form MCQ options
- fix_type: format
- changed_file: questions.md
- before: "A company sends direct broadcast television to homes using an artificial satellite."
- after:  "Direct broadcast television is sent to homes by a company using an artificial satellite."
- answers_changed: no

## Q14
- verdict: CLEAN
- agreement: full
- issues: none

## Q15
- verdict: FIXED
- agreement: full
- issues:
  - calculation re-done, value, unit and 2 s.f. correct; distractors each come from a distinct error
  - stem line began with "A " ("A radio transmitter ..."), parser hazard for plain-line MCQ options
- fix_type: format
- changed_file: questions.md
- before: "A radio transmitter emits radio waves of frequency 120 MHz into the air."
- after:  "Radio waves of frequency 120 MHz are emitted by a transmitter into the air."
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
- verdict: FIXED
- agreement: full
- issues:
  - solver note on open mark split dismissed: the only lower-frequency regions with a syllabus harmful effect are microwaves and infrared, so the 1 + 2 split is unambiguous
  - (a) mark scheme rejected "skin burns" but gave no ruling on "sunburn", the most common correct student wording for UV skin damage
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- REJECT: \"skin burns\" (that is the effect of infrared) as the only answer"
- after:  "- ALLOW: sunburn / damage to the skin for the first mark" added before the REJECT line
- answers_changed: no

## Q25
- verdict: CLEAN
- agreement: full
- issues:
  - solver note on "mainly" dismissed: it is the syllabus wording of 3.3.5; Bluetooth is a radio-wave use per 3.3.7 so its absence from (c) is correct

## Q26
- verdict: CLEAN
- agreement: full
- issues:
  - both calculations re-done; prefix conversions, units and 2 s.f. correct; GHz is Extended-only and the question is supplement

## Q27
- verdict: CLEAN
- agreement: full
- issues:
  - solver note on open-ended reasons dismissed: the question tests 3.3.7, whose reasons are fixed by the syllabus and are what the mark scheme credits

## Q28
- verdict: CLEAN
- agreement: full
- issues: none

## Q29
- verdict: FIXED
- agreement: full
- issues:
  - solver gave non-syllabus benefits in (a); the syllabus benefits are the intended answer, but "accurate regeneration / noise removed" is the stated cause of the range benefit and deserved an ALLOW
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: can be sent further for increased range"
- after:  "- ALLOW: can be sent further for increased range / - ALLOW: the signal can be regenerated accurately / noise can be removed, for the increased range mark"
- answers_changed: no

## Q30
- verdict: FIXED
- agreement: full
- issues:
  - (c) listed detection of cancer and treatment of cancer as separate one-mark uses but then allowed "detection and treatment of cancer" for one mark only, contradicting itself
- fix_type: markscheme_allow
- changed_file: markscheme.md
- before: "- ALLOW: \"detection and treatment of cancer\" for one mark only"
- after:  "- ALLOW: \"detection and treatment of cancer\" for two marks; \"treating cancer\" / \"radiotherapy\" alone for one mark"
- answers_changed: no
