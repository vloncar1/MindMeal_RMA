<template>
  <q-page>
    <h1 class="title">Popularno</h1>

    <div class="image-container">
      <div v-for="(plan, index) in mealPlans" :key="index" class="meal-card">
        <img :src="plan.image" :alt="plan.title" class="meal-image" />
        <h2 class="meal-title">{{ plan.title }}</h2>
        <!-- Dodajemo gumb za odabir plana prehrane -->
         <div class="button-container">
          <q-btn @click="addToCart(plan)" label="Odaberi" color="primary" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useCartStore } from 'src/stores/cart';  // Uvoz Pinia store-a

defineOptions({
  name: "IndexPage",
});

// Lista planova prehrane
const mealPlans = [
  {
    title: "Keto Meal Plan",
    image:
      "https://www.ketodietyum.com/wp-content/uploads/2019/03/19-Day-Keto-Diet-Meal-Plan-2023-01.jpg",
    description: "Keto dijeta je plan prehrane bogat mastima i siromašan ugljikohidratima koji potiče sagorijevanje masti.",
  },
  {
    title: "Plant-based diet",
    image: "https://m.media-amazon.com/images/I/81dG5OK1QzL.jpg",
    description: "Plan prehrane temeljen na biljkama uključuje voće, povrće, žitarice i mahunarke, a izbjegava meso i mliječne proizvode.",
  },
  {
    title: "Mediterranean Meal Plan",
    image:
      "https://yummywholefoodrecipes.com/wp-content/uploads/2023/06/7-Day-Mediterranean-Dieat-Meal-Plan.png",
    description: "Mediteranska prehrana uključuje puno povrća, voća, maslinovog ulja, ribe i orašastih plodova, poznata po zdravim učincima.",
  },
  {
    title: "Paleo Meal Plan",
    image:
      "https://nutriadmin.com/blog/wp-content/uploads/2024/05/paleo-food-list-683x1024.png",
    description: "Paleo dijeta temelji se na prehrani naših predaka, koja uključuje meso, ribe, orašaste plodove, voće i povrće.",
  },
  {
    title: "Vegan Meal Plan",
    image:
      "https://i.pinimg.com/736x/0d/c4/c5/0dc4c5e830c9cb1247b95e2f525d7c95.jpg",
    description: "Veganska prehrana isključuje sve životinjske proizvode, uključujući meso, mlijeko, jaja i med.",
  },
  {
    title: "The DASH diet",
    image:
      "https://seniorresourceconnectmi.org/wp-content/uploads/2021/01/12_09-DASH-Diet-dbt.jpg",
    description: "DASH dijeta (Dietary Approaches to Stop Hypertension) dizajnirana je za smanjenje visokog krvnog tlaka i poticanje zdravlja srca.",
  },
];

// Funkcija za dodavanje plana prehrane
const cartStore = useCartStore();

function addToCart(plan) {
  cartStore.addToCart(plan);  // Pozivanje akcije iz store-a za dodavanje plana prehrane
}
</script>

<style scoped>
.title {
  margin-top: 20px;
  margin-left: 20px;
  font-size: 24px;
  font-weight: bold;
  font-family: "Century Gothic", Arial, sans-serif;
  user-select: none;
}

.image-container {
  display: flex;
  margin-top: 10px;
  overflow-x: auto;
  padding: 10px;
  padding-left: 50px;
}

.meal-image {
  width: 200px;
  margin-right: 30px;
  height: auto;
  border: 7px solid #0066ff;
  border-radius: 10px;
  padding: 5px;
}

.meal-title {
  margin-top: 10px;
  font-size: 15px;
  text-align: center;
  font-family: "Century Gothic", Arial, sans-serif;
  font-weight: bold;
  margin-left: -27px;
  user-select: none;
}

.button-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>




