export function includeIfDefined(prop: any, key: string) {
  return prop !== undefined ? { [key]: prop } : {};
}
