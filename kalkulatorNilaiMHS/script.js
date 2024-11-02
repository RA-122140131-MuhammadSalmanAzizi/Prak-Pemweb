// Konfigurasi aplikasi dan variabel global
const CFG = {
    // Bobot penilaian masing-masing komponen
    weights: { tugas: .3, uts: .3, uas: .4 },
    // Batas nilai untuk setiap grade
    grades: { A: 90, B: 80, C: 70, D: 60 },
    // Konfigurasi warna untuk tampilan
    colors: {
        // Warna untuk chart
        chart: ['rgba(0,255,136,.8)', 'rgba(0,166,255,.8)', 'rgba(255,51,153,.8)'],
        // Gradien warna untuk setiap grade
        grade: {
            A: 'linear-gradient(45deg,#00ff88,#00a6ff)', 
            B: 'linear-gradient(45deg,#00a6ff,#0066ff)',
            C: 'linear-gradient(45deg,#ffbb00,#ff8800)', 
            D: 'linear-gradient(45deg,#ff7700,#ff5252)',
            E: 'linear-gradient(45deg,#ff5252,#ff0000)'
        }
    }
};

// Variabel untuk menyimpan instance chart
let charts = { contribution: null, comparison: null };
// Variabel untuk menyimpan referensi slider
let sliders = {};

// Fungsi helper untuk mendapatkan elemen DOM
const $ = id => document.getElementById(id);

// Fungsi untuk mengupdate nilai input
const updateInput = (id, val) => $(id).value = val;

// Fungsi untuk mereset form
const resetForm = () => {
    // Reset semua input dan slider
    ['tugas', 'uts', 'uas'].forEach(id => {
        $(id).value = '';
        sliders[id].value = 0;
    });
    // Hapus chart yang ada
    Object.values(charts).forEach(chart => chart?.destroy());
    charts = { contribution: null, comparison: null };
    // Sembunyikan hasil dan error
    ['results', 'error'].forEach(id => $(id).style.display = 'none');
};

// Fungsi utama untuk menghitung nilai
const calculateGrade = () => {
    try {
        // Sembunyikan pesan error sebelumnya
        $('error').style.display = 'none';

        // Ambil dan validasi input
        const scores = Object.keys(CFG.weights).reduce((acc, key) => {
            const val = $(key).value;
            // Validasi input harus ada dan berada di antara 0-100
            if (!val || isNaN(val) || val < 0 || val > 100) 
                throw `Nilai ${key.toUpperCase()} harus antara 0-100`;
            acc[key] = Number(val);
            return acc;
        }, {});

        // Hitung kontribusi setiap komponen
        const contributions = Object.entries(scores)
            .reduce((acc, [key, val]) => ({...acc, [key]: val * CFG.weights[key]}), {});

        // Hitung nilai akhir
        const finalScore = Object.values(contributions).reduce((a, b) => a + b);
        // Tentukan grade berdasarkan nilai akhir
        const grade = Object.entries(CFG.grades).find(([_, min]) => finalScore >= min)?.[0] || 'E';
        // Tentukan status lulus/tidak
        const status = finalScore >= CFG.grades.C ? 'LULUS' : 'TIDAK LULUS';

        // Update tampilan hasil
        const circle = $('grade-circle');
        circle.textContent = grade;
        circle.style.background = CFG.colors.grade[grade];

        // Update detail nilai
        $('grade-details').innerHTML = `
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Nilai Akhir</div>
                    <div class="detail-value">${finalScore.toFixed(2)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value ${status.toLowerCase()}">${status}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Kontribusi Nilai</div>
                    <div class="details-grid">
                        ${Object.entries(contributions)
                            .map(([k, v]) => `
                                <div class="detail-value">
                                    ${k.toUpperCase()}: ${v.toFixed(2)}
                                </div>
                            `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Update grafik
        Object.values(charts).forEach(chart => chart?.destroy());
        
        // Buat grafik distribusi nilai (donut chart)
        charts.contribution = new Chart($('contributionChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(contributions).map(k => k.toUpperCase()),
                datasets: [{
                    data: Object.values(contributions),
                    backgroundColor: CFG.colors.chart,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fff', font: { size: 12 } }
                    },
                    title: {
                        display: true,
                        text: 'Distribusi Nilai',
                        color: '#fff',
                        font: { size: 16 }
                    }
                }
            }
        });

        // Buat grafik perbandingan nilai (bar chart)
        charts.comparison = new Chart($('comparisonChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Nilai Anda', 'Rata-rata Kelas', 'Batas Lulus'],
                datasets: [{
                    data: [finalScore, 75, CFG.grades.C],
                    backgroundColor: CFG.colors.chart,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,.1)' },
                        ticks: { color: '#fff' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#fff' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Perbandingan Nilai',
                        color: '#fff',
                        font: { size: 16 }
                    }
                }
            }
        });

        // Tampilkan hasil
        $('results').style.display = 'block';

    } catch (err) {
        // Tampilkan pesan error jika terjadi kesalahan
        const errorDiv = $('error');
        errorDiv.textContent = err;
        errorDiv.style.display = 'block';
    }
};

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Setup event listener untuk setiap input
    ['tugas', 'uts', 'uas'].forEach(id => {
        const input = $(id);
        sliders[id] = document.querySelector(`input[type="range"][oninput*="${id}"]`);

        // Event listener untuk input angka
        input.addEventListener('input', () => {
            input.value = Math.min(100, Math.max(0, input.value));
            sliders[id].value = input.value;
        });

        // Event listener untuk slider
        sliders[id].addEventListener('input', () => input.value = sliders[id].value);
    });
});