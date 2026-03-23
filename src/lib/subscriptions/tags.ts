export function normalizeTagsInput(input: string) {
  const seen = new Set<string>();
  const tags: string[] = [];

  for (const rawPart of input.split(/[\n,]/)) {
    const value = rawPart.trim();

    if (!value) {
      continue;
    }

    const key = value.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    tags.push(value);
  }

  return tags;
}

export function parseStoredTags(tagsText: string | null | undefined) {
  if (!tagsText) {
    return [];
  }

  return tagsText
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function serializeTags(tags: string[]) {
  return tags.join("\n");
}

export function formatTagsForInput(tagsText: string | null | undefined) {
  return parseStoredTags(tagsText).join(", ");
}
