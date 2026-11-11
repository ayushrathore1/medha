import React, { Suspense, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import BottomNav from "../components/Revision/BottomNav";

/**
 * App chrome (bottom tabs) stays mounted across primary routes.
 * Must re-render on location changes so <Outlet /> swaps pages —
 * do NOT wrap this in React.memo (it would freeze the outlet while the URL updates).
 */
function MobileTabLayout() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <>
      <Suspense fallback={<div className="min-h-[40vh] w-full" aria-hidden="true" />}>
        {/* key forces a clean page mount when the path changes */}
        <Outlet key={location.pathname} />
      </Suspense>
      {user ? <BottomNav /> : null}
    </>
  );
}

export default MobileTabLayout;
