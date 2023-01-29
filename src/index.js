import { renderFolders, toggleNotesInSidebar} from "./notes/views"


renderFolders()
toggleNotesInSidebar()

document.querySelector('.add-contents .btn').addEventListener('click', () => {
  document.querySelector('.icon-nav').classList.add('is_open')
  document.querySelector('.icon-nav_wrapper').style.display = 'block'
})

document.querySelector('.icon-nav_wrapper').addEventListener('click', () => {
  document.querySelector('.icon-nav').classList.remove('is_open')
  document.querySelector('.icon-nav_wrapper').style.display = 'none'
})

if(document.querySelector('.alert')) {
  document.querySelector('.alert').addEventListener('click', (e) => {
    const el = document.querySelector('.alert')
    if(el.classList.contains('selected')) {
      el.classList.remove('selected')
    } else {
      el.classList.add('selected')
    }
  })
}

document.querySelector('.js-close-sidebar').addEventListener('click', (e) => {
  const arrow = document.querySelector('.js-close-sidebar')
  const sidebar = document.querySelector('.sidebar-wrapper')
  const container = document.querySelector('.app-content .l-container')
  console.log( arrow.classList.contains('dir-open'))
  
  if(arrow.classList.contains('dir-open')) {
    sidebar.classList.remove('hide')
    container.classList.remove('wide')
    arrow.classList.remove('dir-open')
  } else {
    sidebar.classList.add('hide')
    container.classList.add('wide')
    arrow.classList.add('dir-open')

  }
})
