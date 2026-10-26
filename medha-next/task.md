# Medha CampusCart — Architecture Transformation Tracker

## Phase 1: Database Schema & Models
- [ ] Create Wallet model
- [ ] Create Shipment model
- [ ] Create Payment model
- [ ] Create WithdrawalRequest model
- [ ] Modify Order model (fulfillmentStatus, dispute, refund fields)
- [ ] Modify User model (phone, sellerVerified, savedAddresses)
- [ ] Modify Notification model (category, data, priority)
- [ ] Update models/index.ts barrel exports

## Phase 2: Information Isolation & Security
- [ ] Create info-filter.ts utility
- [ ] Update seller/orders API to strip buyer info
- [ ] Update buyer orders API to strip seller info
- [ ] Update order detail API with role-based filtering

## Phase 3: Financial Service (Wallet & Escrow)
- [ ] Wallet API routes (GET balance, POST transaction)
- [ ] Withdrawal request API
- [ ] Escrow service (hold, release, refund)
- [ ] Update payment verify to use escrow

## Phase 4: Fulfillment & Operations Pipeline
- [ ] Fulfillment API routes (CRUD shipments)
- [ ] Tracking API (buyer view)
- [ ] Fulfillment service (lifecycle management)

## Phase 5: Real-Time Notifications
- [ ] Socket.io server
- [ ] Notification service (unified dispatcher)
- [ ] useNotifications hook
- [ ] NotificationBell component

## Phase 6: Admin/Operations Dashboard
- [ ] Admin orders API (full visibility)
- [ ] Admin withdrawals API
- [ ] Admin reports API
- [ ] Admin guard middleware
- [ ] Operations dashboard UI

## Phase 7: Unified Sidebar Dashboard UI
- [ ] DashboardLayout component (sidebar + widgets)
- [ ] DashboardHome component
- [ ] WidgetSidebar component
- [ ] Update layouts to use unified dashboard
- [ ] Update home page (auth redirect)

## Phase 8: User Personalization
- [ ] UserPreferences model
- [ ] Personalization API
- [ ] usePersonalization hook
- [ ] Recommended products API
- [ ] Activity tracker service
