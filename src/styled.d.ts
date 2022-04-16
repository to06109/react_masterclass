// 테마에 사용할 타입들을 포함(override)시키고 싶음

// import original module declarations
import 'styled-components'

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    red: string,
    black: {
        veryDark: string,
        darker: string,
        lighter: string,
    },
    white: {
        lighter: string,
        darker: string,
    }
  }
}
