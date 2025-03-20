<?php
// register.php - User Registration
include 'config.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['username'], $data['password'])) {
    $username = htmlspecialchars($data['username']);
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    if ($stmt->execute([$username, $password])) {
        echo json_encode(["message" => "User registered successfully"]);
    } else {
        echo json_encode(["error" => "Registration failed"]);
    }
}
?>