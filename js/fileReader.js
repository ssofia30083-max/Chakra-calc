// File reading and parsing functionality
class FileProcessor {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.fileName = document.getElementById('fileName');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.fileInput.addEventListener('change', (event) => {
            this.handleFileSelect(event);
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.fileName.textContent = file.name;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const data = this.parseFile(content, file.name);
                this.fillFormWithData(data);
                ChakraUtils.showMessage('Файл успешно загружен!', 'success');
            } catch (error) {
                ChakraUtils.showMessage(`Ошибка чтения файла: ${error.message}`, 'error');
            }
        };

        reader.onerror = () => {
            ChakraUtils.showMessage('Ошибка при чтении файла', 'error');
        };

        reader.readAsText(file);
    }

    parseFile(content, fileName) {
        const extension = fileName.split('.').pop().toLowerCase();

        switch (extension) {
            case 'json':
                return this.parseJSON(content);
            case 'csv':
                return this.parseCSV(content);
            case 'txt':
                return this.parseTXT(content);
            default:
                throw new Error('Неподдерживаемый формат файла');
        }
    }

    parseJSON(content) {
        try {
            const data = JSON.parse(content);
            return this.validateParsedData(data);
        } catch (error) {
            throw new Error('Неверный формат JSON');
        }
    }

    parseCSV(content) {
        try {
            const lines = content.split('\n');
            if (lines.length < 2) throw new Error('Недостаточно данных в CSV');

            const headers = lines[0].split(',').map(h => h.trim());
            const values = lines[1].split(',').map(v => v.trim());

            const data = {};
            headers.forEach((header, index) => {
                if (values[index]) {
                    data[header] = isNaN(values[index]) ? values[index] : parseInt(values[index]);
                }
            });

            return this.validateParsedData(data);
        } catch (error) {
            throw new Error('Неверный формат CSV');
        }
    }

    parseTXT(content) {
        try {
            const lines = content.split('\n');
            const data = {};

            lines.forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join(':').trim();
                    data[key.trim().toLowerCase()] = isNaN(value) ? value : parseInt(value);
                }
            });

            return this.validateParsedData(data);
        } catch (error) {
            throw new Error('Неверный формат TXT');
        }
    }

    validateParsedData(data) {
        const requiredFields = ['fam', 'name', 'otc', 'day', 'month', 'year'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            throw new Error(`Отсутствуют поля: ${missingFields.join(', ')}`);
        }

        return data;
    }

    fillFormWithData(data) {
        DOMUtils.getElement('fam').value = data.fam || '';
        DOMUtils.getElement('name').value = data.name || '';
        DOMUtils.getElement('otc').value = data.otc || '';
        DOMUtils.getElement('day').value = data.day || '';
        DOMUtils.getElement('month').value = data.month || '';
        DOMUtils.getElement('year').value = data.year || '';
    }

    // Create sample files for download
    createSampleFile(type) {
        const sampleData = {
            fam: "Иванов",
            name: "Иван",
            otc: "Петрович",
            day: 15,
            month: 7,
            year: 1990
        };

        let content, fileName, contentType;

        switch (type) {
            case 'json':
                content = JSON.stringify(sampleData, null, 2);
                fileName = 'sample-data.json';
                contentType = 'application/json';
                break;
            case 'csv':
                content = 'fam,name,otc,day,month,year\nИванов,Иван,Петрович,15,7,1990';
                fileName = 'sample-data.csv';
                contentType = 'text/csv';
                break;
            case 'txt':
                content = `Фамилия: Иванов\nИмя: Иван\nОтчество: Петрович\nДень: 15\nМесяц: 7\nГод: 1990`;
                fileName = 'sample-data.txt';
                contentType = 'text/plain';
                break;
        }

        ChakraUtils.downloadFile(content, fileName, contentType);
    }
}

// Initialize file processor
const fileProcessor = new FileProcessor();