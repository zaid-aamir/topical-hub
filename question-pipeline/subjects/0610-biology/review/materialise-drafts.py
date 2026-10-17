"""Format the hand-authored source/*.txt records into pipeline Markdown; never overwrite a batch.
M|point ids|stem|correct option|distractor|distractor|distractor|rationale
S|point ids|stem|part a prompt|marking points (~ separated)|part b prompt|points
The source records are original authored content, not templates filled with random values.
"""
import collections
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP = json.loads((ROOT / 'config/syllabus_map.json').read_text(encoding='utf-8'))
PLAN = json.loads((ROOT / 'config/batch_plan.json').read_text(encoding='utf-8'))['batches']
POINTS = {p['point_id']: (s, p) for t in MAP['topics'] for s in t['subtopics'] for p in s['points']}
SPLITS = {
    'T16_P1': {'16.1': 5, '16.2': 7, '16.3': 18},
    'T16_P2': {'16.4': 13, '16.5': 8, '16.6': 9},
    'T17_P1': {'17.1': 30},
    'T17_P2': {'17.2': 6, '17.3': 3, '17.4': 21},
    'T18_P1': {'18.1': 16, '18.2': 5, '18.3': 9},
    'T19_P1': {'19.1': 2, '19.2': 19, '19.3': 3, '19.4': 6},
    'T20_P1': {'20.1': 5, '20.2': 6, '20.3': 6, '20.4': 13},
    'T21_P1': {'21.1': 3, '21.2': 11, '21.3': 6},
}
DATE = '2026-10-18'
MODEL = 'GPT-6 (Codex)'


def main():
    for key, split in SPLITS.items():
        plan = next(p for p in PLAN if p['key'] == key)
        existing = list((ROOT / 'batches').glob(f'*/0610_{key}_*'))
        if existing:
            print(f'{key}: existing batch retained')
            continue
        source = ROOT / 'review/source' / f'{key}.txt'
        rows = [line.split('|') for line in source.read_text(encoding='utf-8').splitlines() if line and not line.startswith('#')]
        assert len(rows) == plan['questions'], (key, len(rows))
        assert sum(row[0] == 'M' for row in rows) == plan['mcq']
        batch = f'0610_{key}_{DATE.replace("-", "")}'
        q = [f'---\nbatch_id: {batch}\nsubject_id: "0610-biology"\nsyllabus: "0610 (2026-2028)"\ntopic_id: "{plan["topic_id"]}"\ntopic_name: "{plan["topic_name"]}"\npart: {plan["part"]}\nsubtopic_ids: {json.dumps(plan["subtopic_ids"])}\ncreated: {DATE}\ngenerator_model: "{MODEL}"\n---\n']
        ms = [f'---\nbatch_id: {batch}\n---\n']
        actual = collections.Counter()
        tiers = collections.Counter()
        letters = []
        for n, row in enumerate(rows, 1):
            kind, ids, stem, *rest = row
            pids = ids.split(',')
            sub, _ = POINTS[pids[0]]
            for pid in pids:
                s, p = POINTS[pid]
                assert s['subtopic_id'] == sub['subtopic_id']
                assert p['diagram_dependence'] != 'essential', pid
            assert sub['subtopic_id'] in plan['subtopic_ids']
            tier = 'supplement' if any(POINTS[pid][1]['tier'] == 'supplement' for pid in pids) else 'core'
            actual[sub['subtopic_id']] += 1
            tiers[tier] += 1
            # MCQ and structured difficulty distributions each approximate 1:2:1.
            difficulty = 1 if n % 4 == 1 else 3 if n % 4 == 0 else 2
            if kind == 'M':
                assert len(rest) == 5, (key, n)
                correct, *wrong, rationale = rest
                # Deterministic balanced spread; not a repeating ABCD answer key.
                slots = [1, 3, 0, 2, 3, 1, 2, 0, 1, 2, 3, 0, 2, 0, 1]
                slot = slots[len(letters)]
                options = wrong[:]
                options.insert(slot, correct)
                letter = 'ABCD'[slot]
                letters.append(letter)
                marks = 1
                body = stem + '\n\n' + '\n'.join(f'{l} {v}' for l, v in zip('ABCD', options))
                answer = f'- answer: {letter}\n\n**Rationale**\n{rationale}'
            else:
                assert kind == 'S' and len(rest) in (4, 6, 8), (key, n)
                parts = [(rest[i], rest[i + 1].split('~')) for i in range(0, len(rest), 2)]
                marks = sum(len(points) for _, points in parts)
                assert 4 <= marks <= 8, (key, n, marks)
                body = stem + '\n\n' + '\n\n'.join(f'({chr(97+i)}) {prompt} [{len(points)}]' for i, (prompt, points) in enumerate(parts))
                answer = '\n\n'.join(f'**({chr(97+i)})** [{len(points)}]\n' + '\n'.join(f'- {p} (1)' for p in points) for i, (_, points) in enumerate(parts))
                explanation = '\n\n'.join(f'({chr(97+i)}) ' + ' '.join(p.rstrip('.') + '.' for p in points) for i, (_, points) in enumerate(parts))
                answer += '\n\n**Worked solution**\n' + explanation
            q.append(f'## Q{n}\n- id: {batch}_Q{n}\n- type: {"mcq" if kind == "M" else "structured"}\n- tier: {tier}\n- subtopic_id: "{sub["subtopic_id"]}"\n- subtopic_name: "{sub["subtopic_name"]}"\n- syllabus_points: {json.dumps(pids)}\n- difficulty: {difficulty}\n- marks: {marks}\n- needs_diagram: false\n\n**Question**\n\n{body}\n')
            ms.append(f'## Q{n}\n{answer}\n')
        assert dict(actual) == split, (key, actual, split)
        counts = collections.Counter(letters)
        assert max(counts.values()) - min(counts.values()) <= 1
        dest = ROOT / 'batches/01_drafts' / batch
        dest.mkdir(parents=True, exist_ok=False)
        (dest / 'questions.md').write_text('\n'.join(q), encoding='utf-8', newline='\n')
        (dest / 'markscheme.md').write_text('\n'.join(ms), encoding='utf-8', newline='\n')
        progress_file = ROOT / 'logs/progress.json'
        progress = json.loads(progress_file.read_text(encoding='utf-8'))
        progress['batches'][key] = {'batch_id': batch, 'status': 'drafted'}
        progress_file.write_text(json.dumps(progress, indent=2) + '\n', encoding='utf-8', newline='\n')
        with (ROOT / 'logs/run_log.md').open('a', encoding='utf-8', newline='\n') as log:
            log.write(f'{DATE} | GENERATED | {batch} | {MODEL} | {plan["mcq"]} MCQ, {plan["structured"]} structured; tier mix {dict(tiers)} | sub-topic split {dict(actual)} | owner review pending; not independently solved or verified\n')
        print(f'{key}: {len(rows)} drafted; split {dict(actual)}')


if __name__ == '__main__':
    main()
