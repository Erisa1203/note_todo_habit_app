

import moment from 'moment'

import {createTodoFromWidget, renderTodo, getTodos, saveTodos, createTodoOnBoard, saveTodoFromInput, addTodoByEnter} from './todos'
import {renderBoard} from './view'
// localStorage.clear()
renderBoard()
renderTodo()

document.querySelector('.app-widget .js-add-new-todo').addEventListener('click', () => {
  createTodoFromWidget()
  document.querySelector('.js-todo-input input').value = ""
})

document.querySelectorAll('.todo-app__content .js-add-new-todo').forEach(el => {
  el.addEventListener('click', createTodoOnBoard)
});

document.querySelectorAll('.todo-app__content div[contenteditable=true]').forEach(el => {
  el.addEventListener('input', saveTodoFromInput)
  el.addEventListener('keydown', addTodoByEnter)
});


document.querySelectorAll('.checkbox').forEach((checkbox) => {
  checkbox.addEventListener('click', () => {
    const todoID = checkbox.closest('.todos__item').id
    const todos = getTodos()
    const todo = todos.find((todo) => todo.id === todoID)
    console.log(todo)
    if(checkbox.classList.contains('checked')) {
      checkbox.classList.remove('checked')
      todo.status = false
    } else {
      checkbox.classList.add('checked')
      todo.status = true
    }
    saveTodos()
  })
})