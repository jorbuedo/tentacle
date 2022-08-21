SELECT asset,
  SUM(amount) AS amount,
  SUM(amount) * assetPairs.price AS current_value
FROM transactions AS t
  INNER JOIN fiat
  INNER JOIN assetPairs ON asset = assetPairs.base
  AND fiat.value = assetPairs.quote
WHERE type = 'reward'
GROUP BY asset;