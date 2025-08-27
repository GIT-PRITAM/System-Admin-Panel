import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SchemesPage from "./components/Scheme";
import SchemeDetailPage from "./components/WorkOrder";
import LocationPage from "./components/Geography";
import Assets from "./components/Assets";
import Users from "./components/Users";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/schemes" element={<SchemesPage />} />
      <Route path="/schemes/:schemeId" element={<SchemeDetailPage />} />
      <Route path="/geography" element={<LocationPage />} />
      <Route path="/assets" element={<Assets />} />
      <Route path="/users" element={<Users />} />

    </Routes>
  );
}

export default App;
