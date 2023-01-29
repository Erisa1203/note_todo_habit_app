
import { deleteEvents, showStarIcon, hideStarIcon, showFavFolderOnOverview, renameFolderName, createNewFolder, starHandler, showSidebarWidget} from './views'
import { addRemoveFoldersToFav, updateFolder, createFolder, removeFolder } from './notes'

document.querySelectorAll('.js-delete').forEach((el) => {
  el.addEventListener('click', (e) => {
    deleteEvents(e)
  })
})

document.querySelector('.js-rename').addEventListener('click', (e) => {
  renameFolderName(e)
})

document.querySelectorAll('.nav__childs .nav__item').forEach((el) => {
  el.addEventListener('click', (e) => {
    if(location.pathname == '/note-edit.html') {
      location.assign(`/note-edit.html#${e.target.id}`)
      location.reload()
    } else {
      location.assign(`/note-edit.html#${e.target.id}`)
    }
  })
})

document.querySelectorAll('.js-star-icon').forEach((star) => {
  star.addEventListener('click', () => {
    starHandler(star)
  })
})

document.querySelectorAll('#sidebar-notes .js-star-icon').forEach((star) => {
  star.addEventListener('click', (e) => {
    starHandler(star)
    const id = e.target.previousSibling.id
    addRemoveFoldersToFav(id, {
      favorite: true
    })
  })
})

document.querySelectorAll('#display-fav-folders .nav__item').forEach((item) => {
  item.addEventListener('click', (e) => {
    if(location.pathname == '/note-edit.html') {
      location.assign(`/note.html?${item.id}`)
    } else {
      const folderNav = document.querySelectorAll('.folder-cards > div')
      showFavFolderOnOverview(item, folderNav)
    }
  })
})

document.querySelector('.js-close-sidebar-opened').addEventListener('click', (e) => {
  document.querySelector('#sidebar-notes').classList.remove('is_open')
})


const noteSidebarOpen = () => {
  const sidebar = document.querySelector('#sidebar-notes')
  sidebar.classList.add('is_open')
}

document.querySelectorAll('.js-create-new-folder').forEach((el) => {
  el.addEventListener('click', () => {
    const id = createFolder()
    const newFolder = createNewFolder(id)
    let name
    noteSidebarOpen()
    newFolder.addEventListener('input', (e) => {
      const folder = updateFolder( id, {
        name: e.target.textContent
      })
      showSidebarWidget()
    })
    newFolder.addEventListener('blur', (e) => {
      newFolder.removeAttribute('contenteditable')
      if(e.target.innerText === '') {
        newFolder.closest('.nav__folder').remove()
        removeFolder(id)
      }
    })
  })
})


