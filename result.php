<?php
session_start();

if (!isset($_SESSION['form_data'])) {
    header('Location: form.php');
    exit;
}

$data = $_SESSION['form_data'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hasil Pendaftaran</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .biodata-content {
            white-space: pre-wrap;
            background-color: #f8f9fa;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin: 20px 0;
            line-height: 1.6;
            font-family: monospace;
            color: #333;
            word-wrap: break-word;
            overflow-wrap: break-word;
            -webkit-user-select: text;
            user-select: text;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Data Pendaftaran</h2>
        
        <table>
            <tr>
                <th>Field</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Nama</td>
                <td><?php echo htmlspecialchars($data['nama']); ?></td>
            </tr>
            <tr>
                <td>Email</td>
                <td><?php echo htmlspecialchars($data['email']); ?></td>
            </tr>
            <tr>
                <td>Telepon</td>
                <td><?php echo htmlspecialchars($data['telepon']); ?></td>
            </tr>
            <tr>
                <td>Umur</td>
                <td><?php echo htmlspecialchars($data['umur']); ?></td>
            </tr>
            <tr>
                <td>Pendidikan</td>
                <td><?php echo htmlspecialchars($data['pendidikan']); ?></td>
            </tr>
        </table>

        <h3>Isi File Biodata:</h3>
        <pre class="biodata-content"><?php echo htmlspecialchars(trim($data['biodata_content'])); ?></pre>

        <h3>Informasi Browser/Sistem:</h3>
        <table>
            <tr>
                <th>User Agent</th>
                <td><?php echo htmlspecialchars($data['user_agent']); ?></td>
            </tr>
        </table>

        <a href="form.php" class="back-link">Kembali ke Form</a>
    </div>

    <?php
    unset($_SESSION['form_data']);
    ?>
</body>
</html>