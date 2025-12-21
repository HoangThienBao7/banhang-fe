import React, { Fragment, useEffect, useState, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import Layout from "../layout";
import { Card, Spin, Empty, Rate, Tag, Row, Col, Select, Typography, Button } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { getAllProduct } from "../../admin/products/FetchApi";
import { formatVND } from "../../../utils/formatCurrency";
import { StoreContext, storeState, storeReducer } from "./StoreContext";
import ProductCategory from "./ProductCategory";

const { Meta } = Card;
const { Title } = Typography;
const { Option } = Select;
const apiURL = process.env.REACT_APP_API_URL;

export const ProductGrid = ({ products, wishlist, setWishlist }) => {
  const history = useHistory();

  const isWish = (id, list) => list.some((i) => i === id);
  const addWish = (id) => {
    const next = [...wishlist, id];
    localStorage.setItem("wishList", JSON.stringify(next));
    setWishlist(next);
  };
  const removeWish = (id) => {
    const next = wishlist.filter((i) => i !== id);
    localStorage.setItem("wishList", JSON.stringify(next));
    setWishlist(next);
  };

  if (!products || products.length === 0) {
    return (
      <div style={{ padding: "80px 0" }}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span style={{ color: "#8c8c8c" }}>Không tìm thấy sản phẩm</span>} />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {products.map((item) => {
        const wish = isWish(item._id, wishlist);
        const avgRating = item.pRatingsReviews && item.pRatingsReviews.length > 0
          ? item.pRatingsReviews.reduce((sum, r) => sum + Number(r.rating), 0) / item.pRatingsReviews.length
          : 0;

        return (
          <Col xs={12} sm={12} md={8} lg={6} key={item._id}>
            <Card
              hoverable
              style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #f0f0f0" }}
              bodyStyle={{ padding: 16 }}
              cover={
                <div style={{ position: "relative", width: "100%", paddingTop: "130%", background: "#f5f5f5" }}>
                  <img
                    alt={item.pName}
                    src={`${apiURL}/uploads/products/${item.pImages[0]}`}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", cursor: "pointer" }}
                    onClick={() => history.push(`/products/${item._id}`)}
                  />
                  <Button
                    type="text"
                    icon={wish ? <HeartFilled /> : <HeartOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (wish) removeWish(item._id);
                      else addWish(item._id);
                    }}
                    style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.9)", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: wish ? "#ff4d4f" : "#8c8c8c", fontSize: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                  />
                  {item.pOffer && item.pOffer !== "0" && (
                    <Tag color="red" style={{ position: "absolute", top: 12, left: 12, borderRadius: 6, fontWeight: "bold" }}>
                      -{item.pOffer}%
                    </Tag>
                  )}
                </div>
              }
              onClick={() => history.push(`/products/${item._id}`)}
            >
              <Meta
                title={<div style={{ fontSize: 16, fontWeight: 600, color: "#262626", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", minHeight: 48 }}>{item.pName}</div>}
                description={
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <Rate disabled defaultValue={avgRating} allowHalf style={{ fontSize: 14 }} />
                      <span style={{ marginLeft: 8, color: "#8c8c8c", fontSize: 12 }}>({item.pRatingsReviews?.length || 0})</span>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: "bold", color: "#1890ff", marginTop: 8 }}>
                      {formatVND(item.pPrice)}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

const ShopComponent = () => {
  const { data, dispatch } = useContext(StoreContext);
  const [display, setDisplay] = useState([]);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishList")) || []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "loading", payload: true });
      try {
        const res = await getAllProduct();
        if (res && res.Products) {
          dispatch({ type: "setProducts", payload: res.Products });
        }
      } finally {
        dispatch({ type: "loading", payload: false });
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (data.products) {
      let arr = [...data.products];
      if (data.sort === "price_asc") arr.sort((a, b) => a.pPrice - b.pPrice);
      else if (data.sort === "price_desc") arr.sort((a, b) => b.pPrice - a.pPrice);
      else if (data.sort === "rating") arr.sort((a, b) => {
        const ar = a.pRatingsReviews?.length ? a.pRatingsReviews.reduce((sum, r) => sum + Number(r.rating), 0) / a.pRatingsReviews.length : 0;
        const br = b.pRatingsReviews?.length ? b.pRatingsReviews.reduce((sum, r) => sum + Number(r.rating), 0) / b.pRatingsReviews.length : 0;
        return br - ar;
      });
      else arr.sort((a, b) => (a._id < b._id ? 1 : -1));
      setDisplay(arr);
    } else {
      setDisplay([]);
    }
  }, [data.sort, data.products]);

  return (
    <Fragment>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
        <Title level={2} style={{ marginBottom: 16 }}>Cửa hàng</Title>
        <div style={{ marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
          <ProductCategory />
        </div>
        {data.loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <ProductGrid products={display} wishlist={wishlist} setWishlist={setWishlist} />
        )}
      </section>
    </Fragment>
  );
};

const Shop = () => {
  const [data, dispatch] = useReducer(storeReducer, storeState);
  return (
    <Fragment>
      <StoreContext.Provider value={{ data, dispatch }}>
        <Layout children={<ShopComponent />} />
      </StoreContext.Provider>
    </Fragment>
  );
};

export default Shop;
