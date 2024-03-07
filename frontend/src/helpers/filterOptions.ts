export const priceRangeValue = [
  { value: undefined, label: "All" },
  { value: "[0, 499]", label: "Below 500 million" },
  { value: "[500, 800]", label: "500 - 800 million" },
  { value: "[800, 1000]", label: "800 million - 1 billion" },
  { value: "[1000, 2000]", label: "1 billion - 2 billion" },
  { value: "[2000]", label: "Above 2 billion" }
]

export const priceRangeValueDetail = [
  { value: "[0, 499]", label: "Below 500 million" },
  { value: "[500, 800]", label: "500 - 800 million" },
  { value: "[800, 1000]", label: "800 million - 1 billion" },
  { value: "[1000, 2000]", label: "1 billion - 2 billion" },
  { value: "[2000, 3000]", label: "2 billion - 3 billion" },
  { value: "[3000, 5000]", label: "3 billion - 5 billion" },
  { value: "[5000, 7000]", label: "5 billion - 7 billion" },
  { value: "[7000, 10000]", label: "7 billion - 10 billion" },
  { value: "[10000, 20000]", label: "10 billion - 20 billion" },
  { value: "[20000, 30000]", label: "20 billion - 30 billion" },
  { value: "[30000, 40000]", label: "30 billion - 40 billion" },
  { value: "[40000, 60000]", label: "40 billion - 60 billion" },
  { value: "[60000]", label: "Above 60 billion" }
]

export const areaRangeValue = [
  { value: undefined, label: "All" },
  { value: "[0, 29]", label: "Below 30 m²" },
  { value: "[30, 50]", label: "30 - 50 m²" },
  { value: "[50, 80]", label: "50 - 80 m²" },
  { value: "[80, 100]", label: "80 - 100 m²" },
  { value: "[100]", label: "Above 100 m²" }
]

export const areaRangeValueDetail = [
  { value: "[0, 29]", label: "Below 30 m²" },
  { value: "[30, 50]", label: "30 - 50 m²" },
  { value: "[50, 80]", label: "50 - 80 m²" },
  { value: "[80, 100]", label: "80 - 100 m²" },
  { value: "[100, 150]", label: "100 - 150 m²" },
  { value: "[150, 200]", label: "150 - 200 m²" },
  { value: "[200, 250]", label: "200 - 250 m²" },
  { value: "[250, 300]", label: "250 - 300 m²" },
  { value: "[300, 500]", label: "300 - 500 m²" },
  { value: "[500]", label: "Above 500 m²" }
]

export const directionValues = [
  { name: "North", value: 1 },
  { name: "East", value: 1 },
  { name: "South", value: 1 },
  { name: "West", value: 1 },
  { name: "Northeast", value: 1 },
  { name: "Southeast", value: 1 },
  { name: "Northwest", value: 1 },
  { name: "Southwest", value: 1 }
];

export const sortingOptionsAdmin = [
  { label: 'Descending position', value: 'position-desc' },
  { label: 'Ascending position', value: 'position-asc' },
  { label: 'Descending price', value: 'price-desc' },
  { label: 'Ascending price', value: 'price-asc' },
  { label: 'Descending view', value: 'view-desc' },
  { label: 'Ascending view', value: 'view-asc' },
];

export const sortingOptionsClient = [
  { label: 'Descending price', value: 'price-desc' },
  { label: 'Ascending price', value: 'price-asc' },
  { label: 'Descending area', value: 'area-desc' },
  { label: 'Ascending area', value: 'area-asc' },
  { label: 'Most view', value: 'view-desc' },
];