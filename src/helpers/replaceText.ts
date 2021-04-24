
export function text(message: string = "", words: any) {

  if (message === null) {
    return ""
  }

  words = {
    protocol: null,
    operator: null,
    name: null,
    department: null,
    ...words,
  }

  for (const key in words) {
    if (words[key] === null) {
      words[key] = ""
    }
  }

  return message.toString()
    .replace(/{protocolo}/g, `*${words.protocol}*`)
    .replace(/{operador}/g, `*${words.operator}*`)
    .replace(/{nome}/g, `*${words.name}*`)
    .replace(/{departamento}/g, `*${words.department}*`)
}