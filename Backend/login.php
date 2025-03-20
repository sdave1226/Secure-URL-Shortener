<?php
// login.php - User Authentication
include 'config.php';
session_start();
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['username'], $data['password'])) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$data['username']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && password_verify($data['password'], $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        echo json_encode(["message" => "Login successful"]);
    } else {
        echo json_encode(["error" => "Invalid credentials"]);
    }
}
?>