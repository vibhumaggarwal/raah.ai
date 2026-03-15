import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // The user provided this sheet URL:
        // https://docs.google.com/spreadsheets/d/1BR33TzDPjc3vHuT1OzQ7SpK-Tk4vsQwd0ZxQ8uYhswc/edit?gid=0#gid=0

        const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

        if (!GOOGLE_SCRIPT_URL) {
            console.error("Missing GOOGLE_SCRIPT_URL environment variable.");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // The Google Apps Script needs to handle POST requests and expect this payload
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error(`Google Apps Script responded with status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.result === "success") {
           return NextResponse.json({ success: true });
        } else {
           throw new Error(result.message || "Failed to append to sheet");
        }

    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: "Failed to join waitlist. Please try again later." },
            { status: 500 }
        );
    }
}
