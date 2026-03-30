<script setup lang="ts">
import type { Message } from '@/types';
import { StaticAuthProvider } from '@twurple/auth';
import { ChatClient, ChatMessage } from '@twurple/chat';
import { onMounted, ref } from 'vue';
import AppChatMessage from './AppChatMessage.vue';

const messages = ref<Message[]>([]);

let chatClient: ChatClient | null = null;

const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
const accessToken = import.meta.env.VITE_TWITCH_ACCESS_TOKEN;
const channel = import.meta.env.VITE_TWITCH_CHANNEL;

onMounted(async () => {
  if (!clientId || !accessToken || !channel) {
    console.error('Check .env keys');
    return;
  }

  try {
    const authProvider = new StaticAuthProvider(clientId, accessToken);

    chatClient = new ChatClient({ authProvider, channels: [channel] });

    chatClient.onMessage((_channel, _user, text, msg: ChatMessage) => {
      const newMessage: Message = {
        id: msg.id,
        user: msg.userInfo.displayName,
        text: text,
        color: msg.userInfo.color || '#3b82f6',
      };

      messages.value.push(newMessage);

      if (messages.value.length > 12) {
        messages.value.shift();
      }
    });

    await chatClient.connect();
    console.log('Connected to Twitch');
  } catch (error) {
    console.error('Connection failed:', error);
  }
});
</script>

<template>
  <div
    class="absolute top-1/2 right-4 z-1 h-160 w-100 -translate-y-1/2 rounded-lg border border-transparent bg-slate-950/60 p-2 text-white shadow-lg"
  >
    <TransitionGroup
      tag="ul"
      name="chat"
      class="flex flex-col gap-y-3"
    >
      <AppChatMessage
        v-for="message in messages"
        :key="message.id"
        :message
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.chat-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.chat-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.chat-enter-active,
.chat-leave-active {
  transition: all 0.5s ease;
}

.chat-move {
  transition: transform 0.3s ease;
}

.chat-leave-active {
  position: absolute;
}
</style>
