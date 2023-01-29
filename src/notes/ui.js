import {getAllNotes, saveFolders, deleteText, updateBodyDom} from './notes'
import {addNewBlock} from './views'

const noteId = location.hash.substring(1)

const getText = (id, texts) => {
  const text = texts.find((text) => text.id === id)
  return text;
}

var dragSrcEl = null;

function handleDragStart(e) {
  const notes = getAllNotes()
  const note = notes.find((note) => note.id === noteId)
  const texts = note.body
  let target = this.querySelector('.note__text')
  let id = target.id
  let isInside = this.closest('.note__togglebox')
  let grabbedNum = texts.findIndex((text) => text.id === target.id)
  dragSrcEl = this;
  let text = getText(id, note.body)
  const textString = JSON.stringify(text)
  // document.querySelectorAll('.js-grabbed').forEach((el) => el.classList.remove('js-grabbed'))
  this.classList.add('js-grabbed')
  console.log('this' , this)
  console.log('-------------' )
  // console.log('target' , target)
  // console.log('id' , id)
  
  this.blur()
  if(!id) {
    target = this.querySelector('.note__text div[contenteditable=true]')
    id = target.id
  }
  

  if(isInside) {
    if(!this.querySelector('.note__text--toggle')) {
      const toggleBox = this.closest('.note__togglebox')
      const parent = toggleBox.closest('.js-drag-wrap')
      const toggleEl = parent.querySelector('.note__text--toggle')
      const toggleElObjs = getText(toggleEl.id, texts)
      e.dataTransfer.setData('grabbed', this.outerHTML);
      if(text === undefined) {
        text = toggleElObjs.body.find((obj) => obj.id === id)
      }

      console.log('texts', note.body)
      console.log('this', this)
      console.log('toggleElObjs', toggleElObjs)
      // console.log('--------------------')
      console.log('text', text)
      console.log('target', target)

      const grabbedTextString = JSON.stringify(text)
      e.dataTransfer.setData('grabbedText', grabbedTextString);
      this.classList.add('in-toggle')
    }

    const textsAll = document.querySelectorAll('.note__togglebox .js-drag-wrap')
    const textIndex = Array.from(textsAll).findIndex((el) => el === this)

    e.dataTransfer.setData('textIndex', textIndex);
  }
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);
  e.dataTransfer.setData('num', grabbedNum);
  e.dataTransfer.setData('obj', textString);
  return
}

function handleDragOver(e) {
  const isToggle = this.querySelector('.note__text--toggle')
  if (e.preventDefault) {
    e.preventDefault();
  }
  if(isToggle) {
    this.classList.add('toggle-over');
  } else {
    this.classList.add('over');
  }
  e.dataTransfer.dropEffect = 'move';

  return false;
}

function handleDragLeave(e) {
  const isToggle = this.querySelector('.note__text--toggle')
  if(isToggle) {
    this.classList.remove('toggle-over');
  } else {
    this.classList.remove('over');
  }
}

function handleDrop(e) {
  const dropHTML = e.dataTransfer.getData('text/html');
  const dropObjSt = e.dataTransfer.getData('obj');
  let grabbedNum = e.dataTransfer.getData('num');
  const notes = getAllNotes()
  const note = notes.find((note) => note.id === noteId)
  const texts = note.body
  const target = this.querySelector('.note__text')
  const nextElId = target.id
  const nextEl = getText(nextElId, texts)
  let droppedNum
  const dropObj = JSON.parse(dropObjSt)
  document.querySelectorAll('.over').forEach((el) => el.classList.remove('over'))
  const grabbedEl = document.querySelector('.js-grabbed') 
  console.log('grabbedEl', grabbedEl)

  console.log('dropObj', dropObj)
  // console.log(dropObj)
  // console.log(this.parentNode.classList)

  if (e.stopPropagation) {
    e.stopPropagation(); 
  }

  //toggleの中に入れたら
  if(this.querySelector('.note__text--toggle')) {
    const toggleEl = this.querySelector('.note__text--toggle')
    const toggleElBox = toggleEl.querySelector('.note__togglebox')
    const parent = toggleElBox.closest('.js-drag-wrap')
    this.parentNode.removeChild(dragSrcEl);
    toggleElBox.insertAdjacentHTML('beforeend', dropHTML);
    const toggleId = toggleEl.id
    const toggleObj = texts.find((el) => el.id === toggleId)
    toggleObj.body.push(dropObj)
    texts.splice(grabbedNum, 1)
    parent.classList.add('toggle-active')
    this.classList.remove('toggle-over');
    
    saveFolders()
    updateBodyDom(toggleEl, noteId)
    console.log('  //toggleの中に入れたら')
  } 
  else if (!grabbedEl.querySelector('.note__text--toggle') && this.parentNode.classList.contains('note__togglebox')) {
    console.log('  //toggleの外からoggl中に入れたら')
    const toggleEl = this.closest('.note__text--toggle')
    const toggleObj = texts.find((el) => el.id === toggleEl.id)
    const textId = this.querySelector('.note__text').id
    this.insertAdjacentHTML('beforebegin', dropHTML);
    grabbedNum = texts.findIndex((el) => el.id === dropObj.id)
    droppedNum = toggleObj.body.findIndex((el) => el.id === textId)
    
    texts.splice(grabbedNum, 1)
    toggleObj.body.splice(droppedNum, 0, dropObj)
    grabbedEl.remove()
   
    console.log('grabbedEl', grabbedEl)
 

    console.log('dropHTML', dropHTML)
    console.log('grabbedNum', grabbedNum)
    console.log('droppedNum', droppedNum)
    console.log('toggleEl', toggleEl)
    console.log('this', this)
    console.log('toggleObj', toggleObj)
    const newDropElem = this.previousSibling;
    addDnDHandlers(newDropElem);
    saveFolders()
    updateBodyDom(toggleEl, noteId)
  }
  else if(grabbedEl.querySelector('.note__togglebox .js-drag-wrap') === 'null' && grabbedEl.querySelector('.note__text--toggle')) { //toggleの中で入れ替わったら
    console.log('//toggleの中で入れ替わったら')
    const grabbed = e.dataTransfer.getData('grabbed');
    const grabbedTextObj = e.dataTransfer.getData('grabbedText');
    const grabbedText = JSON.parse(grabbedTextObj)

    const toggleBox = this.closest('.note__togglebox')
    const parent = toggleBox.closest('.js-drag-wrap')
    const toggleEl = parent.querySelector('.note__text--toggle')
    const toggleElObjs = getText(toggleEl.id, note.body)
    const texts = toggleElObjs.body
    // console.log('this', this)
    // console.log('grabbed', grabbed)

    grabbedNum = texts.findIndex((el) => el.id === grabbedText.id)
    this.insertAdjacentHTML('beforebegin', grabbed);
    document.querySelector('.in-toggle').remove()

    const id =this.querySelector('.note__text').id
    droppedNum = texts.findIndex((el) => el.id === id)

    texts.splice(grabbedNum, 1)
    if(grabbedNum !== droppedNum) {
      if(grabbedNum < droppedNum) {//下から上
        texts.splice(droppedNum - 1, 0, grabbedText)
      } if(droppedNum === undefined) {
        droppedNum = 3
        texts.splice(droppedNum - 1, 0, grabbedText)
      } else if(grabbedNum > droppedNum) {
        texts.splice(droppedNum, 0, grabbedText)
      }
    }

    const newDropElem = this.previousSibling;
    addDnDHandlers(newDropElem);
    saveFolders()
    updateBodyDom(toggleEl, noteId)
    // console.log('-------------')
    // console.log('texts', texts)
    // console.log('-------------')
    // console.log('toggleElObjs', toggleElObjs)

  } else if(!this.querySelector('.note__text--toggle')) {

    if (dragSrcEl != this) {
      for(let i = 0; i < texts.length; i++) {
        if(texts[i] === nextEl) {
          droppedNum = i
        }
      }
      texts.splice(grabbedNum, 1) //remove el at grabbedNum

      if(grabbedNum !== droppedNum) {
        this.parentNode.removeChild(dragSrcEl);
        if(grabbedNum < droppedNum) {//下から上
          texts.splice(droppedNum - 1, 0, dropObj)
        } if(droppedNum === undefined) {
          droppedNum = 3
          texts.splice(droppedNum - 1, 0, dropObj)
        } else if(grabbedNum > droppedNum) {
          texts.splice(droppedNum, 0, dropObj)
        }
      }
      this.insertAdjacentHTML('beforebegin', dropHTML);
      const dropElem = this.previousSibling;
      addDnDHandlers(dropElem);
      saveFolders()
    }
  }
  this.classList.remove('over')
  document.querySelectorAll('.js-grabbed').forEach(el => el.classList.remove('js-grabbed'))
  return false;

}

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
}

const deleteByBackspace = (e) => {
  if(e.code === 'Backspace'){
    const allSeleted = document.querySelectorAll('.js-selected')

    if(allSeleted) {
      allSeleted.forEach((text) => deleteText(text))
    }
	}
	return false;
}

const addCheckboxByEnter = (e) => {
  if(e.keyCode === 229) {
    return
  }

  if(e.key === 'Enter' && e.shiftKey === false){
    e.preventDefault()
    let newDom
    if(e.target.querySelector('.note__text--toggle')) {
      newDom = addNewBlock('createCheckbox', e.target)
    } else {
      newDom = addNewBlock('createCheckbox')
    }
    newDom.addEventListener('input', () => {
      updateBodyDom(newDom, noteId)
    })
    return false
	}
	return false;
}

export { addDnDHandlers, addCheckboxByEnter, deleteByBackspace}