// utils/indexedDbServices.ts
import { openDB, IDBPDatabase } from "idb";

/**
 * Service shape stored in IndexedDB
 */
export interface ApiService {
  _id: string;
  label: string;
  value?: string;
  status: boolean;
  // any extra fields from backend are preserved
  [k: string]: any;
}

/* ----- CONFIG ----- */
const DB_NAME = "finseraa_db";
const DB_VERSION = 1;
const STORE_SERVICES = "services";
const STORE_META = "meta"; // store lightweight metadata (timestamps, etags, etc.)

// TTL: 30 days in milliseconds
export const ONE_MONTH_TTL = 30 * 24 * 60 * 60 * 1000;

/* ----- DB INIT ----- */
async function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_SERVICES)) {
        const store = db.createObjectStore(STORE_SERVICES, { keyPath: "_id" });
        // useful indexes (optional, not strictly needed)
        store.createIndex("by-value", "value", { unique: false });
        store.createIndex("by-status", "status", { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META);
      }
    },
  });
}

/* ----- HELPERS ----- */

/** Save (upsert) array of services and record timestamp of save */
export const saveServicesToIDB = async (
  services: ApiService[]
): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction([STORE_SERVICES, STORE_META], "readwrite");
  try {
    const svcStore = tx.objectStore(STORE_SERVICES);
    for (const svc of services) {
      // upsert by _id
      svcStore.put(svc);
    }
    // store the saved timestamp (ms)
    tx.objectStore(STORE_META).put(Date.now(), "services_saved_at");
    await tx.done;
  } catch (err) {
    // ensure transaction aborts propagate
    tx.done.catch(() => {});
    throw err;
  }
};

/** Read all services. Returns null if not found or expired (TTL). */
export const getServicesFromIDB = async (): Promise<ApiService[] | null> => {
  const db = await getDb();
  const metaStore = db
    .transaction(STORE_META, "readonly")
    .objectStore(STORE_META);
  const savedAt = (await metaStore.get("services_saved_at")) as
    | number
    | undefined;

  if (!savedAt) return null;

  const isExpired = Date.now() - savedAt > ONE_MONTH_TTL;
  if (isExpired) {
    // clear expired data
    await clearServicesFromIDB();
    return null;
  }

  const services = await db
    .transaction(STORE_SERVICES, "readonly")
    .objectStore(STORE_SERVICES)
    .getAll();
  return Array.isArray(services) && services.length
    ? (services as ApiService[])
    : null;
};

/** Clears services store and timestamp */
export const clearServicesFromIDB = async (): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction([STORE_SERVICES, STORE_META], "readwrite");
  tx.objectStore(STORE_SERVICES).clear();
  tx.objectStore(STORE_META).delete("services_saved_at");
  await tx.done;
};

/* ----- OPTIONAL UTILS (useful for sync/diff logic) ----- */

/** Get the saved timestamp (ms) or null */
export const getServicesSavedAt = async (): Promise<number | null> => {
  const db = await getDb();
  const savedAt = await db
    .transaction(STORE_META, "readonly")
    .objectStore(STORE_META)
    .get("services_saved_at");
  return typeof savedAt === "number" ? savedAt : null;
};

/** Force upsert (put) only - does NOT update saved_at (useful if you want to upsert incremental changes) */
export const upsertServicesToIDB = async (
  services: ApiService[]
): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction(STORE_SERVICES, "readwrite");
  const store = tx.objectStore(STORE_SERVICES);
  for (const s of services) {
    await store.put(s);
  }
  await tx.done;
};

/** Replace entire services store with provided array (clears old then inserts) and updates saved_at */
export const replaceServicesInIDB = async (
  services: ApiService[]
): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction([STORE_SERVICES, STORE_META], "readwrite");
  const store = tx.objectStore(STORE_SERVICES);
  await store.clear();
  for (const s of services) {
    await store.put(s);
  }
  tx.objectStore(STORE_META).put(Date.now(), "services_saved_at");
  await tx.done;
};

/** Delete services by an array of _id strings */
export const deleteServicesByIds = async (ids: string[]): Promise<void> => {
  if (!ids || !ids.length) return;
  const db = await getDb();
  const tx = db.transaction(STORE_SERVICES, "readwrite");
  const store = tx.objectStore(STORE_SERVICES);
  for (const id of ids) {
    store.delete(id);
  }
  await tx.done;
};

/** Return list of all _ids currently in IDB */
export const getAllServiceIds = async (): Promise<string[]> => {
  const db = await getDb();
  const all = await db
    .transaction(STORE_SERVICES, "readonly")
    .objectStore(STORE_SERVICES)
    .getAllKeys();
  return (all as string[]) ?? [];
};

/* ----- SMALL DIFF HELPER: produce new/updated/removed lists ----- */
/**
 * Compare apiList vs localList (both arrays of ApiService) and compute diffs.
 * Note: comparison uses _id for identity and shallow compare of label/value/status.
 */
export const diffLocalAndApi = (
  localList: ApiService[] = [],
  apiList: ApiService[] = []
): {
  newItems: ApiService[];
  updatedItems: ApiService[];
  removedIds: string[];
} => {
  const localMap = new Map(localList.map((s) => [s._id, s]));
  const apiMap = new Map(apiList.map((s) => [s._id, s]));

  const newItems: ApiService[] = [];
  const updatedItems: ApiService[] = [];

  for (const apiSvc of apiList) {
    const localSvc = localMap.get(apiSvc._id);
    if (!localSvc) {
      newItems.push(apiSvc);
      continue;
    }
    const changed =
      localSvc.label !== apiSvc.label ||
      (localSvc.value || "") !== (apiSvc.value || "") ||
      Boolean(localSvc.status) !== Boolean(apiSvc.status);
    if (changed) updatedItems.push(apiSvc);
  }

  const removedIds: string[] = [];
  for (const localSvc of localList) {
    if (!apiMap.has(localSvc._id)) removedIds.push(localSvc._id);
  }

  return { newItems, updatedItems, removedIds };
};
