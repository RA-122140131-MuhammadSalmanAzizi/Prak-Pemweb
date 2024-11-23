<?php
session_start();

function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function isValidTelepon($telepon) {
    return preg_match('/^(\+62|62|0)[0-9]{9,12}$/', $telepon);
}

function isValidFile($file) {
    $allowedExtension = 'txt';
    $maxSize = 1048576; // 1MB in bytes
    
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    return (
        $fileExtension === $allowedExtension &&
        $file['size'] <= $maxSize &&
        $file['error'] === 0
    );
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (empty($_POST['nama']) || strlen($_POST['nama']) < 3) {
        $errors[] = "Nama harus diisi minimal 3 karakter";
    }

    if (empty($_POST['email']) || !isValidEmail($_POST['email'])) {
        $errors[] = "Email tidak valid";
    }

    if (empty($_POST['telepon']) || !isValidTelepon($_POST['telepon'])) {
        $errors[] = "Nomor telepon tidak valid";
    }

    if (empty($_POST['umur']) || $_POST['umur'] < 17 || $_POST['umur'] > 60) {
        $errors[] = "Umur harus antara 17-60 tahun";
    }

    if (empty($_POST['pendidikan'])) {
        $errors[] = "Pendidikan harus dipilih";
    }

    if (!isset($_FILES['biodata']) || !isValidFile($_FILES['biodata'])) {
        $errors[] = "File biodata harus berformat .txt dan maksimal 1MB";
    }

    if (empty($errors)) {
        // Membaca konten file dan membersihkan spasi di awal dan akhir
        $biodata_content = trim(file_get_contents($_FILES['biodata']['tmp_name']));
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        
        $_SESSION['form_data'] = [
            'nama' => $_POST['nama'],
            'email' => $_POST['email'],
            'telepon' => $_POST['telepon'],
            'umur' => $_POST['umur'],
            'pendidikan' => $_POST['pendidikan'],
            'biodata_content' => $biodata_content,
            'user_agent' => $user_agent
        ];
        
        header('Location: result.php');
        exit;
    } else {
        $_SESSION['errors'] = $errors;
        header('Location: form.php');
        exit;
    }
}
?>