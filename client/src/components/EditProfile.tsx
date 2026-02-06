import { LoginProps } from './Login';
import "../styles/EditProfile.css";
import { Header } from './Header';
export function EditProfile({isloggedIn}: LoginProps){
  return(
    <>
      <Header 
        isloggedIn={isloggedIn}
      />
    </>
  );
}