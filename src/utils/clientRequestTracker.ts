const pendingClientRequestIds = new Set<string>();

export function trackClientRequestId(id: string) {
  pendingClientRequestIds.add(id);
}

export function consumeClientRequestId(id: string) {
  const exists = pendingClientRequestIds.has(id);
  if (exists) {
    pendingClientRequestIds.delete(id);
  }
  return exists;
}
