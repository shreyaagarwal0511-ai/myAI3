# SQL Starter Notes (General)

## Basic SELECT pattern
SELECT col1, col2
FROM table
WHERE condition
ORDER BY col1;

## WHERE vs HAVING
- WHERE filters rows before aggregation
- HAVING filters groups after aggregation

## JOIN patterns
INNER JOIN returns matching rows.
LEFT JOIN returns all rows from left table plus matches from right.

## Window function example
SELECT
  customer_id,
  ROW_NUMBER() OVER (PARTITION BY region ORDER BY spend DESC) AS rn
FROM customers;

## Debug checklist
- Are all selected non-aggregated columns in GROUP BY?
- Are joins multiplying rows?
- Are date filters correct?
