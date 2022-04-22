import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

export interface IGetMovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: IGenres[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: Date;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IGenres {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: null | string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

const API_KEY = "4a46252518b7dc6367549254b2ec8500";
const BASE_PATH = "https://api.themoviedb.org/3";
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
  display: flex;
  /* flex-direction: column; */
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  // 부모 기준 위치
  position: absolute;
  /* top: 20px; */
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
  background: linear-gradient(to top, black 40%, rgba(0, 0, 0, 0.5));
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  font-weight: bolder;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

// 카드 나올 때 뒷배경
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 100vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden; // 이미지 삐져나오는거 숨김
  background-color: rgba(0, 0, 0, 1);
`;

const BigBtn = styled(motion.button)`
  z-index: 1;
  position: absolute;
  right: 0;
  width: 4%;
  height: 200px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
`;

const btnVariants = {
  initial: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.1,
    },
  },
};

const BicCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 36px;
  position: relative;
  top: -75px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  font-size: 20px;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigDate = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 18px;
  position: relative;
  top: -80px;
`;

const BigRuntime = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 18px;
  position: relative;
  top: -80px;
`;

const BigGenres = styled.ul`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  /* font-size: 36px; */
  position: absolute;
  bottom: 10px;
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
  const { scrollY } = useViewportScroll();
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
  const onOverlayClick = () => {
    history.push("/");
  };

  // 카드에서 데이터 재활용.
  // bigMovieMatch가 존재하는 경우에 클릭한 영화 아이디와 동일한 영화정보를 data에서 꺼내 clickedMovie에 저장함
  // string 앞에 +붙이면 number됨
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  // Movie Detail
  const [movieDetail, setMovieDetail] = useState<IGetMovieDetail>();
  const getMovieDetail = () => {
    {
      clickedMovie &&
        (async () => {
          //fetcher
          const response = await fetch(
            `${BASE_PATH}/movie/${clickedMovie.id}?api_key=${API_KEY}`
          );
          const json = await response.json();
          setMovieDetail(json);
        })();
    }
  };
  useEffect(getMovieDetail, [clickedMovie]);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        // 홈 화면에서 배너 뿐만 아니라 여러 슬라이더도 보여줄것이므로 유령컴포넌트로 여러 컴포넌트 묶음
        <>
          {/* bgPhoto로 이미지의 링크를 만들어서 보냄 */}
          {/* data가 존재하지 않을 때의 fallback 만들어줘야함 */}
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title || undefined}</Title>
            <Overview>
              {data && data?.results[0].overview.length > 200
                ? `${data.results[0].overview.slice(0, 200)}...`
                : data?.results[0].overview || undefined}
            </Overview>
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
            <BigBtn
              variants={btnVariants}
              whileHover="hover"
              initial="initial"
              onClick={increaseIndex}
            >
              Next
            </BigBtn>
          </Slider>
          <AnimatePresence>
            {/* bigMovieMatch가 존재할 때만 보여야함 */}
            {bigMovieMatch ? (
              <>
                <Overlay
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={onOverlayClick}
                />
                {/* Box마다 unipue한 layoutId을 줘야하므로 movieId를 사용 */}
                <BigMovie
                  style={{
                    // 사용자가 어디 있더라도 top의 속성값은 거기가 됨
                    top: scrollY.get() + 100,
                  }}
                  // typescript한테 bigMovieMatch 설명해줘야함
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BicCover
                        // gradient -> backgroundImage 2개 넣으면 됨
                        // to top: gradient 방향 아래 ->  위로
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent),  url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <BigDate>
                          {(movieDetail?.release_date + "").split("-")[0]}
                        </BigDate>
                        <BigRuntime>
                          {movieDetail &&
                            `${Math.floor(movieDetail?.runtime / 60)}시간 ${
                              movieDetail?.runtime % 60
                            }분`}
                        </BigRuntime>
                      </div>

                      <BigOverview>
                        {clickedMovie.overview.length > 300
                          ? `${clickedMovie.overview.slice(0, 300)}...`
                          : clickedMovie.overview}
                      </BigOverview>
                      <BigGenres>
                        {`장르: ${movieDetail?.genres.map(
                          (i) => " " + i.name
                        )}`}
                      </BigGenres>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
