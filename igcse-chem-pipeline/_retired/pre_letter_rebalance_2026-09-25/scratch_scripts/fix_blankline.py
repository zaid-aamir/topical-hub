import re

MS = "pipeline/04_approved/T05_20260923_01/markscheme.md"

with open(MS, encoding="utf-8") as f:
    text = f.read()

targets = [f"Q{i}" for i in range(1,16)]

pattern = re.compile(r'(?m)^(## (Q(?:' + '|'.join(str(i) for i in range(1,16)) + r'))\n- answer: [A-D])\n(\*\*Rationale\*\*)$')

new_text, n = pattern.subn(lambda m: m.group(1) + "\n\n" + m.group(3), text)
print("Fixed count:", n)
assert n == 15, f"expected 15 fixes, got {n}"

with open(MS, "w", encoding="utf-8") as f:
    f.write(new_text)
