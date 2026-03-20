import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, TrendingUp, DollarSign } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import { TableRowSkeleton } from "../../../components/common/LoadingSpinner";

const ViewPayments = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-payments", page],
    queryFn: () => axiosInstance.get("/payments/all", { params: { page, limit: 10 } }).then((r) => r.data),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Payment Transactions</h1>
        <p className="text-gray-500 mt-1">All membership and event payment records</p>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Revenue", value: `$${data?.totalRevenue?.toFixed(2) || "0.00"}`, icon: DollarSign, color: "from-primary-700 to-primary-500" },
          { label: "Total Transactions", value: data?.total || 0, icon: CreditCard, color: "from-gold-600 to-gold-400" },
          { label: "Avg. Transaction", value: data?.total ? `$${(data.totalRevenue / data.total).toFixed(2)}` : "$0.00", icon: TrendingUp, color: "from-green-700 to-green-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className={`stat-icon bg-gradient-to-br ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="text-white text-2xl font-display font-bold mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Club</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRowSkeleton cols={6} />
            ) : (
              data?.payments?.map((p) => (
                <tr key={p._id}>
                  <td className="text-gray-300 text-sm">{p.userEmail}</td>
                  <td className="text-gold-400 font-semibold">${p.amount?.toFixed(2)}</td>
                  <td>
                    <span className={p.type === "membership" ? "badge-purple text-xs" : "badge-gold text-xs"}>
                      {p.type}
                    </span>
                  </td>
                  <td className="text-gray-400 text-sm">{p.clubName || "—"}</td>
                  <td className="text-gray-500 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={p.status === "completed" ? "badge-green text-xs" : "badge-red text-xs"}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data?.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-primary-900/40 text-gray-400 hover:text-white disabled:opacity-40 text-sm">
            Previous
          </button>
          <span className="px-4 py-2 text-gray-500 text-sm">Page {page} of {data.totalPages}</span>
          <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data?.totalPages}
            className="px-4 py-2 rounded-xl border border-primary-900/40 text-gray-400 hover:text-white disabled:opacity-40 text-sm">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewPayments;
