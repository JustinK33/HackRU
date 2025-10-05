import React, { useRef, useEffect, useState } from 'react';
import './ScrollFade.css';

const ScrollFade = ({ children, direction }) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null, // relative to the viewport
                rootMargin: '0px',
                threshold: 0.1, // at least 10% of the element must be visible
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={elementRef}
            className={`scroll-fade-container ${isVisible ? 'visible' : ''} ${direction}`}
        >
            {children}
        </div>
    );
};

export default ScrollFade;