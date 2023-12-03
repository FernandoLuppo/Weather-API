export const codeGenerator = (): number => {
  const numberList: number[] = []
  for (let i = 0; i < 6; i++) {
    const number = Math.floor(Math.random() * 9)
    numberList.push(number)
  }

  const code = parseInt(numberList.join(""))
  return code
}
