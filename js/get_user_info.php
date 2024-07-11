<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];

    // Подключение к базе данных
    $conn = new mysqli('localhost', 'root', '', 'catcraft');

    if ($conn->connect_error) {
        die(json_encode(['error' => 'Ошибка подключения к базе данных']));
    }

    // Получение информации о пользователе
    $stmt = $conn->prepare('SELECT discord_id, minecraft_name, balance, avatar FROM users WHERE id = ?');
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $stmt->bind_result($discordId, $minecraftName, $balance, $avatar);
    $stmt->fetch();

    if ($discordId) {
        $user = [
            'discordName' => $discordId,
            'minecraftName' => $minecraftName,
            'balance' => $balance,
            'avatar' => $avatar
        ];
        echo json_encode($user);
    } else {
        echo json_encode(['error' => 'Пользователь не найден']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Пользователь не авторизован']);
}


// Получение информации о пользователе от Discord
$user_url = "https://discord.com/api/users/@me";
$opts = array(
    'http' => array(
        'header' => "Authorization: Bearer $access_token"
    )
);

$context = stream_context_create($opts);
$user_info = file_get_contents($user_url, false, $context);
$user = json_decode($user_info, true);

$discordId = $user['id'];
$discordName = $user['username'];
$avatar = $user['avatar'];

$conn = connect_db();

// Проверяем, существует ли пользователь в БД
$stmt = $conn->prepare("SELECT id FROM users WHERE discord_id = ?");
$stmt->bind_param("s", $discordId);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Пользователь уже существует, обновляем его данные
    $stmt->close();
    $stmt = $conn->prepare("UPDATE users SET discord_name = ?, avatar = ? WHERE discord_id = ?");
    $stmt->bind_param("sss", $discordName, $avatar, $discordId);
    $stmt->execute();
} else {
    // Пользователь не найден, создаем новую запись
    $stmt->close();
    $stmt = $conn->prepare("INSERT INTO users (discord_id, discord_name, avatar) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $discordId, $discordName, $avatar);
    $stmt->execute();
}
?>