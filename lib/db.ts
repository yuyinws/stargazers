import { openDB, DBSchema, IDBPDatabase } from 'idb'

export interface Star {
  login: string
  repo: string
  forkCount: number
  description: string
  homepageUrl: string
  isArchived: boolean
  isTemplate: boolean
  license: string
  owner: string
  ownerAvatarUrl: string
  language: string
  languageColor: string
  stargazerCount: string
  pushedAt: Date
  starAt: Date
}

export interface Account {
  login: string
  avatarUrl: string
  name: string
  from: 'github' | 'search'
}

interface DB extends DBSchema {
  stars: {
    value: Star
    key: string
    indexes: {
      "by_starAt": string
      "by_repo": string
    }
  },
  accounts: {
    value: Account
    key: string
    indexes: {
      "by_login": string
    }
  },

}

export async function initDb() {
  const db = await openDB<DB>('GitHubStars', 1, {
    upgrade(db) {
      const starStore = db.createObjectStore('stars', {
        keyPath: 'id',
        autoIncrement: true,
      });

      starStore.createIndex('by_repo', 'repo', { unique: false });
      starStore.createIndex('by_starAt', 'starAt', { unique: false });

      const accountStore = db.createObjectStore('accounts', {
        keyPath: 'login',
      })
      accountStore.createIndex('by_login', 'login', { unique: false });
    },
  });

  return db;
}

export async function addStar(db: IDBPDatabase<DB>, star: Star) {
  const tx = db.transaction('stars', 'readwrite');
  await tx.store.add(star);
  await tx.done;
}

export async function searchByRepo(db: IDBPDatabase<DB>, repo: string) {
  return db.getAllFromIndex('stars', 'by_repo', repo);
}

export async function searchByStarAt(db: IDBPDatabase<DB>, start: string, end: string) {
  return db.getAllFromIndex('stars', 'by_starAt', IDBKeyRange.bound(start, end));
}

export async function addAccount(db: IDBPDatabase<DB>, account: Account) {
  const tx = db.transaction('accounts', 'readwrite')
  await tx.store.add(account)
  await tx.done
  return tx
}

export async function getAllAccount(db: IDBPDatabase<DB>) {
  const transaction = db.transaction('accounts', 'readonly')
  const store = transaction.objectStore('accounts')

  const accounts = await store.getAll()

  return accounts
}
