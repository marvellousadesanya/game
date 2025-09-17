import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const scores = await prisma.score.findMany({
      orderBy: {
        score: "desc",
      },
      take: 10,
    });

    return NextResponse.json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { playerName, score } = await request.json();

    if (!playerName || typeof score !== "number") {
      return NextResponse.json(
        { error: "Player name and score are required" },
        { status: 400 }
      );
    }

    const newScore = await prisma.score.create({
      data: {
        playerName,
        score,
      },
    });

    return NextResponse.json(newScore, { status: 201 });
  } catch (error) {
    console.error("Error creating score:", error);
    return NextResponse.json(
      { error: "Failed to create score" },
      { status: 500 }
    );
  }
}
