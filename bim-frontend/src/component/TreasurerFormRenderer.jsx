import { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Mainlayout from "../component/Mainlayout.jsx";
import Typography from "@mui/material/Typography";
import { useAuth } from "../utils/AuthProvider.jsx";

const formComponents = {
  "punong-barangay-certification": lazy(() =>
    import("./TreasurerComponent/TreasurerForms/PunongBarangayCertificate")
  ),
};

const formsNames = {
  "punong-barangay-certification": "Punong Barangay's Certification",
};
const TreasurerFormRenderer = () => {
  const { auth } = useAuth();
  const { id } = useParams();
  const ActiveFormComponent = formComponents[id];
  const currentFormLabel = formsNames[id]
  return (
    <Mainlayout
      user_name={`${
        auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1)
      } user`}
      activeComponent={"treasurer-form"}
      setActiveComponent={() => {}}
      componentLabel={currentFormLabel}
    >
      <div id="breadcrumbs-container" className="d-flex flex-row gap-3 mx-3">

        <div id="breadcrumbs-list">
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link href="/treasurer" color="inherit">
              Main Dashboard
            </Link>
            <Typography color="text.primary">{formsNames[id]}</Typography>
          </Breadcrumbs>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {ActiveFormComponent ? (
          <ActiveFormComponent />
        ) : (
          <div>Form not found</div>
        )}
      </Suspense>
    </Mainlayout>
  );
};

export default TreasurerFormRenderer;
