import moment from 'moment'
import { createTodoDom, setDeadlineOnBoard } from './view';
const uuid = require('uuid');
let todos

//localstorageに保存
const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos))
}

const saveTodoFromInput = (e) => {
  const todos = getTodos()
  const id = e.target.closest('.todos__item').id
  const todo = todos.find((todo) => todo.id === id)
  todo.title = e.target.innerText
  saveTodos()
}


const loadTodos = () => {
  const todosJSON = localStorage.getItem('todos')

  try {
    return todosJSON ? JSON.parse(todosJSON) : []
  } catch (e) {
    return []
  }
}

const getTodos = () => todos

const addTodo = (date, title, deadline, alert) => {
  const id = uuid.v4()
  const todo = {
    id: id,
    title: title,
    status: false,
    date: date,
    deadline: deadline,
    alert: alert,
  }

  todos.push(todo)
  saveTodos()
  
  return todo
}

const removeTodo = (id) => {
  const todoIndex = todos.findIndex((todo)=> todo.id === id)
  if (todoIndex > -1) {
    todos.splice(todoIndex, 1)
    saveTodos()
  }
}

const addTodoToBoard = (todo, deadline) => {
  let todaySt = moment().format('DD MMM - dddd')
  const thisWeek = document.querySelector('.js-todo-for-this-week')
  const thisMonth = document.querySelector('.js-todo-for-this-month')
  const upcoming = document.querySelector('.js-todo-for-upcoming')
  const todoEl = createTodoDom(todo)
  const date = todo.date
  const today = `${todaySt.split(' -')[0]} - Today,${todaySt.split(' -')[1]}`

  if(date === '' || date === 'Invalid date') {
    if(deadline === 'today') {
      const todayEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML === today)
      todayEl.closest('.date-card__box').querySelector('.todos').appendChild(todoEl)
    } else if(deadline === 'tomorrow') {
      let tomorrowSt = moment().add(1, 'd').format('DD MMM - dddd')
      const tomorrow = `${tomorrowSt.split(' -')[0]} - Tomorrow,${tomorrowSt.split(' -')[1]}`
      const tomorrowEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML === tomorrow)
      tomorrowEl.closest('.date-card__box').querySelector('.todos').appendChild(todoEl)
    } else if(deadline === 'this week') {
      thisWeek.appendChild(todoEl)
    } else if(deadline === 'this month') {
      thisMonth.appendChild(todoEl)
    } else if(deadline === 'upcoming') {
      upcoming.appendChild(todoEl)
    }
  } else {
    const dateEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => {
      let elDate
      if( el.innerHTML.includes(' - Today, ')) {
        let dateSplit = el.innerHTML.split( 'Today, ' );
        elDate = `${dateSplit[0]}${dateSplit[1]}`
      } else if( el.innerHTML.includes(' - Yesterday, ')) {
        let dateSplit = el.innerHTML.split( 'Yesterday, ' );
        elDate = `${dateSplit[0]}${dateSplit[1]}`
      } else if( el.innerHTML.includes(' - Tomorrow, ')) {
        let dateSplit = el.innerHTML.split( 'Tomorrow, ' );
        elDate = `${dateSplit[0]}${dateSplit[1]}`
      } else {
        return el.innerHTML === date
      }
      return elDate === date
    })
    dateEl.closest('.date-card__box').querySelector('.todos').appendChild(todoEl)
  }
  todoEl.addEventListener('keydown', addTodoByEnter)
  return todoEl
}

const createTodoFromWidget = () => {
  const date = moment(document.querySelector('.add-to input[type=date]').value).format('DD MMM - dddd')
  const title = document.querySelector('.js-todo-input input').value
  const deadline = document.querySelector('.js-todo-select-deadline').value
  // const alertEl = document.querySelector('.js-todo-alert')
  // let alert

  // if(alertEl.classList.contains('selected')) {
  //   alert = true
  // } else {
  //   alert = false
  // }
  const todo = addTodo(date, title, deadline, alert)
  addTodoToBoard(todo, deadline)
}
 
const addTodoByEnter = (e) => {
  
  if(e.key === 'Enter') {
    e.preventDefault()
    createTodoOnBoard(e)
    return false;
  }
}

const createTodoOnBoard = (e) => {
  const box = e.target.closest('.date-card__box')
  let date = box.querySelector('.side-header__name').innerText
  const title = ''
  let deadline = ''

  if(date.includes(' - Tomorrow, ')) {
    let dateSplit = date.split( 'Tomorrow, ' );
    date = `${dateSplit[0]}${dateSplit[1]}`
  } else if(date.includes(' - Today, ')) {
    let dateSplit = date.split( 'Today, ' );
    date = `${dateSplit[0]}${dateSplit[1]}`
  } else if(date.includes(' - Yesterday, ')) {
    let dateSplit = date.split( 'Yesterday, ' );
    date = `${dateSplit[0]}${dateSplit[1]}`
  }

  if(date === 'tomorrow' || date === 'this week' || date === 'this month' || date === 'upcoming') {
    deadline = date
    date = ''
  }

  const todo = addTodo(date, title, deadline, alert)
  const todoEl = addTodoToBoard(todo, deadline)
  const el = todoEl.querySelector('div[contenteditable=true]')
  todoEl.querySelector('div[contenteditable=true]').focus()
 
}

const renderTodo = () => {
  let today = moment().format('DD MMM - dddd')
  const thisWeek = document.querySelector('.js-todo-for-this-week')
  const thisMonth = document.querySelector('.js-todo-for-this-month')
  const upcoming = document.querySelector('.js-todo-for-upcoming')
  setDeadlineOnBoard()

  todos.forEach((todo, index) => {
    if(todo.title === '') {
      todos.splice(index, 1)
      saveTodos()
    } else {

      const deadline = todo.deadline
      const todoEl = createTodoDom(todo)

      if(deadline === 'today') {
        const dateEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML.includes('Today'))
        dateEl.closest('.date-card__box').querySelector('.todos').appendChild(todoEl)
      } else if(deadline === 'tomorrow') {
        let tomorrow = moment().add(1, 'd').format('DD MMM - dddd')
        const tomoDate = new Date(moment().add(1, 'd')).getDate()

        const tomorrowEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML.includes(tomoDate))
        tomorrowEl.closest('.date-card__box').querySelector('.todos').appendChild(todoEl)
      } else if(deadline === 'this week') {
        thisWeek.appendChild(todoEl)
      } else if(deadline === 'this month') {
        thisMonth.appendChild(todoEl)
      } else if(deadline === 'upcoming') {
        upcoming.appendChild(todoEl)
      }
      
      let dateEl
      if( todo.date === 'Invalid date') {
        dateEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML.toLowerCase().includes(todo.deadline))
        dateEl.closest('.date-card__box').querySelector('.todos').appendChild(todoEl)
      } else {
        if(todo.date.includes('Today')) {
          dateEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML.includes('Today'))
        } else if(todo.date.includes('Yesterday')) {
          dateEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML.includes('Yesterday'))
        } else if(todo.date.includes('Tomorrow')) {
          dateEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => el.innerHTML.includes('Tomorrow'))
        } else {
          dateEl = Array.from(document.querySelectorAll('.side-header__name')).find(el => {
            let elDate
            if( el.innerHTML.includes(' - Today, ')) {
              let dateSplit = el.innerHTML.split( 'Today, ' );
              elDate = `${dateSplit[0]}${dateSplit[1]}`
            } else if( el.innerHTML.includes(' - Yesterday, ')) {
              let dateSplit = el.innerHTML.split( 'Yesterday, ' );
              elDate = `${dateSplit[0]}${dateSplit[1]}`
            } else if( el.innerHTML.includes(' - Tomorrow, ')) {
              let dateSplit = el.innerHTML.split( 'Tomorrow, ' );
              elDate = `${dateSplit[0]}${dateSplit[1]}`
            } else {
              return el.innerHTML === todo.date
            }
            return elDate === todo.date
          })
        }
        if(dateEl !== undefined) {
          dateEl.closest('.date-card__box').querySelector('.todos').appendChild(todoEl)
        }
      }
    }
  })
}



todos = loadTodos()

export { saveTodoFromInput, createTodoFromWidget, renderTodo, getTodos, saveTodos, createTodoOnBoard, removeTodo, addTodoByEnter}

// localStorage.clear()