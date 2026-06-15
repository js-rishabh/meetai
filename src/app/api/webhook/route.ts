import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent
} from "@stream-io/node-sdk";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { headers } from "next/headers";

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
    console.log("\n");
    console.log("==========================================");
    console.log("WEBHOOK HIT");
    console.log("==========================================");

    try {
        console.log("x-signature:", req.headers.get("x-signature"));
        console.log("x-api-key:", req.headers.get("x-api-key"));
        console.log("content-type:", req.headers.get("content-type"));
        console.log("content-encoding:", req.headers.get("content-encoding"));

        const body = await req.text();

        console.log("------------------------------------------");
        console.log("RAW BODY");
        console.log(body);
        console.log("------------------------------------------");

        const signature = req.headers.get("x-signature");

        if (signature) {
            console.log(
                "SIGNATURE VALID:",
                verifySignatureWithSDK(body, signature)
            );
        }

        let payload: any;

        try {
            payload = JSON.parse(body);
        } catch (e) {
            console.log("JSON PARSE FAILED");
            console.error(e);

            return NextResponse.json({ status: "ok" });
        }

        console.log("==========================================");
        console.log("EVENT TYPE:", payload.type);
        console.dir(payload, { depth: null });
        console.log("==========================================");

        console.log("ENTERING AI BLOCK");

        const meetingId =
            payload.call?.custom?.meetingId ||
            payload.call?.custom?.meeting_id ||
            payload.call?.id ||
            payload.call_cid?.split(":")[1];

        console.log("MEETING ID:", meetingId);

        if (!meetingId) {
            console.log("NO MEETING ID FOUND");

            return NextResponse.json({ status: "ok" });
        }

        console.log("SEARCHING MEETING");

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(eq(meetings.id, meetingId));

        console.log("MEETING RESULT");
        console.dir(existingMeeting, { depth: null });

        if (!existingMeeting) {
            console.log("MEETING NOT FOUND");

            return NextResponse.json({ status: "ok" });
        }

        console.log("SEARCHING AGENT");

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        console.log("AGENT RESULT");
        console.dir(existingAgent, { depth: null });

        if (!existingAgent) {
            console.log("AGENT NOT FOUND");

            return NextResponse.json({ status: "ok" });
        }

        console.log(
            "OPENAI KEY EXISTS:",
            !!process.env.OPENAI_API_KEY
        );

        try {
            console.log("CREATING CALL");

            const call = streamVideo.video.call(
                "default",
                meetingId
            );

            console.log("CALL CREATED");

            console.log("CONNECTING OPENAI");

            const realtimeClient =
                await streamVideo.video.connectOpenAi({
                    call,
                    openAiApiKey:
                        process.env.OPENAI_API_KEY!,
                    agentUserId: existingAgent.id,
                });

            console.log("OPENAI CONNECTED");

            console.log("UPDATING SESSION");

            await realtimeClient.updateSession({
                instructions:
                    existingAgent.instructions,
            });

            console.log("SESSION UPDATED");
            console.log(
                "******** AI AGENT SHOULD HAVE JOINED ********"
            );
        } catch (e) {
            console.log("CONNECT OPENAI FAILED");
            console.error(e);
        }

        console.log("RETURNING 200");

        return NextResponse.json({
            status: "ok",
        });
    } catch (e) {
        console.log("OUTER ERROR");
        console.error(e);

        return NextResponse.json({
            status: "ok",
        });
    }
}