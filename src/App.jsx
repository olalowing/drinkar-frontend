import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DrinksPage from './pages/DrinksPage'
import DrinkDetailPage from './pages/DrinkDetailPage'
import AddDrinkPage from './pages/AddDrinkPage'
import EditDrinkPage from './pages/EditDrinkPage'
import IngredientsPage from './pages/IngredientsPage'
import IngredientDetailPage from './pages/IngredientDetailPage'
import AddIngredientPage from './pages/AddIngredientPage'
import EditIngredientPage from './pages/EditIngredientPage'
import MyBarPage from './pages/MyBarPage'
import CanMakePage from './pages/CanMakePage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DrinksPage />} />
        <Route path="/drinks" element={<DrinksPage />} />
        <Route path="/drinks/:id" element={<DrinkDetailPage />} />
        <Route path="/drinks/new" element={<AddDrinkPage />} />
        <Route path="/drinks/:id/edit" element={<EditDrinkPage />} />
        
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/ingredients/:id" element={<IngredientDetailPage />} />
        <Route path="/ingredients/new" element={<AddIngredientPage />} />
        <Route path="/ingredients/:id/edit" element={<EditIngredientPage />} />
        
        <Route path="/my-bar" element={<MyBarPage />} />
        <Route path="/can-make" element={<CanMakePage />} />
      </Routes>
    </Layout>
  )
}

export default App
