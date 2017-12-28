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
  "Wells Fargo Home Mortgage",
  "Chase Mortgage",
  "Quicken Loans",
  "U.S. Bancorp",
  "Bank of America",
  "Ally Bank",
  "Citibank, N. A.",
  "USAA"
]);

export const autoLenders = R.map(buildMerchant, [
  "Ally Auto Finance",
  "Toyota Finance",
  "Honda Finance",
  "Capital One Auto Finance",
  "Bank of America",
  "PNC Bank",
  "Fifth Third Bank",
  "USAA"
]);

export const creditCards = R.map(buildMerchant, [
  "Barclaycard Visa",
  "American Express",
  "Banana Republic Visa",
  "Discover Card",
  "Bank of America"
]);

export const groceryStores = R.pipe(
  R.map(buildMerchant),
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

export const restaurants = R.map(buildMerchant, [
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

export const electricCompanies = R.map(buildMerchant, [
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

export const gasCompanies = R.map(buildMerchant, [
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

export const waterCompanies = R.map(buildMerchant, [
  "Aqua America",
  "Valley Water District",
  "Regional Water Authority",
  "KWI North America",
  "United Water",
  "American Water"
]);

export const cableCompanies = R.map(buildMerchant, ["Comcast", "AT&T"]);

export const phoneCompanies = R.map(buildMerchant, ["Verizon", "AT&T"]);

export const insuranceCompanies = R.map(buildMerchant, [
  "Allstate",
  "State Farm",
  "USAA Insurance"
]);

// Maybe need to rename from 'merchants' to 'companies?'
export const employers = R.map(buildMerchant, [
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
