import re, json

CUR_Q = "pipeline/04_approved/T05_20260923_01/questions.md"
CUR_M = "pipeline/04_approved/T05_20260923_01/markscheme.md"
OLD_Q = "_retired/pre_letter_rebalance_2026-09-25/T05_20260923_01/questions.md"
OLD_M = "_retired/pre_letter_rebalance_2026-09-25/T05_20260923_01/markscheme.md"

targets = {"Q1":"A","Q2":"B","Q3":"A","Q4":"C","Q5":"D","Q6":"B","Q7":"B","Q8":"A",
           "Q9":"C","Q10":"A","Q11":"C","Q12":"C","Q13":"D","Q14":"B","Q15":"D"}
letters = ["A","B","C","D"]

def split_sections(text):
    parts = re.split(r'(?m)^(## Q\d+)\n', text)
    sections = {}
    for i in range(1, len(parts), 2):
        header = parts[i]
        body = parts[i+1] if i+1 < len(parts) else ""
        sections[header.replace("## ", "")] = body
    return sections

def get_opts(body):
    m = re.search(r'(?m)^A (.*)\nB (.*)\nC (.*)\nD (.*)$', body)
    assert m
    return {"A": m.group(1), "B": m.group(2), "C": m.group(3), "D": m.group(4)}

def get_answer(body):
    m = re.search(r'(?m)^- answer:\s*([A-D])\s*$', body)
    assert m
    return m.group(1)

with open(CUR_Q, encoding="utf-8") as f: cur_qsecs = split_sections(f.read())
with open(CUR_M, encoding="utf-8") as f: cur_msecs = split_sections(f.read())
with open(OLD_Q, encoding="utf-8") as f: old_qsecs = split_sections(f.read())
with open(OLD_M, encoding="utf-8") as f: old_msecs = split_sections(f.read())

all_ok = True
for qn, target_l in targets.items():
    cur_answer = get_answer(cur_msecs[qn])
    old_answer = get_answer(old_msecs[qn])
    cur_opts = get_opts(cur_qsecs[qn])
    old_opts = get_opts(old_qsecs[qn])

    ok = True
    reasons = []
    if cur_answer != target_l:
        ok = False; reasons.append(f"answer letter {cur_answer} != target {target_l}")
    if cur_opts[cur_answer] != old_opts[old_answer]:
        ok = False; reasons.append("correct-option text mismatch")
    if set(cur_opts.values()) != set(old_opts.values()):
        ok = False; reasons.append("option text SET changed")
    # also check multiset of exact 4 values match (in case of accidental dup collapse)
    if sorted(cur_opts.values()) != sorted(old_opts.values()):
        ok = False; reasons.append("option text multiset changed")

    print(qn, "OK" if ok else "FAIL", reasons if reasons else "")
    if not ok:
        all_ok = False

print("ALL_OK" if all_ok else "SOME_FAILED")
