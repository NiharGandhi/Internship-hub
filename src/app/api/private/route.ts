import { NextResponse } from 'next/server';
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        // Parse the JSON body from the request
        const { userType, userId } = await request.json();

        // Update the user's private metadata
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                userType: userType
            }
        });

        // Respond with a success message
        return NextResponse.json({ success: true });
    } catch (error) {
        // Handle errors and respond with a failure message
        console.error('Error updating user metadata:', error);
        return NextResponse.json({ success: false });
    }
}
