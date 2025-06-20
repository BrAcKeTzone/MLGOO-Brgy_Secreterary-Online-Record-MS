import AppRouter from "./routes/AppRouter";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/LandingComp/Footer";

function App() {
  return (
    <>
      <Navbar />
      <AppRouter />
      <Footer />
    </>
  );
}

export default App;
