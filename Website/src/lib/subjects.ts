/**
 * The topics of each subject in SUBJECTS (src/config.ts), for the home page's subject cards.
 *
 * v1 has one content source, the Chemistry 0620 pipeline read by src/content. A subject without a
 * content source fails the build here rather than showing "0 topics" on the home page.
 */
import { loadAllTopics } from '../content';
import type { Topic } from '../content';
import { SUBJECT } from '../config';
import type { Subject } from '../config';

export function subjectTopics(subject: Subject): Topic[] {
  if (subject.path === SUBJECT.path) return loadAllTopics();
  throw new Error(`No content source for subject "${subject.path}": add one in src/lib/subjects.ts.`);
}

/** Topic and question counts for a subject, computed from the data. */
export function subjectCounts(subject: Subject): { topics: number; questions: number } {
  const topics = subjectTopics(subject);
  return { topics: topics.length, questions: topics.reduce((sum, topic) => sum + topic.counts.total, 0) };
}