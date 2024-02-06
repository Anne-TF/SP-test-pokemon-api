<template>
  <q-card @click="emit('onClick', user.id)" flat class="user-card cursor-pointer" style="height: auto;">
    <q-card-section class="q-pb-xs q-pt-md text-bold flex flex-inline items-center">
      <q-avatar size="2em" class="q-mr-sm">
        <img :src="user.image" alt="User avatar" />
      </q-avatar>
      <span v-html="`${user.firstName?.concat(' ', user.lastName)}`.toLowerCase().includes(match.toLowerCase()) ?
      ApplyHighlight(`${user.firstName?.concat(' ', user.lastName)}`, match) :
      user.firstName?.concat(' ', user.lastName)" />
    </q-card-section>

    <q-card-section class="q-pt-xs q-pb-md" style="word-break: break-word;">
      <span v-text="'Email: '" class="text-bold" />
      <span v-html="user.email.toLowerCase().includes(match.toLowerCase()) ?
      ApplyHighlight(user.email, match) :
      user.email" />
      <br />
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
  },
  match: {
    type: String,
    default: '',
    required: false
  }
});
const emit = defineEmits<{
  (e: 'onClick', id: number): void;
}>();

const ApplyHighlight = (text: string, pattern: string): string =>
{
  if (!pattern)
  {
    return text;
  }
  const regex = new RegExp(`(${  pattern  })`, 'ig');
  const match = text.match(regex);
  let aux: string;
  match?.forEach((e) =>
  {
    aux = text.replace(new RegExp(e), `<span class='text-bold text-primary'>${e}</span>`);
  });
  console.log(aux);
  return aux ?? text;
};
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
