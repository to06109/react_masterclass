import styled from 'styled-components'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  useViewportScroll,
} from 'framer-motion'
import { useState } from 'react'

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const Box = styled(motion.div)`
  width: 400px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 35px;
  position: absolute;
  top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`
const box = {
  // 함수에서 object return하려면 괄호로 감싸야함
  entry: (back: boolean) => ({
    // 뒤로 가는 거면 entry가 왼쪽(-500)에서 와야함
    x: back ? -500 : 500,
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.3,
    },
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: (back: boolean) => ({
    // 뒤로 가는 거면 exit가 오른쪽(500)으로 가야함
    x: back ? 500 : -500,
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.3,
    },
  }),
}

function App() {
  const [visible, setVisible] = useState(1)
  // 뒤로 가는지 여부 확인
  const [back, setBack] = useState(false)
  const nextPlease = () => {
    // next 버튼 누르면 back = false
    setBack(false)
    setVisible((prev) => (prev === 10 ? 10 : prev + 1))
  }
  const prevPlease = () => {
    // prev 버튼 누르면 back = true
    setBack(true)
    setVisible((prev) => (prev === 1 ? 1 : prev - 1))
  }
  return (
    <Wrapper>
      <AnimatePresence custom={back}>
        <Box
          custom={back}
          variants={box}
          initial="entry"
          animate="center"
          exit="exit"
          key={visible}
        >
          {visible}
        </Box>
      </AnimatePresence>
      <button onClick={nextPlease}>next</button>
      <button onClick={prevPlease}>prev</button>
    </Wrapper>
  )
}

export default App
