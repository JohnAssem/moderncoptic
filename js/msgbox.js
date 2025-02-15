const msgBox = {
    alert: (msg = "Error") => {
        const box = document.createElement('div');
        box.classList.add('alert-box', 'error-box');

        const i = document.createElement('i');
        i.classList.add('fa-solid', 'fa-triangle-exclamation');
        box.appendChild(i);

        const h3 = document.createElement('h3');
        h3.textContent = LANG.errorBox.title;
        box.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = msg;
        box.appendChild(p);

        const button = document.createElement('button');
        button.textContent = LANG.errorBox.confirm;
        button.addEventListener('click', () => {
            box.remove();
        });
        box.appendChild(button);
        
        document.body.appendChild(box);
    },

    checkPassword: (trueFunc = () => {})  => {
        function comparePassword() {
            const password = input.value;
            if (password == JSON.parse(localStorage.getItem('User')).password) {
                box.remove();
                trueFunc();
            } else {
                wrongPassword.style.display = 'block';
                input.style.borderColor = 'red';
                input.value = '';
                input.focus();
            }
        }

        const box = document.createElement('div');
        box.classList.add('alert-box', 'password-check-box');
    
        const h3 = document.createElement('h3');
        h3.textContent = LANG.passwordCheckBox.enterPassword;
        box.appendChild(h3);
    
        const input = document.createElement('input');
        input.type = 'password';
        input.id = 'passwordInput';
        input.placeholder = LANG.passwordCheckBox.passwordPlaceholder;
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                comparePassword();
            }
        });
        box.appendChild(input);
    
        const wrongPassword = document.createElement('p');
        wrongPassword.classList.add('wrong-password');
        wrongPassword.textContent = LANG.passwordCheckBox.wrongPassword;
        box.appendChild(wrongPassword);
    
        const btns = document.createElement('div');
        btns.classList.add('btns');
        const confirm = document.createElement('button');
        confirm.textContent = LANG.passwordCheckBox.confirm;
        confirm.addEventListener('click', comparePassword);

        btns.appendChild(confirm);
    
        const cancel = document.createElement('button');
        cancel.textContent = LANG.passwordCheckBox.cancel;
        cancel.addEventListener('click', () => {
            box.remove();
        });
        btns.appendChild(cancel);
        box.appendChild(btns);
    
        document.body.appendChild(box);
        input.focus();
    },

    prompt: (msg = "Enter", defaultValue = '', trueFunc = (res) => {}) => {
        function achive() {
            if (input.value) {
                box.remove();
                trueFunc(input.value);
            }
            else {
                input.style.borderColor = 'red';
                input.focus();
            }
        }

        const box = document.createElement('div');
        box.classList.add('alert-box', 'prompt-box');

        const h3 = document.createElement('h3');    
        h3.textContent = msg;
        box.appendChild(h3);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'promptInput';
        input.placeholder = 'ادخل اسم الطالب';
        input.value = defaultValue;
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                achive();
            }
        });
        box.appendChild(input); 

        const btns = document.createElement('div');
        btns.classList.add('btns');
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.addEventListener('click', () => {
            box.remove();
        });
        btns.appendChild(cancel);

        const confirm = document.createElement('button');
        confirm.textContent = 'Save';
        confirm.addEventListener('click', achive);
        btns.appendChild(confirm);
        box.appendChild(btns);

        document.body.appendChild(box);
        input.focus();
    }
}