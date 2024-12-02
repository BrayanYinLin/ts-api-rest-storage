export default function getMonth({ index, lang }): string {
  const month = new Date(2024, index - 1).toLocaleString(lang ?? 'en-US', {
    month: 'long'
  })
  return month.charAt(0).toLocaleUpperCase() + month.slice(1).toLowerCase()
}
