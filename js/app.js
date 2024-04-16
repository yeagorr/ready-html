window.addEventListener('scroll', e => {
	document.documentElement.style.setProperty('--scrollTop', `${this.scrollY}px`) // Update method
})
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
ScrollSmoother.create({
	wrapper: '.wrapper',
	content: '.content'
})


 // JavaScript код для прокрутки страницы на высоту экрана
 document.getElementById('btn').addEventListener('click', function (e) {
	e.preventDefault();

	// Получаем высоту экрана
	var screenHeight = window.innerHeight || document.documentElement.clientHeight;

	// Прокручиваем страницу
	window.scrollBy({
		top: screenHeight + 111.5,
		behavior: 'smooth' // Добавляем плавную анимацию
	});
});


const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = document.querySelector(".form-popup .close-btn");
const loginSignupLink = document.querySelectorAll(".form-box .bottom-link a");

const loggedInBtn = document.getElementById('loggedInBtn');
const loggedInUser = document.getElementById('loggedInUser');
const dropdownContent = document.querySelector('.dropdown-content');
const userLogin = document.getElementById('userLogin'); //h4
const currentLoginElement = document.getElementById('currentLogin');


//open
showPopupBtn.addEventListener("click", () => {
	document.body.classList.toggle("show-popup");
})

document.addEventListener("DOMContentLoaded", function() {
  
	// Получаем ссылку для логина
	var loginLink = document.querySelector(".login-btn");
  
	// Получаем элемент overlay
	var blurOverlay = document.querySelector(".blur-bg-overlay");
  
	// Добавляем обработчик события при клике на ссылку логина
	loginLink.addEventListener("click", function() {
	  // Добавляем/удаляем класс "active" у overlay
	  blurOverlay.classList.toggle("active");
  
	  // Получаем элемент <body>
	  var bodyElement = document.body;
    var container = document.getElementById('cont-r');
	  // Если overlay активен, запрещаем скроллинг
	  if (blurOverlay.classList.contains("active")) {
		bodyElement.style.overflow = "hidden";
    
    container.classList.toggle('blur'); 
	  } else {
		// Если overlay не активен, восстанавливаем скроллинг
		bodyElement.style.overflow = "";
    container.classList.remove('blur');
	  }
	});
});
  

//hide


hidePopupBtn.addEventListener("click", () => showPopupBtn.click());

loginSignupLink.forEach(link => {
	link.addEventListener("click", (e) => {
		e.preventDefault();
		formPopup.classList[link.id === "signup-link" ? 'add' : 'remove']("show-signup");
	});
});

const closeForm = () => {
  // Очистка всех полей ввода
  const inputFields = document.querySelectorAll('.input-field input');
  inputFields.forEach(input => input.value = '');

  showPopupBtn.click();

  // Установка значения isLogged в true после успешного входа
  if (isLogged) {
    // Скрытие формы входа и отображение "Welcome" с логином
    loggedInUser.textContent = getCurrentAccount().login;
    loggedInDropdown.style.display = 'list-item';

    // Скрытие оригинального li с id="loginBtn"
    showPopupBtn.style.display = 'none';

    // Очистка формы и установка в false для следующих входов
  }

  // Сохранение данных в localStorage
  saveDataToLocalStorage();
};

const handleLogin = () => {
  const loginInputValue = document.getElementById('loginInput').value;
  const passwordInputValue = document.getElementById('passwordInput').value;

  if (loginInputValue.trim() === '' || passwordInputValue.trim() === '') {
    alert('Please fill in all login fields.');
  } else {
    // Ваши дополнительные действия при успешном входе
    alert('Login successful!');

    isLogged = true; // Установка значения isLogged в true
    // Сохранение текущего аккаунта в localStorage
    saveCurrentAccount(loginInputValue, passwordInputValue);

    // Вывод содержимого current-account в консоль
    logCurrentAccount();

    closeForm();
  }
};

const handleSignupSuccess = () => {
  const signupLoginInputValue = document.getElementById('signupLoginInput').value;
  const signupPasswordInputValue = document.getElementById('signupPasswordInput').value;

  if (signupLoginInputValue.trim() === '' || signupPasswordInputValue.trim() === '') {
    alert('Please fill in all registration fields.');
  } else {
    if (!isLoginUnique(signupLoginInputValue)) {
      alert('User with this login already exists.');
    } else {
      alert('Registration successful!');

      isLogged = true;
      // Сохранение текущего аккаунта в localStorage
      saveCurrentAccount(signupLoginInputValue, signupPasswordInputValue);

      // Вывод содержимого current-account в консоль
      logCurrentAccount();

      closeForm();
    }
  }
};

const isLoginUnique = (login) => {
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  return !accounts.some(account => account.login === login);
};

const saveAccount = (login, password) => {
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  accounts.push({ login, password });
  localStorage.setItem('accounts', JSON.stringify(accounts));
};

// Функция для сохранения текущего аккаунта в localStorage
const saveCurrentAccount = (login, password) => {
  const currentAccount = { login, password };
  localStorage.setItem('current-account', JSON.stringify(currentAccount));
};

// Функция для получения текущего аккаунта из localStorage
const getCurrentAccount = () => {
  return JSON.parse(localStorage.getItem('current-account')) || {};
};

// Функция для вывода содержимого current-account в консоль
const logCurrentAccount = () => {
  const currentAccount = getCurrentAccount();
  console.log('Current Account:', currentAccount);
};

// Функция для сохранения данных в localStorage
const saveDataToLocalStorage = () => {
  // Сохранение логина, пароля и состояния isLogged в localStorage
  const currentAccount = getCurrentAccount();
  localStorage.setItem('current-account', JSON.stringify(currentAccount));
  localStorage.setItem('isLogged', isLogged);
};

// Восстановление данных из localStorage при загрузке страницы
const restoreDataFromLocalStorage = () => {
  const storedAccount = JSON.parse(localStorage.getItem('current-account')) || {};
  isLogged = JSON.parse(localStorage.getItem('isLogged')) || false;

  if (isLogged) {
    // Если пользователь был вошедшим, отображаем "Welcome" с логином
    loggedInUser.textContent = storedAccount.login;
    loggedInDropdown.style.display = 'list-item';
    showPopupBtn.style.display = 'none';

    const currentLoginElement = document.getElementById('currentLogin');
      if (currentLoginElement) {
        currentLoginElement.textContent = storedAccount.login;
      }
  }
};

// Восстановление данных из localStorage при загрузке страницы
restoreDataFromLocalStorage();

document.getElementById('loginButton').addEventListener('click', handleLogin);
document.getElementById('signupButton').addEventListener('click', handleSignupSuccess);

// Добавление обработчика для элемента dropdown
loggedInDropdown.addEventListener('click', () => {
  // Инвертирование видимости dropdown-content при щелчке на элементе dropdown
  dropdownContent.classList.toggle('show');
});

const logoutLink = document.getElementById('logoutLink');

logoutLink.addEventListener('click', () => {
  // Обработчик для выхода из аккаунта
  isLogged = false; // Установка значения isLogged в false
  dropdownContent.classList.remove('show'); // Скрытие dropdown-content
  showPopupBtn.style.display = 'block'; // Отображение оригинального li с id="loginBtn"
  loggedInDropdown.style.display = 'none'; // Скрытие li с id="loggedInDropdown"

  // Сохранение данных в localStorage после выхода из аккаунта
  saveDataToLocalStorage();
});

const reservationForm = document.getElementById('reservationForm');
const submitButton = document.getElementById('submitBtn');

// Функция для проверки заполненности всех полей ввода в форме
const areFormFieldsFilled = () => {
  const formFields = document.querySelectorAll('.container-form input');
  return Array.from(formFields).every(field => field.value.trim() !== '');
};

// Добавляем слушатель события отправки формы
reservationForm.addEventListener('submit', function (event) {
  // Предотвращаем отправку формы, если isLogged равен false или не все поля заполнены
  if (!isLogged) {
    event.preventDefault();
    alert('Please log in to make a reservation.');
  } else if (!areFormFieldsFilled()) {
    event.preventDefault();
    alert('Please fill in all reservation fields.');
  }
});

