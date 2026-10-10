import re

MS = "pipeline/04_approved/T05_20260923_01/markscheme.md"

def split_sections(text):
    parts = re.split(r'(?m)^(## Q\d+)\n', text)
    preamble = parts[0]
    sections = {}
    order = []
    for i in range(1, len(parts), 2):
        header = parts[i]
        body = parts[i+1] if i+1 < len(parts) else ""
        qnum = header.replace("## ", "")
        sections[qnum] = body
        order.append(qnum)
    return preamble, sections, order

def join_sections(preamble, sections, order):
    out = [preamble]
    for qn in order:
        out.append("## " + qn + "\n")
        out.append(sections[qn])
    return "".join(out)

with open(MS, encoding="utf-8") as f:
    mtext = f.read()
mpre, msecs, morder = split_sections(mtext)

# (old_substring, new_substring) pairs, scoped per question, applied in order.
# Each old_substring must appear exactly once in that question's section text.
repl = {
"Q4": [
    ("B flips the sign; C incorrectly halves the value; D incorrectly doubles it.",
     "A flips the sign; B incorrectly halves the value; D incorrectly doubles it."),
    ("confirming this is an exothermic reaction (as expected for combustion), so the answer is A.",
     "confirming this is an exothermic reaction (as expected for combustion), so the answer is C."),
],
"Q5": [
    ("A and C wrongly pair exothermic/endothermic with the wrong sign; D wrongly calls combustion endothermic.",
     "A and B wrongly pair exothermic/endothermic with the wrong sign; C wrongly calls combustion endothermic."),
    ("By definition, ∆H is negative for exothermic reactions, so the answer is B.",
     "By definition, ∆H is negative for exothermic reactions, so the answer is D."),
],
"Q6": [
    ("A and B wrongly call it exothermic; D wrongly pairs endothermic with a negative sign.",
     "A and C wrongly call it exothermic; D wrongly pairs endothermic with a negative sign."),
    ("This makes it endothermic, and endothermic reactions have ∆H positive, so the answer is C.",
     "This makes it endothermic, and endothermic reactions have ∆H positive, so the answer is B."),
],
"Q8": [
    ("A and B wrongly assume ∆H changes by the same amount as Ea; D wrongly assumes ∆H becomes zero.",
     "B and C wrongly assume ∆H changes by the same amount as Ea; D wrongly assumes ∆H becomes zero."),
    ("the overall enthalpy change, ∆H, stays exactly the same. The answer is C.",
     "the overall enthalpy change, ∆H, stays exactly the same. The answer is A."),
],
"Q9": [
    ("A and D get one or both directions wrong; C wrongly says bond making absorbs energy.",
     "A and D get one or both directions wrong; B wrongly says bond making absorbs energy."),
    ("This matches option B.",
     "This matches option C."),
],
"Q10": [
    ("A and C wrongly call it exothermic; D wrongly reverses the direction of energy transfer.",
     "B and C wrongly call it exothermic; D wrongly reverses the direction of energy transfer."),
    ("The answer is B.",
     "The answer is A."),
],
"Q11": [
    ("A describes the reverse (endothermic) situation; C would give ∆H = 0; D is incorrect since bonds are always broken during a chemical reaction.",
     "A describes the reverse (endothermic) situation; B would give ∆H = 0; D is incorrect since bonds are always broken during a chemical reaction."),
    ("This matches option B.",
     "This matches option C."),
],
"Q12": [
    ("B has the correct size but wrong sign; C comes from only forming one H–Cl bond instead of two; D comes from adding instead of subtracting the two totals.",
     "A has the correct size but wrong sign; B comes from only forming one H–Cl bond instead of two; D comes from adding instead of subtracting the two totals."),
    ("The negative sign confirms this matches option A.",
     "The negative sign confirms this matches option C."),
],
"Q13": [
    ("A and C wrongly claim ∆H decreases; D wrongly claims Ea increases.",
     "A and B wrongly claim ∆H decreases; C wrongly claims Ea increases."),
    ("the enthalpy change, ∆H, of the reaction is not affected by the catalyst. This matches option B.",
     "the enthalpy change, ∆H, of the reaction is not affected by the catalyst. This matches option D."),
],
"Q14": [
    ("B and D wrongly call it endothermic; C wrongly reverses the direction of energy transfer for an exothermic process.",
     "A and D wrongly call it endothermic; C wrongly reverses the direction of energy transfer for an exothermic process."),
    ("A reaction that releases thermal energy to its surroundings, raising their temperature, is exothermic, so the answer is A.",
     "A reaction that releases thermal energy to its surroundings, raising their temperature, is exothermic, so the answer is B."),
],
"Q15": [
    ("A keeps the original sign; C and D show incorrect changes in magnitude.",
     "A keeps the original sign; B and C show incorrect changes in magnitude."),
    ("the reverse reaction (decomposition of ammonia) has ∆H = +92 kJ/mol. The answer is B.",
     "the reverse reaction (decomposition of ammonia) has ∆H = +92 kJ/mol. The answer is D."),
],
}

changed = []
for qn, pairs in repl.items():
    body = msecs[qn]
    for old_s, new_s in pairs:
        cnt = body.count(old_s)
        assert cnt == 1, f"{qn}: expected 1 occurrence, got {cnt} for: {old_s!r}"
        body = body.replace(old_s, new_s)
    msecs[qn] = body
    changed.append(qn)

new_mtext = join_sections(mpre, msecs, morder)
with open(MS, "w", encoding="utf-8") as f:
    f.write(new_mtext)

print("Rationale/worked-solution text updated for:", changed)
