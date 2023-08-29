import { QueryForm } from '@/store/star'
import { openDB, DBSchema, IDBPDatabase } from 'idb'

export interface Star {
  id: string
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
  updatedAt: string
  starAt: number
}

export interface Account {
  login: string
  avatarUrl: string
  name: string
  from: 'github' | 'search'
  lastSyncAt: string
  addedAt: string
}

export interface DB extends DBSchema {
  stars: {
    value: Star
    key: string
    indexes: {
      "by_starAt": string
      "by_repo": string
      "by_login": string
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
  const db = await openDB<DB>('Stargazers', 1, {
    upgrade(db) {
      const starStore = db.createObjectStore('stars', {
        keyPath: 'id',
        autoIncrement: false,
      });

      starStore.createIndex('by_repo', 'repo', { unique: false });
      starStore.createIndex('by_starAt', 'starAt', { unique: false });
      starStore.createIndex('by_login', 'login', { unique: false });

      const accountStore = db.createObjectStore('accounts', {
        keyPath: 'login',
      })
      accountStore.createIndex('by_login', 'login', { unique: false });
    },
  });

  return db;
}

export async function addStar(db: IDBPDatabase<DB>, star: Star) {
  try {
    const isExist = await db.get('stars', star.id)
    if (isExist) {
      db.put('stars', star);
    } else {
      db.add('stars', star);
    }

  } catch (error) {
    console.log(error)
  }
}

export async function searchByRepo(db: IDBPDatabase<DB>, repo: string) {
  return db.getAllFromIndex('stars', 'by_repo', repo);
}

export async function searchByStarAt(db: IDBPDatabase<DB>, start: string, end: string) {
  return db.getAllFromIndex('stars', 'by_starAt', IDBKeyRange.bound(start, end));
}

export async function searchStar(db: IDBPDatabase<DB>, login: string, queryForm: QueryForm & { page: number, size: number }) {
  const { startTime, endTime, page, size, keyword,language } = queryForm
  let lowerKeyword = keyword?.toLowerCase()
  let lowerLanguage = language?.toLowerCase()
  const stars = await db.getAllFromIndex('stars', 'by_starAt', IDBKeyRange.bound(startTime, endTime));

  stars.reverse()

  const results = stars
    .filter((star) => star.login === login)
    .filter(star => {
      return !keyword
        || star.repo?.toLowerCase().includes(lowerKeyword)
        || star.description?.toLowerCase().includes(lowerKeyword)
        || star.owner?.toLowerCase().includes(lowerKeyword)
    }).filter(star => {
      return star.language?.toLowerCase().includes(lowerLanguage)
    })

  return {
    stars: size === 0 ? results : results.slice((page - 1) * size, page * size),
    total: results.length
  }

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

  accounts.sort((a, b) => {
    return Date.parse(a.addedAt) - Date.parse(b.addedAt)
  })

  return accounts
}
