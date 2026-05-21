import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Calculator.css';

const TDEECalculator = () => {
    const { t } = useTranslation();
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(175);
    const [age, setAge] = useState(25);
    const [gender, setGender] = useState('male');
    const [activity, setActivity] = useState(1.2);
    const [result, setResult] = useState(null);
    const [meals, setMeals] = useState([]);

    const calculate = () => {
        if (!weight || !height || !age) {
            alert(t('calculator.errorMsg'));
            return;
        }

        const bmrOffset = gender === 'male' ? 5 : -161;
        const bmr = (10 * weight) + (6.25 * height) - (5 * age) + bmrOffset;
        const tdee = Math.round(bmr * activity);

        const carbs = Math.round((tdee * 0.40) / 4);
        const protein = Math.round((tdee * 0.30) / 4);
        const fat = Math.round((tdee * 0.30) / 9);

        setResult({ tdee, carbs, protein, fat });

        // Generate Meals
        const mealSuggestions = [
            { tag: t('calculator.breakfast'), name: t('calculator.meal1'), cals: Math.round(tdee * 0.25), macros: '45C / 15P / 12F' },
            { tag: t('calculator.lunch'), name: t('calculator.meal2'), cals: Math.round(tdee * 0.35), macros: '50C / 40P / 15F' },
            { tag: t('calculator.dinner'), name: t('calculator.meal3'), cals: Math.round(tdee * 0.30), macros: '10C / 35P / 20F' },
            { tag: t('calculator.snack'), name: t('calculator.meal4'), cals: Math.round(tdee * 0.10), macros: '15C / 12P / 5F' }
        ];
        setMeals(mealSuggestions);
    };

    return (
        <div className="calculator">
            <h3>{t('calculator.title')}</h3>
            <div className="input-group">
                <label>{t('calculator.weight')}</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div className="input-group">
                <label>{t('calculator.height')}</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="input-group">
                <label>{t('calculator.gender')}</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="male">{t('calculator.male')}</option>
                    <option value="female">{t('calculator.female')}</option>
                </select>
            </div>
            <div className="input-group">
                <label>{t('calculator.age')}</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="input-group">
                <label>{t('calculator.activity')}</label>
                <select value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))}>
                    <option value="1.2">{t('calculator.act1')}</option>
                    <option value="1.375">{t('calculator.act2')}</option>
                    <option value="1.55">{t('calculator.act3')}</option>
                    <option value="1.725">{t('calculator.act4')}</option>
                    <option value="1.9">{t('calculator.act5')}</option>
                </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={calculate}>{t('calculator.calcBtn')}</button>
            
            {result && (
                <div className="result-box active">
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '5px' }}>{t('calculator.maintenance')}</p>
                    <div className="result-value">{result.tdee.toLocaleString()}</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '5px' }}>{t('calculator.kcalDay')}</p>
                    
                    <div className="macro-breakdown" style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>{t('calculator.recMacros')}</p>
                        
                        <div className="macro-visuals">
                            <MacroBar label={t('calculator.carbs')} value={`${result.carbs}g`} color="var(--secondary)" percent="40%" />
                            <MacroBar label={t('calculator.protein')} value={`${result.protein}g`} color="var(--primary)" percent="30%" />
                            <MacroBar label={t('calculator.fats')} value={`${result.fat}g`} color="var(--accent)" percent="30%" />
                        </div>
                    </div>
                </div>
            )}

            {meals.length > 0 && (
                <div style={{ marginTop: '50px' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{t('calculator.samplePlan')}</h3>
                    <div className="meal-suggestions">
                        {meals.map((meal, i) => (
                            <div key={i} className="meal-card visible">
                                <span className="meal-tag">{meal.tag}</span>
                                <h4 className="meal-name">{meal.name}</h4>
                                <div className="meal-stats">
                                    <span>🔥 {meal.cals} kcal</span>
                                    <span>📊 {meal.macros}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const MacroBar = ({ label, value, color, percent }) => (
    <div className="macro-bar-container">
        <div className="macro-label">
            <span>{label}</span>
            <span>{value}</span>
        </div>
        <div className="macro-bar-bg">
            <div className="macro-bar-fill" style={{ background: color, width: percent }}></div>
        </div>
    </div>
);

export default TDEECalculator;
