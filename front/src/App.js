import "./App.css";
import { Routes, Route } from "react-router-dom";
import { LogIn } from "./views/login";
import { SingIn } from "./views/singin";
import { Profile } from "./views/perfil";
import { BuscarAmigos } from "./views/buscarAmigos";
import { FriendsVIew } from "./views/misAmigos";
import { Publicaciones } from "./views/noticias";
import { Requests } from "./views/solicitudes";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route exact path="/SingIn" element={<SingIn />} />
        <Route path="/Profile"element={<Profile/>}/>
        <Route path="/People"element={<BuscarAmigos/>}/>
        <Route path="/Friends"element={<FriendsVIew/>}/>
        <Route path="/Publications"element={<Publicaciones/>}/>
        <Route path="/Request"element={<Requests/>}/>
        <Route path="*" element={<LogIn />} />
      </Routes>
    </div>
  );
}



export default App;
