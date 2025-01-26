<template>
  <q-page padding>
    <h1>Kontakt</h1>
    <p>Molimo vas da ispunite formu kako bismo vas mogli kontaktirati.</p>

    <q-form @submit.prevent="openDialog">
      <q-input
        filled
        v-model="email"
        label="Email"
        type="email"
        :rules="[(val) => !!val || 'Email je obavezan']"
        required
      />

      <q-input
        filled
        v-model="message"
        label="Poruka"
        type="textarea"
        :rules="[(val) => !!val || 'Poruka je obavezna']"
        required
        autogrow
      />

      <!-- Učitavanje slike putem Cloudinary widgeta -->
      <q-btn label="Odaberi sliku" @click="handleImageUpload" />

      <!-- Prikaz slike ako je odabrana -->
      <div v-if="imageUrl" class="q-mt-md">
        <h6>Pregled slike:</h6>
        <img
          :src="imageUrl"
          alt="Pregled slike"
          style="max-width: 100%; height: auto"
        />
      </div>

      <div>
        <q-btn label="Pošalji" type="submit" color="primary" class="q-mt-md" />
      </div>
    </q-form>

    <q-dialog v-model="dialogVisible" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Potvrda slanja</div>
          <div>Želite li stvarno poslati poruku?</div>
        </q-card-section>
        <q-card-actions>
          <q-btn
            label="Otkaži"
            color="negative"
            @click="dialogVisible = false"
          />
          <q-btn label="Pošalji" color="positive" @click="handleSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import emailjs from "emailjs-com";

const $q = useQuasar();

// Podaci forme
const email = ref("");
const message = ref("");
const imageFile = ref("");
const imageUrl = ref("");

const dialogVisible = ref(false);

// Funkcija za otvaranje dijaloga
const openDialog = () => {
  dialogVisible.value = true;
};

// Funkcija za otvaranje Cloudinary widgeta za upload slika
const handleImageUpload = () => {
  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: "dfwdczbdx", // Zamijeniti s Vašim cloud_name
      uploadPreset: "my_preset", // Zamijeniti s Vašim upload preset
      sources: ["local", "url", "camera"],
      showAdvancedOptions: false,
      cropping: false,
      multiple: false,
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        imageUrl.value = result.info.secure_url; // URL slike sa Cloudinary-a
      } else if (error) {
        $q.notify({
          message: "Greška prilikom učitavanja slike.",
          color: "negative",
        });
      }
    }
  );

  widget.open();
  console.log(imageUrl.value);
};

// Funkcija za slanje forme
const handleSubmit = async () => {
  dialogVisible.value = true;

  // Provjera ispravnosti forme
  if (!email.value || !message.value) {
    $q.notify({
      type: "negative",
      message: "Molimo ispunite sve potrebne podatke.",
    });
    return;
  }

  console.log(imageUrl.value);

  // Send form data using an email API or backend service here.
  try {
    await emailjs.send(
      "service_efy9y0t",
      "template_7gfpi6v",
      {
        email: email.value,
        message: message.value,
        image: imageUrl.value,
      },
      "xKS0LbKkX1eYfBr9y"
    );
    $q.notify({ type: "positive", message: "Poruka je uspješno poslana!" });
    // Resetiraj formu nakon slanja
    email.value = "";
    message.value = "";
    imageFile.value = "";
    imageUrl.value = "";
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Greška prilikom slanja poruke. Pokušajte ponovno.",
    });
  } finally {
    dialogVisible.value = false; // Zatvori dijalog nakon slanja
  }
};

// Učitaj Cloudinary widget prilikom montiranja komponente
onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
  script.async = true;
  script.onload = () => {
    console.log("Cloudinary script successfully loaded!");
  };
  document.body.appendChild(script);
});
</script>
