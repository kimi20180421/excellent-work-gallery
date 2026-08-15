(() => {
  const DB_NAME = 'pixel100-gallery-media';
  const DB_VERSION = 1;
  const STORE_NAME = 'media';
  const SOURCE_PREFIX = 'indexeddb:';

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.addEventListener('upgradeneeded', () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME);
        }
      });
      request.addEventListener('success', () => resolve(request.result));
      request.addEventListener('error', () => reject(request.error));
    });
  }

  async function runTransaction(mode, action) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      const request = action(store);
      request.addEventListener('success', () => resolve(request.result));
      request.addEventListener('error', () => reject(request.error));
      transaction.addEventListener('complete', () => database.close());
      transaction.addEventListener('abort', () => reject(transaction.error));
    });
  }

  function sourceFor(key) {
    return `${SOURCE_PREFIX}${key}`;
  }

  function keyFromSource(source) {
    return source.startsWith(SOURCE_PREFIX) ? source.slice(SOURCE_PREFIX.length) : '';
  }

  async function put(key, file) {
    await runTransaction('readwrite', store => store.put(file, key));
    return sourceFor(key);
  }

  async function resolve(source) {
    const key = keyFromSource(source);
    if (!key) return source;
    const blob = await runTransaction('readonly', store => store.get(key));
    if (!blob) throw new Error('媒体文件不存在');
    return URL.createObjectURL(blob);
  }

  async function remove(source) {
    const key = keyFromSource(source);
    if (!key) return;
    await runTransaction('readwrite', store => store.delete(key));
  }

  async function migrateLocalStorage(storageKey) {
    let content;
    try {
      content = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return;
    }
    if (!Array.isArray(content)) return;

    let changed = false;
    for (const entry of content) {
      if (!entry?.id || typeof entry.source !== 'string' || !entry.source.startsWith('data:')) continue;
      const blob = await fetch(entry.source).then(response => response.blob());
      entry.source = await put(entry.id, blob);
      changed = true;
    }
    if (!changed) return;

    const serialized = JSON.stringify(content);
    try {
      localStorage.setItem(storageKey, serialized);
    } catch {
      localStorage.removeItem(storageKey);
      localStorage.setItem(storageKey, serialized);
    }
  }

  navigator.storage?.persist?.().catch(() => {});

  window.MediaStore = {
    put,
    resolve,
    remove,
    migrateLocalStorage
  };
})();
