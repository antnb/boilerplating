import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
    const secret = request.headers.get("x-revalidation-secret");
    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { path, tag, type = "page" } = body;

    if (tag) {
        revalidateTag(tag);
        return NextResponse.json({ revalidated: true, tag });
    }

    if (path) {
        revalidatePath(path, type as "page" | "layout");
        return NextResponse.json({ revalidated: true, path });
    }

    return NextResponse.json({ error: "Missing path or tag" }, { status: 400 });
}
