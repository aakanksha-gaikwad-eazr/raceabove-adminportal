import { lazy } from "react"; // CUSTOM COMPONENTS

import Loadable from "./Loadable";
import { AuthGuard } from "@/components/auth";
import useSettings from "@/hooks/useSettings";
import LayoutV1 from "@/layouts/layout-1";
import LayoutV2 from "@/layouts/layout-2"; // ALL DASHBOARD PAGES

const CRM = Loadable(lazy(() => import("@/pages/dashboard/crm")));
const CRMV2 = Loadable(lazy(() => import("@/pages/dashboard/crm-2")));
const Sales = Loadable(lazy(() => import("@/pages/dashboard/sales")));
const SalesV2 = Loadable(lazy(() => import("@/pages/dashboard/sales-2")));
const Finance = Loadable(lazy(() => import("@/pages/dashboard/finance")));
const FinanceV2 = Loadable(lazy(() => import("@/pages/dashboard/finance-2")));
const Analytics = Loadable(lazy(() => import("@/pages/dashboard/analytics")));
const AnalyticsV2 = Loadable(
  lazy(() => import("@/pages/dashboard/analytics-2"))
);
const Ecommerce = Loadable(lazy(() => import("@/pages/dashboard/ecommerce")));
const Logistics = Loadable(lazy(() => import("@/pages/dashboard/logistics")));
const Marketing = Loadable(lazy(() => import("@/pages/dashboard/marketing")));
const LMS = Loadable(
  lazy(() => import("@/pages/dashboard/learning-management"))
);
const JobManagement = Loadable(
  lazy(() => import("@/pages/dashboard/job-management"))
); // USER LIST PAGES

const AddNewUser = Loadable(
  lazy(() => import("@/pages/dashboard/users/add-new-user"))
);
const EditUser = Loadable(
  lazy(() => import("@/pages/dashboard/users/edit-user"))
);
const UserListView = Loadable(
  lazy(() => import("@/pages/dashboard/users/user-list-1"))
);
const UserGridView = Loadable(
  lazy(() => import("@/pages/dashboard/users/user-grid-1"))
);
const UserListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/users/user-list-2"))
);
const UserGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/users/user-grid-2"))
);
const UserDetails = Loadable(
  lazy(() => import("@/pages/dashboard/users/details"))
);

//admin

const AddNewAdmin = Loadable(
  lazy(() => import("@/pages/dashboard/admin/add-new-admin"))
);
const EditAdmin = Loadable(
  lazy(() => import("@/pages/dashboard/admin/edit-admin"))
);
const AdminListView = Loadable(
  lazy(() => import("@/pages/dashboard/admin/admin-list-1"))
);
const AdminGridView = Loadable(
  lazy(() => import("@/pages/dashboard/admin/admin-grid-1"))
);
const AdminListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/admin/admin-list-2"))
);
const AdminGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/admin/admin-grid-2"))
);

//organisers

const AddNewOrganiser = Loadable(
  lazy(() => import("@/pages/dashboard/organizers/add-new-organizers"))
);
const EditOrganiser = Loadable(
  lazy(() => import("@/pages/dashboard/organizers/edit-organiser"))
);
const OrganiserListView = Loadable(
  lazy(() => import("@/pages/dashboard/organizers/organizers-list-1"))
);
const OrganiserGridView = Loadable(
  lazy(() => import("@/pages/dashboard/organizers/organizers-grid-1"))
);
const OrganiserListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/organizers/organizers-list-2"))
);
const OrganiserGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/organizers/organizers-grid-2"))
);

// coupons
const AddNewCoupons = Loadable(
  lazy(() => import("@/pages/dashboard/coupons/add-new-coupons"))
);
const EditCoupons = Loadable(
  lazy(() => import("@/pages/dashboard/coupons/edit-coupons"))
);
const CouponsListView = Loadable(
  lazy(() => import("@/pages/dashboard/coupons/coupons-list-1"))
);
const CouponsGridView = Loadable(
  lazy(() => import("@/pages/dashboard/coupons/coupons-grid-1"))
);
const CouponsListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/coupons/coupons-list-2"))
);
const CouponsGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/coupons/coupons-grid-2"))
);

// Tnc
const AddNewTnc = Loadable(
  lazy(() => import("@/pages/dashboard/tnc/add-new-tnc"))
);
const DetailsTnc = Loadable(
  lazy(() => import("@/pages/dashboard/tnc/details"))
);
const EditTnc = Loadable(
  lazy(() => import("@/pages/dashboard/tnc/edit-tnc"))
);
const TncListView = Loadable(
  lazy(() => import("@/pages/dashboard/tnc/tnc-list-1"))
);
const TncGridView = Loadable(
  lazy(() => import("@/pages/dashboard/tnc/tnc-grid-1"))
);
const TncListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/tnc/tnc-list-2"))
);
const TncGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/tnc/tnc-grid-2"))
);

// Faq
const AddNewFaq = Loadable(
  lazy(() => import("@/pages/dashboard/faqsection/add-new-faq"))
);
const EditFaq = Loadable(
  lazy(() => import("@/pages/dashboard/faqsection/edit-faq"))
);
const FaqListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/faqsection/faq-list-2"))
);
const FaqDetails = Loadable(
  lazy(() => import("@/pages/dashboard/faqsection/details"))
);

// privacy policy
const AddNewPrivacyPolicy = Loadable(
  lazy(() => import("@/pages/dashboard/privacypolicy/add-new-privacypolicy"))
);
const EditPrivacyPolicy = Loadable(
  lazy(() => import("@/pages/dashboard/privacypolicy/edit-privacypolicy"))
);
const DetailsPrivacyPolicy = Loadable(
  lazy(() => import("@/pages/dashboard/privacypolicy/details"))
);
const PrivacyPolicyListView = Loadable(
  lazy(() => import("@/pages/dashboard/privacypolicy/privacypolicy-list-1"))
);
const PrivacyPolicyGridView = Loadable(
  lazy(() => import("@/pages/dashboard/privacypolicy/privacypolicy-grid-1"))
);
const PrivacyPolicyListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/privacypolicy/privacypolicy-list-2"))
);
const PrivacyPolicyGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/privacypolicy/privacypolicy-grid-2"))
);




// ticket type
const AddNewTicketType = Loadable(
  lazy(() => import("@/pages/dashboard/tickettype/add-new-tickettype"))
);
const EditTicketType = Loadable(
  lazy(() => import("@/pages/dashboard/tickettype/edit-tickettype"))
);
const TicketTypeListView = Loadable(
  lazy(() => import("@/pages/dashboard/tickettype/tickettype-list-1"))
);
const TicketTypeGridView = Loadable(
  lazy(() => import("@/pages/dashboard/tickettype/tickettype-grid-1"))
);
const TicketTypeListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/tickettype/tickettype-list-2"))
);
const TicketTypeGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/tickettype/tickettype-grid-2"))
);

// ticket template
const AddNewTicketTemplate = Loadable(
  lazy(() => import("@/pages/dashboard/tickettemplate/add-new-tickettemplate"))
);
const EditTicketTemplate = Loadable(
  lazy(() => import("@/pages/dashboard/tickettemplate/edit-tickettemplate"))
);
const TicketTemplateListView = Loadable(
  lazy(() => import("@/pages/dashboard/tickettemplate/tickettemplate-list-1"))
);
const TicketTemplateGridView = Loadable(
  lazy(() => import("@/pages/dashboard/tickettemplate/tickettemplate-grid-1"))
);
const TicketTemplateListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/tickettemplate/tickettemplate-list-2"))
);
const TicketTemplateGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/tickettemplate/tickettemplate-grid-2"))
);



// add on categoy
const AddNewAddonCategory = Loadable(
  lazy(() => import("@/pages/dashboard/addoncategory/add-new-addonscategory"))
);
const EditAddonCategory = Loadable(
  lazy(() => import("@/pages/dashboard/addoncategory/edit-addonscategory"))
);
const AddonCategoryListView = Loadable(
  lazy(() => import("@/pages/dashboard/addoncategory/addonscategory-list-1"))
);
const AddonCategoryGridView = Loadable(
  lazy(() => import("@/pages/dashboard/addoncategory/addoncategory-grid-1"))
);
const AddonCategoryListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/addoncategory/addoncategory-list-2"))
);
const AddonCategoryGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/addoncategory/addoncategory-grid-2"))
);
// add ons
const AddNewAddon = Loadable(
  lazy(() => import("@/pages/dashboard/addon/add-new-addon"))
);
const EditAddon = Loadable(
  lazy(() => import("@/pages/dashboard/addon/edit-addon"))
);
const AddonListView = Loadable(
  lazy(() => import("@/pages/dashboard/addon/addon-list-1"))
);
const AddonGridView = Loadable(
  lazy(() => import("@/pages/dashboard/addon/addon-grid-1"))
);
const AddonListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/addon/addon-list-2"))
);
const AddonGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/addon/addon-grid-2"))
);

// sports
const AddNewSports = Loadable(
  lazy(() => import("@/pages/dashboard/sports/add-new-sports"))
);
const SportsListView = Loadable(
  lazy(() => import("@/pages/dashboard/sports/sports-list-1"))
);
const SportsGridView = Loadable(
  lazy(() => import("@/pages/dashboard/sports/sports-grid-1"))
);
const SportsListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/sports/sports-list-2"))
);
const SportsGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/sports/sports-grid-2"))
);

// Gear types
const AddNewGearTypes = Loadable(
  lazy(() => import("@/pages/dashboard/geartypes/add-new-geartypes"))
);
const GearTypesListView = Loadable(
  lazy(() => import("@/pages/dashboard/geartypes/geartypes-list-1"))
);

const GearTypesGridView = Loadable(
  lazy(() => import("@/pages/dashboard/geartypes/geartypes-grid-1"))
);
const GearTypesListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/geartypes/geartypes-list-2"))
);
const GearTypesGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/geartypes/geartypes-grid-2"))
);

// Gears
const AddNewGears = Loadable(
  lazy(() => import("@/pages/dashboard/gears/add-new-gears"))
);
// Gears
const AddNewGearsType = Loadable(
  lazy(() => import("@/pages/dashboard/geartypes/add-new-geartypes"))
);

const GearsListView = Loadable(
  lazy(() => import("@/pages/dashboard/gears/gears-list-1"))
);
const GearsGridView = Loadable(
  lazy(() => import("@/pages/dashboard/gears/gears-grid-1"))
);
const GearsListView2 = Loadable(
  lazy(() => import("@/pages/dashboard/gears/gears-list-2"))
);
const GearsGridView2 = Loadable(
  lazy(() => import("@/pages/dashboard/gears/gears-grid-2"))
);

const Account = Loadable(lazy(() => import("@/pages/dashboard/accounts"))); // ALL INVOICE RELATED PAGES

const InvoiceList = Loadable(
  lazy(() => import("@/pages/dashboard/invoice/list"))
);
const InvoiceCreate = Loadable(
  lazy(() => import("@/pages/dashboard/invoice/create"))
);
const InvoiceDetails = Loadable(
  lazy(() => import("@/pages/dashboard/invoice/details"))
); // PRODUCT RELATED PAGES

const ProductList = Loadable(
  lazy(() => import("@/pages/dashboard/products/list"))
);
const ProductGrid = Loadable(
  lazy(() => import("@/pages/dashboard/products/grid"))
);
const ProductCreate = Loadable(
  lazy(() => import("@/pages/dashboard/products/create"))
);
const ProductDetails = Loadable(
  lazy(() => import("@/pages/dashboard/products/details"))
); // E-COMMERCE RELATED PAGES

const TargetsList = Loadable(
  lazy(() => import("@/pages/dashboard/targets/list"))
);
const TargetsGrid = Loadable(
  lazy(() => import("@/pages/dashboard/targets/grid"))
);
const TargetsCreate = Loadable(
  lazy(() => import("@/pages/dashboard/targets/create"))
);
const TargetsDetails = Loadable(
  lazy(() => import("@/pages/dashboard/targets/details"))
); // E-COMMERCE RELATED PAGES

const Cart = Loadable(lazy(() => import("@/pages/dashboard/ecommerce/cart")));
const Payment = Loadable(
  lazy(() => import("@/pages/dashboard/ecommerce/payment"))
);
const BillingAddress = Loadable(
  lazy(() => import("@/pages/dashboard/ecommerce/billing-address"))
);
const PaymentComplete = Loadable(
  lazy(() => import("@/pages/dashboard/ecommerce/payment-complete"))
); // USER PROFILE PAGE

const Profile = Loadable(lazy(() => import("@/pages/dashboard/profile"))); // REACT DATA TABLE PAGE

const DataTable1 = Loadable(
  lazy(() => import("@/pages/dashboard/data-tables/table-1"))
); // OTHER BUSINESS RELATED PAGES

const Career = Loadable(lazy(() => import("@/pages/career/career-1")));
const About = Loadable(lazy(() => import("@/pages/about-us/about-us-2")));
const FileManager = Loadable(
  lazy(() => import("@/pages/dashboard/file-manager"))
); // SUPPORT RELATED PAGES

const Support = Loadable(
  lazy(() => import("@/pages/dashboard/support/support"))
);
const CreateTicket = Loadable(
  lazy(() => import("@/pages/dashboard/support/create-ticket"))
);
// FAQ section PAGE

// const FAQSection = Loadable(
//   lazy(() => import("@/pages/dashboard/faqsection/faq"))
// );
// const CreateFaq = Loadable(
//   lazy(() => import("@/pages/dashboard/faqsection/create-faq"))
// ); 
// const EditFaq = Loadable(
//   lazy(() => import("@/pages/dashboard/faqsection/edit-faq"))
// ); 


// CHAT PAGE
const Chat = Loadable(lazy(() => import("@/pages/dashboard/chat"))); // USER TODO LIST PAGE

const TodoList = Loadable(lazy(() => import("@/pages/dashboard/todo-list"))); // MAIL RELATED PAGES

const Sent = Loadable(lazy(() => import("@/pages/dashboard/email/sent")));
const AllMail = Loadable(lazy(() => import("@/pages/dashboard/email/all")));
const Inbox = Loadable(lazy(() => import("@/pages/dashboard/email/inbox")));
const Compose = Loadable(lazy(() => import("@/pages/dashboard/email/compose")));
const MailDetails = Loadable(
  lazy(() => import("@/pages/dashboard/email/details"))
);

//  challenge PAGES

const ProjectV1 = Loadable(
  lazy(() => import("@/pages/dashboard/challenge/version-1"))
);
const ProjectV2 = Loadable(
  lazy(() => import("@/pages/dashboard/challenge/version-2"))
);
const ProjectV3 = Loadable(
  lazy(() => import("@/pages/dashboard/challenge/version-3"))
);

const ProjectDetails = Loadable(
  lazy(() => import("@/pages/dashboard/challenge/details"))
);

const TeamMember = Loadable(
  lazy(() => import("@/pages/dashboard/challenge/team-member"))
);
const AddChallenge = Loadable(
  lazy(() => import("@/pages/dashboard/challenge/add-challenge"))
);

//events
const EventsV4 = Loadable(
  lazy(() => import("@/pages/dashboard/events/version-4"))
);
const EventsV5 = Loadable(
  lazy(() => import("@/pages/dashboard/events/version-5"))
);
const EventsDetails = Loadable(
  lazy(() => import("@/pages/dashboard/events/details"))
);
const EventsTeamMember = Loadable(
  lazy(() => import("@/pages/dashboard/events/team-member"))
);
const EditEvents = Loadable(
  lazy(() => import("@/pages/dashboard/events/edit-event"))
);



const BookingsV1 = Loadable(
  lazy(() => import("@/pages/dashboard/bookings/version-1"))
);
const BookingsV2 = Loadable(
  lazy(() => import("@/pages/dashboard/bookings/version-2"))
);
const BookingsV3 = Loadable(
  lazy(() => import("@/pages/dashboard/bookings/version-3"))
);
const BookingsDetails = Loadable(
  lazy(() => import("@/pages/dashboard/bookings/details"))
);
const SlotDetails = Loadable(
  lazy(() => import("@/pages/dashboard/bookings/slotDetails"))
);
const BookingsTeamMember = Loadable(
  lazy(() => import("@/pages/dashboard/bookings/team-member"))
);
const EditBookings = Loadable(
  lazy(() => import("@/pages/dashboard/bookings/edit-event"))
);

const ActiveLayout = () => {
  const { settings } = useSettings();

  return settings.activeLayout === "layout2" ? <LayoutV2 /> : <LayoutV1 />;
};

export const DashboardRoutes = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <ActiveLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: "true",
        element: <Analytics />,
      },
      {
        path: "crm",
        element: <CRM />,
      },
      {
        path: "crm-2",
        element: <CRMV2 />,
      },
      {
        path: "sales",
        element: <Sales />,
      },
      {
        path: "sales-2",
        element: <SalesV2 />,
      },
      {
        path: "finance",
        element: <Finance />,
      },
      {
        path: "finance-2",
        element: <FinanceV2 />,
      },
      {
        path: "ecommerce",
        element: <Ecommerce />,
      },
      {
        path: "logistics",
        element: <Logistics />,
      },
      {
        path: "marketing",
        element: <Marketing />,
      },
      {
        path: "analytics-2",
        element: <AnalyticsV2 />,
      },
      {
        path: "learning-management",
        element: <LMS />,
      },
      {
        path: "job-management",
        element: <JobManagement />,
      },
      {
        path: "add-user",
        element: <AddNewUser />,
      },
      {
        path: "edit-user",
        element: <EditUser />,
      },
      {
        path: "user-list",
        element: <UserListView />,
      },
      {
        path: "user-grid",
        element: <UserGridView />,
      },
      {
        path: "user-list-2",
        element: <UserListView2 />,
      },
      {
        path: "user-grid-2",
        element: <UserGridView2 />,
      },
      {
        path: "user-details",
        element: <UserDetails />,
      },

      //admin

      {
        path: "add-admin",
        element: <AddNewAdmin />,
      },
      {
        path: "edit-admin/:id",
        element: <EditAdmin />,
      },
      {
        path: "admin-list",
        element: <AdminListView />,
      },
      {
        path: "admin-grid",
        element: <AdminGridView />,
      },
      {
        path: "admin-list-2",
        element: <AdminListView2 />,
      },
      {
        path: "admin-grid-2",
        element: <AdminGridView2 />,
      },

      //organisers

      {
        path: "add-organiser",
        element: <AddNewOrganiser />,
      },
      {
        path: "edit-organiser",
        element: <EditOrganiser />,
      },
      {
        path: "organiser-list",
        element: <OrganiserListView />,
      },
      {
        path: "organiser-grid",
        element: <OrganiserGridView />,
      },
      {
        path: "organiser-list-2",
        element: <OrganiserListView2 />,
      },
      {
        path: "organiser-grid-2",
        element: <OrganiserGridView2 />,
      },
// coupons
      {
        path: "add-coupons",
        element: <AddNewCoupons />,
      },
      {
        path: "edit-coupons/:id",
        element: <EditCoupons />,
      },

      {
        path: "coupons-list",
        element: <CouponsListView />,
      },
      {
        path: "coupons-grid",
        element: <CouponsGridView />,
      },
      {
        path: "coupons-list-2",
        element: <CouponsListView2 />,
      },
      {
        path: "coupons-grid-2",
        element: <CouponsGridView2 />,
      },

// tnc
      {
        path: "add-tnc",
        element: <AddNewTnc />,
      },
      {
        path: "edit-tnc/:id",
        element: <EditTnc />,
      },
      {
        path: "tnc-details/:id",
        element: <DetailsTnc />,
      },

      {
        path: "tnc-list",
        element: <TncListView />,
      },
      {
        path: "tnc-grid",
        element: <TncGridView />,
      },
      {
        path: "tnc-list-2",
        element: <TncListView2 />,
      },
      {
        path: "tnc-grid-2",
        element: <TncGridView2 />,
      },

// faq
      {
        path: "add-faq",
        element: <AddNewFaq />,
      },
      {
        path: "edit-faq/:id",
        element: <EditFaq />,
      },
      {
        path: "details/:id",
        element: <FaqDetails />,
      },
      {
        path: "faq-list-2",
        element: <FaqListView2 />,
      },


// privacypolicy
      {
        path: "add-privacy-policy",
        element: <AddNewPrivacyPolicy />,
      },
      {
        path: "edit-privacy-policy/:id",
        element: <EditPrivacyPolicy />,
      },
    {
        path: "privacy-policy-details/:id",
        element: <DetailsPrivacyPolicy />,
      },
      {
        path: "privacy-policy-list",
        element: <PrivacyPolicyListView />,
      },
      {
        path: "privacy-policy-grid",
        element: <PrivacyPolicyGridView />,
      },
      {
        path: "privacy-policy-list-2",
        element: <PrivacyPolicyListView2 />,
      },
      {
        path: "privacy-policy-grid-2",
        element: <PrivacyPolicyGridView2 />,
      },

      // ticket type
      {
        path: "add-ticket-type",
        element: <AddNewTicketType />,
      },
      {
        path: "edit-ticket-type/:id",
        element: <EditTicketType />,
      },
      {
        path: "ticket-type-list",
        element: <TicketTypeListView />,
      },
      {
        path: "ticket-type-grid",
        element: <TicketTypeGridView />,
      },
      {
        path: "ticket-type-list-2",
        element: <TicketTypeListView2 />,
      },
      {
        path: "ticket-type-grid-2",
        element: <TicketTypeGridView2 />,
      },

      // ticket template
      {
        path: "add-ticket-template",
        element: <AddNewTicketTemplate />,
      },
      {
        path: "edit-ticket-template/:id",
        element: <EditTicketTemplate />,
      },
      {
        path: "ticket-template-list",
        element: <TicketTemplateListView />,
      },
      {
        path: "ticket-template-grid",
        element: <TicketTemplateGridView />,
      },
      {
        path: "ticket-template-list-2",
        element: <TicketTemplateListView2 />,
      },
      {
        path: "ticket-template-grid-2",
        element: <TicketTemplateGridView2 />,
      },
      
// addon category
      {
        path: "add-addoncategory",
        element: <AddNewAddonCategory />,
      },
      {
        path: "edit-addoncategory/:id",
        element: <EditAddonCategory />,
      },
      {
        path: "addoncategory-list",
        element: <AddonCategoryListView />,
      },
      {
        path: "addoncategory-grid",
        element: <AddonCategoryGridView />,
      },

      {
        path: "addoncategory-list-2",
        element: <AddonCategoryListView2 />,
      },
// addon 
      {
        path: "add-addon",
        element: <AddNewAddon />,
      },
      {
        path: "edit-addon/:id",
        element: <EditAddon />,
      },
      {
        path: "addon-list",
        element: <AddonListView />,
      },
      {
        path: "addon-grid",
        element: <AddonGridView />,
      },

      {
        path: "addon-list-2",
        element: <AddonListView2 />,
      },
      {
        path: "add-sports",
        element: <AddNewSports />,
      },
      {
        path: "sports-list",
        element: <SportsListView />,
      },
      {
        path: "sports-grid",
        element: <SportsGridView />,
      },
      {
        path: "sports-list-2",
        element: <SportsListView2 />,
      },
      {
        path: "sports-grid-2",
        element: <SportsGridView2 />,
      },

      {
        path: "geartypes-list",
        element: <GearTypesListView />,
      },
      {
        path: "geartypes-grid",
        element: <GearTypesGridView />,
      },
      {
        path: "geartypes-list-2",
        element: <GearTypesListView2 />,
      },
      {
        path: "geartypes-grid-2",
        element: <GearTypesGridView2 />,
      },
      {
        path: "add-gears",
        element: <AddNewGears />,
      },
      {
        path: "add-gearstype",
        element: <AddNewGearsType />,
      },
      {
        path: "gears-list",
        element: <GearsListView />,
      },
      {
        path: "gears-grid",
        element: <GearsGridView />,
      },
      {
        path: "gears-list-2",
        element: <GearsListView2 />,
      },
      {
        path: "gears-grid-2",
        element: <GearsGridView2 />,
      },

      {
        path: "account",
        element: <Account />,
      },
      {
        path: "invoice-list",
        element: <InvoiceList />,
      },
      {
        path: "create-invoice",
        element: <InvoiceCreate />,
      },
      {
        path: "invoice-details",
        element: <InvoiceDetails />,
      },
      {
        path: "product-list",
        element: <ProductList />,
      },
      {
        path: "product-grid",
        element: <ProductGrid />,
      },
      {
        path: "create-product",
        element: <ProductCreate />,
      },
      {
        path: "product-details",
        element: <ProductDetails />,
      },
      {
        path: "targets-list",
        element: <TargetsList />,
      },
      {
        path: "targets-grid",
        element: <TargetsGrid />,
      },
      {
        path: "create-targets",
        element: <TargetsCreate />,
      },
      {
        path: "targets-details",
        element: <TargetsDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "billing-address",
        element: <BillingAddress />,
      },
      {
        path: "payment-complete",
        element: <PaymentComplete />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "data-table-1",
        element: <DataTable1 />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "career",
        element: <Career />,
      },
      {
        path: "file-manager",
        element: <FileManager />,
      },
      {
        path: "support",
        element: <Support />,
      },
      {
        path: "create-ticket",
        element: <CreateTicket />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "todo-list",
        element: <TodoList />,
      },
      {
        path: "mail",
        children: [
          {
            path: "all",
            element: <AllMail />,
          },
          {
            path: "inbox",
            element: <Inbox />,
          },
          {
            path: "sent",
            element: <Sent />,
          },
          {
            path: "compose",
            element: <Compose />,
          },
          {
            path: "details",
            element: <MailDetails />,
          },
        ],
      },
      {
        path: "add-challenge",
        element: <AddChallenge />,
      },
      {
        path: "challenges",
        children: [
          {
            path: "version-1",
            element: <ProjectV1 />,
          },
          {
            path: "version-2",
            element: <ProjectV2 />,
          },
          {
            path: "version-3",
            element: <ProjectV3 />,
          },
          {
            path: "details",
            element: <ProjectDetails />,
          },
          {
            path: "team-member",
            element: <TeamMember />,
          },
        ],
      },

      {
        path: "events",
        children: [

          {
            path: "event-list",
            element: <EventsV5 />,
          },
          {
            path: "event-grid",
            element: <EventsV4 />,
          },
          { 
            path: "details/:id",
            element: <EventsDetails />,
          },
          {
            path: "team-member",
            element: <EventsTeamMember />,
          },
          {
            path: "edit-event",
            element: <EditEvents />,
          },
        ],
      },

      {
        path: "Bookings",
        children: [
          {
            path: "version-1",
            element: <BookingsV1 />,
          },
          {
            path: "version-2",
            element: <BookingsV2 />,
          },
          {
            path: "version-3",
            element: <BookingsV3 />,
          },
          {
            path: "details/:eventId",
            element: <BookingsDetails />,
          },
          {
            path: "slot-details/:eventId/:slotId",
            element: <SlotDetails />,
          },
          {
            path: "team-member",
            element: <BookingsTeamMember />,
          },
          {
            path: "edit-event",
            element: <EditBookings />,
          },
        ],
      },

    ],
  },
];
