import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Dashboard.css';

const CircularProgress = ({ value, target, color, size = 80, strokeWidth = 6, label, sublabel }) => {
    const percentage = target > 0 ? Math.min(Math.round((value / target) * 100), 100) : 0;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="ring">
            <div className="ring-inner-svg" style={{ position: 'relative', width: size, height: size, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                    />
                    {/* Foreground circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                </svg>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', zIndex: 1 }}>
                    <strong style={{ fontSize: '15px', fontWeight: '700' }}>{value}</strong>
                    <small style={{ fontSize: '9px', color: '#888' }}>{sublabel}</small>
                </div>
            </div>
            <span style={{ fontSize: '12px', color: '#888' }}>{label}</span>
        </div>
    );
};

const Dashboard = ({ userEmail, userName, onSignOut, theme, onToggleTheme, onUpdateProfileName }) => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('Dashboard');

    // Profile targets and information state (persisted in localStorage)
    const [name, setName] = useState(userName || localStorage.getItem('userName') || 'Max Mustermann');
    const [goal, setGoal] = useState(localStorage.getItem('userGoal') || 'Muskelaufbau');
    const [calorieTarget, setCalorieTarget] = useState(
        parseInt(localStorage.getItem('userCalorieTarget')) || 2200
    );
    const [waterTarget, setWaterTarget] = useState(
        parseFloat(localStorage.getItem('userWaterTarget')) || 2.5
    );
    const [weightTarget, setWeightTarget] = useState(
        parseFloat(localStorage.getItem('userWeightTarget')) || 75.0
    );
    const [proteinTarget, setProteinTarget] = useState(
        parseInt(localStorage.getItem('userProteinTarget')) || 150
    );
    const [carbsTarget, setCarbsTarget] = useState(
        parseInt(localStorage.getItem('userCarbsTarget')) || 200
    );
    const [fatTarget, setFatTarget] = useState(
        parseInt(localStorage.getItem('userFatTarget')) || 75
    );
    const [currentWater, setCurrentWater] = useState(() => {
        const stored = localStorage.getItem('userCurrentWater');
        return stored !== null ? Math.max(0, parseFloat(stored) || 0) : 1.5;
    });

    const [confetti, setConfetti] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastTitle, setToastTitle] = useState('Ziel erreicht!');
    const [toastText, setToastText] = useState('Du hast dein tägliches Wasserziel geschafft!');

    // Advanced interactive feature states
    const [workouts, setWorkouts] = useState(() => {
        const stored = localStorage.getItem('userWorkouts');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { console.error(e); }
        }
        return [
            { id: 1, type: 'Laufen', duration: 30, calories: 350, time: '08:30 Uhr' },
            { id: 2, type: 'Krafttraining', duration: 45, calories: 280, time: '17:00 Uhr' }
        ];
    });

    const [isAddingWorkout, setIsAddingWorkout] = useState(false);
    const [workoutType, setWorkoutType] = useState('Laufen');
    const [workoutDuration, setWorkoutDuration] = useState('');
    const [workoutCalories, setWorkoutCalories] = useState('');
    const [workoutTime, setWorkoutTime] = useState('');

    // BMI Calculator state
    const [bmiHeight, setBmiHeight] = useState('180');
    const [bmiWeight, setBmiWeight] = useState('80');
    const [bmiResult, setBmiResult] = useState(null);
    const [bmiClass, setBmiClass] = useState('');

    // Community Feed state
    const [communityPosts, setCommunityPosts] = useState(() => {
        const stored = localStorage.getItem('userCommunityPosts');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { console.error(e); }
        }
        return [
            { id: 1, name: 'Sarah M.', avatar: 'SM', text: 'Heute 5 km in 28 Minuten gelaufen! 🏃‍♀️🔥 Der Trainingsplan für den Gewichtsverlust funktioniert super!', likes: 14, liked: false, time: 'Vor 2 Std.' },
            { id: 2, name: 'Christian K.', avatar: 'CK', text: 'Empfehle absolut das Kichererbsen-Curry aus der Rezepte-Bibliothek! Super lecker und perfekt für den Muskelaufbau. 🍛💪', likes: 8, liked: false, time: 'Vor 4 Std.' },
            { id: 3, name: 'Laura B.', avatar: 'LB', text: 'Gewichtsziel von 65 kg endlich geknackt! Danke an die tolle Jafsoon Community für die Motivation! 🎉❤️', likes: 25, liked: false, time: 'Gestern' }
        ];
    });
    const [newPostText, setNewPostText] = useState('');

    // Recipe search & filter states
    const [recipeSearch, setRecipeSearch] = useState('');
    const [recipeFilter, setRecipeFilter] = useState('Alle');

    // Settings panel toggles
    const [settingsSound, setSettingsSound] = useState(() => localStorage.getItem('settingsSound') !== 'false');
    const [settingsMetric, setSettingsMetric] = useState(() => localStorage.getItem('settingsMetric') !== 'false');
    const [settingsAlerts, setSettingsAlerts] = useState(() => localStorage.getItem('settingsAlerts') !== 'false');

    const triggerConfetti = (title = 'Ziel erreicht!', text = 'Du hast dein tägliches Wasserziel geschafft!') => {
        setToastTitle(title);
        setToastText(text);
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];
        const particles = [];
        for (let i = 0; i < 65; i++) {
            particles.push({
                id: Math.random(),
                x: Math.random() * 100,
                y: 110,
                size: Math.random() * 8 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                delay: Math.random() * 0.45,
                shape: Math.random() > 0.5 ? 'circle' : 'square'
            });
        }
        setConfetti(particles);
        setShowToast(true);
        setTimeout(() => {
            setConfetti([]);
        }, 4000);
        setTimeout(() => {
            setShowToast(false);
        }, 4500);
    };

    const handleAdjustWater = (amount) => {
        setCurrentWater((prev) => {
            const nextWater = Math.max(0, Math.round((prev + amount) * 100) / 100);
            localStorage.setItem('userCurrentWater', nextWater.toString());
            if (prev < waterTarget && nextWater >= waterTarget) {
                if (settingsSound) {
                    triggerConfetti('Ziel erreicht!', 'Du hast dein tägliches Wasserziel geschafft! 💧');
                } else {
                    setToastTitle('Ziel erreicht!');
                    setToastText('Du hast dein tägliches Wasserziel geschafft! 💧');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                }
            }
            return nextWater;
        });
    };

    const handleAddWorkoutSubmit = (e) => {
        e.preventDefault();
        const parsedDuration = parseInt(workoutDuration) || 0;
        const parsedCalories = parseInt(workoutCalories) || 0;
        if (parsedDuration <= 0 || parsedCalories <= 0) {
            alert(i18n.language === 'en' ? 'Please enter a valid duration and calories.' : 'Bitte eine gültige Dauer und Kalorienanzahl eingeben.');
            return;
        }

        const newWorkout = {
            id: Date.now(),
            type: workoutType,
            duration: parsedDuration,
            calories: parsedCalories,
            time: workoutTime.trim() || new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'
        };

        const updated = [...workouts, newWorkout];
        setWorkouts(updated);
        localStorage.setItem('userWorkouts', JSON.stringify(updated));

        // Reset inputs
        setWorkoutDuration('');
        setWorkoutCalories('');
        setWorkoutTime('');
        setIsAddingWorkout(false);

        if (settingsSound) {
            triggerConfetti('Aktivität geloggt!', `Du hast ${parsedCalories} kcal aktiv verbrannt! 🔥`);
        } else {
            setToastTitle('Aktivität geloggt!');
            setToastText(`Du hast ${parsedCalories} kcal aktiv verbrannt! 🔥`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleDeleteWorkout = (id) => {
        const updated = workouts.filter(w => w.id !== id);
        setWorkouts(updated);
        localStorage.setItem('userWorkouts', JSON.stringify(updated));
    };

    const handleAddMealFromPlan = (meal) => {
        const newMeal = {
            id: Date.now() + Math.random(),
            type: meal.type,
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat
        };
        const updated = [...meals, newMeal];
        setMeals(updated);
        localStorage.setItem('userMeals', JSON.stringify(updated));

        if (settingsSound) {
            triggerConfetti('Essen hinzugefügt!', `"${meal.name}" wurde in dein Ernährungstagebuch eingetragen. 🍳`);
        } else {
            setToastTitle('Essen hinzugefügt!');
            setToastText(`"${meal.name}" wurde in dein Ernährungstagebuch eingetragen. 🍳`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleCalculateBmi = (e) => {
        e?.preventDefault();
        const h = parseFloat(bmiHeight) / 100;
        const w = parseFloat(bmiWeight);
        if (h > 0 && w > 0) {
            const bmi = Math.round((w / (h * h)) * 10) / 10;
            setBmiResult(bmi);
            if (bmi < 18.5) setBmiClass('Untergewicht');
            else if (bmi < 25) setBmiClass('Normal');
            else if (bmi < 30) setBmiClass('Uebergewicht');
            else setBmiClass('Adipositas');
        }
    };

    const handleDeleteWeightEntry = (indexToDelete) => {
        const updated = weightHistory.filter((_, i) => i !== indexToDelete);
        setWeightHistory(updated);
        localStorage.setItem('userWeightHistory', JSON.stringify(updated));
    };

    const handleLikePost = (id) => {
        const updated = communityPosts.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    likes: p.liked ? p.likes - 1 : p.likes + 1,
                    liked: !p.liked
                };
            }
            return p;
        });
        setCommunityPosts(updated);
        localStorage.setItem('userCommunityPosts', JSON.stringify(updated));
    };

    const handleCreatePost = (e) => {
        e.preventDefault();
        if (!newPostText.trim()) return;
        const newPost = {
            id: Date.now(),
            name: name || 'Max Mustermann',
            avatar: (name || 'Max').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
            text: newPostText,
            likes: 0,
            liked: false,
            time: 'Gerade eben'
        };
        const updated = [newPost, ...communityPosts];
        setCommunityPosts(updated);
        localStorage.setItem('userCommunityPosts', JSON.stringify(updated));
        setNewPostText('');
    };

    const handleResetAllData = () => {
        if (window.confirm(i18n.language === 'en' ? 'Do you really want to delete all Jafsoon app data? This cannot be undone.' : 'Möchtest du wirklich alle Jafsoon-Appdaten löschen? Dies kann nicht rückgängig gemacht werden.')) {
            localStorage.clear();
            setName('Max Mustermann');
            setGoal('Muskelaufbau');
            setCalorieTarget(2200);
            setWaterTarget(2.5);
            setWeightTarget(75.0);
            setProteinTarget(150);
            setCarbsTarget(200);
            setFatTarget(75);
            setCurrentWater(1.5);
            setMeals([
                { id: 1, type: 'Frühstück', name: 'Haferflocken mit Beeren', calories: 450, protein: 25, carbs: 65, fat: 8 },
                { id: 2, type: 'Mittagessen', name: 'Hähnchen-Quinoa-Bowl', calories: 620, protein: 45, carbs: 55, fat: 18 },
                { id: 3, type: 'Abendessen', name: 'Gebackener Lachs', calories: 550, protein: 40, carbs: 20, fat: 32 },
                { id: 4, type: 'Snack', name: 'Apfel, Mandeln', calories: 180, protein: 15, carbs: 20, fat: 7 }
            ]);
            setWeightHistory([
                { date: '10.04', weight: 82.0 },
                { date: '17.04', weight: 81.2 },
                { date: '24.04', weight: 80.5 },
                { date: '01.05', weight: 80.0 },
                { date: '08.05', weight: 79.6 },
                { date: '15.05', weight: 79.1 },
                { date: '22.05', weight: 78.8 },
                { date: '29.05', weight: 78.5 }
            ]);
            setWorkouts([
                { id: 1, type: 'Laufen', duration: 30, calories: 350, time: '08:30 Uhr' },
                { id: 2, type: 'Krafttraining', duration: 45, calories: 280, time: '17:00 Uhr' }
            ]);
            setCommunityPosts([
                { id: 1, name: 'Sarah M.', avatar: 'SM', text: 'Heute 5 km in 28 Minuten gelaufen! 🏃‍♀️🔥 Der Trainingsplan für den Gewichtsverlust funktioniert super!', likes: 14, liked: false, time: 'Vor 2 Std.' },
                { id: 2, name: 'Christian K.', avatar: 'CK', text: 'Empfehle absolut das Kichererbsen-Curry aus der Rezepte-Bibliothek! Super lecker und perfekt für den Muskelaufbau. 🍛💪', likes: 8, liked: false, time: 'Vor 4 Std.' },
                { id: 3, name: 'Laura B.', avatar: 'LB', text: 'Gewichtsziel von 65 kg endlich geknackt! Danke an die tolle Jafsoon Community für die Motivation! 🎉❤️', likes: 25, liked: false, time: 'Gestern' }
            ]);
            setRecipeSearch('');
            setRecipeFilter('Alle');
            setBmiHeight('180');
            setBmiWeight('80');
            setBmiResult(null);
            setSettingsSound(true);
            setSettingsMetric(true);
            setSettingsAlerts(true);
            
            alert(i18n.language === 'en' ? 'All app data has been successfully reset!' : 'Alle App-Daten wurden erfolgreich zurückgesetzt!');
            setActiveTab('Dashboard');
        }
    };


    const [weightHistory, setWeightHistory] = useState(() => {
        const stored = localStorage.getItem('userWeightHistory');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error(e);
            }
        }
        return [
            { date: '10.04', weight: 82.0 },
            { date: '17.04', weight: 81.2 },
            { date: '24.04', weight: 80.5 },
            { date: '01.05', weight: 80.0 },
            { date: '08.05', weight: 79.6 },
            { date: '15.05', weight: 79.1 },
            { date: '22.05', weight: 78.8 },
            { date: '29.05', weight: 78.5 }
        ];
    });

    // Meal Tracking State and Helpers
    const [meals, setMeals] = useState(() => {
        const stored = localStorage.getItem('userMeals');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error(e);
            }
        }
        return [
            { id: 1, type: 'Frühstück', name: 'Haferflocken mit Beeren', calories: 450, protein: 25, carbs: 65, fat: 8 },
            { id: 2, type: 'Mittagessen', name: 'Hähnchen-Quinoa-Bowl', calories: 620, protein: 45, carbs: 55, fat: 18 },
            { id: 3, type: 'Abendessen', name: 'Gebackener Lachs', calories: 550, protein: 40, carbs: 20, fat: 32 },
            { id: 4, type: 'Snack', name: 'Apfel, Mandeln', calories: 180, protein: 15, carbs: 20, fat: 7 }
        ];
    });

    const [isAddingMeal, setIsAddingMeal] = useState(false);
    const [mealName, setMealName] = useState('');
    const [mealType, setMealType] = useState('Frühstück');
    const [mealCalories, setMealCalories] = useState('');
    const [mealProtein, setMealProtein] = useState('');
    const [mealCarbs, setMealCarbs] = useState('');
    const [mealFat, setMealFat] = useState('');

    const handleAddMealSubmit = (e) => {
        e.preventDefault();
        if (!mealName.trim()) {
            alert(i18n.language === 'en' ? 'Please enter a name for the meal.' : 'Bitte einen Namen für die Mahlzeit eingeben.');
            return;
        }

        const parsedCalories = parseInt(mealCalories) || 0;
        const parsedProtein = parseInt(mealProtein) || 0;
        const parsedCarbs = parseInt(mealCarbs) || 0;
        const parsedFat = parseInt(mealFat) || 0;

        const newMeal = {
            id: Date.now(),
            type: mealType,
            name: mealName,
            calories: parsedCalories,
            protein: parsedProtein,
            carbs: parsedCarbs,
            fat: parsedFat
        };

        const updatedMeals = [...meals, newMeal];
        setMeals(updatedMeals);
        localStorage.setItem('userMeals', JSON.stringify(updatedMeals));

        // Reset fields & close form
        setMealName('');
        setMealCalories('');
        setMealProtein('');
        setMealCarbs('');
        setMealFat('');
        setIsAddingMeal(false);
    };

    const handleDeleteMeal = (id) => {
        const updatedMeals = meals.filter(m => m.id !== id);
        setMeals(updatedMeals);
        localStorage.setItem('userMeals', JSON.stringify(updatedMeals));
    };

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
    const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
    const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);
    const totalBurnedCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const netCalories = Math.max(0, totalCalories - totalBurnedCalories);

    const [newWeight, setNewWeight] = useState('');
    const [newWeightDate, setNewWeightDate] = useState('');

    const handleAddWeight = (e) => {
        e?.preventDefault();
        const parsedWeight = parseFloat(newWeight);
        if (isNaN(parsedWeight) || parsedWeight <= 0) {
            alert(i18n.language === 'en' ? 'Please enter a valid weight.' : 'Bitte ein gültiges Gewicht eingeben.');
            return;
        }
        if (!newWeightDate.trim()) {
            alert(i18n.language === 'en' ? 'Please enter a date (e.g. 05.06).' : 'Bitte ein Datum eingeben (z.B. 05.06).');
            return;
        }

        const updatedHistory = [
            ...weightHistory,
            { date: newWeightDate, weight: parsedWeight }
        ];
        
        if (updatedHistory.length > 10) {
            updatedHistory.shift();
        }

        setWeightHistory(updatedHistory);
        localStorage.setItem('userWeightHistory', JSON.stringify(updatedHistory));
        setNewWeight('');
        setNewWeightDate('');
    };

    const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
    const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
    const netWeightChange = latestWeight - initialWeight;

    // SVG coordinates setup
    const svgWidth = 500;
    const svgHeight = 120;
    const paddingX = 35;
    const paddingY = 15;
    const chartWidth = svgWidth - paddingX * 2;
    const chartHeight = svgHeight - paddingY * 2;

    const weights = weightHistory.map(h => h.weight);
    const minW = weights.length > 0 ? Math.min(...weights) - 0.5 : 0;
    const maxW = weights.length > 0 ? Math.max(...weights) + 0.5 : 10;
    const wRange = maxW - minW || 1;

    const points = weightHistory.map((h, i) => {
        const x = paddingX + (i / Math.max(1, weightHistory.length - 1)) * chartWidth;
        const y = paddingY + chartHeight - ((h.weight - minW) / wRange) * chartHeight;
        return { x, y, weight: h.weight, date: h.date };
    });

    const linePathD = points.length > 0 
        ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`
        : '';
        
    const areaPathD = points.length > 0
        ? `${linePathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
        : '';

    // Profile editing states
    const [isEditing, setIsEditing] = useState(false);
    
    // Form fields temporary states
    const [tempName, setTempName] = useState(name);
    const [tempGoal, setTempGoal] = useState(goal);
    const [tempCalorieTarget, setTempCalorieTarget] = useState(calorieTarget);
    const [tempWaterTarget, setTempWaterTarget] = useState(waterTarget);
    const [tempWeightTarget, setTempWeightTarget] = useState(weightTarget);
    const [tempProteinTarget, setTempProteinTarget] = useState(proteinTarget);
    const [tempCarbsTarget, setTempCarbsTarget] = useState(carbsTarget);
    const [tempFatTarget, setTempFatTarget] = useState(fatTarget);

    useEffect(() => {
        if (userName) {
            setName(userName);
        }
    }, [userName]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleActionClick = (actionName) => {
        alert(i18n.language === 'en' ? `${actionName} feature coming soon!` : `Die Funktion für "${actionName}" ist bald verfügbar!`);
    };

    const handleEditProfileClick = () => {
        setTempName(name);
        setTempGoal(goal);
        setTempCalorieTarget(calorieTarget);
        setTempWaterTarget(waterTarget);
        setTempWeightTarget(weightTarget);
        setTempProteinTarget(proteinTarget);
        setTempCarbsTarget(carbsTarget);
        setTempFatTarget(fatTarget);
        setIsEditing(true);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        
        if (!tempName.trim()) {
            alert(i18n.language === 'en' ? 'Name cannot be empty.' : 'Der Name darf nicht leer sein.');
            return;
        }
        if (tempCalorieTarget <= 0 || tempWaterTarget <= 0 || tempWeightTarget <= 0 || tempProteinTarget <= 0 || tempCarbsTarget <= 0 || tempFatTarget <= 0) {
            alert(i18n.language === 'en' ? 'Target values must be greater than zero.' : 'Die Zielwerte müssen größer als Null sein.');
            return;
        }

        // Persist to localStorage
        localStorage.setItem('userName', tempName);
        localStorage.setItem('userGoal', tempGoal);
        localStorage.setItem('userCalorieTarget', tempCalorieTarget.toString());
        localStorage.setItem('userWaterTarget', tempWaterTarget.toString());
        localStorage.setItem('userWeightTarget', tempWeightTarget.toString());
        localStorage.setItem('userProteinTarget', tempProteinTarget.toString());
        localStorage.setItem('userCarbsTarget', tempCarbsTarget.toString());
        localStorage.setItem('userFatTarget', tempFatTarget.toString());

        // Update local state
        setName(tempName);
        setGoal(tempGoal);
        setCalorieTarget(tempCalorieTarget);
        setWaterTarget(tempWaterTarget);
        setWeightTarget(tempWeightTarget);
        setProteinTarget(tempProteinTarget);
        setCarbsTarget(tempCarbsTarget);
        setFatTarget(tempFatTarget);

        if (onUpdateProfileName) {
            onUpdateProfileName(tempName);
        }

        setIsEditing(false);
    };

    const waterPercentage = Math.min(Math.round((currentWater / waterTarget) * 100), 100);

    // Dynamic Goals calculations
    let goalProgress = 70;
    let goalText = t('dashboard.weekGoalsReached');

    if (goal === 'Gewichtsverlust') {
        const totalToLose = initialWeight - weightTarget;
        const lostSoFar = initialWeight - latestWeight;
        if (totalToLose > 0) {
            goalProgress = Math.max(0, Math.min(Math.round((lostSoFar / totalToLose) * 100), 100));
            goalText = t('dashboard.goalTextAbnehmen', { lost: lostSoFar.toFixed(1), target: totalToLose.toFixed(1), percent: goalProgress });
        } else {
            goalProgress = 100;
            goalText = t('dashboard.weightGoalReached');
        }
    } else if (goal === 'Muskelaufbau') {
        const totalToGain = weightTarget - initialWeight;
        const gainedSoFar = latestWeight - initialWeight;
        if (totalToGain > 0) {
            goalProgress = Math.max(0, Math.min(Math.round((gainedSoFar / totalToGain) * 100), 100));
            goalText = t('dashboard.goalTextZunehmen', { gained: gainedSoFar.toFixed(1), target: totalToGain.toFixed(1), percent: goalProgress });
        } else {
            goalProgress = 100;
            goalText = t('dashboard.weightGoalReached');
        }
    } else {
        const waterProg = Math.min((currentWater / waterTarget) * 100, 100);
        const calProg = calorieTarget > 0 ? Math.min((totalCalories / calorieTarget) * 100, 100) : 0;
        goalProgress = Math.round((waterProg + calProg) / 2);
        goalText = t('dashboard.weeklyHabitsProgress', { progress: goalProgress });
    }

    const achievementsList = [
        { id: 'water', icon: '💧', title: t('dashboard.trophyWaterTitle'), desc: t('dashboard.trophyWaterDesc'), unlocked: currentWater >= waterTarget },
        { id: 'calories', icon: '🔥', title: t('dashboard.trophyCalsTitle'), desc: t('dashboard.trophyCalsDesc'), unlocked: totalCalories >= 1000 },
        { id: 'workouts', icon: '🏃', title: t('dashboard.trophyWorkoutsTitle'), desc: t('dashboard.trophyWorkoutsDesc'), unlocked: workouts.length >= 1 },
        { id: 'weight', icon: '⚖️', title: t('dashboard.trophyWeightTitle'), desc: t('dashboard.trophyWeightDesc'), unlocked: weightHistory.length >= 3 },
        { id: 'gourmet', icon: '🍳', title: t('dashboard.trophyGourmetTitle'), desc: t('dashboard.trophyGourmetDesc'), unlocked: ['Frühstück', 'Mittagessen', 'Abendessen', 'Snack'].every(type => meals.some(m => m.type === type)) },
        { id: 'willpower', icon: '🏆', title: t('dashboard.trophyWillpowerTitle'), desc: t('dashboard.trophyWillpowerDesc'), unlocked: goalProgress >= 100 }
    ];

    return (
        <div className="dashboard-wrapper dark-theme-override">
            {/* Left Icon Sidebar */}
            <aside className="dashboard-sidebar-icons">
                <div className="sidebar-logo">J</div>
                <nav className="sidebar-nav">
                    <div className={`icon ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => handleTabClick('Dashboard')} title="Dashboard">📊</div>
                    <div className={`icon ${activeTab === 'Ernährungsplan' ? 'active' : ''}`} onClick={() => handleTabClick('Ernährungsplan')} title="Ernährungsplan">✅</div>
                    <div className={`icon ${activeTab === 'Fortschritt' ? 'active' : ''}`} onClick={() => handleTabClick('Fortschritt')} title="Fortschritt">🕒</div>
                    <div className={`icon ${activeTab === 'Rezepte' ? 'active' : ''}`} onClick={() => handleTabClick('Rezepte')} title="Rezepte">📈</div>
                    <div className={`icon ${activeTab === 'Community' ? 'active' : ''}`} onClick={() => handleTabClick('Community')} title="Community">👥</div>
                </nav>
                <div className="sidebar-bottom">
                    <div className={`icon ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => handleTabClick('Settings')} title="Settings">⚙️</div>
                    <div className={`profile-pic ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => handleTabClick('Profile')} style={{cursor: 'pointer'}} title="Profile">👤</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main-content">
                {/* Top Navigation */}
                <header className="dashboard-top-nav">
                    <div className="top-nav-links">
                        <span className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => handleTabClick('Dashboard')}>Dashboard</span>
                        <span className={activeTab === 'Ernährungsplan' ? 'active' : ''} onClick={() => handleTabClick('Ernährungsplan')}>Ernährungsplan</span>
                        <span className={activeTab === 'Fortschritt' ? 'active' : ''} onClick={() => handleTabClick('Fortschritt')}>Fortschritt</span>
                        <span className={activeTab === 'Rezepte' ? 'active' : ''} onClick={() => handleTabClick('Rezepte')}>Rezepte</span>
                        <span className={activeTab === 'Community' ? 'active' : ''} onClick={() => handleTabClick('Community')}>Community</span>
                    </div>
                    <div className="top-nav-profile">
                        <button onClick={onToggleTheme} title="Toggle Theme" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '0 5px', color: 'inherit' }}>
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <span>❓</span>
                        <span>🔔</span>
                        <span>{name || userName || 'Max M.'}</span>
                        <button onClick={onSignOut} className="btn-outline-small" style={{marginLeft: '15px'}}>Sign Out</button>
                    </div>
                </header>

                {activeTab === 'Dashboard' ? (
                    <>
                        {/* Header Stats */}
                        <div className="dashboard-header-stats">
                            <div>
                                <h1>{t('dashboard.title')}</h1>
                                <p>{t('dashboard.subtitle')}</p>
                            </div>
                            <div className="top-stats-right">
                                <div className="stat-pill">
                                    <span className="icon">🔥</span>
                                    <div>
                                        <strong>{totalCalories} / {calorieTarget} kcal</strong>
                                        <small>{t('dashboard.dailyNeed')}</small>
                                    </div>
                                </div>
                                <div className="stat-pill">
                                    <span className="icon">⚡</span>
                                    <div>
                                        <strong>{totalBurnedCalories} kcal</strong>
                                        <small>{t('dashboard.activeBurned')}</small>
                                    </div>
                                </div>
                                <div className="stat-pill" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span className="icon" style={{ fontSize: '24px' }}>💧</span>
                                        <div>
                                            <strong style={{ display: 'block', fontSize: '14px' }}>{t('dashboard.waterIntake')}:</strong>
                                            <span style={{ fontSize: '13px', color: 'inherit', opacity: 0.85 }}>{currentWater.toFixed(2)}L / {waterTarget}L</span>
                                            <div className="progress-mini" style={{ width: '120px' }}>
                                                <div className="fill" style={{ width: `${waterPercentage}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="water-tracker-actions" style={{ display: 'flex', gap: '5px', width: '100%', marginTop: '4px' }}>
                                        <button className="water-btn" onClick={(e) => { e.stopPropagation(); handleAdjustWater(-0.25); }} title="-250 ml">-250ml</button>
                                        <button className="water-btn" onClick={(e) => { e.stopPropagation(); handleAdjustWater(0.25); }} title="+250 ml">+250ml</button>
                                        <button className="water-btn" onClick={(e) => { e.stopPropagation(); handleAdjustWater(0.50); }} title="+500 ml">+500ml</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                {/* 3-Column Grid */}
                <div className="dashboard-grid">
                    
                    {/* Left Column */}
                    <div className="grid-column left-col">
                        <section className="dash-card">
                            <div className="card-header">
                                <h2>{t('dashboard.dailyOverview')}</h2>
                                <span>{t('dashboard.dailyOverview')} &gt;</span>
                            </div>
                            <div className="macro-rings-placeholder">
                                <CircularProgress 
                                    value={totalCalories} 
                                    target={calorieTarget} 
                                    color="#10b981" 
                                    label={t('dashboard.calories')} 
                                    sublabel={`${calorieTarget} kcal`}
                                />
                                <CircularProgress 
                                    value={totalProtein} 
                                    target={proteinTarget} 
                                    color="#3b82f6" 
                                    label={t('dashboard.proteins')} 
                                    sublabel={`${proteinTarget}g`}
                                />
                                <CircularProgress 
                                    value={totalCarbs} 
                                    target={carbsTarget} 
                                    color="#f59e0b" 
                                    label={t('dashboard.carbs')} 
                                    sublabel={`${carbsTarget}g`}
                                />
                                <CircularProgress 
                                    value={totalFat} 
                                    target={fatTarget} 
                                    color="#ef4444" 
                                    label={t('dashboard.fats')} 
                                    sublabel={`${fatTarget}g`}
                                />
                            </div>
                        </section>

                        <section className="dash-card">
                            <div className="card-header">
                                <h2>{t('dashboard.weightHistory')}</h2>
                                <span className="btn-small">Kg {i18n.language === 'en' ? 'over' : 'über'} {weightHistory.length} {t('dashboard.weeks')} &gt;</span>
                            </div>
                            <p className="subtitle">
                                Kg {i18n.language === 'en' ? 'over' : 'über'} {weightHistory.length} {t('dashboard.weeks')} 
                                <span className="highlight-green right">
                                    {latestWeight} kg ({netWeightChange >= 0 ? '+' : ''}{netWeightChange.toFixed(1)} kg)
                                </span>
                            </p>
                            <div className="chart-placeholder" style={{ height: 'auto', background: 'transparent', borderBottom: 'none', position: 'relative' }}>
                                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height={svgHeight} style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Grid Lines */}
                                    <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#2a2a2a" strokeDasharray="3,3" />
                                    <line x1={paddingX} y1={paddingY + chartHeight / 2} x2={svgWidth - paddingX} y2={paddingY + chartHeight / 2} stroke="#2a2a2a" strokeDasharray="3,3" />
                                    <line x1={paddingX} y1={paddingY + chartHeight} x2={svgWidth - paddingX} y2={paddingY + chartHeight} stroke="#2a2a2a" strokeDasharray="3,3" />
                                    
                                    {/* Fill Area */}
                                    {points.length > 0 && <path d={areaPathD} fill="url(#chartGrad)" />}
                                    
                                    {/* Stroke Line */}
                                    {points.length > 0 && (
                                        <path 
                                            d={linePathD} 
                                            fill="none" 
                                            stroke="#10b981" 
                                            strokeWidth="3" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                        />
                                    )}
                                    
                                    {/* Nodes & Hover Tooltips */}
                                    {points.map((p, i) => (
                                        <g key={i} className="chart-node-group">
                                            <circle 
                                                cx={p.x} 
                                                cy={p.y} 
                                                r="4" 
                                                fill="#10b981" 
                                                stroke="var(--card-bg, #1a1a1a)" 
                                                strokeWidth="2" 
                                                style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                                            />
                                            {/* Date Labels below */}
                                            <text 
                                                x={p.x} 
                                                y={svgHeight - 2} 
                                                fill="#6b7280" 
                                                fontSize="9" 
                                                textAnchor="middle"
                                            >
                                                {p.date}
                                            </text>
                                            {/* Value on Hover */}
                                            <text 
                                                x={p.x} 
                                                y={p.y - 8} 
                                                fill="#fff" 
                                                fontSize="9" 
                                                fontWeight="bold" 
                                                textAnchor="middle"
                                                className="chart-node-value"
                                                style={{ opacity: 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}
                                            >
                                                {p.weight}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
                            </div>
                            
                            {/* Inline weight logging form */}
                            <form onSubmit={handleAddWeight} style={{ display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center' }}>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    placeholder="kg" 
                                    className="profile-input" 
                                    style={{ padding: '8px 12px', fontSize: '13px', width: '80px', height: '36px' }}
                                    value={newWeight}
                                    onChange={(e) => setNewWeight(e.target.value)}
                                    required
                                    min="1"
                                />
                                <input 
                                    type="text" 
                                    placeholder={i18n.language === 'en' ? 'e.g. 06/05' : 'z.B. 05.06'} 
                                    className="profile-input" 
                                    style={{ padding: '8px 12px', fontSize: '13px', width: '100px', height: '36px' }}
                                    value={newWeightDate}
                                    onChange={(e) => setNewWeightDate(e.target.value)}
                                    required
                                />
                                <button 
                                    type="submit"
                                    className="water-btn" 
                                    style={{ padding: '0 15px', height: '36px', fontSize: '12px', whiteSpace: 'nowrap' }}
                                >
                                    {i18n.language === 'en' ? 'Log' : 'Eintragen'}
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Middle Column */}
                    <div className="grid-column middle-col">
                        <section className="dash-card meal-plan-card">
                            <div className="card-header">
                                <div>
                                    <h2>{t('dashboard.mealPlan')}</h2>
                                    <p>{t('dashboard.today')}: {i18n.language === 'en' ? 'Tuesday, Oct 24' : 'Dienstag, 24. Oktober'}</p>
                                </div>
                                <div className="nav-arrows">
                                    <span style={{cursor: 'pointer'}} onClick={() => handleActionClick(i18n.language === 'en' ? 'Previous Day' : 'Vorheriger Tag')}>&lt;</span>
                                    <span style={{cursor: 'pointer'}} onClick={() => handleActionClick(i18n.language === 'en' ? 'Next Day' : 'Nächster Tag')}>&gt;</span>
                                </div>
                            </div>
                            
                            <div className="meal-plan-filters">
                                <span className="active" style={{cursor: 'pointer'}}>{t('dashboard.today')}</span>
                                <span style={{cursor: 'pointer'}} onClick={() => handleActionClick(i18n.language === 'en' ? 'Select Day' : 'Tag auswählen')}>{i18n.language === 'en' ? 'Tuesday' : 'Dienstag'} ⌄</span>
                                <button className="btn-outline-small right" onClick={() => handleActionClick(t('dashboard.discoverRecipes'))}>{t('dashboard.discoverRecipes')}</button>
                            </div>

                            <div className="meals-list">
                                {meals.map((meal) => (
                                    <div key={meal.id} className="meal-card" style={{ position: 'relative' }}>
                                        <div className="meal-img placeholder-img" style={{ fontSize: '24px' }}>
                                            {meal.type === 'Frühstück' ? '🥣' : meal.type === 'Mittagessen' ? '🥗' : meal.type === 'Abendessen' ? '🐟' : '🍎'}
                                        </div>
                                        <div className="meal-info" style={{ flexGrow: 1 }}>
                                            <h3 style={{ fontSize: '15px' }}>
                                                {meal.type === 'Frühstück' ? t('calculator.breakfast') : 
                                                 meal.type === 'Mittagessen' ? t('calculator.lunch') : 
                                                 meal.type === 'Abendessen' ? t('calculator.dinner') : 
                                                 meal.type === 'Snack' ? t('calculator.snack') : meal.type}
                                            </h3>
                                            <p style={{ fontWeight: '500', color: 'inherit' }}>{meal.name}</p>
                                            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#888', marginTop: '6px' }}>
                                                <span>🔥 {meal.calories} kcal</span>
                                                <span>💪 P: {meal.protein}g</span>
                                                <span>🍞 C: {meal.carbs}g</span>
                                                <span>🥑 F: {meal.fat}g</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteMeal(meal.id)}
                                            style={{ 
                                                position: 'absolute', 
                                                top: '12px', 
                                                right: '12px', 
                                                background: 'transparent', 
                                                border: 'none', 
                                                color: '#ef4444', 
                                                cursor: 'pointer', 
                                                fontSize: '14px', 
                                                opacity: 0.5,
                                                padding: '4px'
                                            }}
                                            className="delete-meal-btn"
                                            title={i18n.language === 'en' ? 'Delete meal' : 'Mahlzeit löschen'}
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}

                                {isAddingMeal ? (
                                    <form onSubmit={handleAddMealSubmit} className="meal-card add-meal-form-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '15px', border: '1px solid #10b981' }}>
                                        <h3 style={{ margin: 0, fontSize: '15px', color: '#10b981' }}>{t('dashboard.addMeal')}</h3>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '11px', color: '#888' }}>{t('dashboard.mealType')}</label>
                                                <select 
                                                    value={mealType} 
                                                    onChange={(e) => setMealType(e.target.value)} 
                                                    className="profile-select"
                                                    style={{ padding: '6px 10px', fontSize: '13px', height: '36px' }}
                                                >
                                                    <option value="Frühstück">{t('calculator.breakfast')}</option>
                                                    <option value="Mittagessen">{t('calculator.lunch')}</option>
                                                    <option value="Abendessen">{t('calculator.dinner')}</option>
                                                    <option value="Snack">{t('calculator.snack')}</option>
                                                </select>
                                            </div>
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '11px', color: '#888' }}>{t('dashboard.name')}</label>
                                                <input 
                                                    type="text" 
                                                    placeholder={i18n.language === 'en' ? 'e.g. Scrambled eggs with toast' : 'z.B. Rührei mit Toast'} 
                                                    value={mealName} 
                                                    onChange={(e) => setMealName(e.target.value)} 
                                                    className="profile-input"
                                                    required
                                                    style={{ padding: '6px 10px', fontSize: '13px', height: '36px' }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '10px', color: '#888' }}>kcal</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="kcal" 
                                                    value={mealCalories} 
                                                    onChange={(e) => setMealCalories(e.target.value)} 
                                                    className="profile-input"
                                                    required
                                                    min="0"
                                                    style={{ padding: '6px', fontSize: '12px', height: '34px', textAlign: 'center' }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '10px', color: '#888' }}>{t('calculator.protein')} (g)</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="g" 
                                                    value={mealProtein} 
                                                    onChange={(e) => setMealProtein(e.target.value)} 
                                                    className="profile-input"
                                                    required
                                                    min="0"
                                                    style={{ padding: '6px', fontSize: '12px', height: '34px', textAlign: 'center' }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '10px', color: '#888' }}>{t('dashboard.carbs')} (g)</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="g" 
                                                    value={mealCarbs} 
                                                    onChange={(e) => setMealCarbs(e.target.value)} 
                                                    className="profile-input"
                                                    required
                                                    min="0"
                                                    style={{ padding: '6px', fontSize: '12px', height: '34px', textAlign: 'center' }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <label style={{ fontSize: '10px', color: '#888' }}>{t('dashboard.fats')} (g)</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="g" 
                                                    value={mealFat} 
                                                    onChange={(e) => setMealFat(e.target.value)} 
                                                    className="profile-input"
                                                    required
                                                    min="0"
                                                    style={{ padding: '6px', fontSize: '12px', height: '34px', textAlign: 'center' }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px', justifyContent: 'flex-end' }}>
                                            <button 
                                                type="button" 
                                                className="water-btn" 
                                                onClick={() => setIsAddingMeal(false)}
                                                style={{ background: 'transparent', borderColor: '#444', color: '#aaa', height: '32px' }}
                                            >
                                                {t('dashboard.cancel')}
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="water-btn"
                                                style={{ height: '32px' }}
                                            >
                                                {i18n.language === 'en' ? 'Add' : 'Hinzufügen'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button className="btn-add-meal" onClick={() => setIsAddingMeal(true)}>{t('dashboard.addMealBtn')}</button>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="grid-column right-col">
                        <section className="dash-card">
                            <div className="card-header" style={{ marginBottom: '12px' }}>
                                <h2>{t('dashboard.goalProgress')}</h2>
                                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '13px' }}>
                                    {goal === 'Muskelaufbau' ? t('dashboard.goalBuildMuscle') : 
                                     goal === 'Gewichtsverlust' ? t('dashboard.goalLoseWeight') : 
                                     goal === 'Gesunder Lebensstil' ? t('dashboard.goalHealthyLife') : goal}
                                </span>
                            </div>
                            <p style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#888' }}>{goalText}</p>
                            <div className="progress-bar-placeholder" style={{ height: '10px', borderRadius: '5px' }}>
                                <div className="fill" style={{ width: `${goalProgress}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '5px', transition: 'width 0.5s ease-out' }}></div>
                            </div>
                        </section>
                        
                        <section className="dash-card">
                            <div className="card-header" style={{ marginBottom: '12px' }}>
                                <h2>{t('dashboard.workouts')}</h2>
                                <span className="btn-small" style={{ cursor: 'pointer' }} onClick={() => handleTabClick('Fortschritt')}>{t('dashboard.stats')} &gt;</span>
                            </div>
                            
                            {isAddingWorkout ? (
                                <form onSubmit={handleAddWorkoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', border: '1px solid #3b82f6', borderRadius: '12px', marginBottom: '15px' }}>
                                    <h3 style={{ margin: 0, fontSize: '13px', color: '#3b82f6' }}>{t('dashboard.addWorkout')}</h3>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <label style={{ fontSize: '10px', color: '#888' }}>{t('dashboard.type')}</label>
                                            <select 
                                                value={workoutType} 
                                                onChange={(e) => setWorkoutType(e.target.value)} 
                                                className="profile-select"
                                                style={{ padding: '6px', fontSize: '12px', height: '32px' }}
                                            >
                                                <option value="Laufen">🏃 {i18n.language === 'en' ? 'Running' : 'Laufen'}</option>
                                                <option value="Krafttraining">🏋️ {i18n.language === 'en' ? 'Strength Training' : 'Krafttraining'}</option>
                                                <option value="Radfahren">🚴 {i18n.language === 'en' ? 'Cycling' : 'Radfahren'}</option>
                                                <option value="Schwimmen">🏊 {i18n.language === 'en' ? 'Swimming' : 'Schwimmen'}</option>
                                                <option value="Yoga">🧘 Yoga</option>
                                                <option value="Anderes">💪 {i18n.language === 'en' ? 'Other' : 'Anderes'}</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <label style={{ fontSize: '10px', color: '#888' }}>{t('dashboard.time')}</label>
                                            <input 
                                                type="text" 
                                                placeholder={i18n.language === 'en' ? 'e.g. 6:00 PM' : 'z.B. 18:00 Uhr'} 
                                                value={workoutTime} 
                                                onChange={(e) => setWorkoutTime(e.target.value)} 
                                                className="profile-input"
                                                style={{ padding: '6px', fontSize: '12px', height: '32px' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <label style={{ fontSize: '10px', color: '#888' }}>{t('dashboard.duration')}</label>
                                            <input 
                                                type="number" 
                                                placeholder={i18n.language === 'en' ? 'Minutes' : 'Minuten'} 
                                                value={workoutDuration} 
                                                onChange={(e) => setWorkoutDuration(e.target.value)} 
                                                className="profile-input"
                                                required
                                                min="1"
                                                style={{ padding: '6px', fontSize: '12px', height: '32px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <label style={{ fontSize: '10px', color: '#888' }}>{t('dashboard.caloriesBurned')}</label>
                                            <input 
                                                type="number" 
                                                placeholder="kcal" 
                                                value={workoutCalories} 
                                                onChange={(e) => setWorkoutCalories(e.target.value)} 
                                                className="profile-input"
                                                required
                                                min="1"
                                                style={{ padding: '6px', fontSize: '12px', height: '32px' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                                        <button type="button" className="water-btn" onClick={() => setIsAddingWorkout(false)} style={{ background: 'transparent', color: '#aaa', borderColor: '#444' }}>{t('dashboard.cancel')}</button>
                                        <button type="submit" className="water-btn" style={{ background: '#3b82f6', borderColor: '#3b82f6', color: '#fff' }}>{t('dashboard.save')}</button>
                                    </div>
                                </form>
                            ) : (
                                <button className="btn-add-meal" style={{ padding: '8px', marginBottom: '15px', borderStyle: 'dashed', borderColor: '#3b82f6', color: '#3b82f6' }} onClick={() => setIsAddingWorkout(true)}>{t('dashboard.addWorkoutBtn')}</button>
                            )}

                            <div className="workout-list-dynamic">
                                {workouts.length > 0 ? (
                                    workouts.map(w => (
                                        <div key={w.id} className="workout-item">
                                            <div className="workout-item-details">
                                                <div className="workout-item-title">
                                                    {w.type === 'Laufen' ? '🏃' : w.type === 'Krafttraining' ? '🏋️' : w.type === 'Radfahren' ? '🚴' : w.type === 'Schwimmen' ? '🏊' : w.type === 'Yoga' ? '🧘' : '💪'} {
                                                        w.type === 'Laufen' ? (i18n.language === 'en' ? 'Running' : 'Laufen') :
                                                        w.type === 'Krafttraining' ? (i18n.language === 'en' ? 'Strength Training' : 'Krafttraining') :
                                                        w.type === 'Radfahren' ? (i18n.language === 'en' ? 'Cycling' : 'Radfahren') :
                                                        w.type === 'Schwimmen' ? (i18n.language === 'en' ? 'Swimming' : 'Schwimmen') :
                                                        w.type === 'Yoga' ? 'Yoga' :
                                                        w.type === 'Anderes' ? (i18n.language === 'en' ? 'Other' : 'Anderes') : w.type
                                                    }
                                                </div>
                                                <div className="workout-item-meta">⏱️ {w.duration} {i18n.language === 'en' ? 'Min' : 'Min.'} | 🕒 {w.time}</div>
                                            </div>
                                            <div className="workout-item-calories">
                                                <span className="workout-calories-value">-{w.calories} kcal</span>
                                                <button onClick={() => handleDeleteWorkout(w.id)} className="workout-delete-btn" title={i18n.language === 'en' ? 'Delete workout' : 'Workout löschen'}>❌</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="workout-empty">{t('dashboard.workoutPlaceholder')}</div>
                                )}
                            </div>
                        </section>

                        <section className="dash-card">
                            <div className="card-header">
                                <h2>{t('dashboard.recommendation')} &gt;</h2>
                                <span className="btn-small" style={{ cursor: 'pointer' }} onClick={() => handleTabClick('Rezepte')}>{t('dashboard.allRecipes')} &gt;</span>
                            </div>
                            {(() => {
                                let recommendedRecipe = { 
                                    name: 'Veggie Burger', 
                                    calories: 450, protein: 18, carbs: 55, fat: 12, 
                                    desc: i18n.language === 'en' ? 'Crispy & healthy with a homemade chickpea patty.' : 'Knackig & gesund mit hausgemachtem Kichererbsen-Patty.', 
                                    type: 'Mittagessen', icon: '🍔' 
                                };
                                if (goal === 'Muskelaufbau') {
                                    recommendedRecipe = { 
                                        name: i18n.language === 'en' ? 'Protein Pancakes with Peanut Butter' : 'Protein-Pancakes mit Erdnussbutter', 
                                        calories: 650, protein: 35, carbs: 80, fat: 20, 
                                        desc: i18n.language === 'en' ? 'The perfect combination of protein and complex carbohydrates.' : 'Die perfekte Kombination aus Protein und komplexen Kohlenhydraten.', 
                                        type: 'Frühstück', icon: '🥞' 
                                    };
                                } else if (goal === 'Gewichtsverlust') {
                                    recommendedRecipe = { 
                                        name: i18n.language === 'en' ? 'Cod over Zucchini Noodles' : 'Kabeljau auf Zucchininudeln', 
                                        calories: 340, protein: 35, carbs: 12, fat: 16, 
                                        desc: i18n.language === 'en' ? 'Low calorie, high protein, and rich in healthy omega-3 fats.' : 'Kalorienarm, proteinreich und reich an gesunden Omega-3 Fetten.', 
                                        type: 'Abendessen', icon: '🐟' 
                                    };
                                } else if (goal === 'Gesunder Lebensstil') {
                                    recommendedRecipe = { 
                                        name: i18n.language === 'en' ? 'Quinoa Bowl with Avocado' : 'Quinoa-Bowl mit Avocado', 
                                        calories: 550, protein: 18, carbs: 65, fat: 22, 
                                        desc: i18n.language === 'en' ? 'Superfood bowl rich in healthy fats and fiber.' : 'Superfood-Bowl reich an gesunden Fetten und Ballaststoffen.', 
                                        type: 'Mittagessen', icon: '🥗' 
                                    };
                                }
                                return (
                                    <div className="recipe-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div className="recipe-img placeholder-img" style={{ fontSize: '38px', height: '90px', background: 'linear-gradient(135deg, #065f46, #022c22)' }}>
                                            {recommendedRecipe.icon}
                                        </div>
                                        <h3 style={{ fontSize: '15px', fontWeight: '800' }}>{recommendedRecipe.name}</h3>
                                        <p style={{ fontSize: '12px', margin: '0', color: '#aaa', lineHeight: '1.4' }}>{recommendedRecipe.desc}</p>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#888', margin: '4px 0' }}>
                                            <span>🔥 {recommendedRecipe.calories} kcal</span>
                                            <span>💪 P: {recommendedRecipe.protein}g</span>
                                        </div>
                                        <button className="recipe-btn-add" style={{ padding: '8px', fontSize: '12px' }} onClick={() => handleAddMealFromPlan(recommendedRecipe)}>
                                            {t('dashboard.addMealPlan')}
                                        </button>
                                    </div>
                                );
                            })()}
                        </section>
                    </div>

                </div>
                </>
                ) : activeTab === 'Profile' ? (
                    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                        <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>{isEditing ? t('dashboard.profileEdit') : t('dashboard.profileTitle')}</h2>
                        <section className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {isEditing ? (
                                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className="profile-form-grid">
                                        <div className="profile-form-group full-width">
                                            <label className="profile-label">{t('dashboard.name')}</label>
                                            <input 
                                                type="text" 
                                                className="profile-input" 
                                                value={tempName} 
                                                onChange={(e) => setTempName(e.target.value)} 
                                                required
                                            />
                                        </div>
                                        
                                        <div className="profile-form-group full-width">
                                            <label className="profile-label">{i18n.language === 'en' ? 'Current Goal' : 'Aktuelles Ziel'}</label>
                                            <select 
                                                className="profile-select" 
                                                value={tempGoal} 
                                                onChange={(e) => setTempGoal(e.target.value)}
                                            >
                                                <option value="Muskelaufbau">{t('dashboard.goalBuildMuscle')}</option>
                                                <option value="Gewichtsverlust">{t('dashboard.goalLoseWeight')}</option>
                                                <option value="Gesunder Lebensstil">{t('dashboard.goalHealthyLife')}</option>
                                            </select>
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">{i18n.language === 'en' ? 'Daily Calories (kcal)' : 'Tägliche Kalorien (kcal)'}</label>
                                            <input 
                                                type="number" 
                                                className="profile-input" 
                                                value={tempCalorieTarget} 
                                                onChange={(e) => setTempCalorieTarget(Math.max(1, parseInt(e.target.value) || 0))} 
                                                required
                                                min="1"
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">{i18n.language === 'en' ? 'Daily Water Target (L)' : 'Tägliches Wasserziel (L)'}</label>
                                            <input 
                                                type="number" 
                                                step="0.1" 
                                                className="profile-input" 
                                                value={tempWaterTarget} 
                                                onChange={(e) => setTempWaterTarget(Math.max(0.1, parseFloat(e.target.value) || 0))} 
                                                required
                                                min="0.1"
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">{i18n.language === 'en' ? 'Goal Weight (kg)' : 'Zielgewicht (kg)'}</label>
                                            <input 
                                                type="number" 
                                                step="0.1" 
                                                className="profile-input" 
                                                value={tempWeightTarget} 
                                                onChange={(e) => setTempWeightTarget(Math.max(1, parseFloat(e.target.value) || 0))} 
                                                required
                                                min="1"
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">{t('dashboard.proteins')} (g)</label>
                                            <input 
                                                type="number" 
                                                className="profile-input" 
                                                value={tempProteinTarget} 
                                                onChange={(e) => setTempProteinTarget(Math.max(1, parseInt(e.target.value) || 0))} 
                                                required
                                                min="1"
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">{t('dashboard.carbs')} (g)</label>
                                            <input 
                                                type="number" 
                                                className="profile-input" 
                                                value={tempCarbsTarget} 
                                                onChange={(e) => setTempCarbsTarget(Math.max(1, parseInt(e.target.value) || 0))} 
                                                required
                                                min="1"
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label className="profile-label">{t('dashboard.fats')} (g)</label>
                                            <input 
                                                type="number" 
                                                className="profile-input" 
                                                value={tempFatTarget} 
                                                onChange={(e) => setTempFatTarget(Math.max(1, parseInt(e.target.value) || 0))} 
                                                required
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    <div className="profile-form-actions">
                                        <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>{t('dashboard.cancel')}</button>
                                        <button type="submit" className="btn-save">{t('dashboard.save')}</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #2a2a2a' }}>
                                        <div className="profile-pic" style={{ width: '80px', height: '80px', fontSize: '40px', backgroundColor: '#10b981', color: '#fff' }}>👤</div>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{name}</h3>
                                            <p style={{ margin: 0, color: '#888' }}>{t('dashboard.premiumMember')}</p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', fontSize: '14px' }}>
                                        <strong style={{ color: '#aaa' }}>{t('dashboard.name')}:</strong>
                                        <span>{name}</span>
                                        
                                        <strong style={{ color: '#aaa' }}>Email:</strong>
                                        <span>{userEmail || 'max.mustermann@example.com'}</span>
                                        
                                        <strong style={{ color: '#aaa' }}>{t('dashboard.memberSince')}:</strong>
                                        <span>{i18n.language === 'en' ? 'October 2023' : 'Oktober 2023'}</span>
                                        
                                        <strong style={{ color: '#aaa' }}>{i18n.language === 'en' ? 'Current Goal' : 'Aktuelles Ziel'}:</strong>
                                        <span>
                                            {goal === 'Muskelaufbau' ? t('dashboard.goalBuildMuscle') : 
                                             goal === 'Gewichtsverlust' ? t('dashboard.goalLoseWeight') : 
                                             goal === 'Gesunder Lebensstil' ? t('dashboard.goalHealthyLife') : goal}
                                        </span>

                                        <strong style={{ color: '#aaa' }}>{t('dashboard.calorieGoal')}:</strong>
                                        <span>{calorieTarget} kcal / {i18n.language === 'en' ? 'day' : 'Tag'}</span>

                                        <strong style={{ color: '#aaa' }}>{t('dashboard.waterIntake')}:</strong>
                                        <span>{waterTarget} {i18n.language === 'en' ? 'Liters / day' : 'Liter / Tag'}</span>

                                        <strong style={{ color: '#aaa' }}>{i18n.language === 'en' ? 'Target Weight' : 'Zielgewicht'}:</strong>
                                        <span>{weightTarget} kg</span>

                                        <strong style={{ color: '#aaa' }}>{i18n.language === 'en' ? 'Macros Target' : 'Makros Target'}:</strong>
                                        <span>{proteinTarget}g {t('dashboard.proteins')} | {carbsTarget}g {t('dashboard.carbs')} | {fatTarget}g {t('dashboard.fats')}</span>
                                    </div>
                                    
                                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                                        <button className="btn-outline-small" style={{ padding: '10px 20px' }} onClick={handleEditProfileClick}>{t('dashboard.profileEdit')}</button>
                                        <button className="btn-outline-small" style={{ padding: '10px 20px', borderColor: '#ef4444', color: '#ef4444' }} onClick={onSignOut}>{t('dashboard.signOut')}</button>
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                ) : activeTab === 'Ernährungsplan' ? (
                    <div style={{ padding: '20px', width: '100%' }}>
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>{t('dashboard.mealPlannerTitle')}</h2>
                            <p style={{ color: '#888', margin: 0 }}>{t('dashboard.mealPlannerDesc')}: <strong>{goal === 'Muskelaufbau' ? t('dashboard.goalBuildMuscle') : goal === 'Gewichtsverlust' ? t('dashboard.goalLoseWeight') : t('dashboard.goalHealthyLife')}</strong></p>
                        </div>
                        
                        {(() => {
                            let mealPlanList = [];
                            if (goal === 'Muskelaufbau') {
                                mealPlanList = [
                                    { type: t('calculator.breakfast'), name: i18n.language === 'en' ? 'Protein Pancakes & Peanut Butter' : 'Protein-Pancakes mit Erdnussbutter & Banane', calories: 650, protein: 35, carbs: 80, fat: 20, desc: i18n.language === 'en' ? 'Rich in complex carbs and clean proteins for building muscle.' : 'Reich an komplexen Kohlenhydraten und Proteinen für den optimalen Start.', icon: '🥞' },
                                    { type: t('calculator.lunch'), name: i18n.language === 'en' ? 'Sliced Turkey with Rice & Broccoli' : 'Putengeschnetzeltes mit Vollkornreis & Brokkoli', calories: 750, protein: 55, carbs: 85, fat: 15, desc: i18n.language === 'en' ? 'Classic lean chicken or turkey sports fueling lunch.' : 'Klassische Sportler-Mahlzeit. Fettarm, eiweißreich und extrem sättigend.', icon: '🍛' },
                                    { type: t('calculator.dinner'), name: i18n.language === 'en' ? 'Beef Steak with Sweet Potato Puree' : 'Rindersteak mit Süßkartoffelpüree & Spargel', calories: 680, protein: 50, carbs: 60, fat: 22, desc: i18n.language === 'en' ? 'High-quality iron and amino acids for nighttime muscle repair.' : 'Hochwertige Proteine und Mikronährstoffe für die nächtliche Regeneration.', icon: '🥩' },
                                    { type: t('calculator.snack'), name: i18n.language === 'en' ? 'Low-fat Quark with Almonds & Berries' : 'Magerquark mit Mandeln & Beeren', calories: 320, protein: 30, carbs: 25, fat: 10, desc: i18n.language === 'en' ? 'Slow-release casein protein to feed your muscles during sleep.' : 'Langsames Casein-Protein für die kontinuierliche Muskelversorgung.', icon: '🥣' }
                                ];
                            } else if (goal === 'Gewichtsverlust') {
                                mealPlanList = [
                                    { type: t('calculator.breakfast'), name: i18n.language === 'en' ? 'Scrambled Eggs with Spinach & Tomatoes' : 'Rührei (3 Eier) mit Spinat & Tomaten', calories: 280, protein: 22, carbs: 5, fat: 18, desc: i18n.language === 'en' ? 'Very low carb and high protein to keep blood sugar stable.' : 'Kohlenhydratarm und reich an Proteinen. Hält den Insulinspiegel stabil.', icon: '🍳' },
                                    { type: t('calculator.lunch'), name: i18n.language === 'en' ? 'Grilled Chicken Breast over Mixed Salad' : 'Gegrilltes Hähnchenbrustfilet auf gemischtem Salat', calories: 380, protein: 42, carbs: 10, fat: 12, desc: i18n.language === 'en' ? 'Maximum volume and high satiety with very low calories.' : 'Maximale Sättigung bei minimaler Kaloriendichte.', icon: '🥗' },
                                    { type: t('calculator.dinner'), name: i18n.language === 'en' ? 'Baked Cod with Zucchini Noodles & Pesto' : 'Gebackener Kabeljau mit Zucchininudeln & Pesto', calories: 340, protein: 35, carbs: 12, fat: 16, desc: i18n.language === 'en' ? 'Very light fish protein with healthy herb fats.' : 'Sehr leicht verdauliches, mageres Fischprotein mit gesunden Kräuterfetten.', icon: '🐟' },
                                    { type: t('calculator.snack'), name: i18n.language === 'en' ? 'Celery Sticks with Hummus' : 'Selleriestangen mit Hummus', calories: 150, protein: 5, carbs: 15, fat: 8, desc: i18n.language === 'en' ? 'A crunchy, nutrient-dense bite for mid-day snacking.' : 'Knuspriger und gesunder Snack für zwischendurch.', icon: '🥒' }
                                ];
                            } else {
                                mealPlanList = [
                                    { type: t('calculator.breakfast'), name: i18n.language === 'en' ? 'Muesli with Greek Yogurt & Honey' : 'Müsli mit griechischem Joghurt & Honig', calories: 450, protein: 20, carbs: 55, fat: 12, desc: i18n.language === 'en' ? 'Balanced energy release and probiotics for digestive health.' : 'Ausgewogene Energie und wertvolle Probiotika für eine fitte Verdauung.', icon: '🥣' },
                                    { type: t('calculator.lunch'), name: i18n.language === 'en' ? 'Quinoa Bowl with Avocado & Chickpeas' : 'Quinoa-Bowl mit Avocado, Kichererbsen & Feta', calories: 550, protein: 18, carbs: 65, fat: 22, desc: i18n.language === 'en' ? 'Rich in healthy fats, plant protein, and high fibers.' : 'Voller gesunder Fette, pflanzlicher Proteine und wichtiger Ballaststoffe.', icon: '🥗' },
                                    { type: t('calculator.dinner'), name: i18n.language === 'en' ? 'Roasted Vegetables with Baked Tofu' : 'Ofengemüse mit gebackenem Tofu & Kürbiskernen', calories: 480, protein: 22, carbs: 40, fat: 18, desc: i18n.language === 'en' ? 'Colorful antioxidant power with delicious baked tofu.' : 'Buntes Antioxidantien-Kraftpaket mit lecker mariniertem Räuchertofu.', icon: '🥦' },
                                    { type: t('calculator.snack'), name: i18n.language === 'en' ? 'Walnuts & Pear' : 'Handvoll Walnüsse & eine reife Birne', calories: 220, protein: 5, carbs: 25, fat: 12, desc: i18n.language === 'en' ? 'Brain boosting omega-3 fatty acids snack.' : 'Fördert die Konzentration und liefert gesunde Omega-3 Fette.', icon: '🍐' }
                                ];
                            }

                            return (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    {mealPlanList.map((meal, index) => (
                                        <section key={index} className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', trackingLetter: '1px' }}>{meal.type}</span>
                                                <span style={{ fontSize: '28px' }}>{meal.icon}</span>
                                            </div>
                                            <div>
                                                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '800' }}>{meal.name}</h3>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#888', lineHeight: '1.4' }}>{meal.desc}</p>
                                            </div>
                                            <div className="recipe-macros-bar" style={{ marginTop: 'auto' }}>
                                                <div className="macro-box">
                                                    <span className="macro-box-label">{t('dashboard.calories').substring(0, 4)}</span>
                                                    <span className="macro-box-value">{meal.calories}</span>
                                                </div>
                                                <div className="macro-box">
                                                    <span className="macro-box-label">{t('dashboard.proteins').substring(0, 4)}</span>
                                                    <span className="macro-box-value">{meal.protein}g</span>
                                                </div>
                                                <div className="macro-box">
                                                    <span className="macro-box-label">{t('dashboard.carbs').substring(0, 4)}</span>
                                                    <span className="macro-box-value">{meal.carbs}g</span>
                                                </div>
                                                <div className="macro-box">
                                                    <span className="macro-box-label">{t('dashboard.fats').substring(0, 4)}</span>
                                                    <span className="macro-box-value">{meal.fat}g</span>
                                                </div>
                                            </div>
                                            <button 
                                                className="recipe-btn-add" 
                                                style={{ width: '100%', padding: '10px' }}
                                                onClick={() => handleAddMealFromPlan(meal)}
                                            >
                                                {t('dashboard.logMeal')}
                                            </button>
                                        </section>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                ) : activeTab === 'Rezepte' ? (
                    <div style={{ padding: '20px', width: '100%' }}>
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>{t('dashboard.recipesTitle')}</h2>
                            <p style={{ color: '#888', margin: 0 }}>{t('dashboard.recipesDesc')}</p>
                        </div>

                        <div className="recipe-search-container">
                            <div className="recipe-search-bar-wrapper">
                                <span className="recipe-search-icon">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder={t('dashboard.searchPlaceholder')}
                                    className="recipe-search-input"
                                    value={recipeSearch}
                                    onChange={(e) => setRecipeSearch(e.target.value)}
                                />
                            </div>
                            
                            <div className="filter-tags">
                                {[
                                    { key: 'Alle', label: t('dashboard.all') },
                                    { key: 'Proteinreich', label: t('dashboard.proteinRich') },
                                    { key: 'Low-Carb', label: t('dashboard.lowCarb') },
                                    { key: 'Vegan', label: t('dashboard.vegan') }
                                ].map(cat => (
                                    <button 
                                        key={cat.key} 
                                        className={`tag-btn ${recipeFilter === cat.key ? 'active' : ''}`}
                                        onClick={() => setRecipeFilter(cat.key)}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(() => {
                            const recipeDb = [
                                { id: 'r1', name: i18n.language === 'en' ? 'Salmon Avocado Wrap' : 'Lachs-Avocado-Wrap', category: 'Low-Carb', calories: 480, protein: 32, carbs: 12, fat: 28, prepTime: '15 Min', difficulty: i18n.language === 'en' ? 'Easy' : 'Einfach', icon: '🌯', ingredients: i18n.language === 'en' ? 'Smoked salmon, avocado, wrap, cream cheese, arugula' : 'Räucherlachs, Avocado, Vollkornwrap, Frischkäse, Rucola', desc: i18n.language === 'en' ? 'Fresh smoked salmon with creamy avocado rolled in a light wrap.' : 'Frischer Räucherlachs mit cremiger Avocado gerollt in einem leichten Wrap. Perfekt für das schnelle Mittagessen.' },
                                { id: 'r2', name: i18n.language === 'en' ? 'Chickpea Curry with Coconut Milk' : 'Kichererbsen-Curry mit Kokosmilch', category: 'Vegan', calories: 520, protein: 18, carbs: 70, fat: 14, prepTime: '25 Min', difficulty: i18n.language === 'en' ? 'Medium' : 'Mittel', icon: '🍛', ingredients: i18n.language === 'en' ? 'Chickpeas, coconut milk, spinach, curry paste, tomatoes' : 'Kichererbsen, Kokosmilch, Spinat, Currypaste, Tomaten', desc: i18n.language === 'en' ? 'Creamy vegan curry packed with fibers and plant protein.' : 'Cremiges Curry reich an pflanzlichen Ballaststoffen und Proteinen. Schmeckt hervorragend mit Vollkornreis.' },
                                { id: 'r3', name: i18n.language === 'en' ? 'Double Chocolate Protein Shake' : 'Double Chocolate Protein-Shake', category: 'Proteinreich', calories: 310, protein: 40, carbs: 15, fat: 4, prepTime: '5 Min', difficulty: i18n.language === 'en' ? 'Easy' : 'Einfach', icon: '🥤', ingredients: i18n.language === 'en' ? 'Chocolate protein powder, almond milk, banana, cocoa' : 'Schoko-Proteinpulver, Mandelmilch, Banane, Kakaopulver', desc: i18n.language === 'en' ? 'Excellent post-workout macro shake for muscle build and repair.' : 'Die absolute Post-Workout-Bombe für maximalen Muskelaufbau und Regeneration.' },
                                { id: 'r4', name: i18n.language === 'en' ? 'Chia Seeds Pudding with Berries' : 'Chia-Samen Pudding mit Waldbeeren', category: 'Vegan', calories: 240, protein: 6, carbs: 28, fat: 10, prepTime: '10 Min', difficulty: i18n.language === 'en' ? 'Easy' : 'Einfach', icon: '🍓', ingredients: i18n.language === 'en' ? 'Chia seeds, almond milk, maple syrup, raspberries, blueberries' : 'Chiasamen, Mandelmilch, Ahornsirup, Himbeeren, Heidelbeeren', desc: i18n.language === 'en' ? 'Antioxidant and omega-3 rich snack. Perfect for meal prep.' : 'Gesunder Snack voller Ballaststoffe und Antioxidantien. Ideal zum Vorbereiten (Meal Prep).' },
                                { id: 'r5', name: i18n.language === 'en' ? 'Turkey Gnocchi Vegetable Pan' : 'Puten-Gnocchi-Gemüsepfanne', category: 'Proteinreich', calories: 610, protein: 45, carbs: 65, fat: 12, prepTime: '20 Min', difficulty: i18n.language === 'en' ? 'Easy' : 'Einfach', icon: '🥘', ingredients: i18n.language === 'en' ? 'Turkey breast, gnocchi, bell peppers, zucchini, tomato sauce' : 'Putenbrust, Gnocchi, Paprika, Zucchini, Tomatensauce', desc: i18n.language === 'en' ? 'Filling athlete meal with lean turkey meat and soft gnocchi.' : 'Sättigende Sportler-Mahlzeit mit magerem Geflügelfleisch und leckeren Gnocchi.' },
                                { id: 'r6', name: i18n.language === 'en' ? 'Zucchini Lasagna with Beef Hack' : 'Zucchini-Lasagne mit Rinderhack', category: 'Low-Carb', calories: 390, protein: 28, carbs: 18, fat: 20, prepTime: '40 Min', difficulty: i18n.language === 'en' ? 'Medium' : 'Mittel', icon: '🍝', ingredients: i18n.language === 'en' ? 'Zucchini slices, minced beef, ricotta, parmesan, tomato sauce' : 'Zucchini-Scheiben, Rinderhackfleisch, Ricotta, Parmesan, Tomatensauce', desc: i18n.language === 'en' ? 'Low-carb lasagna layers using fresh zucchini slices instead of pasta sheets.' : 'Ein kohlenhydratarmer Auflaufklassiker mit saftigem Rinderhack und Zucchini anstelle von Nudelteig.' }
                            ];

                            const filtered = recipeDb.filter(r => {
                                const matchesSearch = r.name.toLowerCase().includes(recipeSearch.toLowerCase()) || 
                                                      r.ingredients.toLowerCase().includes(recipeSearch.toLowerCase());
                                const matchesCat = recipeFilter === 'Alle' || r.category === recipeFilter;
                                return matchesSearch && matchesCat;
                            });

                            return (
                                <div className="recipes-grid">
                                    {filtered.length > 0 ? (
                                        filtered.map(recipe => (
                                            <div key={recipe.id} className="recipe-card-detailed">
                                                <span className="recipe-badge-category">{recipe.category === 'Low-Carb' ? t('dashboard.lowCarb') : recipe.category === 'Proteinreich' ? t('dashboard.proteinRich') : recipe.category === 'Vegan' ? t('dashboard.vegan') : recipe.category}</span>
                                                <div className="recipe-visual-gradient">
                                                    {recipe.icon}
                                                </div>
                                                <div className="recipe-content-wrapper">
                                                    <h3 className="recipe-title-detailed">{recipe.name}</h3>
                                                    <div className="recipe-meta-pills">
                                                        <span className="recipe-meta-pill">⏱️ {recipe.prepTime}</span>
                                                        <span className="recipe-meta-pill">📊 {recipe.difficulty}</span>
                                                    </div>
                                                    <p className="recipe-ingredients-preview">
                                                        <strong>{t('dashboard.ingredients')}:</strong> {recipe.ingredients}
                                                    </p>
                                                    <p style={{ fontSize: '11px', color: '#888', margin: '0', lineHeight: '1.4' }}>
                                                        {recipe.desc}
                                                    </p>
                                                    <div className="recipe-macros-bar" style={{ margin: '8px 0' }}>
                                                        <div className="macro-box">
                                                            <span className="macro-box-label">{t('dashboard.calories').substring(0, 4)}</span>
                                                            <span className="macro-box-value">{recipe.calories}</span>
                                                        </div>
                                                        <div className="macro-box">
                                                            <span className="macro-box-label">{t('dashboard.proteins').substring(0, 4)}</span>
                                                            <span className="macro-box-value">{recipe.protein}g</span>
                                                        </div>
                                                        <div className="macro-box">
                                                            <span className="macro-box-label">{t('dashboard.carbs').substring(0, 4)}</span>
                                                            <span className="macro-box-value">{recipe.carbs}g</span>
                                                        </div>
                                                        <div className="macro-box">
                                                            <span className="macro-box-label">{t('dashboard.fats').substring(0, 4)}</span>
                                                            <span className="macro-box-value">{recipe.fat}g</span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        className="recipe-btn-add"
                                                        onClick={() => handleAddMealFromPlan({
                                                            name: recipe.name,
                                                            type: 'Mittagessen',
                                                            calories: recipe.calories,
                                                            protein: recipe.protein,
                                                            carbs: recipe.carbs,
                                                            fat: recipe.fat
                                                        })}
                                                    >
                                                        {t('dashboard.logRecipe')}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                            {t('dashboard.noRecipesFound')}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                ) : activeTab === 'Fortschritt' ? (
                    <div style={{ padding: '20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>{t('dashboard.progressTitle')}</h2>
                                <p style={{ color: '#888', margin: 0 }}>{t('dashboard.progressDesc')}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
                            {/* Left Side: BMI and History */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <section className="dash-card">
                                    <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>{t('dashboard.bmiTitle')}</h2>
                                    <div className="bmi-card-wrapper">
                                        <form onSubmit={handleCalculateBmi} className="bmi-calc-inputs">
                                            <div className="profile-form-group">
                                                <label className="profile-label">{t('dashboard.height')}</label>
                                                <input 
                                                    type="number" 
                                                    className="profile-input" 
                                                    value={bmiHeight} 
                                                    onChange={(e) => setBmiHeight(e.target.value)} 
                                                    required 
                                                    min="100" 
                                                    max="250"
                                                />
                                            </div>
                                            <div className="profile-form-group">
                                                <label className="profile-label">{t('dashboard.weight')}</label>
                                                <input 
                                                    type="number" 
                                                    step="0.1" 
                                                    className="profile-input" 
                                                    value={bmiWeight} 
                                                    onChange={(e) => setBmiWeight(e.target.value)} 
                                                    required 
                                                    min="30" 
                                                    max="250"
                                                />
                                            </div>
                                            <button type="submit" className="btn-save" style={{ marginTop: '10px' }}>{t('dashboard.calc')}</button>
                                        </form>

                                        <div className="bmi-result-display">
                                            <span style={{ fontSize: '12px', color: '#888' }}>{t('dashboard.yourBmi')}</span>
                                            <div className="bmi-val-big" style={{ color: bmiResult ? (bmiClass === 'Normal' ? '#10b981' : bmiClass === 'Uebergewicht' ? '#f59e0b' : '#ef4444') : '#fff' }}>
                                                {bmiResult || '--.-'}
                                            </div>
                                            {bmiResult && (
                                                <span className={`bmi-class-badge bmi-class-${bmiClass}`}>
                                                    {bmiClass === 'Untergewicht' ? t('dashboard.underweight') : bmiClass === 'Normal' ? t('dashboard.normal') : bmiClass === 'Uebergewicht' ? t('dashboard.overweight') : t('dashboard.obese')}
                                                </span>
                                            )}
                                            
                                            <div className="bmi-visual-meter-bg">
                                                <div 
                                                    className="bmi-visual-meter-fill" 
                                                    style={{ 
                                                        width: bmiResult ? `${Math.min(100, Math.max(0, ((bmiResult - 15) / 25) * 100))}%` : '0%',
                                                        backgroundColor: bmiClass === 'Normal' ? '#10b981' : bmiClass === 'Uebergewicht' ? '#f59e0b' : '#ef4444'
                                                    }}
                                                ></div>
                                            </div>
                                            
                                            <div className="bmi-legend-labels">
                                                <span>15 ({t('dashboard.underweight')})</span>
                                                <span>25 ({t('dashboard.overweight')})</span>
                                                <span>40 ({t('dashboard.obese')})</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="dash-card">
                                    <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>{t('dashboard.manageWeight')}</h2>
                                    <p style={{ fontSize: '11px', color: '#888', margin: '0 0 15px 0' }}>{t('dashboard.weightManageDesc')}</p>
                                    
                                    <div className="weight-logs-scroller">
                                        {weightHistory.length > 0 ? (
                                            weightHistory.map((w, index) => (
                                                <div key={index} className="weight-log-item-row">
                                                    <span className="weight-log-date">📅 {w.date}</span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <span className="weight-log-val">{w.weight} kg</span>
                                                        <button 
                                                            className="workout-delete-btn" 
                                                            onClick={() => handleDeleteWeightEntry(index)}
                                                            title={i18n.language === 'en' ? 'Delete entry' : 'Eintrag löschen'}
                                                        >
                                                            ❌
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '15px', color: '#6b7280', fontSize: '12px' }}>
                                                {t('dashboard.noWeightLogs')}
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Right Side: Habits & Achievements */}
                            <section className="dash-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <h2 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>{t('dashboard.achievementsTitle')}</h2>
                                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px 0' }}>{t('dashboard.achievementsDesc')}</p>
                                
                                <div className="achievements-grid">
                                    {achievementsList.map(trophy => (
                                        <div key={trophy.id} className={`achievement-card ${trophy.unlocked ? 'unlocked' : ''}`} title={trophy.unlocked ? t('dashboard.unlocked') : t('dashboard.locked')}>
                                            <span className="achievement-icon">{trophy.icon}</span>
                                            <span className="achievement-title">{trophy.title}</span>
                                            <span className="achievement-desc">{trophy.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                ) : activeTab === 'Community' ? (
                    <div style={{ padding: '20px', width: '100%' }}>
                        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>{t('dashboard.feedTitle')}</h2>
                            <p style={{ color: '#888', margin: 0 }}>{t('dashboard.feedDesc')}</p>
                        </div>

                        <div className="community-feed-wrapper">
                            <form onSubmit={handleCreatePost} className="post-composer-card">
                                <textarea 
                                    placeholder={t('dashboard.postPlaceholder')}
                                    className="post-composer-textarea"
                                    value={newPostText}
                                    onChange={(e) => setNewPostText(e.target.value)}
                                    required
                                />
                                <div className="post-composer-actions">
                                    <button type="submit" className="btn-post">{t('dashboard.sharePost')}</button>
                                </div>
                            </form>

                            <div className="posts-list-scroller">
                                {communityPosts.map(post => (
                                    <div key={post.id} className="community-post-card">
                                        <div className="post-user-header">
                                            <div className="post-avatar" style={{ backgroundColor: post.liked ? '#10b981' : '#3b82f6' }}>
                                                {post.avatar}
                                            </div>
                                            <div className="post-user-info">
                                                <span className="post-username">{post.name}</span>
                                                <span className="post-timestamp">⏱ {post.time === 'Gerade eben' ? t('dashboard.justNow') : (i18n.language === 'en' ? (post.time === 'Vor 2 Std.' ? '2 hrs ago' : post.time === 'Vor 4 Std.' ? '4 hrs ago' : post.time === 'Gestern' ? 'Yesterday' : post.time) : post.time)}</span>
                                            </div>
                                        </div>
                                        <p className="post-body-text">
                                            {i18n.language === 'en' ? (
                                                post.text.includes('Heute 5 km') ? 'Ran 5 km in 28 minutes today! 🏃‍♀️🔥 The weight loss training plan works great!' :
                                                post.text.includes('Empfehle absolut') ? 'Absolutely recommend the chickpea curry from the recipes library! Super delicious and perfect for muscle building. 🍛💪' :
                                                post.text.includes('Gewichtsziel von') ? 'Finally broke the weight goal of 65 kg! Thanks to the great Jafsoon community for the motivation! 🎉❤️' : post.text
                                            ) : post.text}
                                        </p>
                                        <div className="post-actions-row">
                                            <button 
                                                className={`like-action-btn ${post.liked ? 'liked' : ''}`}
                                                onClick={() => handleLikePost(post.id)}
                                            >
                                                <span>{post.liked ? '❤️' : '🤍'}</span>
                                                <span>{post.likes} {t('dashboard.likes')}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'Settings' ? (
                    <div style={{ padding: '20px', width: '100%' }}>
                        <div style={{ marginBottom: '35px', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>{t('dashboard.settingsTitle')}</h2>
                            <p style={{ color: '#888', margin: 0 }}>{t('dashboard.settingsDesc')}</p>
                        </div>

                        <div className="settings-scroller">
                            <section className="settings-card">
                                <h3 style={{ fontSize: '16px', margin: '0 0 20px 0', borderBottom: '1px solid #2a2a2a', paddingBottom: '10px' }}>🎯 {t('dashboard.targetsTitle')}</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="profile-form-group">
                                        <label className="profile-label">{t('dashboard.calorieGoal')} (kcal)</label>
                                        <input 
                                            type="number" 
                                            className="profile-input" 
                                            value={calorieTarget}
                                            onChange={(e) => {
                                                const val = Math.max(1, parseInt(e.target.value) || 0);
                                                setCalorieTarget(val);
                                                localStorage.setItem('userCalorieTarget', val.toString());
                                            }}
                                        />
                                    </div>
                                    <div className="profile-form-group">
                                        <label className="profile-label">{t('dashboard.waterIntake')} (L)</label>
                                        <input 
                                            type="number" 
                                            step="0.1"
                                            className="profile-input" 
                                            value={waterTarget}
                                            onChange={(e) => {
                                                const val = Math.max(0.1, parseFloat(e.target.value) || 0);
                                                setWaterTarget(val);
                                                localStorage.setItem('userWaterTarget', val.toString());
                                            }}
                                        />
                                    </div>
                                    <div className="profile-form-group">
                                        <label className="profile-label">{t('dashboard.proteinTarget')}</label>
                                        <input 
                                            type="number" 
                                            className="profile-input" 
                                            value={proteinTarget}
                                            onChange={(e) => {
                                                const val = Math.max(1, parseInt(e.target.value) || 0);
                                                setProteinTarget(val);
                                                localStorage.setItem('userProteinTarget', val.toString());
                                            }}
                                        />
                                    </div>
                                    <div className="profile-form-group">
                                        <label className="profile-label">{t('dashboard.carbsTarget')}</label>
                                        <input 
                                            type="number" 
                                            className="profile-input" 
                                            value={carbsTarget}
                                            onChange={(e) => {
                                                const val = Math.max(1, parseInt(e.target.value) || 0);
                                                setCarbsTarget(val);
                                                localStorage.setItem('userCarbsTarget', val.toString());
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="settings-card">
                                <h3 style={{ fontSize: '16px', margin: '0 0 20px 0', borderBottom: '1px solid #2a2a2a', paddingBottom: '10px' }}>⚙️ {t('dashboard.preferencesTitle')}</h3>
                                <div className="settings-group">
                                    <div className="settings-row">
                                        <div className="settings-info">
                                            <span className="settings-title">{t('dashboard.soundEffects')}</span>
                                            <span className="settings-description">{t('dashboard.soundDesc')}</span>
                                        </div>
                                        <label className="toggle-switch-wrapper">
                                            <input 
                                                type="checkbox" 
                                                className="toggle-switch-input" 
                                                checked={settingsSound}
                                                onChange={(e) => {
                                                    setSettingsSound(e.target.checked);
                                                    localStorage.setItem('settingsSound', e.target.checked.toString());
                                                }}
                                            />
                                            <span className="toggle-switch-slider"></span>
                                        </label>
                                    </div>

                                    <div className="settings-row">
                                        <div className="settings-info">
                                            <span className="settings-title">{t('dashboard.metricSystem')}</span>
                                            <span className="settings-description">{t('dashboard.metricDesc')}</span>
                                        </div>
                                        <label className="toggle-switch-wrapper">
                                            <input 
                                                type="checkbox" 
                                                className="toggle-switch-input" 
                                                checked={settingsMetric}
                                                onChange={(e) => {
                                                    setSettingsMetric(e.target.checked);
                                                    localStorage.setItem('settingsMetric', e.target.checked.toString());
                                                }}
                                            />
                                            <span className="toggle-switch-slider"></span>
                                        </label>
                                    </div>

                                    <div className="settings-row">
                                        <div className="settings-info">
                                            <span className="settings-title">{t('dashboard.dailyReminders')}</span>
                                            <span className="settings-description">{t('dashboard.dailyRemindersDesc')}</span>
                                        </div>
                                        <label className="toggle-switch-wrapper">
                                            <input 
                                                type="checkbox" 
                                                className="toggle-switch-input" 
                                                checked={settingsAlerts}
                                                onChange={(e) => {
                                                    setSettingsAlerts(e.target.checked);
                                                    localStorage.setItem('settingsAlerts', e.target.checked.toString());
                                                }}
                                            />
                                            <span className="toggle-switch-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <section className="settings-card" style={{ borderColor: '#ef4444' }}>
                                <h3 style={{ fontSize: '16px', margin: '0 0 10px 0', color: '#ef4444' }}>🚨 {t('dashboard.dangerZone')}</h3>
                                <p style={{ fontSize: '11px', color: '#888', margin: '0 0 20px 0' }}>{t('dashboard.dangerZoneDesc')}</p>
                                <button className="btn-danger-reset" style={{ width: '100%' }} onClick={handleResetAllData}>
                                    {t('dashboard.resetBtn')}
                                </button>
                            </section>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, height: '100%' }}>
                        <div style={{ textAlign: 'center', color: '#888' }}>
                            <h2 style={{ color: '#fff', marginBottom: '10px' }}>{activeTab}</h2>
                            <p>This section is currently under development. Please check back later!</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Confetti particles element overlay */}
            {confetti.length > 0 && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    overflow: 'hidden'
                }}>
                    {confetti.map(p => (
                        <div
                            key={p.id}
                            className="confetti-particle"
                            style={{
                                position: 'absolute',
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                                borderRadius: p.shape === 'circle' ? '50%' : '2px',
                                left: `${p.x}%`,
                                bottom: '-20px',
                                transform: `rotate(${p.rotation}deg)`,
                                animationDelay: `${p.delay}s`,
                                opacity: 0.95
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Congratulatory Celebration Toast */}
            {showToast && (
                <div className="celebration-toast" style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    animation: 'slide-in-toast 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}>
                    <span style={{ fontSize: '24px' }}>🏆</span>
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '15px' }}>{toastTitle}</div>
                        <div style={{ fontSize: '12px', fontWeight: '400', opacity: 0.95, marginTop: '2px' }}>{toastText}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
