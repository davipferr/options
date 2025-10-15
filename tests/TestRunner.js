/**
 * Framework simples para executar testes
 * Permite organizar e executar testes de forma sistemática
 */
class TestRunner {
  constructor() {
    this.results = [];
    this.currentSuite = "";
  }

  /**
   * Executa todos os testes de uma classe de teste
   */
  runAllTests(testClass) {
    this.results = [];
    const startTime = performance.now();

    // Busca todos os métodos que começam com 'test'
    const testMethods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(testClass)
    ).filter(
      (method) =>
        method.startsWith("test") && typeof testClass[method] === "function"
    );

    console.log(`🧪 Executando ${testMethods.length} testes...`);

    // Executa cada método de teste
    testMethods.forEach((methodName) => {
      try {
        console.log(`▶️ Executando: ${methodName}`);
        testClass[methodName]();
      } catch (error) {
        console.error(`❌ Erro no teste ${methodName}:`, error);
        this.addResult(methodName, false, error.message, "Erro de execução");
      }
    });

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    this.displayResults(duration);
  }

  /**
   * Adiciona resultado de um teste
   */
  addResult(testName, passed, message, suite = "") {
    this.results.push({
      testName: testName,
      passed: passed,
      message: message,
      suite: suite,
      timestamp: new Date().toLocaleTimeString("pt-BR"),
    });
  }

  /**
   * Função de assertion básica
   */
  assert(condition, message, testName, suite = "") {
    if (condition) {
      this.addResult(testName, true, message, suite);
      console.log(`✅ ${testName}: ${message}`);
    } else {
      this.addResult(testName, false, message, suite);
      console.log(`❌ ${testName}: ${message}`);
    }
  }

  /**
   * Assertion para igualdade
   */
  assertEqual(actual, expected, testName, suite = "") {
    const passed = actual === expected;
    const message = passed
      ? `Valores iguais: ${expected}`
      : `Esperado: ${expected}, Recebido: ${actual}`;

    this.addResult(testName, passed, message, suite);

    if (passed) {
      console.log(`✅ ${testName}: ${message}`);
    } else {
      console.log(`❌ ${testName}: ${message}`);
    }
  }

  /**
   * Assertion para igualdade profunda de objetos
   */
  assertDeepEqual(actual, expected, testName, suite = "") {
    const passed = JSON.stringify(actual) === JSON.stringify(expected);
    const message = passed
      ? `Objetos iguais`
      : `Esperado: ${JSON.stringify(expected)}, Recebido: ${JSON.stringify(
          actual
        )}`;

    this.addResult(testName, passed, message, suite);

    if (passed) {
      console.log(`✅ ${testName}: ${message}`);
    } else {
      console.log(`❌ ${testName}: ${message}`);
    }
  }

  /**
   * Assertion para valores aproximados (útil para datas)
   */
  assertDateEqual(actual, expected, testName, suite = "") {
    const actualStr = actual.toDateString();
    const expectedStr = expected.toDateString();
    const passed = actualStr === expectedStr;

    const message = passed
      ? `Datas iguais: ${expectedStr}`
      : `Esperado: ${expectedStr}, Recebido: ${actualStr}`;

    this.addResult(testName, passed, message, suite);

    if (passed) {
      console.log(`✅ ${testName}: ${message}`);
    } else {
      console.log(`❌ ${testName}: ${message}`);
    }
  }

  /**
   * Exibe os resultados na tela
   */
  displayResults(duration) {
    const passedTests = this.results.filter((r) => r.passed).length;
    const totalTests = this.results.length;
    const failedTests = totalTests - passedTests;

    // Atualiza o resumo
    const summaryElement = document.getElementById("summary-content");
    const isAllPassed = failedTests === 0;

    summaryElement.innerHTML = `
            <div class="${isAllPassed ? "test-pass" : "test-fail"}">
                📊 <strong>Resumo dos Testes:</strong> 
                ${passedTests}/${totalTests} testes passaram 
                ${failedTests > 0 ? `| ${failedTests} falharam` : ""} 
                | Executado em ${duration}ms
            </div>
        `;

    // Agrupa resultados por suite
    const groupedResults = this.groupResultsBySuite();

    // Gera HTML dos resultados
    let html = "";
    Object.keys(groupedResults).forEach((suite) => {
      const suiteResults = groupedResults[suite];
      const suitePassed = suiteResults.filter((r) => r.passed).length;
      const suiteTotal = suiteResults.length;

      html += `
                <div class="test-group">
                    <h4>${suite} (${suitePassed}/${suiteTotal})</h4>
                    ${suiteResults
                      .map(
                        (result) => `
                        <div class="test-case ${
                          result.passed ? "test-pass" : "test-fail"
                        } p-2 mb-2 rounded">
                            <strong>${result.passed ? "✅" : "❌"} ${
                          result.testName
                        }</strong>
                            <br><small>${result.message}</small>
                            <br><small class="text-muted">⏰ ${
                              result.timestamp
                            }</small>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;
    });

    document.getElementById("test-results").innerHTML = html;

    // Scroll para os resultados
    document
      .getElementById("test-results")
      .scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Agrupa resultados por suite
   */
  groupResultsBySuite() {
    const grouped = {};
    this.results.forEach((result) => {
      const suite = result.suite || "Testes Gerais";
      if (!grouped[suite]) {
        grouped[suite] = [];
      }
      grouped[suite].push(result);
    });
    return grouped;
  }

  /**
   * Limpa os resultados da tela
   */
  clearResults() {
    this.results = [];
    document.getElementById("test-results").innerHTML = "";
    document.getElementById("summary-content").innerHTML =
      "Pronto para executar testes...";
    console.clear();
    console.log("🧹 Resultados dos testes limpos");
  }
}
