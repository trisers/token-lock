import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../config/dbconfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM purchase_limits');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching purchase limits', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  
  const { product_id, product_name, purchase_limit, tokens_owned, blockchain, contract_address } = await request.json();
  
  try {
    // First, check if the product already exists
    const [existingProduct] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM purchase_limits WHERE product_id = ?',
      [product_id]
    );

    if (existingProduct.length > 0) {
      // Product already exists, return a conflict status
      return NextResponse.json({ message: 'Product already exists', existingProduct: existingProduct[0] }, { status: 409 });
    }

    // Prepare the tokens_owned_data
    let tokens_owned_data = null;
    if (tokens_owned) {
      tokens_owned_data = JSON.stringify({
        blockchain: blockchain || 'Ethereum',
        contractAddress: contract_address || ''
      });
    }

    // If the product doesn't exist, proceed with insertion
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO purchase_limits (product_id, product_name, purchase_limit, tokens_owned) VALUES (?, ?, ?, ?)',
      [product_id, product_name, purchase_limit, tokens_owned_data]
    );

    return NextResponse.json({ id: result.insertId, message: 'Purchase limit created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase limit:', error);
    return NextResponse.json({ message: 'Error creating purchase limit', error }, { status: 500 });
  }
}