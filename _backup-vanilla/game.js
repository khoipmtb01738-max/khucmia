// ===== GAME STATE =====
const TEAM_COLORS = ['#ef4444','#3b82f6','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316','#14b8a6'];
const BALL_COLORS = ['#ef4444','#f59e0b','#3b82f6','#10b981','#8b5cf6','#ec4899','#06b6d4'];

let gameState = {
    teamCount: 3,
    tubesPerTeam: 3,
    timeLimit: 10,
    teams: [],
    currentTeam: 0,
    round: 1,
    timerRunning: false,
    timerInterval: null,
    timerValue: 10,
    pendingPull: null
};

// ===== PARTICLES =====
function createParticles() {
    const c = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 6 + 2;
        p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;background:${BALL_COLORS[i % BALL_COLORS.length]};animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*5}s;`;
        c.appendChild(p);
    }
}
createParticles();

// ===== SCREEN NAVIGATION =====
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    screen.classList.add('active');
    screen.style.animation = 'none';
    screen.offsetHeight;
    screen.style.animation = 'fadeIn 0.5s ease';

    if (id === 'screen-setup') updateTeamNames();
    if (id === 'screen-scoreboard') renderScoreboard();
}

// ===== SETUP CONTROLS =====
function adjustTeams(d) {
    gameState.teamCount = Math.max(2, Math.min(9, gameState.teamCount + d));
    document.getElementById('team-count').textContent = gameState.teamCount;
    updateTeamNames();
}
function adjustTubes(d) {
    gameState.tubesPerTeam = Math.max(1, Math.min(5, gameState.tubesPerTeam + d));
    document.getElementById('tube-count').textContent = gameState.tubesPerTeam;
}
function adjustTime(d) {
    gameState.timeLimit = Math.max(5, Math.min(60, gameState.timeLimit + d));
    document.getElementById('time-limit').textContent = gameState.timeLimit;
}

function updateTeamNames() {
    const section = document.getElementById('team-names-section');
    let html = '<h3 style="margin-bottom:1rem;color:var(--accent);font-size:1.1rem;">Tên các đội</h3>';
    for (let i = 0; i < gameState.teamCount; i++) {
        const name = gameState.teams[i]?.name || `Đội ${i + 1}`;
        html += `<div class="team-name-row">
            <div class="team-color-dot" style="background:${TEAM_COLORS[i]}"></div>
            <input class="team-name-input" type="text" value="${name}" placeholder="Tên đội ${i+1}" data-team="${i}">
        </div>`;
    }
    section.innerHTML = html;
}

// ===== START GAME =====
function startGame() {
    const inputs = document.querySelectorAll('.team-name-input');
    gameState.teams = [];
    for (let i = 0; i < gameState.teamCount; i++) {
        const name = inputs[i]?.value || `Đội ${i + 1}`;
        const tubes = [];
        for (let t = 0; t < gameState.tubesPerTeam; t++) {
            const stickCount = 5 + Math.floor(Math.random() * 4); // 5-8 sticks
            const sticks = [];
            for (let s = 0; s < stickCount; s++) {
                sticks.push({
                    id: s,
                    position: 15 + (s * (70 / stickCount)) + Math.random() * 5,
                    pulled: false
                });
            }
            tubes.push({ id: t, balls: 15, sticks, totalBalls: 15 });
        }
        gameState.teams.push({ name, color: TEAM_COLORS[i], tubes });
    }
    gameState.currentTeam = 0;
    gameState.round = 1;
    gameState.timerValue = gameState.timeLimit;

    showScreen('screen-game');
    renderTeamTabs();
    renderGameArea();
}

// ===== RENDER TEAM TABS =====
function renderTeamTabs() {
    const tabs = document.getElementById('team-tabs');
    tabs.innerHTML = gameState.teams.map((t, i) =>
        `<button class="team-tab ${i === gameState.currentTeam ? 'active' : ''}" onclick="switchTeam(${i})" style="${i === gameState.currentTeam ? `background:${t.color};border-color:${t.color}` : ''}">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${t.color};margin-right:6px;"></span>
            ${t.name}
        </button>`
    ).join('');
}

function switchTeam(i) {
    gameState.currentTeam = i;
    renderTeamTabs();
    renderGameArea();
}

// ===== RENDER GAME AREA =====
function renderGameArea() {
    const team = gameState.teams[gameState.currentTeam];
    document.getElementById('current-team-name').textContent = team.name;
    document.getElementById('current-team-name').style.color = team.color;
    document.getElementById('round-label').textContent = `Lượt ${gameState.round}`;

    const totalBalls = team.tubes.reduce((s, t) => s + t.balls, 0);
    document.getElementById('ball-count').textContent = totalBalls;

    const container = document.getElementById('tube-container');
    container.innerHTML = team.tubes.map((tube, ti) => {
        const ballsHtml = Array.from({ length: tube.balls }, (_, bi) =>
            `<div class="ball" style="background:radial-gradient(circle at 35% 35%,${lighten(team.color)},${team.color});box-shadow:0 2px 4px rgba(0,0,0,0.3),inset 0 -2px 4px rgba(0,0,0,0.2);"></div>`
        ).join('');

        const sticksHtml = tube.sticks.map(s =>
            s.pulled ? '' :
            `<div class="stick" style="top:${s.position}%" onclick="pullStick(${ti},${s.id})" title="Nhấn để rút thanh gỗ #${s.id + 1}"></div>`
        ).join('');

        return `<div class="tube-wrapper">
            <div class="tube-label">Ống ${ti + 1}</div>
            <div class="tube" id="tube-${ti}">
                ${ballsHtml}
                <div class="stick-zone">${sticksHtml}</div>
                <div class="tube-bottom"></div>
            </div>
            <div style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-dim);">🔴 ${tube.balls}/${tube.totalBalls}</div>
        </div>`;
    }).join('');

    resetTimer();
}

function lighten(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgb(${Math.min(255,r+80)},${Math.min(255,g+80)},${Math.min(255,b+80)})`;
}

// ===== PULL STICK =====
function pullStick(tubeIdx, stickId) {
    gameState.pendingPull = { tubeIdx, stickId };
    const modal = document.getElementById('modal-pull');
    document.getElementById('modal-stick-info').textContent = `Thanh gỗ #${stickId + 1} - Ống #${tubeIdx + 1}`;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-pull').style.display = 'none';
    gameState.pendingPull = null;
}

function confirmPull() {
    const { tubeIdx, stickId } = gameState.pendingPull;
    document.getElementById('modal-pull').style.display = 'none';

    const team = gameState.teams[gameState.currentTeam];
    const tube = team.tubes[tubeIdx];
    const stick = tube.sticks.find(s => s.id === stickId);
    if (!stick) return;
    stick.pulled = true;

    // Calculate balls that fall
    const remainingSticks = tube.sticks.filter(s => !s.pulled).length;
    const totalSticks = tube.sticks.length;
    let ballsDrop = 0;

    if (remainingSticks === 0) {
        ballsDrop = tube.balls;
    } else {
        // Probability-based: fewer sticks = more likely balls fall
        const prob = 1 - (remainingSticks / totalSticks);
        const maxDrop = Math.ceil(tube.balls * 0.4);
        for (let i = 0; i < Math.min(3, tube.balls); i++) {
            if (Math.random() < prob * 0.7) ballsDrop++;
        }
        ballsDrop = Math.min(ballsDrop, tube.balls);
    }

    tube.balls = Math.max(0, tube.balls - ballsDrop);

    // Show result
    setTimeout(() => {
        const resultModal = document.getElementById('modal-result');
        const icon = document.getElementById('result-icon');
        const title = document.getElementById('result-title');
        const text = document.getElementById('result-text');

        if (ballsDrop === 0) {
            icon.textContent = '🎉';
            title.textContent = 'An toàn!';
            text.textContent = 'Không có banh nào rơi! Tuyệt vời!';
        } else if (ballsDrop <= 2) {
            icon.textContent = '😅';
            title.textContent = 'Ôi không!';
            text.textContent = `${ballsDrop} banh đã rơi!`;
        } else {
            icon.textContent = '😱';
            title.textContent = 'Thảm hoạ!';
            text.textContent = `${ballsDrop} banh đã rơi xuống!`;
        }
        resultModal.style.display = 'flex';
    }, 600);

    renderGameArea();
}

function closeResultModal() {
    document.getElementById('modal-result').style.display = 'none';
}

// ===== TIMER =====
function startTimer() {
    if (gameState.timerRunning) return;
    gameState.timerRunning = true;
    gameState.timerValue = gameState.timeLimit;
    document.getElementById('btn-start-timer').disabled = true;

    const totalTime = gameState.timeLimit;
    const circumference = 2 * Math.PI * 54;
    const progress = document.getElementById('timer-progress');
    const text = document.getElementById('timer-text');

    gameState.timerInterval = setInterval(() => {
        gameState.timerValue--;
        text.textContent = gameState.timerValue;

        const pct = 1 - (gameState.timerValue / totalTime);
        progress.style.strokeDashoffset = circumference * pct;

        // Color changes
        progress.classList.remove('warning', 'danger');
        text.classList.remove('warning', 'danger');
        if (gameState.timerValue <= 3) {
            progress.classList.add('danger');
            text.classList.add('danger');
        } else if (gameState.timerValue <= 5) {
            progress.classList.add('warning');
            text.classList.add('warning');
        }

        if (gameState.timerValue <= 0) {
            clearInterval(gameState.timerInterval);
            gameState.timerRunning = false;
            text.textContent = '⏰';
            document.getElementById('btn-start-timer').disabled = false;
            // Flash effect
            document.getElementById('timer-ring').style.animation = 'pulse 0.5s ease 3';
            setTimeout(() => {
                document.getElementById('timer-ring').style.animation = '';
            }, 1500);
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerRunning = false;
    gameState.timerValue = gameState.timeLimit;

    const text = document.getElementById('timer-text');
    const progress = document.getElementById('timer-progress');
    text.textContent = gameState.timeLimit;
    text.classList.remove('warning', 'danger');
    progress.style.strokeDashoffset = 0;
    progress.classList.remove('warning', 'danger');
    document.getElementById('btn-start-timer').disabled = false;
}

// ===== SCOREBOARD =====
function renderScoreboard() {
    const sorted = [...gameState.teams].map((t, i) => ({
        ...t,
        totalBalls: t.tubes.reduce((s, tb) => s + tb.balls, 0),
        maxBalls: t.tubes.reduce((s, tb) => s + tb.totalBalls, 0),
        idx: i
    })).sort((a, b) => b.totalBalls - a.totalBalls);

    const medals = ['🥇', '🥈', '🥉'];
    const list = document.getElementById('scoreboard-list');
    list.innerHTML = sorted.map((t, rank) =>
        `<div class="score-row rank-${rank + 1}" style="animation-delay:${rank * 0.1}s;">
            <div class="score-rank">${medals[rank] || rank + 1}</div>
            <div class="score-info">
                <div class="score-team-name" style="color:${t.color}">${t.name}</div>
                <div class="score-detail">${t.totalBalls}/${t.maxBalls} banh còn lại</div>
            </div>
            <div class="score-balls">${t.totalBalls}</div>
        </div>`
    ).join('');
}

// ===== CONFIRM EXIT =====
function confirmExit() {
    if (confirm('Bạn có chắc muốn thoát trò chơi?')) {
        clearInterval(gameState.timerInterval);
        showScreen('screen-landing');
    }
}

// ===== INIT =====
updateTeamNames();
