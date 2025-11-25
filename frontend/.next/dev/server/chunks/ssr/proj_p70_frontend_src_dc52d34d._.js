module.exports = [
"[project]/proj/p70/frontend/src/services/oddsApi.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "oddsApi",
    ()=>oddsApi
]);
const API_KEY = process.env.NEXT_PUBLIC_ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4';
const oddsApi = {
    /**
   * Get NBA games with betting lines
   * Fetches upcoming NBA games with moneyline, spreads, and totals
   * Cost: 3 quota (3 markets × 1 region)
   * 
   * @returns {Promise<Array>} Array of NBA games with odds
   */ async getNBAGames () {
        try {
            const sport = 'basketball_nba';
            const regions = 'us';
            const markets = 'h2h,spreads,totals';
            const oddsFormat = 'american';
            const dateFormat = 'iso';
            const url = `${BASE_URL}/sports/${sport}/odds?apiKey=${API_KEY}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}&dateFormat=${dateFormat}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            // Log quota usage from response headers
            const quotaRemaining = response.headers.get('x-requests-remaining');
            const quotaUsed = response.headers.get('x-requests-used');
            console.log(`📊 API Quota - Remaining: ${quotaRemaining}, Used: ${quotaUsed}`);
            const data = await response.json();
            // Log number of games fetched
            console.log(`🏀 NBA Games fetched: ${data.length}`);
            return data;
        } catch (error) {
            console.error('Error fetching NBA games:', error);
            throw error;
        }
    }
};
}),
"[project]/proj/p70/frontend/src/utils/predictionStorage.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Utility functions for managing predictions in localStorage
__turbopack_context__.s([
    "clearAll",
    ()=>clearAll,
    "deletePrediction",
    ()=>deletePrediction,
    "getLockedPredictions",
    ()=>getLockedPredictions,
    "getPendingPredictions",
    ()=>getPendingPredictions,
    "getPrediction",
    ()=>getPrediction,
    "getPredictions",
    ()=>getPredictions,
    "hasPrediction",
    ()=>hasPrediction,
    "lockPrediction",
    ()=>lockPrediction,
    "savePrediction",
    ()=>savePrediction,
    "updatePredictionStatus",
    ()=>updatePredictionStatus
]);
const STORAGE_KEY = 'playmaker_predictions';
const getPredictions = ()=>{
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};
const savePrediction = (prediction)=>{
    const predictions = getPredictions();
    const newPrediction = {
        ...prediction,
        id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    predictions.push(newPrediction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions));
    return newPrediction;
};
const getPendingPredictions = ()=>{
    return getPredictions().filter((p)=>p.status === 'pending');
};
const getLockedPredictions = ()=>{
    return getPredictions().filter((p)=>p.status === 'locked');
};
const hasPrediction = (eventId, betType)=>{
    const predictions = getPredictions();
    return predictions.some((p)=>p.eventId === eventId && p.betType === betType && (p.status === 'pending' || p.status === 'locked'));
};
const getPrediction = (eventId, betType)=>{
    const predictions = getPredictions();
    return predictions.find((p)=>p.eventId === eventId && p.betType === betType && p.status === 'pending');
};
const updatePredictionStatus = (predictionId, status)=>{
    const predictions = getPredictions();
    const updated = predictions.map((p)=>p.id === predictionId ? {
            ...p,
            status,
            ...status === 'locked' ? {
                lockedAt: new Date().toISOString()
            } : {}
        } : p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
const lockPrediction = (predictionId)=>{
    updatePredictionStatus(predictionId, 'locked');
};
const deletePrediction = (predictionId)=>{
    const predictions = getPredictions();
    const filtered = predictions.filter((p)=>p.id !== predictionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
const clearAll = ()=>{
    localStorage.removeItem(STORAGE_KEY);
};
}),
"[project]/proj/p70/frontend/src/app/predictions/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/proj/p70/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/proj/p70/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$services$2f$oddsApi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/proj/p70/frontend/src/services/oddsApi.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/proj/p70/frontend/src/utils/predictionStorage.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function Predictions() {
    const [games, setGames] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Interactive prediction state
    const [selectedPrediction, setSelectedPrediction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [confirmedPredictions, setConfirmedPredictions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showToast, setShowToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [toastMessage, setToastMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchGames() {
            try {
                setLoading(true);
                setError(null);
                const nbaGames = await __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$services$2f$oddsApi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["oddsApi"].getNBAGames();
                setGames(nbaGames);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching games:', err);
                setError(err.message);
                setLoading(false);
            }
        }
        fetchGames();
    }, []);
    // Load confirmed predictions from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadPredictions = ()=>{
            const pending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPendingPredictions"])();
            const locked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLockedPredictions"])();
            setConfirmedPredictions([
                ...pending,
                ...locked
            ]);
        };
        loadPredictions();
        window.addEventListener('focus', loadPredictions);
        return ()=>window.removeEventListener('focus', loadPredictions);
    }, []);
    // Show toast notification
    const displayToast = (message)=>{
        setToastMessage(message);
        setShowToast(true);
        setTimeout(()=>setShowToast(false), 3000);
    };
    // Handle odds click - select prediction
    const handleOddsClick = (game, betType, outcome, odds, point = null)=>{
        const gameTime = new Date(game.commence_time);
        const now = new Date();
        // Validation: Cannot predict on games that have already started
        if (gameTime <= now) {
            displayToast('❌ Cannot predict on games that have already started!');
            return;
        }
        // Validation: Check for duplicate predictions
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasPrediction"])(game.id, betType)) {
            const existingPred = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrediction"])(game.id, betType);
            if (existingPred && existingPred.status === 'locked') {
                displayToast('🔒 You already have a LOCKED prediction for this game!');
            } else {
                displayToast('⚠️ You already have a prediction for this bet type!');
            }
            return;
        }
        // Create prediction object
        const prediction = {
            eventId: game.id,
            homeTeam: game.home_team,
            awayTeam: game.away_team,
            betType,
            selection: outcome,
            odds,
            point,
            commenceTime: game.commence_time
        };
        setSelectedPrediction(prediction);
    };
    // Confirm and save prediction
    const handleConfirmPrediction = ()=>{
        if (!selectedPrediction) return;
        try {
            const saved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["savePrediction"])(selectedPrediction);
            setConfirmedPredictions([
                ...confirmedPredictions,
                saved
            ]);
            displayToast('✅ Prediction saved successfully!');
            setSelectedPrediction(null);
        } catch (err) {
            displayToast('❌ Failed to save prediction');
            console.error(err);
        }
    };
    // Clear current selection
    const handleClearSelection = ()=>{
        setSelectedPrediction(null);
    };
    // Check if odds button is selected
    const isSelected = (gameId, betType, outcome)=>{
        if (!selectedPrediction) return false;
        return selectedPrediction.eventId === gameId && selectedPrediction.betType === betType && selectedPrediction.selection === outcome;
    };
    // Check if odds button is already confirmed/locked
    const isLocked = (gameId, betType)=>{
        return confirmedPredictions.some((pred)=>pred.eventId === gameId && pred.betType === betType);
    };
    // Check if game has started
    const hasGameStarted = (commenceTime)=>{
        return new Date(commenceTime) <= new Date();
    };
    // Helper to get main bookmaker (DraftKings preferred, or first available)
    const getMainBookmaker = (game)=>{
        if (!game.bookmakers || game.bookmakers.length === 0) return null;
        const draftkings = game.bookmakers.find((b)=>b.key === 'draftkings');
        return draftkings || game.bookmakers[0];
    };
    // Helper to extract specific market outcomes
    const getMarketOutcomes = (bookmaker, marketKey)=>{
        if (!bookmaker) return null;
        const market = bookmaker.markets.find((m)=>m.key === marketKey);
        return market ? market.outcomes : null;
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "predictions-page",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "loading-container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "loading-spinner"
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Loading NBA Games..."
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                lineNumber: 160,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
            lineNumber: 159,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "predictions-page",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "error-container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "⚠️ Error Loading Games"
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 172,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "error-message",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 173,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        className: "retry-btn",
                        children: "Retry"
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                lineNumber: 171,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
            lineNumber: 170,
            columnNumber: 7
        }, this);
    }
    if (games.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "predictions-page",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "no-games-container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "🏀 No NBA Games Available"
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 186,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Check back later for upcoming games!"
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 187,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                lineNumber: 185,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
            lineNumber: 184,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "predictions-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "predictions-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "page-title",
                        children: "🏀 NBA Predictions"
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "header-info",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "games-count",
                                children: [
                                    games.length,
                                    " Games Available"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this),
                            confirmedPredictions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "predictions-badge",
                                children: [
                                    confirmedPredictions.length,
                                    " Active Pick",
                                    confirmedPredictions.length !== 1 ? 's' : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            selectedPrediction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "confirmation-buttons",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "confirmation-info",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: [
                                        selectedPrediction.betType === 'moneyline' ? 'Moneyline' : selectedPrediction.betType === 'spread' ? 'Spread' : 'Total',
                                        ":"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                    lineNumber: 212,
                                    columnNumber: 15
                                }, this),
                                ' ',
                                selectedPrediction.selection,
                                selectedPrediction.point && ` (${selectedPrediction.point > 0 ? '+' : ''}${selectedPrediction.point})`,
                                ' ',
                                "@ ",
                                selectedPrediction.odds > 0 ? '+' : '',
                                selectedPrediction.odds
                            ]
                        }, void 0, true, {
                            fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                            lineNumber: 211,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "confirm-btn",
                        onClick: handleConfirmPrediction,
                        children: "✓ Confirm Pick"
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "clear-btn",
                        onClick: handleClearSelection,
                        children: "✕ Clear"
                    }, void 0, false, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                lineNumber: 209,
                columnNumber: 9
            }, this),
            showToast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast-notification",
                children: toastMessage
            }, void 0, false, {
                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                lineNumber: 230,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "games-container",
                children: games.map((game)=>{
                    const bookmaker = getMainBookmaker(game);
                    const moneyline = getMarketOutcomes(bookmaker, 'h2h');
                    const spreads = getMarketOutcomes(bookmaker, 'spreads');
                    const totals = getMarketOutcomes(bookmaker, 'totals');
                    const gameTime = new Date(game.commence_time);
                    const isToday = gameTime.toDateString() === new Date().toDateString();
                    const gameStarted = hasGameStarted(game.commence_time);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `game-card ${gameStarted ? 'game-started' : ''}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "game-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "game-time",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "date",
                                                children: gameTime.toLocaleDateString()
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 251,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "time",
                                                children: gameTime.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 252,
                                                columnNumber: 19
                                            }, this),
                                            isToday && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "today-badge",
                                                children: "TODAY"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 253,
                                                columnNumber: 31
                                            }, this),
                                            gameStarted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "started-badge",
                                                children: "STARTED"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 254,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                        lineNumber: 250,
                                        columnNumber: 17
                                    }, this),
                                    bookmaker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bookmaker-badge",
                                        children: bookmaker.title
                                    }, void 0, false, {
                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                        lineNumber: 257,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                lineNumber: 249,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "teams-section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "team",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "team-name",
                                                children: game.away_team
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 266,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "team-label",
                                                children: "AWAY"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 267,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                        lineNumber: 265,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "vs-divider",
                                        children: "@"
                                    }, void 0, false, {
                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "team",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "team-name",
                                                children: game.home_team
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 271,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "team-label",
                                                children: "HOME"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 272,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                        lineNumber: 270,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                lineNumber: 264,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "markets-section",
                                children: [
                                    moneyline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "market-box",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "market-title",
                                                children: "Moneyline"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 281,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "odds-grid",
                                                children: moneyline.map((outcome)=>{
                                                    const selected = isSelected(game.id, 'moneyline', outcome.name);
                                                    const locked = isLocked(game.id, 'moneyline');
                                                    const disabled = gameStarted || locked && !selected;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `odds-btn ${selected ? 'selected' : ''} ${locked ? 'locked' : ''} ${disabled ? 'disabled' : ''}`,
                                                        onClick: ()=>handleOddsClick(game, 'moneyline', outcome.name, outcome.price),
                                                        disabled: disabled,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "odds-team",
                                                                children: outcome.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                                lineNumber: 295,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "odds-value",
                                                                children: [
                                                                    outcome.price > 0 ? '+' : '',
                                                                    outcome.price
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                                lineNumber: 296,
                                                                columnNumber: 29
                                                            }, this),
                                                            locked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "checkmark",
                                                                children: "✓"
                                                            }, void 0, false, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                                lineNumber: 299,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, outcome.name, true, {
                                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                        lineNumber: 289,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 282,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                        lineNumber: 280,
                                        columnNumber: 19
                                    }, this),
                                    spreads && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "market-box",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "market-title",
                                                children: "Spread"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 310,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "odds-grid",
                                                children: spreads.map((outcome)=>{
                                                    const selected = isSelected(game.id, 'spread', outcome.name);
                                                    const locked = isLocked(game.id, 'spread');
                                                    const disabled = gameStarted || locked && !selected;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `odds-btn ${selected ? 'selected' : ''} ${locked ? 'locked' : ''} ${disabled ? 'disabled' : ''}`,
                                                        onClick: ()=>handleOddsClick(game, 'spread', outcome.name, outcome.price, outcome.point),
                                                        disabled: disabled,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "odds-team",
                                                                children: outcome.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                                lineNumber: 324,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "odds-value",
                                                                children: [
                                                                    outcome.point > 0 ? '+' : '',
                                                                    outcome.point,
                                                                    " (",
                                                                    outcome.price > 0 ? '+' : '',
                                                                    outcome.price,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                                lineNumber: 325,
                                                                columnNumber: 29
                                                            }, this),
                                                            locked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "checkmark",
                                                                children: "✓"
                                                            }, void 0, false, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                                lineNumber: 328,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, outcome.name, true, {
                                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                        lineNumber: 318,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 311,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                        lineNumber: 309,
                                        columnNumber: 19
                                    }, this),
                                    totals && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "market-box",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "market-title",
                                                children: "Total Points"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 339,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "odds-grid",
                                                children: totals.map((outcome)=>{
                                                    const selected = isSelected(game.id, 'total', outcome.name);
                                                    const locked = isLocked(game.id, 'total');
                                                    const disabled = gameStarted || locked && !selected;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `odds-btn ${selected ? 'selected' : ''} ${locked ? 'locked' : ''} ${disabled ? 'disabled' : ''}`,
                                                        onClick: ()=>handleOddsClick(game, 'total', outcome.name, outcome.price, outcome.point),
                                                        disabled: disabled,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "odds-team",
                                                                children: outcome.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                                lineNumber: 353,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "odds-value",
                                                                children: [
                                                                    outcome.point,
                                                                    " (",
                                                                    outcome.price > 0 ? '+' : '',
                                                                    outcome.price,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                                lineNumber: 354,
                                                                columnNumber: 29
                                                            }, this),
                                                            locked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "checkmark",
                                                                children: "✓"
                                                            }, void 0, false, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                                lineNumber: 357,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, outcome.name, true, {
                                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                        lineNumber: 347,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                                lineNumber: 340,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                        lineNumber: 338,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                                lineNumber: 277,
                                columnNumber: 15
                            }, this)
                        ]
                    }, game.id, true, {
                        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                        lineNumber: 247,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
                lineNumber: 235,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/proj/p70/frontend/src/app/predictions/page.jsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = Predictions;
}),
];

//# sourceMappingURL=proj_p70_frontend_src_dc52d34d._.js.map