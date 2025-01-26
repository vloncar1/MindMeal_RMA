<template>
  <q-page class="q-pa-md">
    <h1>Postavke</h1>
    <q-card-section class="q-pt-none">
      <q-toggle
        v-model="darkMode"
        :label="$t('darkMode')"
        @update:model-value="changeDarkMode"
      />

      <q-select
        v-model="locale"
        :options="languages"
        dense
        emit-value
        map-options
        options-dense
        @update:model-value="changeLanguage"
        :label="$t('language')"
      />

      <q-select
        v-model="fontSize"
        :label="$t('fontSize')"
        dense
        emit-value
        map-options
        options-dense
        :options="[
          { label: $t('mini'), value: 'small' },
          { label: $t('midi'), value: 'medium' },
          { label: $t('large'), value: 'large' },
        ]"
        @update:model-value="applyFontSize"
        class="q-mt-md"
      ></q-select>
    </q-card-section>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { locale } = useI18n({ useScope: "global" });

const darkMode = ref($q.dark.isActive);
const changeDarkMode = () => {
  $q.dark.toggle();
  $q.localStorage.set("isDarkActive", $q.dark.isActive);
};

const currentLang = ref(
  $q.localStorage.getItem("language") !== null
    ? $q.localStorage.getItem("language")
    : "hr" // Defaultna vrijednost
);

const languages = [
  { value: "en", label: "English" },
  { value: "hr", label: "Hrvatski" },
];

const changeLanguage = (value) => {
  $q.lang.set(value);
  currentLang.value = value;
  $q.localStorage.set("language", value);
};

const fontSize = ref(
  $q.localStorage.getItem("fontSize") || "medium" // Default vrijednost
);

const fontSizeMap = {
  small: "14px",
  medium: "20px",
  large: "28px",
};

const applyFontSize = (value) => {
  const newFontSize = fontSizeMap[value] || "20px"; // Default na 20px
  document.documentElement.style.setProperty(
    "--q-theme-font-size",
    newFontSize
  );
  $q.localStorage.set("fontSize", value);
  console.log(value);
  console.log(newFontSize);
};
</script>
