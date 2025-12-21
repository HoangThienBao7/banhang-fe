import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Blog = () => {
  const blogPosts = [
    {
      title: "Đánh giá Laptop AI HP OmniBook Ultra Flip 14: Quá xịn!",
      content: "HP OmniBook Ultra Flip 14, chiếc laptop 2-in-1 được tích hợp công nghệ AI tiên tiến vừa được HP ra mắt chắc chắn sẽ mang đến sự kết hợp hoàn hảo giữa thiết kế, hiệu năng và tính di động dành cho các bạn.",
      author: "Gia Trinh",
      date: "03/12/2025",
      image: "/img/list/blog_1.png",
      href: "https://phongvu.vn/cong-nghe/danh-gia-laptop-ai-hp-omnibook-ultra-flip-14/"
    },
    {
      title: "Top 5 laptop gaming RTX 5060 hiệu năng mạnh dành cho game thủ",
      content: "HP OmniBook Ultra Flip 14, chiếc laptop 2-in-1 được tích hợp công nghệ AI tiên tiến vừa được HP ra mắt chắc chắn sẽ mang đến sự kết hợp hoàn hảo giữa thiết kế, hiệu năng và tính di động dành cho các bạn.",
      author: "Quốc Thịnh",
      date: "19/10/2025",
      image: "/img/list/blog_2.png",
      href: "https://phongvu.vn/cong-nghe/top-laptop-gaming-rtx-5060-hieu-nang-manh/"
    },
        {
      title: "Bảng xếp hạng IQ của các chatbot AI thông minh nhất 2025",
      content: "Năm 2025 đánh dấu một bước tiến vượt bậc trong cuộc đua trí tuệ nhân tạo, với các mô hình chatbot AI ngày càng đạt đến những cột mốc IQ ấn tượng.",
      author: "Ngọc Anh",
      date: "04/12/2025",
      image: "/img/list/blog_3.png",
      href: "https://phongvu.vn/cong-nghe/xep-hang-iq-cua-chatbot-ai-thong-minh-nhat/"
    },
    {
      title: "Cách xử lý chuột không dây bị mất USB nhanh chóng",
      content: "Chuột không dây bị mất USB receiver là một trong những tình huống phổ biến khiến chúng ta gặp khó khăn trong quá trình sử dụng máy tính hoặc laptop.",
      author: "Tố Uyên",
      date: "08/11/2025",
      image: "/img/list/blog_4.png",
      href: "https://phongvu.vn/cong-nghe/cach-xu-ly-chuot-khong-day-bi-mat-usb/"
    },
  ];

  return (
    <div className="container mt-5 content">
  <h1 className="mb-4 text-center">Blog</h1>
  <div className="row">
    {blogPosts.map((post, index) => (
      <div key={index} className="col-md-6 mb-4">
        <a href={post.href} className="text-decoration-none">
          <div className="card h-100 shadow-sm">
            <img src={post.image} className="card-img-top" alt={post.title} />
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {post.author} - {post.date}
              </h6>
              <p className="card-text">{post.content}</p>
            </div>
          </div>
        </a>
      </div>
    ))}
  </div>
</div>

  );
};

export default Blog;
