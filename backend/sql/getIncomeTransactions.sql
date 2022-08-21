SELECT asset,
  time,
  amount,
  amount * t.price AS historic_value,
  amount * assetPairs.price AS current_value
FROM transactions AS t
  INNER JOIN fiat
  INNER JOIN assetPairs ON asset = assetPairs.base
  AND fiat.value = assetPairs.quote
WHERE type = 'reward'
ORDER BY t.time DESC;