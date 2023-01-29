import { initializeEditPage, addNewBlock, renderFolders, toggleNotesInSidebar, showSidebarWidget, checkboxHandler, toggleHandler } from './views'
import { updateNote, updateBodyDom, removeFavarite, addToFavorite, deleteText, getFolders} from './notes'
import { handleDragLeave, handleDragOver, handleDragStart, handleDrop, addCheckboxByEnter, deleteByBackspace, addDnDHandlers} from './ui'
const uuid = require('uuid');
const titleElement = document.querySelector('#note-title')
const noteId = location.hash.substring(1)

renderFolders()
toggleNotesInSidebar()
showSidebarWidget()
initializeEditPage(noteId)

titleElement.addEventListener('input', (e) => {
  const note = updateNote(noteId, {
    title: e.target.textContent
  })
})

document.querySelector('.add-new-block .add-new').addEventListener('click', () => {
  document.querySelector('.add-new-card').classList.add('active')
})

document.querySelector('.add-new-card').addEventListener('mouseleave', () => {
  document.querySelector('.add-new-card').classList.remove('active')
})


document.querySelector('#createHeading2').addEventListener('click', () => {
  document.querySelector('.add-new-card').classList.remove('active')
  const newDom = addNewBlock(createHeading2)
  newDom.addEventListener('input', () => {
    updateBodyDom(newDom, noteId)
  })
})

document.querySelector('#createCode').addEventListener('click', () => {
  document.querySelector('.add-new-card').classList.remove('active')
  const newDom = addNewBlock('code')
  newDom.addEventListener('input', () => {
    updateBodyDom(newDom, noteId)
  })
})

document.querySelector('#createToggle').addEventListener('click', () => {
  document.querySelector('.add-new-card').classList.remove('active')
  const newDom = addNewBlock('toggle')
  console.log('newDom', newDom)
  newDom.addEventListener('input', () => {
    updateBodyDom(newDom, noteId)
  })
})

document.querySelector('#createParagraph').addEventListener('click', () => {
  document.querySelector('.add-new-card').classList.remove('active')
  const newDom = addNewBlock(createParagraph)
  
  newDom.addEventListener('input', () => {
    updateBodyDom(newDom, noteId)
  })
})

document.querySelector('#createCheckbox').addEventListener('click', () => {
  document.querySelector('.add-new-card').classList.remove('active')
  const newDom = addNewBlock('createCheckbox')
  newDom.addEventListener('input', () => {
    updateBodyDom(newDom, noteId)
  })
})

document.querySelectorAll('.note__text--checkbox .checkbox').forEach((box) => {
  box.addEventListener('click', (e) => {
    e.preventDefault()
    const parent = box.closest('.js-drag-wrap')
    const parentWrap = parent.closest('.note__text--toggle')
    checkboxHandler(box)
    if(!parentWrap) {
      parent.blur()
      updateBodyDom(parent, noteId)
    } else {
      updateBodyDom(parentWrap, noteId)
    }
  })
})

document.querySelectorAll('.note__text--toggle > div:first-child .icon').forEach((icon) => {
  icon.addEventListener(('click'), toggleHandler)
})

const noteDoms = document.querySelectorAll('.js-drag-wrap');
[].forEach.call(noteDoms, addDnDHandlers);

noteDoms.forEach((div) => {
  div.addEventListener('input', (e) => {
    updateBodyDom(div, noteId)
  })

  div.addEventListener('blur', (e) => {
    // div.setAttribute('contenteditable', 'true')
  })
})



document.querySelector('.note__info .js-star-icon').addEventListener('click', (e) => {
  if(e.target.classList.contains('material-icons')) {
    removeFavarite(noteId)
  } else {
    addToFavorite(noteId)
  }
})

document.addEventListener('keydown', deleteByBackspace);

document.querySelectorAll('.note__text--checkbox div[contenteditable=true').forEach((div) => {
  
  div.closest('.js-drag-wrap').addEventListener('keydown', addCheckboxByEnter)
})

document.querySelectorAll('.note__text--toggle').forEach((div) => {
  div.closest('.js-drag-wrap').addEventListener('keydown', addCheckboxByEnter)

  div.querySelectorAll('.trash-bin').forEach(el => {
    el.addEventListener('click', () => {
      deleteText(el.closest('.note__container'))
    })
  })
  div.addEventListener('change', (e) => {
    console.log('aa')
  })
})


// console.log('-----------')
// const folders = getFolders()
// // console.log(folders[0].body[0].body.find((el) => el.el === 'toggle').body)
// folders[0].body[0].body.find((el) => el.el === 'toggle').body.forEach((el) => {
//   console.log(el.text)
// })
// console.log('-----------')