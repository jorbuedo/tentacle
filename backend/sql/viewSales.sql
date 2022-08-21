DROP VIEW IF EXISTS sales;
CREATE VIEW sales AS WITH t AS (
  SELECT CASE
      WHEN type IN ('reward', 'buy') THEN '+'
      ELSE '-'
    END act,
    ROW_NUMBER () OVER (
      PARTITION BY asset,
      type IN ('reward', 'buy')
    ) num,
    *
  FROM transactions
  ORDER BY time
),
cte AS (
  SELECT tas.asset AS asset,
    MIN(tas.amount, tab.amount) AS amount,
    tab.num AS buy_num,
    tab.id AS buy_id,
    tab.time AS buy_time,
    tab.price AS buy_price,
    CASE
      WHEN tab.amount - tas.amount < 0 THEN 0
      ELSE tab.amount - tas.amount
    END buy_reminder,
    tas.num AS sell_num,
    tas.id AS sell_id,
    tas.time AS sell_time,
    tas.price AS sell_price,
    CASE
      WHEN tas.amount - tab.amount < 0 THEN 0
      ELSE tas.amount - tab.amount
    END sell_reminder
  FROM t AS tas
    INNER JOIN t AS tab ON tab.act = '+'
    AND tas.asset = tab.asset
    AND tas.num = tab.num
  WHERE tas.act = '-'
  GROUP BY tas.asset
  UNION
  SELECT tns.asset AS asset,
    CASE
      WHEN cte.buy_reminder > 0 THEN MIN(cte.buy_reminder, tns.amount)
      WHEN cte.sell_reminder > 0 THEN MIN(cte.sell_reminder, tnb.amount)
      ELSE MIN(tns.amount, tnb.amount)
    END amount,
    CASE
      WHEN cte.buy_reminder > 0 THEN cte.buy_num
      ELSE tnb.num
    END buy_num,
    CASE
      WHEN cte.buy_reminder > 0 THEN cte.buy_id
      ELSE tnb.id
    END buy_id,
    CASE
      WHEN cte.buy_reminder > 0 THEN cte.buy_time
      ELSE tnb.time
    END buy_time,
    CASE
      WHEN cte.buy_reminder > 0 THEN cte.buy_price
      ELSE tnb.price
    END buy_price,
    CASE
      WHEN cte.buy_reminder > 0 THEN CASE
        WHEN cte.buy_reminder - tns.amount < 0 THEN 0
        ELSE cte.buy_reminder - tns.amount
      END
      ELSE CASE
        WHEN tnb.amount - cte.sell_reminder < 0 THEN 0
        ELSE tnb.amount - cte.sell_reminder
      END
    END buy_reminder,
    CASE
      WHEN cte.sell_reminder > 0 THEN cte.sell_num
      ELSE tns.num
    END sell_num,
    CASE
      WHEN cte.sell_reminder > 0 THEN cte.sell_id
      ELSE tns.id
    END sell_id,
    CASE
      WHEN cte.sell_reminder > 0 THEN cte.sell_time
      ELSE tns.time
    END sell_time,
    CASE
      WHEN cte.sell_reminder > 0 THEN cte.sell_price
      ELSE tns.price
    END sell_price,
    CASE
      WHEN cte.sell_reminder > 0 THEN CASE
        WHEN cte.sell_reminder - tnb.amount < 0 THEN 0
        ELSE cte.sell_reminder - tnb.amount
      END
      ELSE CASE
        WHEN tns.amount - cte.buy_reminder < 0 THEN 0
        ELSE tns.amount - cte.buy_reminder
      END
    END sell_reminder
  FROM cte
    INNER JOIN t AS tns ON tns.act = '-'
    AND tns.asset = cte.asset
    AND (
      (
        cte.sell_reminder > 0
        AND tns.num = cte.sell_num
      ) OR tns.num = cte.sell_num + 1
    )
    LEFT JOIN t AS tnb ON tnb.act = '+'
    AND tnb.asset = cte.asset
    AND tnb.num = cte.buy_num + 1
)
SELECT DISTINCT asset,
  buy_id,
  sell_id,
  buy_time,
  sell_time,
  (sell_time - buy_time) / 86400 AS holding_period,
  buy_reminder,
  buy_price,
  sell_price,
  amount,
  (sell_price - buy_price) * amount AS gainloss
FROM cte
ORDER BY sell_time;