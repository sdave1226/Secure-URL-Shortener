<?php
// redirect.php - Redirect to Long URL
include 'config.php';
$code = $_GET['code'] ?? '';
$stmt = $pdo->prepare("SELECT long_url FROM urls WHERE short_code = ?");
$stmt->execute([$code]);
$url = $stmt->fetchColumn();
if ($url) {
    header("Location: " . $url);
    exit;
} else {
    echo "Invalid or expired URL.";
}
?>