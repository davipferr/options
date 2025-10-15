/**
 * Testes para a classe OptionCalculator
 * Valida todas as regras de negócio da aplicação
 */
class OptionCalculatorTests {
  constructor() {
    this.testRunner = new TestRunner();
  }

  // ============================================
  // TESTES PARA MAPEAMENTO DE LETRAS DE OPÇÕES
  // ============================================

  testOptionLettersMapping() {
    const calculator = new OptionCalculator(new Date());

    // Testa letras CALL (A-L para Jan-Dez)
    const expectedCallLetters = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
    ];
    const expectedPutLetters = [
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
    ];

    for (let month = 1; month <= 12; month++) {
      const letters = calculator.getOptionLettersForMonth(month);

      this.testRunner.assertEqual(
        letters.call,
        expectedCallLetters[month - 1],
        `Letra CALL mês ${month}`,
        "Mapeamento de Letras"
      );

      this.testRunner.assertEqual(
        letters.put,
        expectedPutLetters[month - 1],
        `Letra PUT mês ${month}`,
        "Mapeamento de Letras"
      );
    }
  }

  testOptionLettersJaneiro() {
    const calculator = new OptionCalculator(new Date());
    const letters = calculator.getOptionLettersForMonth(1);

    this.testRunner.assertEqual(
      letters.call,
      "A",
      "Janeiro - CALL deve ser A",
      "Casos Específicos"
    );
    this.testRunner.assertEqual(
      letters.put,
      "M",
      "Janeiro - PUT deve ser M",
      "Casos Específicos"
    );
  }

  testOptionLettersDecember() {
    const calculator = new OptionCalculator(new Date());
    const letters = calculator.getOptionLettersForMonth(12);

    this.testRunner.assertEqual(
      letters.call,
      "L",
      "Dezembro - CALL deve ser L",
      "Casos Específicos"
    );
    this.testRunner.assertEqual(
      letters.put,
      "X",
      "Dezembro - PUT deve ser X",
      "Casos Específicos"
    );
  }

  // =============================================
  // TESTES PARA CÁLCULO DA TERCEIRA SEXTA-FEIRA
  // =============================================

  testThirdFridayCalculation2024() {
    const calculator = new OptionCalculator(new Date());

    // Testes para 2024 - datas conhecidas
    const testCases = [
      { year: 2024, month: 1, expectedDay: 19 }, // Janeiro 2024
      { year: 2024, month: 2, expectedDay: 16 }, // Fevereiro 2024
      { year: 2024, month: 3, expectedDay: 15 }, // Março 2024
      { year: 2024, month: 4, expectedDay: 19 }, // Abril 2024
      { year: 2024, month: 5, expectedDay: 17 }, // Maio 2024
      { year: 2024, month: 6, expectedDay: 21 }, // Junho 2024
      { year: 2024, month: 7, expectedDay: 19 }, // Julho 2024
      { year: 2024, month: 8, expectedDay: 16 }, // Agosto 2024
      { year: 2024, month: 9, expectedDay: 20 }, // Setembro 2024
      { year: 2024, month: 10, expectedDay: 18 }, // Outubro 2024
      { year: 2024, month: 11, expectedDay: 15 }, // Novembro 2024
      { year: 2024, month: 12, expectedDay: 20 }, // Dezembro 2024
    ];

    testCases.forEach((testCase) => {
      const result = calculator.getThirdFridayOfMonth(
        testCase.year,
        testCase.month
      );
      this.testRunner.assertEqual(
        result.getDate(),
        testCase.expectedDay,
        `Terceira sexta-feira ${testCase.month}/${testCase.year}`,
        "Cálculo Terceira Sexta-feira"
      );

      // Verifica se é realmente uma sexta-feira (getDay() === 5)
      this.testRunner.assertEqual(
        result.getDay(),
        5,
        `Dia da semana ${testCase.month}/${testCase.year} deve ser sexta-feira`,
        "Validação Dia da Semana"
      );
    });
  }

  testThirdFridayCalculation2025() {
    const calculator = new OptionCalculator(new Date());

    // Testes para 2025
    const testCases2025 = [
      { year: 2025, month: 1, expectedDay: 17 }, // Janeiro 2025
      { year: 2025, month: 2, expectedDay: 21 }, // Fevereiro 2025
      { year: 2025, month: 3, expectedDay: 21 }, // Março 2025
      { year: 2025, month: 4, expectedDay: 18 }, // Abril 2025
      { year: 2025, month: 5, expectedDay: 16 }, // Maio 2025
      { year: 2025, month: 6, expectedDay: 20 }, // Junho 2025
    ];

    testCases2025.forEach((testCase) => {
      const result = calculator.getThirdFridayOfMonth(
        testCase.year,
        testCase.month
      );
      this.testRunner.assertEqual(
        result.getDate(),
        testCase.expectedDay,
        `Terceira sexta-feira ${testCase.month}/${testCase.year}`,
        "Cálculo Terceira Sexta-feira 2025"
      );
    });
  }

  // ========================================
  // TESTES PARA CONTAGEM DE DIAS ÚTEIS
  // ========================================

  testBusinessDaysCountBasic() {
    const calculator = new OptionCalculator(new Date());

    // Segunda a sexta (5 dias úteis)
    const startMonday = new Date(2024, 0, 8); // 8 jan 2024 (segunda)
    const endFriday = new Date(2024, 0, 12); // 12 jan 2024 (sexta)

    const businessDays = calculator.countBusinessDays(startMonday, endFriday);
    this.testRunner.assertEqual(
      businessDays,
      4,
      "Segunda a sexta: 4 dias úteis",
      "Contagem Dias Úteis"
    );
  }

  testBusinessDaysCountWithWeekend() {
    const calculator = new OptionCalculator(new Date());

    // Sexta a segunda (através do final de semana)
    const startFriday = new Date(2024, 0, 5); // 5 jan 2024 (sexta)
    const endMonday = new Date(2024, 0, 8); // 8 jan 2024 (segunda)

    const businessDays = calculator.countBusinessDays(startFriday, endMonday);
    this.testRunner.assertEqual(
      businessDays,
      1,
      "Sexta a segunda: 1 dia útil",
      "Contagem Dias Úteis"
    );
  }

  testBusinessDaysCountSameDay() {
    const calculator = new OptionCalculator(new Date());

    // Mesmo dia
    const date = new Date(2024, 0, 8); // 8 jan 2024 (segunda)
    const businessDays = calculator.countBusinessDays(date, date);

    this.testRunner.assertEqual(
      businessDays,
      0,
      "Mesmo dia: 0 dias úteis",
      "Contagem Dias Úteis"
    );
  }

  testBusinessDaysCountNegative() {
    const calculator = new OptionCalculator(new Date());

    // Data fim antes da data início
    const startDate = new Date(2024, 0, 10); // 10 jan 2024
    const endDate = new Date(2024, 0, 8); // 8 jan 2024

    const businessDays = calculator.countBusinessDays(startDate, endDate);
    this.testRunner.assert(
      businessDays < 0,
      "Data fim anterior deve retornar negativo",
      "Contagem Dias Úteis"
    );
  }

  testBusinessDaysCountFullWeek() {
    const calculator = new OptionCalculator(new Date());

    // Uma semana completa (segunda a domingo)
    const startMonday = new Date(2025, 0, 8); // 8 jan 2025 (segunda)
    const endSunday = new Date(2025, 0, 14); // 14 jan 2025 (domingo)

    const businessDays = calculator.countBusinessDays(startMonday, endSunday);
    this.testRunner.assertEqual(
      businessDays,
      5,
      "Semana completa: 5 dias úteis",
      "Contagem Dias Úteis"
    );
  }

  // ======================================
  // TESTES PARA getExpiryData (CORE)
  // ======================================

  testGetExpiryDataCurrentMonth() {
    // Teste para o dia 10 de janeiro de 2024
    const testDate = new Date(2024, 0, 10); // 10 jan 2024 (quarta)
    const calculator = new OptionCalculator(testDate);

    const expiryData = calculator.getExpiryData();

    // Validações básicas
    this.testRunner.assertEqual(
      expiryData.currentMonthName,
      "janeiro",
      "Nome do mês atual",
      "Dados de Vencimento"
    );
    this.testRunner.assertEqual(
      expiryData.currentMonthLetters.call,
      "A",
      "Letra CALL Janeiro",
      "Dados de Vencimento"
    );
    this.testRunner.assertEqual(
      expiryData.currentMonthLetters.put,
      "M",
      "Letra PUT Janeiro",
      "Dados de Vencimento"
    );

    // O vencimento de janeiro 2024 é dia 19
    this.testRunner.assert(
      expiryData.daysToCurrentExpiry > 0,
      "Dias até vencimento deve ser positivo",
      "Dados de Vencimento"
    );
    this.testRunner.assert(
      !expiryData.isCurrentExpiryToday,
      "Não deve ser dia de vencimento",
      "Dados de Vencimento"
    );
  }

  testGetExpiryDataOnExpiryDay() {
    // Teste para o dia do vencimento (terceira sexta-feira)
    const expiryDate = new Date(2024, 0, 19); // 19 jan 2024 (terceira sexta-feira)
    const calculator = new OptionCalculator(expiryDate);

    const expiryData = calculator.getExpiryData();

    this.testRunner.assertEqual(
      expiryData.daysToCurrentExpiry,
      0,
      "Dias até vencimento deve ser 0",
      "Dia do Vencimento"
    );
    this.testRunner.assert(
      expiryData.isCurrentExpiryToday,
      "Deve ser dia de vencimento",
      "Dia do Vencimento"
    );
  }

  testGetExpiryDataAfterExpiry() {
    // Teste para depois do vencimento
    const afterExpiry = new Date(2024, 0, 22); // 22 jan 2024 (segunda após vencimento)
    const calculator = new OptionCalculator(afterExpiry);

    const expiryData = calculator.getExpiryData();

    this.testRunner.assert(
      expiryData.daysToCurrentExpiry < 0,
      "Dias até vencimento deve ser negativo",
      "Após Vencimento"
    );
    this.testRunner.assert(
      !expiryData.isCurrentExpiryToday,
      "Não deve ser dia de vencimento",
      "Após Vencimento"
    );
  }

  // =======================================
  // TESTES PARA CASOS EXTREMOS (EDGE CASES)
  // =======================================

  testYearTransition() {
    // Teste para transição de ano (dezembro para janeiro)
    const endOfYear = new Date(2023, 11, 15); // 15 dez 2023
    const calculator = new OptionCalculator(endOfYear);

    const expiryData = calculator.getExpiryData();

    this.testRunner.assertEqual(
      expiryData.currentMonthName,
      "dezembro",
      "Mês atual deve ser dezembro",
      "Transição de Ano"
    );
    this.testRunner.assertEqual(
      expiryData.currentMonthLetters.call,
      "L",
      "Letra CALL dezembro",
      "Transição de Ano"
    );

    // Próximo mês deve ser janeiro do ano seguinte
    this.testRunner.assert(
      expiryData.daysToNextExpiry > 0,
      "Deve ter dias para próximo vencimento",
      "Transição de Ano"
    );
  }

  testFebruaryLeapYear() {
    // Teste para ano bissexto
    const feb2024 = new Date(2024, 1, 10); // 10 fev 2024 (ano bissexto)
    const calculator = new OptionCalculator(feb2024);

    const thirdFriday = calculator.getThirdFridayOfMonth(2024, 2);
    this.testRunner.assertEqual(
      thirdFriday.getDate(),
      16,
      "Terceira sexta-feira fev 2024",
      "Ano Bissexto"
    );
    this.testRunner.assertEqual(
      thirdFriday.getDay(),
      5,
      "Deve ser sexta-feira",
      "Ano Bissexto"
    );
  }

  testFebruaryNonLeapYear() {
    // Teste para ano não bissexto
    const feb2023 = new Date(2023, 1, 10); // 10 fev 2023 (não bissexto)
    const calculator = new OptionCalculator(feb2023);

    const thirdFriday = calculator.getThirdFridayOfMonth(2023, 2);
    this.testRunner.assertEqual(
      thirdFriday.getDate(),
      17,
      "Terceira sexta-feira fev 2023",
      "Ano Não Bissexto"
    );
    this.testRunner.assertEqual(
      thirdFriday.getDay(),
      5,
      "Deve ser sexta-feira",
      "Ano Não Bissexto"
    );
  }

  testGetFullExpiryTable() {
    const calculator = new OptionCalculator(new Date());
    const table = calculator.getFullExpiryTable();

    this.testRunner.assertEqual(
      table.length,
      12,
      "Tabela deve ter 12 meses",
      "Tabela Completa"
    );

    // Verifica alguns meses específicos
    const janeiro = table[0];
    this.testRunner.assertEqual(
      janeiro.monthName,
      "Janeiro",
      "Primeiro mês deve ser Janeiro",
      "Tabela Completa"
    );
    this.testRunner.assertEqual(
      janeiro.call,
      "A",
      "Janeiro CALL deve ser A",
      "Tabela Completa"
    );
    this.testRunner.assertEqual(
      janeiro.put,
      "M",
      "Janeiro PUT deve ser M",
      "Tabela Completa"
    );

    const dezembro = table[11];
    this.testRunner.assertEqual(
      dezembro.monthName,
      "Dezembro",
      "Último mês deve ser Dezembro",
      "Tabela Completa"
    );
    this.testRunner.assertEqual(
      dezembro.call,
      "L",
      "Dezembro CALL deve ser L",
      "Tabela Completa"
    );
    this.testRunner.assertEqual(
      dezembro.put,
      "X",
      "Dezembro PUT deve ser X",
      "Tabela Completa"
    );
  }

  testGetExpiryDataForCustomDate() {
    const calculator = new OptionCalculator(new Date());

    // Testa análise para data específica
    const customDate = new Date(2024, 5, 10); // 10 jun 2024
    const expiryData = calculator.getExpiryDataForDate(customDate);

    this.testRunner.assertEqual(
      expiryData.currentMonthName,
      "junho",
      "Mês deve ser junho",
      "Data Customizada"
    );
    this.testRunner.assertEqual(
      expiryData.currentMonthLetters.call,
      "F",
      "Junho CALL deve ser F",
      "Data Customizada"
    );
    this.testRunner.assertEqual(
      expiryData.currentMonthLetters.put,
      "R",
      "Junho PUT deve ser R",
      "Data Customizada"
    );
    this.testRunner.assert(
      expiryData.selectedDate.includes("10/06/2024"),
      "Data selecionada deve estar correta",
      "Data Customizada"
    );
  }

  // =======================================
  // TESTES PARA VALIDAÇÃO DE INTEGRIDADE
  // =======================================

  testDataIntegrityAllMonths() {
    const calculator = new OptionCalculator(new Date());

    for (let year = 2023; year <= 2025; year++) {
      for (let month = 1; month <= 12; month++) {
        const thirdFriday = calculator.getThirdFridayOfMonth(year, month);

        // Verifica se é realmente uma sexta-feira
        this.testRunner.assertEqual(
          thirdFriday.getDay(),
          5,
          `${month}/${year} deve ser sexta-feira`,
          "Integridade Dados"
        );

        // Verifica se está no mês correto
        this.testRunner.assertEqual(
          thirdFriday.getMonth() + 1,
          month,
          `${month}/${year} deve estar no mês correto`,
          "Integridade Dados"
        );

        // Verifica se o dia está na faixa esperada (15-21)
        const day = thirdFriday.getDate();
        this.testRunner.assert(
          day >= 15 && day <= 21,
          `${month}/${year} terceira sexta deve estar entre dias 15-21`,
          "Integridade Dados"
        );
      }
    }
  }

  testBusinessDaysConsistency() {
    const calculator = new OptionCalculator(new Date());

    // Testa consistência da contagem de dias úteis
    const testCases = [
      { start: new Date(2024, 0, 1), end: new Date(2024, 0, 5) }, // 1-5 jan
      { start: new Date(2024, 0, 8), end: new Date(2024, 0, 12) }, // 8-12 jan
      { start: new Date(2024, 0, 15), end: new Date(2024, 0, 19) }, // 15-19 jan
    ];

    testCases.forEach((testCase, index) => {
      const days = calculator.countBusinessDays(testCase.start, testCase.end);
      const reverseDays = calculator.countBusinessDays(
        testCase.end,
        testCase.start
      );

      // A contagem reversa deve ser negativa da original
      this.testRunner.assertEqual(
        days,
        -reverseDays,
        `Caso ${index + 1}: Consistência bidirecional`,
        "Consistência Contagem"
      );
    });
  }

  // =======================================
  // TESTES ADICIONAIS ESPECÍFICOS
  // =======================================

  testCurrentDateScenario() {
    // Teste com a data atual do sistema
    const today = new Date();
    const calculator = new OptionCalculator(today);
    const expiryData = calculator.getExpiryData();

    // Validações básicas que devem sempre funcionar
    this.testRunner.assert(
      expiryData.currentMonthName && expiryData.currentMonthName.length > 0,
      "Nome do mês atual deve existir",
      "Cenário Data Atual"
    );

    this.testRunner.assert(
      expiryData.currentMonthLetters && expiryData.currentMonthLetters.call,
      "Letra CALL deve existir",
      "Cenário Data Atual"
    );

    this.testRunner.assert(
      expiryData.currentMonthLetters && expiryData.currentMonthLetters.put,
      "Letra PUT deve existir",
      "Cenário Data Atual"
    );

    this.testRunner.assert(
      typeof expiryData.daysToCurrentExpiry === "number",
      "Dias até vencimento deve ser um número",
      "Cenário Data Atual"
    );
  }

  testExtremeBusinessDaysCounts() {
    const calculator = new OptionCalculator(new Date());

    // Teste com período de um mês completo
    const startMonth = new Date(2024, 0, 1); // 1º janeiro 2024
    const endMonth = new Date(2024, 0, 31); // 31 janeiro 2024

    const monthlyBusinessDays = calculator.countBusinessDays(
      startMonth,
      endMonth
    );

    // Janeiro 2024 tem aproximadamente 23 dias úteis
    this.testRunner.assert(
      monthlyBusinessDays >= 20 && monthlyBusinessDays <= 25,
      `Dias úteis em janeiro/2024 deve estar entre 20-25, recebido: ${monthlyBusinessDays}`,
      "Contagem Período Longo"
    );
  }

  testOptionsLettersUniqueMapping() {
    const calculator = new OptionCalculator(new Date());
    const usedCallLetters = [];
    const usedPutLetters = [];

    // Verifica se não há letras duplicadas
    for (let month = 1; month <= 12; month++) {
      const letters = calculator.getOptionLettersForMonth(month);

      this.testRunner.assert(
        !usedCallLetters.includes(letters.call),
        `Letra CALL ${letters.call} deve ser única (mês ${month})`,
        "Unicidade Letras"
      );

      this.testRunner.assert(
        !usedPutLetters.includes(letters.put),
        `Letra PUT ${letters.put} deve ser única (mês ${month})`,
        "Unicidade Letras"
      );

      usedCallLetters.push(letters.call);
      usedPutLetters.push(letters.put);
    }
  }

  testBusinessDaysWithSameDayOfWeek() {
    const calculator = new OptionCalculator(new Date());

    // Testa de segunda para próxima segunda (1 semana)
    const monday1 = new Date(2024, 0, 8); // Segunda-feira
    const monday2 = new Date(2024, 0, 15); // Próxima segunda-feira

    const weekBusinessDays = calculator.countBusinessDays(monday1, monday2);
    this.testRunner.assertEqual(
      weekBusinessDays,
      5,
      "Uma semana deve ter 5 dias úteis",
      "Contagem Semanal"
    );
  }

  testThirdFridayValidationAcrossYears() {
    const calculator = new OptionCalculator(new Date());

    // Testa múltiplos anos para garantir consistência
    const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

    years.forEach((year) => {
      for (let month = 1; month <= 12; month++) {
        const thirdFriday = calculator.getThirdFridayOfMonth(year, month);

        // Verifica se é realmente sexta-feira
        this.testRunner.assertEqual(
          thirdFriday.getDay(),
          5,
          `${month}/${year} deve ser sexta-feira`,
          `Validação Multi-Anos ${year}`
        );

        // Verifica se está na terceira semana (dia 15-21)
        const day = thirdFriday.getDate();
        this.testRunner.assert(
          day >= 15 && day <= 21,
          `${month}/${year} terceira sexta deve estar entre 15-21, recebido: ${day}`,
          `Validação Multi-Anos ${year}`
        );
      }
    });
  }
}
