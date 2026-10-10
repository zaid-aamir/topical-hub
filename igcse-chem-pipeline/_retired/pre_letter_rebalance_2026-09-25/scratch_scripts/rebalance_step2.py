import re, json

BASE = "pipeline/04_approved/T05_20260923_01/questions.md"
MS = "pipeline/04_approved/T05_20260923_01/markscheme.md"

with open("_scratch_maintenance/mapping_debug.json") as f:
    dbg = json.load(f)
mapping = dbg["mapping"]
old_opts_by_q = dbg["old_opts"]
old_correct = dbg["old_correct"]

targets = {"Q1":"A","Q2":"B","Q3":"A","Q4":"C","Q5":"D","Q6":"B","Q7":"B","Q8":"A",
           "Q9":"C","Q10":"A","Q11":"C","Q12":"C","Q13":"D","Q14":"B","Q15":"D"}
letters = ["A","B","C","D"]

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

# ---------- questions.md: rewrite option blocks ----------
with open(BASE, encoding="utf-8") as f:
    qtext = f.read()
qpre, qsecs, qorder = split_sections(qtext)

opt_re = re.compile(r'(?m)^A (.*)\nB (.*)\nC (.*)\nD (.*)$')

changed_q = []
for qn, mp in mapping.items():
    if all(mp[l] == l for l in letters):
        continue  # no change needed
    body = qsecs[qn]
    m = opt_re.search(body)
    assert m, f"option block missing for {qn}"
    old_opts = {"A": m.group(1), "B": m.group(2), "C": m.group(3), "D": m.group(4)}
    new_opts = {}
    for old_l, new_l in mp.items():
        new_opts[new_l] = old_opts[old_l]
    new_block = "\n".join(f"{l} {new_opts[l]}" for l in letters)
    new_body = body[:m.start()] + new_block + body[m.end():]
    qsecs[qn] = new_body
    changed_q.append(qn)

new_qtext = join_sections(qpre, qsecs, qorder)
with open(BASE, "w", encoding="utf-8") as f:
    f.write(new_qtext)

print("questions.md option blocks changed for:", changed_q)

# ---------- markscheme.md: rewrite answer line ----------
with open(MS, encoding="utf-8") as f:
    mtext = f.read()
mpre, msecs, morder = split_sections(mtext)

for qn, target_l in targets.items():
    body = msecs[qn]
    new_body, n = re.subn(r'(?m)^(- answer:\s*)([A-D])\s*$', lambda mo: mo.group(1)+target_l, body)
    assert n == 1, f"answer line replace failed for {qn} (n={n})"
    msecs[qn] = new_body

new_mtext = join_sections(mpre, msecs, morder)
with open(MS, "w", encoding="utf-8") as f:
    f.write(new_mtext)

print("markscheme.md answer lines updated for:", list(targets.keys()))
