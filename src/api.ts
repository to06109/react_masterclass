const API_KEY = "4a46252518b7dc6367549254b2ec8500";
const BASE_PATH = "https://api.themoviedb.org/3";
// https://api.themoviedb.org/3/movie/now_playing?api_key=4a46252518b7dc6367549254b2ec8500&language=en-US&page=1&region=kr

// IGetMoviesResult의 result타입
interface IMovie {
  // 내가 쓸 것만 적어줌
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

// getMovies의 결과
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: [];
  total_pages: number;
  total_results: number;
}

// fetcher 함수
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
