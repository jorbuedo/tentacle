SELECT asset,
  SUM(amount) AS amount,
  SUM(hodl.price * amount) / SUM(amount) AS avg_price,
  ap.price AS current_price,
  SUM(hodl.price * amount) AS invested_value,
  SUM(amount) * ap.price AS current_value,
  SUM(amount) * ap.price - SUM(hodl.price * amount) AS gainloss_value,
  (
    SUM(amount) * ap.price - SUM(hodl.price * amount)
  ) / SUM(hodl.price * amount) * 100 AS gainloss_percent
FROM hodl
  LEFT JOIN fiat
  LEFT JOIN assetPairs AS ap ON ap.base = asset
  AND ap.quote = fiat.value
GROUP BY asset
HAVING SUM(ap.price * amount) > 0.5;