import "../styles/Analyze.css";
import { Header } from "./Header";
import { LoginProps } from "./Login";

export function Analyze({isloggedIn} : LoginProps){
  return(
    <>
      <Header isloggedIn={isloggedIn} />
    </>
  );
}