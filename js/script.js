// Функция для загрузки случайных скриншотов из папки img/slrin
function loadScreenshots() {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const screenshotsPath = 'img/slrin/';
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                const files = JSON.parse(xhr.responseText);
                if (Array.isArray(files)) {
                    const imageFiles = files.filter(file => {
                        const extension = file.split('.').pop().toLowerCase();
                        return allowedExtensions.includes(extension);
                    });

                    // Выбираем три случайных изображения
                    const randomFiles = [];
                    while (randomFiles.length < 3 && imageFiles.length > 0) {
                        const randomIndex = Math.floor(Math.random() * imageFiles.length);
                        if (!randomFiles.includes(imageFiles[randomIndex])) {
                            randomFiles.push(imageFiles[randomIndex]);
                            imageFiles.splice(randomIndex, 1); // Удаляем выбранное изображение из массива
                        }
                    }

                    // Устанавливаем фоны для контейнеров скриншотов
                    const screenshotElements = document.querySelectorAll('.screenshot');
                    screenshotElements.forEach((element, index) => {
                        if (randomFiles[index]) {
                            element.style.backgroundImage = `url(${screenshotsPath}${randomFiles[index]})`;
                        }
                    });
                } else {
                    console.error('Ошибка: полученные данные не являются массивом');
                }
            } catch (e) {
                console.error('Ошибка при парсинге JSON:', e);
            }
        }
    };
    
    xhr.open('GET', 'get_image_files.php', true); // Путь к PHP-скрипту для получения файлов
    xhr.send();
}

// Вызываем функцию загрузки скриншотов при загрузке страницы
window.onload = function() {
    loadScreenshots();
};
