import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../config/dbconfig';
import { OkPacket, RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
    try {
        const settingsData = await req.json();
        // Validate and sanitize input
        const {
            buttonColor,
            buttonText,
            buttonTextColor,
            buttonFontSize,
            descriptionColor,
            descriptionFontSize,
        } = settingsData;

        // Check for required fields
        if (!buttonColor || !buttonText || !buttonTextColor || !buttonFontSize || !descriptionColor || !descriptionFontSize) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        try {
            // First, check if a settings entry exists
            const [existingSettings] = await connection.query<RowDataPacket[]>(
                'SELECT id FROM settings LIMIT 1'
            );

            let result;
            if (existingSettings.length > 0) {
                // Update existing entry
                [result] = await connection.execute<OkPacket>(
                    `UPDATE settings SET
                    button_color = ?,
                    button_text = ?,
                    button_text_color = ?,
                    button_font_size = ?,
                    description_color = ?,
                    description_font_size = ?
                    WHERE id = ?`,
                    [
                        buttonColor,
                        buttonText,
                        buttonTextColor,
                        buttonFontSize,
                        descriptionColor,
                        descriptionFontSize,
                        existingSettings[0].id
                    ]
                );
            } else {
                // Insert new entry
                [result] = await connection.execute<OkPacket>(
                    `INSERT INTO settings (
                    button_color,
                    button_text,
                    button_text_color,
                    button_font_size,
                    description_color,
                    description_font_size
                    ) VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        buttonColor,
                        buttonText,
                        buttonTextColor,
                        buttonFontSize,
                        descriptionColor,
                        descriptionFontSize,
                    ]
                );
            }

            if ('affectedRows' in result && result.affectedRows > 0) {
                return NextResponse.json({ message: 'Settings updated successfully', affectedRows: result.affectedRows }, { status: 200 });
            } else {
                throw new Error('Failed to update settings');
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ message: 'Error updating settings' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT * FROM settings LIMIT 1`
            );
            if (rows.length > 0) {
                return NextResponse.json(rows[0], { status: 200 });
            } else {
                return NextResponse.json({ message: 'No settings found' }, { status: 404 });
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ message: 'Error fetching settings' }, { status: 500 });
    }
}