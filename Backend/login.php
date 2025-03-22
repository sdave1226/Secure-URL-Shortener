<?php
include 'config.php';
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, password FROM users WHERE username = ?");
$stmt->execute([$data['username']]);
$user = $stmt->fetch();

if ($user && password_verify($data['password'], $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Invalid credentials"]);
}
?>
