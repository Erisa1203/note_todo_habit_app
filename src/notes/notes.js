import { showFavsOnSidebar, removeFavsOnSidebar } from './views'
const uuid = require('uuid');
import moment from 'moment'
let folders = []
let notes
const noteId = location.hash.substring(1)

const loadFolders = () => {
  const foldersJSON = localStorage.getItem('folders')

  try {
    return foldersJSON ? JSON.parse(foldersJSON) : []
  } catch (e) {
    return []
  }
}

// //Expose notes from module
const getNotes = () =>  notes
const getFolders = () =>  folders

const getAllNotes = () =>  {
  const folders = getFolders()
  const allNotes = folders.filter((folder) => folder.name === 'all notes')
  return allNotes[0].body
}

const getSelectedFolder = () => {
  const foldersEl = Array.from(document.querySelectorAll('.folder-cards > div'))
  const selectedFolder = foldersEl.filter((el) => el.classList.contains('selected'))
  // console.log(selectedFolder)
  return selectedFolder[0]
}

const getNotesInFolder = (folderId) =>  {
  const folders = getFolders()
  let folder
  if(folderId === 'all') {
    folder = folders.filter((folder) => folder.name === 'all notes')
  } else {
    folder = folders.filter((folder) => folder.id === folderId)
  }
  const notes = folder[0].body
  return notes
}

// // Save the notes to localStorage
const saveNotes = () => {
  localStorage.setItem('notes', JSON.stringify(notes))
}

const saveFolders = () => {
  localStorage.setItem('folders', JSON.stringify(folders))
  // console.log('folders', folders)
}

// // Save the notes to localStorage
const saveTexts = () => {
  localStorage.setItem('noteBody', JSON.stringify(texts))
}

const createNote = () => {
  const id = uuid.v4()
  const timestamp = moment().valueOf()
  const folders = getFolders()
  console.log( folders)
  
  const allnotesFolder = folders.find((folder) => folder.name === 'all notes')
  
  const foldersEl = Array.from(document.querySelectorAll('.folder-cards > div'))
  const selectedFolder = foldersEl.find((el) => el.classList.contains('selected'))
  const selectedFolderId = selectedFolder.id
  const filteredFolder = folders.find((folder) => folder.id === selectedFolderId)
  console.log( filteredFolder)
  const note = {
    id: id,
    title: '',
    body: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  if(selectedFolder.id === folders[0].id) {
    allnotesFolder.body.push(note)
  } else {
    allnotesFolder.body.push(note)
    filteredFolder.body.push(note)
  }
  saveFolders()
  return id
}

const createFolder = () => {
  const folders = getFolders()
  const id = uuid.v4()

  folders.push({
    id: id,
    name: '',
    body: [],
  })
  saveFolders()

  return id
}

// Remove a note from the list
const removeNote = (id) => {
  const allfolders = getFolders()
  for (let i = 0; i < allfolders.length; i++) {
    let notes = allfolders[i].body
    const noteIndex = notes.findIndex((note)=> note.id === id)
    if (noteIndex > -1) {
      notes.splice(noteIndex, 1)
      saveFolders()
    }
  }
}

// Remove a folder from the list
const removeFolder = (id) => {
  const folders = getFolders()

  for (let i = 0; i < folders.length; i++) {
    const index = folders.findIndex((folder)=> folder.id === id)
    if (index > -1) {
      folders.splice(index, 1)
      saveFolders()
    }
  }
  const targets = Array.from(document.querySelectorAll('.nav__item > div'))
  const target = targets.filter((div) => div.id === id)
  if(target.length !== 0) {
    const parent = target[0].closest('.nav__item')
    parent.remove()
  }
}

const removeText = (id) => {
  const notes = getAllNotes()
  const note = notes.find((note) => note.id === noteId)
  const textIndex = note.body.findIndex((text)=> text.id === id)
    if (textIndex > -1) {
      note.body.splice(textIndex, 1)
      saveFolders()
    }
}

// Sort your notes by one of three ways
const sortNotes = (sortBy, folderId) => {
  const notes = getNotesInFolder(folderId)
  if (sortBy === 'byEdited') {
    return notes.sort((a, b) => {
      if (a.updatedAt > b.updatedAt) {
        return -1
      } else if (a.updatedAt < b.updatedAt) {
        return 1
      } else {
        return 0
      }
    })
  } else if (sortBy === 'byCreated') {
    return notes.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1
      } else if (a.createdAt < b.createdAt) {
        return 1
      } else {
        return 0
      }
    })
  } else if (sortBy === 'alphabetical') {
    return notes.sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1
      } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1
      } else {
        return 0
      }
    })
  } else {
    return notes
  }
}

const updateNote = (id, updates) => {
  const notes = getNotesInFolder('all')
  const note = notes.find((note) => note.id === id)

  if (!note) {
    return
  }
  const allfolders = getFolders()
  for (let i = 0; i < allfolders.length; i++) {
    let notes = allfolders[i].body
    const note = notes.filter((note)=> note.id === id)
    if (typeof updates.title === 'string' && note[0]) {
      note[0].title = updates.title
      note[0].updatedAt = moment().valueOf()
      saveFolders()
    }
  }
  return note
}

const updateFolder = (id, updates)  => {
  const folders = getFolders()
  const folder = folders.find((folder) => folder.id === id)
  const foldersEl = Array.from(document.querySelectorAll('.folder-cards > div'))
  const selectedFolder = foldersEl.filter((el) => el.id === id)
  if (typeof folder.name === 'string' && foldersEl.length !== 0) {
    selectedFolder[0].innerText = updates.name
  }
  folder.name = updates.name
  saveFolders()
  console.log( folders)
  return folder
}

const createBodyDom = (div, id) => {
  const notes = getAllNotes()
  const note = notes.find((note) => note.id === id)
  const textID = uuid.v4()

  let element
  if(div.classList.contains('note__text--heading2')) {
    element = 'h2'
  } else if(div.classList == 'note__text') {
    element = 'p'
  } else if (div.classList.contains('note__text--checkbox')) {
    element = 'checkbox'
  } else if (div.classList.contains('note__text--code')) {
    element = 'code'
  } else if (div.classList.contains('note__text--toggle')) {
    element = 'toggle'
  }

  if (!div.classList.contains('note__text--checkbox')) {
    div.setAttribute('id', textID)
  } else {
    div.querySelector('div[contenteditable=true]').setAttribute('id', textID)
  }
  if (div.classList.contains('note__text--toggle')) {
    note.body.push({
      id: textID,
      el: element,
      body: [], 
      text: ''
    })
  } else {
    note.body.push({
      id: textID,
      el: element,
      text: ''
    })
  }

  saveFolders()
  return note
}

const updateBodyDom = (div, id) => {
  const notes = getAllNotes()
  const note = notes.filter((note)=> note.id === id)
  let texts = note[0].body
  const textDiv = div.querySelector('.note__text')
  let divId = textDiv.id

  if(!divId) {
    divId = textDiv.querySelector('div[contenteditable=true]').id
  }
  if(div.classList.contains('note__text--toggle')) {
    divId = div.id
  }
  const text = texts.filter((text)=> text.id === divId)

  if(text[0].el === 'checkbox') {
    text[0].text = div.querySelector('.note__text--checkbox').innerHTML
  } else if(div.classList.contains('note__text--toggle')) {
    text[0].text = div.innerHTML
  } else {
    text[0].text = textDiv.innerHTML
  }
  saveFolders()
  return note
}

const addToFavorite = (id) => {
  const notes = getAllNotes()
  const folders = getFolders()
  const favFolder = folders.find((folder) => folder.name == 'favorite')
  const note = notes.find((note) => note.id === id)
  favFolder.body.push({
    id: note.id,
    title: note.title
  })
  saveFolders()
}

const removeFavarite = (id) => {
  const folders = getFolders()
  const favFolder = folders.find((folder) => folder.name == 'favorite')
  const notes = favFolder.body
  const note = notes.find((note) => note.id === id)

  const noteIndex = notes.findIndex((note)=> note.id === id)
  if (noteIndex > -1) {
    favFolder.body.splice(noteIndex, 1)
    saveFolders()
  }
}

const addRemoveFoldersToFav = (id, fav) => {
  const folders = getFolders()
  const folder = folders.filter((folder) => folder.id === id)
  const favFolders = Array.from(document.querySelectorAll('#display-fav-folders .nav__item'))
  const folderInFav = favFolders.find((folder) => folder.id === id)
  if(folder[0].favorite === undefined) {
    folder[0].favorite = fav.favorite
    showFavsOnSidebar(folder[0])
  } else {
    delete folder[0].favorite
    removeFavsOnSidebar(id)
  }
  saveFolders()
}

// const deleteText = (noteId, textId) => {
//   const notes = getAllNotes()
//   const note = notes.filter((note)=> note.id === noteId)
//   const texts = note[0].body
//   const noteIndex = texts.findIndex((text)=> text.id === textId)
//   const textEls = Array.from(document.querySelectorAll('.note__text:not(#note-title)'))
//   const textEl = textEls.filter((el)=> el.id === textId)
//   console.log('textEl', textEl)
//   // console.log('textEl', textEl)
//   const container = textEl[0].closest('.note__container')
//   texts.splice(noteIndex, 1)
//   container.remove()
//   saveFolders()
// }

const deleteText = (container) => {
  event.preventDefault()
  const text = container.querySelector('.note__text')
  console.log(container)
  console.log(text)
  const textId = text.id
  const notes = getAllNotes()
  const note = notes.filter((note)=> note.id === noteId)
  const texts = note[0].body
  const noteIndex = texts.findIndex((text)=> text.id === textId)
  texts.splice(noteIndex, 1)
  container.closest('.js-drag-wrap').remove()
  saveFolders()
}

folders = loadFolders()

export { saveNotes, createNote, getNotesInFolder, createFolder,getNotes, updateNote, updateFolder, sortNotes, removeNote, createBodyDom, updateBodyDom, saveFolders, getFolders, getAllNotes, removeFolder, addToFavorite, removeFavarite, addRemoveFoldersToFav, getSelectedFolder, removeText, deleteText}