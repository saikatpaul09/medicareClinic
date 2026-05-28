import { useState, useEffect, useCallback } from "react";
import "./carousel.css";
import { Button } from "@mui/material";
import theme from "../../theme";

export const Carousel = ({
  items,
}: {
  items: { src: string; alt: string }[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to move to the next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1,
    );
  }, [items.length]);

  // Function to move to the previous slide
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1,
    );
  }, [items.length]);

  // Optional: Auto-play functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex, nextSlide]);

  return (
    <div className="carousel-container">
      <Button
        className="prev-btn"
        onClick={prevSlide}
        variant="outlined"
        sx={{
          backgroundColor: `${theme.palette.background.paper}`,
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          minWidth: "30px",
          height: "30px",
          padding: "0",
        }}
      >
        ❮
      </Button>

      <div className="carousel-view">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="carousel-item">
              <img src={item.src} alt={item.alt} height="450px" />
            </div>
          ))}
        </div>
      </div>

      <Button
        className="next-btn"
        onClick={nextSlide}
        variant="outlined"
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          minWidth: "30px",
          height: "30px",
          padding: "0",
          backgroundColor: `${theme.palette.background.paper}`,
        }}
      >
        ❯
      </Button>
    </div>
  );
};
