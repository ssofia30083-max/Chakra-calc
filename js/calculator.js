// Main calculator class
class ChakraCalculator {
    constructor() {
        this.results = null;
    }

    calculate(data) {
        try {
            const { fam, name, otc, day, month, year } = data;

            // Main chakras calculation
            const c1 = ChakraUtils.calculateSum(fam);
            const c2 = ChakraUtils.calculateSum(name);
            const c3 = ChakraUtils.calculateSum(otc);
            const c4 = month;
            const c5 = year.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0) % 22 || 22;
            const c6 = (day + c1 + c2 + c3) % 22 || 22;
            const c7 = (c1 + c2 + c3 + c4 + c5 + c6) % 22 || 22;

            // S-calculation
            const sc1 = ChakraUtils.calculateSum(fam, 1);
            const sc2 = ChakraUtils.calculateSum(name, 2);
            const sc3 = ChakraUtils.calculateSum(otc, 3);
            const sc6 = (day + sc1 + sc2 + sc3) % 22 || 22;

            this.results = {
                basic: { c1, c2, c3, c4, c5, c6, c7 },
                sCalculation: { sc1, sc2, sc3, sc6 },
                input: data,
                timestamp: new Date().toISOString()
            };

            return this.results;

        } catch (error) {
            console.error('Calculation error:', error);
            throw new Error('Ошибка при расчете чакр');
        }
    }

    getResults() {
        return this.results;
    }

    generateReport() {
        if (!this.results) return null;

        const { basic, sCalculation, input } = this.results;

        return {
            title: "Отчет по расчету чакр",
            date: new Date().toLocaleDateString('ru-RU'),
            personalInfo: {
                fullName: `${input.fam} ${input.name} ${input.otc}`,
                birthDate: `${ChakraUtils.formatNumber(input.day)}.${ChakraUtils.formatNumber(input.month)}.${input.year}`
            },
            chakras: {
                basic: basic,
                sCalculation: sCalculation
            },
            interpretation: this.generateInterpretation()
        };
    }

    generateInterpretation() {
        // This can be expanded with actual chakra interpretations
        return {
            c1: "Муладхара - корневая чакра, отвечает за базовую энергию и выживание",
            c2: "Свадхистана - сакральная чакра, творчество и эмоции",
            c3: "Манипура - чакра солнечного сплетения, сила воли",
            c4: "Анахата - сердечная чакра, любовь и сострадание",
            c5: "Вишудха - горловая чакра, коммуникация",
            c6: "Аджна - третий глаз, интуиция",
            c7: "Сахасрара - коронная чакра, духовность"
        };
    }
}

// Global calculator instance
const chakraCalculator = new ChakraCalculator();