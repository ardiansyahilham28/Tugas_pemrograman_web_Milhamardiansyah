<?php
session_start();
include 'koneksi.php';

// Jika pengguna sudah login, langsung alihkan ke halaman utama (index.php)
if (isset($_SESSION['login'])) {
    header("Location: index.php");
    exit;
}

$error = false;

if (isset($_POST['submit_login'])) {
    // Ambil data form dan proteksi dari SQL Injection
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = $_POST['password'];

    // Cari username di database
    $query  = "SELECT * FROM users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) === 1) {
        $row = mysqli_fetch_assoc($result);
        
        // Verifikasi password yang di-input dengan hash di database
        if (password_verify($password, $row['password'])) {
            // Set session sukses login
            $_SESSION['login'] = true;
            $_SESSION['username'] = $row['username'];
            
            header("Location: index.php");
            exit;
        }
    }
    $error = true;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Aplikasi Mahasiswa</title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center" style="height: 100vh;">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h3 class="text-center mb-4 font-weight-bold">Sign In</h3>
                        
                        <?php if ($error) : ?>
                            <div class="alert alert-danger p-2 text-center" style="font-size: 14px;">
                                Username atau password Anda salah!
                            </div>
                        <?php endif; ?>

                        <form action="" method="POST">
                            <div class="mb-3">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" name="username" id="username" class="form-control" placeholder="Masukkan username" required autocomplete="off">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" name="password" id="password" class="form-control" placeholder="Masukkan password" required>
                            </div>
                            <button type="submit" name="submit_login" class="btn btn-primary w-100 py-2">Masuk</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
