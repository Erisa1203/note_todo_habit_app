import moment from 'moment'
import { boardSetting, createHabitHeadDom, createHabitTrackDom, createHabitForTodayDom, overviewSetting, habitTrackDomHandler } from './view';
import {  } from './view';
const uuid = require('uuid');
let habits

//localstorageに保存
const saveHabit = () => {
  localStorage.setItem('habits', JSON.stringify(habits))
}


const loadHabits = () => {
  const habitsJSON = localStorage.getItem('habits')

  try {
    return habitsJSON ? JSON.parse(habitsJSON) : []
  } catch (e) {
    return []
  }
}

const getHabits = () => habits

const addHabit = (title, color) => {
  const id = uuid.v4()
  let year = document.querySelector('.habit-card__head-year').innerHTML
  const yearObj = { [year]: [] }

  const habit = {
    id: id,
    title: title,
    dates: [],
    color: color,
    longestStreak: 0,
    createdAt: new Date()
  }

  if(habit.dates.length === 0) {
    habit.dates.push(yearObj)
  } else {
    const yearObj = { [year]: [] }
    let yearExist = habit.dates.find(date => Object.keys(date)[0] === year.toString())

    if(yearExist === undefined) {
      habit.dates.push(yearObj)
    }
  }

  if(yearObj[year].length === 0) {
    for(let i = 1; i <= 12; i ++) {
      yearObj[year].push({
        [i]: []
      })
    }
  }

  habits.push(habit)
  saveHabit()
  
  return habit
}

const createYearArray = (habit, year) => {
  const yearObj = { [year]: [] }
  let yearExist = habit.dates.find(date => Object.keys(date)[0] === year.toString())

  if(yearExist === undefined) {
    habit.dates.push(yearObj)
  }

  if(yearObj[year].length === 0) {
    for(let i = 1; i <= 12; i ++) {
      yearObj[year].push({
        [i]: []
      })
    }
  }
  saveHabit()
}

const trackHandler = (habit, month, year) => {
  
  const allTrack = document.querySelectorAll('.habit-card__row.track')
  const allDiv = Array.from(allTrack).find(track => track.id === habit.id).childNodes

  const yearExist = habit.dates.find(key => Object.keys(key)[0] === year.toString())
  if(yearExist === undefined) {
    createYearArray(habit, year)
  }
  const yearObj = habit.dates.filter(key => Object.keys(key)[0] === year.toString())[0][year]
  const monthArray = yearObj.find(key => Object.keys(key)[0] === month.toString())[month]
  const startYear = new Date(habit.createdAt).getFullYear()
  const startMonth = new Date(habit.createdAt).getMonth() + 1
  const startDate = new Date(habit.createdAt).getDate()
  const currentYear = Number(document.querySelector('.habit-card__head-year').innerHTML)
  const currentMonth = Number(getCurrentMonth())

  if(currentYear === startYear && startMonth === currentMonth) {
    allDiv[startDate - 1].classList.add('start-date')
  } else {
    allDiv.forEach(div => div.classList.remove('start-date'))
  }
  allDiv.forEach(div => div.classList.remove('selected'))
  monthArray.find(date => allDiv[date - 1].classList.add('selected'))
}

const renderHabits = () => {

  const habitBoard = document.querySelector('.habit-card')
  const date = new Date()
  let currentYear = date.getFullYear()
  let month = date.getMonth() + 1
  // month = 3

  const year = boardSetting(currentYear, month)
  if(habits.length === 0) {
    document.querySelector('.no-habit').classList.add('is-visible')    
  } else {
    habitBoard.style.display = 'flex'

    habits.forEach((habit) => {
      createYearArray(habit, year)
      createHabitHeadDom(habit)
      createHabitTrackDom(habit, year, month)
      trackHandler(habit, month, year)
      createHabitForTodayDom(habit)
    })
  }
}



const getCurrentMonth = () => document.querySelector('.habit-card__head-month').innerHTML.split('月')[0]

const getCurrentMonthHabit = (habit) => {
  const date = new Date()
  let year = date.getFullYear()
  // year = 2024
  const currentMonth = getCurrentMonth()
  const yearObj = habit.dates.find(key => Object.keys(key)[0] === year.toString())[year]
  const monthArray = yearObj.find(key => Object.keys(key)[0] === currentMonth)[currentMonth]
  monthArray.sort((n, m) => (n - m))
  return monthArray
}

const getLastMonthHabit = (month, year, habit) => {
  const date = new Date()
  const yearObj = habit.dates.find(key => Object.keys(key)[0] === year.toString())[year]
  const monthArray = yearObj.find(key => Object.keys(key)[0] === month.toString())[month]
  monthArray.sort((n, m) => (n - m))
  return monthArray
}

const trackerHandler = (div) => {
  const habits = getHabits()
  const id = div.closest('.track').id
  const habit = habits.find(habit => habit.id === id)
  const habitCount = habits.findIndex(habit => habit === habit)
  const dates = habit.dates
  const today = new Date().getDate()
  let year = document.querySelector('.habit-card__head-year').innerHTML
  const row = div.closest('.track').childNodes
  let selectedDate = Array.from(row).findIndex(item => item === div) + 1
  const currentMonth = getCurrentMonth()

  div.classList.contains('selected') ? div.classList.remove('selected') : div.classList.add('selected')

  let yearExist = dates.find(date => Object.keys(date)[0] === year.toString())
  if(yearExist === undefined) {
    const year = document.querySelector('.habit-card__head-year').innerHTML
    habits.forEach(habit => {
      createYearArray(habit, year)
    })
  }
  let monthObj = yearExist[year].find(month => Object.keys(month)[0] === currentMonth)[currentMonth]

  if(selectedDate === today) {
    const todaysHabits = document.querySelectorAll('.habit-for-today__item')
    let habitForToday = Array.from(todaysHabits).find(item => item.id === habit.id)
    div.classList.contains('selected') ? habitForToday.classList.add('selected') : habitForToday.classList.remove('selected')
  }

  if(monthObj.includes(selectedDate) === false) {
    monthObj.push(selectedDate)
  } else {
    let index = monthObj.findIndex(date => date ===  selectedDate)
    monthObj.splice(index, 1)
  }

  overviewSetting(habitCount)
  saveHabit()
}

const calcCurrentStreak = (habitCount) => {
  const habits = getHabits()
  let currentMonth = Number(getCurrentMonth())
  let year = new Date().getFullYear()
  let today = new Date().getDate()
  const monthArray = getCurrentMonthHabit(habits[habitCount])
  monthArray.sort((n, m) => (n - m))
  let todaysDatePos = monthArray.findIndex(num => num === today)
  let streak

  if(todaysDatePos === -1) {
    streak = 0
  } else {
    streak = 1
    for(let i = todaysDatePos - 1; i >= 0; i--) monthArray[i] === monthArray[i + 1] - 1 ? streak++ : i = 0

    if(monthArray.includes(1)) { //１日が☑︎なら先月も調べる
      let month
      let eom = new Date( year, month, 0 ).getDate()

      if(currentMonth === 1) {
        month = 12
        year--
      } else { currentMonth - 1 }

      const lastMonthArray = getLastMonthHabit(month, year, habits[habitCount])

      if(lastMonthArray.includes(eom)) {
        streak++
        for(let i = lastMonthArray.length - 1; i >= 0; i--) {
          if(lastMonthArray[i] === lastMonthArray[i + 1] - 1) {
            streak++
          }
        }
      }
    }
  }
  return streak
}

const getLongestStreak = (streak, habitCount) => {
  const habits = getHabits()

  if( streak > habits[habitCount].longestStreak) {
    habits[habitCount].longestStreak = streak
    saveHabit()
  }
  return habits[habitCount].longestStreak
}

const getTotal = (habitCount) => {
  const habits = getHabits()
  const monthArray = getCurrentMonthHabit(habits[habitCount])
  return monthArray.length
}

const getScore = (habitCount) => {
  const checked = getCurrentMonthHabit(habits[habitCount]).length
  const eom = Number(document.querySelector('.dates > div:last-child').innerHTML)
  let totalScore = `${Math.floor(checked / eom * 100)}%`
  return totalScore
}

const calenderSlide = (dir) => {
  let currentYear = Number(document.querySelector('.habit-card__head-year').innerHTML)
  let month = Number(getCurrentMonth())
  let showMonth = month
  const habits = getHabits()

  document.querySelector('.arrow--next').classList.add('active')
  if(dir === 'back') {
    if(month === 1) {
      showMonth = 12
      currentYear--
    } else {
      showMonth--
    }
  } else if(dir === 'next') {
    if(month === 12) {
      showMonth = 1
      currentYear++
    } else {
      showMonth++
    }
  } else if(dir === 'current') {
    const today = new Date()
    showMonth = today.getMonth() + 1
    currentYear = today.getFullYear()
  }
  document.querySelectorAll('.dates > div').forEach(div => div.remove())
  boardSetting(currentYear, showMonth)
  
  habits.forEach(habit => {
    habitTrackDomHandler(habit, currentYear, showMonth)
  })
}

const deleteHabit = () => {
  const habits = getHabits()
  const head = event.target.closest(".habit-card__head")
  const name = head.querySelector('.habit-card__title').innerHTML
  const habit = habits.find(habit => habit.title === name)
  const habitIndex = habits.findIndex(habit => habit.title === name)
  const tracks = document.querySelectorAll('.track')
  const targetTrack = Array.from(tracks).find(track => track.id === habit.id)
  const todaysHabits = document.querySelectorAll('.habit-for-today__item')
  const todaysHabit = Array.from(todaysHabits).find(item=> item.id === habit.id)

  if (habitIndex > -1) {
    habits.splice(habitIndex, 1)
    const currentHabits = getHabits()

    if(currentHabits.length === 0) {
      document.querySelector('.no-habit').classList.add('is-visible')
      document.querySelector('.habit-card').style.display = 'none'
    }
  }
  targetTrack.remove()
  head.remove()
  todaysHabit.remove()
  saveHabit()
}

habits = loadHabits()

export { saveHabit, renderHabits, addHabit, getHabits, trackerHandler,getCurrentMonth, trackHandler, getCurrentMonthHabit, getLastMonthHabit, calcCurrentStreak, getLongestStreak, getTotal, getScore, calenderSlide, deleteHabit }
