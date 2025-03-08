import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  mode: "light",
  user: null,
  roles: null,
  permissions: null,
  token: null,
  fetchvaluationreports: true,
  valuationLocationDetails: null,
  valuationPropertynDetails: null,
  valuationValuationDetails: null,
  reportDoc: null,
  reportSignatories: null,
  reportRecepient: null,
  selectedPropertyType: null,
  selectedRecipient: null,
  recipientUsernames: null,
  recipientEmails: null,
  recipientPhones: null,
  selectedAccesors: null,
  gpsDetails: null,
  recipientRecipients: [],
  currentSelectedOrg: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, roles, permissions, access_token } = action.payload;
      state.user = {
        ...user,
        role_name: roles && roles.length > 0 ? roles[0] : null
      };
      state.roles = roles ? roles : state.roles;
      state.permissions = permissions ? permissions : state.permissions;
      state.token = access_token;
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
    },
    updateUserDetails: (state, action) => {
      const { user, roles, permissions, access_token } = action.payload;
      state.user = user;
    },
    setfetchvaluationreports: (state, action) => {
      state.fetchvaluationreports = action.payload;
    },
    setValuationLocationDetails: (state, action) => {
      state.valuationLocationDetails = action.payload;
    },
    setValuationPropertyDetails: (state, action) => {
      state.valuationPropertynDetails = action.payload;
    },
    setValuationDetails: (state, action) => {
      state.valuationValuationDetails = action.payload;
    },
    setReportRecipient: (state, action) => {
      state.reportRecepient = action.payload;
    },
    setReportSignatories: (state, action) => {
      state.reportSignatories = action.payload;
    },
    setSelectedPropertyType: (state, action) => {
      state.selectedPropertyType = action.payload;
    },
    setSelectedRecipient: (state, action) => {
      state.selectedRecipient = action.payload;
    },
    setRecipientUsernames: (state, action) => {
      state.recipientUsernames = action.payload;
    },
    setRecipientEmails: (state, action) => {
      state.recipientEmails = action.payload;
    },
    setRecipientPhone: (state, action) => {
      state.recipientPhones = action.payload;
    },
    setSelectedAccesors: (state, action) => {
      state.selectedAccesors = action.payload;
    },
    setCurrentSelectedOrg: (state, action) => {
      state.currentSelectedOrg = action.payload;
    },
    setRecipientRecipients: (state, action) => {
      let old = state.recipientRecipients;

      console.log(old);
      if (old === null) {
        state.recipientRecipients = [[], action.payload];
      } else {
        state.recipientRecipients = [...state.recipientRecipients, action.payload];
      }
    },
    upDateRecipientRecipients: (state, action) => {
      let recipients = state.recipientRecipients;
      state.recipientRecipients = null;
      if (recipients) {
        let updatedRecipients = [...recipients];
        updatedRecipients.splice(action.payload, 1);
        state.recipientRecipients = updatedRecipients;
      }
    },
    upDateRecipientRecipientsProperty: (state, action) => {
      console.log(action.payload, "payload details");
      if (action.payload.property === 1) {
        console.log(state.recipientRecipients[action.payload.index], "Name to up");
        state.recipientRecipients[action.payload.index].name = action.payload.value;
      } else if (action.payload.property === 2) {
        state.recipientRecipients[action.payload.index].email = action.payload.value;
      } else if (action.payload.property === 3) {
        state.recipientRecipients[action.payload.index].phone = action.payload.value;
      }
    },
    setGpsDetails: (state, action) => {
      state.gpsDetails = action.payload;
    },
    clearValuationReportData: (state, action) => {
      state.reportDoc = null;
      state.reportSignatories = null;
      state.reportRecepient = null;
      state.selectedPropertyType = null;
      state.selectedRecipient = null;
      state.recipientUsernames = null;
      state.recipientEmails = null;
      state.recipientPhones = null;
      state.selectedAccesors = null;
      state.gpsDetails = null;
      state.recipientRecipients = null;
      state.valuationLocationDetails = null;
      state.valuationPropertynDetails = null;
      state.valuationValuationDetails = null;
    },
  },
});

export const {
  clearValuationReportData,
  setRecipientRecipients,
  upDateRecipientRecipientsProperty,
  setGpsDetails,
  upDateRecipientRecipients,
  setSelectedAccesors,
  setRecipientUsernames,
  setRecipientPhone,
  setRecipientEmails,
  setSelectedRecipient,
  setSelectedPropertyType,
  setReportSignatories,
  setReportRecipient,
  updateUserDetails,
  setCredentials,
  logOut,
  setMode,
  setfetchvaluationreports,
  setValuationLocationDetails,
  setValuationPropertyDetails,
  setValuationDetails,
  setCurrentSelectedOrg,
} = authSlice.actions;

export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentRecipient = (state) => state.auth.reportRecepient;
export const selectCurrentSignatories = (state) => state.auth.reportSignatories;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRoles = (state) => state.auth.roles;
export const selectCurrentPermissions = (state) => state.auth.permissions;
export const istofetchvaluationreports = (state) => state.auth.fetchvaluationreports;
export const selectLocationDetails = (state) => state.auth.valuationLocationDetails;
export const selectPropertyDetails = (state) => state.auth.valuationPropertynDetails;
export const selectValuationDetails = (state) => state.auth.valuationValuationDetails;
export const selectSelectedPropertyType = (state) => state.auth.selectedPropertyType;
export const selectSelectedRecipient = (state) => state.auth.selectedRecipient;
export const selecteedaccesors = (state) => state.auth.selectedAccesors;
export const selectGPSDetails = (state) => state.auth.gpsDetails;
export const selectRecipientRecipients = (state) => state.auth.recipientRecipients;
export const selectCurrentSelectedOrg = (state) => state.auth.currentSelectedOrg;
