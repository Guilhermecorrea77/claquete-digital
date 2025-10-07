document.addEventListener('DOMContentLoaded', () => {
    // Variável para armazenar o relatório em memória
    let approvedTakesLog = "";

    // Mapeamento dos campos
    const mappings = {
        'prod-co': 'display-prod-co', 'roll': 'display-roll', 'scene': 'display-scene',
        'take': 'display-take', 'director': 'display-director', 'camera': 'display-camera',
        'int-ext': 'display-int-ext', 'day-night': 'display-day-night', 'sound': 'display-sound',
    };

    // Funções de atualização da tela (sem alterações)
    const updateDisplay = (inputId, displayId) => {
        const inputElement = document.getElementById(inputId);
        const displayElement = document.getElementById(displayId);
        if (inputElement && displayElement) {
            displayElement.textContent = (inputElement.value || inputElement.placeholder).toUpperCase();
        }
    };
    const updateDateDisplay = () => {
        const dateInput = document.getElementById('date');
        const displayDayMonth = document.getElementById('display-date-day-month');
        const displayYear = document.getElementById('display-date-year');
        if (dateInput && displayDayMonth && displayYear) {
            if (dateInput.value) {
                const [year, month, day] = dateInput.value.split('-');
                displayDayMonth.textContent = `${day}/${month}`;
                displayYear.textContent = year;
            } else {
                displayDayMonth.textContent = 'DD/MM'; displayYear.textContent = 'YYYY';
            }
        }
    };

    // Adiciona listeners para os campos
    for (const inputId in mappings) {
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.addEventListener('input', () => updateDisplay(inputId, mappings[inputId]));
        }
    }
    const dateInput = document.getElementById('date');
    if (dateInput) { dateInput.addEventListener('input', updateDateDisplay); }

    // Elementos Globais
    const body = document.body;
    const clapperboard = document.getElementById('clapperboard');
    const clapButton = document.getElementById('clap-button');
    const clapSound = document.getElementById('clap-sound');
    const toggleControlsButton = document.getElementById('toggle-controls-button');
    const controlsPanel = document.getElementById('controls-panel');
    
    // --- NOVA LÓGICA DE ANOTAÇÃO ---
    const approveButton = document.getElementById('approve-button');
    const downloadLogButton = document.getElementById('download-log-button');
    const notesInput = document.getElementById('notes');

    if (approveButton) {
        approveButton.addEventListener('click', () => {
            // Se o relatório estiver vazio, cria um cabeçalho
            if (approvedTakesLog === "") {
                const prodName = document.getElementById('prod-co').value || "PRODUÇÃO";
                const today = new Date().toLocaleDateString('pt-BR');
                approvedTakesLog = `--- RELATÓRIO DE TAKES APROVADOS: ${prodName.toUpperCase()} - ${today} ---\n\n`;
            }

            // Coleta os dados dos inputs
            const timestamp = new Date().toLocaleTimeString('pt-BR');
            const roll = document.getElementById('roll').value;
            const scene = document.getElementById('scene').value;
            const take = document.getElementById('take').value;
            const camera = document.getElementById('camera').value;
            const notes = notesInput.value || "N/A";

            // Formata a nova linha do relatório
            const logEntry = `[${timestamp}] - ROLL: ${roll} - CENA: ${scene} - TAKE: ${take} - CAM: ${camera} - NOTAS: ${notes}\n`;
            
            // Adiciona a linha ao relatório
            approvedTakesLog += logEntry;

            // Limpa o campo de notas
            notesInput.value = "";

            // Feedback visual
            approveButton.classList.add('approved');
            setTimeout(() => approveButton.classList.remove('approved'), 500);
        });
    }

    if (downloadLogButton) {
        downloadLogButton.addEventListener('click', () => {
            if (approvedTakesLog === "") {
                alert("Nenhum take foi aprovado ainda para gerar um relatório.");
                return;
            }

            // Cria o arquivo de texto
            const blob = new Blob([approvedTakesLog], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            // Define o nome do arquivo
            const prodName = (document.getElementById('prod-co').value || "Produção").replace(/\s+/g, '_');
            const dateStr = new Date().toISOString().split('T')[0];
            a.download = `Relatorio_Takes_${prodName}_${dateStr}.txt`;
            
            a.href = url;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            // Limpeza
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Lógica do Clap (sem alterações)
    if (clapButton && clapSound) {
        clapButton.addEventListener('click', () => {
            clapSound.currentTime = 0;
            clapSound.play();
            body.classList.add('screen-flash');
            setTimeout(() => body.classList.remove('screen-flash'), 200);
        });
    }

    // Lógica do Toggle e Atalhos (sem alterações)
    if (toggleControlsButton && controlsPanel) {
        const toggleFullscreen = () => {
            body.classList.toggle('fullscreen-mode');
            controlsPanel.classList.toggle('minimized');
            clapperboard.classList.toggle('expanded');
            toggleControlsButton.textContent = controlsPanel.classList.contains('minimized') ? 'Mostrar Controles' : 'Minimizar Controles';
        };
        toggleControlsButton.addEventListener('click', toggleFullscreen);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') { toggleFullscreen(); }
            if ((event.key === ' ' || event.code === 'Space') && body.classList.contains('fullscreen-mode')) {
                event.preventDefault();
                clapButton.click();
            }
        });
    }
    
    // Função de inicialização
    const initialize = () => {
        const today = new Date().toISOString().split('T')[0];
        if (dateInput) { dateInput.value = today; }
        for (const inputId in mappings) { updateDisplay(inputId, mappings[inputId]); }
        updateDateDisplay();
    };

    initialize();
});