const form = document.getElementById('form')
const messageContainer = document.getElementById('message-container')
const signUpForm = document.getElementById('sign-up-form')
const logOUt = document.getElementById('log-out')
const userInfo = document.querySelector('.user-info')
const popup = document.querySelector('.popup')
// let userName = prompt('Please Told Your Name') || 'User'
let userName = 'user'

// Adding Message To Collection
function addMsgToCollection(user) {
	form.addEventListener('submit', function (event) {
		event.preventDefault()
		// Adding message
		db.collection('Chats').add({
			name: user.email.slice(0, user.email.indexOf('@')),
			message: form.message.value,
		})
		form.message.value = ''
	})
}

// Manipulating UI
function addMessages(doc) {
	let data = doc.data()
	let localName = getLocalStorageName()
	const div = document.createElement('div')
	if (localName === data.name) {
		div.classList.add('right')
		div.innerHTML = `${data.message} <span>  ${data.name} </span>`
	} else {
		div.classList.add('left')
		div.innerHTML = ` <span>  ${data.name}  </span> ${data.message} `
	}
	const scrollHeight = getScrollHeight()
	messageContainer.appendChild(div)
	messageContainer.scrollTo(0, scrollHeight)
}
// Getting the scroll height
function getScrollHeight() {
	const rights = document.querySelectorAll('.right')
	let topHeight = 1
	rights.forEach((right, i) => (topHeight *= 20))
	return topHeight * 2
}
// Adding a better usr experience
auth.onAuthStateChanged((user) => {
	if (user) {
		hidePopUp()
		setupUserInfo(user)
		// Adding form message
		addMsgToCollection(user)
		messageContainer.innerHTML = ''
		db.collection('Chats').onSnapshot((snapshot) => {
			const changes = snapshot.docChanges()
			changes.forEach((change) => {
				if (change.type === 'added') {
					addMessages(change.doc)
				}
			})
		})
	} else {
		popup.style.opacity = '1'
		popup.style.pointerEvents = 'all'
		messageContainer.innerHTML = `<h3 class="log-outed">Please Sign Up</h3>`
		setupUserInfo()
	}
})

// Real Time Update

// Getting the localStorage name
function getLocalStorageName() {
	return localStorage.getItem('chatName')
}
// Signing A user Up
signUpForm.addEventListener('submit', function (event) {
	event.preventDefault()
	auth
		.createUserWithEmailAndPassword(this.email.value, this.password.value)
		.then((cred) => {
			localStorage.setItem(
				'chatName',
				this.email.value.slice(0, this.email.value.indexOf('@'))
			)

			hidePopUp()
			this.reset()
		})
		.catch((err) => showError(err.message))
})
// Logging A user outs
logOUt.addEventListener('click', function () {
	auth
		.signOut()
		.then(() => {
			popup.style.opacity = '1'
			popup.style.pointerEvents = 'all'
		})
		.catch((err) => alert(err.message))
})

// Hiding The POpup
function hidePopUp() {
	popup.style.opacity = '0'
	popup.style.pointerEvents = 'none'
}

// Showing The Error
function showError(err) {
	const errElement = signUpForm.querySelector('#msg')
	errElement.innerHTML = err
}

// User info set up
function setupUserInfo(user) {
	const name = userInfo.querySelector('.name')
	const desc = userInfo.querySelector('.desc')
	if (user) {
		name.innerText = user.email.charAt(0).toUpperCase()
		desc.innerText = user.email
	} else {
		name.innerText = 'S'
		desc.innerHTML = `
		Welcome To<a href="https://abusayedsayed.github.io/My-Portfolio-You-Can-Visit" target="_blank" >Sayed'S</a> Messenger .	`
	}
}
