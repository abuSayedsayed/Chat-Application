const form = document.getElementById('form')
const messageContainer = document.getElementById('message-container')
// let userName = prompt('Please Told Your Name') || 'User'
let userName = 'user'
localStorage.setItem('chatName', userName)

form.addEventListener('submit', function (event) {
	event.preventDefault()
	db.collection('Chats').add({
		name: userName,
		message: form.message.value,
	})
	form.message.value = ''
})
function addMessages(doc) {
	let data = doc.data()
	let localName = getLocalStorageName()
	const div = document.createElement('div')
	if (localName === data.name) {
		div.classList.add('right')
		div.innerHTML = `${data.message} <span> : ${data.name} </span>`
	} else {
		div.classList.add('left')
		div.innerHTML = ` <span>  ${data.name} : </span> ${data.message} `
	}
	messageContainer.appendChild(div)
}

// Real Time Update
db.collection('Chats').onSnapshot((snapshot) => {
	const changes = snapshot.docChanges()
	changes.forEach((change) => {
		if (change.type === 'added') {
			addMessages(change.doc)
		}
	})
})

// Getting the localstorage name
function getLocalStorageName() {
	return localStorage.getItem('chatName')
}
console.log(userName)
