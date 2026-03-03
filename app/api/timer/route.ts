import { NextResponse } from "next/server";
import { getTimerState, setTimerState } from "../../lib/timerState";

export async function GET() {
  return NextResponse.json(getTimerState());
}

export async function POST(req: Request) {
  const body = await req.json();
  const state = setTimerState(body);
  return NextResponse.json(state);
}
