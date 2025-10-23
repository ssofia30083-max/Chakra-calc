// Utility functions and constants
class ChakraUtils {
    // Precomputed letter mapping for better performance
    static LETTER_MAP = (() => {
        const map = {};
        const mappings = {
            "АИСЪ": 1, "БЙТЫ": 2, "ВКУЬ": 3, "ГЛФЭ": 4, "ДМХЮ": 5,
            "ЕНЦЯ": 6, "ЁОЧ": 7, "ЖПШ": 8, "ЗРЩ": 9
        };

        for (const [letters, value] of Object.entries(mappings)) {
            for (const letter of letters) {
                map[letter] = value;
            }
        }
        return map;
    })();

    // Optimized letter to number conversion
    static letterToNum(letter) {
        return this.LETTER_MAP[letter.toUpperCase()] || 0;
    }

    // Calculate sum with modulo 22
    static calculateSum(str, multiplier = 1) {
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (/[А-Яа-яЁё]/.test(char)) {
                sum += this.letterToNum(char) * multiplier;
            }
        }
        return sum % 22 || 22;
    }

    // Validation functions
    static validateInput(data) {
        const errors = [];

        if (!data.fam || !data.name || !data.otc) {
            errors.push("ФИО обязательно для заполнения");
        }

        if (!data.day || data.day < 1 || data.day > 31) {
            errors.push("День рождения должен быть от 1 до 31");
        }

        if (!data.month || data.month < 1 || data.month > 12) {
            errors.push("Месяц рождения должен быть от 1 до 12");
        }

        if (!data.year || data.year < 1900 || data.year > new Date().getFullYear()) {
            errors.push("Год рождения должен быть корректным");
        }

        return errors;
    }

    // Format number with leading zero
    static formatNumber(num) {
        return num < 10 ? `0${num}` : `${num}`;
    }

    // Show message to user
    static showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        document.querySelector('.container').prepend(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Download file
    static downloadFile(content, fileName, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// DOM utility functions
class DOMUtils {
    static getElement(id) {
        return document.getElementById(id);
    }

    static showElement(id) {
        const element = this.getElement(id);
        if (element) element.style.display = 'block';
    }

    static hideElement(id) {
        const element = this.getElement(id);
        if (element) element.style.display = 'none';
    }

    static setContent(id, content) {
        const element = this.getElement(id);
        if (element) element.innerHTML = content;
    }

    static enableButton(id) {
        const button = this.getElement(id);
        if (button) button.disabled = false;
    }

    static disableButton(id) {
        const button = this.getElement(id);
        if (button) button.disabled = true;
    }
}