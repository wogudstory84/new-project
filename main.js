const URL = "https://teachablemachine.withgoogle.com/models/xykbejen/"; 

let model, labelContainer, maxPredictions;

// Load the model automatically when the script runs
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    
    // Setup label container structure
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = '';
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
}

loadModel();

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const imgElement = document.getElementById('image-preview');
        imgElement.src = e.target.result;
        imgElement.style.display = 'block';
        
        // Wait for image to load before predicting
        imgElement.onload = async function() {
            await predict(imgElement);
        };
    };
    reader.readAsDataURL(file);
    
    const label = document.getElementById('upload-label');
    label.textContent = "다른 이미지 업로드하기";
}

async function predict(imgElement) {
    if (!model) {
        await loadModel();
    }
    
    const prediction = await model.predict(imgElement);
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
