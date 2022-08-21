SELECT asset,
  SUM(amount) AS amount,
  SUM(sales.buy_price * amount) / SUM(amount) AS avg_buy_price,
  SUM(sales.sell_price * amount) / SUM(amount) AS avg_sell_price,
  SUM(gainloss) AS gainloss
FROM sales
GROUP BY asset;