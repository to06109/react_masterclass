import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

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

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
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
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
