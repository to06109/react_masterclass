import styled from 'styled-components'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BiggerBox = styled.div`
  width: 600px;
  height: 600px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`

const boxVariants = {
  hover: { scale: 1.5, rotateZ: 90 },
  tap:{scale: 1, borderRadius: "100px"},

}

function App() {
  // x는 -800 ~ 800까지 제한값을 가짐
  const x = useMotionValue(0)
  // 변환할 값, input, output -> scale값은 0.1 ~ 2의 값을 가짐
  const scale = useTransform(x, [-800, 0, 800],[2, 1, 0.1])
  useEffect(() => { 
    // x.onChange(() => console.log(x.get()))
    x.onChange(() => console.log(scale.get()))
  }, [x])
  return (
    <Wrapper>
      <Box  
        style={{ x, scale: scale }}
        drag="x"
        dragSnapToOrigin
      />
    </Wrapper>
  )
}

export default App
