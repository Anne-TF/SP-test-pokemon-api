<template>
  <q-page class="q-pt-xl" :class="{ 'flex justify-center' : $q.screen.gt.sm }">
    <section class="q-pa-md"
             :class="{ 'wp-50' : $q.screen.gt.md, 'wp-70' : $q.screen.md }">
      <q-input
        rounded
        outlined
        dense
        :loading="loading"
        debounce="300"
        v-model="search"
        @update:model-value="onSearch"
        placeholder="Search for a user"
        class="q-mb-lg"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-infinite-scroll :key="infLoadKey" class="hp-100 wp-100"
                         @load="onLoad" :offset="0">
        <div class="users-container">
          <UserItem class="col-12 col-sm-6 col-lg-4" v-for="(user, index) in users" :key="index" :user="user" />
        </div>

        <template v-slot:loading>
          <div class="wp-100 q-my-md flex flex-center">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>

        <h5 class="text-center text-grey-5" v-if="!loading && users.length < 1">
          Oops! <br />
          Seems like there are no users that match your search
        </h5>
      </q-infinite-scroll>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import UserItem from 'src/Users/components/UserItem.vue';
import UserGateway from '../gateways/user.gateway';
import { ref } from 'vue';
import { User } from 'src/Users/interfaces/user.interface';

const userGateway = new UserGateway();

const users = ref<User[]>([]);
const offset = ref<number>(0);
const limit = ref<number>(12);
const search = ref<string>('');
const loading = ref<boolean>(false);
const infLoadKey = ref<number>(0);

const onLoad = async(index, done): Promise<void> => {
  try
  {
    const data = await userGateway.getUsers({ queryParams: { limit: limit.value, skip: offset.value } });
    users.value = [...users.value, ...data.users];
    offset.value = data.skip + limit.value;

    if (users.value.length >= data.total) {
      done(true);
      return;
    }
    done();
  }
  catch (error) {
    console.error('>> An error happened on UsersList.vue, onLoad()', error);
  }
};

const onSearch = async(): Promise<void> => {
  users.value = [];
  offset.value = 0;

  if (search.value.length < 1 || !search.value) {
    infLoadKey.value++;
    return;
  }
  loading.value = true;
  try {
    const data = await userGateway.getUsers({
      queryParams: {
        limit: limit.value,
        skip: offset.value,
        q: search.value
      },
      data: { includeSearch: true } });
      loading.value = false;
      users.value = data.users;
      offset.value = data.skip + limit.value;
  }
  catch (error) {
    console.error('>> An error happened on UsersList.vue, onSearch()', error);
  }
};
</script>

<style lang="scss" scoped>
.users-container {
  display: grid;
  width: 100%;
  gap: 1rem;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  }
}
</style>

