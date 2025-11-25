(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/proj/p70/frontend/src/utils/predictionStorage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/proj/p70/frontend/src/app/dashboard/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/proj/p70/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/proj/p70/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/proj/p70/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$supabase$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/proj/p70/frontend/src/utils/supabase/client.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/proj/p70/frontend/src/utils/predictionStorage.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function Dashboard() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$supabase$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [predictions, setPredictions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [showConfirm, setShowConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            const getUser = {
                "Dashboard.useEffect.getUser": async ()=>{
                    const { data: { user } } = await supabase.auth.getUser();
                    setUser(user);
                }
            }["Dashboard.useEffect.getUser"];
            getUser();
            loadPredictions();
            window.addEventListener('focus', loadPredictions);
            return ({
                "Dashboard.useEffect": ()=>window.removeEventListener('focus', loadPredictions)
            })["Dashboard.useEffect"];
        }
    }["Dashboard.useEffect"], []);
    const handleLogout = async ()=>{
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };
    const loadPredictions = ()=>{
        const pending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPendingPredictions"])();
        const locked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLockedPredictions"])();
        setPredictions([
            ...locked,
            ...pending
        ]);
    };
    const handleDeletePrediction = (predictionId, isLocked)=>{
        if (isLocked) {
            if (window.confirm('This is a locked prediction. Deleting will forfeit potential ELO gains. Are you sure?')) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deletePrediction"])(predictionId);
                loadPredictions();
            }
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deletePrediction"])(predictionId);
            loadPredictions();
        }
    };
    const handleLockPrediction = (predictionId)=>{
        setShowConfirm(predictionId);
    };
    const confirmLock = ()=>{
        if (showConfirm) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$src$2f$utils$2f$predictionStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lockPrediction"])(showConfirm);
            loadPredictions();
            setShowConfirm(null);
        }
    };
    const cancelLock = ()=>{
        setShowConfirm(null);
    };
    const filteredPredictions = predictions.filter((p)=>{
        if (filter === 'pending') return p.status === 'pending';
        if (filter === 'locked') return p.status === 'locked';
        return true;
    });
    const pendingCount = predictions.filter((p)=>p.status === 'pending').length;
    const lockedCount = predictions.filter((p)=>p.status === 'locked').length;
    const [userData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        username: user?.email?.split('@')[0] || 'PlayMaker',
        elo: 1847,
        wins: 42,
        losses: 18,
        currentStreak: 5,
        streakType: 'win',
        rank: 'Diamond',
        tier: 'III'
    });
    const totalGames = userData.wins + userData.losses;
    const winRate = totalGames > 0 ? (userData.wins / totalGames * 100).toFixed(1) : 0;
    const getRankColor = (rank)=>{
        const rankColors = {
            'Bronze': '#CD7F32',
            'Silver': '#C0C0C0',
            'Gold': '#FFD700',
            'Platinum': '#E5E4E2',
            'Diamond': '#3B82F6',
            'Master': '#A3FF12',
            'Grandmaster': '#FF006E'
        };
        return rankColors[rank] || '#3B82F6';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "dashboard-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stats-header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "stats-header-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginBottom: '1rem',
                                alignItems: 'center'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "user-welcome",
                                style: {
                                    color: '#fff',
                                    fontSize: '1.2rem'
                                },
                                children: [
                                    "Welcome, ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: '#3B82F6',
                                            fontWeight: 'bold'
                                        },
                                        children: user?.user_metadata?.username || user?.email
                                    }, void 0, false, {
                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                        lineNumber: 110,
                                        columnNumber: 26
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                lineNumber: 109,
                                columnNumber: 14
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "elo-display",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "elo-label",
                                    children: "ELO Rating"
                                }, void 0, false, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "elo-value",
                                    children: userData.elo
                                }, void 0, false, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "elo-change",
                                    children: "+24 today"
                                }, void 0, false, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "stats-grid",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "stat-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "stat-icon",
                                            children: "📊"
                                        }, void 0, false, {
                                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                            lineNumber: 122,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "stat-content",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "stat-label",
                                                    children: "Win/Loss"
                                                }, void 0, false, {
                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                    lineNumber: 124,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "stat-value",
                                                    children: [
                                                        userData.wins,
                                                        "W - ",
                                                        userData.losses,
                                                        "L"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                    lineNumber: 125,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "stat-subtext",
                                                    children: [
                                                        winRate,
                                                        "% Win Rate"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                    lineNumber: 126,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "stat-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "stat-icon",
                                            children: userData.streakType === 'win' ? '🔥' : '❄️'
                                        }, void 0, false, {
                                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "stat-content",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "stat-label",
                                                    children: "Current Streak"
                                                }, void 0, false, {
                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                    lineNumber: 133,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `stat-value ${userData.streakType === 'win' ? 'streak-win' : 'streak-loss'}`,
                                                    children: [
                                                        userData.currentStreak,
                                                        " ",
                                                        userData.streakType === 'win' ? 'Wins' : 'Losses'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                    lineNumber: 134,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "stat-subtext",
                                                    children: userData.streakType === 'win' ? 'Keep it going!' : 'Bounce back!'
                                                }, void 0, false, {
                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                    lineNumber: 137,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                            lineNumber: 132,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "stat-card rank-card",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rank-badge",
                                        style: {
                                            borderColor: getRankColor(userData.rank)
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rank-icon",
                                                style: {
                                                    color: getRankColor(userData.rank)
                                                },
                                                children: "👑"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 143,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rank-content",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rank-name",
                                                        style: {
                                                            color: getRankColor(userData.rank)
                                                        },
                                                        children: userData.rank
                                                    }, void 0, false, {
                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                        lineNumber: 145,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rank-tier",
                                                        children: userData.tier
                                                    }, void 0, false, {
                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                        lineNumber: 148,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 144,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-section active-picks-section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "section-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "section-title",
                                                children: "Active Picks"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 160,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "section-badge",
                                                children: [
                                                    pendingCount,
                                                    " pending, ",
                                                    lockedCount,
                                                    " locked"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 161,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "filter-tabs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `filter-tab ${filter === 'all' ? 'active' : ''}`,
                                                onClick: ()=>setFilter('all'),
                                                children: [
                                                    "All (",
                                                    predictions.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 167,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `filter-tab ${filter === 'pending' ? 'active' : ''}`,
                                                onClick: ()=>setFilter('pending'),
                                                children: [
                                                    "Pending (",
                                                    pendingCount,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 173,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `filter-tab ${filter === 'locked' ? 'active' : ''}`,
                                                onClick: ()=>setFilter('locked'),
                                                children: [
                                                    "Locked (",
                                                    lockedCount,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 179,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this),
                                    filteredPredictions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "empty-state",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "empty-icon",
                                                children: "🏀"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 189,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    "No ",
                                                    filter === 'all' ? 'Active' : filter.charAt(0).toUpperCase() + filter.slice(1),
                                                    " Predictions"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 190,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Head to Predictions page to make your picks!"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "nav-button",
                                                onClick: ()=>router.push('/predictions'),
                                                children: "Make Predictions"
                                            }, void 0, false, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 192,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "predictions-grid",
                                        children: filteredPredictions.map((pred)=>{
                                            const gameTime = new Date(pred.commenceTime);
                                            const isToday = gameTime.toDateString() === new Date().toDateString();
                                            const isLocked = pred.status === 'locked';
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `prediction-card ${isLocked ? 'locked' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "delete-btn",
                                                        onClick: ()=>handleDeletePrediction(pred.id, isLocked),
                                                        title: isLocked ? "Delete locked prediction" : "Cancel prediction",
                                                        children: "✕"
                                                    }, void 0, false, {
                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                        lineNumber: 205,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "game-header",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "game-time",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "date",
                                                                    children: gameTime.toLocaleDateString()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                    lineNumber: 215,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "time",
                                                                    children: gameTime.toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                    lineNumber: 216,
                                                                    columnNumber: 27
                                                                }, this),
                                                                isToday && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "today-badge",
                                                                    children: "TODAY"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                    lineNumber: 217,
                                                                    columnNumber: 39
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                            lineNumber: 214,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                        lineNumber: 213,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "teams-section",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "team",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "team-name",
                                                                        children: pred.awayTeam
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                        lineNumber: 223,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "team-label",
                                                                        children: "AWAY"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                        lineNumber: 224,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                lineNumber: 222,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "vs-divider",
                                                                children: "@"
                                                            }, void 0, false, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                lineNumber: 226,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "team",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "team-name",
                                                                        children: pred.homeTeam
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                        lineNumber: 228,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "team-label",
                                                                        children: "HOME"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                        lineNumber: 229,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                lineNumber: 227,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                        lineNumber: 221,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bet-details",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `bet-type-badge ${pred.betType}`,
                                                                children: pred.betType === 'moneyline' ? 'Moneyline' : pred.betType === 'spread' ? 'Spread' : 'Total Points'
                                                            }, void 0, false, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                lineNumber: 234,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "your-pick",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "pick-label",
                                                                        children: "Your Pick:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                        lineNumber: 240,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "pick-value",
                                                                        children: [
                                                                            pred.selection,
                                                                            pred.point && ` (${pred.point > 0 ? '+' : ''}${pred.point})`,
                                                                            ' ',
                                                                            "@ ",
                                                                            pred.odds > 0 ? '+' : '',
                                                                            pred.odds
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                        lineNumber: 241,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                lineNumber: 239,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                        lineNumber: 233,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "prediction-footer",
                                                        children: isLocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "status-badge locked",
                                                            children: "🔒 LOCKED"
                                                        }, void 0, false, {
                                                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                            lineNumber: 251,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "status-badge pending",
                                                                    children: "PENDING"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                    lineNumber: 254,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "lock-btn",
                                                                    onClick: ()=>handleLockPrediction(pred.id),
                                                                    children: "🔓 Lock Pick"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                                    lineNumber: 255,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true)
                                                    }, void 0, false, {
                                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                        lineNumber: 249,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, pred.id, true, {
                                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                                lineNumber: 204,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-section quick-actions-section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "section-header",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "section-title",
                                            children: "Quick Actions"
                                        }, void 0, false, {
                                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                        lineNumber: 272,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "section-placeholder-box",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Quick Actions content coming soon..."
                                        }, void 0, false, {
                                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                            lineNumber: 276,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                        lineNumber: 275,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-section friends-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "section-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "section-title",
                                        children: "Friends Leaderboard"
                                    }, void 0, false, {
                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "section-badge",
                                        children: "12 friends"
                                    }, void 0, false, {
                                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                        lineNumber: 284,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                lineNumber: 282,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "section-placeholder-box",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Friends Leaderboard content coming soon..."
                                }, void 0, false, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 287,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-section recent-results-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "section-header",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "section-title",
                                    children: "Recent Results"
                                }, void 0, false, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "section-placeholder-box",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Recent Results content coming soon..."
                                }, void 0, false, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 296,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            showConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lock-confirmation-overlay",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lock-confirmation-modal",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "🔒 Lock This Prediction?"
                        }, void 0, false, {
                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                            lineNumber: 304,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "You won't be able to change or delete it."
                        }, void 0, false, {
                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                            lineNumber: 305,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "confirm-note",
                            children: "This pick will count towards your ELO rating!"
                        }, void 0, false, {
                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                            lineNumber: 306,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "confirm-buttons",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "confirm-lock-btn",
                                    onClick: confirmLock,
                                    children: "Confirm Lock"
                                }, void 0, false, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 308,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "cancel-lock-btn",
                                    onClick: cancelLock,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                                    lineNumber: 311,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                            lineNumber: 307,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                    lineNumber: 303,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
                lineNumber: 302,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/proj/p70/frontend/src/app/dashboard/page.jsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_s(Dashboard, "XPaffyzMbbaR174WzxTfs/tDI64=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$proj$2f$p70$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Dashboard;
const __TURBOPACK__default__export__ = Dashboard;
var _c;
__turbopack_context__.k.register(_c, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=proj_p70_frontend_src_eb816352._.js.map