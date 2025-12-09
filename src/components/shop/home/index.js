import React, { Fragment, createContext, useReducer, useEffect, useState } from "react";
import Layout from "../layout";
import Slider from "./Slider";
import ProductCategory from "./ProductCategory";
import { homeState, homeReducer } from "./HomeContext";
import { Button, Typography, Spin } from "antd";
import { getDiscountProducts, getFeaturedProducts } from "../../admin/products/FetchApi";
import { ProductGrid } from "../store";

export const HomeContext = createContext();

const ProductSection = ({ title, products, loading, wishlist, setWishlist }) => {
  return (
    <Fragment>
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        <Typography.Title level={3} style={{ marginBottom: 16 }}>{title}</Typography.Title>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <ProductGrid products={products} wishlist={wishlist} setWishlist={setWishlist} />
        )}
      </section>
    </Fragment>
  );
};

const HomeComponent = () => {
  const [discounts, setDiscounts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loadingDiscount, setLoadingDiscount] = useState(false);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishList")) || []);

  useEffect(() => {
    const load = async () => {
      setLoadingDiscount(true);
      setLoadingFeatured(true);
      try {
        const [discountRes, featuredRes] = await Promise.all([
          getDiscountProducts(),
          getFeaturedProducts(8),
        ]);
        if (discountRes?.Products) setDiscounts(discountRes.Products);
        if (featuredRes?.Products) setFeatured(featuredRes.Products);
      } finally {
        setLoadingDiscount(false);
        setLoadingFeatured(false);
      }
    };
    load();
  }, []);

  return (
    <Fragment>
      <Slider />
      {/* Category, Search & Filter Section */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "32px 24px",
        }}
      >
        <ProductCategory />
      </section>
      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <div style={{ background: "#f7fbff", border: "1px solid #e6f7ff", borderRadius: 12, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ marginBottom: 12 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>Khám phá tất cả sản phẩm</Typography.Title>
            <Typography.Text style={{ color: "#595959" }}>Xem đầy đủ danh mục, bộ lọc và sắp xếp tại trang Cửa hàng.</Typography.Text>
          </div>
          <Button type="primary" size="large" href="/shop">
            Xem cửa hàng
          </Button>
        </div>
      </section>
      <ProductSection title="Sản phẩm giảm giá" products={discounts} loading={loadingDiscount} wishlist={wishlist} setWishlist={setWishlist} />
      <ProductSection title="Sản phẩm nổi bật" products={featured} loading={loadingFeatured} wishlist={wishlist} setWishlist={setWishlist} />
    </Fragment>
  );
};

const Home = (props) => {
  const [data, dispatch] = useReducer(homeReducer, homeState);
  return (
    <Fragment>
      <HomeContext.Provider value={{ data, dispatch }}>
        <Layout children={<HomeComponent />} />
      </HomeContext.Provider>
    </Fragment>
  );
};

export default Home;
