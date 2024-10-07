// # src/app/api/purchase-limits/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../config/dbconfig';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface PurchaseLimit extends RowDataPacket {
  id: number;
  product_id: string;
  product_name: string;
  purchase_limit: number | null;
  tokens_owned: string | null;
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { product_id, product_name, purchase_limit, tokens_owned } = await request.json();
  
  try {
    // First, fetch the current purchase limit
    const [currentLimits] = await pool.query<PurchaseLimit[]>('SELECT * FROM purchase_limits WHERE id = ?', [id]);
    
    if (currentLimits.length === 0) {
      return NextResponse.json({ message: 'Purchase limit not found' }, { status: 404 });
    }

    const currentLimit = currentLimits[0];

    // Use the current values if new ones are not provided
    const updatedProductId = product_id ?? currentLimit.product_id;
    const updatedProductName = product_name ?? currentLimit.product_name;
    const updatedPurchaseLimit = purchase_limit ?? currentLimit.purchase_limit;
    
    // Handle tokens_owned as JSON
    let updatedTokensOwned;
    if (tokens_owned === 'token-owned') {
      updatedTokensOwned = JSON.stringify({ blockchain: 'Ethereum', contractAddress: '' });
    } else if (tokens_owned === false) {
      updatedTokensOwned = null;
    } else {
      updatedTokensOwned = currentLimit.tokens_owned;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE purchase_limits SET product_id = ?, product_name = ?, purchase_limit = ?, tokens_owned = ? WHERE id = ?',
      [updatedProductId, updatedProductName, updatedPurchaseLimit, updatedTokensOwned, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Purchase limit not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Purchase limit updated successfully' });
  } catch (error) {
    console.error('Error updating purchase limit:', error);
    return NextResponse.json({ message: 'Error updating purchase limit', error }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const [rows] = await pool.query<PurchaseLimit[]>('SELECT * FROM purchase_limits WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Purchase limit not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching purchase limit', error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM purchase_limits WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Purchase limit not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Purchase limit deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting purchase limit', error }, { status: 500 });
  }
}