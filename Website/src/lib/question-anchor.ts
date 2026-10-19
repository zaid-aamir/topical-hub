import type { Question } from '../content';
import { SUBJECT, type Subject } from '../config';
/** Preserve published Chemistry links; Biology uses the complete source ID across batches. */
export function questionAnchor(question: Question, subject: Subject = SUBJECT): string {
  return subject.path === SUBJECT.path ? `q${question.number}` : question.id;
}
