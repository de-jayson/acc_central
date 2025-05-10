export interface CountryInfo {
  name: string;
  code: string; // ISO 3166-1 alpha-2 country code
  currencyCode: string; // ISO 4217 currency code
  currencySymbol: string;
}

export const countries: CountryInfo[] = [
  { name: "United States", code: "US", currencyCode: "USD", currencySymbol: "$" },
  { name: "Canada", code: "CA", currencyCode: "CAD", currencySymbol: "CA$" },
  { name: "United Kingdom", code: "GB", currencyCode: "GBP", currencySymbol: "£" },
  { name: "Germany", code: "DE", currencyCode: "EUR", currencySymbol: "€" },
  { name: "France", code: "FR", currencyCode: "EUR", currencySymbol: "€" },
  { name: "Australia", code: "AU", currencyCode: "AUD", currencySymbol: "A$" },
  { name: "Japan", code: "JP", currencyCode: "JPY", currencySymbol: "¥" },
  { name: "India", code: "IN", currencyCode: "INR", currencySymbol: "₹" },
  { name: "Brazil", code: "BR", currencyCode: "BRL", currencySymbol: "R$" },
  { name: "South Africa", code: "ZA", currencyCode: "ZAR", currencySymbol: "R" },
];

export const defaultCountry = countries[0]; // Default to United States
