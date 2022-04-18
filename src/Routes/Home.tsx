import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  // 줄거리 너무 길기 때문에 너비를 화면의 반으로 설정
  width: 50%;
`;

const Slider = styled.div`
  // state 기준 위치
  position: relative;
  // 슬라이더를 좀 위로 올림
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  // 부모 기준 위치
  position: absolute;
  width: 100%;
`;

// Box에 이미지 props 들어가는 type알려줌
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  // 포스터 잘리지 않게 첫번째, 마지막 박스는 transform-origin 줌
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    // Row와 Row 사이 gap 조절
    x: window.outerWidth + 5,
  },
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 5 },
};

// Box Animation
const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    // 약간 올라가게
    y: -50,
    // hover일때만 delay주기
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: "tween",
    },
  },
};

// 한 번에 보여주고 싶은 영화의 수
const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  console.log(bigMovieMatch);
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  // Row index
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    // 영화 개수에 따라 page가 상한에 도달했으면 index 0 으로 만들어줌
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1; // 배너로 사용하는거 제외
      const maxIndex = Math.floor(totalMovies / offset) - 1; // index 0에서부터 시작하므로
      // maxIndex에 도달하면 0으로
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  // 박스가 클릭되었을 때 영화 id를 받고싶음
  const onBoxClicked = (movieId: number) => {
    // URL 바꾸기: history
    history.push(`/movies/${movieId}`);
  };
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
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title || undefined}</Title>
            <Overview>{data?.results[0].overview || undefined}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {/* 0번째 영화는 배경에 만드는데 사용했으므로 제외 */}
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      // layoutId는 string이어야함
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={BoxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {/* bigMovieMatch가 존재할 때만 보여야함 */}
            {bigMovieMatch ? (
              // Box마다 unipue한 layoutId을 줘야하므로 movieId를 사용
              <motion.div
                // typescript한테 bigMovieMatch 설명해줘야함
                layoutId={bigMovieMatch.params.movieId}
                style={{
                  position: "absolute",
                  width: "40vw",
                  height: "80vh",
                  backgroundColor: "red",
                  top: 50,
                  left: 0,
                  right: 0,
                  margin: "0 auto",
                }}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
