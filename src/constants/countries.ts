export interface CountryInfo {
  name: string;
  code: string; // ISO 3166-1 alpha-2 country code
  currencyCode: string; // ISO 4217 currency code
  currencySymbol: string;
}

export const countries: CountryInfo[] = [
  { name: "Ghana", code: "GH", currencyCode: "GHS", currencySymbol: "GH₵" },
];

export const defaultCountry = countries[0]; // Default to Ghana
