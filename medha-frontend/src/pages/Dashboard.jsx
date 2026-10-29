import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import UniversitySyllabusDashboard from "../components/Revision/UniversitySyllabusDashboard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <RevisionShell>
      <UniversitySyllabusDashboard user={user} />
    </RevisionShell>
  );
}
