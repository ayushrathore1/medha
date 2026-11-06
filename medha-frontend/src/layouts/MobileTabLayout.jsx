import React, { useContext, memo } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import BottomNav from "../components/Revision/BottomNav";

/**
 * Keeps bottom tabs mounted across primary app routes so tab switches
 * only re-render the page outlet — not the whole chrome.
 */
function MobileTabLayout() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Outlet />
      {user ? <BottomNav /> : null}
    </>
  );
}

export default memo(MobileTabLayout);
