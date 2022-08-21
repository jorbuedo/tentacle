SELECT SUM(amount * assetPairs.price) AS total_current_value
FROM transactions AS t
  INNER JOIN fiat
  INNER JOIN assetPairs ON asset = assetPairs.base
  AND fiat.value = assetPairs.quote
WHERE type = 'reward';