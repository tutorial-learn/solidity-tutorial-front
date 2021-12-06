import Sign from "./templates/Sign";
import Main from "./templates/Main";
import { useCheckSignIn } from "./contexts/CheckSignInProvider";
import useEaggerConnect from "./hooks/useEaggerConnect";

function App() {
  const { isLoggedIn } = useCheckSignIn();

  useEaggerConnect();

  if (isLoggedIn) return <Main />;

  return <Sign />;
}

export default App;
