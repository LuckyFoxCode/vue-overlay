<script setup lang="ts">
import type { PokemonCard } from '@/api/pokemon';

const props = defineProps<{ pokemon: PokemonCard }>();

const pokemon = props.pokemon;
</script>

<template>
  <li class="flex flex-col gap-y-2 rounded-xl border bg-slate-300 p-4">
    <img
      :src="pokemon.image"
      alt="pokemon.name"
      class="mx-auto flex size-16"
    />
    <div class="flex flex-col">
      <span
        >NAME: <span class="font-bold capitalize">{{ pokemon.name }}</span></span
      >
      <span>HP: {{ pokemon.hp }}</span>
      <input
        type="range"
        min="0"
        :value="pokemon.hp"
        max="100"
      />
    </div>
  </li>
</template>
