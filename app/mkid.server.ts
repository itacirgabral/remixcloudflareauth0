export default function mkid () {
  const now = String(Date.now())
  const random = String(Math.random()).slice(2, 6)

  return now.concat('.').concat(random)
}