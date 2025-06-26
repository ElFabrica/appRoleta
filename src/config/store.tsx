import { createStore, Store } from 'tinybase';
import { createExpoSqlitePersister, ExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import * as SQLite from 'expo-sqlite';

// Cria ou abre o banco de dados SQLite chamado 'database.db'
const db = SQLite.openDatabaseSync('database.db');

// Cria uma instância da store do TinyBase
const store: Store = createStore();

// Define os nomes das tabelas
const USERS_TABLE = 'usersRoleta';
const PRIZES_TABLE = 'prizes';

// Cria o persister que conecta a store ao banco SQLite
const persister: ExpoSqlitePersister = createExpoSqlitePersister(store, db);

let isStoreInitialized = false; // Flag para evitar múltiplas inicializações

// Função para inicializar a store carregando os dados e ativando o autosave
const initializeStore = async () => {
  // Evita múltiplas inicializações desnecessárias
  if (isStoreInitialized) {
    console.log("Store já inicializada.");
    return;
  }

  try {
    console.log("Inicializando store com persister...");
    // Carrega dados do SQLite para a store em memória.
    // Se o banco ou as tabelas não existirem, ele não lançará erro aqui,
    // mas a store em memória estará vazia para essas tabelas.
    await persister.load();
    console.log("Dados carregados do persister.");

    // Opcional: Garantir que as tabelas existam na store após o load,
    // especialmente se o banco de dados puder estar completamente vazio na primeira execução.
    // TinyBase geralmente cria tabelas implicitamente quando você adiciona linhas pela primeira vez.
    // Mas para listeners ou getTable funcionarem sem erro se a tabela estiver vazia e não existir,
    // é bom garantir que elas estejam definidas.
    if (!store.hasTable(USERS_TABLE)) {
      store.setTable(USERS_TABLE, {});
      console.log(`Tabela ${USERS_TABLE} explicitamente inicializada (não existia na store).`);
    }
    if (!store.hasTable(PRIZES_TABLE)) {
      store.setTable(PRIZES_TABLE, {});
      console.log(`Tabela ${PRIZES_TABLE} explicitamente inicializada (não existia na store).`);
    }

    // Salva automaticamente qualquer alteração da store em memória para o SQLite
    await persister.startAutoSave();
    console.log("Autosave iniciado.");
    isStoreInitialized = true;
  } catch (error) {
    console.error("Erro Crítico ao inicializar a store:", error);
    // É importante tratar esse erro, talvez mostrando um alerta para o usuário
    // ou impedindo o uso do app até que seja resolvido.
    throw error; // Re-lança o erro para que o chamador (App.tsx) possa lidar com ele.
  }
};

// Função auxiliar para limpar uma tabela específica
const clearTable = async (tableName: string) => {
  if (!isStoreInitialized) {
    // Teoricamente, você poderia querer limpar mesmo sem inicializar,
    // mas geralmente faz mais sentido operar em uma store carregada.
    // await initializeStore(); // Ou lançar um erro / aviso
    console.warn("Tentando limpar tabela antes da store ser inicializada. Carregando store primeiro...");
    await initializeStore(); // Garante que a store esteja carregada e o autosave ativo
  }
  store.delTable(tableName); // Remove todos os dados da tabela na memória
  // O autosave deve cuidar de persistir essa deleção.
  // Se o autosave não estivesse ativo, você precisaria de `await persister.save();`
  console.log(`Tabela ${tableName} limpa. Autosave deve persistir.`);
  // Não é necessário `await persister.load();` aqui, pois o estado em memória é a fonte da verdade.
};
// Método auxiliar para atualizar uma linha existente
const updateRow = (tableName: string, rowId: string, newData: any) => {
  const currentRow = store.getRow(tableName, rowId);
  if (!currentRow) {
    console.warn(`Linha com ID ${rowId} não encontrada na tabela ${tableName}`);
    return;
  }
  store.setRow(tableName, rowId, { ...currentRow, ...newData });
};


export {
  store,
  USERS_TABLE,
  PRIZES_TABLE,
  initializeStore,
  persister, // Exporte se precisar acessar diretamente, mas geralmente não é necessário fora daqui
  clearTable,
  isStoreInitialized, // Pode ser útil para verificar em outros lugares
  updateRow
};