import re, json
D='pipeline/04_approved/T07_20260925_01/'
T=json.load(open('_retired/pre_letter_rebalance_2026-10-11/targets.json'))['T07_20260925_01']
SUBS={
'Q10':{'so A is correct':'so D is correct','In B both':'In A both','In C sodium':'In B sodium','In D potassium':'In C potassium'},
'Q11':{'(A).':'(C).','B gives methyl':'A gives methyl','C gives litmus':'B gives litmus'},
'Q13':{'(C).':'(A).','A: H+':'B: H+','B would mean':'C would mean'},
'Q14':{'(B).':'(C).','C is wrong':'B is wrong'},
'Q19':{'(B).':'(A).','A is the definition':'B is the definition'},
'Q21':{'(C).':'(B).'},
'Q22':{'(B).':'(D).','C has the charges':'B has the charges','D wrongly shows':'C wrongly shows'},
'Q23':{'(B).':'(D).','C: excess potassium hydroxide':'B: excess potassium hydroxide','D: hydrochloric':'C: hydrochloric'},
'Q25':{'(C).':'(B).'},
}
def split_blocks(txt):
    parts=re.split(r'(?m)^(?=## Q\d+\s*$)',txt)
    return parts  # parts[0] is frontmatter
def qn(b):
    m=re.match(r'## (Q\d+)',b); return m.group(1) if m else None
ms=open(D+'markscheme.md',newline='').read()
qs=open(D+'questions.md',newline='').read()
mb=split_blocks(ms); qb=split_blocks(qs)
cur={}
for b in mb[1:]:
    m=re.search(r'(?m)^- answer: ([A-D])',b)
    if m: cur[qn(b)]=m.group(1)
perm={}
for i,b in enumerate(qb):
    q=qn(b)
    if q not in T or cur[q]==T[q]: continue
    lines=b.split('\n')
    idx=[]
    for j,l in enumerate(lines):
        if re.match(r'^[A-D] ',l) or re.match(r'^\|\s*[A-D]\s*\|',l): idx.append(j)
    idx=idx[-4:]
    assert len(idx)==4 and idx==list(range(idx[0],idx[0]+4)),(q,idx)
    body=[]
    for j in idx:
        l=lines[j]
        if l.startswith('|'):
            m=re.match(r'^(\|\s*)([A-D])(\s*\|.*)$',l); body.append((m.group(1),m.group(3)))
        else: body.append(('',l[1:]))
    old=['ABCD'.index(cur[q])]
    ci='ABCD'.index(cur[q]); ti='ABCD'.index(T[q])
    others=[k for k in range(4) if k!=ci]
    order=[None]*4; order[ti]=ci
    it=iter(others)
    for k in range(4):
        if order[k] is None: order[k]=next(it)
    for newpos,oldpos in enumerate(order):
        pre,rest=body[oldpos]
        lines[idx[newpos]]=(pre+'ABCD'[newpos]+rest) if pre else ('ABCD'[newpos]+rest)
    qb[i]='\n'.join(lines)
    perm[q]=order
for i,b in enumerate(mb):
    q=qn(b)
    if q not in T or cur[q]==T[q]: continue
    b2,n=re.subn(r'(?m)^(- answer: )[A-D]([ \t]*)$',lambda m:m.group(1)+T[q]+m.group(2),b); assert n==1
    subs=SUBS[q]
    for k in subs: assert b2.count(k)==1,(q,k,b2.count(k))
    b2=re.sub('|'.join(re.escape(k) for k in subs),lambda m:subs[m.group(0)],b2)
    mb[i]=b2
open(D+'markscheme.md','w',newline='').write(''.join(mb))
open(D+'questions.md','w',newline='').write(''.join(qb))
print(perm)
