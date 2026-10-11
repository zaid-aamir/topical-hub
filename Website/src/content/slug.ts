/**
 * URL slugs for topics (and, later, sub-topics).
 *
 * Rule from CONTRACT.md: lower-case, letters and digits kept, every other run of characters
 * becomes one hyphen, no leading or trailing hyphen. "Acids, bases and salts" -> "acids-bases-and-salts".
 * Only ASCII letters and digits are kept, so the result is always URL-safe; a non-ASCII letter
 * (none in the current content) becomes a hyphen like any other character.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
