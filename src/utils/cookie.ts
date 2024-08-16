export function getCookie(name: string): string | undefined {
  const encodeName = encodeURIComponent(name)
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        encodeName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )

  return matches ? decodeURIComponent(matches[1]) : undefined
}

export function setCookie(name: string, value: string, days: number) {
  let expires = ''
  // 형식의 유효성을 일관성 있게 유지하기 위해 내장 함수 encodeURIComponent를 사용하여 이름과 값을 이스케이프 처리해줍니다.
  // e.g. 'hello world' -> 'hello%20world', 'test?' -> 'test%3F'
  const updatedCookie =
    encodeURIComponent(name) + '=' + encodeURIComponent(value)

  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    // 쿠키의 유효 일자는 반드시 GMT(Greenwich Mean Time) 포맷으로 설정해야 합니다.
    // date.toUTCString을 사용하면 해당 포맷으로 쉽게 변경할 수 있습니다.
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${updatedCookie}${expires}; path=/`
}
