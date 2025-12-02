# Drinkar Web App 🍸

En modern webbapplikation för att hantera cocktails, drinkar, ingredienser och recept. Byggd med React och Supabase.

## ✨ Funktioner

- **Drinkhantering**: Skapa, redigera och ta bort drinkar med ingredienser, instruktioner och bilder
- **Ingredienshantering**: Håll koll på alla dina ingredienser med kategorier, alkoholhalt och Systembolaget-integration
- **Min Bar**: Markera vilka ingredienser du har hemma
- **Kan göra**: Se vilka drinkar du kan göra med ingredienserna i din bar
- **Sökning & Filtrering**: Hitta snabbt drinkar och ingredienser
- **Gruppering**: Gruppera drinkar efter spritbas eller kategori
- **Bildgalleri**: Upp till 5 bilder per drink
- **Import/Export**: Importera och exportera data som CSV eller JSON
- **YouTube-integration**: Länka till instruktionsvideor

## 🚀 Kom igång

### Förutsättningar

- Node.js (v18 eller senare)
- npm eller yarn
- Ett Supabase-konto (gratis på [supabase.com](https://supabase.com))

### Installation

1. **Klona projektet**
   ```bash
   cd drinkar-web
   ```

2. **Installera dependencies**
   ```bash
   npm install
   ```

3. **Konfigurera Supabase**

   a. Skapa ett nytt projekt på [Supabase](https://supabase.com)
   
   b. Kör SQL-schemat från `supabase-schema.sql` i Supabase SQL Editor:
      - Gå till din Supabase dashboard
      - Öppna SQL Editor
      - Kopiera innehållet från `supabase-schema.sql`
      - Kör queryn

   c. Skapa storage buckets:
      - Gå till Storage i Supabase dashboard
      - Skapa två publika buckets:
        - `drink-images`
        - `ingredient-images`
      - Sätt båda till publika (Public bucket)

4. **Konfigurera miljövariabler**
   ```bash
   cp .env.example .env
   ```
   
   Redigera `.env` och lägg till dina Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   Hitta dessa värden i:
   - Supabase Dashboard → Settings → API
   - URL: Under "Project URL"
   - Anon key: Under "Project API keys" → "anon public"

5. **Starta utvecklingsservern**
   ```bash
   npm run dev
   ```
   
   Appen körs nu på `http://localhost:5173`

## 📁 Projektstruktur

```
drinkar-web/
├── src/
│   ├── components/        # React komponenter
│   │   ├── ui/           # Återanvändbara UI-komponenter
│   │   ├── drinks/       # Drink-specifika komponenter
│   │   └── ingredients/  # Ingrediens-specifika komponenter
│   ├── pages/            # Sidkomponenter (routes)
│   ├── lib/              # Bibliotek och utilities
│   │   ├── api/         # API-funktioner för Supabase
│   │   ├── supabase.js  # Supabase client
│   │   ├── constants.js # Konstanter och kategorier
│   │   └── utils.js     # Hjälpfunktioner
│   ├── hooks/            # Custom React hooks
│   ├── App.jsx           # Huvudapp med routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global CSS
├── supabase-schema.sql   # Database schema
├── package.json
└── README.md
```

## 🎨 Tech Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📖 Användning

### Lägga till en drink

1. Klicka på "Ny drink" på Drinkar-sidan
2. Fyll i drinkens information:
   - Namn och beskrivning
   - Ingredienser med mängder
   - Instruktioner
   - Välj glastyp och serveringsmetod
   - Lägg till bilder (upp till 5)
   - Lägg till taggar
   - Valfritt: YouTube-länk

### Hantera ingredienser

1. Gå till Ingredienser-sidan
2. Klicka på "Ny ingrediens"
3. Fyll i information:
   - Namn och kategori
   - Beskrivning
   - Alkoholhalt (för sprit)
   - Systembolaget-nummer eller URL
   - Anteckningar
   - Bild

### Använda "Min Bar"

1. Gå till "Min Bar"-sidan
2. Klicka på "Fyll Min Bar"
3. Markera ingredienser du har hemma
4. Gå till "Kan göra" för att se vilka drinkar du kan mixa!

### Import/Export

- **CSV Import**: Importera drinkar från Excel/CSV-fil
- **JSON Import**: Importera från JSON-backup
- **Export**: Exportera alla drinkar som CSV eller JSON

## 🔒 Säkerhet & Row Level Security

Projektet använder Supabase Row Level Security (RLS). Det nuvarande schemat tillåter alla operationer utan autentisering för enklare utveckling. För produktion bör du:

1. Aktivera Supabase Auth
2. Uppdatera RLS-policies för att kräva autentisering
3. Lägga till user_id i tabellerna
4. Filtrera queries baserat på inloggad användare

## 🚀 Deployment

### Vercel (Rekommenderat)

1. Pusha koden till GitHub
2. Importera projektet i Vercel
3. Lägg till environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Netlify

1. Pusha koden till GitHub
2. Importera projektet i Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Lägg till environment variables
6. Deploy!

## 📝 API Endpoints

### Drinks

- `getDrinks()` - Hämta alla drinkar
- `getDrink(id)` - Hämta en specifik drink
- `createDrink(data)` - Skapa ny drink
- `updateDrink(id, data)` - Uppdatera drink
- `deleteDrink(id)` - Ta bort drink
- `searchDrinks(query)` - Sök drinkar

### Ingredients

- `getIngredients()` - Hämta alla ingredienser
- `getIngredient(id)` - Hämta en specifik ingrediens
- `getHomeIngredients()` - Hämta ingredienser i Min Bar
- `createIngredient(data)` - Skapa ny ingrediens
- `updateIngredient(id, data)` - Uppdatera ingrediens
- `deleteIngredient(id)` - Ta bort ingrediens
- `toggleHomeStatus(id, status)` - Ändra Min Bar-status

## 🐛 Felsökning

### Kan inte ansluta till Supabase

- Kontrollera att `.env`-filen finns och innehåller rätt credentials
- Verifiera att URL:en är korrekt (utan trailing slash)
- Kontrollera att anon key är korrekt kopierad

### Bilder laddas inte upp

- Kontrollera att storage buckets är skapade
- Verifiera att buckets är publika
- Kontrollera bucket-namn i `src/lib/supabase.js`

### RLS-fel

- Kontrollera att RLS-policies är korrekt konfigurerade
- För utveckling, se till att "Enable all access for all users"-policies är aktiva

## 🤝 Bidra

Bidrag är välkomna! Skapa gärna en PR eller öppna en issue.

## 📄 Licens

MIT License - se LICENSE-filen för detaljer

## 🙏 Tack till

- [Supabase](https://supabase.com) för backend/databas
- [Tailwind CSS](https://tailwindcss.com) för styling
- [Lucide](https://lucide.dev) för ikoner
- [React Query](https://tanstack.com/query) för data fetching

---

**Utvecklad med ❤️ och 🍸**
