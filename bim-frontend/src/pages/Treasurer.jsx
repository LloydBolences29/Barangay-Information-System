import { Suspense, lazy, useState } from "react";
import Mainlayout from "../component/Mainlayout.jsx";
import { useAuth } from "../utils/AuthProvider.jsx";



const Treasurer = () => {
  const { auth } = useAuth();
  return (
    <div>
      <Mainlayout

      />
    </div>
  );
};

export default Treasurer;
