export function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value)
}

export function isStrongPassword(value) {
  return value?.length >= 6
}
