import type { Question } from '../content';
import type { Subject } from '../config';
/** Subject.anchor: 'number' keeps published Chemistry links (#q<n>); 'id' uses the complete source id across batches. */
export function questionAnchor(question: Question, subject: Subject): string {
  return subject.anchor === 'number' ? `q${question.number}` : question.id;
}
