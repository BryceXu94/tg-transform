export const EventBusMap = {
  ORDER_MANAGE: {
    ORDER: {
      ORDER_DETAIL: {
        REFRESH_PURCHASER_RECEIVED_INFO: 'refreshPurchaserReceivedInfo', // 刷新采购商货款信息
        REFRESH_SUPPLIER_PAYMENT_INFO: 'refreshSupplierPaymentInfo', // 刷新供应商货款信息
        REFRESH_ORDER_INFO: 'RefreshOrderInfo', // 刷新订单详情信息
        REFRESH_ORDER_NAVIGATION_INFO: 'RefreshOrderNavigationInfo', // 刷新订单进度信息
        REFRESH_ORDER_APPROVAL_INFO: 'RefreshOrderApprovalInfo', // 刷新订单审批列表
        REFRESH_ORDER_ADVANCE_INFO: 'RefreshOrderAdvanceInfo', // 刷新货款信息tab最新垫付信息
        REFRESH_AFTER_SALE_INFO: 'RefreshAfterSaleInfo', // 刷新售后信息
        REFRESH_DELIVERY_INFO: 'RefreshDeliveryInfo', // 刷新配发货信息
      },
    },
  },
};
