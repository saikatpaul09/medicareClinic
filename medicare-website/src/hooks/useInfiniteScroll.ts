import { type RefObject, useEffect } from "react";

export const useInfiniteScroll = (
  ref: RefObject<HTMLDivElement>,
  fetchNextPage: () => void,
  hasNextPage?: boolean,
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.2,
      },
    );

    const element = ref.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, fetchNextPage, hasNextPage]);
};
