class OptionCalculator {
  constructor(date) {
    this.today = date;
    this.expiryLetters = {
      1: { call: "A", put: "M" },
      2: { call: "B", put: "N" },
      3: { call: "C", put: "O" },
      4: { call: "D", put: "P" },
      5: { call: "E", put: "Q" },
      6: { call: "F", put: "R" },
      7: { call: "G", put: "S" },
      8: { call: "H", put: "T" },
      9: { call: "I", put: "U" },
      10: { call: "J", put: "V" },
      11: { call: "K", put: "W" },
      12: { call: "L", put: "X" },
    };
  }

  getOptionLettersForMonth(month) {
    return this.expiryLetters[month];
  }

  getThirdFridayOfMonth(year, month) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    let firstFriday = 1 + ((5 - dayOfWeek + 7) % 7);
    const thirdFriday = firstFriday + 14;
    return new Date(year, month - 1, thirdFriday);
  }

  countBusinessDays(startDate, endDate) {
    const normalizedStartDate = new Date(startDate.getTime());
    normalizedStartDate.setHours(0, 0, 0, 0);

    const normalizedEndDate = new Date(endDate.getTime());
    normalizedEndDate.setHours(0, 0, 0, 0);

    // Se a data de início é depois da data de fim, retornamos negativo
    if (normalizedStartDate.getTime() > normalizedEndDate.getTime()) {
      const negativeDays = this.countBusinessDaysPositive(endDate, startDate);
      return negativeDays === 0 ? -1 : -negativeDays;
    }

    return this.countBusinessDaysPositive(startDate, endDate);
  }
  countBusinessDaysPositive(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate.getTime());

    curDate.setDate(curDate.getDate() + 1);
    curDate.setHours(0, 0, 0, 0);

    const normalizedEndDate = new Date(endDate.getTime());
    normalizedEndDate.setHours(0, 0, 0, 0);

    while (curDate.getTime() <= normalizedEndDate.getTime()) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    return count;
  }

  getExpiryData() {
    const currentMonth = this.today.getMonth() + 1;
    const currentYear = this.today.getFullYear();

    const nextMonthDate = new Date(this.today);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonth = nextMonthDate.getMonth() + 1;
    const nextMonthYear = nextMonthDate.getFullYear();

    const currentMonthLetters = this.getOptionLettersForMonth(currentMonth);

    const currentMonthExpiry = this.getThirdFridayOfMonth(
      currentYear,
      currentMonth
    );
    const nextMonthExpiry = this.getThirdFridayOfMonth(
      nextMonthYear,
      nextMonth
    );

    const daysToCurrentExpiry = this.countBusinessDays(
      this.today,
      currentMonthExpiry
    );
    const daysToNextExpiry = this.countBusinessDays(
      this.today,
      nextMonthExpiry
    );

    const isCurrentExpiryToday =
      this.today.toDateString() === currentMonthExpiry.toDateString();
    const isNextExpiryToday =
      this.today.toDateString() === nextMonthExpiry.toDateString();

    return {
      currentMonthName: this.today.toLocaleString("pt-BR", { month: "long" }),
      currentMonthLetters,
      daysToCurrentExpiry,
      daysToNextExpiry,
      currentMonthExpiryDate: currentMonthExpiry.toLocaleDateString("pt-BR"),
      nextMonthExpiryDate: nextMonthExpiry.toLocaleDateString("pt-BR"),
      isCurrentExpiryToday,
      isNextExpiryToday,
    };
  }

  getFullExpiryTable() {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return Object.entries(this.expiryLetters).map(([monthNum, letters]) => {
      return {
        monthName: monthNames[monthNum - 1],
        call: letters.call,
        put: letters.put,
      };
    });
  }

  // Método para análise baseada em data customizada
  getExpiryDataForDate(selectedDate) {
    const analysisDate = new Date(selectedDate);
    const currentMonth = analysisDate.getMonth() + 1;
    const currentYear = analysisDate.getFullYear();

    const nextMonthDate = new Date(analysisDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonth = nextMonthDate.getMonth() + 1;
    const nextMonthYear = nextMonthDate.getFullYear();

    const currentMonthLetters = this.getOptionLettersForMonth(currentMonth);

    const currentMonthExpiry = this.getThirdFridayOfMonth(
      currentYear,
      currentMonth
    );
    const nextMonthExpiry = this.getThirdFridayOfMonth(
      nextMonthYear,
      nextMonth
    );

    const daysToCurrentExpiry = this.countBusinessDays(
      analysisDate,
      currentMonthExpiry
    );
    const daysToNextExpiry = this.countBusinessDays(
      analysisDate,
      nextMonthExpiry
    );

    const isCurrentExpiryToday =
      analysisDate.toDateString() === currentMonthExpiry.toDateString();
    const isNextExpiryToday =
      analysisDate.toDateString() === nextMonthExpiry.toDateString();

    return {
      selectedDate: analysisDate.toLocaleDateString("pt-BR"),
      currentMonthName: analysisDate.toLocaleString("pt-BR", { month: "long" }),
      currentMonthLetters,
      daysToCurrentExpiry,
      daysToNextExpiry,
      currentMonthExpiryDate: currentMonthExpiry.toLocaleDateString("pt-BR"),
      nextMonthExpiryDate: nextMonthExpiry.toLocaleDateString("pt-BR"),
      isCurrentExpiryToday,
      isNextExpiryToday,
    };
  }
}
