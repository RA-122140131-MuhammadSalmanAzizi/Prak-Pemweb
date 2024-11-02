// Constants & globals
const CFG = {
    weights: { tugas: .3, uts: .3, uas: .4 },
    grades: { A: 90, B: 80, C: 70, D: 60 },
    colors: {
        chart: ['rgba(0,255,136,.8)', 'rgba(0,166,255,.8)', 'rgba(255,51,153,.8)'],
        grade: {
            A: 'linear-gradient(45deg,#00ff88,#00a6ff)', 
            B: 'linear-gradient(45deg,#00a6ff,#0066ff)',
            C: 'linear-gradient(45deg,#ffbb00,#ff8800)', 
            D: 'linear-gradient(45deg,#ff7700,#ff5252)',
            E: 'linear-gradient(45deg,#ff5252,#ff0000)'
        }
    }
};
let charts = { contribution: null, comparison: null };
let sliders = {};

// Core functions
const $ = id => document.getElementById(id);
const updateInput = (id, val) => $(id).value = val;
const resetForm = () => {
    ['tugas', 'uts', 'uas'].forEach(id => {
        $(id).value = '';
        sliders[id].value = 0;
    });
    Object.values(charts).forEach(chart => chart?.destroy());
    charts = { contribution: null, comparison: null };
    ['results', 'error'].forEach(id => $(id).style.display = 'none');
};

const calculateGrade = () => {
    try {
        $('error').style.display = 'none';
        const scores = Object.keys(CFG.weights).reduce((acc, key) => {
            const val = $(key).value;
            if (!val || isNaN(val) || val < 0 || val > 100) 
                throw `${key.toUpperCase()} score must be between 0-100`;
            acc[key] = Number(val);
            return acc;
        }, {});

        const contributions = Object.entries(scores)
            .reduce((acc, [key, val]) => ({...acc, [key]: val * CFG.weights[key]}), {});

        const finalScore = Object.values(contributions).reduce((a, b) => a + b);
        const grade = Object.entries(CFG.grades).find(([_, min]) => finalScore >= min)?.[0] || 'E';
        const status = finalScore >= CFG.grades.C ? 'PASSED' : 'FAILED';

        // Update displays
        const circle = $('grade-circle');
        circle.textContent = grade;
        circle.style.background = CFG.colors.grade[grade];

        $('grade-details').innerHTML = `
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Final Score</div>
                    <div class="detail-value">${finalScore.toFixed(2)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value ${status.toLowerCase()}">${status}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Contributions</div>
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

        // Update charts
        Object.values(charts).forEach(chart => chart?.destroy());
        
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
                        text: 'Score Distribution',
                        color: '#fff',
                        font: { size: 16 }
                    }
                }
            }
        });

        charts.comparison = new Chart($('comparisonChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Your Score', 'Class Average', 'Minimum Pass'],
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
                        text: 'Score Comparison',
                        color: '#fff',
                        font: { size: 16 }
                    }
                }
            }
        });

        $('results').style.display = 'block';
    } catch (err) {
        const errorDiv = $('error');
        errorDiv.textContent = err;
        errorDiv.style.display = 'block';
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    ['tugas', 'uts', 'uas'].forEach(id => {
        const input = $(id);
        sliders[id] = document.querySelector(`input[type="range"][oninput*="${id}"]`);
        input.addEventListener('input', () => {
            input.value = Math.min(100, Math.max(0, input.value));
            sliders[id].value = input.value;
        });
        sliders[id].addEventListener('input', () => input.value = sliders[id].value);
    });
});