// Utility functions for managing predictions in localStorage

const STORAGE_KEY = 'playmaker_predictions';

/**
 * Get all predictions from localStorage
 */
export const getPredictions = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Save a new prediction to localStorage
 */
export const savePrediction = (prediction) => {
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

/**
 * Get only pending predictions
 */
export const getPendingPredictions = () => {
  return getPredictions().filter(p => p.status === 'pending');
};

/**
 * Get only locked predictions
 */
export const getLockedPredictions = () => {
  return getPredictions().filter(p => p.status === 'locked');
};

/**
 * Check if a prediction already exists for a game/market
 */
export const hasPrediction = (eventId, betType) => {
  const predictions = getPredictions();
  return predictions.some(p => p.eventId === eventId && p.betType === betType && (p.status === 'pending' || p.status === 'locked'));
};

/**
 * Get prediction for a specific game/market
 */
export const getPrediction = (eventId, betType) => {
  const predictions = getPredictions();
  return predictions.find(p => p.eventId === eventId && p.betType === betType && p.status === 'pending');
};

/**
 * Update prediction status
 */
export const updatePredictionStatus = (predictionId, status) => {
  const predictions = getPredictions();
  const updated = predictions.map(p => 
    p.id === predictionId ? { ...p, status, ...(status === 'locked' ? { lockedAt: new Date().toISOString() } : {}) } : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

/**
 * Lock a prediction
 */
export const lockPrediction = (predictionId) => {
  updatePredictionStatus(predictionId, 'locked');
};

/**
 * Delete a prediction
 */
export const deletePrediction = (predictionId) => {
  const predictions = getPredictions();
  const filtered = predictions.filter(p => p.id !== predictionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Clear all predictions (for testing)
 */
export const clearAll = () => {
  localStorage.removeItem(STORAGE_KEY);
};

