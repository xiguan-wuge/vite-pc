export const randomCodes = '1234567890abcdefjhijklinopqrsduvwxyz'
export const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}
export const makeCode = (len: number) => {
  let res = ''
  for (let i = 0; i < len; i++) {
    res +=
    randomCodes[randomNum(0, randomCodes.length)]
  }
  return res
}

export const getTime = () => {
  let msg = ''
  const hours = new Date().getHours()
  if (hours <= 9) {
    msg = '早上'
  } else if (hours <= 12) {
    msg = '上午'
  } else if (hours <= 18) {
    msg = '下午'
  } else {
    msg = '晚上'
  }
  return msg
}

