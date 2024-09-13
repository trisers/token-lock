import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../config/dbconfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ message: 'Campaign ID is required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM campaigns WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
      }

      return NextResponse.json(rows[0], { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ message: 'Error fetching campaign' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const updatedCampaign = await req.json();

  if (!id) {
    return NextResponse.json({ message: 'Campaign ID is required' }, { status: 400 });
  }

  // Format dates to MySQL datetime format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  // Exclude 'created_at' field from the update
  const { created_at, ...restOfCampaign } = updatedCampaign;
  
  const preparedData = {
    ...restOfCampaign,
    startDate: formatDate(updatedCampaign.startDate),
    endDate: formatDate(updatedCampaign.endDate),
    selectedProducts: JSON.stringify(updatedCampaign.selectedProducts),
    eligibilityConditions: JSON.stringify(updatedCampaign.eligibilityConditions),
  };

  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'UPDATE campaigns SET ? WHERE id = ?',
        [preparedData, id]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Campaign updated successfully' }, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ message: 'Error updating campaign', error: error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ message: 'Campaign ID is required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM campaigns WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Campaign deleted successfully' }, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({ message: 'Error deleting campaign', error: error }, { status: 500 });
  }
}

// New function to handle campaign status updates
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { campaignStatus } = await req.json();

  if (!id) {
    return NextResponse.json({ message: 'Campaign ID is required' }, { status: 400 });
  }

  if (campaignStatus === undefined) {
    return NextResponse.json({ message: 'Campaign status is required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'UPDATE campaigns SET campaignStatus = ? WHERE id = ?',
        [campaignStatus, id]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Campaign status updated successfully' }, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating campaign status:', error);
    return NextResponse.json({ message: 'Error updating campaign status', error: error }, { status: 500 });
  }
}