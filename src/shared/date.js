/**
 * Returns today's date in local time as a "YYYY-MM-DD" string,
 * suitable for use as the value of <input type="date">.
 *
 * @returns {string}
 */
export function todayIsoDate() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
