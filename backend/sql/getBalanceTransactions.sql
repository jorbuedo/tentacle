SELECT asset,
  time,
  amount,
  hodl.price AS price,
  ap.price AS current_price,
  hodl.price * amount AS value,
  amount * ap.price AS current_value
FROM hodl
  LEFT JOIN fiat
  LEFT JOIN assetPairs AS ap ON ap.base = asset
  AND ap.quote = fiat.value
WHERE ap.price * amount > 0.5
ORDER BY time DESC;