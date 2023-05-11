import { Pool } from 'pg';

const pool = new Pool();

export const queryProductsList = async (page = 1, count = 5) => {
  try {
    const query = 'SELECT * FROM products ORDER BY id asc LIMIT $1 OFFSET $2;';
    const values = [count, page * count - count];

    const { rows } = await pool.query(query, values);

    return rows;
  } catch (err) {
    console.log('Error executing query', err);
  }
};

export const queryProduct = async (id: number) => {
  try {
    const query = 'SELECT * FROM products WHERE id=$1';
    const values = [id];

    const { rows } = await pool.query(query, values);

    return rows;
  } catch (err) {
    console.log('Error executing query', err);
  }
};

export const queryProductStyles = async () => {
  try {
  } catch (err) {
    console.log('Error executing query', err);
  }
};

export const queryRelatedProoducts = async () => {
  try {
  } catch (err) {
    console.log('Error executing query', err);
  }
};

export const queryNewProduct = async () => {
  try {
  } catch (err) {
    console.log('Error executing query', err);
  }
};

export const queryDeleteProduct = async () => {
  try {
  } catch (err) {
    console.log('Error executing query', err);
  }
};
