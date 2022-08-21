DROP VIEW IF EXISTS hodl;
CREATE VIEW hodl AS
SELECT asset,
  t.id,
  type,
  time,
  CASE
    WHEN type = 'reward' THEN 0
    ELSE price
  END price,
  IFNULL(s.amount, t.amount) AS amount
FROM transactions AS t
  LEFT JOIN (
    SELECT buy_id AS id,
      MIN(buy_reminder) AS amount
    FROM sales
    GROUP BY buy_id
  ) AS s ON t.id = s.id
WHERE t.type IN ('reward', 'buy')
  AND (
    s.amount != 0
    OR s.id IS NULL
  );