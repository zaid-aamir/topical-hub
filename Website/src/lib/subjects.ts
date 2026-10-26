/**
 * The topics of each subject in SUBJECTS (src/config.ts). Every subject carries its own content
 * settings, so there is no per-subject code here: a subject that is not in SUBJECTS fails the build
 * rather than showing "0 topics" anywhere.
 */
import { ContentError, loadSubjectTopics, splitTopic } from '../content';
import type { Topic } from '../content';
import { SUBJECTS } from '../config';
import type { Subject } from '../config';

export function subjectTopics(subject: Subject): Topic[] {
  if (!SUBJECTS.some((s) => s.path === subject.path)) {
    throw new Error(`No content source for subject "${subject.path}": add it to SUBJECTS in src/config.ts.`);
  }
  return loadSubjectTopics(subject);
}

/**
 * The subject's topic pages in topic order: one per topic, except that a topic listed in the
 * subject's splitPages gives one page per part (see splitTopic). Routes, print pages and PDFs use
 * these; counts of topics use subjectTopics(). Page slugs must be unique within the subject.
 */
export function subjectPages(subject: Subject): Topic[] {
  const pages = subjectTopics(subject).flatMap((topic) => {
    const titles = subject.splitPages?.[topic.topicId];
    return titles ? splitTopic(topic, titles) : [topic];
  });
  const seen = new Map<string, string>();
  const problems: string[] = [];
  for (const page of pages) {
    const other = seen.get(page.slug);
    if (other) problems.push(`${subject.path}: page slug "${page.slug}" is used by ${other} and ${page.batchId}`);
    else seen.set(page.slug, page.batchId);
  }
  for (const topicId of Object.keys(subject.splitPages ?? {})) {
    if (!pages.some((page) => page.topicId === topicId)) problems.push(`${subject.path}: splitPages names topic ${topicId}, which has no content`);
  }
  if (problems.length) throw new ContentError(`Topic pages of ${subject.path} are invalid`, problems);
  return pages;
}

/** Topic and question counts for a subject, computed from the data. */
export function subjectCounts(subject: Subject): { topics: number; questions: number } {
  const topics = subjectTopics(subject);
  return { topics: topics.length, questions: topics.reduce((sum, topic) => sum + topic.counts.total, 0) };
}
