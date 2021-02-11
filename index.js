
let data_obj = {
  count: 0,
  gross_sales: 0,
  discounts: 0,
  refunds: 0,
  shipping: 0,
  taxes: 0,
  total_sales: 0,
  net_sales: 0,
};
let date = new Date();
let new_date = new Date();
//let old_date = new Date(date.setMonth(date.getMonth() - 1))
let old_date = new Date(date.setDate(date.getDate() - 1));
let count = 0;
async function getData(shopify) {
  let params = {
    limit: 10,
    created_at_min: old_date,
    created_at_max: new_date,
    status: "any",
  };
  do {
    const orders = await shopify.order.list(params);
    orders.map((item) => {
      if (item.financial_status !== "voided") {
        if (item.financial_status === "partially_refunded") {
          let refunds = 0;
          item.refunds.forEach((r1) => {
            r1.transactions.forEach((r2) => {
              refunds += Number(r2.amount);
            });
          });
          data_obj.count = data_obj.count + 1;
          data_obj.refunds = data_obj.refunds + refunds;
          data_obj.gross_sales =
            data_obj.gross_sales + Number(item.total_line_items_price);
          data_obj.discounts =
            data_obj.discounts + Number(item.total_discounts);
          data_obj.shipping =
            data_obj.shipping +
            Number(item.total_shipping_price_set.shop_money.amount);
          data_obj.taxes = data_obj.taxes + Number(item.total_tax);
          data_obj.net_sales =
            data_obj.net_sales +
            Number(item.total_line_items_price) -
            Number(item.total_discounts) -
            refunds;
          data_obj.total_sales =
            data_obj.total_sales +
            Number(item.total_line_items_price) -
            Number(item.total_discounts) -
            refunds +
            Number(item.total_tax) +
            Number(item.total_shipping_price_set.shop_money.amount);
        } else if (item.financial_status === "refunded") {
          data_obj.count = data_obj.count + 1;
          data_obj.refunds =
            data_obj.refunds + Number(item.total_line_items_price);
          data_obj.gross_sales =
            data_obj.gross_sales + Number(item.total_line_items_price);
          data_obj.discounts = data_obj.discounts;
          data_obj.shipping = data_obj.shipping;
          data_obj.taxes = data_obj.taxes;
          data_obj.net_sales =
            data_obj.net_sales +
            Number(item.total_line_items_price) -
            Number(item.total_line_items_price);
          data_obj.total_sales =
            data_obj.total_sales +
            Number(item.total_line_items_price) -
            Number(item.total_line_items_price) +
            Number(item.total_tax) +
            Number(item.total_shipping_price_set.shop_money.amount);
        } else {
          data_obj.count = data_obj.count + 1;

          data_obj.gross_sales =
            data_obj.gross_sales + Number(item.total_line_items_price);
          data_obj.discounts =
            data_obj.discounts + Number(item.total_discounts);
          data_obj.shipping =
            data_obj.shipping +
            Number(item.total_shipping_price_set.shop_money.amount);
          data_obj.taxes = data_obj.taxes + Number(item.total_tax);
          data_obj.net_sales =
            data_obj.net_sales +
            Number(item.total_line_items_price) -
            Number(item.total_discounts);
          data_obj.total_sales =
            data_obj.total_sales +
            Number(item.total_line_items_price) -
            Number(item.total_discounts) +
            Number(item.total_tax) +
            Number(item.total_shipping_price_set.shop_money.amount);
        }
        //console.log(data_obj)
      }
    });
    params = orders.nextPageParameters;
  } while (params !== undefined);
}
Promise.all([getData(shopify1)])
  .then((response) => {
    console.log(data_obj);
  })
  .catch((err) => console.log(err));

// getData(shopify1)
