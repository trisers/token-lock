import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../config/dbconfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  try {

    const campaignData = await req.json();
    
    const {
      campaignName,
      campaignType,
      discountType,
      discountValue,
      offerHeading,
      offerDescription,
      startDate,
      endDate,
      autoActivate,
      eligibilityConditions,
      selectedProducts,
      productSelectionType,
      evaluateCondition,
      campaignStatus
    } = campaignData;

    if (!campaignName || !campaignType || !offerHeading || !offerDescription || !startDate || !endDate || !productSelectionType || !evaluateCondition) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO campaigns (
          campaignName, campaignType, discountType, discountValue, offerHeading,
          offerDescription, startDate, endDate, autoActivate, eligibilityConditions,
          selectedProducts, productSelectionType, evaluateCondition, campaignStatus
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          campaignName,
          campaignType,
          discountType || null,
          discountValue || null,
          offerHeading,
          offerDescription,
          startDate,
          endDate,
          autoActivate ? 1 : 0,
          eligibilityConditions ? JSON.stringify(eligibilityConditions) : null,
          selectedProducts ? JSON.stringify(selectedProducts) : null,
          productSelectionType,
          evaluateCondition,
          campaignStatus || 1
        ]
      );

      return NextResponse.json({ message: 'Campaign created successfully', id: result.insertId }, { status: 201 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ message: 'Error creating campaign' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM campaigns ORDER BY created_at DESC`
      );
      return NextResponse.json(rows, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ message: 'Error fetching campaigns' }, { status: 500 });
  }
}