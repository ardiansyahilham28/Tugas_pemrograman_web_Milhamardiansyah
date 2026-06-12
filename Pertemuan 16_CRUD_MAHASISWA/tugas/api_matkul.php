<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['login'])) {
    echo json_encode(['status' => 'error', 'message' => 'Akses ilegal. Silakan login.']);
    exit;
}

include 'koneksi.php';

$action = $_GET['action'] ?? '';

function json_response($payload) {
    echo json_encode($payload);
    exit;
}

if ($action === 'list') {
    $query = mysqli_query($conn, "SELECT id, matkul, sks FROM matkul ORDER BY id DESC");
    $data = [];

    while ($row = mysqli_fetch_assoc($query)) {
        $data[] = $row;
    }

    json_response($data);
}

if ($action === 'get_single') {
    $id = intval($_GET['id'] ?? 0);
    $stmt = mysqli_prepare($conn, "SELECT id, matkul, sks FROM matkul WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    json_response(mysqli_fetch_assoc($result) ?: []);
}

if ($action === 'save') {
    $id = intval($_POST['id'] ?? 0);
    $matkul = trim($_POST['matkul'] ?? '');
    $sks = intval($_POST['sks'] ?? 0);

    if ($matkul === '' || $sks <= 0) {
        json_response(['status' => 'error', 'message' => 'Mata kuliah dan SKS wajib diisi.']);
    }

    if ($id > 0) {
        $stmt = mysqli_prepare($conn, "UPDATE matkul SET matkul = ?, sks = ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, 'sii', $matkul, $sks, $id);
    } else {
        $stmt = mysqli_prepare($conn, "INSERT INTO matkul (matkul, sks) VALUES (?, ?)");
        mysqli_stmt_bind_param($stmt, 'si', $matkul, $sks);
    }

    json_response(
        mysqli_stmt_execute($stmt)
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => mysqli_error($conn)]
    );
}

if ($action === 'delete') {
    $id = intval($_POST['id'] ?? 0);
    $stmt = mysqli_prepare($conn, "DELETE FROM matkul WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);

    json_response(
        mysqli_stmt_execute($stmt)
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => 'Mata kuliah masih dipakai di jadwal. Hapus jadwal dulu.']
    );
}

json_response(['status' => 'error', 'message' => 'Action tidak valid.']);
?>
