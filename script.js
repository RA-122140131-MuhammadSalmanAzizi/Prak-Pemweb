/* script.js */
function validateForm() {
    let isValid = true;
    const nama = document.getElementById('nama');
    const email = document.getElementById('email');
    const telepon = document.getElementById('telepon');
    const umur = document.getElementById('umur');
    const pendidikan = document.getElementById('pendidikan');
    const biodata = document.getElementById('biodata');

    // Reset error messages
    document.querySelectorAll('.error').forEach(error => error.style.display = 'none');

    // Validate nama
    if (nama.value.length < 3) {
        document.getElementById('namaError').style.display = 'block';
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    // Validate telepon
    const teleponPattern = /^(\+62|62|0)[0-9]{9,12}$/;
    if (!teleponPattern.test(telepon.value)) {
        document.getElementById('teleponError').style.display = 'block';
        isValid = false;
    }

    // Validate umur
    if (umur.value < 17 || umur.value > 60) {
        document.getElementById('umurError').style.display = 'block';
        isValid = false;
    }

    // Validate pendidikan
    if (pendidikan.value === '') {
        document.getElementById('pendidikanError').style.display = 'block';
        isValid = false;
    }

    // Validate biodata file
    if (biodata.files.length > 0) {
        const file = biodata.files[0];
        if (!file.name.endsWith('.txt')) {
            document.getElementById('biodataError').style.display = 'block';
            isValid = false;
        }
        if (file.size > 1048576) {
            document.getElementById('biodataError').style.display = 'block';
            isValid = false;
        }
    }

    return isValid;
}