export default function StatsCard({ title, value, change }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h4 className="text-gray-500">{title}</h4>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
      <p className="text-sm text-green-600 mt-1">{change}</p>
    </div>
  );
}