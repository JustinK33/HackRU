import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carousel.css';
import cheesecakeFactoryImg from '../assets/cheesecake-factory.png';
import tacoBellImg from '../assets/taco-bell.jpeg';
import pandaExpressImg from '../assets/panda-express.jpg';
import oliveGardenImg from '../assets/olive-garden.jpg';
import raisingCanesImg from '../assets/raising-canes.jpg';

// Data for the carousel. You can add more restaurants here later.
const restaurants = [
    { name: "The Cheesecake Factory", price: "$$$", type: "American", image: cheesecakeFactoryImg },
    { name: "Taco Bell", price: "$", type: "Mexican", image: tacoBellImg },
    { name: "Panda Express", price: "$$", type: "Chinese", image: pandaExpressImg },
    { name: "Olive Garden", price: "$$$", type: "Italian", image: oliveGardenImg },
    { name: "Raising Cane's Chicken Fingers", price: "$$", type: "Chicken", image: raisingCanesImg },
];

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === restaurants.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? restaurants.length - 1 : prev - 1));
    };

    const handleViewMenu = (restaurantName) => {
        navigate(`/restaurant/${encodeURIComponent(restaurantName)}`);
    };

    const currentRestaurant = restaurants[currentSlide];

    return (
        <div className="carousel-container">
            <div className="carousel-image" style={{ backgroundImage: `url(${currentRestaurant.image})` }}>
                <div className="carousel-card-overlay">
                    <div className="card-content">
                        <h2 className="restaurant-name">{currentRestaurant.name}</h2>
                        <div className="restaurant-details">
                            <span className="price-range">{currentRestaurant.price}</span>
                            <span className="food-type">{currentRestaurant.type}</span>
                        </div>
                        <button 
                            className="carousel-menu-btn"
                            onClick={() => handleViewMenu(currentRestaurant.name)}
                        >
                            View Menu
                        </button>
                    </div>
                </div>
            </div>
            <div className="carousel-controls">
                <button onClick={prevSlide} className="carousel-btn prev-btn">{'<'}</button>
                <button onClick={nextSlide} className="carousel-btn next-btn">{'>'}</button>
            </div>
        </div>
    );
};

export default Carousel;