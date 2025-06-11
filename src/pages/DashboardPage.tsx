import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { apiService } from "../Services/ApiServices";
import Icon from "../components/ui/Icon";

interface DashboardStats {
  users: number;
  pages: number;
  files: number;
  folders: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    user: string;
  }>;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have a dedicated dashboard stats endpoint
      const [usersResponse, pagesResponse, filesResponse, foldersResponse] =
        await Promise.allSettled([
          apiService.get<any[]>("/users"),
          apiService.get<any[]>("/pages"),
          apiService.get<any[]>("/files"),
          apiService.get<any[]>("/folders"),
        ]);

      setStats({
        users:
          usersResponse.status === "fulfilled" ? usersResponse.value.length : 0,
        pages:
          pagesResponse.status === "fulfilled" ? pagesResponse.value.length : 0,
        files:
          filesResponse.status === "fulfilled" ? filesResponse.value.length : 0,
        folders:
          foldersResponse.status === "fulfilled"
            ? foldersResponse.value.length
            : 0,
        recentActivity: [
          {
            id: "1",
            type: "user",
            message: "New user registered",
            timestamp: "2 minutes ago",
            user: "System",
          },
          {
            id: "2",
            type: "page",
            message: 'Page "About Us" was updated',
            timestamp: "1 hour ago",
            user: "John Doe",
          },
          {
            id: "3",
            type: "file",
            message: "5 files uploaded",
            timestamp: "2 hours ago",
            user: "Jane Smith",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: "Total Users",
      value: stats?.users || 0,
      icon: "users" as const,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      href: "/dashboard/users",
    },
    {
      name: "Total Pages",
      value: stats?.pages || 0,
      icon: "file-text" as const,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      href: "/dashboard/pages",
    },
    {
      name: "Total Files",
      value: stats?.files || 0,
      icon: "file" as const,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      href: "/dashboard/files",
    },
    {
      name: "Total Folders",
      value: stats?.folders || 0,
      icon: "folder" as const,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      href: "/dashboard/files/folders",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="spinner" size="2xl" spin className="text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-primary-600 dark:text-primary-400">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-5">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening with your CMS today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.name}
            to={card.href}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className={`h-12 w-12 rounded-md ${card.bgColor} flex items-center justify-center`}
                  >
                    <Icon name={card.icon} size="lg" className={card.color} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {card.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {card.value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {stats?.recentActivity.map((activity, index) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== stats.recentActivity.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <Icon
                              name={
                                activity.type === "user"
                                  ? "users"
                                  : activity.type === "page"
                                  ? "file-text"
                                  : "file"
                              }
                              size="sm"
                              className="text-white"
                            />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {activity.message}{" "}
                              <span className="font-medium text-gray-900 dark:text-white">
                                by {activity.user}
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/dashboard/users"
                className="w-full flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Icon name="user-plus" className="mr-3 h-4 w-4" />
                Create New User
              </Link>
              <Link
                to="/dashboard/pages"
                className="w-full flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Icon name="plus" className="mr-3 h-4 w-4" />
                Create New Page
              </Link>
              <Link
                to="/dashboard/files"
                className="w-full flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Icon name="upload" className="mr-3 h-4 w-4" />
                Upload Files
              </Link>
              <Link
                to="/dashboard/jobs/triggers"
                className="w-full flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Icon name="play" className="mr-3 h-4 w-4" />
                Trigger Indexing Job
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
