<template>
  <q-card flat class="user-card q-mb-lg cursor-pointer br-10" style="height: auto;">
    <q-card-section class="q-pb-xs q-pt-md text-medium text-bold flex flex-inline items-center">
      <q-avatar size="2em" class="q-mr-sm">
        <img :src="user.image" alt="User avatar" />
      </q-avatar>
      {{ user.firstName?.concat(' ', user.lastName) }}
    </q-card-section>

    <q-card-section class="q-pt-xs q-pb-md" style="word-break: break-word;">
      <span v-text="'Email:'" class="text-bold" /> {{ user.email }} <br />
      <span v-text="'Phone:'" class="text-bold" /> {{ user.phone }}
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { User } from 'src/Users/interfaces/user.interface';

defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  }
});
</script>

<style scoped lang="scss">
.user-card {
  border: 1px solid $grey-4;
  transition: all .2s ease-in-out;
}

.user-card:hover {
  transform: scale(1.06);
}
</style>
