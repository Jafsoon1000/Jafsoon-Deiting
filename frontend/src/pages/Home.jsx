import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import TDEECalculator from '../components/TDEECalculator';
import WaterTracker from '../components/WaterTracker';

const Home = ({ theme }) => {
    return (
        <main>
            <Hero theme={theme} />
            <Features />
            <section className="demo-section" id="tracker">
                <TDEECalculator />
                <WaterTracker />
            </section>
        </main>
    );
};

export default Home;
