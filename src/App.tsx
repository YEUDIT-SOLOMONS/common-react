import { Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ItemsPage } from './pages/ItemsPage'
import { ItemDetailsPage } from './pages/ItemDetailsPage'
import { MyItemsPage } from './pages/MyItemsPage'
import { NewItemPage } from './pages/NewItemPage'
import { EditItemPage } from './pages/EditItemPage'
import { AdminPage } from './pages/AdminPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/items" replace />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/items/new" element={<NewItemPage />} />
            <Route path="/items/:id" element={<ItemDetailsPage />} />
            <Route path="/items/:id/edit" element={<EditItemPage />} />
            <Route path="/my-items" element={<MyItemsPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
