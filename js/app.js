// Main application controller
class ChakraApp {
    constructor() {
        this.calculator = chakraCalculator;
        this.currentResults = null;
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
    }

    setupEventListeners() {
        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.calculateFromForm();
            }
        });

        // File input change
        document.getElementById('fileInput').addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name || 'Файл не выбран';
            document.getElementById('fileName').textContent = fileName;
        });
    }

    calculateFromForm() {
        const data = this.getFormData();
        const errors = ChakraUtils.validateInput(data);

        if (errors.length > 0) {
            ChakraUtils.showMessage(errors.join('. '), 'error');
            return;
        }

        this.performCalculation(data);
    }

    getFormData() {
        return {
            fam: DOMUtils.getElement('fam').value.trim(),
            name: DOMUtils.getElement('name').value.trim(),
            otc: DOMUtils.getElement('otc').value.trim(),
            day: parseInt(DOMUtils.getElement('day').value),
            month: parseInt(DOMUtils.getElement('month').value),
            year: parseInt(DOMUtils.getElement('year').value)
        };
    }

    async performCalculation(data) {
        try {
            DOMUtils.showElement('loading');
            DOMUtils.disableButton('saveBtn');

            // Simulate async calculation for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            const results = this.calculator.calculate(data);
            this.currentResults = results;

            this.displayResults(results);
            this.saveToLocalStorage(data, results);
            DOMUtils.enableButton('saveBtn');

            ChakraUtils.showMessage('Расчет завершен успешно!', 'success');

        } catch (error) {
            ChakraUtils.showMessage(error.message, 'error');
        } finally {
            DOMUtils.hideElement('loading');
        }
    }

    displayResults(results) {
        this.displayChakras(results);
        this.displayExtraInfo(results);
    }

    displayChakras(results) {
        const { basic, sCalculation } = results;

        const chakras = [
            { class: 'm1', label: 'СКРЫТЫЙ ТАЛАНТ (1-я чакра)', value: basic.c1 },
            { class: 'm2', label: 'СКРЫТЫЙ ТАЛАНТ (2-я чакра)', value: basic.c2 },
            { class: 'm3', label: 'СКРЫТЫЙ ТАЛАНТ (3-я чакра)', value: basic.c3 },
            { class: 'm4', label: 'СКРЫТЫЙ ТАЛАНТ (4-я чакра)', value: basic.c4 },
            { class: 'm5', label: 'СКРЫТЫЙ ТАЛАНТ (5-я чакра)', value: basic.c5 },
            { class: 'm6', label: 'СКРЫТЫЙ ТАЛАНТ (6-я чакра)', value: basic.c6 },
            { class: 'm7', label: 'СКРЫТЫЙ ТАЛАНТ (7-я чакра)', value: basic.c7 },
            { class: 'm1', label: 'СКРЫТЫЙ ТАЛАНТ (С-расчет 1)', value: sCalculation.sc1 },
            { class: 'm2', label: 'СКРЫТЫЙ ТАЛАНТ (С-расчет 2)', value: sCalculation.sc2 },
            { class: 'm3', label: 'СКРЫТЫЙ ТАЛАНТ (С-расчет 3)', value: sCalculation.sc3 },
            { class: 'm4', label: 'СКРЫТЫЙ ТАЛАНТ (С-расчет 6)', value: sCalculation.sc6 }
        ];

        const chakraHTML = chakras.map(chakra => `
            <div class="chakra-card">
                <div class="chakra-circle ${chakra.class}">${chakra.value}</div>
                <div class="chakra-label">${chakra.label}</div>
                <div class="chakra-value">${chakra.value}</div>
            </div>
        `).join('');

        DOMUtils.setContent('resultsContainer', chakraHTML);
    }

    displayExtraInfo(results) {
        const { basic, sCalculation, input } = results;

        const extraHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div><strong>Фамилия:</strong> ${input.fam} → ${basic.c1}</div>
                <div><strong>С-расчет фамилии:</strong> ${sCalculation.sc1}</div>
                <div><strong>Имя:</strong> ${input.name} → ${basic.c2}</div>
                <div><strong>С-расчет имени:</strong> ${sCalculation.sc2}</div>
                <div><strong>Отчество:</strong> ${input.otc} → ${basic.c3}</div>
                <div><strong>С-расчет отчества:</strong> ${sCalculation.sc3}</div>
                <div><strong>Дата рождения:</strong> ${input.day}.${input.month}.${input.year}</div>
                <div><strong>С-расчет 6-я чакра:</strong> ${sCalculation.sc6}</div>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ccc;">
                <strong>Время расчета:</strong> ${new Date().toLocaleString('ru-RU')}
            </div>
        `;

        DOMUtils.setContent('extraInfo', extraHTML);
    }

    saveToLocalStorage(data, results) {
        try {
            const storageData = {
                data: data,
                results: results,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('chakraLastCalculation', JSON.stringify(storageData));
        } catch (error) {
            console.warn('Не удалось сохранить в localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('chakraLastCalculation');
            if (stored) {
                const { data, results } = JSON.parse(stored);
                this.fillForm(data);
                this.currentResults = results;
                DOMUtils.enableButton('saveBtn');
            }
        } catch (error) {
            console.warn('Не удалось загрузить из localStorage:', error);
        }
    }

    fillForm(data) {
        DOMUtils.getElement('fam').value = data.fam || '';
        DOMUtils.getElement('name').value = data.name || '';
        DOMUtils.getElement('otc').value = data.otc || '';
        DOMUtils.getElement('day').value = data.day || '';
        DOMUtils.getElement('month').value = data.month || '';
        DOMUtils.getElement('year').value = data.year || '';
    }

    saveResults() {
        if (!this.currentResults) {
            ChakraUtils.showMessage('Нет данных для сохранения', 'warning');
            return;
        }

        const report = this.calculator.generateReport();
        const content = JSON.stringify(report, null, 2);
        const fileName = `chakra-report-${new Date().toISOString().split('T')[0]}.json`;

        ChakraUtils.downloadFile(content, fileName, 'application/json');
    }

    exportToJSON() {
        if (!this.currentResults) {
            ChakraUtils.showMessage('Сначала выполните расчет', 'warning');
            return;
        }

        const content = JSON.stringify(this.currentResults, null, 2);
        const fileName = `chakra-data-${new Date().toISOString().split('T')[0]}.json`;

        ChakraUtils.downloadFile(content, fileName, 'application/json');
    }

    exportToTXT() {
        if (!this.currentResults) {
            ChakraUtils.showMessage('Сначала выполните расчет', 'warning');
            return;
        }

        const { basic, sCalculation, input } = this.currentResults;

        let content = `ОТЧЕТ ПО РАСЧЕТУ ЧАКР\n`;
        content += `Дата: ${new Date().toLocaleDateString('ru-RU')}\n\n`;
        content += `ЛИЧНЫЕ ДАННЫЕ:\n`;
        content += `Фамилия: ${input.fam}\n`;
        content += `Имя: ${input.name}\n`;
        content += `Отчество: ${input.otc}\n`;
        content += `Дата рождения: ${input.day}.${input.month}.${input.year}\n\n`;
        content += `ОСНОВНЫЕ ЧАКРЫ:\n`;
        content += `1-я чакра: ${basic.c1}\n`;
        content += `2-я чакра: ${basic.c2}\n`;
        content += `3-я чакра: ${basic.c3}\n`;
        content += `4-я чакра: ${basic.c4}\n`;
        content += `5-я чакра: ${basic.c5}\n`;
        content += `6-я чакра: ${basic.c6}\n`;
        content += `7-я чакра: ${basic.c7}\n\n`;
        content += `С-РАСЧЕТ:\n`;
        content += `С-расчет 1: ${sCalculation.sc1}\n`;
        content += `С-расчет 2: ${sCalculation.sc2}\n`;
        content += `С-расчет 3: ${sCalculation.sc3}\n`;
        content += `С-расчет 6: ${sCalculation.sc6}\n`;

        const fileName = `chakra-report-${new Date().toISOString().split('T')[0]}.txt`;
        ChakraUtils.downloadFile(content, fileName, 'text/plain');
    }

    printResults() {
        window.print();
    }
}

// Global functions for HTML onclick handlers
function calculateFromForm() {
    window.chakraApp.calculateFromForm();
}

function saveResults() {
    window.chakraApp.saveResults();
}

function exportToJSON() {
    window.chakraApp.exportToJSON();
}

function exportToTXT() {
    window.chakraApp.exportToTXT();
}

function printResults() {
    window.chakraApp.printResults();
}

// Download sample files
function downloadSampleJSON() {
    fileProcessor.createSampleFile('json');
}

function downloadSampleCSV() {
    fileProcessor.createSampleFile('csv');
}

function downloadSampleTXT() {
    fileProcessor.createSampleFile('txt');
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chakraApp = new ChakraApp();
});