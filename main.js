// Teachable Machine URL - 실제 모델 URL로 변경 가능합니다.
// 현재는 예시 URL로 설정되어 있습니다.
const URL = "https://teachablemachine.withgoogle.com/models/xykbejen/"; 

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const startButton = document.getElementById("start-button");
    startButton.disabled = true;
    startButton.textContent = "모델 로딩 중...";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true; 
        webcam = new tmImage.Webcam(200, 200, flip); 
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = ''; // 초기화

        for (let i = 0; i < maxPredictions; i++) {
            const predictionBar = document.createElement("div");
            predictionBar.className = "prediction-bar";
            predictionBar.innerHTML = `
                <div class="class-name">...</div>
                <div class="bar-wrap">
                    <div class="bar-fill" id="bar-${i}"></div>
                </div>
                <div class="probability-text" id="prob-${i}">0%</div>
            `;
            labelContainer.appendChild(predictionBar);
        }
        
        startButton.style.display = "none";
    } catch (error) {
        console.error(error);
        alert("모델을 불러오는데 실패했습니다. URL을 확인해주세요.");
        startButton.disabled = false;
        startButton.textContent = "AI 분석 시작하기";
    }
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const labelDiv = labelContainer.childNodes[i];
        labelDiv.querySelector(".class-name").textContent = className;
        
        const barFill = document.getElementById(`bar-${i}`);
        barFill.style.width = probability + "%";
        
        const probText = document.getElementById(`prob-${i}`);
        probText.textContent = probability + "%";
    }
}

// Theme Toggle Logic
const themeToggleButton = document.getElementById('theme-toggle-button');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggleButton.textContent = '☀️';
}

themeToggleButton.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleButton.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleButton.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});
