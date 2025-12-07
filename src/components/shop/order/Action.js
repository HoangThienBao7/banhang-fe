import { createOrder, createVNPayPayment } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  totalCost,
  history
) => {
  if (!state.address) {
    setState({ ...state, error: "Vui lòng nhập địa chỉ giao hàng" });
    return;
  } else if (!state.phone) {
    setState({ ...state, error: "Vui lòng nhập số điện thoại" });
    return;
  }

  const paymentMethod = state.paymentMethod || "COD";

  if (paymentMethod === "VNPAY") {
    dispatch({ type: "loading", payload: true });

    try {
      const cart = JSON.parse(localStorage.getItem("cart"));
      const userId = JSON.parse(localStorage.getItem("jwt")).user._id;
      const amount = totalCost();
      const transactionId = Date.now().toString();

      const tempOrderData = {
        allProduct: cart,
        user: userId,
        amount: amount,
        transactionId: transactionId,
        address: state.address,
        phone: state.phone,
        paymentMethod: "VNPAY",
      };

      const paymentData = {
        orderId: transactionId,
        amount: amount,
        orderDescription: `Thanh toan don hang ${transactionId}`,
        orderData: tempOrderData,
      };

      const vnpayResponse = await createVNPayPayment(paymentData);
      
      if (vnpayResponse.success && vnpayResponse.paymentUrl) {
        dispatch({ type: "loading", payload: false });
        window.location.replace(vnpayResponse.paymentUrl);
        return;
      } else {
        setState({ ...state, error: vnpayResponse.error || "Không thể tạo link thanh toán VNPay. Vui lòng thử lại." });
        dispatch({ type: "loading", payload: false });
        return;
      }
    } catch (error) {
      setState({ ...state, error: "Đã xảy ra lỗi khi tạo link thanh toán. Vui lòng thử lại." });
      dispatch({ type: "loading", payload: false });
      return;
    }
  } else {
    dispatch({ type: "loading", payload: true });
    
    let orderData = {
      allProduct: JSON.parse(localStorage.getItem("cart")),
      user: JSON.parse(localStorage.getItem("jwt")).user._id,
      amount: totalCost(),
      transactionId: Date.now(),
      address: state.address,
      phone: state.phone,
      paymentMethod: "COD",
    };

    try {
      let responseData = await createOrder(orderData);
      
      if (responseData.error || responseData.message) {
        setState({ ...state, error: responseData.error || responseData.message });
        dispatch({ type: "loading", payload: false });
        return;
      }

      if (responseData.success || responseData.Order) {
        // Xóa giỏ hàng và redirect về trang chủ
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch({ type: "cartProduct", payload: null });
        dispatch({ type: "cartTotalCost", payload: null });
        dispatch({ type: "orderSuccess", payload: true });
        dispatch({ type: "loading", payload: false });
        return history.push("/");
      }
    } catch (error) {
      setState({ ...state, error: "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại." });
      dispatch({ type: "loading", payload: false });
    }
  }
};
