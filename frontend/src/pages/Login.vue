<template>
  <q-page class="q-pa-md">
    <div v-if="!isLoggedIn">
      <h1>Prijava</h1>
      <q-form @submit="handleLogin" class="q-gutter-md">
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
        <q-btn label="Prijava" color="primary" type="submit" unelevated />
      </q-form>
      <q-banner class="q-mt-md" v-if="errorMessage" type="negative">
        {{ errorMessage }}
      </q-banner>
    </div>

    <div v-else>
      <h1>Dobrodošli, {{ user.korime }}</h1>
      <q-btn label="Odjava" color="negative" unelevated @click="logout" />

      <div v-if="plans.length > 0">
        <h2>Odaberite plan prehrane:</h2>
        <q-select
          v-model="selectedPlan"
          :options="plans"
          label="Odaberi plan"
          option-label="naziv"
          option-value="naziv"
          emit-value
          map-options
          @update:model-value="saveSelectedPlan"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();

// Korisničko stanje
const isLoggedIn = ref(false);
const user = ref("");
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const selectedPlan = ref(null);
const plans = ref([]);

// Dohvaćanje korisnika iz localStorage
const storedUser = $q.localStorage.getItem("loggedInUser");
if (storedUser) {
  user.value = JSON.parse(storedUser);
  isLoggedIn.value = true;
}

// Dohvaćanje svih planova prilikom prijave
onMounted(async () => {
  if (isLoggedIn.value) {
    try {
      const response = await axios.get(`http://localhost:3000/getPlans`);
      plans.value = response.data.plans;
    } catch (error) {
      console.error("Greška pri dohvaćanju planova:", error);
    }
  }
});

// Funkcija za prijavu
const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = "Korisničko ime i lozinka su obavezna!";
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/login", {
      username: username.value,
      password: password.value,
    });

    if (response.data.message === "Prijava uspješna!") {
      user.value = response.data.user;
      $q.localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
      isLoggedIn.value = true;

      // Dohvati odabrani plan prilikom prijave
      const userPlanResponse = await axios.get(`http://localhost:3000/getUserPlan/${response.data.user.id}`);
      if (userPlanResponse.data.plan) {
        selectedPlan.value = userPlanResponse.data.plan;
      }

      // Reset forme
      username.value = "";
      password.value = "";
      errorMessage.value = "";
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Greška pri prijavi.";
  }
};

// Funkcija za spremanje odabranog plana
const saveSelectedPlan = async () => {
  if (selectedPlan.value) {
    try {
      await axios.post("http://localhost:3000/updateUserPlan", {
        userId: user.value.id,
        planName: selectedPlan.value,
      });
      alert("Plan uspješno spremljen!");
    } catch (error) {
      console.error("Greška pri spremanju plana:", error);
    }
  }
};

// Funkcija za odjavu
const logout = () => {
  user.value = null;
  isLoggedIn.value = false;
  $q.localStorage.removeItem("loggedInUser");
};
</script>

<style scoped>
h1 {
  color: #1976d2;
}
</style>
