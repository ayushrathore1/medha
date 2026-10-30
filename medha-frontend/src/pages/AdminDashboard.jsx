import React from "react";
import Loader from "../components/Common/Loader";
import DeleteUserModal from "../components/Admin/DeleteUserModal";
import InviteTeamModal from "../components/Admin/InviteTeamModal";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import AdminTabBar from "../components/AdminDashboard/AdminTabBar";
import MessagesPanel from "../components/AdminDashboard/MessagesPanel";
import EmailPanel from "../components/AdminDashboard/EmailPanel";
import HistoryPanel from "../components/AdminDashboard/HistoryPanel";
import TeamPanel from "../components/AdminDashboard/TeamPanel";
import TranscribePanel from "../components/AdminDashboard/TranscribePanel";
import SuggestionsPanel from "../components/AdminDashboard/SuggestionsPanel";
import "../styles/responsive-pages.css";

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
    <div
      className="min-h-screen pt-20 px-4 sm:px-6 pb-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        <AdminTabBar admin={admin} />

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

        <MessagesPanel admin={admin} />
        <EmailPanel admin={admin} />
        <HistoryPanel admin={admin} />
        <TeamPanel admin={admin} />
        <TranscribePanel admin={admin} />
        <SuggestionsPanel admin={admin} />
      </div>
    </div>
  );
};

export default AdminDashboard;
