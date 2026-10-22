import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import {
  FiPlus,
  FiCheckCircle,
  FiUserPlus,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import projectService from "../services/projectService";
import developerService from "../services/developerService";
import serviceService from "../services/serviceService";
import gigService from "../services/gigService";
import consultationService from "../services/consultationService";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    projects: 0,
    developers: 0,
    services: 0,
    gigs: 0,
    messages: 0,
    newMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [projects, developers, services, gigs, consultations] =
          await Promise.all([
            projectService.getProjects().catch(() => []),
            developerService.getDevelopers().catch(() => []),
            serviceService.getServices().catch(() => []),
            gigService.getGigs().catch(() => []),
            consultationService.getConsultations().catch(() => []),
          ]);

        const projectList = Array.isArray(projects) ? projects : [];
        const developerList = Array.isArray(developers) ? developers : [];
        const serviceList = Array.isArray(services) ? services : [];
        const gigList = Array.isArray(gigs) ? gigs : [];
        const messageList = Array.isArray(consultations) ? consultations : [];

        setStats({
          projects: projectList.length,
          developers: developerList.length,
          services: serviceList.length,
          gigs: gigList.length,
          messages: messageList.length,
          newMessages: messageList.filter((m) => m.status === "New").length,
        });
        setRecentMessages(messageList.slice(0, 5));
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { title: "Total Projects", value: String(stats.projects), icon: "FiBriefcase", color: "indigo" },
    { title: "Team Members", value: String(stats.developers), icon: "FiUsers", color: "blue" },
    { title: "Services", value: String(stats.services), icon: "FiCpu", color: "emerald" },
    { title: "Gigs", value: String(stats.gigs), icon: "FiLayers", color: "amber" },
    {
      title: "New Leads",
      value: String(stats.newMessages),
      icon: "FiMail",
      color: "rose",
    },
  ];

  const quickActions = [
    { label: "Add Project", to: "/admin/projects" },
    { label: "Add Team Member", to: "/admin/developers" },
    { label: "Add Service", to: "/admin/services" },
    { label: "View Messages", to: "/admin/messages" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-100">
          Welcome to AEROMEK Admin Panel
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Live counts from your database — projects, team, services, gigs, and leads.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-400 text-xs">
          <FiAlertCircle /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((stat) => (
              <DashboardCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800/80 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
                  Recent Leads
                </h2>
                <Link
                  to="/admin/messages"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recentMessages.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No consultation leads yet.
                  </p>
                ) : (
                  recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/40 border border-slate-800/40 text-xs"
                    >
                      <FiCheckCircle className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-300 font-medium">
                          {msg.full_name} · {msg.service}
                        </p>
                        <p className="text-slate-500 mt-0.5 truncate">{msg.email}</p>
                        <span className="text-[10px] text-slate-600 block mt-1">
                          {msg.status} ·{" "}
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleString()
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 border border-slate-800/80 rounded-xl p-6">
              <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 text-xs font-medium text-slate-300 transition-all duration-200 group"
                  >
                    <span>{action.label}</span>
                    <FiPlus className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </Link>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg border border-slate-800/60 bg-slate-950/40 text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center gap-2">
                  <FiUserPlus className="text-blue-400" /> {stats.developers} team profiles
                </p>
                <p className="flex items-center gap-2">
                  <FiRefreshCw className="text-indigo-400" /> {stats.messages} total leads
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
