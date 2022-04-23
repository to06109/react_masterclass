const API_KEY = "4a46252518b7dc6367549254b2ec8500";
const BASE_PATH = "https://api.themoviedb.org/3";
// https://api.themoviedb.org/3/movie/now_playing?api_key=4a46252518b7dc6367549254b2ec8500&language=en-US&page=1&region=kr

// IGetMoviesResult의 result타입
export interface IMovie {
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
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTopRatedResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// Movie Detail
export function getDetailMovies(movieId: number) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// https://api.themoviedb.org/3/movie/latest?api_key=<<api_key>>&language=en-US
export function getLatestMovies() {
  return fetch(
    `${BASE_PATH}/movie/latest?api_key=${API_KEY}&language=en-US`
  ).then((response) => response.json());
}

// https://api.themoviedb.org/3/movie/top_rated?api_key=4a46252518b7dc6367549254b2ec8500&language=en-US&page=1
export function getTopRatedMovies() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

// https://api.themoviedb.org/3/movie/upcoming?api_key=4a46252518b7dc6367549254b2ec8500&language=en-US&page=1
export function getUpComingMovies() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}
