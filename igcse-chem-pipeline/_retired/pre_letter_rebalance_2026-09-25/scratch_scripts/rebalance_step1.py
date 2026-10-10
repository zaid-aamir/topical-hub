import re, sys, json

BASE = "pipeline/04_approved/T05_20260923_01/questions.md"
MS = "pipeline/04_approved/T05_20260923_01/markscheme.md"

targets = {"Q1":"A","Q2":"B","Q3":"A","Q4":"C","Q5":"D","Q6":"B","Q7":"B","Q8":"A",
           "Q9":"C","Q10":"A","Q11":"C","Q12":"C","Q13":"D","Q14":"B","Q15":"D"}

letters = ["A","B","C","D"]

with open(BASE, encoding="utf-8") as f:
    qtext = f.read()
with open(MS, encoding="utf-8") as f:
    mtext = f.read()

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

qpre, qsecs, qorder = split_sections(qtext)
mpre, msecs, morder = split_sections(mtext)

old_correct = {}
mapping = {}
old_opts_by_q = {}

opt_re = re.compile(r'(?m)^A (.*)\nB (.*)\nC (.*)\nD (.*)$')

for qn in targets:
    body = qsecs[qn]
    m = opt_re.search(body)
    if not m:
        raise SystemExit(f"Could not find option block for {qn}")
    old_opts = {"A": m.group(1), "B": m.group(2), "C": m.group(3), "D": m.group(4)}
    old_opts_by_q[qn] = old_opts

    mbody = msecs[qn]
    am = re.search(r'(?m)^- answer:\s*([A-D])\s*$', mbody)
    if not am:
        raise SystemExit(f"Could not find answer line for {qn}")
    old_letter = am.group(1)
    old_correct[qn] = old_letter

    target_letter = targets[qn]
    if old_letter == target_letter:
        mapping[qn] = {l: l for l in letters}
        continue

    distractor_letters_in_order = [l for l in letters if l != old_letter]
    remaining_slots_in_order = [l for l in letters if l != target_letter]
    mp = {old_letter: target_letter}
    for dist_l, slot_l in zip(distractor_letters_in_order, remaining_slots_in_order):
        mp[dist_l] = slot_l
    mapping[qn] = mp

print("Mappings computed:")
for qn in targets:
    print(qn, "old_correct=", old_correct[qn], "target=", targets[qn], "map=", mapping[qn])

with open("_scratch_maintenance/mapping_debug.json", "w") as f:
    json.dump({"old_correct": old_correct, "mapping": mapping, "old_opts": old_opts_by_q}, f, indent=2)
