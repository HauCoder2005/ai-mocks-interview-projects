"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { landingSlides } from "../data/landing-slides";
import styles from "./landing.module.css";

const slideIntervalMs = 4500;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = landingSlides[activeIndex];

  const showPreviousSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? landingSlides.length - 1 : current - 1,
    );
  };

  const showNextSlide = () => {
    setActiveIndex((current) => (current + 1) % landingSlides.length);
  };

  useEffect(() => {
    const timerId = window.setInterval(showNextSlide, slideIntervalMs);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <div className={styles.sliderCard}>
      <div className={styles.sliderImageWrap}>
        <img
          alt={activeSlide.title}
          className={styles.sliderImage}
          src={activeSlide.imageUrl}
        />
        <div className={styles.sliderOverlay}>
          <span className={styles.badge}>{activeSlide.badge}</span>
          <h2>{activeSlide.title}</h2>
          <p>{activeSlide.description}</p>
          <div className={styles.previewMeta}>
            <span>20 câu</span>
            <span>Junior</span>
            <span>Backend</span>
            <span>Voice + AI</span>
          </div>
        </div>
      </div>

      <div className={styles.sliderControls}>
        <button
          aria-label="Slide trước"
          className={styles.iconButton}
          onClick={showPreviousSlide}
          type="button"
        >
          <ChevronLeft size={20} />
        </button>
        <div className={styles.sliderDots}>
          {landingSlides.map((slide, index) => (
            <button
              aria-label={`Chọn slide ${index + 1}`}
              className={`${styles.sliderDot} ${
                index === activeIndex ? styles.sliderDotActive : ""
              }`}
              key={slide.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
        <button
          aria-label="Slide tiếp theo"
          className={styles.iconButton}
          onClick={showNextSlide}
          type="button"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
