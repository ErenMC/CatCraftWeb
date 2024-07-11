// Функция для запроса статуса сервера
function fetchServerStatus(address) {
    return new Promise((resolve, reject) => {
        const url = `https://api.mcsrvstat.us/2/${address}`;
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(`Failed to fetch server status for ${address}`);
                }
            }
        };
        xhr.open('GET', url);
        xhr.send();
    });
}

// Функция для отображения списка серверов
function renderServerList() {
    const serverListElement = document.getElementById('serverList');
    serverListElement.innerHTML = '';

    const servers = [
        'play.catcraftmc.ru'
        // Добавьте больше серверов по мере необходимости
    ];

    servers.forEach(server => {
        fetchServerStatus(server)
            .then(data => {
                const serverElement = document.createElement('div');
                serverElement.classList.add('server');
                serverElement.innerHTML = `
                    ${data.hostname} <strong>Онлайн:</strong> ${data.players.online}/${data.players.max}
                `;
                serverListElement.appendChild(serverElement);
            })
            .catch(error => {
                console.error(error);
                const errorElement = document.createElement('div');
                errorElement.classList.add('server');
                errorElement.innerHTML = `
                    <h2>Error</h2>
                    <p>Failed to fetch server status for ${server}</p>
                `;
                serverListElement.appendChild(errorElement);
            });
    });
}

// Функция для автоматического обновления данных каждые 10 секунд
function startAutoUpdate() {
    renderServerList(); // Сначала отобразим данные один раз при загрузке страницы

    setInterval(() => {
        renderServerList(); // Вызываем функцию обновления данных каждые 10 секунд
    }, 30000); // Интервал в миллисекундах (10 секунд)
}

// Вызываем функцию для начала автоматического обновления данных
document.addEventListener('DOMContentLoaded', () => {
    startAutoUpdate();
});
