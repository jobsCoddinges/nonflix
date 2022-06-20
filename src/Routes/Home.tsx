import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  detailMovie,
  getDetail,
  getMoives,
  IGetMovieResult,
  topRatedGet,
  upcommingGet,
} from "../api";
import SvgList from "../Components/SvgList";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: #141414;
`;
export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(20, 20, 20, 1),
      rgba(20, 20, 20, 0),
      rgba(20, 20, 20, 1)
    ),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
export const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 20px;
`;

export const OverView = styled.p`
  font-size: 28px;
  width: 50%;
`;
const SliderWrapper = styled(motion.div)`
  position: relative;
  margin-bottom: 300px;
  width: 100%;
`;
const Slider = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
  margin-bottom: 5px;
  width: 100%;
  padding: 0 50px;
  position: absolute;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  cursor: pointer;
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  height: 200px;
  border-radius: 15px;
  box-shadow: 0 0 5px 5px black;
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

  bottom: 0;
  font-weight: bold;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const BiggerBox = styled(motion.div)`
  position: fixed;
  width: 800px;
  height: 600px;
  background-color: ${(props) => props.theme.black.lighter};
  background-position: center;
  background-size: cover;
  top: 140px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  z-index: 100;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 0 10px 3px black;
`;
const OverLay = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  z-index: 99;
  position: fixed;
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

const Bigheader = styled(motion.div)`
  display: flex;
  position: relative;
  margin-left: 20px;
  top: -20px;
  justify-content: space-between;
  padding-right: 30px;
`;

export const LeftButton = styled(motion.svg)`
  position: relative;
  right: 0px;
  top: 85px;
  background-color: transparent;
  width: 40px;
  height: 40px;
  fill: whitesmoke;
  cursor: pointer;
  z-index: 97;
  &:hover {
    fill: gray;
  }
`;
export const RightButton = styled(motion.svg)`
  position: absolute;
  right: -5px;
  top: 86px;
  background-color: transparent;
  width: 40px;
  height: 40px;
  fill: whitesmoke;
  cursor: pointer;
  z-index: 98;
  &:hover {
    fill: gray;
  }
`;
const SubTitle = styled.h1`
  position: absolute;
  top: -40px;
  left: 50px;
  font-weight: bold;
`;

const rowVariants = {
  hidden: (slideWay: boolean) => ({
    x: slideWay ? -window.innerWidth : window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (slideWay: boolean) => ({
    x: slideWay ? window.innerWidth : -window.innerWidth,
  }),
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
interface moviematch {
  params: {
    movieId: string;
  };
}
const Home = () => {
  const bigMovieMatch = useMatch("/movies/:movieId") as moviematch;
  const { isLoading: ratedLoading, data: ratedData } =
    useQuery<IGetMovieResult>("topRated", topRatedGet);
  const { isLoading, data: moviesData } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMoives
  );
  const { isLoading: upcommingLoading, data: upcommingData } =
    useQuery<IGetMovieResult>("upcomming", upcommingGet);
  const { isLoading: detailLoading, data: movieDetail } = useQuery<detailMovie>(
    ["movies", bigMovieMatch?.params.movieId],
    () => getDetail(bigMovieMatch?.params.movieId!)
  );

  const history = useNavigate();
  const [whatRowClick, setWhatRow] = useState(0);
  const [biggerBox, setBiggerBox] = useState("");
  const [nowIndex, nowSetIndex] = useState(0);
  const [nowSlideWay, nowSetSlideWay] = useState(true);
  const [nowLeaving, setNowLeaving] = useState(false);
  const [ratedIndex, setRatedIndex] = useState(0);
  const [ratedSlideWay, ratedSetSlideWay] = useState(true);
  const [ratedLeaving, ratedNowLeaving] = useState(false);
  const [upcommingIndex, setUpcommingIndex] = useState(0);
  const [upcommingSlideWay, setUpcommingSlideWay] = useState(true);
  const [upcommingLeaving, setUpcommingLeaving] = useState(false);
  const LeftincreaseIndex = (
    data: IGetMovieResult,
    leaving: boolean,
    setLeaving: (bool: boolean) => void,
    nowSetIndex: (num: any) => void,
    setSlideWay: (bool: boolean) => void
  ) => {
    if (data) {
      if (leaving) return;
      setSlideWay(true);
      setLeaving(true);
      const totalMovie = data.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      nowSetIndex((prev: number) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const RightincreaseIndex = (
    data: IGetMovieResult,
    leaving: boolean,
    setLeaving: (bool: boolean) => void,
    nowSetIndex: (num: any) => void,
    setSlideWay: (bool: boolean) => void
  ) => {
    if (data) {
      if (leaving) return;
      setSlideWay(false);
      setLeaving(true);
      const totalMovie = data.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      nowSetIndex((prev: number) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setNowLeaving(false);
  };
  const ratedToggleLeaving = () => {
    ratedNowLeaving(false);
  };
  const upcommingToggleLeaving = () => {
    setUpcommingLeaving(false);
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
            bgPhoto={makeImagePath(moviesData?.results[0].backdrop_path || "")}
          >
            <Title>{moviesData?.results[0].title}</Title>
            <OverView>{moviesData?.results[0].overview}</OverView>
          </Banner>
          <SliderWrapper>
            <Slider>
              <SubTitle>최신 영화</SubTitle>
              <LeftButton
                onClick={() => {
                  LeftincreaseIndex(
                    moviesData!,
                    nowLeaving,
                    setNowLeaving,
                    nowSetIndex,
                    nowSetSlideWay
                  );
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
              </LeftButton>
              <AnimatePresence
                custom={nowSlideWay}
                initial={false}
                onExitComplete={toggleLeaving}
              >
                <Row
                  custom={nowSlideWay}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={nowIndex}
                  transition={{ type: "tween", duration: 1 }}
                >
                  {moviesData?.results
                    .slice(1)
                    .slice(offset * nowIndex, offset * nowIndex + offset)
                    .map((movie) => (
                      <Box
                        onClick={() => {
                          onBoxClicked(movie.id);
                          setBiggerBox(movie.backdrop_path);
                          setWhatRow(1);
                        }}
                        transition={{ type: "tween" }}
                        whileHover="hover"
                        initial="normal"
                        key={movie.id + 10}
                        variants={BoxVariants}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        layoutId={movie.id + "10"}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <RightButton
                onClick={() => {
                  RightincreaseIndex(
                    moviesData!,
                    nowLeaving,
                    setNowLeaving,
                    nowSetIndex,
                    nowSetSlideWay
                  );
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
              </RightButton>
            </Slider>
            <AnimatePresence>
              {bigMovieMatch ? (
                <>
                  {detailLoading ? (
                    "Loading..."
                  ) : (
                    <BiggerBox
                      layoutId={
                        whatRowClick === 1
                          ? bigMovieMatch.params.movieId + "10"
                          : whatRowClick === 2
                          ? bigMovieMatch.params.movieId + "11"
                          : bigMovieMatch.params.movieId + "12"
                      }
                    >
                      <BigImage
                        bigbox={makeImagePath(movieDetail?.backdrop_path!)}
                      />
                      <BigTitle>{movieDetail?.title}</BigTitle>
                      <Bigheader>
                        <SvgList />
                        <p>{movieDetail?.release_date}</p>
                      </Bigheader>
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
          </SliderWrapper>
          <SliderWrapper>
            <Slider>
              <SubTitle>인기 영화</SubTitle>
              <LeftButton
                onClick={() => {
                  LeftincreaseIndex(
                    ratedData!,
                    ratedLeaving,
                    ratedNowLeaving,
                    setRatedIndex,
                    ratedSetSlideWay
                  );
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
              </LeftButton>

              <AnimatePresence
                custom={ratedSlideWay}
                initial={false}
                onExitComplete={ratedToggleLeaving}
              >
                <Row
                  custom={ratedSlideWay}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={ratedIndex}
                  transition={{ type: "tween", duration: 1 }}
                >
                  {ratedData?.results
                    .slice(1)
                    .slice(offset * ratedIndex, offset * ratedIndex + offset)
                    .map((movie) => (
                      <Box
                        onClick={() => {
                          onBoxClicked(movie.id);
                          setBiggerBox(movie.backdrop_path);
                          setWhatRow(2);
                        }}
                        transition={{ type: "tween" }}
                        whileHover="hover"
                        initial="normal"
                        key={movie.id + 100}
                        variants={BoxVariants}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        layoutId={movie.id + "11"}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <RightButton
                onClick={() => {
                  RightincreaseIndex(
                    ratedData!,
                    ratedLeaving,
                    ratedNowLeaving,
                    setRatedIndex,
                    ratedSetSlideWay
                  );
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
              </RightButton>
            </Slider>
          </SliderWrapper>
          <SliderWrapper>
            <Slider>
              <SubTitle>다가 올 영화</SubTitle>
              <LeftButton
                onClick={() =>
                  LeftincreaseIndex(
                    upcommingData!,
                    upcommingLeaving,
                    setUpcommingLeaving,
                    setUpcommingIndex,
                    setUpcommingSlideWay
                  )
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
              </LeftButton>

              <AnimatePresence
                custom={upcommingSlideWay}
                initial={false}
                onExitComplete={upcommingToggleLeaving}
              >
                <Row
                  custom={upcommingSlideWay}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={upcommingIndex}
                  transition={{ type: "tween", duration: 1 }}
                >
                  {upcommingData?.results
                    .slice(1)
                    .slice(
                      offset * upcommingIndex,
                      offset * upcommingIndex + offset
                    )
                    .map((movie) => (
                      <Box
                        onClick={() => {
                          onBoxClicked(movie.id);
                          setBiggerBox(movie.backdrop_path);
                          setWhatRow(3);
                        }}
                        transition={{ type: "tween" }}
                        whileHover="hover"
                        initial="normal"
                        key={movie.id + 1000}
                        variants={BoxVariants}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        layoutId={movie.id + "12"}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <RightButton
                onClick={() =>
                  RightincreaseIndex(
                    upcommingData!,
                    upcommingLeaving,
                    setUpcommingLeaving,
                    setUpcommingIndex,
                    setUpcommingSlideWay
                  )
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
              </RightButton>
            </Slider>
          </SliderWrapper>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
