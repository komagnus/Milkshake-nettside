<template>
  <Header />
  <v-container v-if="!loggedIn"
    style="display: flex; height: 50%; width: 100%; margin-top: 0px; justify-content: center; flex-direction: row; align-items: center; margin-top: 10%;">
    <v-card class="mx-auto px-6 py-8" style="width: 60%; min-width: 300px; max-width: 600px;">
      <v-form v-model="form" @submit.prevent="login">
        <v-text-field v-model="username" :readonly="loading" :rules="[required]" class="mb-2" clearable
          label="Brukernavn"></v-text-field>
        <v-text-field v-model="password" :readonly="loading" :rules="[required]" clearable type="password"
          label="Passord" placeholder="Skriv inn passord"></v-text-field>
        <p v-if="incorrectLogin" style="color: red;">Feil brukernavn og/ eller passord</p>
        <v-btn :disabled="!form" :loading="loading" block color="success" size="large" type="submit" variant="elevated">
          Sign In
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
  <MainContent v-else />
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { getUserFromDB } from '@/tools/apihandler';
import '@/styles/style.css'

const userStore = useAppStore()
const currentUser = userStore.User
const username = ref('')
const password = ref('')
const loading = ref(false)
const incorrectLogin = ref(false)
const form = ref(false)
const loggedIn = ref(false)
async function getUser() {
  try {
    loading.value = true;
    const checkUser = await getUserFromDB(username.value)
    const user = checkUser.document
    if (user !== null) {
      if (user.username === username.value && user.pw === password.value) {
        username.value = user.username
        currentUser.UserName = username.value
        loggedIn.value = true
      } else {
        incorrectLogin.value = true
      }
    } else {
      incorrectLogin.value = true
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
    console.log(userStore.User)
  }
}
async function login() {
  await getUser()
}
function required(v: any) {
  return !!v || 'Field is required'
}
</script>
