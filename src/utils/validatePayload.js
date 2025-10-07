function ordinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
 
function formatKey(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
    .replace(/_/g, " ") // handle snake_case
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case
}
 
function formatValue(value) {
  if (typeof value === "string") {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  return value;
}
 
function checkFields(obj, path = "") {
  let results = [];
 
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const newPath = `${path ? path + " > " : ""}${ordinalSuffix(index + 1)} item`;
      results = results.concat(checkFields(item, newPath));
    });
  } else if (obj && typeof obj === "object") {
    for (const key in obj) {
      const value = obj[key];
      const formattedKey = formatKey(key);
      const newPath = path ? `${path} > ${formattedKey}` : formattedKey;
 
      if (key === "approvalStatus" && (value === "pending" || value === "rejected")) {
        results.push(`${path || formattedKey} is not approved (${formatValue(value)})`);
      }
 
      if (key === "isActive" && value === false) {
        results.push(`${path || formattedKey} is not Active`);
      }
 
      if (key === "deletedAt" && value !== null) {
        results.push(`${path || formattedKey} is Deleted`);
      }
 
      results = results.concat(checkFields(value, newPath));
    }
  }
 
  return results;
}
 
export function validatePayload(payload) {
  const issues = checkFields(payload);
  return issues.length > 0 ? issues : ["Everything is approved"];
}