import { emptyRecord, validateBackup } from "./engine";
import type { RecordState } from "./types";
let connection: Promise<IDBDatabase> | undefined;
function open() {
  return (connection ??= new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("powersof-learning", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("records");
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        connection = undefined;
      };
      resolve(db);
    };
    request.onerror = () => {
      connection = undefined;
      reject(request.error);
    };
    request.onblocked = () => {
      connection = undefined;
      reject(new Error("Close other powersof tabs to finish opening your learning record."));
    };
  }));
}
export async function loadRecord(): Promise<RecordState> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("records", "readonly");
    const req = tx.objectStore("records").get("learner");
    req.onsuccess = () => {
      try {
        resolve(req.result ? validateBackup(req.result) : emptyRecord());
      } catch (e) {
        reject(e);
      }
    };
    req.onerror = () => reject(req.error);
  });
}
export async function saveRecord(state: RecordState) {
  const db = await open();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("records", "readwrite");
    tx.objectStore("records").put(state, "learner");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("Save aborted."));
  });
}
