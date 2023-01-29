import {createNote, getFolders, getSelectedFolder} from './notes'
import { renderNotes, folderChange, createFolderOnOverview, showSidebarWidget, renderFolders } from "./views"
import {setFilters} from "./filters"
const folders = getFolders()
const paramFolder = location.search.substring(1)

renderFolders()
createFolderOnOverview()
showSidebarWidget()

if(paramFolder) {
  const folder = folders.find((folder) => folder.id === paramFolder)
  const foldersEl = Array.from(document.querySelectorAll('.folder-cards > div'))
  const selectedFolder = foldersEl.filter((el) => el.id === paramFolder)
  document.querySelectorAll('.folder-cards > div').forEach((div) => div.classList.remove('selected'))
  if(selectedFolder[0]) {
    selectedFolder[0].classList.add('selected')
    renderNotes(paramFolder, folder.name)
  }
} else {
  renderNotes(folders[0].id, folders[0].name)
}

document.querySelector('#nav-notes').addEventListener('click', () => {
  document.querySelector('#sidebar-notes').classList.add('is_open')
})

document.querySelectorAll('.js-create-new-note').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const selectedFolder = getSelectedFolder()
    const id = createNote()
    location.assign(`/note-edit.html?${selectedFolder.innerText}#${id}`)
  })
})

document.querySelector('#filter-by').addEventListener('change', (e) => {
  const selectedFolder = getSelectedFolder()
  setFilters({
    sortBy: e.target.value
  })
  renderNotes(selectedFolder.id, selectedFolder.name)
})

window.addEventListener('storage', (e) => {
  if (e.key === 'notes') {
    renderNotes()
  }
})


const allFolderDiv = document.querySelectorAll('.folder-cards div')
for(let i = 0; i < allFolderDiv.length; i++) {
  allFolderDiv[i].addEventListener('click', (e) => folderChange(e))
}



// localStorage.clear()