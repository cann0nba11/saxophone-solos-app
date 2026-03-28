"use client";
import { useEffect, useState } from "react";
import { db } from "./lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Solo {
  id: string;
  year: number;
  decade: string;
  songTitle: string;
  artist: string;
  soloist: string;
  saxophoneType: string;
}

export default function Home() {
  const [solos, setSolos] = useState<Solo[]>([]);
  const [filtered, setFiltered] = useState<Solo[]>([]);
  const [search, setSearch] = useState("");
  const [decade, setDecade] = useState("All");
  const [saxType, setSaxType] = useState("All");
  const [loading, setLoading] = useState(true);

  const decades = ["All", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
  const saxTypes = ["All", "Tenor", "Alto", "Baritone", "Soprano", "Sax Section"];

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "solos"), orderBy("year"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Solo[];
      setSolos(data);
      setFiltered(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let results = solos;
    if (decade !== "All") results = results.filter(s => s.decade === decade);
    if (saxType !== "All") results = results.filter(s => s.saxophoneType === saxType);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(s =>
        s.songTitle?.toLowerCase().includes(q) ||
        s.artist?.toLowerCase().includes(q) ||
        s.soloist?.toLowerCase().includes(q)
      );
    }
    setFiltered(results);
  }, [search, decade, saxType, solos]);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">🎷 Billboard Saxophone Solos</h1>
        <p className="text-gray-400 mb-6">A database of every saxophone solo recorded in the Billboard 100 — 1955 to 2021</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by song, artist, or soloist..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-yellow-400"
          />
          <select
            value={decade}
            onChange={e => setDecade(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            {decades.map(d => <option key={d}>{d}</option>)}
          </select>
          <select
            value={saxType}
            onChange={e => setSaxType(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-yellow-400"
          >
            {saxTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <p className="text-gray-400 text-sm mb-4">{filtered.length} results</p>

        {loading ? (
          <p className="text-gray-400">Loading solos...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-yellow-400 border-b border-gray-700">
                  <th className="text-left py-2 pr-4">Year</th>
                  <th className="text-left py-2 pr-4">Song</th>
                  <th className="text-left py-2 pr-4">Artist</th>
                  <th className="text-left py-2 pr-4">Soloist</th>
                  <th className="text-left py-2">Sax</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(solo => (
                  <tr key={solo.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                    <td className="py-2 pr-4 text-gray-400">{solo.year}</td>
                    <td className="py-2 pr-4 font-mediu