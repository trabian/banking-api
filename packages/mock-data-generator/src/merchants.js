import R from "ramda";
import uuid from "uuid";

const buildMerchant = name => ({
  id: uuid.v4(),
  name
});

const commonMerchants = {
  target: buildMerchant("Target"),
  walmart: buildMerchant("Walmart")
};

export const mortgageCompanies = R.map(buildMerchant, [
  "Wells Fargo",
  "Chase",
  "Quicken Loans",
  "U.S. Bancorp",
  "Bank of America"
]);

export const groceryStores = R.pipe(
  R.map(buildMerchant),
  R.concat([commonMerchants.target, commonMerchants.walmart])
)(["Kroger", "Meijer", "Aldi's"]);

export const restaurants = R.map(buildMerchant, [
  "The Ram",
  "Steak and Shake",
  "Olive Garden"
]);

export const electricCompanies = R.map(buildMerchant, [
  "Duke Energy",
  "Citizens Energy Group"
]);

export const gasCompanies = R.map(buildMerchant, ["Vectren"]);

export const waterCompanies = R.map(buildMerchant, ["Indiana American Water"]);

// Maybe need to rename from 'merchants' to 'companies?'
export const employers = R.map(buildMerchant, [
  "General Electric, Inc.",
  "Amazon, Inc.",
  "Walmart, Inc."
]);
