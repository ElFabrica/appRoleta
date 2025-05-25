import { createStore, Store } from "tinybase";
import { createExpoSqlitePersister, ExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite";
import * as SQLite from 'expo-sqlite';

const db: SQLite.Database = SQLite.openDatabaseSync('database.db');

const TABLE_NAME = "usersRoleta";

const store: Store = createStore();
store.setTable(TABLE_NAME, {}); // Inicializa a tabela na memória

const persister: ExpoSqlitePersister = createExpoSqlitePersister(store, db);

const initializeStore = async (): Promise<void> => {
  await persister.load();           // Carrega dados existentes
  await persister.startAutoSave(); // Ativa autosave
};

const clearTable = async (): Promise<void> => {
  store.delTable(TABLE_NAME);       // 🔥 Remove a tabela da memória
  await persister.save();           // Salva alteração no banco
  await persister.load();           // Recarrega do banco (agora vazio)
};

export { store, TABLE_NAME, initializeStore, persister, clearTable };
