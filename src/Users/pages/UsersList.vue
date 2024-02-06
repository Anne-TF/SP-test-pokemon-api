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
          <UserItem @onClick="onOpenDetail($event)" :match="search"
                    class="col-12 col-sm-6 col-lg-4"
                    v-for="(user, index) in users" :key="index" :user="user" />
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

    <q-dialog v-model="dialog" :maximized="$q.screen.lt.md">
      <q-card class="q-pa-md" style="min-height: 30%;" :class="{ 'wp-40' : $q.screen.gt.md, 'wp-50' : $q.screen.md, 'flex flex-center' : !detail }" flat>
        <q-card-section v-if="detail" class="text-h6 text-bold flex justify-between items-center">
          <div>
            <q-avatar size="3em">
              <img :src="detail.image" alt="User avatar" />
            </q-avatar>
            <span class="q-ml-md" v-text="detail.firstName?.concat(' ', detail.lastName)" />
          </div>

          <q-btn @click="() => { dialog = false; }" icon="close" flat size="md" round />
        </q-card-section>

        <q-card-section v-if="detail" class="text-medium">
          <span v-text="'Gender:'" class="text-bold" /> {{ detail.gender }} <br />
          <span v-text="'Date of Birth:'" class="text-bold" /> {{ detail.birthDate }} <br />
          <span v-text="'Age:'" class="text-bold" /> {{ detail.age }} <br />
          <span v-text="'University:'" class="text-bold" /> {{ detail.university }} <br />
          <span v-text="'Company:'" class="text-bold" /> {{ detail.company.name }} <br />
          <span v-text="'Title:'" class="text-bold" /> {{ detail.company.title?.concat(', Department of ', detail.company.department) }} <br />
          <span v-text="'Email:'" class="text-bold" /> {{ detail.email }} <br />
          <span v-text="'Phone:'" class="text-bold" /> {{ detail.phone }} <br />
          <span v-text="'Address:'" class="text-bold" /> {{ detail.address.address.concat(', ', detail.address.city, ', ', detail.address.state) }}
        </q-card-section>

        <q-card-section v-else class="flex flex-center">
          <q-spinner-dots color="primary" size="40px" />
        </q-card-section>
      </q-card>
    </q-dialog>

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
const dialog = ref<boolean>(false);
const detail = ref<User | null>(null);

const onLoad = async(index: number, done: any): Promise<void> => {
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

const onOpenDetail = async(id: number): Promise<void> => {
  detail.value = null;
  dialog.value = true;
  /**
   * Agregué la petición a la API para el detalle de usuario porque así se solicita en el README de la prueba (que está en este proyecto)
   * y quise cumplit con los requerimientos a cabalidad.
   * Sin embargo, el detalle de usuario ya se trae en la petición de listado y búsqueda de usuarios, por lo que
   * no veo necesario hacer una petición adicional y si hubiera dependido de mí, no lo habría hecho. Hubiera aprovechado la
   * información que ya viene en el listado para mejorar el performance de la app y para no tener peticiones innecesarias a backend.
   * */
  try {
    detail.value = await userGateway.getOneUser({ id });
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
  gap: 0.5rem;
  @media (min-width: 1024px) {
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  }
}
</style>

