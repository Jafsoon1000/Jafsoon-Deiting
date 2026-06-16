/**
 * Simple math and calculation helpers for the backend.
 */

/**
 * Calculate the percentage of a target value that has been achieved.
 * @param {number} current - The current value.
 * @param {number} target - The target value.
 * @returns {number} The percentage (0-100), rounded to two decimal places.
 */
function calculatePercentage(current, target) {
    if (!target || target <= 0) return 0;
    const percentage = (current / target) * 100;
    return Math.round(percentage * 100) / 100;
}

/**
 * Calculate Body Mass Index (BMI).
 * @param {number} weightKg - Weight in kilograms.
 * @param {number} heightCm - Height in centimeters.
 * @returns {number} The calculated BMI rounded to one decimal place, or 0 if invalid input.
 */
function calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm || heightCm <= 0) return 0;
    const heightMeters = heightCm / 100;
    const bmi = weightKg / (heightMeters * heightMeters);
    return Math.round(bmi * 10) / 10;
}

module.exports = {
    calculatePercentage,
    calculateBMI
};
