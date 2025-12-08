// src/lib/compat.ts
export { ascDetails } from "./houses"; // or the actual file
export const ascLahiri = (...args: any[]) => (require("./houses").ascDetails as any)(...args);
export { siderealPlanetLongitudes } from "./houses";
