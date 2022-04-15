import styled from 'styled-components'
import { motion, useMotionValue, useTransform, useViewportScroll } from 'framer-motion'

const Wrapper = styled(motion.div)`
  // 스크롤 할 수 있게 높이 키움
  height: 200vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`
function App() {
  // x축 드래그값 받기
  const x = useMotionValue(0)
  // 드래그값 -> 회전값 변환
  const rotateZ = useTransform(x, [-800, 800],[-360, 360])
  // 드래그값 -> 색상값 변환
  const gradient = useTransform(x, [-800, 800], [
    "linear-gradient(135deg,rgb(31, 227, 237), rgb(0, 27, 206)))",
    "linear-gradient(135deg,rgb(0, 238, 0),rgb(225, 198, 19))"])
  
  // y축 스크롤값 받기 
  const {scrollYProgress} = useViewportScroll()
  // 스크롤값 -> scale값 변환 (더 빨리 커지도록 단위 변환)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 5])

  return (
    <Wrapper style={{background: gradient}}>
      <Box  
        style={{ x, rotateZ, scale}}
        drag="x"
        dragSnapToOrigin
      />
    </Wrapper>
  )
}

export default App
