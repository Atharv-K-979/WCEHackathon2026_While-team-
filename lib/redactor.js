import { extractMatches, redact } from './patterns.js';

export function redactText(text) {
  const matches = extractMatches(text);
  if (matches.length === 0) {
    return { isSensitive: false, text, matches: [] };
  }
  const redacted = redact(text, matches);
  return { isSensitive: true, text: redacted, matches };
}
