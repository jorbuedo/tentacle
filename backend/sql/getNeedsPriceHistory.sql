  SELECT DISTINCT assetPairs.name, t.time
  FROM assetPairs
  INNER JOIN fiat
  INNER JOIN (
    SELECT DISTINCT asset, time
    FROM transactions
  ) t ON t.asset = assetPairs.base
  WHERE assetPairs.quote = fiat.value 
  AND (assetPairs.name, t.time) NOT IN (SELECT name, time FROM priceHistory);