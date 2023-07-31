export function deepFreeze<T>(obj: T) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  const propNames = Object.getOwnPropertyNames(obj);
  for (const name of propNames) {
    const prop: any = obj[name as keyof T];
    if (prop && typeof prop === "object") {
      deepFreeze(prop);
    }
  }
  return Object.freeze(obj);
}
