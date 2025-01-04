import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import WorkflowList from "./pages/WorkflowList.tsx";

import { BrowserRouter, Routes, Route } from "react-router";
import WorkflowTemplateDetails from "./pages/WorkflowTemplateDetails.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/workflow-template/:id"
          element={<WorkflowTemplateDetails />}
        />
        <Route path="/" element={<WorkflowList />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
