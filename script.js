document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const studentCountInput = document.getElementById('studentCount');
    const gradeSystemSelect = document.getElementById('gradeSystem');
    const resultSection = document.getElementById('resultSection');
    const resultBody = document.getElementById('resultBody');
    const themeToggle = document.getElementById('themeToggle');

    // Theme Toggle Logic
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Cumulative percentages provided by developer
    const gradeData = {
        '5': [10, 34, 66, 90, 100],
        '9': [4, 11, 23, 40, 60, 77, 89, 96, 100]
    };

    calculateBtn.addEventListener('click', () => {
        const studentCount = parseInt(studentCountInput.value);
        const system = gradeSystemSelect.value;

        if (!studentCount || studentCount <= 0) {
            alert('올바른 학생 수를 입력해주세요.');
            return;
        }

        const thresholds = gradeData[system];
        resultBody.innerHTML = '';
        
        let prevRankLimit = 0;

        thresholds.forEach((percentage, index) => {
            // Calculate current rank limit (cumulative)
            // Using Math.round to handle floating point issues and match common grading standards
            let currentRankLimit = Math.min(studentCount, Math.round(studentCount * (percentage / 100)));
            
            // Ensure rank limit doesn't decrease and respects student count
            if (currentRankLimit < prevRankLimit) currentRankLimit = prevRankLimit;
            if (index === thresholds.length - 1) currentRankLimit = studentCount;

            const gradeName = `${index + 1}등급`;
            let rankRange = '';

            if (currentRankLimit === prevRankLimit) {
                rankRange = '해당 없음 (인원 부족)';
            } else {
                const startRank = prevRankLimit + 1;
                const endRank = currentRankLimit;
                rankRange = startRank === endRank ? `${startRank}등` : `${startRank}등 ~ ${endRank}등`;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${gradeName}</td>
                <td>${rankRange}</td>
            `;
            resultBody.appendChild(row);

            prevRankLimit = currentRankLimit;
        });

        resultSection.classList.add('active');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Enter key support
    studentCountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateBtn.click();
    });
});
