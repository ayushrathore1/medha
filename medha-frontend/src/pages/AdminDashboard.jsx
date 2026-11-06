import React from "react";
import Loader from "../components/Common/Loader";
import DeleteUserModal from "../components/Admin/DeleteUserModal";
import InviteTeamModal from "../components/Admin/InviteTeamModal";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import AdminTabBar from "../components/AdminDashboard/AdminTabBar";
import EmailPanel from "../components/AdminDashboard/EmailPanel";
import HistoryPanel from "../components/AdminDashboard/HistoryPanel";
import TeamPanel from "../components/AdminDashboard/TeamPanel";
import TranscribePanel from "../components/AdminDashboard/TranscribePanel";
import CurriculumPanel from "../components/AdminDashboard/CurriculumPanel";
import NotesReviewPanel from "../components/AdminDashboard/NotesReviewPanel";
import RevisionShell from "../components/Revision/RevisionShell";
import "../styles/responsive-pages.css";
import "../styles/admin-dashboard.css";

const AdminDashboard = () => {
  const admin = useAdminDashboard();
  const {
    loading,
    isAdmin,
    inviteModalOpen,
    setInviteModalOpen,
    inviteEmail,
    setInviteEmail,
    token,
    deleteModalUser,
    setDeleteModalUser,
    handleDeleteUser,
    deleteConfirmation,
    setDeleteConfirmation,
    isDeleting,
  } = admin;

  if (loading) return <Loader fullScreen />;
  if (!isAdmin) return null;

  return (
    <RevisionShell title="Ops" wide desk>
      <div className="admin-dash desk-page max-w-[1100px]">
        <AdminTabBar admin={admin} />

        <div className="mt-4">
          <InviteTeamModal
            isOpen={inviteModalOpen}
            onClose={() => {
              setInviteModalOpen(false);
              setInviteEmail("");
            }}
            token={token}
            initialEmail={inviteEmail}
          />

          <DeleteUserModal
            isOpen={!!deleteModalUser}
            onClose={() => setDeleteModalUser(null)}
            onConfirm={handleDeleteUser}
            userName={deleteModalUser?.name}
            confirmText={deleteConfirmation}
            setConfirmText={setDeleteConfirmation}
            isDeleting={isDeleting}
          />

          <CurriculumPanel admin={admin} />
          <NotesReviewPanel admin={admin} />
          <EmailPanel admin={admin} />
          <HistoryPanel admin={admin} />
          <TeamPanel admin={admin} />
          <TranscribePanel admin={admin} />
        </div>
      </div>
    </RevisionShell>
  );
};

export default AdminDashboard;
