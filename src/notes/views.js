import moment from 'moment'
const uuid = require('uuid');

import { getFilters } from './filters'
import {updateFolder, removeNote, sortNotes, createBodyDom, getFolders, getAllNotes, getNotesInFolder, removeFolder, deleteText, saveFolders, addRemoveFoldersToFav, updateBodyDom} from './notes'
import {addDnDHandlers, addCheckboxByEnter} from './ui'
const noteId = location.hash.substring(1)

const createTrashBin = () => {
  const span = document.createElement('span')
  span.classList.add('material-symbols-outlined')
  span.classList.add('note-list__delete')
  span.innerText = 'delete'
  return span
}

// Generate the DOM structure for a note
const generateNoteDOM = (note) => {
  const noteEl = document.createElement('div')
  const noteElLink = document.createElement('a')
  const textEl = document.createElement('p')
  const statusEl = document.createElement('p')
  const infoDiv = document.createElement('div')
  const foldersEl = Array.from(document.querySelectorAll('.folder-cards > div'))
  const selectedFolder = foldersEl.filter((el) => el.classList.contains('selected'))
  const folder = selectedFolder[0].innerText

  // Setup the note title text
  if (note.title.length > 0) {
    textEl.textContent = note.title
  } else {
    textEl.textContent = 'Unnamed note'
  }
  noteEl.classList.add('note-list__item')
  noteEl.setAttribute('id', note.id)
  textEl.classList.add('note-list__title')
  infoDiv.classList.add('note-list__info')
  noteEl.appendChild(noteElLink)
  noteElLink.appendChild(textEl)
  noteElLink.appendChild(infoDiv)
  infoDiv.appendChild(statusEl)

  // Setup the link
  noteEl.addEventListener('click', (e) => {
    location.assign(`/note-edit.html?${folder}#${note.id}`)
  })

  // Setup the status message
  statusEl.textContent = generateLastEdited(note.updatedAt)

  const trash = createTrashBin()
  noteEl.appendChild(trash)
  const deleteBtn = noteEl.querySelector('.note-list__delete')

  deleteBtn.addEventListener('click', () => {
    noteEl.remove()
    removeNote(note.id)
  })
  return noteEl
}

const createFolderOnOverview = () => {
  const folders = getFolders()
  const parent = document.createElement('div')
  const parentDom = document.querySelector('.widget-holder')
  parent.classList.add('folder-cards')
  for(let i = 0; i < folders.length; i++) {
    const div = document.createElement('div')
    if(i === 0) {
      div.classList.add('selected')
    }
    if(folders[i].name !== '') {
      div.classList.add('border-card')
      div.classList.add('border-card--sm')
      div.setAttribute('id', folders[i].id)
      parent.appendChild(div)
      div.innerText = folders[i].name
      div.addEventListener('click', (e) => folderChange(e))

    }
  }
  parentDom.insertAdjacentHTML('afterend', parent.outerHTML)
  return parent
}

// Render application notes
const renderNotes = (folderId, folderName) => {
  const notesEl = document.querySelector('.note-list')
  const filters = getFilters()
  const folders = getFolders()
  const notes = sortNotes(filters.sortBy, folderId)
  const overviewTitle = document.querySelector('#overview-title')
  const allnotesFolder = folders.filter((folder) => folder.name === 'all notes')
  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(filters.searchText.toLowerCase()))
  notesEl.textContent = ''

  overviewTitle.innerText = folderName
  if (filteredNotes.length > 0) {
    if(folderId === folders[0].id) {
      for(let i = 0; i < allnotesFolder.length; i++) {
        let notes = allnotesFolder[i].body
        notes.forEach((note) => {
          const noteEl = generateNoteDOM(note)
          notesEl.appendChild(noteEl)
        })
      }
    } else {
      const folderNotes = getNotesInFolder(folderId)
      folderNotes.forEach((note) => {
        const noteEl = generateNoteDOM(note)
        notesEl.appendChild(noteEl)
      })
    }
  } else {
    const emptyMessage = document.createElement('p')
    emptyMessage.textContent = 'No notes to show'
    emptyMessage.classList.add('empty-message')
    notesEl.appendChild(emptyMessage)
  }
}

const folderChange = (e) => {
  const folders = getFolders()
  console.log( folders)
  const sidebar = document.querySelector('#sidebar-notes')
  const isOpen = sidebar.classList.contains('is_open')
  if(isOpen === true) {
    sidebar.classList.remove('is_open')
  }
  const folderEl = e.target
  const folderId = folderEl.id
  const folderName = folderEl.innerText
  document.querySelectorAll('.folder-cards > div').forEach((div) => div.classList.remove('selected'))
  folderEl.classList.add('selected')
  renderNotes(folderId, folderName)
}

const toggleHandler = (e) => {
  e.preventDefault()
  const parent = e.target.closest('.js-drag-wrap')
  parent.blur()
  const toggleBox = parent.querySelector('.note__togglebox')
  toggleBox.style.transition = '.3 linear'
  if(toggleBox.classList.contains('close')) {
    toggleBox.style.height = 'auto'
    toggleBox.classList.remove('close')
    toggleBox.style.paddingTop = '10px'
    toggleBox.style.paddingBottom = '10px'
  } else {
    toggleBox.classList.add('close')
    toggleBox.style.height = '0px'
    toggleBox.style.paddingTop = '0'
    toggleBox.style.paddingBottom = '0'
    toggleBox.style.overflow = 'hidden'
  }
}

const toggleStyle = (div) => {
  div.setAttribute('contenteditable', 'false')
  const input = document.createElement('div')
  const inner = document.createElement('div')
  const togglebox = document.createElement('div')
  togglebox.classList.add('note__togglebox')
  input.setAttribute('contenteditable', 'true')
  const iconSpan = document.createElement('span')
  iconSpan.classList.add('icon')
  iconSpan.classList.add('md-16')
  iconSpan.classList.add('material-symbols-outlined')
  iconSpan.innerHTML = 'expand_more'
  div.appendChild(inner)
  div.appendChild(togglebox)
  inner.appendChild(iconSpan)
  inner.appendChild(input)
  input.focus()
  input.addEventListener('blur', () => {
    div.closest('.js-drag-wrap').setAttribute('contenteditable', 'true')
  })
  iconSpan.addEventListener('click', toggleHandler)
}

const createEachTextBlock = (item) => {
  const div = document.createElement('div')
  const container = document.createElement('div')
  const dragWrapper = document.createElement('div')
  const trash = addTrashBin(container)
  const dragger = addDragger(container)
  container.classList.add('note__container')
  container.setAttribute('contenteditable', 'false')
  dragWrapper.setAttribute('draggable', 'true')
  dragWrapper.setAttribute('contenteditable', 'true')
  dragWrapper.classList.add('js-drag-wrap')

  if(!item.text == '') {
    div.setAttribute('contenteditable', 'true')
    div.setAttribute('id', item.id)
    div.classList.add('note__text')
    container.appendChild(div)
    dragWrapper.appendChild(container)
    document.querySelector('.note__content').appendChild(dragWrapper)
    div.innerHTML = item.text

    if(item.el === 'h2') {
      div.classList.add('note__text--heading2')
    } else if(item.el === 'checkbox') {
      div.setAttribute('contenteditable', 'false')
      div.classList.add('note__text--checkbox')
    } else if(item.el === 'code') {
      div.classList.add('note__text--code')
    } else if(item.el === 'toggle') {
      div.classList.add('note__text--toggle')
      if(div.querySelector('.js-drag-wrap')) {
        div.querySelector('.note__togglebox').style.padding = '10px 30px'
      }
    }
  }
  trash.addEventListener('click', () => deleteText(container))
  dragger.addEventListener('click', () => textSelected(container))
  addDnDHandlers(dragWrapper)
}

const checkboxHandler = (checkbox) => {
  if(checkbox.classList.contains('checked')) {
    checkbox.classList.remove('checked')
  } else {
    checkbox.classList.add('checked')
  }
}

const addTrashBin = (el) => {
  if(!el.querySelector('.trash-bin')) {
    const trash = document.createElement('div')
    trash.classList.add('trash-bin')
    trash.setAttribute('contenteditable', 'false')
    trash.innerHTML = `<span class="icon md-16 material-symbols-outlined">delete</span>`
    el.appendChild(trash)
    return trash
  }
}
const addDragger = (el) => {
  const div = document.createElement('div')
  div.classList.add('dragger')
  div.setAttribute('contenteditable', 'false')
  // div.setAttribute('draggable', 'true')
  div.innerHTML = `<span class="icon md-20 material-symbols-outlined">drag_indicator</span>`
  el.appendChild(div)
  return div
}


// const deleteText = (container) => {
//   const textId = container.querySelector('div:[contenteditable=true]').id
//   container.remove()
//   removeText(textId)
// }

// const keypress_ivent = (e) => {
//   if(e.key === 'Delete'){
//   }
//   return false; 
// }

// document.addEventListener('keypress', keypress_ivent);


const textSelected = (container) => {
  const allSelected = document.querySelectorAll('.js-selected')
  const text = container.querySelector('.note__text')
  if(text === document.activeElement) {
  }
  if (event.shiftKey) {
    container.classList.add('js-selected')
	} else {
    allSelected.forEach((div) => div.classList.remove('js-selected'))
    container.classList.add('js-selected')
  }
}

const addNewBlock = (el, parent) => {
  const dragWrapper = document.createElement('div')
  dragWrapper.setAttribute('draggable', 'true')
  dragWrapper.classList.add('js-drag-wrap')
  
  if(el !== 'createCheckbox') {
    const container = document.createElement('div')
    const div = document.createElement('div')
    dragWrapper.setAttribute('contenteditable', 'true')
    div.setAttribute('placeholder', 'Type something...')
    div.setAttribute('contenteditable', 'true')
    container.classList.add('note__container')
    container.appendChild(div)
    dragWrapper.appendChild(container)
    div.classList.add('note__text')
    document.querySelector('.note__content').appendChild(dragWrapper)

    if(el == createParagraph) {
    } else if(el == createHeading2) {
      div.classList.add('note__text--heading2')
    } else if(el == 'code') {
      div.classList.add('note__text--code')
    } else if(el == 'toggle') {
      dragWrapper.setAttribute('contenteditable', 'false')
      div.classList.add('note__text--toggle')
      toggleStyle(div)
    }

    const trash = addTrashBin(container)
    const dragger = addDragger(container)
    trash.addEventListener('click', () =>  deleteText(container))
    dragger.addEventListener('click', () => textSelected(container))
    dragWrapper.focus()
    createBodyDom(div, noteId)
    addDnDHandlers(dragWrapper)
    return dragWrapper

  } else if (el === 'createCheckbox') {
    const div = document.createElement('div')
    const container = document.createElement('div')
    dragWrapper.setAttribute('contenteditable', 'false')
    div.classList.add('note__text')
    div.classList.add('note__text--checkbox')
    container.classList.add('note__container')
    container.appendChild(div)
    const checkboxEl = document.createElement('div')
    checkboxEl.classList.add('checkbox')
    div.setAttribute('contenteditable', 'false')
    container.setAttribute('contenteditable', 'false')
    checkboxEl.setAttribute('contenteditable', 'false')
    const textEl = document.createElement('div')
    textEl.setAttribute('contenteditable', 'true')
    textEl.setAttribute('placeholder', 'Type something')
    div.appendChild(checkboxEl)
    div.appendChild(textEl)
    container.appendChild(div)
    dragWrapper.appendChild(container)

    if(parent) {
      parent.querySelector('.note__togglebox').appendChild(dragWrapper)
      dragWrapper.closest('.js-drag-wrap').focus()
    } else {
      document.querySelector('.note__content').appendChild(dragWrapper)
    }
    createBodyDom(div, noteId)
    const trash = addTrashBin(container)
    const dragger = addDragger(container)
    trash.addEventListener('click', () =>  deleteText(container))
    dragger.addEventListener('click', () => textSelected(container))
    checkboxEl.addEventListener('click', () => {
      // checkboxHandler(checkboxEl)
      const parent = checkboxEl.closest('.js-drag-wrap')
      const parentWrap = parent.closest('.note__text--toggle')
      checkboxHandler(checkboxEl)
      if(!parentWrap) {
        parent.blur()
        updateBodyDom(parent, noteId)
      } else {
        updateBodyDom(parentWrap, noteId)
      }
    })
    textEl.focus()
    textEl.addEventListener('blur', () => dragWrapper.setAttribute('contenteditable', 'true'))
    textEl.addEventListener('keydown', addCheckboxByEnter)
    addDnDHandlers(dragWrapper)
    return dragWrapper

  }
}

const showFavFolderOnOverview = (el, folderEls) => {
  const id = el.id
  if(folderEls !== undefined) {
    const folder = Array.from(folderEls).find((folder) => folder.id === id)
    folderEls.forEach((el) => el.classList.remove('selected'))
    folder.classList.add('selected')
    renderNotes(id, folder.innerText)
  }
}

const createBacktoFolderEl = () => {
  const folders = getFolders()
  let paramFolder = location.search.substring(1)
  const span = document.createElement('span')
  const parent = document.querySelector('.note--edit')
  const classes = ['border-card', 'border-card--sm', 'border-card--aligncenter', 'js-go-back-to-folder']
  classes.forEach((item) => span.classList.add(item))

  if(paramFolder) {
    //all%20notes -> all notes
    if(paramFolder.includes('%20') === true) {
      paramFolder = paramFolder.replace(/%20/g, ' ')
    }
    const folder = folders.find((folder) => folder.name === paramFolder)
    span.addEventListener('click', () => {
      if(location.pathname == '/note-edit.html') {
        location.assign(`/note.html?${folder.id}`)
      }
    })
    span.innerHTML = `<span class="icon md-16 material-symbols-outlined">chevron_left</span>${paramFolder}`
    parent.insertBefore(span, parent.firstChild);
  }
}

const initializeEditPage = (noteId) => {
  const titleElement = document.querySelector('#note-title')
  const createdDateEl = document.querySelector('#created-at')
  const dateElement = document.querySelector('#last-edited')
  const notes = getAllNotes()
  const note = notes.find((note) => note.id === noteId)
  const folders = getFolders()
  const favNotes = folders.find((folder) => folder.name === 'favorite').body
  const isFavorite = favNotes.filter((note) => note.id === noteId)
  const star = document.querySelector('.note__info .js-star-icon')
  const texts = note.body
  createBacktoFolderEl()

  if (!note) {
    location.assign('/index.html')
  }

  if(isFavorite.length !== 0) {
    star.classList.add('material-icons')
  }

  if(texts.length === 0) {
    const newBlock = addNewBlock(createParagraph)
  } else {
    texts.forEach((item) => {
      if(item.text === '') {
        let grabbedNum = texts.findIndex((text) => text === item)
        texts.splice(grabbedNum, 1)
        saveFolders()
      }
        createEachTextBlock(item)
    })
  }
  titleElement.focus()
  titleElement.textContent = note.title
  createdDateEl.textContent = moment().format('MMMM Do YYYY, h:mm:ss a')
  dateElement.textContent = generateLastEdited(note.updatedAt)
}

// Generate the last edited message
const generateLastEdited = (timestamp) => {
  return `Last edited ${moment(timestamp).fromNow()}`
}

const createFolderDom = (folder) => {
  const nav = document.querySelector('#sidebar-notes nav')
  const parent = nav.querySelector('.nav__content')
  const divFolder = document.createElement('div')
  divFolder.classList.add('nav__folder')
  const div = document.createElement('div')
  div.classList.add('nav__item')
  div.classList.add('nav__item--space')
  // div.setAttribute('draggable', 'true')
  const folderTitleEl = document.createElement('div')
  div.appendChild(folderTitleEl)
  divFolder.appendChild(div)
  parent.appendChild(divFolder)
  folderTitleEl.insertAdjacentHTML('afterend','<span class="icon md-14 material-symbols-outlined js-star-icon">star</span>');
  return folderTitleEl
}

const createNotesInFolder = (notes, parent) => {
  const childDiv = document.createElement('div')
  const folder = parent.querySelector('.nav__item > div').innerText
  childDiv.classList.add('nav__childs')
  for(let i = 0; i < notes.length; i++) {
    const div = document.createElement('div')
    div.classList.add('nav__item')
    div.innerText = notes[i].title
    div.setAttribute('id', notes[i].id)
    childDiv.appendChild(div)
    parent.appendChild(childDiv)
    div.addEventListener('click', (e) => {
      location.assign(`/note-edit.html?${folder}#${notes[i].id}`)
    })
  }
}

const hideStarIcon = (star) => {
  star.classList.add('material-symbols-outlined')
  star.classList.remove('material-icons')
  star.style.opacity = 0
}

const showStarIcon = (star) => {
  star.style.opacity = 1
  star.classList.remove('material-symbols-outlined')
  star.classList.add('material-icons')
}

const starHandler = (star) => {
  if(star.classList.contains('material-icons')) {
    hideStarIcon(star)
  } else {
    showStarIcon(star)
  }
}


const showFavsOnSidebar = (folder) => {
  const favDisplay = document.querySelector('#display-fav-folders')
  const div = document.createElement('div')
  const inner = document.createElement('div')
  div.appendChild(inner)
  div.classList.add('nav__item')
  inner.classList.add('nav__inner')
  inner.innerText = folder.name
  div.setAttribute('id', folder.id)
  favDisplay.appendChild(div)
  div.addEventListener('click', () => {
    if(location.pathname == '/note-edit.html') {
      location.assign(`/note.html?${folder.id}`)
    } else {
      const folderNav = document.querySelectorAll('.folder-cards > div')
      showFavFolderOnOverview(folder, folderNav)
    }
  })
}

const removeFavsOnSidebar = (id) => {
  const folders = getFolders()
  const favFolders = Array.from(document.querySelectorAll('#display-fav-folders .nav__item'))
  const folderEl = favFolders.find((folder) => folder.id === id)
  folderEl.remove()
}
const renderFolders = () => {
  const folders = getFolders()
  const id = uuid.v4()
  const id2 = uuid.v4()
  const filteredFolder = folders.filter((folder) => folder.name == 'all notes')

  if(filteredFolder.length === 0) {
    folders.push({
      id: id,
      name: 'all notes',
      body: []
    },
    {
      id: id2,
      name: 'favorite',
      body: []
    })
  }

  for(let i = 0; i < folders.length; i++) {
    const folderTitleEl = createFolderDom(folders[i])
    if(i === 0) {
      folderTitleEl.setAttribute('note', 'all-note')
    }
    if(folders[i].favorite === true) {
      const star = folderTitleEl.nextSibling
      showStarIcon(star)
      showFavsOnSidebar(folders[i])
    }
    folderTitleEl.innerText = folders[i].name
    folderTitleEl.setAttribute('id', folders[i].id)

    const folderEl = folderTitleEl.closest('.nav__folder')
    createNotesInFolder(folders[i].body, folderEl)
  }
}

const createNewFolder = (id) => {
  const folders = getFolders()
  const folderTitleEl = createFolderDom(folders)
  const folderCardDiv = document.createElement('div')
  const parent = document.querySelector('.folder-cards')
  folderCardDiv.classList.add('border-card')
  folderCardDiv.classList.add('border-card--sm')
  folderCardDiv.setAttribute('id', id)
  const star = folderTitleEl.closest('.nav__item').querySelector('.js-star-icon')

  if(parent) {
    parent.appendChild(folderCardDiv)
    folderCardDiv.innerText = 'untitled'
  }
  folderTitleEl.setAttribute('placeholder', 'Folder name...')
  folderTitleEl.setAttribute('contenteditable', 'true')
  folderTitleEl.setAttribute('id', id)

  folderTitleEl.focus()
  folderCardDiv.addEventListener('click', (e) => folderChange(e))
  star.addEventListener('click', (e) => {
    starHandler(star)
    const id = e.target.previousSibling.id
    addRemoveFoldersToFav(id, {favorite: true })
  })
  return folderTitleEl
}

const toggleNotesInSidebar = () => {
  document.querySelectorAll('.nav__content .nav__folder .nav__item > div').forEach((el)=> {
    el.addEventListener('click', () => {
      const parent = el.closest('.nav__folder')
      const notes = parent.querySelectorAll('.nav__childs .nav__item')
      const childDiv = parent.querySelector('.nav__childs')
      if(!parent.classList.contains('active') && notes.length !== 0) {
        parent.classList.add('active')
        const items = childDiv.querySelectorAll('.nav__item')
        const height = 49 * (items.length + 1 - 1)
        childDiv.style.height = `${height}px`
      } else if(parent.classList.contains('active')) {
        parent.classList.remove('active')
        childDiv.style.height = `0px`
      }
    })
  })
}

const showSidebarWidget = () => {
  const foldersInSidebar = document.querySelectorAll('#sidebar-notes .nav__item')
  const sidebarWidgetWrapper = document.querySelector('.sidebar-widget_wrapper')
  const sidebarWidget = document.querySelector('.sidebar-widget')

  foldersInSidebar.forEach((el) => {
    let target
    const div = el.querySelector('div')
    if(div) {
      target = div.getAttribute('note')
    }

    if(target !== 'all-note') {
      el.addEventListener('contextmenu', (e) => {
        if(el.parentElement.classList.contains('nav__childs')) {
          sidebarWidget.setAttribute('kind', 'note')
        } else {
          sidebarWidget.setAttribute('kind', 'folder')
        }
        sidebarWidget.setAttribute('id', e.target.id)
        sidebarWidgetWrapper.style.display = 'block'
        sidebarWidget.style.left = e.pageX + 'px'
        sidebarWidget.style.top = e.pageY + 'px'
        return false;
      })
    }
  })

  sidebarWidgetWrapper.addEventListener('click', () => {
    sidebarWidgetWrapper.style.display = 'none'
  })
}

const deleteEvents = (e) => {
  const target = e.target
  const id = document.querySelector('.sidebar-widget').id
  const kind = document.querySelector('.sidebar-widget').getAttribute('kind')
  const noteEl = Array.from(document.querySelectorAll('.nav__childs .nav__item')).filter((note) => note.id === id)
  if(kind === 'note') {
    for(let i = 0; i < noteEl.length; i++) {
      noteEl[i].remove()
    }
    removeNote(id)
  } else {
    removeFolder(id)
  }
}

const renameFolderName = (e) => {
  const target = e.target
  const id = document.querySelector('.sidebar-widget').id
  const noteEl = Array.from(document.querySelectorAll('.nav__folder > .nav__item > div')).filter((note) => note.id === id)
  const el = noteEl[0]
  const folders = getFolders()
  const folder = folders.find((folder) => folder.id === el.id)
  el.setAttribute('contenteditable', 'true')
  el.addEventListener('input', (e) => {
    folder.name === e.target.innerHTML
    updateFolder( folder.id, {
      name: e.target.innerHTML
    })
  })
  console.log(folder)
  console.log(el)
  
  let range = document.createRange();
  range.selectNodeContents(el);
  let sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

export { renderNotes, renderFolders, initializeEditPage, addNewBlock, createNewFolder, folderChange, createFolderOnOverview, toggleNotesInSidebar, showSidebarWidget, deleteEvents, showStarIcon, hideStarIcon, showFavFolderOnOverview, showFavsOnSidebar, removeFavsOnSidebar, checkboxHandler, addTrashBin, renameFolderName, starHandler, toggleHandler}