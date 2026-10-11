import { Property, CityData, NewProject, Testimonial, Article, BlogArticle } from '../types/property';

export const CITIES_DATA: CityData[] = [
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'National Capital Region',
    tagline: 'Capital growth corridor & world-class infra',
    propertyCount: '95,000+',
    avgPriceSqft: '₹8,450/sq.ft',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Sector 150 Noida', 'Golf Course Road Gurgaon', 'Dwarka Expressway', 'Vasant Kunj', 'Greater Noida West']
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'Maximum City with premier coastal luxury',
    propertyCount: '1,20,000+',
    avgPriceSqft: '₹22,800/sq.ft',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Bandra West', 'Andheri West', 'Worli Sea Face', 'Thane West', 'Powai', 'Kandivali']
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    tagline: 'Silicon Valley tech hubs & green communities',
    propertyCount: '88,000+',
    avgPriceSqft: '₹7,950/sq.ft',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Whitefield', 'Sarjapur Road', 'Indiranagar', 'HSR Layout', 'Hebbal', 'Electronic City']
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    tagline: 'Cultural capital & booming IT corridors',
    propertyCount: '70,000+',
    avgPriceSqft: '₹6,800/sq.ft',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Baner', 'Hinjewadi IT Park', 'Kharadi', 'Wakad', 'Koregaon Park', 'Viman Nagar']
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    tagline: 'Fastest growing pharma & tech real estate',
    propertyCount: '62,000+',
    avgPriceSqft: '₹7,200/sq.ft',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Gachibowli', 'HITEC City', 'Kondapur', 'Jubilee Hills', 'Kokapet', 'Tellapur']
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    tagline: 'Coastal metropolis with strong industrial stability',
    propertyCount: '45,000+',
    avgPriceSqft: '₹6,400/sq.ft',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['OMR IT Expressway', 'Anna Nagar', 'Adyar', 'Velachery', 'ECR Coastal Road']
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    tagline: 'Heritage charm with emerging modern townships',
    propertyCount: '38,000+',
    avgPriceSqft: '₹5,100/sq.ft',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['New Town', 'Salt Lake Sector V', 'Rajarhat', 'Ballygunge', 'EM Bypass']
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    tagline: 'Smart city leader & GIFT City financial hub',
    propertyCount: '42,000+',
    avgPriceSqft: '₹4,950/sq.ft',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['SG Highway', 'Bopal', 'Prahlad Nagar', 'GIFT City Area', 'Satellite']
  },
  {
    id: 'gurgaon',
    name: 'Gurgaon',
    state: 'Haryana',
    tagline: 'Millennium City with Fortune 500 corporate hubs',
    propertyCount: '54,000+',
    avgPriceSqft: '₹11,500/sq.ft',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Cyber City', 'Golf Course Ext Road', 'Sohna Road', 'DLF Phase 5', 'Sector 57']
  },
  {
    id: 'noida',
    name: 'Noida',
    state: 'Uttar Pradesh',
    tagline: 'Expressway lifestyle & planned green sectors',
    propertyCount: '48,000+',
    avgPriceSqft: '₹7,600/sq.ft',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    popularLocalities: ['Sector 150', 'Noida Expressway', 'Sector 75', 'Sector 137', 'Sector 62']
  }
];

export const PROPERTIES_DATA: Property[] = [
  {
    id: 'prop-orion-132',
    title: 'Orion One 32',
    tagline: "India's First Freeport Outlet Mall • 29-Yr Lease Guarantee & 12% Assured Return",
    type: 'Commercial Office',
    category: 'Commercial',
    bhk: 0,
    price: 8280000,
    priceFormatted: '₹82.80 Lakh - ₹2.50 Cr*',
    priceRange: '₹82.80 Lakh - ₹2.50 Cr*',
    pricePerSqft: 8500,
    area: 1000,
    locality: 'Sector 132, Noida Expressway',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201304',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80'
    ],
    verified: true,
    reraId: 'UPRERAPRJ960554',
    postedBy: 'Builder',
    posterName: 'Wellgrow Infotech / Orion Group',
    posterPhone: '+91 98110 44210',
    postedDate: 'Verified Today',
    furnishing: 'Furnished',
    possession: 'Under Construction',
    facing: 'North-East',
    floor: 'Ground to 24th Floor',
    bathrooms: 8,
    balconies: 4,
    parking: 'Dedicated Multi-Level (200+ Cars)',
    amenities: [
      'Lake Promenade & 5 Beaches',
      'Freeport Retail Outlet Mall',
      'High-Speed Elevators',
      '100% DG Power Backup',
      'LEED Gold Certified',
      '24x7 Security & CCTV',
      'Double-Height Entrance Lobby',
      'Multi-Cuisine Food Court',
      '8-Ft Air-Cooled Corridors',
      'EV Charging Bays',
      'Vastu Compliant Architecture',
      'Rainwater Harvesting'
    ],
    description: "Orion One32 is a visionary mixed-use commercial development situated in Sector 132, Noida Expressway, bringing India's first Freeport Outlet Mall concept. Spread across 10 lush acres with European contemporary architecture, it features retail shops, corporate office suites, IT suites, gourmet food courts, and serviced studio apartments. Backed by a 29-year lease guarantee with Freeport Retail and 12% assured returns, Orion One32 combines unprecedented retail footfall with premium office productivity.",
    maintenanceCharges: '₹8/sq.ft/month',
    featured: true,
    virtualTourAvailable: true,
    developerName: 'Wellgrow Infotech Pvt. Ltd. / Orion Developers',
    developerExperience: '16+ Years Experience',
    developerDeliveredProjects: '14+ Landmark Commercial Projects',
    projectStatus: 'Under Construction (Structure Ready)',
    possessionDate: 'December 2026',
    totalLandArea: '10 Acres',
    totalTowers: '3 Iconic Commercial Towers',
    totalUnits: '703 Commercial & Retail Units',
    projectArchitecture: 'European Contemporary • LEED Gold Rated Green Building',
    leaseGuarantee: '29-Year Lease Guarantee with Freeport Retail • 12% Assured Returns',
    highlights: [
      "India's 1st Freeport Outlet Mall featuring 100+ global brands with 30-70% year-round discounts",
      "29-Year Lease Guarantee in partnership with Freeport Retail London",
      "12% Assured Returns starting from Day 1 of investment",
      "3-Acre Central Courtyard with Lake Promenade and 5 thematic recreational beaches",
      "LEED Gold Rated Green Complex ensuring 40% reduction in air-conditioning energy costs",
      "Column-free office plates with 8-foot wide air-cooled corridors",
      "Immediate Noida-Greater Noida Expressway frontage with 50,000+ families within 2 km",
      "Multi-level basement & surface parking accommodating over 200+ vehicles with EV stations"
    ],
    configurations: [
      {
        id: 'cfg-1',
        unitType: 'Retail Shops (High-Street)',
        carpetArea: '150 - 640 sq.ft',
        superArea: '200 - 1,000 sq.ft',
        price: 'Starting ₹1.41 Cr*',
        priceNumeric: 14100000,
        pricePerSqft: '₹18,000/sq.ft',
        floor: 'Ground & Lower Ground Floor'
      },
      {
        id: 'cfg-2',
        unitType: 'Corporate Office Spaces',
        carpetArea: '460 - 2,500 sq.ft',
        superArea: '650 - 3,500 sq.ft',
        price: 'Starting ₹82.80 Lakh*',
        priceNumeric: 8280000,
        pricePerSqft: '₹8,500/sq.ft',
        floor: '4th to 18th Floors'
      },
      {
        id: 'cfg-3',
        unitType: 'Gourmet Food Court Units',
        carpetArea: '150 - 350 sq.ft',
        superArea: '250 - 500 sq.ft',
        price: 'Starting ₹27.00 Lakh*',
        priceNumeric: 2700000,
        pricePerSqft: '₹16,500/sq.ft',
        floor: '2nd & 3rd Floors'
      },
      {
        id: 'cfg-4',
        unitType: 'Serviced Business Suites',
        carpetArea: '450 - 750 sq.ft',
        superArea: '600 - 1,100 sq.ft',
        price: 'Starting ₹65.00 Lakh*',
        priceNumeric: 6500000,
        pricePerSqft: '₹9,500/sq.ft',
        floor: '19th to 24th Floors'
      }
    ],
    floorPlans: [
      {
        id: 'fp-1',
        title: 'Ground Floor High-Street Retail & Anchor Stores',
        type: 'Retail',
        size: '150 - 1,200 sq.ft Units',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        description: 'Double-height retail frontage along the central beach promenade with continuous footfall circulation.'
      },
      {
        id: 'fp-2',
        title: '1st Floor Luxury Brands & Fashion Avenue',
        type: 'Retail',
        size: '250 - 800 sq.ft Units',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        description: 'Open-atrium facing retail units with wide escalators and direct central courtyard views.'
      },
      {
        id: 'fp-3',
        title: '2nd Floor Multi-Cuisine Food Court & Cafes',
        type: 'Food Court',
        size: '150 - 450 sq.ft Kitchens',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        description: 'Dedicated exhaust systems, shared 500-seat outdoor terrace seating, and food pickup counters.'
      },
      {
        id: 'fp-4',
        title: '4th to 18th Floor Grade-A Office Floor Plate',
        type: 'Office',
        size: '460 - 30,000 sq.ft Modular Plates',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        description: 'Column-free design with high natural lighting, VRV central air-cooling, and high-speed elevators.'
      },
      {
        id: 'fp-5',
        title: '10-Acre Master Campus Layout & Traffic Circulation',
        type: 'Master Plan',
        size: '10 Acres Master Plan',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        description: 'Complete campus master layout detailing vehicular ingress/egress, drop-off porches, and beach promenade.'
      }
    ],
    locationAdvantages: [
      { landmark: 'Noida-Greater Noida Expressway', time: '0 Mins (Direct)', category: 'Connectivity' },
      { landmark: 'Jaypee Multispecialty Hospital', time: '2 Mins', category: 'Healthcare' },
      { landmark: 'Amity University Noida Campus', time: '3 Mins', category: 'Education' },
      { landmark: 'FNG Expressway Interchange', time: '5 Mins', category: 'Connectivity' },
      { landmark: 'DND Flyway (Delhi Gateway)', time: '12 Mins', category: 'Connectivity' },
      { landmark: 'Upcoming Jewar International Airport', time: '35 Mins', category: 'Airport' },
      { landmark: 'Top MNCs (Adobe, HCL, Infosys, TCS)', time: '2-5 Mins', category: 'Corporate' },
      { landmark: 'Jaypee Wish Town & ATS Residential Catchment', time: '2 Mins', category: 'Corporate' }
    ],
    brochureUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    videoWalkthroughUrl: 'https://www.youtube.com',
    aboutDeveloper: "Wellgrow Infotech Private Limited, part of the Orion Group, has established itself as one of the most innovative commercial developers in Delhi NCR. With over 16 years of engineering leadership, the group is celebrated for introducing global real estate concepts to North India, including international Freeport retail partnerships, LEED Gold environmental compliance, and high rental-yield commercial ecosystems.",
    faqs: [
      {
        question: "Is Orion One 32 registered under Uttar Pradesh RERA?",
        answer: "Yes, Orion One 32 is completely registered and compliant with UP RERA under registration number UPRERAPRJ960554. All approvals, land titles, and construction milestones are verified."
      },
      {
        question: "What is the 29-Year Lease Guarantee with Freeport Retail?",
        answer: "Orion One 32 has partnered with Freeport Retail London, the world's leading designer outlet operator. Retail spaces enjoy a 29-year master lease agreement with guaranteed international brand occupancy and consistent rental returns."
      },
      {
        question: "What is the expected possession timeline for Orion One 32?",
        answer: "The structural work is advanced, and final fit-outs and internal handovers are slated for December 2026, fully compliant with UP RERA schedule."
      },
      {
        question: "What are the investment sizes and assured returns available?",
        answer: "Investments start from ₹27 Lakh for food court units and ₹82.80 Lakh for commercial office spaces, offering up to 12% assured returns with quarterly payout options and zero brokerage through PropertyLelo."
      }
    ]
  },
  {
    id: 'prop-1',
    title: '3 BHK Ultra-Luxury Garden Apartment',
    tagline: 'Park facing corner unit with smart home automation',
    type: 'Apartment',
    category: 'Buy',
    bhk: 3,
    price: 12000000,
    priceFormatted: '₹1.20 Cr',
    pricePerSqft: 8275,
    area: 1450,
    locality: 'Sector 150',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201310',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'UPRERAPRJ442158',
    postedBy: 'Builder',
    posterName: 'Ace Parkway Infra',
    posterPhone: '+91 98110 44210',
    postedDate: '2 days ago',
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    facing: 'North-East',
    floor: '12th of 26 Floors',
    bathrooms: 3,
    balconies: 3,
    parking: '2 Covered Slots',
    amenities: ['Olympic Pool', 'Clubhouse 35k sqft', '24/7 Power Backup', 'EV Charging Station', 'Tennis Court', 'Golf Putting Green'],
    description: 'Expansive 3 BHK apartment in the sports city sector of Noida. Features Italian marble flooring, VRV central cooling, modular German kitchen with chimney, and panoramic views of 42-acre Shaheed Bhagat Singh park.',
    maintenanceCharges: '₹4,500/month',
    featured: true,
    virtualTourAvailable: true
  },
  {
    id: 'prop-2',
    title: '2 BHK Premium High-Rise Flat',
    tagline: 'Walking distance to Metro & IT tech parks',
    type: 'Apartment',
    category: 'Buy',
    bhk: 2,
    price: 8500000,
    priceFormatted: '₹85 Lakh',
    pricePerSqft: 7727,
    area: 1100,
    locality: 'Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'PRM/KA/RERA/1251/446/PR/181210/002220',
    postedBy: 'Owner',
    posterName: 'Rahul Deshmukh',
    posterPhone: '+91 97412 88390',
    postedDate: 'Just now',
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    facing: 'East',
    floor: '8th of 18 Floors',
    bathrooms: 2,
    balconies: 2,
    parking: '1 Covered Car Park',
    amenities: ['Gymnasium', 'Infinity Swimming Pool', 'Power Backup 100%', 'Children Play Area', 'Rooftop Lounge', 'Intercom Security'],
    description: 'Elegantly furnished 2 BHK apartment with designer wood work, modular kitchen with Bosch appliances, high-speed fiber internet wiring, and zero common wall design ensuring complete privacy.',
    maintenanceCharges: '₹3,200/month',
    featured: true,
    virtualTourAvailable: true
  },
  {
    id: 'prop-3',
    title: '4 BHK Grand Independent Villa',
    tagline: 'Private infinity plunge pool & landscaped rooftop deck',
    type: 'Villa',
    category: 'Buy',
    bhk: 4,
    price: 25000000,
    priceFormatted: '₹2.50 Cr',
    pricePerSqft: 7812,
    area: 3200,
    locality: 'Baner',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'P52100028911',
    postedBy: 'Builder',
    posterName: 'Supreme Holdings Ltd',
    posterPhone: '+91 98230 77100',
    postedDate: '3 days ago',
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    facing: 'North',
    floor: 'Ground + 2 Floors',
    bathrooms: 5,
    balconies: 4,
    parking: '3 Private Car Parks',
    amenities: ['Private Plunge Pool', 'Solar Roof System', 'Private Garden Lawn', 'CCTV 360 Security', 'Servant Quarters', 'Billiards Room'],
    description: 'Magnificent 4 BHK signature villa nestled in upscale Baner. Offers double-height living room with glass facade, private landscaped lawn, master suite with walk-in wardrobe, and smart home lighting by Lutron.',
    maintenanceCharges: '₹6,000/month',
    featured: true,
    virtualTourAvailable: true
  },
  {
    id: 'prop-4',
    title: 'Designer Studio Apartment / 1 BHK',
    tagline: 'High capital appreciation asset near Lokhandwala Complex',
    type: 'Studio Flat',
    category: 'Buy',
    bhk: 1,
    price: 6800000,
    priceFormatted: '₹68 Lakh',
    pricePerSqft: 12363,
    area: 550,
    locality: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'P51800019482',
    postedBy: 'Verified Agent',
    posterName: 'Knight & Sterling Mumbai',
    posterPhone: '+91 99201 55660',
    postedDate: '1 day ago',
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    facing: 'West',
    floor: '11th of 22 Floors',
    bathrooms: 1,
    balconies: 1,
    parking: '1 Stilt Parking',
    amenities: ['High-speed Elevators', 'Gym', '24/7 Concierge', 'Biometric Entry', 'Fire Safety Sprinklers'],
    description: 'Chic urban apartment with custom space-saving Italian furniture, convertible workstation, premium bath fixtures, and seamless connectivity to Metro Line 2A and Link Road.',
    maintenanceCharges: '₹2,800/month',
    featured: false,
    virtualTourAvailable: false
  },
  {
    id: 'prop-5',
    title: 'Grade-A Commercial Office Suite',
    tagline: 'Pre-leased to MNC IT tenant with 8.2% gross annual ROI',
    type: 'Commercial Office',
    category: 'Commercial',
    bhk: 0,
    price: 18000000,
    priceFormatted: '₹1.80 Cr',
    pricePerSqft: 9000,
    area: 2000,
    locality: 'Cyber City, DLF Phase 2',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122002',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'HRERA-PKL-GGM-1029-2022',
    postedBy: 'Verified Agent',
    posterName: 'Apex Commercial Capital',
    posterPhone: '+91 98100 99443',
    postedDate: '4 days ago',
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    facing: 'North-East',
    floor: '5th of 14 Floors',
    bathrooms: 4,
    balconies: 0,
    parking: '4 Reserved Basement Slots',
    amenities: ['100% Dual Power Backup', 'Central Air Conditioning', 'LEED Gold Certified', 'Food Court', 'Multi-tier Security', 'Conference Rooms'],
    description: 'Fully furnished Grade-A corporate office with 32 workstations, 2 director cabins, 10-seater boardroom, pantry, and server room. Generating ₹1.25 Lakh monthly assured return with 9-year corporate lease lock-in.',
    maintenanceCharges: '₹12/sq.ft',
    featured: true,
    virtualTourAvailable: true
  },
  {
    id: 'prop-6',
    title: 'Gated Villa Plot / Residential Land',
    tagline: 'Clear title BDA approved corner plot with 40ft road frontage',
    type: 'Plot',
    category: 'Buy',
    bhk: 0,
    price: 9500000,
    priceFormatted: '₹95 Lakh',
    pricePerSqft: 3958,
    area: 2400,
    locality: 'Sarjapur Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560035',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'PRM/KA/RERA/1251/308/PR/200122/003190',
    postedBy: 'Owner',
    posterName: 'Venkat Ramanathan',
    posterPhone: '+91 99801 22340',
    postedDate: '5 days ago',
    furnishing: 'Unfurnished',
    possession: 'Ready to Move',
    facing: 'East',
    floor: 'Plot / Land',
    bathrooms: 0,
    balconies: 0,
    parking: 'On-plot Parking Space',
    amenities: ['Underground Cabling', 'Avenue Tree Plantation', '24/7 Security Gate', 'Rainwater Harvesting', 'Blacktop 40ft Roads', 'Street Lights'],
    description: 'Premium 2400 sq.ft (60x40) East-facing residential plot in a gated enclave of 45 acres. 100% clear legal title, A-Khata, pre-approved bank loans from SBI & HDFC up to 80%.',
    maintenanceCharges: '₹1,500/month',
    featured: false,
    virtualTourAvailable: false
  },
  {
    id: 'prop-7',
    title: '3.5 BHK Sky Residence Penthouse',
    tagline: 'Sweeping Arabian Sea view with private terrace deck',
    type: 'Penthouse',
    category: 'Buy',
    bhk: 4,
    price: 49000000,
    priceFormatted: '₹4.90 Cr',
    pricePerSqft: 18148,
    area: 2700,
    locality: 'Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'P51900001423',
    postedBy: 'Verified Agent',
    posterName: 'South Mumbai Realty Advisory',
    posterPhone: '+91 98200 44551',
    postedDate: '1 day ago',
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    facing: 'West',
    floor: '38th of 42 Floors',
    bathrooms: 4,
    balconies: 3,
    parking: '3 Hydraulic Covered Slots',
    amenities: ['Helipad Access', 'Infinity Rooftop Pool', 'Cigar Lounge', 'Private Elevator', 'Spa & Sauna', 'Valet Parking'],
    description: 'An architectural masterpiece over Worli shoreline. Triple aspect sea views, private high-speed elevator opening into personal foyer, Poggenpohl kitchen, and bespoke Dornbracht bathroom fittings.',
    maintenanceCharges: '₹18,000/month',
    featured: true,
    virtualTourAvailable: true
  },
  {
    id: 'prop-8',
    title: '3 BHK High-End Gated Community Flat',
    tagline: 'Opposite Financial District & US Consulate',
    type: 'Apartment',
    category: 'Buy',
    bhk: 3,
    price: 14500000,
    priceFormatted: '₹1.45 Cr',
    pricePerSqft: 7631,
    area: 1900,
    locality: 'Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'P02400002194',
    postedBy: 'Builder',
    posterName: 'My Home Constructions',
    posterPhone: '+91 91000 88220',
    postedDate: '3 days ago',
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    facing: 'East',
    floor: '16th of 33 Floors',
    bathrooms: 3,
    balconies: 2,
    parking: '2 Basement Parking Slots',
    amenities: ['Clubhouse 60k sqft', 'Olympic Size Pool', 'Supermarket on Campus', 'Creche & Play School', 'Squash Court', 'EV Chargers'],
    description: 'Spacious 3 BHK home in Hyderabad\'s most prestigious gated community. 80% open landscaped area, zero vehicular movement on podium level, and uninterrupted power and water supply.',
    maintenanceCharges: '₹4,800/month',
    featured: true,
    virtualTourAvailable: true
  },
  {
    id: 'prop-9',
    title: 'Luxury 3 BHK High-Rise Apartment',
    tagline: 'Fully furnished with Italian decor, ready for immediate possession',
    type: 'Apartment',
    category: 'Buy',
    bhk: 3,
    price: 18500000,
    priceFormatted: '₹1.85 Cr',
    pricePerSqft: 10882,
    area: 1700,
    locality: 'Golf Course Extension Road',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122018',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    postedBy: 'Owner',
    posterName: 'Anil Singhal (NRI Owner)',
    posterPhone: '+91 98112 00399',
    postedDate: 'Today',
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    facing: 'North-East',
    floor: '9th of 24 Floors',
    bathrooms: 3,
    balconies: 3,
    parking: '2 Covered Slots',
    amenities: ['100% Power Backup', 'Club Membership Included', 'Gym', 'Swimming Pool', 'Smart Lock Door'],
    description: 'Tastefully furnished apartment with Italian marble flooring, king beds with orthopedic mattresses, modular kitchen, and high speed Wi-Fi setup.',
    maintenanceCharges: '₹5,000/month',
    featured: false,
    virtualTourAvailable: true
  },
  {
    id: 'prop-10',
    title: 'Modern 2 BHK Gated Community Flat',
    tagline: 'Zero brokerage freehold property directly from owner near EON IT Park',
    type: 'Apartment',
    category: 'Buy',
    bhk: 2,
    price: 7800000,
    priceFormatted: '₹78 Lakh',
    pricePerSqft: 7428,
    area: 1050,
    locality: 'Kharadi',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411014',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    postedBy: 'Owner',
    posterName: 'Sneha Kulkarni',
    posterPhone: '+91 97654 33210',
    postedDate: '2 days ago',
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    facing: 'East',
    floor: '6th of 15 Floors',
    bathrooms: 2,
    balconies: 2,
    parking: '1 Covered Car Park',
    amenities: ['Lift with Power Backup', 'Fitness Center', 'Garden & Jogging Track', 'Security Guard', 'Water Purifier'],
    description: 'Spacious semi-furnished flat with modular kitchen, piped gas connection, geysers in both bathrooms, safety grills, and wardrobe in master bedroom. 5 mins drive to World Trade Center Kharadi.',
    maintenanceCharges: '₹2,500/month',
    featured: false,
    virtualTourAvailable: false
  },
  {
    id: 'prop-11',
    title: 'Luxury 4 BHK Triplex Villa',
    tagline: 'Private lift, home theatre & terrace barbecue station',
    type: 'Villa',
    category: 'Buy',
    bhk: 4,
    price: 38000000,
    priceFormatted: '₹3.80 Cr',
    pricePerSqft: 9500,
    area: 4000,
    locality: 'Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'P02500003890',
    postedBy: 'Builder',
    posterName: 'Aparna Luxury Estates',
    posterPhone: '+91 91211 44550',
    postedDate: '6 days ago',
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    facing: 'North-East',
    floor: 'G+2 Triplex',
    bathrooms: 5,
    balconies: 4,
    parking: '3 Covered Stilt Slots',
    amenities: ['Private Elevator', 'Private Home Cinema', 'Terrace Pergola Deck', 'Clubhouse', 'Solar Water Heating', 'Staff Suite'],
    description: 'Exquisite triplex villa located in the heart of Jubilee Hills. Designed by international architects with floor-to-ceiling glass, Italian statuario marble, and private landscaped courtyard.',
    maintenanceCharges: '₹8,000/month',
    featured: true,
    virtualTourAvailable: true
  },
  {
    id: 'prop-12',
    title: '2 BHK Sea Breeze Coastal Apartment',
    tagline: 'Calm residential enclave with view of the Bay of Bengal',
    type: 'Apartment',
    category: 'Buy',
    bhk: 2,
    price: 7200000,
    priceFormatted: '₹72 Lakh',
    pricePerSqft: 6260,
    area: 1150,
    locality: 'OMR IT Expressway',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600097',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'TN/01/Building/0088/2021',
    postedBy: 'Owner',
    posterName: 'Karthik Subramanian',
    posterPhone: '+91 94440 12890',
    postedDate: '4 days ago',
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    facing: 'East',
    floor: '7th of 14 Floors',
    bathrooms: 2,
    balconies: 2,
    parking: '1 Covered Car Park',
    amenities: ['Clubhouse', 'Swimming Pool', 'RO Water Plant', 'Badminton Court', '24/7 Security'],
    description: 'Well-ventilated East-facing 2 BHK flat near Sholinganallur junction. Excellent cross-ventilation, vastu compliant, and walking distance to major IT parks and international schools.',
    maintenanceCharges: '₹2,600/month',
    featured: false,
    virtualTourAvailable: false
  },
  {
    id: 'prop-13',
    title: 'Luxury 3 BHK Lake-View Flat',
    tagline: 'Overlooking natural lake with 80% open landscaped greens',
    type: 'Apartment',
    category: 'Buy',
    bhk: 3,
    price: 11500000,
    priceFormatted: '₹1.15 Cr',
    pricePerSqft: 7187,
    area: 1600,
    locality: 'New Town, Action Area II',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700156',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'WBRERA/P/NOR/2023/000214',
    postedBy: 'Builder',
    posterName: 'PS Group Real Estate',
    posterPhone: '+91 98300 66778',
    postedDate: '1 week ago',
    furnishing: 'Unfurnished',
    possession: 'Ready to Move',
    facing: 'South',
    floor: '15th of 22 Floors',
    bathrooms: 3,
    balconies: 2,
    parking: '1 Covered Basement Slot',
    amenities: ['Lake Promenade', 'Infinity Pool', 'Gym & Aerobics Room', 'Mini Theatre', 'Banquet Hall'],
    description: 'Modern 3 BHK unit in a premium eco-friendly township. 5 minutes from Eco Park and City Centre 2, featuring water recycling, solar common lights, and multi-tier security.',
    maintenanceCharges: '₹3,500/month',
    featured: false,
    virtualTourAvailable: true
  },
  {
    id: 'prop-14',
    title: 'Executive 4 BHK Golf Course Residence',
    tagline: 'Direct golf course panorama with dedicated concierge desk',
    type: 'Apartment',
    category: 'Buy',
    bhk: 4,
    price: 32500000,
    priceFormatted: '₹3.25 Cr',
    pricePerSqft: 11607,
    area: 2800,
    locality: 'Golf Course Road',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122002',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'HRERA-GGM-774-2020',
    postedBy: 'Verified Agent',
    posterName: 'Gurgaon Prime Properties',
    posterPhone: '+91 98118 77655',
    postedDate: '3 days ago',
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    facing: 'North-East',
    floor: '18th of 30 Floors',
    bathrooms: 4,
    balconies: 4,
    parking: '2 Reserved Covered Slots',
    amenities: ['Golf Simulator', 'Temperature Controlled Pool', 'Steam & Sauna', 'Squash & Badminton', 'Driver Dormitory'],
    description: 'Luxurious 4 BHK condominium on coveted Golf Course Road. Expansive sunlit deck, double glazed acoustic glass windows, central climate control, and rapid metro station at the doorstep.',
    maintenanceCharges: '₹9,500/month',
    featured: true,
    virtualTourAvailable: true
  },
  {
    id: 'prop-15',
    title: 'Independent Studio Penthouse Suite',
    tagline: 'High-yield freehold studio suite in prime startup corridor',
    type: 'Studio Flat',
    category: 'Buy',
    bhk: 1,
    price: 4800000,
    priceFormatted: '₹48 Lakh',
    pricePerSqft: 13714,
    area: 350,
    locality: 'HSR Layout Sector 1',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560102',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    postedBy: 'Builder',
    posterName: 'Bangalore Realty Associates',
    posterPhone: '+91 80471 08899',
    postedDate: 'Yesterday',
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    facing: 'East',
    floor: '3rd of 5 Floors',
    bathrooms: 1,
    balconies: 1,
    parking: 'Dedicated Car Parking',
    amenities: ['100% Power Backup', 'High Speed Wi-Fi Ready', 'Covered Parking', 'Security Surveillance', 'Biometric Lock'],
    description: 'Premium freehold studio suite in Bangalore startup hub HSR. Includes private attached bathroom, work desk with ergonomic chair, wardrobe, and 24/7 security.',
    maintenanceCharges: '₹1,500/month',
    featured: false,
    virtualTourAvailable: false
  },
  {
    id: 'prop-16',
    title: 'Smart Tech 3 BHK Apartment',
    tagline: 'Next to SG Highway & GIFT City connecting corridor',
    type: 'Apartment',
    category: 'Buy',
    bhk: 3,
    price: 7800000,
    priceFormatted: '₹78 Lakh',
    pricePerSqft: 5200,
    area: 1500,
    locality: 'SG Highway',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380054',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    verified: true,
    reraId: 'PR/GJ/AHMEDABAD/2022/00911',
    postedBy: 'Builder',
    posterName: 'Goyal & Co Construction',
    posterPhone: '+91 79268 44330',
    postedDate: '5 days ago',
    furnishing: 'Unfurnished',
    possession: 'Ready to Move',
    facing: 'North',
    floor: '10th of 16 Floors',
    bathrooms: 3,
    balconies: 2,
    parking: '1 Covered Allotted Parking',
    amenities: ['Clubhouse & Gym', 'Senior Citizen Gazebo', 'Children Play Area', '24/7 Security CCTV', 'Piped Gas'],
    description: 'Spacious 3 BHK apartment with optimum natural light and cross ventilation. Close to Vaishnodevi Circle, top international schools, multispecialty hospitals, and SG Highway corporate hub.',
    maintenanceCharges: '₹2,400/month',
    featured: false,
    virtualTourAvailable: false
  }
];

export const NEW_PROJECTS_DATA: NewProject[] = [
  {
    id: 'proj-orion-132',
    name: 'Orion One 32 (Freeport Outlet Mall)',
    builder: 'Wellgrow Infotech / Orion Group',
    locality: 'Sector 132, Noida Expressway',
    city: 'Noida',
    priceRange: '₹82.80 Lakh - ₹2.50 Cr',
    units: 'Retail, Offices, Food Court & Studio Suites',
    possessionDate: 'Dec 2026',
    reraId: 'UPRERAPRJ960554',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    badge: '12% Assured Returns',
    launchOffer: '29-Yr Lease Guarantee with Freeport Retail London + Day-1 Rental Yield',
    highlights: [
      "India's 1st Freeport Outlet Mall with 100+ global outlet brands",
      "3-Acre Central Courtyard with Lake Promenade & 5 Thematic Beaches",
      "LEED Gold Rated Green Architecture with 8-ft air-cooled corridors"
    ]
  },
  {
    id: 'proj-1',
    name: 'Godrej Woods & Forest Groves',
    builder: 'Godrej Properties',
    locality: 'Sector 43',
    city: 'Noida',
    priceRange: '₹1.85 Cr - ₹4.50 Cr',
    units: '2, 3 & 4 BHK Luxury Apartments',
    possessionDate: 'Dec 2026',
    reraId: 'UPRERAPRJ704730',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    badge: 'Exclusive Launch',
    launchOffer: 'Pay 10% Now, Rest on Possession + Zero Registration Fee',
    highlights: ['Urban Forest of 1,100+ mature trees', 'Clubhouse with infinity edge pool', 'Adjacent to Noida Golf Course']
  },
  {
    id: 'proj-2',
    name: 'Prestige Kingfisher Towers & Estate',
    builder: 'Prestige Group',
    locality: 'Lavelle Road',
    city: 'Bangalore',
    priceRange: '₹3.20 Cr - ₹8.80 Cr',
    units: '3, 4 BHK & Sky Mansions',
    possessionDate: 'Ready / Oct 2026',
    reraId: 'PRM/KA/RERA/1251/310/PR/170915/000210',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    badge: 'Ultra Luxury',
    launchOffer: 'Complimentary modular Italian kitchen & VRV Air-conditioning',
    highlights: ['Overlooking Cubbon Park', 'Private elevators for every residence', 'Helipad on rooftop']
  },
  {
    id: 'proj-3',
    name: 'DLF The Camellias & Arbour Phase 2',
    builder: 'DLF Home Developers',
    locality: 'Golf Course Extension',
    city: 'Gurgaon',
    priceRange: '₹4.50 Cr - ₹16.00 Cr',
    units: '4 BHK Luxury Condos & Penthouses',
    possessionDate: 'June 2027',
    reraId: 'RC/REP/HARERA/GGM/715/447/2023/59',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    badge: 'Super Luxury Landmark',
    launchOffer: 'Early Bird ₹30 Lakh discount on first 25 bookings',
    highlights: ['7-tier biometric security', 'Personalized concierge by Quintessentially', '85% green cover']
  },
  {
    id: 'proj-4',
    name: 'Lodha World One & Park Towers',
    builder: 'Lodha Group / Macrotech',
    locality: 'Lower Parel / Worli',
    city: 'Mumbai',
    priceRange: '₹5.50 Cr - ₹25.00 Cr',
    units: '3, 4 & 5 BHK Signature Residences',
    possessionDate: 'Dec 2026',
    reraId: 'P51900008345',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    badge: 'Iconic Skyscraper',
    launchOffer: 'Special Stamp Duty 0% Subvention Scheme for 2026',
    highlights: ['Interiors curated by Armani/Casa', 'Private 7-acre private park in South Mumbai', 'Olympic-length heated pool']
  },
  {
    id: 'proj-5',
    name: 'Shapoorji Pallonji Joyville Park',
    builder: 'Shapoorji Pallonji Real Estate',
    locality: 'Hinjewadi Phase 1',
    city: 'Pune',
    priceRange: '₹65 Lakh - ₹1.45 Cr',
    units: '2 & 3 BHK Smart Living Homes',
    possessionDate: 'Mar 2027',
    reraId: 'P52100029988',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    badge: 'High Value Pick',
    launchOffer: 'No EMI till possession + Free 2-year maintenance',
    highlights: ['25+ Lifestyle amenities', '3 km to Infosys & Wipro campus', 'Air purification systems in master bedrooms']
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Vikram & Priya Sengupta',
    role: 'IT Director & Architect',
    location: 'Whitefield, Bangalore',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    review: 'PropertyLelo made our home buying process completely painless. The 100% verified status gave us confidence, and we connected directly with the builder without paying a single rupee of brokerage. Found our dream 3 BHK in just 10 days!',
    propertyPurchased: '3 BHK in Whitefield, Bangalore',
    verifiedTransaction: true
  },
  {
    id: 'test-2',
    name: 'Rajesh Agrawal',
    role: 'NRI Investor (Dubai)',
    location: 'Golf Course Road, Gurgaon',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    review: 'Investing in Indian real estate from abroad was always full of legal anxiety until I used PropertyLelo. Their team assisted with RERA verification, virtual 3D site tours, and handled loan approvals smoothly with SBI.',
    propertyPurchased: 'Commercial Office Suite in DLF Cyber City',
    verifiedTransaction: true
  },
  {
    id: 'test-3',
    name: 'Ananya Sharma',
    role: 'Senior Product Manager',
    location: 'Bandra West, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    review: 'The search filters and instant EMI calculator are miles ahead of traditional portals. I could filter exact ready-to-move apartments with verified floor plans. The direct owner contact saved us ₹1.5 Lakhs in broker fees.',
    propertyPurchased: '2 BHK Apartment in Andheri West',
    verifiedTransaction: true
  },
  {
    id: 'test-4',
    name: 'Col. Sanjeev Nair (Retd.)',
    role: 'Independent Villa Owner',
    location: 'Baner, Pune',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    review: 'Posted my Baner villa on PropertyLelo and received 14 qualified, genuine buyer enquiries within 48 hours. The verification badge on my listing filtered out time-wasters. Closed the deal at my expected valuation!',
    propertyPurchased: 'Sold 4 BHK Villa in Baner',
    verifiedTransaction: true
  },
  {
    id: 'test-5',
    name: 'Deepak & Sneha Reddy',
    role: 'Fintech Founder',
    location: 'Gachibowli, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    review: 'The micro-market price trend tool helped us time our purchase perfectly before the metro line expansion. Transparent, honest, and the cleanest real estate UI in India today.',
    propertyPurchased: '3.5 BHK in Gachibowli, Hyderabad',
    verifiedTransaction: true
  }
];

export const BLOG_ARTICLES_DATA: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'Top 5 Emerging Metro & Expressways Corridors in India for 2026-2028',
    slug: 'top-emerging-metro-expressway-corridors-india-2026',
    excerpt: 'Deep-dive analysis into infrastructure catalysts: Dwarka Expressway, Bangalore Airport Metro, Pune Ring Road, and Jewar Airport impact.',
    content: `## Infrastructure Catalysts Transforming Indian Real Estate in 2026

India's real estate sector is witnessing a monumental infrastructure boom. With mega connectivity projects nearing completion in 2026, property appreciation in peripheral growth hubs is outperforming traditional city centers.

### 1. Dwarka Expressway & Northern Peripheral Road (Delhi NCR)
Connecting Shiv Murti on NH-8 in Delhi to Kherki Daula toll plaza in Gurgaon, this 29-km expressway has transformed Sectors 102 through 113 into prime luxury corridors. Grade-A developers like Godrej, Sobha, and Tata have launched gated high-rises commanding upwards of ₹16,000/sq.ft.

### 2. Bengaluru Airport Metro Line (Blue Line Phase 2B)
Running from Silk Board through Hebbal to Kempegowda International Airport, this metro line is reducing commute times by 65%. Micro-markets along Bagalur, Hennur, and Yelahanka are experiencing 18-24% YoY capital gains.

### 3. Pune Ring Road & Hinjewadi-Shivajinagar Metro
Pune's IT talent influx has expanded demand toward Baner, Wakad, and Punawale. With the upcoming 128-km ring road and metro corridor, logistical bottlenecks are being eliminated.

### Key Investment Takeaway
Target RERA-certified projects with 18-24 months to possession located within 1.5 km of operational or upcoming transit nodes to capture peak value appreciation.`,
    category: 'Market Trends',
    readTime: '6 min read',
    date: 'Aug 18, 2026',
    authorId: 'team-editor-1',
    authorName: 'Sunil Rao',
    authorRole: 'Chief Research Analyst',
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    seo: {
      focusKeyword: 'emerging real estate corridors india 2026',
      metaTitle: 'Top 5 Emerging Real Estate Corridors in India 2026 | PropertyLelo',
      metaDescription: 'Explore the top real estate growth corridors across Delhi NCR, Bangalore, Mumbai, and Pune driven by Dwarka Expressway and airport metro lines.',
      canonicalUrl: 'https://propertylelo.com/insights/top-emerging-metro-expressway-corridors-india-2026',
      ogTitle: 'Top Emerging Real Estate Corridors in India (2026-2028)',
      ogDescription: 'Which cities offer highest capital appreciation in 2026? Check expert infrastructure analysis and verified RERA project recommendations.',
      ogImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      robotsIndex: true,
      robotsFollow: true,
      schemaType: 'Article'
    }
  },
  {
    id: 'blog-2',
    title: 'RERA Checklist: 7 Legal Documents First-Time Homebuyers Must Verify',
    slug: 'rera-checklist-7-legal-documents-homebuyers',
    excerpt: 'Avoid disputes by checking Encumbrance Certificate, Approved Master Plan, Occupancy Certificate (OC), and Title Deeds before signing.',
    content: `## The Ultimate Indian Real Estate Due Diligence Checklist

Buying a home is often the largest financial commitment of a lifetime. The Real Estate (Regulation and Development) Act (RERA) was introduced to safeguard buyer interests, yet due diligence on property title and builder approvals remains imperative.

### 1. State RERA Registration Number
Verify the project registration on the official state RERA portal (e.g., MahaRERA, UP-RERA, HRERA, Karnataka RERA). Cross-check project completion timelines, sanctioned floor plans, and promoter litigation history.

### 2. Title Deed & 30-Year Search Report
Ensure the seller or promoter holds clear, marketable title free from family inheritance disputes or mortgaged encumbrances. Insist on a registered title certificate verified by an independent advocate.

### 3. Encumbrance Certificate (EC)
Obtain the EC from the sub-registrar office covering at least 15–30 years. It proves that the property is free from legal dues, bank hypothecations, or unpaid municipal taxes.

### 4. Occupancy Certificate (OC) & Completion Certificate (CC)
Never take possession without an official OC issued by local civic authorities (e.g., MCD, BBMP, BMC, DTCP). Handover without OC is legally unauthorized and may result in disconnected electricity or water utilities.`,
    category: 'Legal Guide',
    readTime: '8 min read',
    date: 'Aug 14, 2026',
    authorId: 'team-editor-1',
    authorName: 'Adv. Meera Chawla',
    authorRole: 'Senior Property Advocate',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    seo: {
      focusKeyword: 'rera documents checklist home buyer india',
      metaTitle: 'RERA Checklist: 7 Legal Documents Every Buyer Must Check | PropertyLelo',
      metaDescription: 'Essential legal guide for Indian homebuyers: How to verify RERA ID, Encumbrance Certificate, Title Deed, and Occupancy Certificate.',
      canonicalUrl: 'https://propertylelo.com/insights/rera-checklist-7-legal-documents-homebuyers',
      ogTitle: 'RERA Legal Checklist for Homebuyers in India',
      ogDescription: 'Verify these 7 critical documents before putting down token money on an apartment or villa in India.',
      ogImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      robotsIndex: true,
      robotsFollow: true,
      schemaType: 'Article'
    }
  },
  {
    id: 'blog-3',
    title: 'Home Loan Tax Exemptions Under Section 24(b) & 80C in Union Budget 2026',
    slug: 'home-loan-tax-exemptions-section-24b-80c-2026',
    excerpt: 'Comprehensive guide to maximizing tax deductions on principal repayments, interest subsidies, and joint home ownership strategies.',
    content: `## How to Save Maximum Tax on Your Home Loan in FY 2026-27

For salaried and business professionals in India, a home loan provides substantial tax relief under both the Old and New Tax Regimes when planned smartly.

### 1. Section 24(b): Deduction on Home Loan Interest
You can claim up to ₹2,00,000 per financial year as a deduction on interest paid for a self-occupied property. For investment properties, the interest deduction can be claimed up to the actual interest paid against taxable income.

### 2. Section 80C: Principal Repayment Relief
Principal repayment, stamp duty charges, and registration fees paid during the year qualify under the overall ₹1,50,000 limit of Section 80C.

### 3. Joint Home Loan Strategy (Double Benefits)
If a married couple purchases property jointly and both are co-borrowers, both partners can independently claim up to ₹2 Lakh interest (₹4 Lakh total) and ₹1.5 Lakh principal (₹3 Lakh total), generating up to ₹7,00,000 in combined tax deductions!`,
    category: 'Tax & Finance',
    readTime: '5 min read',
    date: 'Aug 09, 2026',
    authorId: 'admin-shivam-9063',
    authorName: 'Kunal Joshi',
    authorRole: 'Chartered Accountant (CA)',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    seo: {
      focusKeyword: 'home loan tax exemption section 24b 80c 2026',
      metaTitle: 'Home Loan Tax Exemptions Guide 2026: Section 24(b) & 80C | PropertyLelo',
      metaDescription: 'Maximize tax savings on home loan interest and principal repayments in Union Budget 2026. Joint loan strategies explained by CA experts.',
      canonicalUrl: 'https://propertylelo.com/insights/home-loan-tax-exemptions-section-24b-80c-2026',
      ogTitle: 'Home Loan Tax Benefits & Exemption Rules (2026)',
      ogDescription: 'Learn how to claim up to ₹7 Lakhs in joint tax deductions on your home loan under current income tax slabs.',
      ogImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      robotsIndex: true,
      robotsFollow: true,
      schemaType: 'Article'
    }
  },
  {
    id: 'blog-ncr-1',
    title: 'Delhi NCR Real Estate Investment Guide 2026-2027: Top High-Growth Localities in Noida vs Gurgaon, Price Trends & RERA Projects',
    slug: 'delhi-ncr-real-estate-investment-guide-noida-vs-gurgaon-2026',
    excerpt: 'The ultimate 2026 investment comparison between Noida and Gurgaon. Discover top appreciation corridors like Dwarka Expressway, Sector 150 Noida, Golf Course Ext Road, and Jewar Airport Aerocity with verified price data.',
    content: `## Delhi NCR Real Estate Market Outlook (2026–2027)

The National Capital Region (NCR) continues to be Northern India's economic engine and the country's most active property investment arena. With massive infrastructure investments crystallizing in 2026—including the operational Dwarka Expressway, the expansion of the Delhi-Mumbai Industrial Corridor, and the forthcoming commercial flight operations at Noida International Airport (Jewar)—property valuations across prime micro-markets have demonstrated exceptional resilience and double-digit capital appreciation.

For homebuyers and institutional investors evaluating Delhi NCR real estate, the central debate remains: **Should you invest in Gurgaon or Noida?** This comprehensive, data-backed guide unpacks the pros, cons, rental yields, price trends, and top high-ROI corridors in both regions.

---

### Gurgaon vs. Noida: 2026 Macro Comparison

| Metric | Gurgaon (Cyber Hub & Expressways) | Noida & Greater Noida |
| :--- | :--- | :--- |
| **Average Price Range** | ₹14,500 – ₹28,000 / sq.ft | ₹7,500 – ₹16,500 / sq.ft |
| **Gross Rental Yield** | 3.8% – 4.8% (Corporate IT & BFSI) | 3.0% – 3.8% (Student & IT hubs) |
| **Key Catalysts** | Dwarka Expressway, SPR, Cyber City 2.0 | Jewar Airport, Yamuna Expressway, FNG |
| **Planned Infrastructure** | Patchwork urban expansion | Master-planned wide grid roads & green sectors |
| **Entry Capital (2/3 BHK)** | ₹1.60 Cr – ₹4.50 Cr | ₹85 Lakh – ₹2.50 Cr |

---

### Top 4 High-Growth Investment Corridors in Gurgaon

#### 1. Dwarka Expressway (Sectors 102 to 113)
The 8-lane elevated expressway has emerged as Delhi NCR's most prestigious luxury residential belt. Connecting Shiv Murti on NH-8 (Mahipalpur) to the cloverleaf interchange at Kherki Daula, this corridor offers rapid 15-minute access to Indira Gandhi International (IGI) Airport Terminal 3. Grade-A developers like Godrej, Sobha, DLF, and Puri have developed gated communities here with average price points appreciating from ₹10,500/sq.ft in 2023 to over ₹18,000/sq.ft in 2026.

#### 2. Golf Course Extension Road & Southern Peripheral Road (SPR)
Established as the new corporate and luxury address of Millennium City, Sectors 58 to 67 boast proximity to Grand Hyatt, Horizon Center, and top international schools. With average capital values exceeding ₹22,000/sq.ft, this corridor commands the highest corporate executive rentals in NCR.

#### 3. New Gurgaon (Sectors 82 to 95)
Offering a sweet spot between affordability and seamless connectivity to the Delhi-Jaipur highway, New Gurgaon provides family-centric gated townships with high green cover, clubhouse infrastructure, and attractive entry points for first-time buyers.

---

### Top 4 High-Growth Investment Corridors in Noida & Greater Noida

#### 1. Noida-Greater Noida Expressway (Sectors 128 to 150)
The 24-kilometer expressway is the premier arterial spine of Gautam Buddha Nagar. It hosts top IT campuses including TCS, Infosys, Adobe, and HCL Technologies alongside institutions like Amity University.
- **Sector 150 (Sports City)**: Widely recognized as the greenest sector in NCR with 70% mandatory open green spaces, zero overhead electrical wiring, and high-rise condominiums by Ace, Godrej, and Tata.
- **Sector 132 & 135**: Prime mixed-use commercial and institutional hub with Grade-A retail complexes like Orion One 32 and high corporate footfalls.

#### 2. Yamuna Expressway & Jewar Airport Aerocity
Positioned along the 165-km expressway connecting Greater Noida with Agra, this zone is experiencing unprecedented land appreciation. The operational milestones of the multi-runway Noida International Airport, the upcoming International Film City, and Olympic City have made Sectors 18, 20, and 22D the hottest land and plotted development corridors in North India.

#### 3. Greater Noida West (Noida Extension)
For end-users seeking ready-to-move 2 BHK and 3 BHK homes under ₹90 Lakhs, Greater Noida West offers unmatched scale, operational shopping malls, and upcoming metro connectivity to Aqua Line.

---

### 5 Golden Rules for Investing in Delhi NCR Real Estate

1. **Mandatory RERA Verification**: Always check state approval numbers on the official UP-RERA (up-rera.in) or HRERA Gurugram (haryanarera.gov.in) portal. Never invest in projects lacking valid registration.
2. **Transit Proximity**: Properties situated within a 1.5 km radius of an operational or approved metro station or expressway interchange appreciate 25–40% faster than isolated projects.
3. **Audit Developer Solvency**: Prioritize Grade-A builders with verified debt-free balance sheets and proven track records of on-time delivery with Occupancy Certificates (OC).
4. **Choose Zero Brokerage Platforms**: Use platforms like PropertyLelo to deal directly with verified owners and developers, saving ₹2 Lakh to ₹8 Lakhs in middleman broker fees.
5. **Verify Encumbrance and Circle Rates**: Ensure the property holds a clean 30-year search title report and that your purchase price aligns with prevailing government circle rates for fair registry stamp valuations.`,
    category: 'Delhi NCR Special',
    readTime: '9 min read',
    date: 'Oct 10, 2026',
    authorId: 'team-editor-ncr',
    authorName: 'Vikramaditya Singhal',
    authorRole: 'Head of NCR Real Estate Research',
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    seo: {
      focusKeyword: 'real estate ncr investment noida vs gurgaon',
      metaTitle: 'Delhi NCR Real Estate Guide 2026: Noida vs Gurgaon Investment | PropertyLelo',
      metaDescription: 'Complete 2026 Delhi NCR real estate guide: Compare Noida vs Gurgaon property prices, rental yields, Dwarka Expressway, Sector 150, and Jewar Airport appreciation.',
      canonicalUrl: 'https://propertylelo.com/insights/delhi-ncr-real-estate-investment-guide-noida-vs-gurgaon-2026',
      ogTitle: 'Delhi NCR Real Estate Guide 2026: Noida vs Gurgaon Investment Hotspots',
      ogDescription: 'Which city offers better ROI in 2026? Check comprehensive price trends, infrastructure catalysts, and top RERA-verified projects.',
      ogImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
      robotsIndex: true,
      robotsFollow: true,
      schemaType: 'Article'
    }
  },
  {
    id: 'blog-ncr-2',
    title: 'How to Buy Property in Delhi NCR with Zero Brokerage: Complete 2026 Homebuyer\'s Blueprint',
    slug: 'buy-property-delhi-ncr-zero-brokerage-noida-gurgaon-guide',
    excerpt: 'Learn how smart Delhi NCR homebuyers are saving ₹2 Lakhs to ₹10 Lakhs in middleman commissions. Essential legal guide covering UP-RERA & HRERA verification, registry charges, and direct owner negotiation.',
    content: `## The Zero Brokerage Revolution in Delhi NCR Real Estate

For decades, buying an apartment, builder floor, or commercial space across Delhi, Noida, or Gurgaon meant paying hefty 1% to 2% commissions to local property brokers. On a standard ₹1.5 Crore residential flat, a buyer ends up shelling out **₹3,00,000 to ₹4,00,000 just in broker fees**—often for nothing more than unlocking a front door.

Today, digitized real estate marketplaces like **PropertyLelo** are transforming property acquisition across Delhi NCR. Homebuyers can now browse 100% verified listings, schedule direct site visits with property owners, and access official builder inventory with **absolute zero brokerage**.

Here is the exact step-by-step blueprint to purchase your dream home in Delhi NCR while keeping your hard-earned savings intact.

---

### Understanding the Savings: What 0% Brokerage Means in Rupees

| Property Valuation | Traditional Broker Fee (2%) | PropertyLelo Zero Brokerage | Total Buyer Savings |
| :--- | :--- | :--- | :--- |
| **₹60 Lakh (1/2 BHK Noida Ext)** | ₹1,20,000 | **₹0** | **₹1,20,000 saved** |
| **₹1.20 Cr (3 BHK Sector 150)** | ₹2,40,000 | **₹0** | **₹2,40,000 saved** |
| **₹2.50 Cr (3 BHK Dwarka Exp)** | ₹5,00,000 | **₹0** | **₹5,00,000 saved** |
| **₹5.00 Cr (Luxury Villa Gurgaon)** | ₹10,00,000 | **₹0** | **₹10,00,000 saved** |

Those saved funds can fully cover your registration stamp duty, modular kitchen interiors, or legal retainer fees!

---

### Step 1: Filter for Verified Direct-Owner and Builder Inventory

When browsing listings on PropertyLelo:
- Look for the **"Verified" green badge**, which confirms that property ownership deeds, tax receipts, or builder allotment letters have been authenticated.
- Use the **"Direct from Owner"** or **"Direct Builder RERA"** filter to eliminate intermediaries.
- Request instant virtual tours or schedule automated site visits directly with the landlord or developer sales office.

---

### Step 2: Validate UP-RERA and HRERA Legal Registrations

Never hand over a booking token without authenticating the project on state regulatory portals:
- **Noida, Greater Noida & Ghaziabad**: Visit the **UP-RERA portal (up-rera.in)**. Check the project registration number (e.g. UPRERAPRJ...), verify the sanctioned floor plans, promoter bank escrow account, and past completion track record.
- **Gurgaon & Faridabad**: Visit the **HRERA portal (haryanarera.gov.in)** to confirm Haryana Real Estate Regulatory Authority approvals.

---

### Step 3: Understand Registry Stamp Duty Charges in NCR (2026 Rules)

Stamp duty and registry fees differ substantially across Delhi NCR states:

- **Noida & Greater Noida (Uttar Pradesh)**:
  - Stamp Duty: 7% of property valuation (or circle rate, whichever is higher).
  - Women buyers receive a 1% rebate on properties up to ₹10 Lakhs.
  - Registration Fee: 1% capped at ₹20,000.
- **Gurgaon & Faridabad (Haryana)**:
  - Male Buyers: 7% (5% in municipal areas).
  - Female Buyers: 5% (3% in municipal areas).
  - Joint Ownership (Male + Female): 6%.
- **New Delhi**:
  - Male: 6% + 1% registration.
  - Female: 4% + 1% registration.
  - Joint: 5% + 1% registration.

---

### Step 4: Conduct a 30-Year Title Search and Encumbrance Audit

Before signing the Agreement for Sale (BBA):
1. **Title Deed (Sale Deed / Conveyance Deed)**: Confirm unbroken chain of title documents going back 30 years.
2. **Encumbrance Certificate (EC)**: Ensure the property is free of bank hypothecations, legal attachment, or unpaid maintenance dues.
3. **Occupancy Certificate (OC)**: For ready-to-move properties, never take possession without an OC issued by NOIDA, GNIDA, or DTCP Haryana.
4. **No Objection Certificate (NOC)**: Obtain NOC from the registered Resident Welfare Association (RWA) or maintenance agency.

---

### Step 5: Negotiate Price Directly Like a Pro

Dealing without a broker gives you superior bargaining leverage:
- Inquire about developer subvention or festive cashback schemes directly from builder desks.
- For resale properties, verify recent registry circle rates in the sub-registrar office to ensure you never overpay.
- Use PropertyLelo's built-in **City Price Trends & EMI Calculator** to evaluate loan eligibility and compare historic appreciation rates across sectors.

---

### Red Flags to Avoid in Delhi NCR

- **Lal Dora Land**: Avoid unapproved residential constructions on abadi land without clear bank loan approvals.
- **Unauthorized Floors without Registry**: Ensure the floor you purchase is legally sanctioned under master building bylaws.
- **Cash Component Pressure**: Insist on 100% white banking transactions via RTGS/cheque to safeguard your legal standing and income tax compliance.

### Conclusion

Buying a home in Delhi NCR is now simpler, safer, and hundreds of thousands of rupees cheaper. Start your verified zero-brokerage property search on PropertyLelo today!`,
    category: 'Delhi NCR Special',
    readTime: '8 min read',
    date: 'Oct 08, 2026',
    authorId: 'team-editor-legal',
    authorName: 'Adv. Pooja Malhotra',
    authorRole: 'Senior Real Estate Legal Consultant',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    seo: {
      focusKeyword: 'buy property in delhi ncr zero brokerage',
      metaTitle: 'Buy Property in Delhi NCR with Zero Brokerage: 2026 Guide | PropertyLelo',
      metaDescription: 'Save up to ₹10 Lakhs in broker commissions! The definitive 2026 guide to buying verified flats and commercial properties in Noida, Gurgaon & Delhi NCR with zero brokerage.',
      canonicalUrl: 'https://propertylelo.com/insights/buy-property-delhi-ncr-zero-brokerage-noida-gurgaon-guide',
      ogTitle: 'Buy Property in Delhi NCR with Zero Brokerage: 2026 Complete Blueprint',
      ogDescription: 'Step-by-step buyer guide: Save lakhs in broker commissions, check UP-RERA & HRERA approvals, and navigate stamp duty in Noida & Gurgaon.',
      ogImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      robotsIndex: true,
      robotsFollow: true,
      schemaType: 'Article'
    }
  }
];

export const ARTICLES_DATA: Article[] = BLOG_ARTICLES_DATA.map(b => ({
  id: b.id,
  title: b.title,
  excerpt: b.excerpt,
  category: b.category,
  readTime: b.readTime,
  date: b.date,
  author: b.authorName,
  image: b.coverImage
}));

export const CITY_PRICE_TRENDS = [
  { year: '2020', 'Delhi NCR': 6200, Mumbai: 18500, Bangalore: 5400, Pune: 4900, Hyderabad: 4800 },
  { year: '2021', 'Delhi NCR': 6500, Mumbai: 19100, Bangalore: 5800, Pune: 5200, Hyderabad: 5300 },
  { year: '2022', 'Delhi NCR': 7100, Mumbai: 20200, Bangalore: 6400, Pune: 5600, Hyderabad: 5900 },
  { year: '2023', 'Delhi NCR': 7600, Mumbai: 21100, Bangalore: 7100, Pune: 6100, Hyderabad: 6500 },
  { year: '2024', 'Delhi NCR': 8100, Mumbai: 22000, Bangalore: 7500, Pune: 6500, Hyderabad: 6900 },
  { year: '2025', 'Delhi NCR': 8450, Mumbai: 22800, Bangalore: 7950, Pune: 6800, Hyderabad: 7200 },
  { year: '2026', 'Delhi NCR': 8900, Mumbai: 23600, Bangalore: 8400, Pune: 7200, Hyderabad: 7650 },
];

export const AREA_CONVERSIONS = {
  sqft: 1,
  sqm: 10.7639,
  sqyd: 9, // Gaj
  acre: 43560,
  bigha: 27000, // Standard Northern India average
  guntha: 1089, // Western India (Maharashtra/Karnataka)
  cent: 435.6, // South India (Tamil Nadu/Kerala)
};
