# Copilot Instructions - Options Expiry Calculator

## Project Overview
This is a Brazilian financial web application that calculates options expiry dates and displays the corresponding call/put letters for each month. The app uses the third Friday rule for options expiry in Brazil.

## Architecture & Core Components

### File Structure
- `index.html`: Bootstrap-based UI with data bindings via element IDs
- `js/OptionCalculator.js`: Core business logic class for options calculations
- `js/app.js`: DOM manipulation and event handling
- `css/style.css`: Minimal custom styles (primarily Bootstrap-based)

### OOP Principles
- Encapsulation: Data and behavior are bundled within classes.
- Inheritance: Classes can inherit from one another, promoting code reuse.
- Polymorphism: Objects can be treated as instances of their parent class, allowing for flexible code.

### Key Design Patterns

**Single Responsibility Principle**: Each class and module has a distinct responsibility:
- `OptionCalculator` handles all calculations and business logic.
- `app.js` manages UI interactions and data binding.

**Class-based Architecture**: The `OptionCalculator` class encapsulates all business logic:
```javascript
const calculator = new OptionCalculator(today);
const expiryData = calculator.getExpiryData();
```

**Data-driven UI Updates**: Use specific element IDs for data binding:
- `current-month-name`, `call-letter`, `put-letter` for header info
- `current-month-days`, `next-month-days` for countdown display  
- `expiry-table-body` for dynamic table generation

**Brazilian Standards**: 
- Dates use `pt-BR` locale formatting
- Month names in Portuguese
- Business days exclude weekends only (no holiday handling)

## Critical Business Logic

### Options Letter Mapping
The `expiryLetters` object maps months (1-12) to standardized option letters:
- CALL letters: A-L (Jan-Dec)
- PUT letters: M-X (Jan-Dec)

### Expiry Date Calculation
Options expire on the third Friday of each month, calculated via `getThirdFridayOfMonth()`.

### Business Days Counting
`countBusinessDays()` excludes weekends but **does not account for Brazilian holidays** - this is a known limitation.

## Development Conventions

### Adding New Features
1. Extend `OptionCalculator` class for business logic
2. Add corresponding DOM elements with semantic IDs in `index.html`
3. Update `app.js` to bind new data to UI elements
4. Use Bootstrap classes for styling before custom CSS

### Styling Approach
- Leverage Bootstrap 5.3.3 utility classes (`fw-bold`, `fs-4`, etc.)
- Custom CSS in `style.css` is minimal and specific
- Special state styling: `.expiry-day` class for red highlighting on expiry days

### Date Handling
- Always pass Date objects to OptionCalculator constructor
- Use `toLocaleDateString('pt-BR')` for user-facing dates
- Business logic should handle month transitions and year boundaries

## Testing & Debugging
- Test around month boundaries (end of month scenarios)
- Verify third Friday calculations for edge cases
- Check business day counting across weekends
- Test with different Date objects passed to OptionCalculator

## Key Dependencies
- Bootstrap 5.3.3 (CDN) for UI framework
- Vanilla JavaScript (ES6+ class syntax)
- No build process or package manager required