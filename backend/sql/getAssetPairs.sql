SELECT DISTINCT assetPairs.name
FROM assetPairs
  INNER JOIN fiat
  INNER JOIN (
    SELECT DISTINCT asset
    FROM ledgers
  ) assets ON assets.asset LIKE assetPairs.base || '.%'
  OR assets.asset = assetPairs.base
WHERE assetPairs.quote = fiat.value;