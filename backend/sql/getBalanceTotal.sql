WITH assetValue AS (
  SELECT SUM(amount * ap.price) AS total
  FROM hodl
    LEFT JOIN fiat
    LEFT JOIN assetPairs AS ap ON ap.base = asset
    AND ap.quote = fiat.value
),
fiatValue AS (
  SELECT SUM(l.amount - l.fee) AS total
  FROM ledgers AS l
    INNER JOIN fiat
  WHERE l.asset = fiat.value
)
SELECT assetValue.total + fiatValue.total AS total_current_value
FROM assetValue
  LEFT JOIN fiatValue;