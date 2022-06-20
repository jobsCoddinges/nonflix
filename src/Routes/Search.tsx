import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSearch } from "../api";
import SvgList from "../Components/SvgList";
import { makeImagePath } from "../utils";

interface IdetailData {
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: number;
}

interface Idata {
  page: number;
  results: IdetailData[];
  total_pages: number;
  total_results: number;
}

const Wrapper = styled(motion.div)`
  background-color: #141414;
  margin-top: 60px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 100px;
  column-gap: 30px;
  width: 100vw;
  padding: 30px 30px;
`;
const Movies = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  overflow: hidden;
  &:hover {
    div {
      opacity: 1;
    }
  }
  box-shadow: 0 0 5px 3px black;
`;
const MovieImg = styled(motion.div)<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  width: 100%;
  height: 50vh;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
`;
const DetailDiv = styled(motion.div)`
  padding: 20px 10px;
  opacity: 0;
  width: 100%;
  background-color: #181818;
`;
const Title = styled(motion.h1)`
  font-size: 28px;
`;

const moviesVary = {
  hover: {
    scale: 1.1,
  },
};
const detailVary = {
  hover: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { isLoading, data } = useQuery<Idata>(["search", keyword], () =>
    getSearch(keyword!)
  );
  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.total_pages === 0 ? (
        <Wrapper>Nothing</Wrapper>
      ) : (
        <Wrapper>
          {data?.results.map((movie) => (
            <AnimatePresence>
              <Movies variants={moviesVary} whileHover="hover">
                {movie.poster_path && (
                  <>
                    <MovieImg
                      bgPhoto={makeImagePath(movie.poster_path)}
                    ></MovieImg>
                    <DetailDiv variants={detailVary} exit="exit">
                      <SvgList />
                    </DetailDiv>
                  </>
                )}
              </Movies>
            </AnimatePresence>
          ))}
        </Wrapper>
      )}
    </>
  );
};

export default Search;
