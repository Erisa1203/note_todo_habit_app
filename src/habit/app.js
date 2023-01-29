
import {addHabit, renderHabits, getHabits, getCurrentMonth, calenderSlide, deleteHabit} from './habit'
import {createHabitHeadDom, createHabitTrackDom, overviewSetting, createHabitForTodayDom, cardSlider, boardSetting, habitTrackDomHandler} from './view'

renderHabits()
overviewSetting(0)
cardSlider()
document.querySelector('.js-add-habit').addEventListener('click', () => {
  const noHabitCard = document.querySelector('.no-habit')
  const habitCard = document.querySelector('.habit-card')
  const title = document.querySelector('.js-habit-input').value
  const color = document.querySelector('.picker').style.backgroundColor
  const year = Number(document.querySelector('.habit-card__head-year').innerHTML)
  const month = Number(getCurrentMonth())
  const date = new Date()

  if(noHabitCard.classList.contains('is-visible')) {
    habitCard.style.display = 'flex'
    noHabitCard.classList.remove('is-visible')
  }

  if(title !== "") {
    const habit = addHabit(title, color)
    createHabitHeadDom(habit)
    createHabitTrackDom(habit, year, month)
    createHabitForTodayDom(habit)
  }
  calenderSlide('current')
  document.querySelector('.js-habit-input').value = ""
})

let habitCount = 0
document.querySelector('.habit-overview__next').addEventListener('click', () => {
  const habits = getHabits()

  if(habitCount === habits.length - 1) {
    habitCount = 0
  } else {
    habitCount++
  }
  overviewSetting(habitCount)
})

document.querySelector('.arrow-box .arrow--back').addEventListener('click', (e) => {
  calenderSlide('back')
})

document.querySelector('.arrow-box .arrow--next').addEventListener('click', (e) => {
  calenderSlide('next')
})

$(".picker").colorPick({
  'initialColor' : '#FFEA7B',
  'palette': ["#FF7B7B", "#f9daf2",  "#EB8FD7", "#d7ade6", "#A57BFF", "#7BA0FF", "#7FEBD7", "#B7EB8F", "#98e6b3", "#FFCA7B", "#FFEA7B", "#ecf0f1", "#a6a6a6"],
  'onColorSelected': function() {
    this.element.css({'backgroundColor': this.color, 'color': this.color});
  }
});
