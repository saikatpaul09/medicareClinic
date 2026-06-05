import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <Header />
          <HomePage />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
