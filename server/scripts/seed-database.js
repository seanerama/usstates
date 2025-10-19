const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const statesData = [
  {
    name: 'Alabama',
    capital: 'Montgomery',
    region: 'southeast',
    abbreviation: 'AL',
    clue_1: 'This state is home to the U.S. Space & Rocket Center in Huntsville',
    clue_2: 'Rosa Parks refused to give up her bus seat in this state in 1955',
    clue_3: 'The Heart of Dixie, located in the Deep South',
    flag_emoji: '🏴',
    population: 5024279,
    nickname: 'The Heart of Dixie'
  },
  {
    name: 'Alaska',
    capital: 'Juneau',
    region: 'west',
    abbreviation: 'AK',
    clue_1: 'The largest U.S. state by area, purchased from Russia in 1867',
    clue_2: 'Home to Denali, the tallest mountain in North America',
    clue_3: 'The Last Frontier, located in the far northwest',
    flag_emoji: '🏴',
    population: 733391,
    nickname: 'The Last Frontier'
  },
  {
    name: 'Arizona',
    capital: 'Phoenix',
    region: 'southwest',
    abbreviation: 'AZ',
    clue_1: 'Home to one of the Seven Natural Wonders of the World',
    clue_2: 'This state has the largest percentage of land designated as Native American reservations',
    clue_3: 'The Grand Canyon State in the Southwest',
    flag_emoji: '🏴',
    population: 7151502,
    nickname: 'The Grand Canyon State'
  },
  {
    name: 'Arkansas',
    capital: 'Little Rock',
    region: 'southeast',
    abbreviation: 'AR',
    clue_1: 'The only active diamond mine in the U.S. is located here',
    clue_2: 'President Bill Clinton was governor of this state',
    clue_3: 'The Natural State, bordered by the Mississippi River',
    flag_emoji: '🏴',
    population: 3011524,
    nickname: 'The Natural State'
  },
  {
    name: 'California',
    capital: 'Sacramento',
    region: 'west',
    abbreviation: 'CA',
    clue_1: 'This state produces 80% of the world\'s almonds',
    clue_2: 'Home to Silicon Valley and Hollywood',
    clue_3: 'The Golden State on the west coast',
    flag_emoji: '🏴',
    population: 39538223,
    nickname: 'The Golden State'
  },
  {
    name: 'Colorado',
    capital: 'Denver',
    region: 'west',
    abbreviation: 'CO',
    clue_1: 'This state has the highest mean elevation in the United States',
    clue_2: 'Home to 58 mountain peaks over 14,000 feet tall',
    clue_3: 'The Centennial State, known for skiing and mountains',
    flag_emoji: '🏴',
    population: 5773714,
    nickname: 'The Centennial State'
  },
  {
    name: 'Connecticut',
    capital: 'Hartford',
    region: 'northeast',
    abbreviation: 'CT',
    clue_1: 'This state is known as the Insurance Capital of the World',
    clue_2: 'Home to Yale University, one of the oldest universities in the U.S.',
    clue_3: 'The Constitution State in New England',
    flag_emoji: '🏴',
    population: 3605944,
    nickname: 'The Constitution State'
  },
  {
    name: 'Delaware',
    capital: 'Dover',
    region: 'mid_atlantic',
    abbreviation: 'DE',
    clue_1: 'The first state to ratify the U.S. Constitution',
    clue_2: 'More than half of U.S. publicly traded companies are incorporated here',
    clue_3: 'The First State, the second smallest state',
    flag_emoji: '🏴',
    population: 989948,
    nickname: 'The First State'
  },
  {
    name: 'Florida',
    capital: 'Tallahassee',
    region: 'southeast',
    abbreviation: 'FL',
    clue_1: 'The only place in the world where alligators and crocodiles coexist naturally',
    clue_2: 'Home to Walt Disney World and the Kennedy Space Center',
    clue_3: 'The Sunshine State, a peninsula in the southeast',
    flag_emoji: '🏴',
    population: 21538187,
    nickname: 'The Sunshine State'
  },
  {
    name: 'Georgia',
    capital: 'Atlanta',
    region: 'southeast',
    abbreviation: 'GA',
    clue_1: 'This state produces the most peanuts and pecans in the U.S.',
    clue_2: 'Birthplace of Martin Luther King Jr. and hosted the 1996 Olympics',
    clue_3: 'The Peach State in the southeastern U.S.',
    flag_emoji: '🏴',
    population: 10711908,
    nickname: 'The Peach State'
  },
  {
    name: 'Hawaii',
    capital: 'Honolulu',
    region: 'west',
    abbreviation: 'HI',
    clue_1: 'The only U.S. state made entirely of islands',
    clue_2: 'Home to active volcanoes and Pearl Harbor',
    clue_3: 'The Aloha State in the Pacific Ocean',
    flag_emoji: '🏴',
    population: 1455271,
    nickname: 'The Aloha State'
  },
  {
    name: 'Idaho',
    capital: 'Boise',
    region: 'west',
    abbreviation: 'ID',
    clue_1: 'This state produces about one-third of all potatoes grown in the U.S.',
    clue_2: 'Home to Craters of the Moon National Monument',
    clue_3: 'The Gem State in the Pacific Northwest',
    flag_emoji: '🏴',
    population: 1839106,
    nickname: 'The Gem State'
  },
  {
    name: 'Illinois',
    capital: 'Springfield',
    region: 'midwest',
    abbreviation: 'IL',
    clue_1: 'Home to the tallest building in the U.S. from 1973 to 1998',
    clue_2: 'Abraham Lincoln practiced law in this state\'s capital',
    clue_3: 'The Prairie State, home to Chicago',
    flag_emoji: '🏴',
    population: 12812508,
    nickname: 'The Prairie State'
  },
  {
    name: 'Indiana',
    capital: 'Indianapolis',
    region: 'midwest',
    abbreviation: 'IN',
    clue_1: 'Home to the famous Indianapolis 500 car race',
    clue_2: 'This state produces more popcorn than any other state',
    clue_3: 'The Hoosier State in the Midwest',
    flag_emoji: '🏴',
    population: 6785528,
    nickname: 'The Hoosier State'
  },
  {
    name: 'Iowa',
    capital: 'Des Moines',
    region: 'midwest',
    abbreviation: 'IA',
    clue_1: 'This state hosts the first presidential caucuses every election year',
    clue_2: 'Produces more corn and raises more hogs than any other state',
    clue_3: 'The Hawkeye State in the heart of the Midwest',
    flag_emoji: '🏴',
    population: 3190369,
    nickname: 'The Hawkeye State'
  },
  {
    name: 'Kansas',
    capital: 'Topeka',
    region: 'midwest',
    abbreviation: 'KS',
    clue_1: 'Dorothy\'s home state in "The Wizard of Oz"',
    clue_2: 'Geographic center of the contiguous 48 states',
    clue_3: 'The Sunflower State in the Great Plains',
    flag_emoji: '🏴',
    population: 2937880,
    nickname: 'The Sunflower State'
  },
  {
    name: 'Kentucky',
    capital: 'Frankfort',
    region: 'southeast',
    abbreviation: 'KY',
    clue_1: 'Home to the Kentucky Derby, the most famous horse race in America',
    clue_2: 'Produces 95% of the world\'s bourbon whiskey',
    clue_3: 'The Bluegrass State, bordered by the Ohio River',
    flag_emoji: '🏴',
    population: 4505836,
    nickname: 'The Bluegrass State'
  },
  {
    name: 'Louisiana',
    capital: 'Baton Rouge',
    region: 'southeast',
    abbreviation: 'LA',
    clue_1: 'Named after King Louis XIV of France, known for Mardi Gras',
    clue_2: 'Home to jazz music and Creole cuisine',
    clue_3: 'The Pelican State, home to New Orleans',
    flag_emoji: '🏴',
    population: 4657757,
    nickname: 'The Pelican State'
  },
  {
    name: 'Maine',
    capital: 'Augusta',
    region: 'northeast',
    abbreviation: 'ME',
    clue_1: 'The only U.S. state with a one-syllable name',
    clue_2: 'Easternmost state in the U.S., famous for lobsters',
    clue_3: 'The Pine Tree State in New England',
    flag_emoji: '🏴',
    population: 1362359,
    nickname: 'The Pine Tree State'
  },
  {
    name: 'Maryland',
    capital: 'Annapolis',
    region: 'mid_atlantic',
    abbreviation: 'MD',
    clue_1: 'Home to the U.S. Naval Academy',
    clue_2: 'The Chesapeake Bay splits this state into two parts',
    clue_3: 'The Old Line State, famous for blue crabs',
    flag_emoji: '🏴',
    population: 6177224,
    nickname: 'The Old Line State'
  },
  {
    name: 'Massachusetts',
    capital: 'Boston',
    region: 'northeast',
    abbreviation: 'MA',
    clue_1: 'The Pilgrims landed at Plymouth Rock in this state in 1620',
    clue_2: 'Home to Harvard, the oldest university in the U.S.',
    clue_3: 'The Bay State in New England',
    flag_emoji: '🏴',
    population: 7029917,
    nickname: 'The Bay State'
  },
  {
    name: 'Michigan',
    capital: 'Lansing',
    region: 'midwest',
    abbreviation: 'MI',
    clue_1: 'Surrounded by four of the five Great Lakes',
    clue_2: 'Known as the automobile capital of the world',
    clue_3: 'The Great Lakes State, shaped like a mitten',
    flag_emoji: '🏴',
    population: 10077331,
    nickname: 'The Great Lakes State'
  },
  {
    name: 'Minnesota',
    capital: 'St. Paul',
    region: 'midwest',
    abbreviation: 'MN',
    clue_1: 'Known as the "Land of 10,000 Lakes" (actually has over 11,000)',
    clue_2: 'Home to the Mall of America, the largest shopping mall in the U.S.',
    clue_3: 'The North Star State in the Upper Midwest',
    flag_emoji: '🏴',
    population: 5706494,
    nickname: 'The North Star State'
  },
  {
    name: 'Mississippi',
    capital: 'Jackson',
    region: 'southeast',
    abbreviation: 'MS',
    clue_1: 'Named after the mighty river that forms its western border',
    clue_2: 'Birthplace of Elvis Presley and the blues music genre',
    clue_3: 'The Magnolia State in the Deep South',
    flag_emoji: '🏴',
    population: 2961279,
    nickname: 'The Magnolia State'
  },
  {
    name: 'Missouri',
    capital: 'Jefferson City',
    region: 'midwest',
    abbreviation: 'MO',
    clue_1: 'Home to the Gateway Arch, the tallest monument in the U.S.',
    clue_2: 'The starting point of the Lewis and Clark expedition',
    clue_3: 'The Show-Me State in the central U.S.',
    flag_emoji: '🏴',
    population: 6154913,
    nickname: 'The Show-Me State'
  },
  {
    name: 'Montana',
    capital: 'Helena',
    region: 'west',
    abbreviation: 'MT',
    clue_1: 'Contains part of Yellowstone National Park, the first national park',
    clue_2: 'Home to Glacier National Park and the Battle of Little Bighorn',
    clue_3: 'Big Sky Country in the northern Rockies',
    flag_emoji: '🏴',
    population: 1084225,
    nickname: 'Big Sky Country'
  },
  {
    name: 'Nebraska',
    capital: 'Lincoln',
    region: 'midwest',
    abbreviation: 'NE',
    clue_1: 'The only state with a unicameral (one-house) legislature',
    clue_2: 'Home to Chimney Rock, a famous landmark on the Oregon Trail',
    clue_3: 'The Cornhusker State in the Great Plains',
    flag_emoji: '🏴',
    population: 1961504,
    nickname: 'The Cornhusker State'
  },
  {
    name: 'Nevada',
    capital: 'Carson City',
    region: 'west',
    abbreviation: 'NV',
    clue_1: 'The driest state in the U.S., home to Las Vegas',
    clue_2: 'More than 80% of this state is owned by the federal government',
    clue_3: 'The Silver State in the southwest desert',
    flag_emoji: '🏴',
    population: 3104614,
    nickname: 'The Silver State'
  },
  {
    name: 'New Hampshire',
    capital: 'Concord',
    region: 'northeast',
    abbreviation: 'NH',
    clue_1: 'Holds the first primary election in presidential races',
    clue_2: 'State motto is "Live Free or Die"',
    clue_3: 'The Granite State in New England',
    flag_emoji: '🏴',
    population: 1377529,
    nickname: 'The Granite State'
  },
  {
    name: 'New Jersey',
    capital: 'Trenton',
    region: 'northeast',
    abbreviation: 'NJ',
    clue_1: 'The most densely populated state in the U.S.',
    clue_2: 'Thomas Edison invented the light bulb in this state',
    clue_3: 'The Garden State, between New York and Philadelphia',
    flag_emoji: '🏴',
    population: 9288994,
    nickname: 'The Garden State'
  },
  {
    name: 'New Mexico',
    capital: 'Santa Fe',
    region: 'southwest',
    abbreviation: 'NM',
    clue_1: 'Home to White Sands National Park and ancient Pueblo cultures',
    clue_2: 'The first atomic bomb was tested here in 1945',
    clue_3: 'Land of Enchantment in the Southwest',
    flag_emoji: '🏴',
    population: 2117522,
    nickname: 'Land of Enchantment'
  },
  {
    name: 'New York',
    capital: 'Albany',
    region: 'northeast',
    abbreviation: 'NY',
    clue_1: 'Home to the Statue of Liberty and the United Nations',
    clue_2: 'Most populous city in the U.S. shares this state\'s name',
    clue_3: 'The Empire State in the northeast',
    flag_emoji: '🏴',
    population: 20201249,
    nickname: 'The Empire State'
  },
  {
    name: 'North Carolina',
    capital: 'Raleigh',
    region: 'southeast',
    abbreviation: 'NC',
    clue_1: 'The Wright Brothers made the first powered flight here in 1903',
    clue_2: 'Home to the Great Smoky Mountains and Research Triangle',
    clue_3: 'The Tar Heel State on the Atlantic coast',
    flag_emoji: '🏴',
    population: 10439388,
    nickname: 'The Tar Heel State'
  },
  {
    name: 'North Dakota',
    capital: 'Bismarck',
    region: 'midwest',
    abbreviation: 'ND',
    clue_1: 'Geographic center of North America is located here',
    clue_2: 'Leading producer of spring wheat, sunflowers, and honey',
    clue_3: 'The Peace Garden State in the northern Great Plains',
    flag_emoji: '🏴',
    population: 779094,
    nickname: 'The Peace Garden State'
  },
  {
    name: 'Ohio',
    capital: 'Columbus',
    region: 'midwest',
    abbreviation: 'OH',
    clue_1: 'Birthplace of more U.S. presidents than any other state except Virginia',
    clue_2: 'Home to the Rock and Roll Hall of Fame',
    clue_3: 'The Buckeye State in the Great Lakes region',
    flag_emoji: '🏴',
    population: 11799448,
    nickname: 'The Buckeye State'
  },
  {
    name: 'Oklahoma',
    capital: 'Oklahoma City',
    region: 'southwest',
    abbreviation: 'OK',
    clue_1: 'Has the second-largest Native American population in the U.S.',
    clue_2: 'Site of the famous Land Run of 1889',
    clue_3: 'The Sooner State in the south-central U.S.',
    flag_emoji: '🏴',
    population: 3959353,
    nickname: 'The Sooner State'
  },
  {
    name: 'Oregon',
    capital: 'Salem',
    region: 'west',
    abbreviation: 'OR',
    clue_1: 'The only state with an official state nut (hazelnut)',
    clue_2: 'Destination of the famous Oregon Trail in the 1800s',
    clue_3: 'The Beaver State in the Pacific Northwest',
    flag_emoji: '🏴',
    population: 4237256,
    nickname: 'The Beaver State'
  },
  {
    name: 'Pennsylvania',
    capital: 'Harrisburg',
    region: 'northeast',
    abbreviation: 'PA',
    clue_1: 'The Liberty Bell and Independence Hall are located here',
    clue_2: 'Founded by William Penn as a haven for Quakers',
    clue_3: 'The Keystone State in the Mid-Atlantic',
    flag_emoji: '🏴',
    population: 13002700,
    nickname: 'The Keystone State'
  },
  {
    name: 'Rhode Island',
    capital: 'Providence',
    region: 'northeast',
    abbreviation: 'RI',
    clue_1: 'The smallest U.S. state by area',
    clue_2: 'Founded by Roger Williams as a haven for religious freedom',
    clue_3: 'The Ocean State in New England',
    flag_emoji: '🏴',
    population: 1097379,
    nickname: 'The Ocean State'
  },
  {
    name: 'South Carolina',
    capital: 'Columbia',
    region: 'southeast',
    abbreviation: 'SC',
    clue_1: 'The first state to secede from the Union in 1860',
    clue_2: 'Home to Fort Sumter, where the Civil War began',
    clue_3: 'The Palmetto State on the Atlantic coast',
    flag_emoji: '🏴',
    population: 5118425,
    nickname: 'The Palmetto State'
  },
  {
    name: 'South Dakota',
    capital: 'Pierre',
    region: 'midwest',
    abbreviation: 'SD',
    clue_1: 'Home to Mount Rushmore National Memorial',
    clue_2: 'The geographic center of the United States (including Alaska and Hawaii)',
    clue_3: 'The Mount Rushmore State in the Great Plains',
    flag_emoji: '🏴',
    population: 886667,
    nickname: 'The Mount Rushmore State'
  },
  {
    name: 'Tennessee',
    capital: 'Nashville',
    region: 'southeast',
    abbreviation: 'TN',
    clue_1: 'Home to Graceland, Elvis Presley\'s mansion',
    clue_2: 'Known as the birthplace of country music',
    clue_3: 'The Volunteer State in the southeastern U.S.',
    flag_emoji: '🏴',
    population: 6910840,
    nickname: 'The Volunteer State'
  },
  {
    name: 'Texas',
    capital: 'Austin',
    region: 'southwest',
    abbreviation: 'TX',
    clue_1: 'The second-largest state by both area and population',
    clue_2: 'Was an independent republic from 1836 to 1845',
    clue_3: 'The Lone Star State in the south-central U.S.',
    flag_emoji: '🏴',
    population: 29145505,
    nickname: 'The Lone Star State'
  },
  {
    name: 'Utah',
    capital: 'Salt Lake City',
    region: 'west',
    abbreviation: 'UT',
    clue_1: 'Home to five spectacular national parks including Zion and Arches',
    clue_2: 'The Great Salt Lake is located here',
    clue_3: 'The Beehive State in the Rocky Mountains',
    flag_emoji: '🏴',
    population: 3271616,
    nickname: 'The Beehive State'
  },
  {
    name: 'Vermont',
    capital: 'Montpelier',
    region: 'northeast',
    abbreviation: 'VT',
    clue_1: 'Produces more maple syrup than any other state',
    clue_2: 'Has the smallest population of any state capital',
    clue_3: 'The Green Mountain State in New England',
    flag_emoji: '🏴',
    population: 643077,
    nickname: 'The Green Mountain State'
  },
  {
    name: 'Virginia',
    capital: 'Richmond',
    region: 'mid_atlantic',
    abbreviation: 'VA',
    clue_1: 'Eight U.S. presidents were born here, more than any other state',
    clue_2: 'Home to the Pentagon and CIA headquarters',
    clue_3: 'The Old Dominion in the Mid-Atlantic',
    flag_emoji: '🏴',
    population: 8631393,
    nickname: 'The Old Dominion'
  },
  {
    name: 'Washington',
    capital: 'Olympia',
    region: 'west',
    abbreviation: 'WA',
    clue_1: 'Only state named after a U.S. president',
    clue_2: 'Home to Microsoft, Amazon, and Mount Rainier',
    clue_3: 'The Evergreen State in the Pacific Northwest',
    flag_emoji: '🏴',
    population: 7705281,
    nickname: 'The Evergreen State'
  },
  {
    name: 'West Virginia',
    capital: 'Charleston',
    region: 'mid_atlantic',
    abbreviation: 'WV',
    clue_1: 'The only state formed by seceding from a Confederate state during the Civil War',
    clue_2: 'Has more than 50% of its land covered in forests',
    clue_3: 'The Mountain State in the Appalachians',
    flag_emoji: '🏴',
    population: 1793716,
    nickname: 'The Mountain State'
  },
  {
    name: 'Wisconsin',
    capital: 'Madison',
    region: 'midwest',
    abbreviation: 'WI',
    clue_1: 'Produces more cheese than any other state',
    clue_2: 'Known as "America\'s Dairyland"',
    clue_3: 'The Badger State in the Great Lakes region',
    flag_emoji: '🏴',
    population: 5893718,
    nickname: 'The Badger State'
  },
  {
    name: 'Wyoming',
    capital: 'Cheyenne',
    region: 'west',
    abbreviation: 'WY',
    clue_1: 'The least populated state, home to Yellowstone National Park',
    clue_2: 'First state to grant women the right to vote (1869)',
    clue_3: 'The Cowboy State in the Rocky Mountains',
    flag_emoji: '🏴',
    population: 576851,
    nickname: 'The Cowboy State'
  }
];

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('Starting database seed...');

    await client.query('BEGIN');

    // Check if states already exist
    const existingStates = await client.query('SELECT COUNT(*) FROM states');
    const count = parseInt(existingStates.rows[0].count);

    if (count > 0) {
      console.log(`Database already contains ${count} states.`);
      console.log('Do you want to clear and re-seed? (This will delete all existing data)');
      console.log('Skipping seed to preserve existing data. Delete states manually if you want to re-seed.');
      await client.query('ROLLBACK');
      return;
    }

    // Insert all states
    for (const state of statesData) {
      await client.query(
        `INSERT INTO states (name, capital, region, abbreviation, clue_1, clue_2, clue_3, flag_emoji, population, nickname)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          state.name,
          state.capital,
          state.region,
          state.abbreviation,
          state.clue_1,
          state.clue_2,
          state.clue_3,
          state.flag_emoji,
          state.population,
          state.nickname
        ]
      );
    }

    await client.query('COMMIT');
    console.log(`Successfully seeded ${statesData.length} states!`);
    console.log('Database is ready to use.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seed function
seedDatabase().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
