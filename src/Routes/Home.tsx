import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { detailMovie, getDetail, getMoives, IGetMovieResult } from "../api";
import { makeImagePath } from "../utilts";
const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 20px;
`;

const OverView = styled.p`
  font-size: 28px;
  width: 50%;
`;
const Slider = styled.div`
  margin: 0 auto;
  width: 95%;
  position: relative;
  top: -50px;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  cursor: pointer;
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  height: 200px;
  color: red;
  font-size: 66px;
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  position: absolute;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  width: 16.2vw;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const BiggerBox = styled(motion.div)`
  position: absolute;
  width: 800px;
  height: 600px;
  background-color: ${(props) => props.theme.black.lighter};
  background-position: center;
  background-size: cover;

  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  z-index: 99;
  overflow: hidden;
  border-radius: 15px;
`;
const OverLay = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
`;
const BigImage = styled(motion.div)<{ bigbox: string }>`
  width: 100%;
  height: 400px;
  background-position: center center;
  background-size: cover;
  background-image: linear-gradient(to top, black, transparent),
    url(${(porps) => porps.bigbox});
`;

const BigTitle = styled(motion.div)`
  font-size: 34px;
  position: relative;
  bottom: 50px;
  left: 5px;
`;

const BigOverview = styled.p`
  font-size: 18px;
  padding: 0 20px;
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth,
  },
};

const offset = 6;

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      type: "tween",
      duration: 0.3,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      type: "tween",
      duration: 0.3,
    },
  },
};
const Home = () => {
  const history = useNavigate();
  const { scrollY } = useViewportScroll();
  const [biggerBox, setBiggerBox] = useState("");
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { isLoading, data: moviesData } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMoives
  );
  const { isLoading: detailLoading, data: movieDetail } = useQuery<detailMovie>(
    ["movies", bigMovieMatch?.params.movieId],
    () => getDetail(bigMovieMatch?.params.movieId!)
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (moviesData) {
      if (leaving) return;
      setLeaving(true);
      const totalMovie = moviesData.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setLeaving(false);
  };
  const onBoxClicked = (movieId: number) => {
    history(`/movies/${movieId}`);
  };
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(moviesData?.results[0].backdrop_path || "")}
          >
            <Title>{moviesData?.results[0].title}</Title>
            <OverView>{moviesData?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={index}
                transition={{ type: "tween", duration: 1 }}
              >
                {moviesData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      onClick={() => {
                        onBoxClicked(movie.id);
                        setBiggerBox(movie.backdrop_path);
                      }}
                      transition={{ type: "tween" }}
                      whileHover="hover"
                      initial="normal"
                      key={movie.id}
                      variants={BoxVariants}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      layoutId={movie.id + ""}
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
            {bigMovieMatch ? (
              <>
                {detailLoading ? (
                  "Loading..."
                ) : (
                  <BiggerBox
                    style={{ top: scrollY.get() + 100 }}
                    layoutId={bigMovieMatch.params.movieId}
                  >
                    <BigImage
                      bigbox={makeImagePath(movieDetail?.backdrop_path!)}
                    />
                    <BigTitle>{movieDetail?.title}</BigTitle>
                    <BigOverview>{movieDetail?.overview}</BigOverview>
                  </BiggerBox>
                )}

                <OverLay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => history(-1)}
                ></OverLay>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
