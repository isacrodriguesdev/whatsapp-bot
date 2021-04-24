
export function generateProtocol(codeCategory?: number) {

  const min = Math.ceil(100);
  const max = Math.floor(999);

  const date = new Date()

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear().toString().split('')
  const hour = date.getHours()
  const minute = date.getMinutes()
  const random = Math.round(Math.random() * (max - min)) + min

  return `${day}${month}${year[2]}${year[3]}${hour}${minute}${random}`
}