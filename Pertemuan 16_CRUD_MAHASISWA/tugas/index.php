<?php
session_start();

if (!isset($_SESSION['login'])) {
    header("Location: ../praktek/login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tugas CRUD Akademik</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="#">CRUD Akademik</a>
            <div class="d-flex align-items-center">
                <span class="text-white me-3">Halo, <strong><?= htmlspecialchars($_SESSION['username']); ?></strong></span>
                <a href="../praktek/index.php" class="btn btn-outline-light btn-sm me-2">Mahasiswa</a>
                <a href="../praktek/logout.php" class="btn btn-danger btn-sm">Logout</a>
            </div>
        </div>
    </nav>

    <main class="container my-4">
        <ul class="nav nav-tabs mb-3" id="moduleTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="dosen-tab" data-bs-toggle="tab" data-bs-target="#dosen-pane" type="button" role="tab">Dosen</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="matkul-tab" data-bs-toggle="tab" data-bs-target="#matkul-pane" type="button" role="tab">Mata Kuliah</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="jadwal-tab" data-bs-toggle="tab" data-bs-target="#jadwal-pane" type="button" role="tab">Jadwal</button>
            </li>
        </ul>

        <div class="tab-content">
            <section class="tab-pane fade show active" id="dosen-pane" role="tabpanel" aria-labelledby="dosen-tab">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 class="h4 mb-0">Data Dosen</h2>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dosenModal" onclick="siapkanTambahDosen()">Tambah Dosen</button>
                </div>
                <div class="table-responsive bg-white shadow-sm">
                    <table class="table table-striped table-hover mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Alamat</th>
                                <th class="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="data-dosen"></tbody>
                    </table>
                </div>
            </section>

            <section class="tab-pane fade" id="matkul-pane" role="tabpanel" aria-labelledby="matkul-tab">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 class="h4 mb-0">Data Mata Kuliah</h2>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#matkulModal" onclick="siapkanTambahMatkul()">Tambah Mata Kuliah</button>
                </div>
                <div class="table-responsive bg-white shadow-sm">
                    <table class="table table-striped table-hover mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>No</th>
                                <th>Mata Kuliah</th>
                                <th>SKS</th>
                                <th class="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="data-matkul"></tbody>
                    </table>
                </div>
            </section>

            <section class="tab-pane fade" id="jadwal-pane" role="tabpanel" aria-labelledby="jadwal-tab">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 class="h4 mb-0">Data Jadwal</h2>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#jadwalModal" onclick="siapkanTambahJadwal()">Tambah Jadwal</button>
                </div>
                <div class="table-responsive bg-white shadow-sm">
                    <table class="table table-striped table-hover mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>No</th>
                                <th>Dosen</th>
                                <th>Mata Kuliah</th>
                                <th>SKS</th>
                                <th>Waktu</th>
                                <th>Ruang</th>
                                <th class="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="data-jadwal"></tbody>
                    </table>
                </div>
            </section>
        </div>
    </main>

    <div class="modal fade" id="dosenModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="formDosen" onsubmit="simpanDosen(event)">
                    <div class="modal-header">
                        <h5 class="modal-title" id="dosenModalTitle">Form Dosen</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="dosen_id" name="id">
                        <div class="mb-3">
                            <label for="nama_dosen" class="form-label">Nama</label>
                            <input type="text" class="form-control" id="nama_dosen" name="nama" required>
                        </div>
                        <div class="mb-3">
                            <label for="alamat_dosen" class="form-label">Alamat</label>
                            <textarea class="form-control" id="alamat_dosen" name="alamat" rows="3" required></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="matkulModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="formMatkul" onsubmit="simpanMatkul(event)">
                    <div class="modal-header">
                        <h5 class="modal-title" id="matkulModalTitle">Form Mata Kuliah</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="matkul_id" name="id">
                        <div class="mb-3">
                            <label for="nama_matkul" class="form-label">Mata Kuliah</label>
                            <input type="text" class="form-control" id="nama_matkul" name="matkul" required>
                        </div>
                        <div class="mb-3">
                            <label for="sks" class="form-label">SKS</label>
                            <input type="number" min="1" class="form-control" id="sks" name="sks" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="jadwalModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="formJadwal" onsubmit="simpanJadwal(event)">
                    <div class="modal-header">
                        <h5 class="modal-title" id="jadwalModalTitle">Form Jadwal</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="jadwal_id" name="id">
                        <div class="mb-3">
                            <label for="id_dosen" class="form-label">Dosen</label>
                            <select class="form-select" id="id_dosen" name="id_dosen" required></select>
                        </div>
                        <div class="mb-3">
                            <label for="id_matkul" class="form-label">Mata Kuliah</label>
                            <select class="form-select" id="id_matkul" name="id_matkul" required></select>
                        </div>
                        <div class="mb-3">
                            <label for="waktu" class="form-label">Waktu</label>
                            <input type="text" class="form-control" id="waktu" name="waktu" placeholder="Senin, 08.00-09.40" required>
                        </div>
                        <div class="mb-3">
                            <label for="ruang" class="form-label">Ruang</label>
                            <input type="text" class="form-control" id="ruang" name="ruang" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
