// Функция для авторизации через Discord
function authorizeDiscord() {
    console.log('Кнопка "Войти" нажата, начинается авторизация через Discord...');
    fetch('js/athorization_process.php')  // Путь к вашему PHP-файлу для обработки авторизации
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при авторизации через Discord');
            }
            return response.json();
        })
        .then(user => {
            console.log('Пользователь успешно авторизован:', user);
            updateUserInfo(user); // Вызываем функцию для обновления информации о пользователе на странице
        })
        .catch(error => {
            console.error('Ошибка при авторизации через Discord:', error);
        });
}

// Функция для загрузки информации о пользователе при загрузке страницы
window.onload = function() {
    loadUserInfo();
};

// Функция для обновления информации о пользователе на странице
function updateUserInfo(user) {
    document.getElementById('login-button').classList.add('hidden'); // Скрываем кнопку "Войти"
    const userInfo = document.getElementById('user-info');
    userInfo.classList.remove('hidden'); // Показываем блок с информацией о пользователе
    document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`; // Устанавливаем аватарку пользователя
    document.getElementById('discord-name').textContent = `Discord: ${user.discordName}`;
    document.getElementById('minecraft-name').textContent = `Minecraft: ${user.minecraftName}`;
    document.getElementById('balance').textContent = `Баланс: ${user.balance}`;

    document.getElementById('avatar').addEventListener('click', () => {
        const userMenu = document.getElementById('user-menu');
        userMenu.classList.toggle('hidden');
    });
}

// Функция для получения информации о пользователе из cookies
function loadUserInfo() {
    const cookies = document.cookie.split('; ');
    let sessionToken = null;
    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name === 'session_token') {
            sessionToken = value;
        }
    });

    if (sessionToken) {
        fetch('get_user_info.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ session_token: sessionToken })
        })
        .then(response => response.json())
        .then(user => {
            if (user) {
                updateUserInfo(user);
            } else {
                document.getElementById('login-button').classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('Ошибка при получении информации о пользователе:', error);
            document.getElementById('login-button').classList.remove('hidden');
        });
    } else {
        document.getElementById('login-button').classList.remove('hidden');
    }
}

// Функция для обновления информации о пользователе на странице
function updateUserInfo(user) {
    document.getElementById('login-button').classList.add('hidden'); 
    const userInfo = document.getElementById('user-info');
    userInfo.classList.remove('hidden'); 
    document.getElementById('avatar').src = user.avatar; 
    document.getElementById('discord-name').textContent = `Discord: ${user.discordName}`; 
    document.getElementById('minecraft-name').textContent = `Minecraft: ${user.minecraftName}`; 
    document.getElementById('balance').textContent = `Баланс: ${user.balance}`; 

    document.getElementById('avatar').addEventListener('click', () => {
        const userMenu = document.getElementById('user-menu');
        userMenu.classList.toggle('hidden');
    });
}

// Функция для перехода на социальную сеть
function gotoSocialNetwork() {
    window.location.href = 'https://example.com/social-network';
}

// Функция для выхода пользователя
function logout() {
    document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    location.reload();
}

// Вызываем функцию загрузки информации о пользователе при загрузке страницы
window.onload = function() {
    loadUserInfo();
};
