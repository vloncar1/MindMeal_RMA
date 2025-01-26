<template>
  <q-page class="q-pa-md">
    <div>
      <h1>Novosti s veleri.hr</h1>

      <!-- Prikaz scraped podataka -->
      <div v-if="scrapedData">
        <div v-html="scrapedData"></div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { load } from "cheerio"; // Biblioteka za parsiranje DOM-a
import { Notify } from "quasar";

// ScraperAPI ključ
const SCRAPER_API_KEY = "4eb90e9e63c90b01b3970b1afa794ea8";

const scrapedData = ref(null);

// Funkcija za scraping podataka
const fetchScrapedData = async () => {
  scrapedData.value = null;

  // Pokreni obavijest za početak scrapanja
  Notify.create({
    type: "info",
    message: "Učitavanje u tijeku, molimo pričekajte...",
    timeout: 2000, // Automatski nestaje nakon 2 sekunde
  });

  try {
    // URL koji želimo scrapati
    const targetUrl = "https://www.veleri.hr/hr/novosti";

    // Dohvaćanje sadržaja pomoću ScraperAPI
    const response = await axios.get("http://api.scraperapi.com", {
      params: {
        api_key: SCRAPER_API_KEY,
        url: targetUrl,
      },
    });

    // Parsiranje HTML-a pomoću Cheerio
    const $ = load(response.data);

    // Dohvaćanje elemenata s role="main"
    const mainContent = $('[role="main"]').html();

    if (mainContent) {
      // Spremanje scraped sadržaja
      scrapedData.value = mainContent;

      // Prikaži uspješnu obavijest
      Notify.create({
        type: "positive",
        message: "Učitavanje uspješno dovršeno!",
        timeout: 2000,
      });
    } else {
      // Prikaži obavijest za prazne podatke
      Notify.create({
        type: "warning",
        message: "Nema sadržaja s role='main' na ovoj stranici.",
        timeout: 3000,
      });
    }
  } catch (error) {
    // Prikaži grešku
    Notify.create({
      type: "negative",
      message: "Greška tijekom učitavanja. Pokušajte ponovno.",
      timeout: 3000,
    });
    console.error("Scraping error:", error);
  }
};

onMounted(async () => {
  fetchScrapedData();
});
</script>

<style scoped>
h1 {
  color: #66cb44;
}
</style>
