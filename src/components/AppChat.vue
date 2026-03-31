<script setup lang="ts">
import type { Message } from '@/types';
import { ApiClient } from '@twurple/api';
import { StaticAuthProvider } from '@twurple/auth';
import { ChatClient, ChatMessage } from '@twurple/chat';
import { onMounted, ref } from 'vue';
import AppChatMessage from './AppChatMessage.vue';

interface BadgeVersion {
  id: string;
  getImageUrl(scale: number): string;
}

interface BadgeSet {
  id: string;
  versions: BadgeVersion[];
}

type BadgeMap = Record<string, Record<string, string>>;

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
    const apiClient = new ApiClient({ authProvider });

    const user = await apiClient.users.getUserByName(channel);
    if (!user) {
      console.error('User not found.');
      return;
    }

    const globalBadges = await apiClient.chat.getGlobalBadges();
    const channelBadges = await apiClient.chat.getChannelBadges(user.id);

    function mapBadges(badges: BadgeSet[]): BadgeMap {
      const result: BadgeMap = {};

      badges.forEach((set) => {
        const setKey = set.id;
        result[setKey] = result[setKey] ?? {};

        set.versions.forEach((v) => {
          result[setKey]![v.id] = v.getImageUrl(2);
        });
      });
      return result;
    }

    const globalMap = mapBadges(globalBadges);
    const channelMap = mapBadges(channelBadges);

    chatClient = new ChatClient({ authProvider, channels: [channel] });

    chatClient.onMessage((_channel, _user, text, msg: ChatMessage) => {
      const userBadges: Map<string, string> = msg.userInfo.badges || new Map();
      const badgeUrls: string[] = [];

      for (const [type, version] of userBadges.entries()) {
        const url = channelMap[type]?.[version] || globalMap[type]?.[version];

        if (url) badgeUrls.push(url);
      }

      const newMessage: Message = {
        id: msg.id,
        user: msg.userInfo.displayName,
        text: text,
        color: msg.userInfo.color || '#3b82f6',
        badges: badgeUrls,
      };

      messages.value.push(newMessage);

      if (messages.value.length > 10) {
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
  <div class="absolute top-1/2 right-1 z-1 h-fit w-100 -translate-y-1/2 rounded-lg p-2 text-white">
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
