'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

type Agent = {
  id: string;
  name: string;
  description: string;
  system_instructions: string;
  model: string;
  active: boolean;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    system_instructions: '',
    model: 'deepseek-chat',
  });
  const [saving, setSaving] = useState(false);

  const [chatAgent, setChatAgent] = useState<Agent | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatReply, setChatReply] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoadingAgents(true);
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) setAgents(data || []);
    setLoadingAgents(false);
  };

  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('ai_agents').insert([newAgent]);
    if (!error) {
      setShowModal(false);
      setNewAgent({ name: '', description: '', system_instructions: '', model: 'deepseek-chat' });
      fetchAgents();
    }
    setSaving(false);
  };

  const handleChat = async () => {
    if (!chatAgent || !chatInput.trim()) return;
    setChatLoading(true);
    setChatError('');
    setChatReply('');

    try {
      const res = await fetch('/api/ai/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: chatAgent.id,
          userMessage: chatInput,
          systemInstructions: chatAgent.system_instructions,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'API error');
      }
      const data = await res.json();
      setChatReply(data.reply);
    } catch (err: any) {
      setChatError(err.message || 'Failed to get reply');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Agents</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Agent
        </button>
      </div>

      {loadingAgents ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h2 className="text-xl font-semibold">{agent.name}</h2>
              <p className="text-gray-600 text-sm">{agent.description}</p>
              <p className="text-gray-400 text-xs mt-1">Model: {agent.model}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setChatAgent(agent)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Agent</h2>
            <form onSubmit={handleSaveAgent}>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  placeholder="System Instructions (e.g. You are a sales assistant...)"
                  value={newAgent.system_instructions}
                  onChange={(e) => setNewAgent({ ...newAgent, system_instructions: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-24"
                />
                <select
                  value={newAgent.model}
                  onChange={(e) => setNewAgent({ ...newAgent, model: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="deepseek-chat">DeepSeek Chat</option>
                  <option value="gpt-4">GPT-4</option>
                </select>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-2">Chat with {chatAgent.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{chatAgent.description}</p>

            <div className="space-y-3">
              <textarea
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full border rounded px-3 py-2 h-20"
              />

              <button
                onClick={handleChat}
                disabled={chatLoading || !chatInput.trim()}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {chatLoading ? 'Thinking...' : 'Send'}
              </button>

              {chatError && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{chatError}</div>
              )}

              {chatReply && (
                <div className="bg-gray-100 p-3 rounded mt-2 whitespace-pre-wrap">
                  {chatReply}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setChatAgent(null);
                  setChatReply('');
                  setChatInput('');
                  setChatError('');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}