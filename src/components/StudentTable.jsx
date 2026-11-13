export default function StatCard({ icon: Icon, label, value, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10`}
      />
      <div
        className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}