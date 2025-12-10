import { openDB, deleteDB, wrap, unwrap } from "https://cdn.jsdelivr.net/npm/idb@8/+esm";

console.log("# rt.js #");

const DB_NAME = "MioDatabase";
const STORE_NAME = "datiJSON";
const DB_VERSION = 1;

async function openDatabase() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
  return db;
}

async function salvaJsonInDB(oggettoDaSalvare) {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, "readwrite");
    await tx.store.put(oggettoDaSalvare);
    await tx.done;
    console.log(`Oggetto con ID ${oggettoDaSalvare.id} salvato con successo!`);
  } catch (error) {
    console.error("Errore durante il salvataggio in IndexedDB:", error);
  }
}

document.addEventListener("rt", (e) => {
  console.log("Ricevuto:", e.detail.messaggio);
  salvaJsonInDB({ id: e.detail.messaggio });
});
