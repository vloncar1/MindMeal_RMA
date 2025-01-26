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
        <q-toolbar-title>MindMeal</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item to="/" clickable>
          <q-item-section> {{ t("home") }} </q-item-section>
        </q-item>
        <q-item to="/about" clickable>
          <q-item-section> {{ t("about") }} </q-item-section>
        </q-item>
        <q-item to="/settings" clickable>
          <q-item-section> {{ t("settings") }} </q-item-section>
        </q-item>
        <q-item to="/contact" clickable>
          <q-item-section> {{ t("contact") }} </q-item-section>
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
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";

const { t } = useI18n();
const $q = useQuasar();
const leftDrawerOpen = ref(false);
</script>
