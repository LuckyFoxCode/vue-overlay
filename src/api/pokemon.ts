export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonCard {
  name: string;
  image: string;
  hp: number;
  atack: number;
}
export interface PokemonResponse {
  results: Pokemon[];
}

const URL = 'https://pokeapi.co/api/v2/pokemon?limit=20';

export const fetchPokemonsDetails = async (url: string): Promise<PokemonCard> => {
  const res = await fetch(url);
  const data = await res.json();

  return {
    name: data.name,
    image: data.sprites.front_default,
    hp:
      data.stats.find(
        (s: { base_stat: number; effort: number; stat: Pokemon }) => s.stat.name === 'hp',
      )?.base_stat ?? 0,
    atack:
      data.stats.find(
        (s: { base_stat: number; effort: number; stat: Pokemon }) => s.stat.name === 'atack',
      )?.base_stat ?? 0,
  };
};

export const fetchPokemons = async (): Promise<PokemonCard[]> => {
  const res = await fetch(URL);

  if (!res.ok) {
    throw new Error('Error load.');
  }

  const data: PokemonResponse = await res.json();

  const detailedPokemons = await Promise.all(
    data.results.map((p: { url: string }) => fetchPokemonsDetails(p.url)),
  );

  return detailedPokemons;
};
