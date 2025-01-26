<template>
  <q-page>
    <div class="q-pa-md">
      <p>Prijava problema ili povratne informacije.</p>
    </div>
    <div class="q-pa-md">
      <q-input v-model="userEmail" label="Korisnik" />
      <q-input v-model="message" label="Poruka" type="textarea" />
      <q-btn label="Pošalji email" @click="sendEmail" color="primary" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const userEmail = ref("");
const message = ref("");

const sendEmail = async () => {
  try {
    await axios.post("http://localhost:5000/send-email", {
      email: userEmail.value,
      message: message.value,
    });
    alert("Poruka je poslana!");
  } catch (error) {
    console.error("Greška pri slanju poruke", error);
    alert("Nismo uspjeli poslati poruku.");
  }
};
</script>
