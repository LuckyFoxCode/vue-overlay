<script setup lang="ts">
import { fetchPokemons, type PokemonCard } from '@/api/pokemon';
import { onMounted, ref } from 'vue';
import AppPokemonsCard from './AppPokemonsCard.vue';

const pokemons = ref<PokemonCard[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    pokemons.value = await fetchPokemons();
  } catch {
    error.value = 'Error loading...';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <h2>Pokemon dashboard</h2>

    <span v-if="loading">Loading...</span>
    <span v-else-if="error">{{ error }}</span>

    <ul
      v-else
      class="grid grid-cols-5 gap-4"
    >
      <AppPokemonsCard
        v-for="pokemon in pokemons"
        :key="pokemon.name"
        :pokemon
      />
    </ul>
  </div>
</template>
