const express = require('express'); // Імпортуємо Express для створення веб-серверу
const axios = require('axios'); // Імпортуємо Axios для виконання HTTP-запитів
const path = require('path'); // Імпортуємо Path для роботи з файловою системою
const app = express(); // Створюємо новий додаток Express
const port = 3000; // Встановлюємо порт для сервера

app.use(express.urlencoded({ extended: true })); // Налаштовуємо парсер URL-кодованих даних з форми
app.use(express.static(path.join(__dirname, 'public'))); // Встановлюємо статичну папку для файлів (CSS, зображення тощо)

app.set('views', path.join(__dirname, 'views')); // Встановлюємо шлях до папки з шаблонами
app.set('view engine', 'ejs'); // Встановлюємо EJS як шаблонний двигун

// Маршрут для головної сторінки
app.get('/', (req, res) => {
    res.render('index'); // Рендеримо шаблон index.ejs
});

// Маршрут для обробки запитів на отримання репозиторіїв
app.post('/repos', async (req, res) => {
    const username = req.body.username; // Отримуємо ім'я користувача з форми
    try {
        // Виконуємо запит до GitHub API для отримання репозиторіїв користувача
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        const repos = response.data; // Отримуємо дані про репозиторії
        res.render('index', { repos, username }); // Рендеримо шаблон index.ejs з даними про репозиторії
    } catch (error) {
        res.send(`<p>Error: ${error.response.status} - ${error.response.statusText}</p>`); // Виводимо повідомлення про помилку
    }
});

// Маршрут для отримання деталей про обраний репозиторій
app.get('/repo/:username/:repoName', async (req, res) => {
    const { username, repoName } = req.params; // Отримуємо ім'я користувача та ім'я репозиторію з URL
    try {
        // Виконуємо запит до GitHub API для отримання інформації про репозиторій
        const repoResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
        // Виконуємо запит до GitHub API для отримання переліку комітів репозиторію
        const commitsResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}/commits`);
        const repo = repoResponse.data; // Отримуємо дані про репозиторій
        const commits = commitsResponse.data; // Отримуємо дані про коміти
        res.render('repo_details', { repo, commits }); // Рендеримо шаблон repo_details.ejs з даними про репозиторій і коміти
    } catch (error) {
        res.send(`<p>Error: ${error.response.status} - ${error.response.statusText}</p>`); // Виводимо повідомлення про помилку
    }
});

// Запускаємо сервер на вказаному порту
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
