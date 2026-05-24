<div align="center">

```
██╗    ██╗███████╗██████╗     ██████╗ ███████╗██╗   ██╗
██║    ██║██╔════╝██╔══██╗    ██╔══██╗██╔════╝██║   ██║
██║ █╗ ██║█████╗  ██████╔╝    ██║  ██║█████╗  ██║   ██║
██║███╗██║██╔══╝  ██╔══██╗    ██║  ██║██╔══╝  ╚██╗ ██╔╝
╚███╔███╔╝███████╗██████╔╝    ██████╔╝███████╗ ╚████╔╝ 
 ╚══╝╚══╝ ╚══════╝╚═════╝     ╚═════╝ ╚══════╝  ╚═══╝  
```

# 🌐 Pemrograman Web 1

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## 👤 Identitas Mahasiswa

| Field | Detail |
|-------|--------|
| 📛 **Nama** | Muhamad Ilham Ardiansyah |
| 🆔 **NIM** | 231011450716 |
| 🏫 **Kelas** | 05TPLE004 |

---

## 📚 Materi Perkuliahan

### 🔴 HTML — HyperText Markup Language
> Fondasi dari setiap halaman web

- ✅ Sintaks dasar & struktur dokumen

---

### 🔵 CSS — Cascading Style Sheets
> Memberi tampilan & gaya pada elemen HTML

| Metode | Keterangan |
|--------|-----------|
| `Inline` | Style langsung di atribut elemen |
| `Internal` | Style di dalam tag `<style>` |
| `Eksternal` | Style di file `.css` terpisah |

---

### 🟡 JavaScript
> Logika & interaktivitas halaman web

- 🏷️ **Tag** — Cara menyisipkan JS ke HTML
- 📤 **Output** — `console.log`, `alert`, `document.write`
- 📦 **Variabel** — `var`, `let`, `const`
- ➕ **Operator**

| Jenis | Contoh |
|-------|--------|
| Aritmatika | `+` `-` `*` `/` `%` `**` |
| Penugasan | `=` `+=` `-=` `*=` `/=` |
| Pembanding | `==` `===` `!=` `>` `<` `>=` `<=` |

---

## 📝 Tugas Pertemuan 13

### ✅ Task List

- [x] **1.** Contoh `if-else` / `switch-case` yang lebih kompleks
- [x] **2.** Contoh `function` yang lebih kompleks
- [x] **3.** Kalkulator dengan HTML, CSS & JS

---

### 🗂️ Struktur File

```
231011450716_MuhamadIlhamArdiansyah/
│
├── 📄 index.html          # Kalkulator (HTML + CSS + JS)
├── 🎨 style.css           # Styling kalkulator
├── ⚙️  script.js           # Logic kalkulator
│
└── 📄 js-examples.html    # Contoh if-else, switch, function
```

---

### 🔍 Preview Tugas

#### 1️⃣ If-Else / Switch Case Kompleks
```js
function evaluateStudent(name, score, attendance, role) {
  if (score >= 90)      { grade = 'A'; status = 'Istimewa'; }
  else if (score >= 80) { grade = 'B'; status = 'Baik'; }
  else if (score >= 70) { grade = 'C'; status = 'Cukup'; }
  // ...

  switch (role) {
    case 'ketua':    privilege = 'Akses penuh'; break;
    case 'anggota':
    case 'biasa':    privilege = 'Akses terbatas'; break; // fall-through
    default:         privilege = 'Tidak dikenal';
  }
}
```

#### 2️⃣ Function Kompleks
```js
// Closure
function createDiscount(persen) {
  return (harga) => ({ hemat: harga * persen / 100 });
}

// Higher-Order Function
function filterAndTransform(arr, filterFn, transformFn) {
  return arr.filter(filterFn).map(transformFn);
}

// Rekursi
function faktorial(n) {
  if (n <= 1) return 1;
  return n * faktorial(n - 1);
}
```

#### 3️⃣ Kalkulator
```
┌──────────────────────┐
│         0            │  ← Display hasil
├──────┬──────┬────────┤
│  AC  │ +/−  │   %  ÷ │
│   7  │   8  │   9  × │
│   4  │   5  │   6  − │
│   1  │   2  │   3  + │
│   0        │   .  = │
└──────────────────────┘
  Glassmorphism UI ✨
```

---

## 📦 Cara Menjalankan

```bash
# Clone repository
git clone https://github.com/[username]/[repo-name].git

# Buka file langsung di browser
open index.html         # kalkulator
open js-examples.html   # contoh JS (lihat output di Console → F12)
```

---

## 📁 Pengumpulan

| Platform | Link |
|----------|------|
| 📧 **Email Dosen** | arisyarip88@gmail.com |
| ☁️ **Google Drive** | `Drive Kelas → NIM_Nama → pertemuan_13` |
| 🐙 **GitHub** | Upload semua file kode |

---

<div align="center">

Made with ❤️ by **Muhamad Ilham Ardiansyah** · 05TPLE004

</div>