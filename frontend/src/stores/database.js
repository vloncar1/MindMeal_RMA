import { defineStore } from "pinia";
import { ref } from "vue";

export const useDatabaseStore = defineStore("database", () => {
  const dbInstance = ref(null);

  // Funkcija za učitavanje SQL.js skripte dinamički
  const loadSqlJsScript = async () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/sql.js@1.5.0/dist/sql-wasm.js";
      script.async = true;
      script.onload = () => {
        console.log("SQL.js skripta uspješno učitana.");
        resolve(window.SQL); // Pretpostavljamo da SQL.js postavlja "SQL" u globalni prostor
      };
      script.onerror = (err) => {
        console.error("SQL.js skripta nije mogla biti učitana:", err);
        reject(err);
      };
      document.head.appendChild(script);
    });
  };

  // Funkcija za inicijalizaciju baze (singleton obrazac)
  const initDatabase = async () => {
    if (!dbInstance.value) {
      await loadSqlJsScript();
      const SQL = await initSqlJs({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/sql.js@1.5.0/dist/${file}`,
      });
      dbInstance.value = new SQL.Database(); // Inicijalizacija baze u memoriji
      console.log("SQLite baza inicijalizirana.");
      createTable();
      insertData();
    }
    return dbInstance.value;
  };

  // Funkcija za stvaranje tablice
  const createTable = () => {
    if (dbInstance.value) {
      dbInstance.value.run(`
        CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL
        );
      `);
      console.log("Tablica 'Users' je stvorena.");
    }
  };

  // Funkcija za unos podataka
  const insertData = () => {
    if (dbInstance.value) {
      dbInstance.value.run(`
        INSERT INTO Users (username, password, role)
        VALUES ('admin', 'admin', 'Nastavnik'),
              ('user', 'user', 'Student');
      `);
      console.log("Podaci umetnuti u tablicu 'Users'.");
    }
  };

  // Dohvati instancu baze
  const getDatabaseInstance = async () => {
    if (!dbInstance.value) {
      await initDatabase();
    }
    return dbInstance.value;
  };

  return {
    initDatabase,
    getDatabaseInstance,
  };
});
