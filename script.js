//План
//1. Реализовать форму логина в приложении
//* перенести всю разметку в рендер-функцию (+)
//* сделать форму входа динамической
// 2. Реализовать форму регистрации


//https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/v2/todos/README.md  - документация по конкретному api

let tasks = [];

//аторизация с паролем
// let password = prompt('Ввести пароль'); //просим пользователя ввести пароль. должен быть 123456 согласно документации к конкретному api

// const host = 'https://webdev-hw-api.vercel.app/api/v2/todos'; //выносим адрес api в переменную

// const fetchTodosAndRender = () => {
//   return fetch(host, {
//     method: "GET",
//     headers: {
//         Authorization: password, //согласно документации к конкретному api без авторизации запросы не работают и возвращаюд код 401. Указываем нужный ключ к авторизации в переменной password
//     }
//   })
//     .then((response) => {

//         if(response.status === 401) { //если пароль не верный то просим пользователя ввести его снова
//             password = prompt('введите верный пароль');
//             fetchTodosAndRender();
//             throw new Error('Нет авторизации');
//         }

//       return response.json();
//     })
//     .then((responseData) => {
//       tasks = responseData.todos;
//       renderApp();
//     });
// };
//


//авторизация через токен bearer
let token = 'Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k'; //токен генерируется с insomnia через апи указанный в документации к апи в графе авторизации

token = null;

const host = 'https://webdev-hw-api.vercel.app/api/v2/todos'; //выносим адрес api в переменную

const fetchTodosAndRender = () => {
  return fetch(host, {
    method: "GET",
    headers: {
        Authorization: token, 
    }
  })
    .then((response) => {

        if(response.status === 401) { //если пароль не верный то просим пользователя ввести его снова
            // password = prompt('введите верный пароль');
            // fetchTodosAndRender();
            throw new Error('Нет авторизации');
        }

      return response.json();
    })
    .then((responseData) => {
      tasks = responseData.todos;
      renderApp();
    });
};
//


const renderApp = () => {

  const appEl = document.getElementById('app');

  if(!token) {
    const appHtml = `
    <h1>Список задач</h1>
    <div class="form">
      <h3 class="form-title">Форма входа</h3>
      <div class="form-row">
        Логин:
        <input
          type="text"
          id="login-input"
          class="input"
        />
        <br />
        Пароль:
        <input
          type="text"
          id="login-input"
          class="input"
        />
      </div>
      <br />
      <button class="button" id="login-button">Войти</button>
    </div>`;
    appEl.innerHTML = appHtml;

    document.getElementById('login-button').addEventListener('click', () => {
      token = 'Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k'; 
      fetchTodosAndRender();
    });

    return;
  }


  const tasksHtml = tasks
  .map((task) => {
    return `
    <li class="task">
      <p class="task-text">
        ${task.text}
        <button data-id="${task.id}" class="button delete-button">Удалить</button>
      </p>
    </li>`;
  })
  .join("");


  const appHtml = `
  <h1>Список задач</h1>
  <ul class="tasks" id="list">
    <!— Список рендерится из JS —>
    ${tasksHtml}
  </ul>
  <br />
  <div class="form">
    <h3 class="form-title">Форма добавления</h3>
    <div class="form-row">
      Что нужно сделать:
      <input
        type="text"
        id="text-input"
        class="input"
        placeholder="Выпить кофе"
      />
    </div>
    <br />
    <button class="button" id="add-button">Добавить</button>
  </div>`;



  appEl.innerHTML = appHtml;

  const buttonElement = document.getElementById("add-button");
  const listElement = document.getElementById("list");
  const textInputElement = document.getElementById("text-input");
  const deleteButtons = document.querySelectorAll(".delete-button");

  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const id = deleteButton.dataset.id;

      // Подписываемся на успешное завершение запроса с помощью then
      fetch("https://webdev-hw-api.vercel.app/api/todos/" + id, {
        method: "DELETE",
        headers: {
            Authorization: token,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          // Получили данные и рендерим их в приложении
          tasks = responseData.todos;
          renderApp();
        });

    });
  }
  buttonElement.addEventListener("click", () => {
    if (textInputElement.value === "") {
      return;
    }
  
    buttonElement.disabled = true;
    buttonElement.textContent = "Задача добавляется...";
  
    // Подписываемся на успешное завершение запроса с помощью then
    fetch(host, {
      method: "POST",
      body: JSON.stringify({
        text: textInputElement.value,
      }),
      headers: {
          Authorization: token,
      }
    })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        // TODO: кинуть исключение
        textInputElement.value = "";
      })
      .then(() => {
        return fetchTodosAndRender();
      })
      .then(() => {
        buttonElement.disabled = false;
        buttonElement.textContent = "Добавить";
      })
      .catch((error) => {
        console.error(error);
        alert("Кажется, у вас проблемы с интернетом, попробуйте позже");
        buttonElement.disabled = false;
        buttonElement.textContent = "Добавить";
      });
  });
};
// fetchTodosAndRender();
renderApp();

