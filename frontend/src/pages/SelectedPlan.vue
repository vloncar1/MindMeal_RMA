<template>
  <q-page>
    <div v-if="selectedPlan" class="selected-plan-details">
      <h1>{{ selectedPlan.title }}</h1>
      <img :src="selectedPlan.image" :alt="selectedPlan.title" class="meal-image" />
      <p>{{ selectedPlan.description }}</p>
      <q-btn label="Spremi plan" color="primary" @click="savePlan" unelevated />
    </div>
    <div v-else>
      <p>Odaberite plan da biste vidjeli detalje.</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import { useCartStore } from "src/stores/cart";  // Uvoz Pinia store-a

const cartStore = useCartStore();
const $q = useQuasar();

// Dohvatimo odabrani plan iz store-a
const selectedPlan = ref(cartStore.selectedPlan);

// Dohvaćanje korisnika iz localStorage
const storedUser = $q.localStorage.getItem("loggedInUser");
const userId = storedUser ? JSON.parse(storedUser).id : null;  // Pretpostavka da korisnik ima id

// Funkcija za pohranu odabranog plana
const savePlan = async () => {
  if (!userId) {
    $q.notify({ color: 'negative', message: 'Niste ulogirani!' });
    return;
  }

  try {
    // Slanje POST zahtjeva na backend za pohranu plana
    const response = await axios.post("http://localhost:3000/savePlan", {
      userId: userId,
      planId: selectedPlan.value.id, // Provjerite da planId dolazi iz selectedPlan
    });

    if (response.data.message === "Plan uspješno spremljen!") {
      $q.notify({ color: 'positive', message: 'Plan je uspješno spremljen!' });
    }
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Greška pri spremanju plana.' });
  }
};

// Funkcija za dohvat spremljenog plana prilikom učitavanja stranice
const fetchUserPlan = async () => {
  if (!userId) return;

  try {
    const response = await axios.get(`http://localhost:3000/getUserPlan/${userId}`);
    if (response.data.plan_id) {
      // Dohvatiti plan na temelju plan_id
      const plan = mealPlans.find(plan => plan.id === response.data.plan_id);
      if (plan) {
        selectedPlan.value = plan;
      }
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju spremljenog plana:', error);
  }
};

// Pokreni dohvat plana prilikom učitavanja stranice
onMounted(() => {
  fetchUserPlan();
});
</script>

<style scoped>
.selected-plan-details {
  text-align: center;
}

.selected-plan-details h1 {
  font-size: 30px;
  margin-bottom: 20px;
}

.selected-plan-details .meal-image {
  width: 300px;
  margin-top: 15px;
  border-radius: 10px;
  border: 5px solid #333;
}

.selected-plan-details p {
  font-size: 18px;
  margin-top: 20px;
  color: #333;
  font-family: Arial, sans-serif;
}
</style>
