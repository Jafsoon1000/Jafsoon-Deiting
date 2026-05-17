import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import TDEECalculator from '../components/TDEECalculator';
import WaterTracker from '../components/WaterTracker';

const Home = ({ theme, onOpenAuth }) => {
    return (
        <main>
            <Hero theme={theme} onOpenAuth={onOpenAuth} />
            <Features />
            <section className="demo-section" id="calculator">
                <TDEECalculator />
            </section>
            <section className="demo-section" id="tracker">
                <WaterTracker />
            </section>
        </main>
    );
};

export default Home;
