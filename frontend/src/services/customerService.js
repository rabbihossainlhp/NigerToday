async function apiNotConfigured(operation) {
  throw new Error(`Customer API operation "${operation}" is not configured.`);
}

export const customerService = {
  list: () => apiNotConfigured("list"),
  getById: () => apiNotConfigured("getById"),
  create: () => apiNotConfigured("create"),
  update: () => apiNotConfigured("update"),
  remove: () => apiNotConfigured("remove"),
  renew: () => apiNotConfigured("renew"),
};
