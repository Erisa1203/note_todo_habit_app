import moment from 'moment'
import {trackerHandler, getHabits, getCurrentMonthHabit, calcCurrentStreak, getLongestStreak, getTotal, getScore, trackHandler, deleteHabit } from './habit'

const boardSetting = (year, month) => {
  const datesRow = document.querySelector('.habit-card__content .dates')
  const yearDisplay = document.querySelector('.habit-card__head-year')
  const monthDisplay = document.querySelector('.habit-card__head-month')
  const date = new Date( year, month, 0 )
  // month = 3
  
  let eom = new Date( year, month, 0 ).getDate()
  const nameOfMonth = date.toLocaleString('default', {month: 'long'})
  // eom = 31
  yearDisplay.innerHTML = year
  monthDisplay.innerHTML = nameOfMonth
  // monthDisplay.innerHTML = '3月'

  for(let i = 1; i <= eom; i++) {
    const div = document.createElement('div')
    div.innerHTML = i
    datesRow.appendChild(div)
  }

  return year
}

const cardSlider = () => {
  const habitCard = document.querySelector('.habit-card')
  habitCard.classList.add('add-to-next')
  habitCard.classList.add('add-to-prev')
}

const createHabitHeadDom = (habit) => {
  const head = document.querySelector('.habit-card__fixed')
  const parent = document.createElement('div')
  const colorBlock = document.createElement('span')
  const title = document.createElement('span')
  parent.classList.add('habit-card__head')
  colorBlock.classList.add('color-block')
  title.classList.add('habit-card__title')
  title.innerHTML = habit.title
  colorBlock.style.backgroundColor = habit.color
  const icon = document.createElement('span')
  icon.classList.add('icon')
  icon.classList.add('md-14')
  icon.classList.add('material-symbols-outlined')
  icon.innerHTML = 'delete'
  parent.appendChild(icon)
  icon.addEventListener('click', deleteHabit)
  parent.appendChild(colorBlock)
  parent.appendChild(title)
  head.appendChild(parent)

  return parent
}

const createHabitTrackDom = (habit, year, month) => {
  const content = document.querySelector('.habit-card__content')
  const parent = document.createElement('div')
  const classes =  ['habit-card__row', 'habit-card__item', 'track']
  classes.forEach(item => parent.classList.add(item))
  parent.setAttribute('id', habit.id)
  const date = new Date()
  let eom = new Date( date.getFullYear(), date.getMonth() + 1, 0 ).getDate()
  const startYear = new Date(habit.createdAt).getFullYear()
  const startMonth = new Date(habit.createdAt).getMonth() + 1
  const startDate = new Date(habit.createdAt).getDate()
  // eom = 28
  for(let i = 1; i <= eom; i++) {
    const div = document.createElement('div')
    div.classList.add('track__date')
    const inner = document.createElement('div')
    div.appendChild(inner)
    inner.style.backgroundColor = habit.color
    parent.appendChild(div)
    div.addEventListener('click', () => trackerHandler(div))

    
    if(year === startYear && month === startMonth && i === startDate) {
      // console.log(div)
      // div.classList.add('start-date')
    }
  }
  content.appendChild(parent)
  return parent
}

const habitTrackDomHandler = (habit, year, month) => {
  const eom = Number(document.querySelector('.dates div:last-child').innerHTML)
  const track = Array.from(document.querySelectorAll('.track')).filter(row => row.id === habit.id)[0]
  const dateBoxes = track.querySelectorAll('.track__date')

  if(dateBoxes.length !== eom) {
    let diff = eom - dateBoxes.length
    if(diff > 0) {
      const diffAbs = Math.abs(diff)
      for(let i = 0; i < diffAbs; i++) {
        const div = document.createElement('div')
        const inner = document.createElement('div')
        div.classList.add('track__date')
        div.appendChild(inner)
        track.appendChild(div)
      }
    } else {
      const diffAbs = Math.abs(diff)
      for(let i = 0; i < diffAbs; i++) {
        console.log( dateBoxes[i])
        dateBoxes[i].remove()
      }
    }
  } 
  trackHandler(habit, month, year)
}

const checkboxHandler = (e) => e.target.classList.contains('selected') ? e.target.classList.remove('selected') : e.target.classList.add('selected')

const habitCheckboxHandler = (e) => {
  const habits = getHabits()
  const habit = habits.find(habit => habit.id === e.target.id)
  console.log(habit)
  console.log( e.target.id)
  const date = new Date().getDate()
  const allTrack = document.querySelectorAll('.habit-card__row.track')
  const allDiv = Array.from(allTrack).find(track => track.id === habit.id).childNodes
  e.target.classList.contains('selected') ? e.target.classList.remove('selected') : e.target.classList.add('selected')
  trackerHandler(allDiv[date - 1])
}

const createHabitForTodayDom = (habit) => {
  const inner = document.querySelector('.habit-for-today__content')
  const habitDiv = document.createElement('div')
  const checkBox = document.createElement('div')
  const habitTitleDiv = document.createElement('span')
  const today = new Date().getDate()

  habitDiv.classList.add('habit-for-today__item')
  checkBox.classList.add('check')
  habitDiv.appendChild(checkBox)
  habitDiv.appendChild(habitTitleDiv)
  habitDiv.setAttribute('id', habit.id)
  habitTitleDiv.innerHTML = habit.title
  inner.appendChild(habitDiv)
  habitDiv.style.backgroundColor = `${habit.color.split(')')[0]} , .3)`
  habitDiv.addEventListener('click', habitCheckboxHandler)

  const monthArray = getCurrentMonthHabit(habit)
  const todaysHabit = monthArray.find(key => key === today)

  if(todaysHabit === today) habitDiv.classList.add('selected')
}

const overviewSetting = (habitCount) => {
  const habits = getHabits()

  const overviewCard = document.querySelector('.habit-overview')
  const overviewTitle = document.querySelector('.js-overview-title')
  const nextHabit = document.querySelector('.habit-overview__next')
  const currentStreakDisplay = document.querySelector('.js-current-streak')
  const longestStreakDisplay = document.querySelector('.js-longest-streak')
  const thisMonthScoreDisplay = document.querySelector('.js-this-month-score')
  const thisMonthPercDisplay = document.querySelector('.js-this-month-percent')
  const thisMonthTotalDisplay = document.querySelector('.js-this-month-total')

  
  // console.log()
  if(habits.length === 0) {
    currentStreakDisplay.innerHTML = 0
  } else {
    // const habitCount = 0
    const streak = calcCurrentStreak(habitCount)
    const longestStreak = getLongestStreak(streak, habitCount)
    const total = getTotal(habitCount)
    const score = getScore(habitCount)
    // console.log(streak)
    currentStreakDisplay.innerHTML = streak
    longestStreakDisplay.innerHTML = longestStreak
    thisMonthTotalDisplay.innerHTML = total
    thisMonthScoreDisplay.innerHTML = score
    overviewTitle.innerHTML = habits[habitCount].title
  }
  // console.log(counter)
}

export {boardSetting, createHabitHeadDom, createHabitTrackDom, createHabitForTodayDom, overviewSetting, cardSlider, habitTrackDomHandler}
