<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title> MindMeal </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Main Menu Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item to="/" clickable>
          <q-item-section> {{ $t("home") }} </q-item-section>
        </q-item>
        <q-item to="/about" clickable>
          <q-item-section> {{ $t("about") }} </q-item-section>
        </q-item>
        <q-item to="/settings" clickable>
          <q-item-section> {{ $t("settings") }} </q-item-section>
        </q-item>
        <q-item to="/contact" clickable>
          <q-item-section> {{ $t("contact") }} </q-item-section>
        </q-item>
        <q-item to="/email" clickable>
          <q-item-section> Email </q-item-section>
        </q-item>
        <q-item to="/login" clickable>
          <q-item-section> Prijava </q-item-section>
        </q-item>
        <q-item to="/signup" clickable>
          <q-item-section> Registracija </q-item-section>
        </q-item>
        <q-item to="/news" clickable>
          <q-item-section> Novosti </q-item-section>
        </q-item>
        <q-item to="/plans" clickable>
          <q-item-section> Odabrani plan prehrane </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
const { t } = useI18n();

const $q = useQuasar();
const leftDrawerOpen = ref(false);
</script>

<script>
import { Notify } from "quasar";

export default {
  name: "MainLayout",
  data() {
    return {
      isOnline: navigator.onLine, // Početni status mreže
    };
  },
  mounted() {
    // Postavljanje event listenera za promjenu mrežnog statusa
    window.addEventListener("online", this.handleNetworkChange);
    window.addEventListener("offline", this.handleNetworkChange);

    // Prikazujemo početni status mreže kao notifikaciju
    this.notifyNetworkStatus();
  },
  beforeUnmount() {
    // Uklanjamo event listenere kad komponenta nije prikazana
    window.removeEventListener("online", this.handleNetworkChange);
    window.removeEventListener("offline", this.handleNetworkChange);
  },
  methods: {
    handleNetworkChange() {
      // Ažuriranje statusa mreže i prikazivanje obavijesti
      this.isOnline = navigator.onLine;
      this.notifyNetworkStatus();
    },
    notifyNetworkStatus() {
      if (this.isOnline) {
        // Prikazuje notifikaciju za ponovno uspostavljenu vezu
        Notify.create({
          type: "positive",
          message: "Internet connection retrieved.",
          icon: "wifi",
          timeout: 2000, // Notifikacija nestaje nakon 2 sekunde
        });
      } else {
        // Prikazuje notifikaciju za gubitak veze
        Notify.create({
          type: "negative",
          message: "Internet connection lost.",
          icon: "wifi_off",
          timeout: 0, // Notifikacija ostaje dok korisnik ponovno ne bude online
          actions: [{ label: "OK", color: "white" }],
        });
      }
    },
  },
};
</script>
