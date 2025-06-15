const GEODB_API_KEY = process.env.NEXT_PUBLIC_GEODB_API_KEY;
const GEODB_BASE_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

export const getCitiesByCountry = async (countryCode: string) => {
  const res = await fetch(`${GEODB_BASE_URL}/countries/${countryCode}/cities?limit=100&sort=-population`, {
    headers: {
      'X-RapidAPI-Key': GEODB_API_KEY!,
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch cities');
  }

  const data = await res.json();
  return data.data.map((city: any) => city.name);
};
