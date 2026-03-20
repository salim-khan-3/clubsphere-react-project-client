import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import ManagerRoute from "./routes/ManagerRoute";

// Public Pages
import HomePage from "./pages/public/HomePage";
import ClubsPage from "./pages/public/ClubsPage";
import ClubDetailPage from "./pages/public/ClubDetailPage";
import EventsPage from "./pages/public/EventsPage";
import EventDetailPage from "./pages/public/EventDetailPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import NotFoundPage from "./pages/public/NotFoundPage";

// Dashboard Pages - Admin
import AdminOverview from "./pages/dashboard/admin/AdminOverview";
import ManageUsers from "./pages/dashboard/admin/ManageUsers";
import ManageClubs from "./pages/dashboard/admin/ManageClubs";
import ViewPayments from "./pages/dashboard/admin/ViewPayments";

// Dashboard Pages - Manager
import ManagerOverview from "./pages/dashboard/manager/ManagerOverview";
import MyClubs from "./pages/dashboard/manager/MyClubs";
import ClubMembers from "./pages/dashboard/manager/ClubMembers";
import EventsManagement from "./pages/dashboard/manager/EventsManagement";
import EventRegistrations from "./pages/dashboard/manager/EventRegistrations";
import ManageAnnouncements from "./pages/dashboard/manager/ManageAnnouncements";

// Dashboard Pages - Member
import MemberOverview from "./pages/dashboard/member/MemberOverview";
import MyMemberships from "./pages/dashboard/member/MyMemberships";
import MyEvents from "./pages/dashboard/member/MyEvents";
import PaymentHistory from "./pages/dashboard/member/PaymentHistory";
import MyBookmarks from "./pages/dashboard/member/MyBookmarks";

function App() {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/clubs/:id" element={<ClubDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ── Dashboard Routes ── */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* Admin */}
        <Route path="admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
        <Route path="admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="admin/clubs" element={<AdminRoute><ManageClubs /></AdminRoute>} />
        <Route path="admin/payments" element={<AdminRoute><ViewPayments /></AdminRoute>} />

        {/* Manager */}
        <Route path="manager" element={<ManagerRoute><ManagerOverview /></ManagerRoute>} />
        <Route path="manager/clubs" element={<ManagerRoute><MyClubs /></ManagerRoute>} />
        <Route path="manager/members/:clubId" element={<ManagerRoute><ClubMembers /></ManagerRoute>} />
        <Route path="manager/events" element={<ManagerRoute><EventsManagement /></ManagerRoute>} />
        <Route path="manager/events/:eventId/registrations" element={<ManagerRoute><EventRegistrations /></ManagerRoute>} />
        <Route path="manager/announcements" element={<ManagerRoute><ManageAnnouncements /></ManagerRoute>} />

        {/* Member */}
        <Route path="member" element={<PrivateRoute><MemberOverview /></PrivateRoute>} />
        <Route path="member/memberships" element={<PrivateRoute><MyMemberships /></PrivateRoute>} />
        <Route path="member/events" element={<PrivateRoute><MyEvents /></PrivateRoute>} />
        <Route path="member/payments" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />
        <Route path="member/bookmarks" element={<PrivateRoute><MyBookmarks /></PrivateRoute>} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
