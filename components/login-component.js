import { loginUser, registerUser } from "../api.js";
import _ from 'lodash';

export function renderLoginComponent({ appEl, setToken, fetchTodosAndRender }) {

    let isLoginMode = true;

    const renderForm = () => {
      const appHtml = `
      <h1>Список задач</h1>
      <div class="form">
        <h3 class="form-title">Форма ${isLoginMode ? 'входа' : 'регистрации'}</h3>
        <div class="form-row">
        ${isLoginMode ? '' : `      
            Имя:
            <input
              type="text"
              id="name-input"
              class="input"
            />`
          }
        <br>
          Логин:
          <input
            type="text"
            id="login-input"
            class="input"
          />
          <br />
          Пароль:
          <input
            type="password"
            id="password-input"
            class="input"
          />
        </div>
        <br />
        <button class="button" id="login-button">${isLoginMode ? 'Войти' : 'Зарегистрироваться'}</button>
  
        <br /><br /><br />
        <button class="button" id="toggle-button">Перейти ${isLoginMode ? 'к регистрации' : 'ко входу'}</button>
      </div>`;
      appEl.innerHTML = appHtml;
  
      document.getElementById('login-button').addEventListener('click', () => {
          if(isLoginMode) {
            const login = document.getElementById('login-input').value;
            const password = document.getElementById('password-input').value;
            // setToken('Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k');
    
            if(!login) {
                alert('Введите логин');
                return;
            }
    
            if(!password) {
                alert('Введите пароль');
                return;
            }
    
            loginUser({
                login: login,
                password: password,
            }).then((user) => {
    
                setToken(`Bearer ${user.user.token}`);
                fetchTodosAndRender();
            }).catch(error => {
                //TODO: Выводить алерт красиво
                alert(error.message);
            });
          } else {

            const login = document.getElementById('login-input').value;
            const name = document.getElementById('login-input').value;
            const password = document.getElementById('password-input').value;

            if(!name) {
              alert('Введите имя');
              return;
          }
    
            if(!login) {
                alert('Введите логин');
                return;
            }
    
            if(!password) {
                alert('Введите пароль');
                return;
            }
    
            registerUser({
              login: login,
              password: password,
              name: _.capitalize(name),
            })
              .then((user) => {
                setToken(`Bearer ${user.user.token}`);
                fetchTodosAndRender();
              })
              .catch((error) => {
                // TODO: Выводить алерт красиво
                alert(error.message);
              });
          };

       });
  
  
      document.getElementById('toggle-button').addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        renderForm();
      });
    };

    renderForm();
}