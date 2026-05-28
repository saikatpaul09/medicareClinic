# Follow folder structure convention as given below

The casing of your files often depends on what they contain:

# React Components (PascalCase):

Standard practice is to name files that export a React component using PascalCase, matching the component name exactly (e.g., ProductCard.jsx). This helps distinguish components from native HTML elements in your IDE.

# Hooks

(camelCase with use prefix): Custom hooks should always start with "use" and follow camelCase (e.g., useLocalStorage.js).Utility & Logic Files (camelCase): Files containing helper functions, API services, or general logic usually follow camelCase (e.g., formatDate.ts or authService.js).

# Styles

(PascalCase or kebab-case):If using CSS Modules, name them to match the component: ProductCard.module.css.General global stylesheets often use kebab-case: main-styles.css.

# Tests

(.test or .spec suffix): Test files should match the component name with a suffix: ProductCard.test.jsx.2. Folder Naming & Structure.

# Folder Naming & Structure:

# Folder Casing:

Folders act as the backbone of your project’s organization.
Prefer kebab-case for directories (e.g., user-profile/) because it is URL-friendly and prevents case-sensitivity issues across different operating systems like Linux and Windows
