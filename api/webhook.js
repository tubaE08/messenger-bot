module.exports = async (req, res) => {
  const PAGE_TOKEN = "EAAhsGYVRYmYBS2nLcNkg8l8YZAgAtJsg0TyN74IidEHPaitZAYoeCh90li0cuO1PYiucQUMhpZCURWzFvzuiYA2JbBfurPgRKHHdyL0vCW0nH6osD0CJFEf9Uk1WtJRoZBgfGcECrBA0rtfJW5ZBsgjo7ZAE1tWtICzIOYmv04oZCU34NVknZBQUVovoA0Qpa3EIMLhVH5MBJQZDZD";
  const VERIFY_TOKEN = "mybot123";

  if (req.method === "GET") {
    if (
      req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === VERIFY_TOKEN
    ) {
      return res.status(200).send(req.query["hub.challenge"]);
    }
    return res.status(403).send("Forbidden");
  }

  if (req.method === "POST") {
    console.log("INCOMING:", JSON.stringify(req.body));
    const entries = (req.body && req.body.entry) || [];

    for (const entry of entries) {
      for (const event of entry.messaging || []) {
        const text = event.message && event.message.text;
        if (!text || event.message.is_echo) continue;
        const senderId = event.sender.id;

        const reply =
          text.trim().toLowerCase() === "/admin"
            ? "Efty Developer"
            : "Ami ekta bot. /admin likhe dekho.";

        const fbRes = await fetch(
          `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipient: { id: senderId },
              message: { text: reply },
            }),
          }
        );
        console.log("FB RESPONSE:", fbRes.status, await fbRes.text());
      }
    }
    return res.status(200).send("EVENT_RECEIVED");
  }

  res.status(405).send("Method not allowed");
};
