import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getTv, IGetMovieResult } from "../api";
import { makeImagePath } from "../utils";
import {
  Banner,
  LeftButton,
  Loader,
  OverView,
  RightButton,
  Title,
} from "./Home";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #141414;
`;

interface ITvResult {
  backdrop_path: string;
  first_air_date: string;

  id: number;
  name: string;

  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

interface ITvData {
  page: number;
  results: ITvResult[];
  total_pages: number;
  total_results: number;
}
const Slider = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  position: relative;
  bottom: 80px;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
  padding: 0 50px;
  position: absolute;
  width: 100%;
`;
const SlideImg = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  width: 1;
  height: 200px;
  background-size: cover;
  background-position: center center;
  border-radius: 15px;
  box-shadow: 0 0 5px 3px black;
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

const Tv = () => {
  const [nowIndex, nowSetIndex] = useState(0);
  const { isLoading, data } = useQuery<ITvData>("Tv", getTv);
  const [exit, setExit] = useState(false);
  const [nowSlideWay, nowSetSlideWay] = useState(true);
  const [nowLeaving, setNowLeaving] = useState(false);

  const toggleLeaving = () => {
    setNowLeaving(false);
  };
  const LeftincreaseIndex = (
    data: ITvData,
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
    data: ITvData,
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
  function exitComplete() {
    setExit(!exit);
  }
  return isLoading ? (
    <Loader />
  ) : (
    <Wrapper>
      <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path!)}>
        <Title>{data?.results[0].name}</Title>
        <OverView>{data?.results[0].overview}</OverView>
      </Banner>
      <Slider>
        <LeftButton
          style={{ position: "absolute", left: "0px" }}
          onClick={() => {
            LeftincreaseIndex(
              data!,
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
          onExitComplete={() => toggleLeaving()}
        >
          <Row
            custom={nowSlideWay}
            variants={rowVariants}
            transition={{ duration: 1 }}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={nowIndex} // 여기서 key값이 필수이다 framer-motion 사용할때 key 값에 주의해라
          >
            {data?.results
              .slice(1)
              .slice(offset * nowIndex, offset * nowIndex + offset)
              .map(
                (movie) =>
                  movie.backdrop_path && (
                    <SlideImg
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path)}
                    ></SlideImg>
                  )
              )}
          </Row>
        </AnimatePresence>
        <RightButton
          style={{ x: -20 }}
          onClick={() => {
            RightincreaseIndex(
              data!,
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
    </Wrapper>
  );
};
export default Tv;
