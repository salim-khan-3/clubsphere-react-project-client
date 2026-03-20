import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import { TableRowSkeleton } from "../../../components/common/LoadingSpinner";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const ManageClubs = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-clubs", statusFilter, page],
    queryFn: () =>
      axiosInstance.get("/clubs/admin/all", { params: { status: statusFilter, page, limit: 10 } }).then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => axiosInstance.patch(`/clubs/${id}/status`, { status }),
    onSuccess: (_, { status }) => {
      toast.success(`Club ${status}`);
      queryClient.invalidateQueries(["admin-clubs"]);
    },
    onError: () => toast.error("Action failed"),
  });

  const handleStatus = (club, status) => {
    Swal.fire({
      title: `${status === "approved" ? "Approve" : "Reject"} Club?`,
      text: `Are you sure you want to ${status} "${club.clubName}"?`,
      icon: status === "approved" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#374151",
      background: "#1a1430",
      color: "#f0eaff",
    }).then((result) => {
      if (result.isConfirmed) statusMutation.mutate({ id: club._id, status });
    });
  };

  const statusBadge = {
    approved: "badge-green",
    pending: "badge-yellow",
    rejected: "badge-red",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Manage Clubs</h1>
        <p className="text-gray-500 mt-1">Approve, reject, and monitor clubs on the platform</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === s
                ? "bg-primary-700 text-white"
                : "border border-primary-900/40 text-gray-400 hover:text-white"
            }`}
          >
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Club</th>
              <th>Manager</th>
              <th>Category</th>
              <th>Fee</th>
              <th>Members</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRowSkeleton cols={7} />
            ) : (
              data?.clubs?.map((club) => (
                <tr key={club._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={club.bannerImage} alt={club.clubName}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                      <span className="text-white font-medium text-sm">{club.clubName}</span>
                    </div>
                  </td>
                  <td className="text-gray-400 text-sm">{club.managerEmail}</td>
                  <td><span className="badge-purple text-xs">{club.category}</span></td>
                  <td className="text-gray-300">{club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}</td>
                  <td className="text-gray-400">{club.memberCount}</td>
                  <td>
                    <span className={`badge ${statusBadge[club.status]}`}>
                      {club.status === "approved" && <CheckCircle className="w-3 h-3" />}
                      {club.status === "pending" && <Clock className="w-3 h-3" />}
                      {club.status === "rejected" && <XCircle className="w-3 h-3" />}
                      {club.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {club.status !== "approved" && (
                        <button onClick={() => handleStatus(club, "approved")}
                          className="text-xs px-3 py-1.5 rounded-lg bg-green-900/30 border border-green-800/40 text-green-400 hover:bg-green-900/50 transition-colors">
                          Approve
                        </button>
                      )}
                      {club.status !== "rejected" && (
                        <button onClick={() => handleStatus(club, "rejected")}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-900/30 border border-red-800/40 text-red-400 hover:bg-red-900/50 transition-colors">
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageClubs;
