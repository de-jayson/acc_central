"use client"; // Marking as client component as Intl is browser API, though it can be used server-side too.

import { defaultCountry } from "@/constants/countries";
import React from 'react';

// Memoize the formatter instance for GHS to avoid re-creation on every call.
const ghsFormatter = new Intl.NumberFormat('en-GH', {
  style: 'decimal', // Format as a plain number
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrencyGHS = (amount: number): string => {
  const currencySymbol = defaultCountry.currencySymbol; // GH₵

  if (amount < 0) {
    const absNumberFormatted = ghsFormatter.format(Math.abs(amount));
    return `-${currencySymbol}${absNumberFormatted}`; // e.g., -GH₵1,234.50
  } else {
    const numberFormatted = ghsFormatter.format(amount);
    return `${currencySymbol}${numberFormatted}`; // e.g., GH₵1,234.50
  }
};

// General purpose currency formatter for cases where currency might vary (though app currently defaults to GHS)
// This can be used if more currencies are introduced later.
const formatters = new Map<string, Intl.NumberFormat>();

export const formatCurrencyDynamic = (amount: number, currencyCode: string, locale: string = 'en-US'): string => {
  let formatter = formatters.get(`${locale}-${currencyCode}`);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode });
      formatters.set(`${locale}-${currencyCode}`, formatter);
    } catch (error) {
      console.warn(`Currency formatting error for ${currencyCode} with locale ${locale}. Defaulting to basic display.`);
      // Fallback for unknown currency codes, try to find symbol or use code
      let symbol = currencyCode;
      if (currencyCode === defaultCountry.currencyCode) {
        symbol = defaultCountry.currencySymbol;
      }
      // For other currencies, a more robust symbol mapping would be needed
      return `${symbol}${amount.toFixed(2)}`;
    }
  }
  return formatter.format(amount);
};