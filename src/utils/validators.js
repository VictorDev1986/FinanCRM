export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isMinLength(value, min = 6) {
  return value?.length >= min
}
