import { Client, Databases, Query, ID } from "node-appwrite";

const DATABASE_ID = "69ec2b290022e98c5311";
const COLLECTION_ID = "chat";

function createServerClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) return null;

  return new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);
}

export async function GET() {
  try {
    const client = createServerClient();
    if (!client) {
      return Response.json(
        { error: "Server Appwrite config is incomplete." },
        { status: 500 },
      );
    }

    const databases = new Databases(client);
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]);

    return Response.json({ documents: result.documents }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Failed to fetch chat messages" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const client = createServerClient();
    if (!client) {
      return Response.json(
        { error: "Server Appwrite config is incomplete." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { name, message } = body;

    if (!message || !message.trim()) {
      return Response.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const databases = new Databases(client);
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        name: (name || "Anonymous").trim(),
        message: message.trim(),
      },
    );

    return Response.json({ document: doc }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Failed to save message" },
      { status: 500 },
    );
  }
}
