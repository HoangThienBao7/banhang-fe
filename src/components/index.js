import React from "react";
import {
  Home,
  BlogIndex,
  ContactIndex,
  WishList,
  PageNotFound,
  ProductDetails,
  ProductByCategory,
  CheckoutPage,
  VNPayReturn,
  Shop,
} from "./shop";
import { DashboardAdmin, Categories, Products, Orders } from "./admin";
import { UserProfile, UserOrders, SettingUser } from "./shop/dashboardUser";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/* Routing All page will be here */
const Routes = (props) => {
  return (
    <Router>
      <Switch>
        {/* Shop & Public Routes */}
        <Route exact path="/" component={Home} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/wish-list" component={WishList} />
        <Route exact path="/products/:id" component={ProductDetails} />
        <Route exact path="/blog" component={BlogIndex} />
        <Route exact path="/contact-us" component={ContactIndex} />
        <Route
          exact
          path="/products/category/:catId"
          component={ProductByCategory}
        />
        <Route exact path="/checkout" component={CheckoutPage} />
        <Route
          exact
          path="/payment/vnpay-return"
          component={VNPayReturn}
        />
        {/* Shop & Public Routes End */}

        {/* Admin Routes */}
        <Route exact path="/admin/dashboard" component={DashboardAdmin} />
        <Route exact path="/admin/dashboard/categories" component={Categories} />
        <Route exact path="/admin/dashboard/products" component={Products} />
        <Route exact path="/admin/dashboard/orders" component={Orders} />
        {/* Admin Routes End */}

        {/* User Dashboard */}
        <Route exact path="/user/profile" component={UserProfile} />
        <Route exact path="/user/orders" component={UserOrders} />
        <Route exact path="/user/setting" component={SettingUser} />
        {/* User Dashboard End */}

        {/* 404 Page */}
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  );
};

export default Routes;
