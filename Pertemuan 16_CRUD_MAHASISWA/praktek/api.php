<?php
session_start();
header('Content-Type: application/json');

// Proteksi API: Jika tidak ada session login, cegah akses
if (!isset($_SESSION['login'])) {
    echo json_encode(['status' => 'error', 'message' => 'Akses ilegal terdeteksi. Silakan login.']);
    exit;
}

include 'koneksi.php';

$action = $_GET['action'] ?? '';

// ==========================================
// ACTION: READ (Mengambil Seluruh Data)
// ==========================================
if ($action == 'list') {
    $query = mysqli_query($conn, "SELECT * FROM mahasiswa ORDER BY id DESC");
    $data = [];
    while ($row = mysqli_fetch_assoc($query)) {
        $data[] = $row;
    }
    echo json_encode($data);
    exit;
}

// ==========================================
// ACTION: GET SINGLE (Mengambil Satu Data untuk Form Edit)
// ==========================================
if ($action == 'get_single') {
    $id = intval($_GET['id']);
    $query = mysqli_query($conn, "SELECT * FROM mahasiswa WHERE id = $id");
    $data = mysqli_fetch_assoc($query);
    echo json_encode($data);
    exit;
}

// ==========================================
// ACTION: CREATE & UPDATE (Menyimpan Data)
// ==========================================
if ($action == 'save') {
    $id      = $_POST['id'] ?? '';
    $nim     = mysqli_real_escape_string($conn, $_POST['nim']);
    $nama    = mysqli_real_escape_string($conn, $_POST['nama']);
    $jurusan = mysqli_real_escape_string($conn, $_POST['jurusan']);
    $email   = mysqli_real_escape_string($conn, $_POST['email']);

    if (empty($id)) {
        // Jika ID kosong, tandanya adalah proses Tambah Baru (CREATE)
        $sql = "INSERT INTO mahasiswa (nim, nama, jurusan, email) VALUES ('$nim', '$nama', '$jurusan', '$email')";
    } else {
        // Jika ID ada isinya, tandanya adalah proses Pembaruan (UPDATE)
        $sql = "UPDATE mahasiswa SET nim='$nim', nama='$nama', jurusan='$jurusan', email='$email' WHERE id=$id";
    }

    if (mysqli_query($conn, $sql)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
    exit;
}

// ==========================================
// ACTION: DELETE (Menghapus Data)
// ==========================================
if ($action == 'delete') {
    $id = intval($_POST['id']);
    $sql = "DELETE FROM mahasiswa WHERE id = $id";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
    exit;
}
?>