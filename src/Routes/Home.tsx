import { useQuery } from 'react-query'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { getMovies, IGetMoviesResult } from '../api'
import { makeImagePath } from '../utils'
import { useState } from 'react'

const Wrapper = styled.div`
  background: black;
`

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

// props 타입 알려줌
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  // Banner div의 중앙에 위치
  justify-content: center;
  // 여백 60px
  padding: 60px;
  // 배경화면 설정
  // 글자가 이미지에 가려져서 안보일수 있음
  // -> 같은 div에 다른 배경을 가질 수 있도록함 -> 이미지를 덮음
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`

const Overview = styled.p`
  font-size: 36px;
  // 줄거리 너무 길기 때문에 너비를 화면의 반으로 설정
  width: 50%;
`

const Slider = styled.div`
  // state 기준 위치
  position: relative;
  // 슬라이더를 좀 위로 올림
  top: -100px;
`

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  // 부모 기준 위치
  position: absolute;
  width: 100%;
`

const Box = styled(motion.div)`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
`

const rowVariants = {
  hidden: {
    // Row와 Row 사이 gap 조절
    x: window.outerWidth - 10,
  },
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 10 },
}

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies,
  )
  // Row index
  const [index, setIndex] = useState(0)
  const increaseIndex = () => setIndex((prev) => prev + 1)

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        // 홈 화면에서 배너 뿐만 아니라 여러 슬라이더도 보여줄것이므로 유령컴포넌트로 여러 컴포넌트 묶음
        <>
          {/* bgPhoto로 이미지의 링크를 만들어서 보냄 */}
          {/* data가 존재하지 않을 때의 fallback 만들어줘야함 */}
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}
          >
            <Title>{data?.results[0].title || undefined}</Title>
            <Overview>{data?.results[0].overview || undefined}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: 'tween', duration: 1 }}
                key={index}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Box key={i}>{i}</Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  )
}

export default Home
