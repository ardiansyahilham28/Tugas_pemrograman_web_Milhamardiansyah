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
    $query = mysqli_query($conn, "SELECT id, nama, alamat FROM dosen ORDER BY id DESC");
    $data = [];

    while ($row = mysqli_fetch_assoc($query)) {
        $data[] = $row;
    }

    json_response($data);
}

if ($action === 'get_single') {
    $id = intval($_GET['id'] ?? 0);
    $stmt = mysqli_prepare($conn, "SELECT id, nama, alamat FROM dosen WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    json_response(mysqli_fetch_assoc($result) ?: []);
}

if ($action === 'save') {
    $id = intval($_POST['id'] ?? 0);
    $nama = trim($_POST['nama'] ?? '');
    $alamat = trim($_POST['alamat'] ?? '');

    if ($nama === '' || $alamat === '') {
        json_response(['status' => 'error', 'message' => 'Nama dan alamat wajib diisi.']);
    }

    if ($id > 0) {
        $stmt = mysqli_prepare($conn, "UPDATE dosen SET nama = ?, alamat = ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, 'ssi', $nama, $alamat, $id);
    } else {
        $stmt = mysqli_prepare($conn, "INSERT INTO dosen (nama, alamat) VALUES (?, ?)");
        mysqli_stmt_bind_param($stmt, 'ss', $nama, $alamat);
    }

    json_response(
        mysqli_stmt_execute($stmt)
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => mysqli_error($conn)]
    );
}

if ($action === 'delete') {
    $id = intval($_POST['id'] ?? 0);
    $stmt = mysqli_prepare($conn, "DELETE FROM dosen WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);

    json_response(
        mysqli_stmt_execute($stmt)
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => 'Dosen masih dipakai di jadwal. Hapus jadwal dulu.']
    );
}

json_response(['status' => 'error', 'message' => 'Action tidak valid.']);
?>
