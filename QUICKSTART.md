# 🚀 Snabbstart - Drinkar Web App

## Steg-för-steg guide

### 1. Installera Node.js
Om du inte har Node.js installerat, ladda ner från [nodejs.org](https://nodejs.org/) (välj LTS-versionen)

### 2. Skapa Supabase-projekt
1. Gå till [supabase.com](https://supabase.com)
2. Klicka på "Start your project"
3. Logga in med GitHub
4. Skapa nytt projekt:
   - Organization: Välj eller skapa ny
   - Project name: "drinkar-app" (eller valfritt namn)
   - Database Password: Generera ett säkert lösenord (spara detta!)
   - Region: Välj närmaste region
   - Klicka "Create new project"

### 3. Konfigurera databasen
1. I Supabase dashboard, gå till **SQL Editor** (vänster meny)
2. Öppna filen `supabase-schema.sql` från projektet
3. Kopiera **hela innehållet**
4. Klistra in i SQL Editor
5. Klicka **RUN** (eller Ctrl/Cmd + Enter)
6. Vänta tills queryn är klar (du ser "Success. No rows returned")

### 4. Skapa Storage Buckets
1. I Supabase dashboard, gå till **Storage** (vänster meny)
2. Klicka **New bucket**
3. Skapa första bucket:
   - Name: `drink-images`
   - Public bucket: **JA** (viktigt!)
   - Klicka **Create bucket**
4. Upprepa för andra bucket:
   - Name: `ingredient-images`
   - Public bucket: **JA**
   - Klicka **Create bucket**

### 5. Hämta API-nycklar
1. I Supabase dashboard, gå till **Settings** → **API**
2. Kopiera följande värden:
   - **Project URL** (ser ut som: `https://abcdefgh.supabase.co`)
   - **anon public** key (under "Project API keys")

### 6. Konfigurera projektet
1. Öppna projektet i VSCode
2. I terminalen, kör:
   ```bash
   npm install
   ```
3. Skapa en `.env`-fil i projektets rot:
   ```bash
   cp .env.example .env
   ```
4. Öppna `.env` och fyll i dina värden:
   ```
   VITE_SUPABASE_URL=https://din-projekt-url.supabase.co
   VITE_SUPABASE_ANON_KEY=din-anon-key-här
   ```

### 7. Starta appen
```bash
npm run dev
```

Appen öppnas på `http://localhost:5173`

## ✅ Checklist innan du börjar

- [ ] Node.js installerat (version 18+)
- [ ] Supabase-projekt skapat
- [ ] SQL-schema kört i SQL Editor
- [ ] Storage buckets skapade (båda publika!)
- [ ] API-nycklar kopierade
- [ ] `.env`-fil skapad med korrekta värden
- [ ] Dependencies installerade (`npm install`)
- [ ] Dev-server startad (`npm run dev`)

## 🐛 Vanliga problem

### "Cannot connect to Supabase"
- Kontrollera att URL:en i `.env` är korrekt (ingen trailing slash)
- Verifiera att anon key är rätt kopierad
- Se till att `.env`-filen finns i projekt-roten

### "Bilder kan inte laddas upp"
- Kontrollera att storage buckets är skapade
- Se till att buckets är **publika** (Public bucket = YES)
- Verifiera bucket-namnen: exakt `drink-images` och `ingredient-images`

### "SQL-fel vid körning av schema"
- Se till att du kopierade **hela** innehållet från `supabase-schema.sql`
- Kör schemat igen (det är säkert att köra flera gånger)

### "Port 5173 är redan använd"
- Stäng andra Vite-projekt
- Eller ändra port i `vite.config.js`

## 📚 Nästa steg

1. Testa appen genom att:
   - Lägg till en drink
   - Lägg till ingredienser
   - Markera ingredienser i "Min Bar"
   - Se vilka drinkar du kan göra i "Kan göra"

2. Utforska koden:
   - `src/pages/` - Alla sidor
   - `src/components/` - UI-komponenter
   - `src/lib/api/` - API-funktioner

3. Anpassa efter dina behov:
   - Ändra färger i `tailwind.config.js`
   - Lägg till fler kategorier i `src/lib/constants.js`
   - Skapa egna komponenter

## 💡 Tips

- **CMD+Shift+P** (Mac) eller **Ctrl+Shift+P** (Windows) → "Format Document" för att formatera kod
- Använd ESLint för att hitta problem i koden
- Testa i olika webbläsare (Chrome, Firefox, Safari)
- Använd Chrome DevTools för att debugga

## 🆘 Behöver du hjälp?

- Läs [README.md](./README.md) för mer detaljerad information
- Kolla [TODO.md](./TODO.md) för vad som återstår att implementera
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- React docs: [react.dev](https://react.dev)

**Lycka till! 🍸**
