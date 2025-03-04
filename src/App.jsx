import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Avatar, AvatarImage } from "./components/ui/avatar";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function Taschenteschner() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VITE_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-7b",
          messages: [{ role: "system", content: "Du bist ein Mathe-Nachhilfe-Experte." }, { role: "user", content: input }],
          max_tokens: 100,
        }),
      });
  
      if (!response.ok) throw new Error("Fehlerhafte API-Antwort");
  
      const data = await response.json();
      setMessages([...newMessages, { text: data.choices[0].message.content, sender: "bot" }]);
    } catch (error) {
      console.error("API-Fehler:", error);
      setMessages([...newMessages, { text: "Fehler beim Abrufen der Antwort. Bitte versuche es später erneut.", sender: "bot" }]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-white p-4">
      <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-3xl relative">
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32">
          <Avatar className="w-full h-full">
            <AvatarImage src="/taschenteschner.png" alt="Taschenteschner" className="rounded-full border-4 border-white" />
          </Avatar>
        </div>
        <CardContent className="mt-16 h-96 overflow-y-auto flex flex-col items-center">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 my-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-400 text-white self-end" : "bg-gray-300 text-black self-start"}`}
            >
              {msg.text}
            </motion.div>
          ))}
        </CardContent>
        <div className="flex mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Frage mich etwas über Mathe..."
            className="flex-1 mr-2 rounded-full"
          />
          <Button onClick={sendMessage} className="bg-blue-500 text-white rounded-full px-4 py-2">
            Senden
          </Button>
        </div>
      </Card>
    </div>
  );
}
