/**
 * The topics of each subject in SUBJECTS (src/config.ts). Every subject carries its own content
 * settings, so there is no per-subject code here: a subject that is not in SUBJECTS fails the build
 * rather than showing "0 topics" anywhere.
 */
import { loadSubjectTopics } from '../content';
import type { Topic } from '../content';
import { SUBJECTS } from '../config';
import type { Subject } from '../config';

export function subjectTopics(subject: Subject): Topic[] {
  if (!SUBJECTS.some((s) => s.path === subject.path)) {
    throw new Error(`No content source for subject "${subject.path}": add it to SUBJECTS in src/config.ts.`);
  }
  return loadSubjectTopics(subject);
}

/** Topic and question counts for a subject, computed from the data. */
export function subjectCounts(subject: Subject): { topics: number; questions: number } {
  const topics = subjectTopics(subject);
  return { topics: topics.length, questions: topics.reduce((sum, topic) => sum + topic.counts.total, 0) };
}
