import React,{useState} from 'react';
import api from '../services/api';

export default function AIDemo(){
  const [prompt,setPrompt] = useState('');
  const [text,setText]     = useState('');
  const [err,setErr]       = useState('');

  const gen = async()=>{
    setErr(''); setText('Generating…');
    try{
      const { text:result } = await api.post('/api/gemini/generate',{ prompt });
      setText(result);
    }catch(e){ setErr(e.message || 'Error'); setText(''); }
  };
  return(
   <div className="space-y-6">
     <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
       AI Content Generator
     </h1>

     <textarea value={prompt} onChange={e=>setPrompt(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
        placeholder="Enter a prompt – e.g. ‘Write an engaging tweet about social media in Africa’" />

     <button onClick={gen}
       className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg shadow hover:brightness-110 transition">
       Generate
     </button>

     {err && <p className="text-red-600">{err}</p>}
     {text && <pre className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{text}</pre>}
   </div>);
}
