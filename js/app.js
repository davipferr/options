document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const calculator = new OptionCalculator(today);

  // Inicializar a primeira aba (Informações Atuais)
  initCurrentInfoTab(calculator);

  // Inicializar a segunda aba (Análise por Data)
  initDateAnalysisTab(calculator);
});

// Função auxiliar para formatação correta do plural/singular
function formatBusinessDays(days) {
  if (days === 1) {
    return "1 dia útil";
  } else {
    return `${days} dias úteis`;
  }
}

// Função para inicializar a aba de Informações Atuais
function initCurrentInfoTab(calculator) {
  const expiryData = calculator.getExpiryData();

  document.getElementById("current-month-name").textContent =
    expiryData.currentMonthName.charAt(0).toUpperCase() +
    expiryData.currentMonthName.slice(1);
  document.getElementById("call-letter").textContent =
    expiryData.currentMonthLetters.call;
  document.getElementById("put-letter").textContent =
    expiryData.currentMonthLetters.put;

  const currentDaysElement = document.getElementById("current-month-days");
  const nextDaysElement = document.getElementById("next-month-days");

  if (expiryData.isCurrentExpiryToday) {
    currentDaysElement.textContent = "Dia do vencimento";
    currentDaysElement.className = "fw-bold expiry-day";
  } else if (expiryData.daysToCurrentExpiry < 0) {
    currentDaysElement.textContent = "Opções Vencidas";
    currentDaysElement.className = "fw-bold text-muted";
  } else {
    currentDaysElement.textContent = formatBusinessDays(
      expiryData.daysToCurrentExpiry
    );
    currentDaysElement.className = "fw-bold";
  }

  if (expiryData.isNextExpiryToday) {
    nextDaysElement.textContent = "Dia do vencimento";
    nextDaysElement.className = "fw-bold expiry-day";
  } else if (expiryData.daysToNextExpiry < 0) {
    nextDaysElement.textContent = "Opções Vencidas";
    nextDaysElement.className = "fw-bold text-muted";
  } else {
    nextDaysElement.textContent = formatBusinessDays(
      expiryData.daysToNextExpiry
    );
    nextDaysElement.className = "fw-bold";
  }

  document.getElementById("current-month-expiry-date").textContent =
    expiryData.currentMonthExpiryDate;
  document.getElementById("next-month-expiry-date").textContent =
    expiryData.nextMonthExpiryDate;

  const tableBody = document.getElementById("expiry-table-body");
  const fullTable = calculator.getFullExpiryTable();

  fullTable.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.monthName}</td>
            <td>${item.call}</td>
            <td>${item.put}</td>
        `;
    tableBody.appendChild(row);
  });
}

// Função para inicializar a aba de Análise por Data
function initDateAnalysisTab(calculator) {
  const analysisDateInput = document.getElementById("analysis-date");
  const analyzeButton = document.getElementById("analyze-button");
  const resultsDiv = document.getElementById("analysis-results");

  // Definir data padrão como hoje
  const today = new Date();
  analysisDateInput.value = today.toISOString().split("T")[0];

  // Event listener para o botão de análise
  analyzeButton.addEventListener("click", () => {
    const selectedDate = analysisDateInput.value;

    if (!selectedDate) {
      alert("Por favor, selecione uma data para análise.");
      return;
    }

    performDateAnalysis(calculator, selectedDate);
  });

  // Event listener para análise automática quando a data muda
  analysisDateInput.addEventListener("change", () => {
    const selectedDate = analysisDateInput.value;
    if (selectedDate) {
      performDateAnalysis(calculator, selectedDate);
    }
  });

  // Executar análise inicial com a data de hoje
  performDateAnalysis(calculator, analysisDateInput.value);
}

// Função para executar a análise baseada na data selecionada
function performDateAnalysis(calculator, selectedDate) {
  try {
    // Criar data corretamente para evitar problemas de fuso horário
    const [year, month, day] = selectedDate.split("-").map(Number);
    const analysisDate = new Date(year, month - 1, day);

    const analysisData = calculator.getExpiryDataForDate(analysisDate);

    // Mostrar os resultados
    displayAnalysisResults(analysisData);

    // Mostrar a div de resultados
    const resultsDiv = document.getElementById("analysis-results");
    resultsDiv.classList.remove("d-none");

    // Scroll suave para os resultados
    resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Erro na análise:", error);
    alert("Erro ao processar a data selecionada. Por favor, tente novamente.");
  }
}

// Função para mostrar os resultados da análise
function displayAnalysisResults(analysisData) {
  document.getElementById("selected-date-display").textContent =
    analysisData.selectedDate;
  document.getElementById("selected-month-name").textContent =
    analysisData.currentMonthName.charAt(0).toUpperCase() +
    analysisData.currentMonthName.slice(1);
  document.getElementById("selected-call-letter").textContent =
    analysisData.currentMonthLetters.call;
  document.getElementById("selected-put-letter").textContent =
    analysisData.currentMonthLetters.put;

  const currentDaysAnalysisElement = document.getElementById(
    "analysis-current-days"
  );
  const nextDaysAnalysisElement = document.getElementById("analysis-next-days");

  if (analysisData.isCurrentExpiryToday) {
    currentDaysAnalysisElement.textContent = "Dia do vencimento!";
    currentDaysAnalysisElement.className = "fw-bold text-danger";
  } else if (analysisData.daysToCurrentExpiry < 0) {
    currentDaysAnalysisElement.textContent = "Opções Vencidas";
    currentDaysAnalysisElement.className = "fw-bold text-muted";
  } else {
    currentDaysAnalysisElement.textContent = formatBusinessDays(
      analysisData.daysToCurrentExpiry
    );
    currentDaysAnalysisElement.className = "fw-bold text-primary";
  }

  if (analysisData.isNextExpiryToday) {
    nextDaysAnalysisElement.textContent = "Dia do vencimento!";
    nextDaysAnalysisElement.className = "fw-bold text-danger";
  } else if (analysisData.daysToNextExpiry < 0) {
    nextDaysAnalysisElement.textContent = "Opções Vencidas";
    nextDaysAnalysisElement.className = "fw-bold text-muted";
  } else {
    nextDaysAnalysisElement.textContent = formatBusinessDays(
      analysisData.daysToNextExpiry
    );
    nextDaysAnalysisElement.className = "fw-bold text-success";
  }

  document.getElementById("analysis-current-date").textContent =
    analysisData.currentMonthExpiryDate;
  document.getElementById("analysis-next-date").textContent =
    analysisData.nextMonthExpiryDate;
}
