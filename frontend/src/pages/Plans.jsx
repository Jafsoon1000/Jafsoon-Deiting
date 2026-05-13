import React from 'react';
import '../styles/Plans.css';

const Plans = () => {
    const dietPlans = [
        {
            id: 1,
            title: "Weight Loss Pro",
            category: "Fat Burn",
            description: "Scientifically backed calorie-deficit plan focused on high protein and moderate healthy fats.",
            features: ["Personalized Calorie Goal", "Daily Macro Breakdown", "Intermittent Fasting Guide"],
            price: "€19.99/mo",
            color: "var(--primary-glow)"
        },
        {
            id: 2,
            title: "Muscle Builder",
            category: "Hypertrophy",
            description: "Surplus-based nutrition strategy designed to maximize muscle protein synthesis and energy.",
            features: ["Pre/Post Workout Meals", "Progressive Loading Macros", "Supplement Guidance"],
            price: "€24.99/mo",
            color: "var(--accent-glow)"
        },
        {
            id: 3,
            title: "Clean Eating",
            category: "Wellness",
            description: "A balanced approach to nutrition focusing on whole foods and micronutrient density.",
            features: ["Anti-Inflammatory Foods", "Meal Prep Checklists", "Seasonal Recipes"],
            price: "€14.99/mo",
            color: "#00d2ff"
        }
    ];

    return (
        <div className="plans-page">
            <div className="plans-header">
                <h1>Explore Our <span className="text-gradient">Nutrition Plans</span></h1>
                <p>Choose the perfect roadmap to achieve your health and fitness goals.</p>
            </div>

            <div className="plans-grid">
                {dietPlans.map(plan => (
                    <div className="plan-card" key={plan.id}>
                        <div className="plan-badge">{plan.category}</div>
                        <h3>{plan.title}</h3>
                        <p className="plan-desc">{plan.description}</p>
                        <ul className="plan-features">
                            {plan.features.map((feature, index) => (
                                <li key={index}><span>✓</span> {feature}</li>
                            ))}
                        </ul>
                        <div className="plan-footer">
                            <span className="plan-price">{plan.price}</span>
                            <button className="btn btn-primary">Get Started</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;
