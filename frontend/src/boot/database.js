import { useDatabaseStore } from 'src/stores/database';

export default async () => {
  const databaseStore = useDatabaseStore();
  await databaseStore.initDatabase(); // Inicijaliziraj vezu s bazom prilikom pokretanja aplikacije
};
