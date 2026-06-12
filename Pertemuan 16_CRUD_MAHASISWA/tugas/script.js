document.addEventListener('DOMContentLoaded', () => {
    loadDosen();
    loadMatkul();
    loadJadwal();
});

const dosenModal = new bootstrap.Modal(document.getElementById('dosenModal'));
const matkulModal = new bootstrap.Modal(document.getElementById('matkulModal'));
const jadwalModal = new bootstrap.Modal(document.getElementById('jadwalModal'));

function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    }[char]));
}

function postForm(url, formData) {
    return fetch(url, {
        method: 'POST',
        body: formData,
    }).then((response) => response.json());
}

function loadDosen() {
    fetch('api_dosen.php?action=list')
        .then((response) => response.json())
        .then((data) => {
            let html = '';

            if (data.length === 0) {
                html = '<tr><td colspan="4" class="text-center text-muted p-4">Belum ada data dosen.</td></tr>';
            } else {
                data.forEach((dosen, index) => {
                    html += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${esc(dosen.nama)}</td>
                            <td>${esc(dosen.alamat)}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-1" onclick="siapkanEditDosen(${dosen.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="hapusDosen(${dosen.id})">Hapus</button>
                            </td>
                        </tr>
                    `;
                });
            }

            document.getElementById('data-dosen').innerHTML = html;
        });
}

function siapkanTambahDosen() {
    document.getElementById('dosenModalTitle').innerText = 'Tambah Dosen';
    document.getElementById('formDosen').reset();
    document.getElementById('dosen_id').value = '';
}

function siapkanEditDosen(id) {
    fetch(`api_dosen.php?action=get_single&id=${id}`)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('dosenModalTitle').innerText = 'Edit Dosen';
            document.getElementById('dosen_id').value = data.id;
            document.getElementById('nama_dosen').value = data.nama;
            document.getElementById('alamat_dosen').value = data.alamat;
            dosenModal.show();
        });
}

function simpanDosen(event) {
    event.preventDefault();
    postForm('api_dosen.php?action=save', new FormData(document.getElementById('formDosen')))
        .then((res) => {
            if (res.status === 'success') {
                dosenModal.hide();
                loadDosen();
                loadJadwal();
            } else {
                alert(res.message);
            }
        });
}

function hapusDosen(id) {
    if (!confirm('Hapus data dosen ini?')) return;

    const formData = new FormData();
    formData.append('id', id);
    postForm('api_dosen.php?action=delete', formData)
        .then((res) => {
            if (res.status === 'success') {
                loadDosen();
                loadJadwal();
            } else {
                alert(res.message);
            }
        });
}

function loadMatkul() {
    fetch('api_matkul.php?action=list')
        .then((response) => response.json())
        .then((data) => {
            let html = '';

            if (data.length === 0) {
                html = '<tr><td colspan="4" class="text-center text-muted p-4">Belum ada data mata kuliah.</td></tr>';
            } else {
                data.forEach((matkul, index) => {
                    html += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${esc(matkul.matkul)}</td>
                            <td>${esc(matkul.sks)}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-1" onclick="siapkanEditMatkul(${matkul.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="hapusMatkul(${matkul.id})">Hapus</button>
                            </td>
                        </tr>
                    `;
                });
            }

            document.getElementById('data-matkul').innerHTML = html;
        });
}

function siapkanTambahMatkul() {
    document.getElementById('matkulModalTitle').innerText = 'Tambah Mata Kuliah';
    document.getElementById('formMatkul').reset();
    document.getElementById('matkul_id').value = '';
}

function siapkanEditMatkul(id) {
    fetch(`api_matkul.php?action=get_single&id=${id}`)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('matkulModalTitle').innerText = 'Edit Mata Kuliah';
            document.getElementById('matkul_id').value = data.id;
            document.getElementById('nama_matkul').value = data.matkul;
            document.getElementById('sks').value = data.sks;
            matkulModal.show();
        });
}

function simpanMatkul(event) {
    event.preventDefault();
    postForm('api_matkul.php?action=save', new FormData(document.getElementById('formMatkul')))
        .then((res) => {
            if (res.status === 'success') {
                matkulModal.hide();
                loadMatkul();
                loadJadwal();
            } else {
                alert(res.message);
            }
        });
}

function hapusMatkul(id) {
    if (!confirm('Hapus data mata kuliah ini?')) return;

    const formData = new FormData();
    formData.append('id', id);
    postForm('api_matkul.php?action=delete', formData)
        .then((res) => {
            if (res.status === 'success') {
                loadMatkul();
                loadJadwal();
            } else {
                alert(res.message);
            }
        });
}

function loadJadwal() {
    fetch('api_jadwal.php?action=list')
        .then((response) => response.json())
        .then((data) => {
            let html = '';

            if (data.length === 0) {
                html = '<tr><td colspan="7" class="text-center text-muted p-4">Belum ada data jadwal.</td></tr>';
            } else {
                data.forEach((jadwal, index) => {
                    html += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${esc(jadwal.nama_dosen)}</td>
                            <td>${esc(jadwal.nama_matkul)}</td>
                            <td>${esc(jadwal.sks)}</td>
                            <td>${esc(jadwal.waktu)}</td>
                            <td>${esc(jadwal.ruang)}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-1" onclick="siapkanEditJadwal(${jadwal.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="hapusJadwal(${jadwal.id})">Hapus</button>
                            </td>
                        </tr>
                    `;
                });
            }

            document.getElementById('data-jadwal').innerHTML = html;
        });
}

function isiSelectJadwal(selectedDosen = '', selectedMatkul = '') {
    return fetch('api_jadwal.php?action=options')
        .then((response) => response.json())
        .then((data) => {
            const dosenOptions = ['<option value="">Pilih dosen</option>']
                .concat(data.dosen.map((dosen) => `<option value="${dosen.id}">${esc(dosen.nama)}</option>`));
            const matkulOptions = ['<option value="">Pilih mata kuliah</option>']
                .concat(data.matkul.map((matkul) => `<option value="${matkul.id}">${esc(matkul.matkul)} (${esc(matkul.sks)} SKS)</option>`));

            document.getElementById('id_dosen').innerHTML = dosenOptions.join('');
            document.getElementById('id_matkul').innerHTML = matkulOptions.join('');
            document.getElementById('id_dosen').value = selectedDosen;
            document.getElementById('id_matkul').value = selectedMatkul;
        });
}

function siapkanTambahJadwal() {
    document.getElementById('jadwalModalTitle').innerText = 'Tambah Jadwal';
    document.getElementById('formJadwal').reset();
    document.getElementById('jadwal_id').value = '';
    isiSelectJadwal();
}

function siapkanEditJadwal(id) {
    fetch(`api_jadwal.php?action=get_single&id=${id}`)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('jadwalModalTitle').innerText = 'Edit Jadwal';
            document.getElementById('jadwal_id').value = data.id;
            document.getElementById('waktu').value = data.waktu;
            document.getElementById('ruang').value = data.ruang;

            isiSelectJadwal(data.id_dosen, data.id_matkul).then(() => {
                jadwalModal.show();
            });
        });
}

function simpanJadwal(event) {
    event.preventDefault();
    postForm('api_jadwal.php?action=save', new FormData(document.getElementById('formJadwal')))
        .then((res) => {
            if (res.status === 'success') {
                jadwalModal.hide();
                loadJadwal();
            } else {
                alert(res.message);
            }
        });
}

function hapusJadwal(id) {
    if (!confirm('Hapus data jadwal ini?')) return;

    const formData = new FormData();
    formData.append('id', id);
    postForm('api_jadwal.php?action=delete', formData)
        .then((res) => {
            if (res.status === 'success') {
                loadJadwal();
            } else {
                alert(res.message);
            }
        });
}
