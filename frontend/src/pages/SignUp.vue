<template>
  <q-page class="q-pa-md">
    <div>
      <h1>Registracija</h1>
      <q-form @submit="handleSignUp" class="q-gutter-md">
        <q-input
          v-model="username"
          label="Korisničko ime"
          outlined
          dense
          required
        />
        <q-input
          v-model="password"
          label="Lozinka"
          type="password"
          outlined
          dense
          required
        />
        <q-select
          v-model="role"
          :options="roles"
          label="Uloga"
          outlined
          dense
          required
        />
        <q-btn
          label="Registriraj se"
          color="primary"
          type="submit"
          unelevated
        />
      </q-form>
      <q-banner class="q-mt-md" v-if="errorMessage" type="negative">
        {{ errorMessage }}
      </q-banner>
      <q-banner class="q-mt-md" v-if="successMessage" type="positive">
        {{ successMessage }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

// Podaci za unos
const username = ref("");
const password = ref("");
const role = ref("");
const roles = ["Korisnik", "Stručnjak"];

// Poruke
const errorMessage = ref("");
const successMessage = ref("");

// Funkcija za registraciju
const handleSignUp = async () => {
  if (!username.value || !password.value || !role.value) {
    errorMessage.value = "Molimo ispunite sva polja.";
    successMessage.value = "";
    return;
  }

  try {
    // Slanje zahtjeva backendu za registraciju
    const response = await axios.post("http://localhost:3000/register", {
      username: username.value,
      password: password.value,
      role: role.value,
    });

    successMessage.value = response.data.message;
    errorMessage.value = "";

    // Resetiraj unos nakon uspješne registracije
    username.value = "";
    password.value = "";
    role.value = null;
  } catch (error) {
    // Prikaz poruke o grešci iz odgovora
    errorMessage.value = error.response?.data?.error || "Došlo je do greške.";
    successMessage.value = "";
  }
};
</script>

<style scoped>
h1 {
  color: #66cb44;
}
</style>


