"use server"
import fs from 'fs';
import path from 'path';

export async function isEmailApproved(email: string): Promise<boolean> {
    const filePath = path.join(process.cwd(), 'approved-emails.txt');
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const approvedEmails = fileContent.split('\n').map((line) => line.trim());

    //return approvedEmails.includes(email);
    return true; // FOR DEMO ONLY
}
