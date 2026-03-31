<script setup lang="ts">
import type { Message } from '@/types';

const { message } = defineProps<{ message: Message }>();
</script>

<template>
  <li class="rounded-tr-xl rounded-bl-xl bg-slate-950/70 px-2 py-3 align-middle text-sm">
    <span class="mr-1 inline-flex gap-1">
      <img
        v-for="badge in message.badges"
        :key="badge"
        :src="badge"
        class="size-4"
      />
    </span>
    <span
      :style="{ color: message.color }"
      class="mr-1 inline-block align-top font-bold"
      >{{ message.user }}:</span
    >

    <span class="inline leading-relaxed wrap-break-word whitespace-pre-wrap">{{
      message.text
    }}</span>
  </li>
</template>
