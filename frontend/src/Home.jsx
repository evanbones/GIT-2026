import Header from "./components/Header/Header.jsx";
import Map from "./components/Map/Map.jsx";
import OnboardForm from "./components/OnboardForm/OnboardForm.jsx"

function Home({ account, setAccount }) {
  return (
    <>
      <Header account={account} setAccount={setAccount} />
      <Map />
      <OnboardForm />
    </>
  );
}
export default Home;
