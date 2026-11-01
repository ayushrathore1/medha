import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import RevisionHome from "../components/Revision/RevisionHome";
import RevisionShell from "../components/Revision/RevisionShell";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <RevisionShell>
      <RevisionHome user={user} />
    </RevisionShell>
  );
}
