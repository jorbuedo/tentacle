DROP VIEW IF EXISTS transactions;
CREATE VIEW transactions AS WITH krakenLedger AS (
  SELECT DISTINCT l.id,
    l.time,
    assetPairs.base AS asset,
    l2.asset AS quote,
    (abs(l2.amount) + l2.fee) / (l.amount - l.fee) AS price,
    l.amount - l.fee AS amount,
    abs(l2.amount) AS quoteAmount,
    l2.id AS quoteId
  FROM ledgers AS l
    LEFT JOIN ledgers AS l2 ON l.refid = l2.refid
    AND l2.amount < 0 AND l.refid != 'Airdrop'
    LEFT JOIN assetPairs ON l.asset LIKE assetPairs.base || '.%'
    OR l.asset = assetPairs.base
  WHERE l.amount > 0
    AND l.type IN ('staking', 'receive', 'trade', 'dividend')
),
direct AS (
  SELECT CASE
      WHEN asset = fiat.value THEN quoteId
      ELSE id
    END id,
    time,
    CASE
      WHEN asset = fiat.value THEN quote
      ELSE asset
    END asset,
    CASE
      WHEN asset = fiat.value THEN asset
      ELSE quote
    END quote,
    CASE
      WHEN asset = fiat.value THEN 1 / price
      ELSE price
    END price,
    CASE
      WHEN asset = fiat.value THEN quoteAmount
      ELSE amount
    END amount,
    CASE
      WHEN asset = fiat.value THEN 'sell'
      ELSE 'buy'
    END type
  FROM krakenLedger
    LEFT JOIN fiat
  WHERE asset = fiat.value
    OR quote = fiat.value
),
priceless AS (
  SELECT b.id,
    b.time,
    b.asset,
    fiat.value AS quote,
    (
      SELECT 0
    ) AS price,
    b.amount,
    'reward' AS type
  FROM krakenLedger AS b
    LEFT JOIN fiat
    LEFT JOIN assetPairs ON assetPairs.base = b.asset
    AND assetPairs.quote = fiat.value
  WHERE b.quote IS NULL
    AND b.price IS NULL
),
complex AS (
  SELECT *
  FROM krakenLedger
    LEFT JOIN fiat
  WHERE asset != fiat.value
    AND quote != fiat.value
),
complexSell AS (
  SELECT c.id || '.SELL' AS id,
    c.time,
    c.quote AS asset,
    fiat.value AS quote,
    (
      SELECT priceHistory.price
      FROM priceHistory
      WHERE priceHistory.pair = assetPairs.name
        AND c.time < priceHistory.time
      ORDER BY priceHistory.time ASC
      LIMIT 1
    ) AS price,
    c.amount * c.price AS amount,
    'sell' AS type
  FROM complex AS c
    LEFT JOIN fiat
    LEFT JOIN assetPairs ON assetPairs.base = c.quote
    AND assetPairs.quote = fiat.value
),
complexBuy AS (
  SELECT c.id || '.BUY' AS id,
    c.time,
    c.asset,
    fiat.value AS quote,
    (
      SELECT (s.amount * s.price) / c.amount
      FROM complexSell AS s
      WHERE s.id = c.id || '.SELL'
    ) AS price,
    c.amount,
    'buy' AS type
  FROM complex AS c
    LEFT JOIN fiat
),
final AS (
  SELECT *
  FROM direct
  UNION ALL
  SELECT *
  FROM priceless
  UNION ALL
  SELECT *
  FROM complexSell
  UNION ALL
  SELECT *
  FROM complexBuy
)
SELECT asset,
  id,
  type,
  time,
  price,
  amount
FROM final
ORDER BY time;