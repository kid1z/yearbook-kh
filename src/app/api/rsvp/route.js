import { Client, Databases, ID } from "node-appwrite";

const DATABASE_ID = "69ec2b290022e98c5311";
const COLLECTION_ID = "rsvp";

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
    const { name, phone, time } = body;

    if (!name || !name.trim()) {
      return Response.json({ error: "Name is required." }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return Response.json(
        { error: "Phone number is required." },
        { status: 400 },
      );
    }
    if (!time || !time.trim()) {
      return Response.json(
        { error: "Time is required." },
        { status: 400 },
      );
    }

    const databases = new Databases(client);
    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        name: name.trim(),
        phone: phone.trim(),
        time: time.trim(),
      },
    );

    return Response.json({ document: doc }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Failed to save RSVP" },
      { status: 500 },
    );
  }
}
