import alasql from 'alasql';
import { MOCK_DATABASE_TABLES } from '../data/mockData';

let isInitialized = false;

export function initMockDatabase() {
  if (isInitialized) return;
  try {
    alasql('CREATE TABLE IF NOT EXISTS orders (order_id INT, customer_id INT, category STRING, amount FLOAT, order_date STRING, status STRING)');
    alasql('CREATE TABLE IF NOT EXISTS customers (customer_id INT, name STRING, region STRING, segment STRING, joined_date STRING)');

    alasql('DELETE FROM orders');
    alasql('DELETE FROM customers');

    MOCK_DATABASE_TABLES.orders.forEach(row => {
      alasql('INSERT INTO orders VALUES (?,?,?,?,?,?)', [row.order_id, row.customer_id, row.category, row.amount, row.order_date, row.status]);
    });

    MOCK_DATABASE_TABLES.customers.forEach(row => {
      alasql('INSERT INTO customers VALUES (?,?,?,?,?)', [row.customer_id, row.name, row.region, row.segment, row.joined_date]);
    });

    isInitialized = true;
  } catch (err) {
    console.error("AlaSQL Database initialization error:", err);
  }
}

export function executeSQLQuery(queryString) {
  initMockDatabase();
  try {
    const trimmed = queryString.trim().replace(/;$/, '');
    const result = alasql(trimmed);
    
    if (Array.isArray(result)) {
      if (result.length === 0) {
        return { success: true, data: [], columns: [], message: "Query executed successfully. 0 rows returned." };
      }
      const columns = Object.keys(result[0]);
      return { success: true, data: result, columns, message: `Query returned ${result.length} row(s).` };
    }
    return { success: true, data: [], columns: [], message: "Statement executed successfully." };
  } catch (error) {
    return { success: false, data: [], columns: [], error: error.message || "SQL Syntax Error. Check query syntax." };
  }
}
