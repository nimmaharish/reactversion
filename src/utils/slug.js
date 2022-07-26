export function generateSlug(name = '', id) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_');

  return `${slug}-${id}`;
}
