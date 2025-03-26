<?php
// analytics.php - Click Tracking & Analytics
include 'config.php';

$stmt = $pdo->query("SELECT short_code, COUNT(*) as clicks FROM url_clicks GROUP BY short_code");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>

<?php
// validate_url.php - Spam & Malware Detection
function isMalicious($url) {
    return preg_match('/(phishing|malware|scam)/i', $url);
}
?>