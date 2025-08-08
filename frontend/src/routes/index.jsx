import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { Account } from "../pages/Account";
import { Movements } from "../pages/Movements";
import { Cards } from "../pages/Cards";
import { Transferencias } from "../pages/Transferencias";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/movements" element={<Movements />} />
          <Route path="/account/:id/movements" element={<Movements />} />
          <Route path="/account/:id/transferencias" element={<Transferencias />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
