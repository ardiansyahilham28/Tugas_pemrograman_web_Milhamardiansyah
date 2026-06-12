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
    $sql = "
        SELECT
            j.id,
            j.id_dosen,
            j.id_matkul,
            j.waktu,
            j.ruang,
            d.nama AS nama_dosen,
            m.matkul AS nama_matkul,
            m.sks
        FROM jadwal j
        INNER JOIN dosen d ON d.id = j.id_dosen
        INNER JOIN matkul m ON m.id = j.id_matkul
        ORDER BY j.id DESC
    ";
    $query = mysqli_query($conn, $sql);
    $data = [];

    while ($row = mysqli_fetch_assoc($query)) {
        $data[] = $row;
    }

    json_response($data);
}

if ($action === 'options') {
    $dosen = [];
    $matkul = [];

    $qDosen = mysqli_query($conn, "SELECT id, nama FROM dosen ORDER BY nama ASC");
    while ($row = mysqli_fetch_assoc($qDosen)) {
        $dosen[] = $row;
    }

    $qMatkul = mysqli_query($conn, "SELECT id, matkul, sks FROM matkul ORDER BY matkul ASC");
    while ($row = mysqli_fetch_assoc($qMatkul)) {
        $matkul[] = $row;
    }

    json_response(['dosen' => $dosen, 'matkul' => $matkul]);
}

if ($action === 'get_single') {
    $id = intval($_GET['id'] ?? 0);
    $stmt = mysqli_prepare($conn, "SELECT id, id_dosen, id_matkul, waktu, ruang FROM jadwal WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    json_response(mysqli_fetch_assoc($result) ?: []);
}

if ($action === 'save') {
    $id = intval($_POST['id'] ?? 0);
    $idDosen = intval($_POST['id_dosen'] ?? 0);
    $idMatkul = intval($_POST['id_matkul'] ?? 0);
    $waktu = trim($_POST['waktu'] ?? '');
    $ruang = trim($_POST['ruang'] ?? '');

    if ($idDosen <= 0 || $idMatkul <= 0 || $waktu === '' || $ruang === '') {
        json_response(['status' => 'error', 'message' => 'Dosen, mata kuliah, waktu, dan ruang wajib diisi.']);
    }

    if ($id > 0) {
        $stmt = mysqli_prepare($conn, "UPDATE jadwal SET id_dosen = ?, id_matkul = ?, waktu = ?, ruang = ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, 'iissi', $idDosen, $idMatkul, $waktu, $ruang, $id);
    } else {
        $stmt = mysqli_prepare($conn, "INSERT INTO jadwal (id_dosen, id_matkul, waktu, ruang) VALUES (?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, 'iiss', $idDosen, $idMatkul, $waktu, $ruang);
    }

    json_response(
        mysqli_stmt_execute($stmt)
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => mysqli_error($conn)]
    );
}

if ($action === 'delete') {
    $id = intval($_POST['id'] ?? 0);
    $stmt = mysqli_prepare($conn, "DELETE FROM jadwal WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);

    json_response(
        mysqli_stmt_execute($stmt)
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => mysqli_error($conn)]
    );
}

json_response(['status' => 'error', 'message' => 'Action tidak valid.']);
?>
