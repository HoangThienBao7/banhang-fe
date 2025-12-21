import React, { Fragment, useContext, useEffect } from "react";
import { Button, Space, Typography } from "antd";
import {
  AppstoreOutlined,
  FilterOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ProductCategoryDropdown from "./ProductCategoryDropdown";
import { StoreContext } from "./StoreContext";

const { Text } = Typography;

const ProductCategory = (props) => {
  const { data, dispatch } = useContext(StoreContext);

  useEffect(() => {
    // 1. Create script tag
    const script = document.createElement("script");
    script.src = "https://app.tudongchat.com/js/chatbox.js";
    script.async = true;

    // 2. Append to body
    document.body.appendChild(script);

    // 3. Init chatbox
    script.onload = () => {
      if (typeof window.TuDongChat !== 'undefined') {
        const tudong_chatbox = new window.TuDongChat('5mTKohbMB-i-PcTxM_iHg');
        tudong_chatbox.initial();
      }
    };

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 0",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <Button
          type={data.categoryListDropdown ? "primary" : "default"}
          icon={<AppstoreOutlined />}
          onClick={() =>
            dispatch({
              type: "categoryListDropdown",
              payload: !data.categoryListDropdown,
            })
          }
          style={{
            height: "40px",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          Danh mục
          <DownOutlined
            style={{
              marginLeft: "8px",
              fontSize: "12px",
              transition: "transform 0.3s",
              transform: data.categoryListDropdown ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Button>

        <Space split={<span style={{ color: "#d9d9d9" }}>|</span>} size="middle">
          <Button
            type={data.filterListDropdown ? "primary" : "text"}
            icon={<FilterOutlined />}
            onClick={() =>
              dispatch({
                type: "filterListDropdown",
                payload: !data.filterListDropdown,
              })
            }
            style={{
              height: "40px",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            Lọc
          </Button>
          <Button
            type={data.searchDropdown ? "primary" : "text"}
            icon={<SearchOutlined />}
            onClick={() =>
              dispatch({
                type: "searchDropdown",
                payload: !data.searchDropdown,
              })
            }
            style={{
              height: "40px",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            Tìm kiếm
          </Button>
        </Space>
      </div>
      <ProductCategoryDropdown />
    </Fragment>
  );
};

export default ProductCategory;
