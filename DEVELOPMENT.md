# 🛠️ Utvecklingsguide

## 📦 NPM-kommandon

### Grundläggande
```bash
# Installera alla dependencies
npm install

# Starta utvecklingsserver
npm run dev

# Bygg för produktion
npm run build

# Förhandsgranska produktion-build
npm run preview

# Linta koden
npm run lint
```

### Nyttiga kommandon
```bash
# Installera specifik package
npm install <package-name>

# Installera dev dependency
npm install -D <package-name>

# Uppdatera dependencies
npm update

# Kontrollera säkerhetsbrister
npm audit

# Fixa säkerhetsbrister
npm audit fix
```

## 🏗️ Projektstruktur - När du skapar nya filer

### Ny komponent
```bash
# Skapa en ny UI-komponent
src/components/ui/MyComponent.jsx

# Skapa en domän-specifik komponent
src/components/drinks/MyDrinkComponent.jsx
src/components/ingredients/MyIngredientComponent.jsx
```

Template:
```jsx
// src/components/ui/MyComponent.jsx
import { cn } from '../../lib/utils'

export default function MyComponent({ className, ...props }) {
  return (
    <div className={cn('base-classes', className)} {...props}>
      {/* Content */}
    </div>
  )
}
```

### Ny sida
```bash
# Skapa en ny sida
src/pages/MyPage.jsx
```

Template:
```jsx
// src/pages/MyPage.jsx
import { useEffect } from 'react'
import Button from '../components/ui/Button'
import Loading from '../components/ui/Loading'

export default function MyPage() {
  // Hooks här
  
  // Effects här
  
  // Event handlers här
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Page</h1>
      {/* Content */}
    </div>
  )
}
```

### Ny API-funktion
```bash
# Lägg till i befintlig fil
src/lib/api/drinks.js
src/lib/api/ingredients.js

# Eller skapa ny fil
src/lib/api/myFeature.js
```

Template:
```javascript
// src/lib/api/myFeature.js
import { supabase } from '../supabase'

export async function getMyData() {
  try {
    const { data, error } = await supabase
      .from('my_table')
      .select('*')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
```

### Ny hook
```bash
# Skapa ny hook-fil
src/hooks/useMyFeature.js
```

Template:
```javascript
// src/hooks/useMyFeature.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as myApi from '../lib/api/myFeature'

export function useMyData() {
  return useQuery({
    queryKey: ['myData'],
    queryFn: myApi.getMyData,
  })
}

export function useCreateMyData() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: myApi.createMyData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myData'] })
    },
  })
}
```

## 🎨 Styling Guidelines

### Tailwind CSS Classes
```jsx
// Använd Tailwind utility classes
<div className="bg-white rounded-lg shadow-md p-6">

// Konditionella classes med cn() helper
<button className={cn(
  'px-4 py-2 rounded',
  isActive ? 'bg-blue-500' : 'bg-gray-200'
)}>

// Responsiv design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Custom CSS (undvik om möjligt)
```css
/* src/index.css */
@layer components {
  .my-custom-class {
    @apply bg-white rounded-lg p-4;
  }
}
```

## 🔍 Debugging Tips

### Chrome DevTools
```javascript
// Console logging
console.log('Data:', data)
console.table(arrayOfObjects)
console.error('Error:', error)

// Debugger
debugger; // Stoppar exekvering här
```

### React Developer Tools
1. Installera React DevTools extension
2. Öppna DevTools → Components tab
3. Inspektera component state och props

### Network Tab
- Inspektera API-anrop till Supabase
- Kontrollera request/response data
- Testa offline-beteende

## 📊 Supabase Management

### Via Dashboard
```
1. Gå till https://app.supabase.com
2. Välj ditt projekt
3. Använd SQL Editor för queries
4. Storage för att se uppladdade bilder
5. Table Editor för att se/redigera data
```

### Via SQL
```sql
-- Se alla drinkar
SELECT * FROM drinks;

-- Se alla ingredienser i Min Bar
SELECT * FROM ingredients WHERE has_at_home = true;

-- Räkna antal drinkar per spritbas
SELECT spritbas, COUNT(*) 
FROM drinks 
GROUP BY spritbas 
ORDER BY COUNT(*) DESC;

-- Hitta drinkar med specifik ingrediens
SELECT d.name 
FROM drinks d
JOIN drink_ingredients di ON d.id = di.drink_id
WHERE di.ingredient_name ILIKE '%gin%';
```

## 🔧 Environment Variables

### Development (.env)
```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=local-dev-key
```

### Production (.env.production)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=production-anon-key
```

### Använda i kod
```javascript
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## 🐛 Vanliga Problem & Lösningar

### Problem: Dependency conflicts
```bash
# Radera node_modules och package-lock.json
rm -rf node_modules package-lock.json

# Installera om
npm install
```

### Problem: Port redan används
```bash
# Ändra port i package.json
"dev": "vite --port 3001"
```

### Problem: Supabase connection error
```javascript
// Kontrollera environment variables
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

// Testa connection
const { data, error } = await supabase.from('drinks').select('count')
console.log('Connection test:', { data, error })
```

### Problem: React Query cache issues
```javascript
// Rensa all cache
queryClient.clear()

// Invalidera specifik query
queryClient.invalidateQueries({ queryKey: ['drinks'] })

// Force refetch
queryClient.refetchQueries({ queryKey: ['drinks'] })
```

## 🚀 Deployment Checklist

### Före deployment
- [ ] Testa alla funktioner lokalt
- [ ] Kör `npm run build` utan errors
- [ ] Testa production build (`npm run preview`)
- [ ] Uppdatera environment variables
- [ ] Kontrollera Supabase RLS policies
- [ ] Testa på olika enheter
- [ ] Verifiera bilduppladdning fungerar
- [ ] Testa offline-beteende

### Deployment till Vercel
```bash
# Installera Vercel CLI
npm i -g vercel

# Logga in
vercel login

# Deploya
vercel

# Konfigurera environment variables i Vercel dashboard
# Project → Settings → Environment Variables
```

### Deployment till Netlify
```bash
# Installera Netlify CLI
npm i -g netlify-cli

# Logga in
netlify login

# Deploya
netlify deploy --prod

# Konfigurera environment variables i Netlify dashboard
# Site → Site settings → Build & deploy → Environment
```

## 📚 Kodstandard

### Naming Conventions
```javascript
// Components: PascalCase
MyComponent.jsx

// Functions: camelCase
function fetchUserData() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3

// Files: PascalCase för komponenter, camelCase för utilities
DrinkCard.jsx
utils.js
```

### Import Order
```javascript
// 1. External libraries
import React from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal libraries
import { supabase } from '../lib/supabase'

// 3. Components
import Button from '../components/ui/Button'

// 4. Utils and constants
import { cn } from '../lib/utils'
```

### Code Organization
```javascript
// 1. Imports
// 2. Constants
// 3. Component definition
// 4. PropTypes/TypeScript types
// 5. Export
```

## 🧪 Testing (framtida)

### Unit Tests
```bash
# Installera testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Kör tests
npm test
```

### E2E Tests
```bash
# Installera Playwright
npm install -D @playwright/test

# Kör E2E tests
npx playwright test
```

## 📝 Git Workflow

### Branches
```bash
# Skapa ny feature branch
git checkout -b feature/my-feature

# Skapa bugfix branch
git checkout -b fix/my-bugfix

# Gå tillbaka till main
git checkout main
```

### Commits
```bash
# Good commit messages
git commit -m "feat: add drink detail page"
git commit -m "fix: correct image upload issue"
git commit -m "docs: update README"

# Commit types
# feat: ny funktion
# fix: buggfix
# docs: dokumentation
# style: formattering
# refactor: kod-refactoring
# test: tester
# chore: maintenance
```

## 🎯 Performance Tips

### Optimering
```javascript
// Lazy load komponenter
const DrinkDetailPage = lazy(() => import('./pages/DrinkDetailPage'))

// Memoize expensive calculations
const expensiveValue = useMemo(() => 
  computeExpensiveValue(data), 
  [data]
)

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])

// Optimera bilder
// Använd WebP format
// Komprimera innan uppladdning
// Lazy load images
```

### React Query Optimering
```javascript
// Stale time - hur länge data är "färsk"
staleTime: 5 * 60 * 1000, // 5 minuter

// Cache time - hur länge inaktiv data cachas
cacheTime: 10 * 60 * 1000, // 10 minuter

// Prefetch data
queryClient.prefetchQuery({
  queryKey: ['drinks'],
  queryFn: getDrinks,
})
```

## 🎨 UI/UX Best Practices

### Loading States
```jsx
// Visa loading när data hämtas
{isLoading && <Loading />}

// Skeleton loading för bättre UX
<Skeleton className="h-20 w-full" />
```

### Error Handling
```jsx
// Visa errors användarvänligt
{error && (
  <div className="bg-red-50 text-red-800 p-4 rounded">
    Ett fel uppstod: {error.message}
  </div>
)}
```

### Success Feedback
```jsx
// Toast notifications för feedback
toast.success('Drink sparad!')
toast.error('Något gick fel')
```

## 💡 Pro Tips

1. **Hot reload**: Ändra kod och se resultat direkt
2. **Browser DevTools**: Din bästa vän för debugging
3. **React DevTools**: Inspektera component state
4. **Supabase Dashboard**: Testa queries direkt
5. **Git commit ofta**: Små, frekventa commits
6. **Kommentera komplex logik**: Hjälper framtida dig
7. **Testa responsivt**: Mobil, tablet, desktop
8. **Accessibility**: Använd semantisk HTML
9. **Performance**: Lazy load, code splitting
10. **Security**: Aldrig commita .env filer

---

**Happy coding! 🚀**
