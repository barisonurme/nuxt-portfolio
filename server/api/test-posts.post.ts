export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("[TEST API] Received body:", body);

    // Return the body back so frontend can see it
    return {
      success: true,
      received: body,
    };
  } catch (error) {
    console.error("[TEST API] Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to read body",
    });
  }
});
