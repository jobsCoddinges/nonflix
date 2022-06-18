import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSearch } from "../api";
import { makeImagePath } from "../utilts";

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
}

const Wrapper = styled(motion.div)`
  background-color: #141414;
  margin-top: 60px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 100px;
  column-gap: 30px;
  width: 100vw;
  padding: 0 30px;
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
const SvgList = styled(motion.div)`
  display: flex;
`;

const SvgWrapper = styled(motion.div)`
  width: 50px;
  margin-right: 10px;
  height: 50px;
  border: 1px solid white;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  cursor: pointer;
`;

const Svg = styled(motion.svg)`
  width: 30px;
  height: 30px;
  stroke: white;
  stroke-width: 10px;
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
const svgWrapperVary = {
  hover: {
    opacity: 0.5,
    transition: { type: "tween" },
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
                      <SvgList>
                        <SvgWrapper
                          variants={svgWrapperVary}
                          whileHover="hover"
                        >
                          <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                          >
                            <motion.path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
                          </Svg>
                        </SvgWrapper>
                        <SvgWrapper
                          variants={svgWrapperVary}
                          whileHover="hover"
                        >
                          <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <motion.path d="M128 447.1V223.1c0-17.67-14.33-31.1-32-31.1H32c-17.67 0-32 14.33-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64C113.7 479.1 128 465.6 128 447.1zM512 224.1c0-26.5-21.48-47.98-48-47.98h-146.5c22.77-37.91 34.52-80.88 34.52-96.02C352 56.52 333.5 32 302.5 32c-63.13 0-26.36 76.15-108.2 141.6L178 186.6C166.2 196.1 160.2 210 160.1 224c-.0234 .0234 0 0 0 0L160 384c0 15.1 7.113 29.33 19.2 38.39l34.14 25.59C241 468.8 274.7 480 309.3 480H368c26.52 0 48-21.47 48-47.98c0-3.635-.4805-7.143-1.246-10.55C434 415.2 448 397.4 448 376c0-9.148-2.697-17.61-7.139-24.88C463.1 347 480 327.5 480 304.1c0-12.5-4.893-23.78-12.72-32.32C492.2 270.1 512 249.5 512 224.1z" />
                          </Svg>
                        </SvgWrapper>
                      </SvgList>
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
