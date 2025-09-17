// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import user from './apps/user'
import target from './apps/target'
import challenges from './apps/challenges'
import sports from './apps/sports'
import admins from './apps/admins'
import events from './apps/events'
import coupons from './apps/coupons'
import geartypes from './apps/geartypes'
import gears from './apps/gears'
import organisers from './apps/organisers'
import addons from './apps/addons'
import addonscategory from './apps/addonscategory'
import tickettype from './apps/tickettype'
import tickettemplate from './apps/tickettemplate'
import tnc from './apps/tnc'
import privacypolicy from './apps/privacypolicy'
import apptnc from './apps/apptnc'
import appprivacypolicy from './apps/appprivacypolicy'
import faq from './apps/faq'
import employee from "./apps/employee";
import Notification from "./apps/notification";
import platformSettings from "./apps/platformsettings";
import eventCategories from "./apps/eventscategory";
import analytics from "./apps/analytics";

export const store = configureStore({
  reducer: {
    user,
    target,
    challenges,
    sports,
    admins,
    events,
    coupons,
    geartypes,
    gears,
    organisers,
    addons,
    addonscategory,
    tickettype,
    tickettemplate,
    tnc,
    privacypolicy,
    faq,
    employee,
    Notification,
    platformSettings,
    eventCategories,
    apptnc,
    appprivacypolicy,
    analytics,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
  
