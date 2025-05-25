import { createStore, Store } from 'tinybase';
import {
  createExpoSqlitePersister,
  ExpoSqlitePersister,
} from 'tinybase/persisters/persister-expo-sqlite';
import * as SQLite from 'expo-sqlite';

// Cria ou abre o banco de dados SQLite chamado 'database.db'
const db = SQLite.openDatabaseSync('database.db');

// Cria uma instância da store do TinyBase
const store: Store = createStore();

// Define os nomes das tabelas
const USERS_TABLE = 'usersRoleta'; // Tabela para armazenar o histórico dos giros
const PRIZES_TABLE = 'prizes'; // Tabela que armazena os prêmios da roleta

// Inicializa as tabelas vazias na store (em memória)
store.setTable(USERS_TABLE, {});
store.setTable(PRIZES_TABLE, {});

// Cria o persister que conecta a store ao banco SQLite
const persister: ExpoSqlitePersister = createExpoSqlitePersister(store, db);

// Função para inicializar a store carregando os dados e ativando o autosave
const initializeStore = async () => {
  await persister.load(); // Carrega dados do SQLite
  await persister.startAutoSave(); // Salva automaticamente qualquer alteração
};

// Função auxiliar para limpar uma tabela específica
const clearTable = async (tableName: string) => {
  store.delTable(tableName); // Remove todos os dados da tabela
  await persister.save(); // Salva a alteração
  await persister.load(); // Recarrega os dados atualizados
};

// Exporta os objetos e funções importantes
export {
  store,
  USERS_TABLE,
  PRIZES_TABLE,
  initializeStore,
  persister,
  clearTable,
};
