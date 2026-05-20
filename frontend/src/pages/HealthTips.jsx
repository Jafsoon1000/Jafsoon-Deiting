import React, { useState, useEffect } from 'react';
import '../styles/HealthTips.css';

// Curated list of high-quality health and dieting tips
const STATIC_TIPS = [
    {
        id: 1,
        category: 'Nutrition',
        title: 'Prioritize Whole, Single-Ingredient Foods',
        description: 'Focus on eating minimally processed, single-ingredient foods. They supply your body with dense nutrients, stable blood sugar, and sustained energy without hidden additives.',
        icon: '🍎',
        readTime: '2 min read',
        actionStep: 'Replace one packaged snack with a piece of fresh fruit or a handful of raw nuts today.',
        likes: 124,
        bookmarked: false
    },
    {
        id: 2,
        category: 'Hydration',
        title: 'The Waking Water Habit',
        description: 'Drink a full glass of water immediately after waking up. Your body goes 7-8 hours without hydration during sleep, and water kickstarts digestion and metabolic pathways.',
        icon: '💧',
        readTime: '1 min read',
        actionStep: 'Keep a reusable water bottle or a closed glass of water on your nightstand to drink first thing in the morning.',
        likes: 89,
        bookmarked: false
    },
    {
        id: 3,
        category: 'Workout',
        title: 'Leverage Active Recovery Days',
        description: 'On rest days, engage in low-intensity movement like walking, swimming, or gentle yoga. It stimulates blood circulation, bringing oxygen and nutrients to sore muscle tissues for faster repair.',
        icon: '🏃‍♂️',
        readTime: '2 min read',
        actionStep: 'Schedule a 20-minute gentle, screen-free walk on your next non-training rest day.',
        likes: 76,
        bookmarked: false
    },
    {
        id: 4,
        category: 'Mindfulness',
        title: 'Box Breathing for Rapid Calm',
        description: 'Reduce stress hormones instantly using the box breathing technique: inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. It signals your vagus nerve to lower heart rate and cortisol.',
        icon: '🧘‍♀️',
        readTime: '2 min read',
        actionStep: 'Sit comfortably and complete 3 full rounds of box breathing right now to reset your nervous system.',
        likes: 145,
        bookmarked: false
    },
    {
        id: 5,
        category: 'Nutrition',
        title: 'Practice Mindful, Screen-Free Eating',
        description: 'Chew each bite 20-30 times and avoid looking at phones, tablets, or televisions while eating. Undistracted eating lets your brain register hormone-driven satiety signals correctly, preventing overeating.',
        icon: '🥗',
        readTime: '3 min read',
        actionStep: 'Eat your next lunch or dinner entirely screen-free, focusing fully on the textures and flavors.',
        likes: 93,
        bookmarked: false
    },
    {
        id: 6,
        category: 'Hydration',
        title: 'Rebalance with Natural Electrolytes',
        description: 'If you suffer from afternoon fatigue or muscle cramps, pure water might dilute your mineral levels. Add natural trace elements to optimize intracellular hydration.',
        icon: '🍋',
        readTime: '2 min read',
        actionStep: 'Add a fresh squeeze of lemon juice and a tiny pinch of unrefined sea salt to your mid-day water bottle.',
        likes: 67,
        bookmarked: false
    },
    {
        id: 7,
        category: 'Workout',
        title: 'Prioritize Consistency over Intensity',
        description: 'A 15-minute daily moderate workout that you stick to long-term is infinitely better for cardiovascular and metabolic health than a grueling 2-hour session that leaves you exhausted for a week.',
        icon: '💪',
        readTime: '2 min read',
        actionStep: 'Commit to just 10 minutes of active stretching or bodyweight squats today, even if your schedule is packed.',
        likes: 112,
        bookmarked: false
    },
    {
        id: 8,
        category: 'Mindfulness',
        title: 'The 20-20-20 Digital Rest Rule',
        description: 'Prevent mental exhaustion and digital eye strain by pausing your screen work every 20 minutes to look at an object at least 20 feet away for 20 seconds. It reduces central nervous system overstimulation.',
        icon: '💻',
        readTime: '1 min read',
        actionStep: 'Set a subtle alarm or desktop sticky note to remind you to gaze out the window every 20 minutes.',
        likes: 84,
        bookmarked: false
    },
    {
        id: 9,
        category: 'Nutrition',
        title: 'Boost Daily Dietary Fiber',
        description: 'Aim for a minimum of 30g of fiber daily. Soluble and insoluble fibers slow glucose absorption, stabilize blood sugar levels, nurture beneficial gut microbes, and promote long-lasting satiety.',
        icon: '🥑',
        readTime: '2 min read',
        actionStep: 'Stir a tablespoon of ground chia seeds or flaxseeds into your morning oatmeal, yogurt, or protein shake.',
        likes: 138,
        bookmarked: false
    }
];

const HealthTips = () => {
    const [tips, setTips] = useState(() => {
        // Load bookmarks and likes state from localStorage if available
        const saved = localStorage.getItem('jafsoon_health_tips');
        return saved ? JSON.parse(saved) : STATIC_TIPS;
    });

    const [dailyTip, setDailyTip] = useState(null);
    const [isDailyLoading, setIsDailyLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Save tips to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('jafsoon_health_tips', JSON.stringify(tips));
    }, [tips]);

    // Simulated API Fetch for Daily Health Tip
    const getDailyTip = async (showTransition = true) => {
        if (showTransition) {
            setIsDailyLoading(true);
        }
        
        // Simulating network latency
        await new Promise(resolve => setTimeout(resolve, 800));

        // Select a random tip to represent a daily recommendation fetched from an API
        const randomIndex = Math.floor(Math.random() * tips.length);
        const selected = tips[randomIndex];
        
        setDailyTip(selected);
        setIsDailyLoading(false);
    };

    // Load initial daily tip on mount
    useEffect(() => {
        getDailyTip(false);
    }, []);

    // Filter and search logic
    const filteredTips = tips.filter(tip => {
        const matchesCategory = selectedCategory === 'All' || tip.category === selectedCategory;
        const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              tip.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Handle Like Toggle
    const handleLike = (id, event) => {
        event.stopPropagation();
        setTips(prevTips =>
            prevTips.map(tip => {
                if (tip.id === id) {
                    const isLiked = tip.userLiked;
                    return {
                        ...tip,
                        likes: isLiked ? tip.likes - 1 : tip.likes + 1,
                        userLiked: !isLiked
                    };
                }
                return tip;
            })
        );
        
        // If the daily tip is the same as the liked tip, sync it
        if (dailyTip && dailyTip.id === id) {
            setDailyTip(prev => {
                const isLiked = prev.userLiked;
                return {
                    ...prev,
                    likes: isLiked ? prev.likes - 1 : prev.likes + 1,
                    userLiked: !isLiked
                };
            });
        }
    };

    // Handle Bookmark Toggle
    const handleBookmark = (id, event) => {
        event.stopPropagation();
        setTips(prevTips =>
            prevTips.map(tip => {
                if (tip.id === id) {
                    const nextBookmarkState = !tip.bookmarked;
                    triggerToast(nextBookmarkState ? 'Tip bookmarked successfully!' : 'Tip removed from bookmarks');
                    return { ...tip, bookmarked: nextBookmarkState };
                }
                return tip;
            })
        );

        // Sync with daily tip if matching
        if (dailyTip && dailyTip.id === id) {
            setDailyTip(prev => ({ ...prev, bookmarked: !prev.bookmarked }));
        }
    };

    // Trigger toast notification
    const triggerToast = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => {
            setSuccessMessage('');
        }, 2500);
    };

    return (
        <div className="health-tips-page">
            {successMessage && (
                <div className="toast-notification">
                    <span>✨ {successMessage}</span>
                </div>
            )}

            <div className="tips-hero">
                <span className="badge">Daily Wellness Guidance</span>
                <h1>Smart <span className="text-gradient">Health Insights</span></h1>
                <p>Nourish your mind and body with scientifically backable lifestyle tips. Form new habits, optimize hydration, and elevate your fitness journey.</p>
            </div>

            {/* Daily Tip Spotlight Section (Future API Integration Ready) */}
            <div className="daily-spotlight-section">
                <div className="spotlight-header">
                    <h2>
                        <span className="live-indicator"></span>
                        Daily Tip Spotlight
                    </h2>
                    <button 
                        className={`btn-refresh-tip ${isDailyLoading ? 'rotating' : ''}`} 
                        onClick={() => getDailyTip(true)}
                        disabled={isDailyLoading}
                        aria-label="Refresh daily tip"
                    >
                        🔄 Fetch Daily Tip
                    </button>
                </div>

                <div className="spotlight-card-wrapper">
                    {isDailyLoading ? (
                        <div className="spotlight-skeleton">
                            <div className="skeleton-icon pulse"></div>
                            <div className="skeleton-line-long pulse"></div>
                            <div className="skeleton-line-short pulse"></div>
                            <div className="skeleton-line-medium pulse"></div>
                        </div>
                    ) : dailyTip ? (
                        <div className="spotlight-card">
                            <div className="spotlight-badge-row">
                                <span className="spotlight-category-tag">{dailyTip.category}</span>
                                <span className="spotlight-read-time">{dailyTip.readTime}</span>
                            </div>
                            <div className="spotlight-main-content">
                                <span className="spotlight-icon">{dailyTip.icon}</span>
                                <div className="spotlight-text">
                                    <h3>{dailyTip.title}</h3>
                                    <p>{dailyTip.description}</p>
                                </div>
                            </div>
                            <div className="spotlight-action-box">
                                <strong>🎯 Daily Challenge:</strong> {dailyTip.actionStep}
                            </div>
                            <div className="spotlight-footer">
                                <div className="spotlight-actions">
                                    <button 
                                        className={`spotlight-btn ${dailyTip.userLiked ? 'active' : ''}`}
                                        onClick={(e) => handleLike(dailyTip.id, e)}
                                    >
                                        ❤️ {dailyTip.likes} {dailyTip.userLiked ? 'Liked' : 'Like'}
                                    </button>
                                    <button 
                                        className={`spotlight-btn ${dailyTip.bookmarked ? 'active' : ''}`}
                                        onClick={(e) => handleBookmark(dailyTip.id, e)}
                                    >
                                        🔖 {dailyTip.bookmarked ? 'Bookmarked' : 'Bookmark'}
                                    </button>
                                </div>
                                <span className="api-note">🔌 API Hook Ready</span>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="tips-controls">
                <div className="search-box-wrapper">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search tips, categories, habits..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="tips-search-input"
                    />
                    {searchQuery && (
                        <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
                    )}
                </div>

                <div className="category-filters">
                    {['All', 'Nutrition', 'Hydration', 'Workout', 'Mindfulness'].map(cat => (
                        <button
                            key={cat}
                            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tips Grid */}
            <div className="tips-grid-container">
                {filteredTips.length > 0 ? (
                    <div className="tips-grid">
                        {filteredTips.map(tip => (
                            <div 
                                key={tip.id} 
                                className={`tip-card ${tip.bookmarked ? 'card-bookmarked' : ''}`}
                            >
                                <div className="tip-card-header">
                                    <span className="tip-category">{tip.category}</span>
                                    <span className="tip-read-time">{tip.readTime}</span>
                                </div>
                                <div className="tip-card-body">
                                    <div className="tip-card-title-row">
                                        <span className="tip-icon">{tip.icon}</span>
                                        <h3>{tip.title}</h3>
                                    </div>
                                    <p className="tip-desc">{tip.description}</p>
                                    <div className="tip-action-step">
                                        <strong>Action Step:</strong> {tip.actionStep}
                                    </div>
                                </div>
                                <div className="tip-card-footer">
                                    <button 
                                        className={`tip-action-btn like-btn ${tip.userLiked ? 'liked' : ''}`}
                                        onClick={(e) => handleLike(tip.id, e)}
                                    >
                                        ❤️ {tip.likes}
                                    </button>
                                    <button 
                                        className={`tip-action-btn bookmark-btn ${tip.bookmarked ? 'bookmarked' : ''}`}
                                        onClick={(e) => handleBookmark(tip.id, e)}
                                        aria-label="Bookmark tip"
                                    >
                                        🔖 {tip.bookmarked ? 'Saved' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-tips-found">
                        <span className="no-tips-icon">🔍</span>
                        <h3>No tips found</h3>
                        <p>We couldn't find any tips matching your filters or search term. Try resetting your active category or search query.</p>
                        <button 
                            className="btn btn-outline"
                            onClick={() => {
                                setSelectedCategory('All');
                                setSearchQuery('');
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Interactive Call-To-Action (Newsletter signup mockup) */}
            <div className="tips-newsletter-cta">
                <div className="cta-glow"></div>
                <h2>Get Daily Insights Directly</h2>
                <p>Want a scientifically backed health tip delivered straight to your email every morning? Join our wellness newsletter.</p>
                <form className="cta-form" onSubmit={(e) => { e.preventDefault(); triggerToast('Subscribed successfully! Daily tips are on the way.'); e.target.reset(); }}>
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        required 
                        className="cta-input"
                    />
                    <button type="submit" className="btn btn-primary">Subscribe</button>
                </form>
            </div>
        </div>
    );
};

export default HealthTips;
