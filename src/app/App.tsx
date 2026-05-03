import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { AuthProvider } from './context/auth-context';
import { ComplaintsProvider } from './context/complaints-context';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <ComplaintsProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </ComplaintsProvider>
    </AuthProvider>
  );
}