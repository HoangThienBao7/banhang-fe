import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Spin,
  Alert,
  Empty,
  Typography,
  Divider,
  Space,
  Image,
  Tag,
  Radio,
} from "antd";
import {
  ShoppingCartOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  CreditCardOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";
import { formatVND } from "../../../utils/formatCurrency";
import AddressSelector from "./AddressSelector";

import { cartListProduct } from "../partials/FetchApi";
import { fetchData, pay } from "./Action";

const { Title, Text } = Typography;
const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);
  const [form] = Form.useForm();

  const [state, setState] = useState({
    address: "",
    phone: "",
    paymentMethod: "COD",
    error: false,
    success: false,
  });

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values) => {
    // Lấy paymentMethod từ form values
    const paymentMethod = values.paymentMethod || "COD";
    
    
    const formData = {
      address: values.address,
      phone: values.phone,
      paymentMethod: paymentMethod,
      error: false,
      success: false,
    };
    
    // Gọi hàm pay với paymentMethod đã được xác định
    await pay(data, dispatch, formData, setState, totalCost, history);
  };

  if (data.loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  const totalAmount = data.cartProduct
    ? data.cartProduct.reduce((sum, product) => {
        return sum + subTotal(product._id, product.pPrice);
      }, 0)
    : 0;

  return (
    <Fragment>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Header */}
          <div>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => history.push("/")}
              style={{ marginBottom: "16px" }}
            >
              Quay lại
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              <ShoppingCartOutlined /> Thanh toán
            </Title>
            <Text type="secondary">Vui lòng kiểm tra thông tin đơn hàng và điền thông tin giao hàng</Text>
          </div>

          <Row gutter={[24, 24]}>
            {/* Products List */}
            <Col xs={24} lg={14}>
              <Card
                title={
                  <Space>
                    <ShoppingCartOutlined />
                    <span>Sản phẩm trong giỏ hàng</span>
                    {data.cartProduct && (
                      <Tag color="blue">{data.cartProduct.length} sản phẩm</Tag>
                    )}
                  </Space>
                }
                style={{ borderRadius: "12px" }}
                bodyStyle={{ padding: "16px" }}
              >
                <CheckoutProducts products={data.cartProduct} />
              </Card>
            </Col>

            {/* Order Form */}
            <Col xs={24} lg={10}>
              <Card
                title={
                  <Space>
                    <CheckCircleOutlined />
                    <span>Thông tin giao hàng</span>
                  </Space>
                }
                style={{ borderRadius: "12px" }}
                bodyStyle={{ padding: "24px" }}
              >
                {state.error && (
                  <Alert
                    message={state.error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setState({ ...state, error: false })}
                    style={{ marginBottom: "24px" }}
                  />
                )}

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                    address: state.address,
                    phone: state.phone,
                  }}
                >
                  <Form.Item
                    label={
                      <Space>
                        <EnvironmentOutlined />
                        <span>Địa chỉ giao hàng</span>
                      </Space>
                    }
                    name="address"
                    rules={[
                      { required: true, message: "Vui lòng chọn địa chỉ giao hàng đầy đủ" },
                      { min: 10, message: "Địa chỉ phải có ít nhất 10 ký tự" },
                    ]}
                  >
                    <AddressSelector
                      value={form.getFieldValue("address")}
                      onChange={(value) => {
                        form.setFieldsValue({ address: value });
                      }}
                      form={form}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <Space>
                        <PhoneOutlined />
                        <span>Số điện thoại</span>
                      </Space>
                    }
                    name="phone"
                    rules={[
                      { required: true, message: "Vui lòng nhập số điện thoại" },
                      {
                        pattern: /^[0-9]{10,11}$/,
                        message: "Số điện thoại không hợp lệ (10-11 số)",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      prefix="+84"
                      maxLength={11}
                    />
                  </Form.Item>

                  <Divider />

                  {/* Payment Method */}
                  <Form.Item
                    label={
                      <Space>
                        <CreditCardOutlined />
                        <span>Phương thức thanh toán</span>
                      </Space>
                    }
                    name="paymentMethod"
                    initialValue="COD"
                    rules={[
                      { required: true, message: "Vui lòng chọn phương thức thanh toán" },
                    ]}
                  >
                    <Radio.Group>
                      <Space direction="vertical">
                        <Radio value="COD">
                          <Space>
                            <DollarOutlined />
                            <span>Thanh toán khi nhận hàng (COD)</span>
                          </Space>
                        </Radio>
                        <Radio value="VNPAY">
                          <Space>
                            <CreditCardOutlined />
                            <span>Thanh toán qua VNPay</span>
                            <Tag color="blue">An toàn</Tag>
                          </Space>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

                  <Divider />

                  {/* Order Summary */}
                  <div
                    style={{
                      background: "#f5f5f5",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text strong>Tổng tiền:</Text>
                        <Text strong style={{ fontSize: "20px", color: "#1890ff" }}>
                          {formatVND(totalAmount)}
                        </Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        * Phí vận chuyển sẽ được tính khi xác nhận đơn hàng
                      </Text>
                    </Space>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      icon={<CheckCircleOutlined />}
                      style={{
                        height: "48px",
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                    >
                      Đặt hàng
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </Space>
      </div>
    </Fragment>
  );
};

const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  if (!products || products.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Không có sản phẩm nào trong giỏ hàng"
      >
        <Button type="primary" onClick={() => history.push("/")}>
          Tiếp tục mua sắm
        </Button>
      </Empty>
    );
  }

  const totalAmount = products.reduce((sum, product) => {
    return sum + subTotal(product._id, product.pPrice);
  }, 0);

  return (
    <Fragment>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {products.map((product, index) => {
          const qty = quantity(product._id);
          const subtotal = subTotal(product._id, product.pPrice);

          return (
            <Card
              key={index}
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Row gutter={16} align="middle">
                <Col xs={24} sm={6}>
                  <Image
                    src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                    alt={product.pName}
                    preview={false}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => history.push(`/products/${product._id}`)}
                  />
                </Col>
                <Col xs={24} sm={18}>
                  <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <Title
                      level={5}
                      style={{
                        margin: 0,
                        cursor: "pointer",
                      }}
                      onClick={() => history.push(`/products/${product._id}`)}
                    >
                      {product.pName}
                    </Title>
                    <Row gutter={16}>
                      <Col xs={12} sm={6}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Giá
                        </Text>
                        <div>
                          <Text strong>{formatVND(product.pPrice)}</Text>
                        </div>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Số lượng
                        </Text>
                        <div>
                          <Tag color="blue">{qty}</Tag>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div style={{ textAlign: "right" }}>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Thành tiền
                          </Text>
                          <div>
                            <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
                              {formatVND(subtotal)}
                            </Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Space>
                </Col>
              </Row>
            </Card>
          );
        })}

        <Divider />

        {/* Total Summary */}
        <Card
          style={{
            background: "#fafafa",
            borderRadius: "8px",
          }}
          bodyStyle={{ padding: "16px" }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong style={{ fontSize: "18px" }}>
                Tổng cộng:
              </Text>
            </Col>
            <Col>
              <Text strong style={{ fontSize: "24px", color: "#1890ff" }}>
                {formatVND(totalAmount)}
              </Text>
            </Col>
          </Row>
        </Card>
      </Space>
    </Fragment>
  );
};

export default CheckoutProducts;
