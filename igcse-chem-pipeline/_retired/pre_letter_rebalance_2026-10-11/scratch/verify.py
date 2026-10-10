import re, json
B='_retired/pre_letter_rebalance_2026-10-11/'
D='pipeline/04_approved/T07_20260925_01/'
T=json.load(open(B+'targets.json'))['T07_20260925_01']
def blocks(p):
    t=open(p,newline='').read()
    return {re.match(r'## (Q\d+)',b).group(1):b for b in re.split(r'(?m)^(?=## Q\d+\s*$)',t)[1:]}, re.split(r'(?m)^(?=## Q\d+\s*$)',t)[0]
def opts(b):
    ls=b.split('\n'); r=[]
    for l in ls:
        m=re.match(r'^([A-D]) (.*)$',l) or re.match(r'^\|\s*([A-D])\s*\|(.*)$',l)
        if m: r.append((m.group(1),m.group(2).strip()))
    return r[-4:]
ok=True
for f in ['questions.md','markscheme.md']:
    n,nh=blocks(D+f); o,oh=blocks(B+'T07_20260925_01/'+f)
    assert nh==oh and list(n)==list(o)
    if f=='questions.md': nq,oq=n,o
    else: nm,om=n,o
for q in nq:
    if q not in T:
        if nq[q]!=oq[q] or nm.get(q)!=om.get(q): print('CHANGED non-listed',q); ok=False
        continue
    oa=re.search(r'(?m)^- answer: ([A-D])$',om[q]).group(1); na=re.search(r'(?m)^- answer: ([A-D])$',nm[q]).group(1)
    oo=dict(opts(oq[q])); no=dict(opts(nq[q]))
    if na!=T[q]: print('answer',q); ok=False
    if no[na]!=oo[oa]: print('text',q); ok=False
    if sorted(no.values())!=sorted(oo.values()) or [k for k,_ in opts(nq[q])]!=list('ABCD'): print('set',q); ok=False
    # distractor relative order
    if [v for k,v in opts(nq[q]) if k!=na]!=[v for k,v in opts(oq[q]) if k!=oa]: print('order',q); ok=False
    # nothing else changed: compare with letters stripped from options in qs
    strip=lambda b:'\n'.join(l for l in b.split('\n') if not (re.match(r'^[A-D] ',l) or re.match(r'^\|\s*[A-D]\s*\|',l)) or 'few drops' in l)
    # header lines identical outside option rows
    a=[l for l in oq[q].split('\n') if l not in [x for x in oq[q].split('\n')][-0:0]]
    if len(nq[q].split('\n'))!=len(oq[q].split('\n')): print('linecount',q); ok=False
    if len(nm[q].split('\n'))!=len(om[q].split('\n')): print('ms linecount',q); ok=False
print('OK' if ok else 'FAIL')
