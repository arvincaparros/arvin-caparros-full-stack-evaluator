import { useState } from "react";
import Auth from "./Auth";
import Tasks from "./Tasks";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return <Tasks user={user} />;
}

export default App;
