import { useState } from 'react'
import { ConfigProvider } from 'antd'
import zhTW from 'antd/locale/zh_TW'
import { theme } from './styles/theme'
import { MaterialProvider } from './contexts/MaterialContext'
import { RecipeProvider } from './contexts/RecipeContext'
import MainLayout from './components/Layout/MainLayout'
import HomePage from './pages/HomePage'
import MaterialsPage from './features/materials/MaterialsPage'
import RecipesPage from './features/recipes/RecipesPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'materials':
        return <MaterialsPage />
      case 'recipes':
        return <RecipesPage />
      case 'home':
      default:
        return <HomePage />
    }
  }

  return (
    <ConfigProvider theme={theme} locale={zhTW}>
      <MaterialProvider>
        <RecipeProvider>
          <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
            {renderPage()}
          </MainLayout>
        </RecipeProvider>
      </MaterialProvider>
    </ConfigProvider>
  )
}

export default App
