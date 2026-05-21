package com.ecommerce.common.service;

import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderDetail;
import org.springframework.stereotype.Component;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Component
public class EmailTemplateBuilder {

    public String buildOrderConfirmationHtml(Order order) {
        NumberFormat currencyFormat = NumberFormat.getInstance(new Locale("vi", "VN"));
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy");

        String orderDate = order.getCreatedAt() != null
                ? order.getCreatedAt().format(dtf)
                : "---";

        StringBuilder itemsHtml = new StringBuilder();
        if (order.getOrderDetails() != null) {
            for (OrderDetail detail : order.getOrderDetails()) {
                String productName = detail.getProduct() != null ? detail.getProduct().getName() : "Sản phẩm";
                String variantInfo = "";
                if (detail.getVariant() != null) {
                    String storage = detail.getVariant().getStorage() != null ? detail.getVariant().getStorage() : "";
                    String colorName = (detail.getVariant().getColor() != null && detail.getVariant().getColor().getName() != null)
                            ? detail.getVariant().getColor().getName() : "";
                    variantInfo = (!storage.isEmpty() || !colorName.isEmpty())
                            ? " <span style='color:#888;font-size:13px;'>(" + storage + ((!storage.isEmpty() && !colorName.isEmpty()) ? " / " : "") + colorName + ")</span>"
                            : "";
                }
                double lineTotal = detail.getPrice() * detail.getQuantity();
                itemsHtml.append("""
                        <tr>
                          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">
                            <div style="font-weight:500;color:#1a1a1a;">%s%s</div>
                          </td>
                          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;color:#555;">x%d</td>
                          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:500;color:#e65c00;">%s₫</td>
                        </tr>
                        """.formatted(productName, variantInfo, detail.getQuantity(), currencyFormat.format(lineTotal)));
            }
        }

        String totalFormatted = currencyFormat.format(order.getTotalPrice());

        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                  <meta charset="UTF-8"/>
                  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
                </head>
                <body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:30px 0;">
                    <tr><td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                
                        <!-- HEADER -->
                        <tr>
                          <td style="background:linear-gradient(135deg,#1a1a2e 0%%,#16213e 50%%,#0f3460 100%%);padding:36px 40px;text-align:center;">
                            <div style="font-size:32px;margin-bottom:8px;">📱</div>
                            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.5px;">Phone Store</h1>
                            <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Cảm ơn bạn đã mua hàng!</p>
                          </td>
                        </tr>
                
                        <!-- SUCCESS BANNER -->
                        <tr>
                          <td style="background:#f0fdf4;padding:20px 40px;text-align:center;border-bottom:1px solid #dcfce7;">
                            <span style="font-size:28px;">✅</span>
                            <h2 style="margin:8px 0 4px;color:#15803d;font-size:18px;font-weight:600;">Đặt hàng thành công!</h2>
                            <p style="margin:0;color:#555;font-size:14px;">Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý.</p>
                          </td>
                        </tr>
                
                        <!-- ORDER INFO -->
                        <tr>
                          <td style="padding:28px 40px 0;">
                            <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
                              <tr>
                                <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                                  <span style="color:#888;font-size:13px;">Mã đơn hàng</span>
                                  <div style="font-weight:700;color:#1a1a1a;font-size:16px;margin-top:2px;">#%s</div>
                                </td>
                                <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;text-align:right;">
                                  <span style="color:#888;font-size:13px;">Thời gian đặt</span>
                                  <div style="font-weight:600;color:#1a1a1a;font-size:14px;margin-top:2px;">%s</div>
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2" style="padding:16px 20px;">
                                  <span style="color:#888;font-size:13px;">Trạng thái</span>
                                  <div style="margin-top:4px;">
                                    <span style="background:#fef3c7;color:#92400e;font-size:13px;font-weight:600;padding:4px 12px;border-radius:20px;">⏳ Chờ xác nhận</span>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                
                        <!-- SHIPPING INFO -->
                        <tr>
                          <td style="padding:20px 40px 0;">
                            <h3 style="margin:0 0 12px;color:#1a1a1a;font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">📦 Thông tin giao hàng</h3>
                            <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                              <tr>
                                <td style="padding:12px 20px;border-bottom:1px solid #e2e8f0;">
                                  <span style="color:#888;font-size:13px;">Người nhận</span>
                                  <div style="font-weight:600;color:#1a1a1a;margin-top:2px;">%s</div>
                                </td>
                                <td style="padding:12px 20px;border-bottom:1px solid #e2e8f0;">
                                  <span style="color:#888;font-size:13px;">Số điện thoại</span>
                                  <div style="font-weight:600;color:#1a1a1a;margin-top:2px;">%s</div>
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2" style="padding:12px 20px;">
                                  <span style="color:#888;font-size:13px;">Địa chỉ giao hàng</span>
                                  <div style="font-weight:500;color:#1a1a1a;margin-top:2px;">%s</div>
                                </td>
                              </tr>
                              %s
                            </table>
                          </td>
                        </tr>
                
                        <!-- PRODUCTS TABLE -->
                        <tr>
                          <td style="padding:20px 40px 0;">
                            <h3 style="margin:0 0 12px;color:#1a1a1a;font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">🛒 Sản phẩm đã đặt</h3>
                            <table width="100%%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
                              <thead>
                                <tr style="background:#f1f5f9;">
                                  <th style="padding:10px 12px;text-align:left;font-size:13px;color:#666;font-weight:600;">Sản phẩm</th>
                                  <th style="padding:10px 12px;text-align:center;font-size:13px;color:#666;font-weight:600;">SL</th>
                                  <th style="padding:10px 12px;text-align:right;font-size:13px;color:#666;font-weight:600;">Thành tiền</th>
                                </tr>
                              </thead>
                              <tbody>
                                %s
                              </tbody>
                            </table>
                          </td>
                        </tr>
                
                        <!-- TOTAL -->
                        <tr>
                          <td style="padding:16px 40px 0;">
                            <table width="100%%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fff7ed,#fff3e0);border-radius:12px;border:1px solid #fed7aa;">
                              <tr>
                                <td style="padding:16px 20px;">
                                  <span style="color:#555;font-size:15px;font-weight:500;">Tổng thanh toán</span>
                                </td>
                                <td style="padding:16px 20px;text-align:right;">
                                  <span style="color:#e65c00;font-size:22px;font-weight:800;">%s₫</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                
                        <!-- FOOTER NOTE -->
                        <tr>
                          <td style="padding:24px 40px 32px;">
                            <div style="background:#eff6ff;border-radius:10px;padding:16px 20px;border-left:4px solid #3b82f6;">
                              <p style="margin:0;color:#1d4ed8;font-size:13px;line-height:1.6;">
                                💬 <strong>Lưu ý:</strong> Chúng tôi sẽ liên hệ với bạn trong vòng <strong>24 giờ</strong> để xác nhận đơn hàng.
                                Nếu cần hỗ trợ, vui lòng liên hệ hotline hoặc fanpage của chúng tôi.
                              </p>
                            </div>
                          </td>
                        </tr>
                
                        <!-- BOTTOM FOOTER -->
                        <tr>
                          <td style="background:#1a1a2e;padding:20px 40px;text-align:center;">
                            <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;">
                              © 2025 Phone Store. Email này được gửi tự động, vui lòng không reply.
                            </p>
                          </td>
                        </tr>
                
                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """.formatted(
                order.getOrderCode(),
                orderDate,
                order.getCustomerName(),
                order.getPhone(),
                order.getAddress(),
                buildNoteHtml(order.getNote()),
                itemsHtml.toString(),
                totalFormatted
        );
    }

    private String buildNoteHtml(String note) {
        if (note == null || note.isBlank()) return "";
        return """
                <tr>
                  <td colspan="2" style="padding:12px 20px;border-top:1px solid #e2e8f0;">
                    <span style="color:#888;font-size:13px;">Ghi chú</span>
                    <div style="font-style:italic;color:#555;margin-top:2px;">%s</div>
                  </td>
                </tr>
                """.formatted(note);
    }
}
