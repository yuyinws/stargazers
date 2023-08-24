import { QueryForm } from '@/store/star';
import { initDb, searchStar } from './db'
import { getUnixTime } from 'date-fns';
import { cloneDeep } from 'lodash'

export interface Language {
  name: string
  count: number
  color: string
}

export interface Owner {
  name: string
  count: number
  avatar: string
}

function replace(str: string) {
  return str.replace("-", '')
}

export async function analyze(login: string, searchQueryForm: QueryForm) {
  const db = await initDb()
  const _searchQueryForm = cloneDeep(searchQueryForm)
  _searchQueryForm.startTime = _searchQueryForm.startTime ? getUnixTime(_searchQueryForm.startTime) : -Infinity
  _searchQueryForm.endTime = _searchQueryForm.endTime ? getUnixTime(_searchQueryForm.endTime) : Infinity

  const results = await searchStar(db, login, {
    ..._searchQueryForm,
    page: 1,
    size: 0
  })

  const owners: Owner[] = []

  const languages: Language[] = []

  results.stars.forEach((star) => {
    const findOwnerIndex = owners.findIndex(owner => replace(owner.name) === replace(star.owner))
    const findLangIndex = languages.findIndex(lang => lang.name === star.language)
    if (findOwnerIndex === -1) {
      owners.push({
        name: replace(star.owner),
        count: 1,
        avatar: star.ownerAvatarUrl
      })
    } else {
      owners[findOwnerIndex].count++
    }

    if (findLangIndex === -1) {
      languages.push({
        name: star.language,
        count: 1,
        color: star.languageColor
      })
    } else {
      languages[findLangIndex].count++
    }
  })

  owners.sort((a, b) => {
    return b.count - a.count
  })

  languages.sort((a, b) => {
    return b.count - a.count
  })

  return {
    owners: owners.slice(0, 5),
    languages: languages.slice(0, 5)
  }
}
