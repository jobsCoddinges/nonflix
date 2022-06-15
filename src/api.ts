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

export const getMoives = () => {
  return fetch(BASE_PATH + "movie/now_playing?api_key=" + API_KEY).then((res) =>
    res.json()
  );
};
