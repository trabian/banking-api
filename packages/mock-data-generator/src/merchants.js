import R from "ramda";
import uuid from "uuid";

const createNamedEntity = name => ({
  id: uuid.v4(),
  name
});

export const categories = R.map(createNamedEntity, {
  clothing: "Clothing",
  debt: "Debt",
  dining: "Dining",
  groceries: "Groceries",
  housing: "Housing",
  income: "Income",
  insurance: "Insurance",
  interest: "Interest",
  medical: "Medical",
  miscellaneous: "Miscellaneous",
  personalCare: "Personal Care",
  transfer: "Transfer",
  utilities: "Utilities"
});

const commonMerchants = {
  target: createNamedEntity("Target"),
  walmart: createNamedEntity("Walmart")
};

export const mortgageCompanies = R.map(createNamedEntity, [
  "Wells Fargo Home Mortgage",
  "Chase Mortgage",
  "Quicken Loans",
  "U.S. Bancorp",
  "Bank of America",
  "Ally Bank",
  "Citibank, N. A.",
  "USAA"
]);

export const autoLenders = R.map(createNamedEntity, [
  "Ally Auto Finance",
  "Toyota Finance",
  "Honda Finance",
  "Capital One Auto Finance",
  "Bank of America",
  "PNC Bank",
  "Fifth Third Bank",
  "USAA"
]);

export const creditCards = R.map(createNamedEntity, [
  "Barclaycard Visa",
  "American Express",
  "Banana Republic Visa",
  "Discover Card",
  "Bank of America"
]);

export const groceryStores = R.pipe(
  R.map(createNamedEntity),
  R.concat([commonMerchants.target, commonMerchants.walmart])
)([
  "Kroger",
  "Meijer",
  "Aldi",
  "Trader Joe's",
  "Food Lion",
  "Whole Foods",
  "Schnucks",
  "Tom Thumb",
  "Meijer",
  "Cub Foods",
  "Publix",
  "Fresh Market",
  "Wegmans",
  "Westborn Market",
  "Hong Kong Supermarket",
  "Great Wall Supermarket",
  "Seafood City",
  "Ocean Mart",
  "Assi Market",
  "Global Food International",
  "New India Bazar",
  "Fiesta Mart",
  "Earth Fare"
]);

export const restaurants = R.map(createNamedEntity, [
  "Applebee's",
  "Arby's",
  "Auntie Anne's",
  "Baja Fresh",
  "Baskin-Robbins",
  "Boston Market",
  "Bonefish Grill",
  "Buffalo Wild Wings",
  "California Pizza Kitchen",
  "Carrabba's Italian Grill",
  "Cheddar's Casual Cafe",
  "Cheesecake Factory",
  "Chester Fried Chicken",
  "Chevys Fresh Mex",
  "Chick-fil-A",
  "Chili's",
  "Chipotle Mexican Grill",
  "Cinnabon",
  "Cracker Barrel Old Country Store",
  "Culver's",
  "Dairy Queen",
  "Dave & Busters",
  "Del Taco",
  "Dunkin Donuts",
  "Famous Dave's",
  "Fazoli's",
  "Five Guys",
  "Freebirds World Burrito",
  "Fuddruckers",
  "Giordano's Pizzeria",
  "Hardee's",
  "IHOP",
  "In-N-Out Burger",
  "Jersey Mike's Subs",
  "Jimmy John's",
  "Johnny Rockets",
  "KFC",
  "Krispy Kreme",
  "Little Caesar's",
  "Logan's Roadhouse",
  "Lone Star Steakhouse",
  "Luby's",
  "Maggiano's",
  "Moe's Southwest Grill",
  "Noodles & Company",
  "O'Charley's",
  "The Old Spaghetti Factory",
  "Olive Garden",
  "On The Border Mexican Grill",
  "The Original Pancake House",
  "Outback Steakhouse",
  "P. F. Chang's China Bistro",
  "Panda Express",
  "Panera Bread",
  "Papa John's",
  "Pei Wei Asian Diner",
  "Pita Pit",
  "Pizza Hut",
  "Popeyes Chicken & Biscuits",
  "Potbelly Sandwich Works",
  "Qdoba Mexican Grill",
  "RA Sushi",
  "Raising Cane's Chicken Fingers",
  "Rally's",
  "Red Lobster",
  "Red Robin",
  "Romano's Macaroni Grill",
  "Ruby Tuesday",
  "Sbarro",
  "Schlotzsky's",
  "Seattle's Best Coffee",
  "Shake Shack",
  "Skyline Chili",
  "Smashburger",
  "Sonic Drive-In",
  "Steak 'n Shake",
  "St. Louis Bread Company",
  "Sticky Fingers",
  "T.G.I. Friday's",
  "Taco Cabana",
  "Texas Roadhouse",
  "Tijuana Flats",
  "Tony Roma's",
  "Umami Burger",
  "Wetzel's Pretzels",
  "Whataburger",
  "Which Wich",
  "Zaxby's"
]);

export const electricCompanies = R.map(createNamedEntity, [
  "Duke Energy",
  "Citizens Energy Group",
  "Consumers Energy",
  "Consolidated Edison",
  "DTE Energy",
  "Public Service Elec & Gas",
  "American Electric Power",
  "NiSource",
  "MidAmerican Energy",
  "Westar Energy",
  "Direct Energy",
  "Xcel Energy",
  "EnergyUnited",
  "Central Power Electric Cooperative",
  "CenterPoint Energy",
  "CPS Energy",
  "CoServ Electric",
  "Tara Energy",
  "FirstEnergy"
]);

export const gasCompanies = R.map(createNamedEntity, [
  "Enstar Natural Gas",
  "CenterPoint Energy",
  "Atmos Energy",
  "Xcel Energy",
  "Mirabito Gas",
  "Public Service Elec & Gas",
  "Hudson Energy",
  "Direct Energy",
  "Entergy",
  "Vectren",
  "Peoples Energy",
  "Eversource Energy",
  "Sandpiper Energy",
  "Colonial Gas"
]);

export const waterCompanies = R.map(createNamedEntity, [
  "Aqua America",
  "Valley Water District",
  "Regional Water Authority",
  "KWI North America",
  "United Water",
  "American Water"
]);

export const cableCompanies = R.map(createNamedEntity, ["Comcast", "AT&T"]);

export const phoneCompanies = R.map(createNamedEntity, ["Verizon", "AT&T"]);

export const insuranceCompanies = R.map(createNamedEntity, [
  "Allstate",
  "State Farm",
  "USAA Insurance"
]);

// Maybe need to rename from 'merchants' to 'companies?'
export const employers = R.map(createNamedEntity, [
  "General Electric, Inc.",
  "Amazon, Inc.",
  "Walmart, Inc.",
  "United Parcel Service",
  "FedEx",
  "Ford Motor Company",
  "U.S. Department of Defense",
  "International Business Machines",
  "Target Corporation",
  "PepsiCo",
  "Deloitte",
  "Cognizant Technology Solutions",
  "J.P. Morgan Chase",
  "Lowe's",
  "Ernst & Young",
  "UnitedHealth Group",
  "Microsoft Corporation",
  "SAP",
  "Salesforce",
  "Symantec",
  "Adobe Systems",
  "Oracle",
  "Facebook",
  "Uber",
  "Priceline Group",
  "Alphabet, Inc.",
  "Groupon",
  "Tata Consultancy Services",
  "Eli Lilly and Company",
  "University of Phoenix"
]);

const addId = transaction => R.assoc("id", uuid.v4(), transaction);

export const miscellaneous = R.map(addId, [
  {
    name: "CVS",
    category: categories.medical
  },
  {
    name: "Classic Cleaners",
    category: categories.personalCare
  },
  {
    name: "TJ Maxx",
    category: categories.clothing
  }
]);
