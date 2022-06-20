const API_KEY = "4eab3671cefa5712fe5d81cbe8a4fa3e";
const BASE_PATH = "https://api.themoviedb.org/3/";

export interface IMoive {
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMoive[];
  total_pages: number;
  total_results: number;
}

export interface detailMovie {
  backdrop_path: string;
  budget: number;
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  title: string;
  release_date: string;
}

export const getMoives = () => {
  return fetch(BASE_PATH + "movie/now_playing?api_key=" + API_KEY).then((res) =>
    res.json()
  );
};

export const getDetail = (movieId: string) => {
  return fetch(
    BASE_PATH + `movie/${movieId}?api_key=` + API_KEY + "&language=en-US"
  ).then((res) => res.json());
};
export const getSearch = (keyword: string) => {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=4eab3671cefa5712fe5d81cbe8a4fa3e&language=en-US&query=${keyword}&page=1&include_adult=false`
  ).then((res) => res.json());
};

export const getTv = () => {
  return fetch(
    BASE_PATH + "tv/popular?api_key=" + API_KEY + "&language=en-US&page=1"
  ).then((res) => res.json());
};

export const topRatedGet = () => {
  return fetch(
    "https://api.themoviedb.org/3/movie/top_rated?api_key=4eab3671cefa5712fe5d81cbe8a4fa3e&language=en-US&page=1"
  ).then((res) => res.json());
};

export const upcommingGet = () => {
  return fetch(
    "https://api.themoviedb.org/3/movie/upcoming?api_key=4eab3671cefa5712fe5d81cbe8a4fa3e&language=en-US&page=1"
  ).then((res) => res.json());
};
