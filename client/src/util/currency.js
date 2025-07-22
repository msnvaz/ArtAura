// Currency utility functions for LKR formatting

/**
 * Format a number as LKR currency
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the currency symbol
 * @returns {string} Formatted currency string
 */
export const formatLKR = (amount, showSymbol = true) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return showSymbol ? 'LKR 0.00' : '0.00';
    }

    const numAmount = parseFloat(amount);

    // Format with thousand separators
    const formatted = numAmount.toLocaleString('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return showSymbol ? `LKR ${formatted}` : formatted;
};

/**
 * Format a number as LKR currency with short notation for large numbers
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatLKRShort = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return 'LKR 0';
    }

    const numAmount = parseFloat(amount);

    if (numAmount >= 1000000000) {
        return `LKR ${(numAmount / 1000000000).toFixed(1)}B`;
    } else if (numAmount >= 1000000) {
        return `LKR ${(numAmount / 1000000).toFixed(1)}M`;
    } else if (numAmount >= 1000) {
        return `LKR ${(numAmount / 1000).toFixed(1)}K`;
    } else {
        return `LKR ${numAmount.toFixed(0)}`;
    }
};

/**
 * Parse LKR string back to number
 * @param {string} lkrString - The LKR formatted string
 * @returns {number} Parsed number
 */
export const parseLKR = (lkrString) => {
    if (!lkrString) return 0;

    // Remove LKR prefix and commas, then parse
    const cleanString = lkrString.toString().replace(/LKR\s*/, '').replace(/,/g, '');
    return parseFloat(cleanString) || 0;
};

// Currency symbol constant
export const LKR_SYMBOL = 'LKR';
