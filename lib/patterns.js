// Regex patterns for sensitive data
export const patterns = [
  { type: 'credit_card', regex: /\b(?:\d[ -]*?){13,16}\b/g },
  { type: 'upi', regex: /\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b/g },
  { type: 'email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g },
  { type: 'phone', regex: /\b(?:\+?91[\-\s]?)?[6789]\d{9}\b/g },
  { type: 'aadhaar', regex: /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g },
  { type: 'pan', regex: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g },
  { type: 'ip', regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
  { type: 'password', regex: /(?<=password["'\s*:=]*)\S{8,}/gi }
];

export function extractMatches(text) {
  const matches = [];
  patterns.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern.regex);
    while ((match = regex.exec(text)) !== null) {
      matches.push({ type: pattern.type, value: match[0], index: match.index });
    }
  });
  return matches;
}

export function redact(text, matches) {
  let redacted = text;
  matches.forEach(match => {
    const replacement = 'X'.repeat(match.value.length);
    redacted = redacted.replace(match.value, replacement);
  });
  return redacted;
}
