// src/stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    selectedPlan: null,  // Ovdje pohranjujemo odabrani plan
  }),
  actions: {
    addToCart(plan) {
      this.selectedPlan = plan;  // Dodavanje plana u košaricu
    },
  },
});
