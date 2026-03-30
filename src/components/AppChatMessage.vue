<script setup lang="ts">
import type { Message } from '@/types';

const { message } = defineProps<{ message: Message }>();
</script>

<template>
  <li class="rounded-l-lg border-b border-slate-300 px-1 py-2 text-sm">
    <span
      :style="{ color: message.color }"
      class="mr-1 inline font-bold"
      >{{ message.user }}:</span
    >

    <span class="inline leading-relaxed wrap-break-word whitespace-pre-wrap">{{
      message.text
    }}</span>
  </li>
</template>
