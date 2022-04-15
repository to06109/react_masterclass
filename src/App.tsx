import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Grid = styled.div`
  display: grid;
  // repeat(반복횟수, 반복값)
  grid-template-columns: repeat(3, 1fr);
  width: 50vw;
  gap: 10px;
  // 1번 라인에서 2칸
  // grid-column: 1 / span 2;
  div:first-child,
  div:last-child {
    grid-column: span 2;
  }
`
const Box = styled(motion.div)`
  height: 400px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`
function App() {
  const [id, setId] = useState<null | string>(null)
  return (
    <Wrapper>
      <Grid>
        {/* click을 할 때마다 state를 바꿈 */}
        {['1', '2', '3', '4'].map((n) => (
          // layoutId는 str이어야 함
          <Box onClick={() => setId(n)} key={n} layoutId={n} />
        ))}
      </Grid>
      {/* exit 애니메이션을 주기 위함 */}
      <AnimatePresence>
        {/* id가 존재하면 Overlay 를 보여주기 */}
        {id ? (
          <Overlay
            // 다시 클릭하면 초기화
            onClick={() => setId(null)}
            // Overlay에 animation 주기
            initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            animate={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
          >
            {/* 그리드 박스와 오버레이 박스를 layoutId로 연결해줌 */}
            <Box layoutId={id} style={{ width: 400, height: 200 }} />
          </Overlay>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  )
}

export default App
