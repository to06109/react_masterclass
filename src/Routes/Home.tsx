import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getLatestMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpComingMovies,
  IGetMoviesResult,
  IGetTopRatedResult,
} from "../api";
import { makeImagePath } from "../utils";
import MovieSlider from "../Components/MovieSlider";

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

// 한 번에 보여주고 싶은 영화의 수
const offset = 6;

function Home() {
  // Now Playing
  const { data: nowPlayingData, isLoading: nowPlayingLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getNowPlayingMovies);
  // Latest
  const { data: latestData, isLoading: latestLoading } = useQuery(
    ["movie", "Latest"],
    getLatestMovies
  );
  // Top Rated
  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<IGetTopRatedResult>(["movie", "topRated"], getTopRatedMovies);
  // UpComing
  const { data: upComingData, isLoading: upComingLoading } =
    useQuery<IGetMoviesResult>(["movie", "upComing"], getUpComingMovies);

  const Loading = nowPlayingLoading || latestLoading || topRatedLoading;

  return (
    <Wrapper>
      {Loading ? (
        <Loader>Loading...</Loader>
      ) : (
        // 홈 화면에서 배너 뿐만 아니라 여러 슬라이더도 보여줄것이므로 유령컴포넌트로 여러 컴포넌트 묶음
        <>
          {/* bgPhoto로 이미지의 링크를 만들어서 보냄 */}
          {/* data가 존재하지 않을 때의 fallback 만들어줘야함 */}
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title || undefined}</Title>
            <Overview>
              {nowPlayingData &&
              nowPlayingData?.results[0].overview.length > 200
                ? `${nowPlayingData.results[0].overview.slice(0, 200)}...`
                : nowPlayingData?.results[0].overview || undefined}
            </Overview>
          </Banner>

          <MovieSlider
            data={nowPlayingData?.results.slice(1)}
            isLoading={nowPlayingLoading}
            title="지금 상영중인 영화"
          />
          <MovieSlider
            data={topRatedData?.results}
            isLoading={nowPlayingLoading}
            title="오늘 한국의 TOP 10 영화"
          />
          <MovieSlider
            data={upComingData?.results}
            isLoading={upComingLoading}
            title="상영 예정작"
          />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
