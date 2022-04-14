import styled from 'styled-components'
import { motion } from 'framer-motion'

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`
// 애니메이션의 무대.
// initial, finish, showing, hidden, 0%, 100%, from, to 등등 뭐든지 될 수 있음
const myVars = {
  start: { scale: 0 },
  end: { scale: 1, rotateZ: 360, transition: { type: 'spring', delay: 0.5 } },
}

function App() {
  return (
    <Wrapper>
      <Box variants={myVars} initial="start" animate="end" />
    </Wrapper>
  )
}

export default App
