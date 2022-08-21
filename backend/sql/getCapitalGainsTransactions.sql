SELECT asset,
  amount,
  buy_time,
  sell_time,
  holding_period,
  buy_price,
  sell_price,
  gainloss
FROM sales
ORDER BY sell_time;