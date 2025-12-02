# 📁 Drinkar Web App - Projektöversikt

## 🎯 Vad är det här?

Detta är en komplett omskrivning av din iOS SwiftUI drink-app till en modern React-webbapplikation med Supabase som backend. Appen låter dig hantera cocktails, ingredienser och hålla koll på vad du kan mixa hemma.

## 🏗️ Arkitektur

```
React Frontend (Vite + React 18)
    ↓
React Query (Data fetching & caching)
    ↓
Supabase Client
    ↓
Supabase Backend (PostgreSQL + Storage)
```

## 📂 Komplett filstruktur

```
drinkar-web/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & scripts
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── postcss.config.js        # PostCSS config
│   ├── .env.example             # Environment variables template
│   ├── .gitignore               # Git ignore rules
│   ├── README.md                # Main documentation
│   ├── QUICKSTART.md            # Quick start guide
│   ├── TODO.md                  # Implementation checklist
│   └── supabase-schema.sql      # Complete database schema
│
├── 📱 Frontend Application
│   ├── index.html               # HTML template
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Main app with routing
│       ├── index.css            # Global styles (Tailwind)
│       │
│       ├── 📂 components/       # React components
│       │   ├── Layout.jsx       # Main layout with navigation
│       │   │
│       │   ├── ui/              # Reusable UI components
│       │   │   ├── Button.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── SearchBar.jsx
│       │   │   └── Loading.jsx
│       │   │
│       │   ├── drinks/          # Drink-specific components
│       │   │   └── DrinkCard.jsx
│       │   │
│       │   └── ingredients/     # Ingredient-specific components
│       │       └── [To be created]
│       │
│       ├── 📂 pages/            # Page components (routes)
│       │   ├── DrinksPage.jsx   # ✅ List all drinks
│       │   ├── DrinkDetailPage.jsx      # 🔲 View drink details
│       │   ├── AddDrinkPage.jsx         # 🔲 Add new drink
│       │   ├── EditDrinkPage.jsx        # 🔲 Edit drink
│       │   ├── IngredientsPage.jsx      # 🔲 List ingredients
│       │   ├── IngredientDetailPage.jsx # 🔲 View ingredient
│       │   ├── AddIngredientPage.jsx    # 🔲 Add ingredient
│       │   ├── EditIngredientPage.jsx   # 🔲 Edit ingredient
│       │   ├── MyBarPage.jsx            # 🔲 Manage home ingredients
│       │   └── CanMakePage.jsx          # 🔲 Show makeable drinks
│       │
│       ├── 📂 hooks/            # Custom React hooks
│       │   ├── useDrinks.js     # ✅ Drinks data hooks
│       │   └── useIngredients.js # ✅ Ingredients data hooks
│       │
│       └── 📂 lib/              # Libraries & utilities
│           ├── supabase.js      # ✅ Supabase client config
│           ├── constants.js     # ✅ Categories, types, etc.
│           ├── utils.js         # ✅ Helper functions
│           │
│           └── api/             # API functions
│               ├── drinks.js    # ✅ Drinks CRUD operations
│               └── ingredients.js # ✅ Ingredients CRUD
│
└── 📊 Database
    └── supabase-schema.sql      # ✅ Complete PostgreSQL schema
```

## 🗄️ Databasstruktur (Supabase/PostgreSQL)

### Huvudtabeller
- **drinks** - Cocktails och drinkar
  - Grundinfo: namn, beskrivning, spritbas, glastyp, etc.
  
- **drink_images** - Flera bilder per drink
  - Sorterbara (sort_order)
  
- **drink_ingredients** - Ingredienser i drinkar
  - Med mängd och sortering
  
- **drink_instructions** - Instruktioner för drinkar
  - Sorterbara steg
  
- **ingredients** - Alla ingredienser
  - Kategori, alkoholhalt, Systembolaget-nummer
  - **has_at_home** - "Min Bar"-funktionalitet
  
- **tags** - Taggar för drinkar
  
- **drink_tags** - Koppling mellan drinkar och taggar

### Storage Buckets
- **drink-images** - Drinkbilder
- **ingredient-images** - Ingrediensbilder

## 🔄 Dataflöde

### Exempel: Lägga till en drink

```
User Input (Form)
    ↓
React Hook Form (Validation)
    ↓
useCreateDrink hook
    ↓
createDrink() API function
    ↓
1. Insert into drinks table
2. Upload images to storage
3. Insert drink_images records
4. Insert drink_ingredients records
5. Insert drink_instructions records
6. Create/link tags
    ↓
React Query invalidates cache
    ↓
UI updates automatically
```

## 🎨 UI Framework: Tailwind CSS

### Färgschema
- Primary: Orange (#f97316)
- Success: Green
- Danger: Red
- Gray: För text och bakgrunder

### Komponentsystem
- Återanvändbara komponenter med Tailwind classes
- Responsiv design (mobile-first)
- Custom utility classes i `index.css`

## 🔧 Tech Stack i detalj

### Frontend
- **React 18** - UI-bibliotek
- **React Router v6** - Client-side routing
- **React Query v5** - Data fetching, caching, synchronization
- **React Hook Form** - Formulärhantering
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Moderna ikoner
- **Vite** - Build tool och dev server

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL databas
  - Row Level Security (RLS)
  - Storage för bilder
  - Realtime subscriptions (future)
  - Auth (future)

### Utilities
- **date-fns** - Datumhantering
- **clsx** - Class name helper

## 🚀 Implementationsstatus

### ✅ Klart (Core)
- Projektkonfiguration (Vite, Tailwind, etc.)
- Supabase setup och schema
- API-funktioner för drinkar
- API-funktioner för ingredienser
- React Query hooks
- Layout och navigation
- Grundläggande UI-komponenter
- DrinksPage med sökning och gruppering
- Konstanter och utilities
- Omfattande dokumentation

### 🔲 Återstår (Main Features)
- DrinkDetailPage - visa fullständig drink
- Add/Edit Drink - formulär med bilder
- IngredientsPage - lista ingredienser
- Add/Edit Ingredient - formulär
- MyBarPage - hantera "har hemma"
- CanMakePage - visa vad du kan mixa
- Import/Export funktionalitet

### 🔲 Återstår (Nice-to-have)
- Error boundaries
- Toast notifications
- Favoriter
- Rating system
- Dark mode
- PWA support
- Autentisering
- Användarspecifik data

## 📊 Kodstatistik

### Skapade filer: 29
- Configuration: 7 filer
- Backend/API: 6 filer
- Frontend/Components: 8 filer
- Pages: 1 fil (av 10)
- Documentation: 4 filer
- Other: 3 filer

### Rader kod: ~3500+
- JavaScript: ~2500
- SQL: ~300
- CSS: ~200
- Markdown: ~500

### Funktionalitet: ~30% komplett
Core setup och grundläggande struktur är klar.
API och data layer är fullt fungerande.
UI-komponenter påbörjade.
Huvudfunktionalitet för drinkar påbörjad.

## 🎯 Nästa steg för utveckling

1. **Kort sikt** (1-2 dagar)
   - Skapa DrinkDetailPage
   - Skapa DrinkForm-komponent
   - Implementera bilduppladdning
   - Skapa IngredientsPage

2. **Medellång sikt** (3-5 dagar)
   - Implementera MyBar-funktionalitet
   - Skapa CanMakePage med filtrering
   - Lägg till import/export
   - Polera UI och UX

3. **Lång sikt** (1-2 veckor)
   - Lägg till autentisering
   - Implementera favoriter
   - Lägg till PWA-support
   - Dark mode
   - Tester

## 💡 Tips för utveckling

### Arbetsflöde
1. Starta dev-servern: `npm run dev`
2. Öppna i browser: `http://localhost:5173`
3. Ändra kod → Hot reload sker automatiskt
4. Testa i Supabase Dashboard att data sparas korrekt

### Debugging
- Chrome DevTools (F12)
- React Developer Tools extension
- Network tab för API-anrop
- Supabase Dashboard för databas

### Best Practices
- Följ existerande kodstil
- Använd TypeScript för komplexa komponenter
- Skriv kommentarer för komplexa logik
- Testa på mobil regelbundet
- Commita ofta med beskrivande meddelanden

## 📚 Resurser

### Dokumentation
- [React Docs](https://react.dev)
- [React Query Docs](https://tanstack.com/query)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Router Docs](https://reactrouter.com)

### Tutorials
- [Supabase React Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- [React Query Tutorial](https://tanstack.com/query/latest/docs/react/quick-start)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)

## 🤝 Support

Om du fastnar:
1. Läs relevanta docs
2. Kolla TODO.md för implementation details
3. Testa i Supabase Dashboard
4. Använd Chrome DevTools Console
5. Fråga ChatGPT/Claude om specifika problem

## 🎉 Slutsats

Detta projekt är en solid grund för din drink-app. Core-funktionaliteten är implementerad och väl strukturerad. Arkitekturen är skalbar och följer modern React best practices.

Fortsätt med att implementera sidor enligt TODO.md, testa kontinuerligt, och anpassa efter dina behov!

**Lycka till med utvecklingen! 🍸**
