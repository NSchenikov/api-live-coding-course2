//План
//1. Реализовать форму логина в приложении
// 2. Реализовать форму регистрации

const buttonElement = document.getElementById("add-button");
const listElement = document.getElementById("list");
const textInputElement = document.getElementById("text-input");


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
//       renderTasks();
//     });
// };
//


//авторизация через токен bearer
let token = 'Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k'; //токен генерируется с insomnia через апи указанный в документации к апи в графе авторизации

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
      renderTasks();
    });
};
//


const renderTasks = () => {
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

  listElement.innerHTML = tasksHtml;
  const deleteButtons = document.querySelectorAll(".delete-button");

  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const id = deleteButton.dataset.id;

      // Подписываемся на успешное завершение запроса с помощью then
      fetch(host + id, {
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
          renderTasks();
        });

      renderTasks();
    });
  }
};

fetchTodosAndRender();

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

  renderTasks();
});