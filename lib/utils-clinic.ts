export function createClinicSlug(name: string, placeId: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const shortId = placeId.substring(0, 8);
  return `${nameSlug}-${shortId}`;
}
