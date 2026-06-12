// Memanggil fungsi loadData pertama kali saat halaman selesai dimuat seluruhnya
document.addEventListener('DOMContentLoaded', loadData);

// Menginisialisasi Bootstrap Modal Object dari index.php supaya bisa ditutup/buka via JS
const mModal = new bootstrap.Modal(document.getElementById('mahasiswaModal'));

// ==========================================
// FUNGSI: READ DATA (Menampilkan ke Tabel HTML)
// ==========================================
function loadData() {
    fetch('api.php?action=list')
        .then(response => response.json())
        .then(data => {
            let html = '';
            if (data.length === 0) {
                html = `<tr><td colspan="6" class="text-center text-muted p-4">Belum ada data mahasiswa.</td></tr>`;
            } else {
                data.forEach((mhs, index) => {
                    html += `
                        <tr>
                            <td class="ps-3 align-middle">${index + 1}</td>
                            <td class="align-middle">${mhs.nim}</td>
                            <td class="align-middle">${mhs.nama}</td>
                            <td class="align-middle">${mhs.jurusan}</td>
                            <td class="align-middle">${mhs.email}</td>
                            <td class="text-center align-middle">
                                <button class="btn btn-warning btn-sm me-1" onclick="siapkanEdit(${mhs.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="hapusData(${mhs.id})">Hapus</button>
                            </td>
                        </tr>
                    `;
                });
            }
            document.getElementById('tempat-data-mahasiswa').innerHTML = html;
        })
        .catch(err => console.error("Gagal memuat data: ", err));
}

// ==========================================
// FUNGSI: PRE-CREATE FORM (Mereset Form Tambah)
// ==========================================
function siapkanTambah() {
    document.getElementById('modalTitle').innerText = 'Tambah Data Mahasiswa';
    document.getElementById('formMahasiswa').reset();
    document.getElementById('mahasiswa_id').value = ''; // Kosongkan ID penanda
}

// ==========================================
// FUNGSI: PRE-UPDATE FORM (Mengambil Data Lama ke Form)
// ==========================================
function siapkanEdit(id) {
    document.getElementById('modalTitle').innerText = 'Ubah Data Mahasiswa';
    document.getElementById('formMahasiswa').reset();

    // Ambil data spesifik berdasarkan ID
    fetch(`api.php?action=get_single&id=${id}`)
        .then(response => response.json())
        .then(data => {
            // Isikan data ke dalam input field form modal
            document.getElementById('mahasiswa_id').value = data.id;
            document.getElementById('nim').value = data.nim;
            document.getElementById('nama').value = data.nama;
            document.getElementById('jurusan').value = data.jurusan;
            document.getElementById('email').value = data.email;
            
            // Tampilkan modal setelah data terisi
            mModal.show();
        })
        .catch(err => console.error("Gagal mengambil data detail: ", err));
}

// ==========================================
// FUNGSI: SAVE DATA (Proses Tambah & Edit via POST)
// ==========================================
function simpanData(event) {
    event.preventDefault(); // Mencegah form melakukan reload halaman bawaan browser

    const form = document.getElementById('formMahasiswa');
    const formData = new FormData(form);

    fetch('api.php?action=save', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(res => {
        if (res.status === 'success') {
            alert('Data berhasil disimpan!');
            mModal.hide();     // Sembunyikan modal form
            loadData();         // Refresh konten tabel
        } else {
            alert('Error: ' + res.message);
        }
    })
    .catch(err => console.error("Gagal mengirim data: ", err));
}

// ==========================================
// FUNGSI: DELETE DATA
// ==========================================
function hapusData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data mahasiswa ini secara permanen?')) {
        const formData = new FormData();
        formData.append('id', id);

        fetch('api.php?action=delete', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(res => {
            if (res.status === 'success') {
                alert('Data berhasil dihapus!');
                loadData(); // Refresh konten tabel
            } else {
                alert('Error: ' + res.message);
            }
        })
        .catch(err => console.error("Gagal menghapus data: ", err));
    }
}


