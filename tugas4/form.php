<!-- form.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Pendaftaran</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h2>Form Pendaftaran</h2>
        <form id="registrationForm" action="process.php" method="POST" enctype="multipart/form-data" onsubmit="return validateForm()">
            <div class="form-group">
                <label for="nama">Nama Lengkap (min. 3 karakter):</label>
                <input type="text" id="nama" name="nama" minlength="3" required>
                <span class="error" id="namaError">Nama harus diisi minimal 3 karakter</span>
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <span class="error" id="emailError">Email tidak valid</span>
            </div>

            <div class="form-group">
                <label for="telepon">Nomor Telepon:</label>
                <input type="tel" id="telepon" name="telepon" required>
                <span class="error" id="teleponError">Nomor telepon tidak valid</span>
            </div>

            <div class="form-group">
                <label for="umur">Umur (17-60 tahun):</label>
                <input type="number" id="umur" name="umur" min="17" max="60" required>
                <span class="error" id="umurError">Umur harus antara 17-60 tahun</span>
            </div>

            <div class="form-group">
                <label for="pendidikan">Pendidikan Terakhir:</label>
                <select id="pendidikan" name="pendidikan" required>
                    <option value="">Pilih Pendidikan</option>
                    <option value="SMA">SMA/SMK</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                </select>
                <span class="error" id="pendidikanError">Pilih pendidikan terakhir</span>
            </div>

            <div class="form-group">
                <label for="biodata">File Biodata (*.txt, max 1MB):</label>
                <input type="file" id="biodata" name="biodata" accept=".txt" required>
                <span class="error" id="biodataError">File harus berformat .txt dan maksimal 1MB</span>
            </div>

            <button type="submit">Kirim Pendaftaran</button>
        </form>
    </div>
    <script src="script.js"></script>
</body>
</html>