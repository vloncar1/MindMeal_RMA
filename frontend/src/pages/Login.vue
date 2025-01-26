<template>
  <q-page class="q-pa-md">
    <div v-if="!isLoggedIn">
      <h1>Prijava</h1>
      <q-form @submit.prevent="handleLogin" class="q-gutter-md">
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
          option-value="id"
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
  // Redirect based on role
  if (user.value.role === "Admin") {
    window.location.href = "/admin";
  }
}

// Dohvaćanje svih planova prilikom prijave
const fetchPlans = async () => {
  try {
    const response = await axios.get("http://localhost:3000/getPlans");
    plans.value = response.data.plans;
  } catch (error) {
    console.error("Greška pri dohvaćanju planova:", error);
  }
};

onMounted(() => {
  if (isLoggedIn.value) {
    fetchPlans();
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

    if (response.data.message === "Login successful!") {
      user.value = response.data.user;
      $q.localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
      isLoggedIn.value = true;

      // Save role to localStorage
      $q.localStorage.setItem("role", response.data.user.role);

      // Redirect based on user role
      if (response.data.user.role === "Admin") {
        window.location.href = "/admin"; // Redirect to admin page
      } else {
        window.location.href = "/plans"; // Redirect to user dashboard
      }

      // Dohvati sve planove
      await fetchPlans();

      // Dohvati odabrani plan korisnika
      const userPlanResponse = await axios.get(
        `http://localhost:3000/getUserPlan/${response.data.user.id}`
      );
      if (userPlanResponse.data.plan_id) {
        selectedPlan.value = plans.value.find(
          (plan) => plan.id === userPlanResponse.data.plan_id
        );
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
      await axios.post("http://localhost:3000/savePlan", {
        userId: user.value.id,
        planId: selectedPlan.value,
      });
      $q.notify({
        type: "positive",
        message: "Plan uspješno spremljen!",
      });
    } catch (error) {
      console.error("Greška pri spremanju plana:", error);
      $q.notify({
        type: "negative",
        message: "Greška pri spremanju plana!",
      });
    }
  }
};

// Funkcija za odjavu
const logout = () => {
  user.value = null;
  isLoggedIn.value = false;
  $q.localStorage.removeItem("loggedInUser");
  window.location.href = "/login"; // Redirect to login page
};
</script>

<style scoped>
h1 {
  color: #1976d2;
}
</style>
