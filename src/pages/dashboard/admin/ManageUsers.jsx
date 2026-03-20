import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Shield, User, Briefcase } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import { TableRowSkeleton } from "../../../components/common/LoadingSpinner";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, page],
    queryFn: () => axiosInstance.get("/users", { params: { search, page, limit: 10 } }).then((r) => r.data),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => axiosInstance.patch(`/users/${id}/role`, { role }),
    onSuccess: (_, { role }) => {
      toast.success(`Role updated to ${role}`);
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update role"),
  });

  const handleRoleChange = (user, newRole) => {
    Swal.fire({
      title: "Change Role?",
      text: `Change ${user.name}'s role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7c1de8",
      cancelButtonColor: "#374151",
      background: "#1a1430",
      color: "#f0eaff",
      confirmButtonText: "Yes, change it",
    }).then((result) => {
      if (result.isConfirmed) roleMutation.mutate({ id: user._id, role: newRole });
    });
  };

  const roleIcon = { admin: Shield, clubManager: Briefcase, member: User };
  const roleBadge = {
    admin: "badge-gold",
    clubManager: "badge-purple",
    member: "badge-green",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Manage Users</h1>
        <p className="text-gray-500 mt-1">View and manage user roles across the platform</p>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="input-field pl-11"
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRowSkeleton cols={5} />
            ) : (
              data?.users?.map((user) => {
                const RoleIcon = roleIcon[user.role] || User;
                return (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=6414c4&color=fff`}
                          alt={user.name}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-gray-400">{user.email}</td>
                    <td>
                      <span className={`badge ${roleBadge[user.role] || "badge-green"} flex items-center gap-1 w-fit`}>
                        <RoleIcon className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        {["admin", "clubManager", "member"]
                          .filter((r) => r !== user.role)
                          .map((role) => (
                            <button
                              key={role}
                              onClick={() => handleRoleChange(user, role)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-primary-900/40 text-gray-400 hover:text-primary-300 hover:border-primary-700/50 transition-colors"
                            >
                              → {role}
                            </button>
                          ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

export default ManageUsers;
