export function getStablePostViews(title = '') {
  const hash = [...title].reduce((total, character) => total + character.charCodeAt(0), 0)
  return 51 + hash % 925
}
