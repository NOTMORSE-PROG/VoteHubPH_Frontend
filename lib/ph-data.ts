// Philippine location data
export interface Barangay {
  id: string
  name: string
  cityId: string
}

export interface City {
  id: string
  name: string
  regionId: string
  type: "city" | "municipality"
}

export interface Region {
  id: string
  name: string
  code: string
}

export const regions: Region[] = [
  { id: "1", name: "National Capital Region (NCR)", code: "NCR" },
  { id: "2", name: "Cordillera Administrative Region (CAR)", code: "CAR" },
  { id: "3", name: "Ilocos Region (Region I)", code: "I" },
  { id: "4", name: "Cagayan Valley (Region II)", code: "II" },
  { id: "5", name: "Central Luzon (Region III)", code: "III" },
  { id: "6", name: "CALABARZON (Region IV-A)", code: "IV-A" },
  { id: "7", name: "MIMAROPA (Region IV-B)", code: "IV-B" },
  { id: "8", name: "Bicol Region (Region V)", code: "V" },
  { id: "9", name: "Western Visayas (Region VI)", code: "VI" },
  { id: "10", name: "Central Visayas (Region VII)", code: "VII" },
  { id: "11", name: "Eastern Visayas (Region VIII)", code: "VIII" },
  { id: "12", name: "Zamboanga Peninsula (Region IX)", code: "IX" },
  { id: "13", name: "Northern Mindanao (Region X)", code: "X" },
  { id: "14", name: "Davao Region (Region XI)", code: "XI" },
  { id: "15", name: "SOCCSKSARGEN (Region XII)", code: "XII" },
  { id: "16", name: "Caraga (Region XIII)", code: "XIII" },
  { id: "17", name: "Bangsamoro (BARMM)", code: "BARMM" },
]

export const cities: City[] = [
  // NCR - All 16 cities and 1 municipality
  { id: "c1", name: "Manila", regionId: "1", type: "city" },
  { id: "c2", name: "Quezon City", regionId: "1", type: "city" },
  { id: "c3", name: "Makati", regionId: "1", type: "city" },
  { id: "c4", name: "Pasig", regionId: "1", type: "city" },
  { id: "c5", name: "Taguig", regionId: "1", type: "city" },
  { id: "c6", name: "Pasay", regionId: "1", type: "city" },
  { id: "c7", name: "Caloocan", regionId: "1", type: "city" },
  { id: "c8", name: "Marikina", regionId: "1", type: "city" },
  { id: "c9", name: "Parañaque", regionId: "1", type: "city" },
  { id: "c10", name: "Las Piñas", regionId: "1", type: "city" },
  { id: "c11", name: "Muntinlupa", regionId: "1", type: "city" },
  { id: "c12", name: "Valenzuela", regionId: "1", type: "city" },
  { id: "c13", name: "Malabon", regionId: "1", type: "city" },
  { id: "c14", name: "Navotas", regionId: "1", type: "city" },
  { id: "c15", name: "San Juan", regionId: "1", type: "city" },
  { id: "c16", name: "Mandaluyong", regionId: "1", type: "city" },
  { id: "c17", name: "Pateros", regionId: "1", type: "municipality" },

  // CAR
  { id: "c18", name: "Baguio", regionId: "2", type: "city" },
  { id: "c19", name: "Tabuk", regionId: "2", type: "city" },
  { id: "c20", name: "La Trinidad", regionId: "2", type: "municipality" },

  // Ilocos Region
  { id: "c21", name: "Laoag", regionId: "3", type: "city" },
  { id: "c22", name: "Vigan", regionId: "3", type: "city" },
  { id: "c23", name: "San Fernando (La Union)", regionId: "3", type: "city" },
  { id: "c24", name: "Dagupan", regionId: "3", type: "city" },
  { id: "c25", name: "Urdaneta", regionId: "3", type: "city" },

  // Cagayan Valley
  { id: "c26", name: "Tuguegarao", regionId: "4", type: "city" },
  { id: "c27", name: "Ilagan", regionId: "4", type: "city" },
  { id: "c28", name: "Cauayan", regionId: "4", type: "city" },
  { id: "c29", name: "Santiago", regionId: "4", type: "city" },

  // Central Luzon
  { id: "c30", name: "Angeles", regionId: "5", type: "city" },
  { id: "c31", name: "San Fernando (Pampanga)", regionId: "5", type: "city" },
  { id: "c32", name: "Olongapo", regionId: "5", type: "city" },
  { id: "c33", name: "Malolos", regionId: "5", type: "city" },
  { id: "c34", name: "Cabanatuan", regionId: "5", type: "city" },
  { id: "c35", name: "Tarlac City", regionId: "5", type: "city" },

  // CALABARZON
  { id: "c36", name: "Antipolo", regionId: "6", type: "city" },
  { id: "c37", name: "Batangas City", regionId: "6", type: "city" },
  { id: "c38", name: "Lipa", regionId: "6", type: "city" },
  { id: "c39", name: "Lucena", regionId: "6", type: "city" },
  { id: "c40", name: "Calamba", regionId: "6", type: "city" },
  { id: "c41", name: "Santa Rosa", regionId: "6", type: "city" },
  { id: "c42", name: "Biñan", regionId: "6", type: "city" },
  { id: "c43", name: "Dasmariñas", regionId: "6", type: "city" },
  { id: "c44", name: "Bacoor", regionId: "6", type: "city" },
  { id: "c45", name: "Imus", regionId: "6", type: "city" },
  { id: "c46", name: "Cavite City", regionId: "6", type: "city" },

  // MIMAROPA
  { id: "c47", name: "Puerto Princesa", regionId: "7", type: "city" },
  { id: "c48", name: "Calapan", regionId: "7", type: "city" },
  { id: "c49", name: "San Jose", regionId: "7", type: "municipality" },

  // Bicol Region
  { id: "c50", name: "Naga", regionId: "8", type: "city" },
  { id: "c51", name: "Legazpi", regionId: "8", type: "city" },
  { id: "c52", name: "Iriga", regionId: "8", type: "city" },
  { id: "c53", name: "Ligao", regionId: "8", type: "city" },
  { id: "c54", name: "Tabaco", regionId: "8", type: "city" },

  // Western Visayas
  { id: "c55", name: "Iloilo City", regionId: "9", type: "city" },
  { id: "c56", name: "Bacolod", regionId: "9", type: "city" },
  { id: "c57", name: "Roxas", regionId: "9", type: "city" },
  { id: "c58", name: "Kalibo", regionId: "9", type: "municipality" },

  // Central Visayas
  { id: "c59", name: "Cebu City", regionId: "10", type: "city" },
  { id: "c60", name: "Mandaue", regionId: "10", type: "city" },
  { id: "c61", name: "Lapu-Lapu", regionId: "10", type: "city" },
  { id: "c62", name: "Talisay", regionId: "10", type: "city" },
  { id: "c63", name: "Danao", regionId: "10", type: "city" },
  { id: "c64", name: "Tagbilaran", regionId: "10", type: "city" },
  { id: "c65", name: "Dumaguete", regionId: "10", type: "city" },

  // Eastern Visayas
  { id: "c66", name: "Tacloban", regionId: "11", type: "city" },
  { id: "c67", name: "Ormoc", regionId: "11", type: "city" },
  { id: "c68", name: "Calbayog", regionId: "11", type: "city" },
  { id: "c69", name: "Catbalogan", regionId: "11", type: "city" },
  { id: "c70", name: "Borongan", regionId: "11", type: "city" },

  // Zamboanga Peninsula
  { id: "c71", name: "Zamboanga City", regionId: "12", type: "city" },
  { id: "c72", name: "Pagadian", regionId: "12", type: "city" },
  { id: "c73", name: "Dipolog", regionId: "12", type: "city" },
  { id: "c74", name: "Dapitan", regionId: "12", type: "city" },

  // Northern Mindanao
  { id: "c75", name: "Cagayan de Oro", regionId: "13", type: "city" },
  { id: "c76", name: "Iligan", regionId: "13", type: "city" },
  { id: "c77", name: "Malaybalay", regionId: "13", type: "city" },
  { id: "c78", name: "Valencia", regionId: "13", type: "city" },
  { id: "c79", name: "Oroquieta", regionId: "13", type: "city" },
  { id: "c80", name: "Ozamiz", regionId: "13", type: "city" },

  // Davao Region
  { id: "c81", name: "Davao City", regionId: "14", type: "city" },
  { id: "c82", name: "Tagum", regionId: "14", type: "city" },
  { id: "c83", name: "Panabo", regionId: "14", type: "city" },
  { id: "c84", name: "Digos", regionId: "14", type: "city" },
  { id: "c85", name: "Mati", regionId: "14", type: "city" },

  // SOCCSKSARGEN
  { id: "c86", name: "General Santos", regionId: "15", type: "city" },
  { id: "c87", name: "Koronadal", regionId: "15", type: "city" },
  { id: "c88", name: "Tacurong", regionId: "15", type: "city" },
  { id: "c89", name: "Kidapawan", regionId: "15", type: "city" },

  // Caraga
  { id: "c90", name: "Butuan", regionId: "16", type: "city" },
  { id: "c91", name: "Surigao City", regionId: "16", type: "city" },
  { id: "c92", name: "Tandag", regionId: "16", type: "city" },
  { id: "c93", name: "Bislig", regionId: "16", type: "city" },
  { id: "c94", name: "Bayugan", regionId: "16", type: "city" },

  // BARMM
  { id: "c95", name: "Cotabato City", regionId: "17", type: "city" },
  { id: "c96", name: "Marawi", regionId: "17", type: "city" },
  { id: "c97", name: "Lamitan", regionId: "17", type: "city" },
]

export const barangays: Barangay[] = [
  // Manila (c1)
  { id: "b1", name: "Ermita", cityId: "c1" },
  { id: "b2", name: "Malate", cityId: "c1" },
  { id: "b3", name: "Intramuros", cityId: "c1" },
  { id: "b4", name: "Binondo", cityId: "c1" },
  { id: "b5", name: "Sampaloc", cityId: "c1" },
  { id: "b6", name: "Tondo", cityId: "c1" },
  { id: "b7", name: "Quiapo", cityId: "c1" },
  { id: "b8", name: "San Miguel", cityId: "c1" },
  { id: "b9", name: "Paco", cityId: "c1" },
  { id: "b10", name: "Pandacan", cityId: "c1" },
  { id: "b11", name: "Santa Cruz", cityId: "c1" },
  { id: "b12", name: "Santa Ana", cityId: "c1" },

  // Quezon City (c2)
  { id: "b13", name: "Bagong Pag-asa", cityId: "c2" },
  { id: "b14", name: "Batasan Hills", cityId: "c2" },
  { id: "b15", name: "Commonwealth", cityId: "c2" },
  { id: "b16", name: "Cubao", cityId: "c2" },
  { id: "b17", name: "Diliman", cityId: "c2" },
  { id: "b18", name: "Fairview", cityId: "c2" },
  { id: "b19", name: "Kamuning", cityId: "c2" },
  { id: "b20", name: "Novaliches", cityId: "c2" },
  { id: "b21", name: "Project 4", cityId: "c2" },
  { id: "b22", name: "Tandang Sora", cityId: "c2" },
  { id: "b23", name: "Payatas", cityId: "c2" },
  { id: "b24", name: "Sauyo", cityId: "c2" },
  { id: "b25", name: "Talipapa", cityId: "c2" },
  { id: "b26", name: "Bagbag", cityId: "c2" },

  // Makati (c3)
  { id: "b27", name: "Bel-Air", cityId: "c3" },
  { id: "b28", name: "Poblacion", cityId: "c3" },
  { id: "b29", name: "San Lorenzo", cityId: "c3" },
  { id: "b30", name: "Urdaneta", cityId: "c3" },
  { id: "b31", name: "Valenzuela", cityId: "c3" },
  { id: "b32", name: "Guadalupe Nuevo", cityId: "c3" },
  { id: "b33", name: "Guadalupe Viejo", cityId: "c3" },
  { id: "b34", name: "Magallanes", cityId: "c3" },
  { id: "b35", name: "Dasmariñas", cityId: "c3" },
  { id: "b36", name: "Forbes Park", cityId: "c3" },

  // Pasig (c4)
  { id: "b37", name: "Kapitolyo", cityId: "c4" },
  { id: "b38", name: "Ortigas", cityId: "c4" },
  { id: "b39", name: "Rosario", cityId: "c4" },
  { id: "b40", name: "Ugong", cityId: "c4" },
  { id: "b41", name: "Manggahan", cityId: "c4" },
  { id: "b42", name: "Santolan", cityId: "c4" },
  { id: "b43", name: "Pinagbuhatan", cityId: "c4" },
  { id: "b44", name: "Maybunga", cityId: "c4" },

  // Taguig (c5)
  { id: "b45", name: "Bonifacio Global City", cityId: "c5" },
  { id: "b46", name: "Fort Bonifacio", cityId: "c5" },
  { id: "b47", name: "Hagonoy", cityId: "c5" },
  { id: "b48", name: "Ligid-Tipas", cityId: "c5" },
  { id: "b49", name: "Lower Bicutan", cityId: "c5" },
  { id: "b50", name: "Upper Bicutan", cityId: "c5" },
  { id: "b51", name: "Western Bicutan", cityId: "c5" },
  { id: "b52", name: "Signal Village", cityId: "c5" },

  // Cebu City (c59)
  { id: "b53", name: "Lahug", cityId: "c59" },
  { id: "b54", name: "Mabolo", cityId: "c59" },
  { id: "b55", name: "Talamban", cityId: "c59" },
  { id: "b56", name: "Banilad", cityId: "c59" },
  { id: "b57", name: "Guadalupe", cityId: "c59" },
  { id: "b58", name: "Kasambagan", cityId: "c59" },
  { id: "b59", name: "Capitol Site", cityId: "c59" },
  { id: "b60", name: "Apas", cityId: "c59" },
  { id: "b61", name: "Busay", cityId: "c59" },
  { id: "b62", name: "Tisa", cityId: "c59" },

  // Davao City (c81)
  { id: "b63", name: "Poblacion", cityId: "c81" },
  { id: "b64", name: "Buhangin", cityId: "c81" },
  { id: "b65", name: "Matina", cityId: "c81" },
  { id: "b66", name: "Talomo", cityId: "c81" },
  { id: "b67", name: "Agdao", cityId: "c81" },
  { id: "b68", name: "Toril", cityId: "c81" },
  { id: "b69", name: "Calinan", cityId: "c81" },
  { id: "b70", name: "Paquibato", cityId: "c81" },
  { id: "b71", name: "Baguio District", cityId: "c81" },
  { id: "b72", name: "Catalunan Grande", cityId: "c81" },

  // Baguio (c18)
  { id: "b73", name: "Session Road", cityId: "c18" },
  { id: "b74", name: "Burnham Park", cityId: "c18" },
  { id: "b75", name: "Camp 7", cityId: "c18" },
  { id: "b76", name: "Camp Allen", cityId: "c18" },
  { id: "b77", name: "Dominican Hill", cityId: "c18" },
  { id: "b78", name: "Loakan", cityId: "c18" },

  // Cagayan de Oro (c75)
  { id: "b79", name: "Carmen", cityId: "c75" },
  { id: "b80", name: "Lapasan", cityId: "c75" },
  { id: "b81", name: "Macasandig", cityId: "c75" },
  { id: "b82", name: "Nazareth", cityId: "c75" },
  { id: "b83", name: "Patag", cityId: "c75" },
  { id: "b84", name: "Puerto", cityId: "c75" },

  // Iloilo City (c55)
  { id: "b85", name: "City Proper", cityId: "c55" },
  { id: "b86", name: "Jaro", cityId: "c55" },
  { id: "b87", name: "Molo", cityId: "c55" },
  { id: "b88", name: "Mandurriao", cityId: "c55" },
  { id: "b89", name: "Arevalo", cityId: "c55" },
  { id: "b90", name: "La Paz", cityId: "c55" },

  // Bacolod (c56)
  { id: "b91", name: "Barangay 1", cityId: "c56" },
  { id: "b92", name: "Mandalagan", cityId: "c56" },
  { id: "b93", name: "Villamonte", cityId: "c56" },
  { id: "b94", name: "Taculing", cityId: "c56" },
  { id: "b95", name: "Singcang", cityId: "c56" },
  { id: "b96", name: "Bata", cityId: "c56" },

  // General Santos (c86)
  { id: "b97", name: "City Heights", cityId: "c86" },
  { id: "b98", name: "Dadiangas North", cityId: "c86" },
  { id: "b99", name: "Dadiangas South", cityId: "c86" },
  { id: "b100", name: "Lagao", cityId: "c86" },
  { id: "b101", name: "Calumpang", cityId: "c86" },
  { id: "b102", name: "Fatima", cityId: "c86" },

  // Add sample barangays for other major cities
  { id: "b103", name: "Barangay 1", cityId: "c30" }, // Angeles
  { id: "b104", name: "Barangay 2", cityId: "c30" },
  { id: "b105", name: "Barangay 1", cityId: "c36" }, // Antipolo
  { id: "b106", name: "Barangay 2", cityId: "c36" },
  { id: "b107", name: "Barangay 1", cityId: "c47" }, // Puerto Princesa
  { id: "b108", name: "Barangay 2", cityId: "c47" },
  { id: "b109", name: "Barangay 1", cityId: "c50" }, // Naga
  { id: "b110", name: "Barangay 2", cityId: "c50" },
  { id: "b111", name: "Barangay 1", cityId: "c66" }, // Tacloban
  { id: "b112", name: "Barangay 2", cityId: "c66" },
  { id: "b113", name: "Barangay 1", cityId: "c71" }, // Zamboanga
  { id: "b114", name: "Barangay 2", cityId: "c71" },
  { id: "b115", name: "Barangay 1", cityId: "c90" }, // Butuan
  { id: "b116", name: "Barangay 2", cityId: "c90" },
]

export function getCitiesByRegion(regionId: string): City[] {
  return cities.filter((city) => city.regionId === regionId)
}

export function getBarangaysByCity(cityId: string): Barangay[] {
  return barangays.filter((barangay) => barangay.cityId === cityId)
}

export function getCityById(cityId: string): City | undefined {
  return cities.find((city) => city.id === cityId)
}

export function getRegionById(regionId: string): Region | undefined {
  return regions.find((region) => region.id === regionId)
}
