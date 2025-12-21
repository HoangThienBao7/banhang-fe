import React, { createContext, useReducer } from "react";

export const StoreContext = createContext();

export const storeState = {
  categoryListDropdown: false,
  filterListDropdown: false,
  searchDropdown: false,
  products: null,
  loading: false,
  sort: "newest",
};

export const storeReducer = (state, action) => {
  switch (action.type) {
    case "categoryListDropdown":
      return {
        ...state,
        categoryListDropdown: action.payload,
        filterListDropdown: false,
        searchDropdown: false,
      };
    case "filterListDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: action.payload,
        searchDropdown: false,
      };
    case "searchDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: false,
        searchDropdown: action.payload,
      };
    case "setProducts":
      return {
        ...state,
        products: action.payload,
      };
    case "searchHandleInReducer":
      return {
        ...state,
        products:
          action.productArray &&
          action.productArray.filter(
            (item) =>
              item.pName.toUpperCase().indexOf(action.payload.toUpperCase()) !==
              -1
          ),
      };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "sort":
      return {
        ...state,
        sort: action.payload,
      };
    default:
      return state;
  }
};
