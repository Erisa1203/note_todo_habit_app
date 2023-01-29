import moment from 'moment'

import {getTodos, removeTodo, saveTodoFromInput} from './todos'

const handleTodoDragger = (e, todo) => {
  const parent = e.target.closest('.todos__item')
  const todos = getTodos()
  const todoObj = todos.find(todo => todo.id === parent.id)
  
  if (!e.shiftKey) {
    document.querySelectorAll('.todos__item').forEach((el) => el.classList.remove('selected'))
	}
  
  parent.classList.add('selected')
  
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Backspace' ){
      const selectedTodoEls = document.querySelectorAll('.todos__item.selected')
      selectedTodoEls.forEach(todoEl => {
        removeTodo(todoEl.id)
        todoEl.remove()
      })
      return false
    }
  })
}

const createTodoDom = (todo) => {
  const dragger = addDragger()
  const parent = document.createElement('div')
  const checkbox = document.createElement('div')
  const input = document.createElement('div')
  parent.classList.add('todos__item')
  checkbox.classList.add('checkbox')
  input.setAttribute('contenteditable', 'true')
  input.innerHTML = todo.title
  parent.appendChild(checkbox)
  parent.appendChild(input)
  parent.appendChild(dragger)

  parent.setAttribute('id', todo.id)

  if(todo.status === true) {
    checkbox.classList.add('checked')
  }

  input.addEventListener('input', saveTodoFromInput)
  dragger.addEventListener('click', (e) => handleTodoDragger(e, todo))

  return parent
}

const createSideHeader = (title) => {
  const parent = document.createElement('div')
  const name = document.createElement('div')
  parent.classList.add('side-header')
  name.classList.add('side-header__name')
  name.innerText = title
  parent.appendChild(name)
  parent.insertAdjacentHTML('beforeend','<span class="icon md-16 material-symbols-outlined js-add-new-todo">add</span>');

  return parent
}

const setBoardToToday = () => {
  const today = moment().format('DD MMM - dddd')
  const dateEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML === today)

  document.querySelector('.date-card').scrollTop = dateEl.getBoundingClientRect().y - 202
}

const setDeadlineOnBoard = () => {
  const today = moment().format('DD MMM - dddd')
  const tomorrow = moment().add(1, 'd').format('DD MMM - dddd')
  const yesterday = moment().add(-1, 'd').format('DD MMM - dddd')
  let todayEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML === today)
  let tomorrowEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML === tomorrow)
  let yesterdayEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML === yesterday)
  todayEl.innerText = `${todayEl.innerText.split(' -')[0]} - Today,${todayEl.innerText.split(' -')[1]}`
  tomorrowEl.innerText = `${tomorrowEl.innerText.split(' -')[0]} - Tomorrow,${tomorrowEl.innerText.split(' -')[1]}`
  if(yesterdayEl !== undefined) {
    yesterdayEl.innerText = `${yesterdayEl.innerText.split(' -')[0]} - Yesterday,${yesterdayEl.innerText.split(' -')[1]}`
  }
}

const addDragger = () => {
  const div = document.createElement('div')
  div.classList.add('dragger')
  div.setAttribute('contenteditable', 'false')
  div.innerHTML = `<span class="icon md-20 material-symbols-outlined">drag_indicator</span>`
  return div
}

const renderBoard = () => {
  const mainBoard = document.querySelector('.date-card')
  const showDates = 300
  let startDateJSON = localStorage.getItem('startDate')

  if(!startDateJSON) {
    const startDate = moment()
    localStorage.setItem('startDate', JSON.stringify(startDate))
    startDateJSON = startDate
  }

  for(let i = 0; i < showDates; i++) {
    const startDateSetting = moment(JSON.parse(localStorage.getItem('startDate')))
    let tomorrow  = startDateSetting.add(i,'days');
    let dateOutput = tomorrow.format('DD MMM - dddd');
    const sideHeader = createSideHeader(dateOutput)
    const parent = document.createElement('div')
    parent.classList.add('date-card__box')

    const todoBox = document.createElement('div')
    todoBox.classList.add('todos')
    parent.appendChild(sideHeader)
    parent.appendChild(todoBox)
    mainBoard.appendChild(parent)
  }
  setBoardToToday()
}





export {createTodoDom, createSideHeader, renderBoard , setDeadlineOnBoard}

// <div class="todos__item">
// <div class="checkbox"></div>
// <div contenteditable="true">ウェブアプリを作って公開する</div>
// </div>