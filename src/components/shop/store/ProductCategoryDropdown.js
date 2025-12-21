import React, { Fragment, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { StoreContext } from "./StoreContext";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct, productByPrice } from "../../admin/products/FetchApi";
import "../home/style.css";

const apiURL = process.env.REACT_APP_API_URL;

const CategoryList = () => {
  const history = useHistory();
  const { data } = useContext(StoreContext);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories);
      }
    } catch (error) {
    }
  };

  return (
    <div
      className={`${data.categoryListDropdown ? "" : "hidden"}`}
      style={{
        marginTop: "24px",
        paddingTop: "24px",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "16px",
        }}
      >
        {categories && categories.length > 0 ? (
          categories.map((item, index) => (
            <div
              key={index}
              onClick={() => history.push(`/products/category/${item._id}`)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 16px",
                cursor: "pointer",
                borderRadius: "12px",
                border: "1px solid #e8e8e8",
                backgroundColor: "#ffffff",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#1890ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#e8e8e8";
              }}
            >
              <img
                src={`${apiURL}/uploads/categories/${item.cImage}`}
                alt={item.cName}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid #f0f0f0",
                  padding: "4px",
                  marginBottom: "12px",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#262626",
                }}
              >
                {item.cName}
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px 0",
              color: "#8c8c8c",
              fontSize: "16px",
            }}
          >
            Chưa có danh mục nào
          </div>
        )}
      </div>
    </div>
  );
};

const FilterList = () => {
  const { data, dispatch } = useContext(StoreContext);

  const handleSortChange = (value) => {
    dispatch({ type: "sort", payload: value });
    dispatch({ type: "filterListDropdown", payload: !data.filterListDropdown });
  };

  return (
    <div
      className={`${data.filterListDropdown ? "" : "hidden"}`}
      style={{
        marginTop: "24px",
        paddingTop: "24px",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "20px",
          backgroundColor: "#fafafa",
          borderRadius: "12px",
          border: "1px solid #e8e8e8",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#262626",
            }}
          >
            Sắp xếp sản phẩm
          </div>
          <button
            onClick={() => dispatch({ type: "filterListDropdown", payload: !data.filterListDropdown })}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "#8c8c8c" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {[
            { label: "Mới nhất", value: "newest" },
            { label: "Giá tăng dần", value: "price_asc" },
            { label: "Giá giảm dần", value: "price_desc" },
            { label: "Đánh giá cao", value: "rating" },
          ].map((item) => (
            <div
              key={item.value}
              onClick={() => handleSortChange(item.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: data.sort === item.value ? "#e6f7ff" : "#fff",
                border: data.sort === item.value ? "1px solid #1890ff" : "1px solid #d9d9d9",
                color: data.sort === item.value ? "#1890ff" : "#262626",
                fontWeight: data.sort === item.value ? 600 : 400,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (data.sort !== item.value) {
                  e.currentTarget.style.borderColor = "#1890ff";
                  e.currentTarget.style.color = "#1890ff";
                }
              }}
              onMouseLeave={(e) => {
                if (data.sort !== item.value) {
                  e.currentTarget.style.borderColor = "#d9d9d9";
                  e.currentTarget.style.color = "#262626";
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Search = () => {
  const { data, dispatch } = useContext(StoreContext);
  const [search, setSearch] = useState("");
  const [productArray, setPa] = useState(null);

  const searchHandle = (e) => {
    setSearch(e.target.value);
    fetchData();
    dispatch({
      type: "searchHandleInReducer",
      payload: e.target.value,
      productArray: productArray,
    });
  };

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      setTimeout(async () => {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          setPa(responseData.Products);
          dispatch({ type: "loading", payload: false });
        }
      }, 700);
    } catch (error) {
    }
  };

  const closeSearchBar = () => {
    dispatch({ type: "searchDropdown", payload: !data.searchDropdown });
    fetchData();
    dispatch({ type: "setProducts", payload: productArray });
    setSearch("");
  };

  return (
    <div
      className={`${data.searchDropdown ? "" : "hidden"}`}
      style={{
        marginTop: "24px",
        paddingTop: "24px",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "20px",
          backgroundColor: "#fafafa",
          borderRadius: "12px",
          border: "1px solid #e8e8e8",
        }}
      >
        <input
          value={search}
          onChange={(e) => searchHandle(e)}
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "16px",
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            outline: "none",
            transition: "all 0.3s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#1890ff";
            e.target.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d9d9d9";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          onClick={closeSearchBar}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "#8c8c8c" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ProductCategoryDropdown = (props) => {
  return (
    <Fragment>
      <CategoryList />
      <FilterList />
      <Search />
    </Fragment>
  );
};

export default ProductCategoryDropdown;
