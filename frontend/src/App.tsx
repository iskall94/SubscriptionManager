import { AuthProvider } from './context/AuthProvider'
import AppRouter from './routes/AppRouter'
import { ColorModeProvider } from './context/ColorModeProvider';

function App() {
  return (
		<ColorModeProvider>
			<AuthProvider>
				<AppRouter />
			</AuthProvider>
		</ColorModeProvider>
  )
}

export default App